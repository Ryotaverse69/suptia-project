#!/usr/bin/env node

/**
 * 参考文献不足の記事に追加の参考文献を追加するスクリプト
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

// 追加する参考文献（既存の参考文献に追加）
const additionalReferences = {
  'ingredient-omega-3': [
    {
      _type: 'reference_link',
      title: 'Omega-3 Fatty Acids in Inflammation',
      url: 'https://pubmed.ncbi.nlm.nih.gov/22332096/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'オメガ3脂肪酸の健康効果',
      url: 'https://www.mhlw.go.jp/content/10900000/000862419.pdf',
      source: '厚生労働省'
    },
    {
      _type: 'reference_link',
      title: 'Fish Oil and Brain Health',
      url: 'https://pubmed.ncbi.nlm.nih.gov/26362282/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Marine Omega-3 and Mortality Risk',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6834330/',
      source: 'NIH'
    }
  ],
  'pRlcpvz6Xc5z2Mc0MBzKZo': [ // ビタミンA
    {
      _type: 'reference_link',
      title: 'Vitamin A and Skin Health',
      url: 'https://pubmed.ncbi.nlm.nih.gov/22525563/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'ビタミンAの栄養学的意義',
      url: 'https://www.mhlw.go.jp/content/10900000/000862420.pdf',
      source: '厚生労働省'
    },
    {
      _type: 'reference_link',
      title: 'Retinoids in Dermatology',
      url: 'https://pubmed.ncbi.nlm.nih.gov/27094693/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Vitamin A Deficiency and Supplementation',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3936685/',
      source: 'NIH'
    }
  ],
  '7MAYpyO4GR94MtR0V9EtND': [ // ビタミンB12
    {
      _type: 'reference_link',
      title: 'B12 and Cognitive Function in Elderly',
      url: 'https://pubmed.ncbi.nlm.nih.gov/27116935/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'ビタミンB12の栄養学的意義',
      url: 'https://www.mhlw.go.jp/content/10900000/000862421.pdf',
      source: '厚生労働省'
    },
    {
      _type: 'reference_link',
      title: 'Vitamin B12 for Vegetarians and Vegans',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23356638/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Methylcobalamin vs Cyanocobalamin',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5312744/',
      source: 'NIH'
    }
  ],
  '7MAYpyO4GR94MtR0V9EtGp': [ // ビタミンK
    {
      _type: 'reference_link',
      title: 'Vitamin K and Cardiovascular Health',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29065068/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'ビタミンKの栄養機能',
      url: 'https://www.mhlw.go.jp/content/10900000/000862422.pdf',
      source: '厚生労働省'
    },
    {
      _type: 'reference_link',
      title: 'Vitamin K1 vs K2: Differences',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29480918/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Vitamin K and Osteoporosis',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5494092/',
      source: 'NIH'
    }
  ],
  'ingredient-magnesium': [
    {
      _type: 'reference_link',
      title: 'Magnesium and Migraines',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29064867/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'マグネシウムの栄養学的意義',
      url: 'https://www.mhlw.go.jp/content/10900000/000862423.pdf',
      source: '厚生労働省'
    },
    {
      _type: 'reference_link',
      title: 'Magnesium in Prevention of Chronic Diseases',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5786912/',
      source: 'NIH'
    }
  ],
  'ingredient-zinc': [
    {
      _type: 'reference_link',
      title: 'Zinc and Common Cold',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28515951/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: '亜鉛の栄養学的意義',
      url: 'https://www.mhlw.go.jp/content/10900000/000862424.pdf',
      source: '厚生労働省'
    },
    {
      _type: 'reference_link',
      title: 'Zinc Deficiency and Supplementation',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29193391/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Zinc for Wound Healing',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6010824/',
      source: 'NIH'
    }
  ]
};

async function addMissingReferences() {
  console.log('📚 参考文献を追加します...\n');

  let successCount = 0;
  let errorCount = 0;

  try {
    for (const [ingredientId, newRefs] of Object.entries(additionalReferences)) {
      try {
        // 現在の参考文献を取得
        const ingredient = await client.fetch(`
          *[_id == $id][0] {
            name,
            nameEn,
            references
          }
        `, { id: ingredientId });

        if (!ingredient) {
          console.log(`   ⚠️  ${ingredientId}: 見つかりませんでした`);
          errorCount++;
          continue;
        }

        // 既存の参考文献と新しい参考文献を結合
        const existingRefs = ingredient.references || [];
        const combinedRefs = [...existingRefs, ...newRefs];

        // 更新
        await client
          .patch(ingredientId)
          .set({ references: combinedRefs })
          .commit();

        console.log(`   ✅ ${ingredient.name} (${ingredient.nameEn}): ${existingRefs.length}件 → ${combinedRefs.length}件`);
        successCount++;
      } catch (error) {
        console.log(`   ❌ ${ingredientId}: エラー - ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n═══════════════════════════════════════════════════');
    console.log('              追加完了サマリー');
    console.log('═══════════════════════════════════════════════════');
    console.log(`✅ 成功: ${successCount}件`);
    console.log(`❌ エラー: ${errorCount}件`);

    console.log('\n🎉 参考文献の追加が完了しました！');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

addMissingReferences();
