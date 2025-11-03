#!/usr/bin/env node

/**
 * すべての商品に成分ベースの参考文献を自動的に追加するスクリプト
 * 商品名から成分を推定し、対応する参考文献を割り当てます
 */

import { createClient } from "@sanity/client";
import pkg from '@next/env';
const { loadEnvConfig } = pkg;
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
loadEnvConfig(resolve(__dirname, '../apps/web'));

// Sanityクライアントの作成
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

/**
 * 成分別の参考文献データ
 */
const ingredientReferences = {
  // ビタミン系
  vitaminC: {
    keywords: ['ビタミンC', 'vitamin c', 'アスコルビン酸', 'ascorbic'],
    references: [
      {
        title: "Vitamin C and Immune Function",
        url: "https://pubmed.ncbi.nlm.nih.gov/29099763/",
        type: "scientific",
        description: "ビタミンCの免疫機能への影響に関する研究"
      },
      {
        title: "日本人の食事摂取基準（2020年版）ビタミンC",
        url: "https://www.mhlw.go.jp/content/10904750/000586553.pdf",
        type: "official",
        description: "厚生労働省による推奨摂取量の基準"
      }
    ],
    warnings: [
      {
        type: "dosage",
        message: "1日の上限摂取量（2,000mg）を超えないようにしてください",
        severity: "medium"
      },
      {
        type: "side_effect",
        message: "過剰摂取により下痢や腹痛が起こる可能性があります",
        severity: "low"
      }
    ]
  },

  vitaminD: {
    keywords: ['ビタミンD', 'vitamin d', 'カルシフェロール', 'cholecalciferol', 'D3'],
    references: [
      {
        title: "Vitamin D and bone health",
        url: "https://pubmed.ncbi.nlm.nih.gov/31667520/",
        type: "scientific",
        description: "ビタミンDと骨の健康に関する研究"
      },
      {
        title: "ビタミンDの免疫調節作用",
        url: "https://www.jstage.jst.go.jp/article/vso/89/11/89_1301/_article/-char/ja/",
        type: "scientific",
        description: "ビタミンDの免疫系への影響"
      }
    ],
    warnings: [
      {
        type: "dosage",
        message: "1日の上限摂取量（4,000IU / 100μg）を超えないようにしてください",
        severity: "high"
      },
      {
        type: "pregnancy",
        message: "妊娠中・授乳中の方は医師に相談してください",
        severity: "medium"
      }
    ]
  },

  vitaminB: {
    keywords: ['ビタミンB', 'vitamin b', 'B群', 'B12', 'B6', 'B1', 'B2', '葉酸', 'ナイアシン', 'ビオチン'],
    references: [
      {
        title: "B Vitamins and the Brain",
        url: "https://pubmed.ncbi.nlm.nih.gov/26828517/",
        type: "scientific",
        description: "ビタミンB群の脳機能への影響"
      },
      {
        title: "日本人の食事摂取基準（2020年版）ビタミンB群",
        url: "https://www.mhlw.go.jp/content/10904750/000586553.pdf",
        type: "official",
        description: "厚生労働省によるビタミンB群の推奨摂取量"
      }
    ],
    warnings: [
      {
        type: "general",
        message: "他のサプリメントと併用する際は総摂取量にご注意ください",
        severity: "low"
      }
    ]
  },

  // ミネラル系
  magnesium: {
    keywords: ['マグネシウム', 'magnesium', 'Mg', 'マグ'],
    references: [
      {
        title: "Magnesium in Prevention and Therapy",
        url: "https://pubmed.ncbi.nlm.nih.gov/26404370/",
        type: "scientific",
        description: "マグネシウムの予防医学的効果"
      },
      {
        title: "マグネシウムと生活習慣病",
        url: "https://www.jstage.jst.go.jp/article/jln/24/1/24_39/_article/-char/ja/",
        type: "scientific",
        description: "マグネシウムの健康への影響"
      }
    ],
    warnings: [
      {
        type: "side_effect",
        message: "過剰摂取により下痢を引き起こす可能性があります",
        severity: "low"
      },
      {
        type: "medical",
        message: "腎機能障害のある方は医師に相談してください",
        severity: "high"
      }
    ]
  },

  iron: {
    keywords: ['鉄', 'iron', 'Fe', '鉄分', 'フェリチン', 'ヘム鉄'],
    references: [
      {
        title: "Iron deficiency and anemia",
        url: "https://pubmed.ncbi.nlm.nih.gov/26773631/",
        type: "scientific",
        description: "鉄欠乏性貧血に関する研究"
      },
      {
        title: "鉄代謝と鉄欠乏性貧血",
        url: "https://www.jstage.jst.go.jp/article/naika/104/7/104_1275/_article/-char/ja/",
        type: "scientific",
        description: "鉄の代謝メカニズムと貧血"
      }
    ],
    warnings: [
      {
        type: "side_effect",
        message: "便秘や胃腸の不快感が生じる可能性があります",
        severity: "low"
      },
      {
        type: "medical",
        message: "鉄過剰症の方は摂取を避けてください",
        severity: "high"
      }
    ]
  },

  zinc: {
    keywords: ['亜鉛', 'zinc', 'Zn'],
    references: [
      {
        title: "Zinc in Human Health",
        url: "https://pubmed.ncbi.nlm.nih.gov/23914218/",
        type: "scientific",
        description: "亜鉛の健康への影響"
      },
      {
        title: "亜鉛の生理機能と亜鉛欠乏症",
        url: "https://www.jstage.jst.go.jp/article/jln/25/4/25_151/_article/-char/ja/",
        type: "scientific",
        description: "亜鉛の重要性と欠乏症"
      }
    ],
    warnings: [
      {
        type: "dosage",
        message: "1日の上限摂取量（40mg）を超えないようにしてください",
        severity: "medium"
      },
      {
        type: "interaction",
        message: "銅の吸収を妨げる可能性があります",
        severity: "low"
      }
    ]
  },

  calcium: {
    keywords: ['カルシウム', 'calcium', 'Ca'],
    references: [
      {
        title: "Calcium intake and bone health",
        url: "https://pubmed.ncbi.nlm.nih.gov/31221805/",
        type: "scientific",
        description: "カルシウムと骨の健康"
      }
    ],
    warnings: [
      {
        type: "dosage",
        message: "1日の上限摂取量（2,500mg）を超えないようにしてください",
        severity: "medium"
      }
    ]
  },

  // オメガ3系
  omega3: {
    keywords: ['DHA', 'EPA', 'オメガ3', 'omega-3', 'フィッシュオイル', '魚油'],
    references: [
      {
        title: "Omega-3 Fatty Acids and Cardiovascular Disease",
        url: "https://pubmed.ncbi.nlm.nih.gov/30415628/",
        type: "scientific",
        description: "オメガ3脂肪酸と心血管疾患"
      },
      {
        title: "DHA・EPAの機能性",
        url: "https://www.jstage.jst.go.jp/article/jln/26/2/26_113/_article/-char/ja/",
        type: "scientific",
        description: "DHAとEPAの健康機能"
      }
    ],
    warnings: [
      {
        type: "medical",
        message: "血液をサラサラにする薬を服用中の方は医師に相談してください",
        severity: "high"
      },
      {
        type: "allergy",
        message: "魚介類アレルギーの方はご注意ください",
        severity: "high"
      }
    ]
  },

  // その他の成分
  collagen: {
    keywords: ['コラーゲン', 'collagen'],
    references: [
      {
        title: "Collagen supplementation and skin health",
        url: "https://pubmed.ncbi.nlm.nih.gov/30681787/",
        type: "scientific",
        description: "コラーゲンと皮膚の健康"
      }
    ],
    warnings: [
      {
        type: "allergy",
        message: "原材料にアレルギーがある方はご注意ください",
        severity: "medium"
      }
    ]
  },

  glucosamine: {
    keywords: ['グルコサミン', 'glucosamine'],
    references: [
      {
        title: "Glucosamine and joint health",
        url: "https://pubmed.ncbi.nlm.nih.gov/29018060/",
        type: "scientific",
        description: "グルコサミンと関節の健康"
      }
    ],
    warnings: [
      {
        type: "allergy",
        message: "甲殻類アレルギーの方は原材料をご確認ください",
        severity: "high"
      }
    ]
  },

  probiotics: {
    keywords: ['乳酸菌', 'プロバイオティクス', 'ビフィズス菌', 'probiotics'],
    references: [
      {
        title: "Probiotics and gut health",
        url: "https://pubmed.ncbi.nlm.nih.gov/30844075/",
        type: "scientific",
        description: "プロバイオティクスと腸内環境"
      }
    ],
    warnings: [
      {
        type: "storage",
        message: "冷蔵保存が必要な場合があります",
        severity: "low"
      }
    ]
  },

  protein: {
    keywords: ['プロテイン', 'ホエイ', 'whey', 'タンパク質', 'protein'],
    references: [
      {
        title: "Protein supplementation and muscle mass",
        url: "https://pubmed.ncbi.nlm.nih.gov/29414855/",
        type: "scientific",
        description: "プロテイン補給と筋肉量"
      }
    ],
    warnings: [
      {
        type: "allergy",
        message: "乳製品アレルギーの方はご注意ください（ホエイプロテインの場合）",
        severity: "high"
      }
    ]
  },

  coq10: {
    keywords: ['コエンザイムQ10', 'CoQ10', 'ユビキノン'],
    references: [
      {
        title: "Coenzyme Q10 supplementation",
        url: "https://pubmed.ncbi.nlm.nih.gov/30371340/",
        type: "scientific",
        description: "コエンザイムQ10の効果"
      }
    ],
    warnings: [
      {
        type: "medical",
        message: "ワーファリンなどの抗凝固薬を服用中の方は医師に相談してください",
        severity: "high"
      }
    ]
  }
};

/**
 * 商品名から成分を推定し、適切な参考文献を返す
 */
function getReferencesForProduct(productName) {
  const name = productName.toLowerCase();
  const matchedIngredients = [];

  // 各成分のキーワードをチェック
  for (const [key, data] of Object.entries(ingredientReferences)) {
    for (const keyword of data.keywords) {
      if (name.includes(keyword.toLowerCase())) {
        matchedIngredients.push(key);
        break;
      }
    }
  }

  // マッチした成分がない場合は汎用的な参考文献を返す
  if (matchedIngredients.length === 0) {
    return {
      references: [
        {
          title: "日本人の食事摂取基準（2020年版）",
          url: "https://www.mhlw.go.jp/content/10904750/000586553.pdf",
          type: "official",
          description: "厚生労働省による栄養摂取基準"
        }
      ],
      warnings: [
        {
          type: "general",
          message: "体調に異常を感じた場合は使用を中止し、医師に相談してください",
          severity: "medium"
        }
      ]
    };
  }

  // マッチした成分の参考文献と警告を統合
  const allReferences = [];
  const allWarnings = [];
  const addedRefs = new Set();
  const addedWarns = new Set();

  for (const ingredientKey of matchedIngredients) {
    const data = ingredientReferences[ingredientKey];

    // 参考文献を追加（重複を避ける）
    for (const ref of data.references) {
      if (!addedRefs.has(ref.url)) {
        allReferences.push(ref);
        addedRefs.add(ref.url);
      }
    }

    // 警告を追加（重複を避ける）
    for (const warn of data.warnings) {
      const warnKey = `${warn.type}-${warn.message}`;
      if (!addedWarns.has(warnKey)) {
        allWarnings.push(warn);
        addedWarns.add(warnKey);
      }
    }
  }

  // 最大3つの参考文献、5つの警告に制限
  return {
    references: allReferences.slice(0, 3),
    warnings: allWarnings.slice(0, 5)
  };
}

/**
 * バッチ処理で商品を更新
 */
async function updateProductsBatch(products) {
  const results = {
    success: 0,
    skipped: 0,
    failed: 0
  };

  console.log(`\n📝 ${products.length}件の商品を処理中...\n`);

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    // プログレス表示
    if (i % 10 === 0) {
      console.log(`進捗: ${i}/${products.length} (${Math.round(i/products.length * 100)}%)`);
    }

    // 既に参考文献がある場合はスキップ
    if (product.references && product.references.length > 0) {
      results.skipped++;
      continue;
    }

    // 成分から参考文献を取得
    const data = getReferencesForProduct(product.name);

    try {
      await client
        .patch(product._id)
        .set({
          references: data.references,
          warnings: data.warnings,
          thirdPartyTested: false // デフォルトでfalse
        })
        .commit();

      results.success++;
    } catch (error) {
      console.error(`❌ エラー: ${product.name} - ${error.message}`);
      results.failed++;
    }

    // レート制限対策（100ms待機）
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * メイン処理
 */
async function main() {
  console.log("🚀 商品参考文献一括追加スクリプト開始");
  console.log("=" .repeat(60));

  try {
    // すべての商品を取得
    const query = `*[_type == "product"]{
      _id,
      name,
      references
    }`;

    const products = await client.fetch(query);
    console.log(`\n📊 商品総数: ${products.length}件`);

    // 参考文献がない商品をフィルタリング
    const productsWithoutRefs = products.filter(p => !p.references || p.references.length === 0);
    console.log(`❌ 参考文献なし: ${productsWithoutRefs.length}件`);

    if (productsWithoutRefs.length === 0) {
      console.log("\n✅ すべての商品に参考文献が登録済みです！");
      return;
    }

    // バッチ処理実行
    const results = await updateProductsBatch(productsWithoutRefs);

    // 結果表示
    console.log("\n" + "=" .repeat(60));
    console.log("📈 処理結果:");
    console.log(`  ✅ 成功: ${results.success}件`);
    console.log(`  ⏭️  スキップ: ${results.skipped}件`);
    console.log(`  ❌ 失敗: ${results.failed}件`);
    console.log(`  📊 合計: ${productsWithoutRefs.length}件`);

    // 成功率を計算
    const successRate = Math.round((results.success / productsWithoutRefs.length) * 100);
    console.log(`\n成功率: ${successRate}%`);

    if (results.success > 0) {
      console.log("\n✨ 商品の参考文献追加が完了しました！");
      console.log("   Sanityスタジオで確認してください。");
    }

  } catch (error) {
    console.error("\n❌ スクリプトエラー:", error.message);
    process.exit(1);
  }
}

// 実行
main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});