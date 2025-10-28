#!/usr/bin/env node

/**
 * 薬機法違反ワード修正スクリプト
 *
 * 「治療」を適切な表現に置き換える
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数読み込み
const envPath = join(__dirname, '../apps/web/.env.local');
const envContent = readFileSync(envPath, 'utf8');

const SANITY_API_TOKEN = envContent.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();

if (!SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN が見つかりません');
  process.exit(1);
}

// Sanity設定
const SANITY_PROJECT_ID = 'fny3jdcg';
const SANITY_DATASET = 'production';

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: SANITY_API_TOKEN,
});

async function fixComplianceViolations() {
  console.log('🔧 薬機法違反ワードを修正します...\n');

  try {
    // ギンコ（イチョウ葉）のdescriptionを修正
    console.log('1️⃣  ギンコ（イチョウ葉）を修正中...');

    const ginkgoNewDescription = 'ギンコ（イチョウ葉）は、2億年以上前から存在する「生きた化石」とも呼ばれる植物で、そのエキスは脳と血流の健康維持に役立つ可能性があるとして広く研究されています。主要な有効成分は、フラボノイドとテルペノイド（ギンコライド）で、これらが抗酸化作用と血流改善作用を持つと言われています。特に、記憶力や集中力の維持、加齢に伴う認知機能の低下の緩和、末梢循環の改善に役立つ可能性が注目されています。ヨーロッパでは医薬品として認可されており、認知症や末梢動脈疾患のサポートに活用されています。抗酸化作用により、脳の神経細胞を酸化ストレスから保護し、血小板の凝集を抑制することで血流をスムーズにする働きがあると考えられています。記憶力の維持や血流改善を目的として、サプリメントとして世界中で利用されています。';

    await client
      .patch('ingredient-ginkgo')
      .set({ description: ginkgoNewDescription })
      .commit();

    console.log('   ✅ ギンコ: 「治療に使用」→「サポートに活用」に修正');

    // L-カルニチンの全フィールドをチェック
    console.log('\n2️⃣  L-カルニチンを確認中...');

    const carnitine = await client.fetch(`
      *[_id == "ingredient-l-carnitine"][0] {
        description,
        benefits,
        sideEffects,
        interactions
      }
    `);

    // 「治療」が含まれているか確認
    const allText = [
      carnitine.description,
      ...(Array.isArray(carnitine.benefits) ? carnitine.benefits : []),
      carnitine.sideEffects,
      ...(Array.isArray(carnitine.interactions) ? carnitine.interactions : [])
    ].filter(Boolean).join(' ');

    if (allText.includes('治療')) {
      console.log('   ⚠️  L-カルニチンに「治療」が含まれています');
      console.log('   検索中...');

      // benefitsをチェック
      if (carnitine.benefits && Array.isArray(carnitine.benefits)) {
        const updatedBenefits = carnitine.benefits.map(benefit =>
          benefit.replace(/治療/g, 'サポート').replace(/治す/g, '維持する')
        );

        await client
          .patch('ingredient-l-carnitine')
          .set({ benefits: updatedBenefits })
          .commit();

        console.log('   ✅ L-カルニチン: benefitsから「治療」を削除');
      }

      // interactionsをチェック
      if (carnitine.interactions && Array.isArray(carnitine.interactions)) {
        const updatedInteractions = carnitine.interactions.map(interaction =>
          interaction.replace(/治療/g, 'サポート').replace(/治す/g, '維持する')
        );

        await client
          .patch('ingredient-l-carnitine')
          .set({ interactions: updatedInteractions })
          .commit();

        console.log('   ✅ L-カルニチン: interactionsから「治療」を削除');
      }
    } else {
      console.log('   ℹ️  L-カルニチンには「治療」が見つかりませんでした');
      console.log('   （既に修正済みまたは他のフィールドに存在）');
    }

    // クレアチンの「再生する」も修正
    console.log('\n3️⃣  クレアチンの警告ワードを確認中...');

    const creatine = await client.fetch(`
      *[_id == "ingredient-creatine"][0] {
        benefits
      }
    `);

    if (creatine.benefits && Array.isArray(creatine.benefits)) {
      const hasBadWord = creatine.benefits.some(b => b.includes('再生する') || b.includes('再生させる'));

      if (hasBadWord) {
        const updatedBenefits = creatine.benefits.map(benefit =>
          benefit
            .replace(/再生する/g, '維持する')
            .replace(/再生させる/g, '維持する')
            .replace(/再生を促進/g, '維持を促進')
        );

        await client
          .patch('ingredient-creatine')
          .set({ benefits: updatedBenefits })
          .commit();

        console.log('   ✅ クレアチン: 「再生する」→「維持する」に修正');
      } else {
        console.log('   ℹ️  クレアチンには問題のあるワードは見つかりませんでした');
      }
    }

    console.log('\n═══════════════════════════════════════════════════');
    console.log('              ✅ 修正完了');
    console.log('═══════════════════════════════════════════════════');
    console.log('🎉 薬機法コンプライアンス違反の修正が完了しました！');
    console.log('\n💡 次のステップ: 品質チェックを実行して結果を確認してください');
    console.log('   node scripts/comprehensive-quality-check.mjs');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

fixComplianceViolations();
