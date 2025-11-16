#!/usr/bin/env node

/**
 * RDA（推奨摂取量）とUL（耐容上限量）データ一括追加スクリプト
 *
 * 厚生労働省「日本人の食事摂取基準（2020年版）」に基づき、
 * 成分マスタにRDAとULデータを追加します。
 *
 * 参考:
 * https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../apps/web/.env.local") });

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fny3jdcg";
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;

if (!SANITY_API_TOKEN) {
  console.error("❌ エラー: SANITY_API_TOKEN環境変数が設定されていません");
  process.exit(1);
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

/**
 * 厚生労働省「日本人の食事摂取基準（2020年版）」に基づくRDA・ULデータベース
 *
 * 値はmg単位で統一（一部μgをmgに変換）
 * 18-29歳の成人を基準とし、性別ごとに設定
 */
const rdaUlDatabase = {
  // ビタミンC
  'ビタミンC（アスコルビン酸）': {
    rdaMale: 100, // mg/日
    rdaFemale: 100,
    rdaPregnant: 110,
    rdaLactating: 145,
    upperLimit: null, // 上限なし（水溶性ビタミン）
  },

  // ビタミンD
  'ビタミンD': {
    rdaMale: 0.0085, // 8.5μg = 0.0085mg/日
    rdaFemale: 0.0085,
    rdaPregnant: 0.0085,
    rdaLactating: 0.0085,
    upperLimit: 0.1, // 100μg = 0.1mg/日
  },

  // ビタミンE
  'ビタミンE': {
    rdaMale: 6.0, // mg/日 (α-トコフェロール)
    rdaFemale: 5.0,
    rdaPregnant: 6.0,
    rdaLactating: 7.0,
    upperLimit: 800, // mg/日 (α-トコフェロール)
  },

  // ビタミンA
  'ビタミンA（レチノール）': {
    rdaMale: 0.85, // 850μgRAE = 0.85mg/日
    rdaFemale: 0.65, // 650μgRAE
    rdaPregnant: 0.73, // 730μgRAE（付加量+80μg）
    rdaLactating: 1.10, // 1100μgRAE（付加量+450μg）
    upperLimit: 2.7, // 2700μgRAE
  },

  // ビタミンK
  'ビタミンK': {
    rdaMale: 0.15, // 150μg = 0.15mg/日
    rdaFemale: 0.15,
    rdaPregnant: 0.15,
    rdaLactating: 0.15,
    upperLimit: null, // 上限設定なし
  },

  // ビタミンB1（チアミン）
  'ビタミンB1（チアミン）': {
    rdaMale: 1.4, // mg/日
    rdaFemale: 1.1,
    rdaPregnant: 1.3,
    rdaLactating: 1.3,
    upperLimit: null, // 上限設定なし
  },

  // ビタミンB2（リボフラビン）
  'ビタミンB2（リボフラビン）': {
    rdaMale: 1.6, // mg/日
    rdaFemale: 1.2,
    rdaPregnant: 1.5,
    rdaLactating: 1.7,
    upperLimit: null,
  },

  // ナイアシン
  'ナイアシン（ビタミンB3）': {
    rdaMale: 15, // mgNE/日
    rdaFemale: 11,
    rdaPregnant: 11,
    rdaLactating: 12,
    upperLimit: 300, // mgNE/日（ニコチン酸として）
  },

  // ビタミンB6
  'ビタミンB6': {
    rdaMale: 1.4, // mg/日
    rdaFemale: 1.1,
    rdaPregnant: 1.4,
    rdaLactating: 1.5,
    upperLimit: 40, // mg/日
  },

  // ビタミンB12
  'ビタミンB12': {
    rdaMale: 0.0024, // 2.4μg = 0.0024mg/日
    rdaFemale: 0.0024,
    rdaPregnant: 0.0028, // 2.8μg
    rdaLactating: 0.0032, // 3.2μg
    upperLimit: null,
  },

  // 葉酸
  '葉酸': {
    rdaMale: 0.24, // 240μg = 0.24mg/日
    rdaFemale: 0.24,
    rdaPregnant: 0.48, // 480μg（付加量+240μg）
    rdaLactating: 0.34, // 340μg（付加量+100μg）
    upperLimit: 1.0, // 1000μg = 1mg/日（サプリメント）
  },

  // パントテン酸
  'パントテン酸（ビタミンB5）': {
    rdaMale: 5, // mg/日
    rdaFemale: 4,
    rdaPregnant: 4,
    rdaLactating: 5,
    upperLimit: null,
  },

  // ビオチン
  'ビオチン': {
    rdaMale: 0.05, // 50μg = 0.05mg/日
    rdaFemale: 0.05,
    rdaPregnant: 0.05,
    rdaLactating: 0.05,
    upperLimit: null,
  },

  // カルシウム
  'カルシウム': {
    rdaMale: 750, // mg/日
    rdaFemale: 650,
    rdaPregnant: 650,
    rdaLactating: 650,
    upperLimit: 2500, // mg/日
  },

  // マグネシウム
  'マグネシウム': {
    rdaMale: 340, // mg/日
    rdaFemale: 270,
    rdaPregnant: 310, // 付加量+40mg
    rdaLactating: 270,
    upperLimit: 350, // mg/日（サプリメント・医薬品由来）
  },

  // 鉄
  '鉄分': {
    rdaMale: 7.5, // mg/日
    rdaFemale: 10.5, // mg/日（月経あり）
    rdaPregnant: 9.0, // 初期・中期
    rdaLactating: 9.0,
    upperLimit: 40, // mg/日
  },

  // 亜鉛
  '亜鉛': {
    rdaMale: 11, // mg/日
    rdaFemale: 8,
    rdaPregnant: 10, // 付加量+2mg
    rdaLactating: 12, // 付加量+4mg
    upperLimit: 40, // mg/日
  },

  // 銅
  '銅': {
    rdaMale: 0.9, // mg/日
    rdaFemale: 0.7,
    rdaPregnant: 0.8,
    rdaLactating: 1.2,
    upperLimit: 7, // mg/日
  },

  // セレン
  'セレン': {
    rdaMale: 0.03, // 30μg = 0.03mg/日
    rdaFemale: 0.025, // 25μg
    rdaPregnant: 0.028, // 28μg
    rdaLactating: 0.038, // 38μg
    upperLimit: 0.35, // 350μg = 0.35mg/日
  },

  // ヨウ素
  'ヨウ素': {
    rdaMale: 0.13, // 130μg = 0.13mg/日
    rdaFemale: 0.13,
    rdaPregnant: 0.24, // 240μg（付加量+110μg）
    rdaLactating: 0.27, // 270μg（付加量+140μg）
    upperLimit: 3.0, // 3000μg = 3mg/日
  },

  // クロム
  'クロム': {
    rdaMale: 0.01, // 10μg = 0.01mg/日
    rdaFemale: 0.01,
    rdaPregnant: 0.01,
    rdaLactating: 0.01,
    upperLimit: 0.5, // 500μg = 0.5mg/日
  },

  // モリブデン
  'モリブデン': {
    rdaMale: 0.03, // 30μg = 0.03mg/日
    rdaFemale: 0.025, // 25μg
    rdaPregnant: 0.025,
    rdaLactating: 0.025,
    upperLimit: 0.55, // 550μg = 0.55mg/日
  },

  // マンガン
  'マンガン': {
    rdaMale: 4.0, // mg/日
    rdaFemale: 3.5,
    rdaPregnant: 3.5,
    rdaLactating: 3.5,
    upperLimit: 11, // mg/日
  },
};

async function addRdaUlData() {
  console.log('🔍 RDA・ULデータを追加中...\n');

  try {
    // 全成分を取得
    const ingredients = await client.fetch(
      `*[_type == "ingredient"]{
        _id,
        name,
        nameEn
      }`
    );

    console.log(`📊 全${ingredients.length}件の成分を確認\n`);

    const updates = [];

    for (const ingredient of ingredients) {
      const rdaUlData = rdaUlDatabase[ingredient.name];

      if (rdaUlData) {
        updates.push({
          _id: ingredient._id,
          name: ingredient.name,
          data: rdaUlData,
        });
      }
    }

    console.log(`📊 更新対象: ${updates.length}件\n`);

    if (updates.length === 0) {
      console.log("✅ RDA・ULデータを追加できる成分はありませんでした\n");
      return;
    }

    // 確認プロンプト
    if (process.argv.includes('--execute')) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💾 更新を実行中...');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      for (const update of updates) {
        await client.patch(update._id)
          .set(update.data)
          .commit();

        console.log(`✅ ${update.name}`);
        console.log(`   RDA（男性）: ${update.data.rdaMale}mg`);
        console.log(`   RDA（女性）: ${update.data.rdaFemale}mg`);
        console.log(`   UL: ${update.data.upperLimit ? update.data.upperLimit + 'mg' : '設定なし'}\n`);
      }

      console.log(`\n✅ ${updates.length}件の成分を更新しました\n`);
    } else {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📝 更新プレビュー');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      updates.forEach((update, index) => {
        console.log(`${index + 1}. ${update.name}`);
        console.log(`   RDA（男性）: ${update.data.rdaMale}mg`);
        console.log(`   RDA（女性）: ${update.data.rdaFemale}mg`);
        console.log(`   RDA（妊婦）: ${update.data.rdaPregnant}mg`);
        console.log(`   RDA（授乳婦）: ${update.data.rdaLactating}mg`);
        console.log(`   UL: ${update.data.upperLimit ? update.data.upperLimit + 'mg' : '設定なし'}\n`);
      });

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💡 実行方法');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('  上記の更新を実行する場合は、以下のコマンドを実行してください:');
      console.log('  node scripts/add-rda-ul-data.mjs --execute\n');
    }

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

addRdaUlData()
  .then(() => {
    console.log('✅ 処理完了\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  });
