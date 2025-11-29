#!/usr/bin/env node

/**
 * tierRank分布と原因分析スクリプト
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../apps/web/.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fny3jdcg',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function analyze() {
  console.log('🔍 tierRank分布を分析中...\n');

  // 全商品を取得
  const products = await client.fetch(`
    *[_type == "product" && availability == "in-stock"] | order(name asc) {
      _id,
      name,
      priceJPY,
      tierRatings,
      ingredients[] {
        amountMgPerServing,
        isPrimary,
        ingredient-> {
          _id,
          name,
          evidenceLevel
        }
      }
    }
  `);

  console.log(`総商品数: ${products.length}件\n`);

  // tierRatings の有無を確認
  const withTierRatings = products.filter(p => p.tierRatings);
  const withoutTierRatings = products.filter(p => !p.tierRatings);

  console.log(`tierRatings設定済み: ${withTierRatings.length}件`);
  console.log(`tierRatings未設定: ${withoutTierRatings.length}件\n`);

  // 総合ランク分布
  const overallRankDist = { 'S+': 0, S: 0, A: 0, B: 0, C: 0, D: 0, null: 0 };
  const priceRankDist = { S: 0, A: 0, B: 0, C: 0, D: 0, null: 0 };
  const costEffRankDist = { S: 0, A: 0, B: 0, C: 0, D: 0, null: 0 };
  const contentRankDist = { S: 0, A: 0, B: 0, C: 0, D: 0, null: 0 };
  const evidenceRankDist = { S: 0, A: 0, B: 0, C: 0, D: 0, null: 0 };
  const safetyRankDist = { S: 0, A: 0, B: 0, C: 0, D: 0, null: 0 };

  // Dランク商品のリスト
  const dRankProducts = [];

  for (const p of products) {
    const tr = p.tierRatings;
    if (tr) {
      overallRankDist[tr.overallRank || 'null']++;
      priceRankDist[tr.priceRank || 'null']++;
      costEffRankDist[tr.costEffectivenessRank || 'null']++;
      contentRankDist[tr.contentRank || 'null']++;
      evidenceRankDist[tr.evidenceRank || 'null']++;
      safetyRankDist[tr.safetyRank || 'null']++;

      if (tr.overallRank === 'D') {
        dRankProducts.push({
          name: p.name,
          tierRatings: tr,
          price: p.priceJPY,
          ingredients: p.ingredients
        });
      }
    } else {
      overallRankDist['null']++;
    }
  }

  console.log('=== 総合ランク（overallRank）分布 ===');
  console.log(`S+: ${overallRankDist['S+']}件`);
  console.log(`S:  ${overallRankDist['S']}件`);
  console.log(`A:  ${overallRankDist['A']}件`);
  console.log(`B:  ${overallRankDist['B']}件`);
  console.log(`C:  ${overallRankDist['C']}件`);
  console.log(`D:  ${overallRankDist['D']}件`);
  console.log(`未設定: ${overallRankDist['null']}件\n`);

  console.log('=== 各軸のランク分布 ===');
  console.log('\n価格ランク:');
  console.log(`  S: ${priceRankDist.S}, A: ${priceRankDist.A}, B: ${priceRankDist.B}, C: ${priceRankDist.C}, D: ${priceRankDist.D}`);

  console.log('\nコスパランク:');
  console.log(`  S: ${costEffRankDist.S}, A: ${costEffRankDist.A}, B: ${costEffRankDist.B}, C: ${costEffRankDist.C}, D: ${costEffRankDist.D}`);

  console.log('\n含有量ランク:');
  console.log(`  S: ${contentRankDist.S}, A: ${contentRankDist.A}, B: ${contentRankDist.B}, C: ${contentRankDist.C}, D: ${contentRankDist.D}`);

  console.log('\nエビデンスランク:');
  console.log(`  S: ${evidenceRankDist.S}, A: ${evidenceRankDist.A}, B: ${evidenceRankDist.B}, C: ${evidenceRankDist.C}, D: ${evidenceRankDist.D}`);

  console.log('\n安全性ランク:');
  console.log(`  S: ${safetyRankDist.S}, A: ${safetyRankDist.A}, B: ${safetyRankDist.B}, C: ${safetyRankDist.C}, D: ${safetyRankDist.D}`);

  // Dランク商品の詳細分析
  if (dRankProducts.length > 0) {
    console.log('\n=== Dランク商品の詳細分析 ===');
    console.log(`Dランク商品数: ${dRankProducts.length}件\n`);

    // Dランクの原因を分析
    const dReasons = {
      safetyD: 0,
      evidenceD: 0,
      lowWeightedScore: 0,
      noIngredients: 0,
      other: 0
    };

    console.log('Dランクの原因内訳:');
    for (const p of dRankProducts.slice(0, 20)) {
      const tr = p.tierRatings;
      let reason = '';

      if (tr.safetyRank === 'D') {
        dReasons.safetyD++;
        reason = '安全性D';
      } else if (tr.evidenceRank === 'D') {
        dReasons.evidenceD++;
        reason = 'エビデンスD';
      } else if (!p.ingredients || p.ingredients.length === 0) {
        dReasons.noIngredients++;
        reason = '成分データなし';
      } else {
        dReasons.lowWeightedScore++;
        reason = '加重平均スコア低';
      }

      console.log(`\n📦 ${p.name.substring(0, 50)}...`);
      console.log(`   価格: ¥${p.price?.toLocaleString() || '不明'}`);
      console.log(`   ランク: 💰${tr.priceRank} 💡${tr.costEffectivenessRank} 📊${tr.contentRank} 🔬${tr.evidenceRank} 🛡️${tr.safetyRank} ⭐${tr.overallRank}`);
      console.log(`   原因: ${reason}`);

      // 成分のエビデンスレベルを確認
      if (p.ingredients && p.ingredients.length > 0) {
        const evidenceLevels = p.ingredients
          .filter(i => i.ingredient)
          .map(i => `${i.ingredient.name}(${i.ingredient.evidenceLevel || '?'})`);
        console.log(`   成分エビデンス: ${evidenceLevels.slice(0, 5).join(', ')}`);
      }
    }

    console.log('\n\nDランク原因サマリー:');
    console.log(`  安全性がD: ${dReasons.safetyD}件`);
    console.log(`  エビデンスがD: ${dReasons.evidenceD}件`);
    console.log(`  加重平均スコア低: ${dReasons.lowWeightedScore}件`);
    console.log(`  成分データなし: ${dReasons.noIngredients}件`);
  }

  // エビデンスレベルの分布を確認
  console.log('\n=== 成分マスタのエビデンスレベル分布 ===');
  const ingredients = await client.fetch(`
    *[_type == "ingredient"] {
      name,
      evidenceLevel
    }
  `);

  const evLevelDist = { S: 0, A: 0, B: 0, C: 0, D: 0, null: 0 };
  for (const ing of ingredients) {
    evLevelDist[ing.evidenceLevel || 'null']++;
  }

  console.log(`S: ${evLevelDist.S}件`);
  console.log(`A: ${evLevelDist.A}件`);
  console.log(`B: ${evLevelDist.B}件`);
  console.log(`C: ${evLevelDist.C}件`);
  console.log(`D: ${evLevelDist.D}件`);
  console.log(`未設定: ${evLevelDist.null}件`);

  // エビデンスレベルが低い成分
  const lowEvidenceIngs = ingredients.filter(i => i.evidenceLevel === 'C' || i.evidenceLevel === 'D' || !i.evidenceLevel);
  if (lowEvidenceIngs.length > 0) {
    console.log('\nエビデンスレベルが低い/未設定の成分:');
    lowEvidenceIngs.forEach(i => {
      console.log(`  - ${i.name}: ${i.evidenceLevel || '未設定'}`);
    });
  }
}

analyze()
  .then(() => {
    console.log('\n✅ 分析完了');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ エラー:', error);
    process.exit(1);
  });
