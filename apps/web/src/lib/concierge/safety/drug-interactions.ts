/**
 * 薬と成分の相互作用マッピング
 *
 * 出典: PMDA、Natural Medicines Comprehensive Database、Drugs.com
 * 最終更新: 2026-01-11
 *
 * 重要: AIはこのデータを基に情報を提供するが、結論は作らない
 */

import type { DrugIngredientInteraction, InteractionSeverity } from "./types";

export const DRUG_INGREDIENT_INTERACTIONS: DrugIngredientInteraction[] = [
  // ============================================
  // 抗凝固薬・抗血小板薬
  // ============================================
  {
    drugPattern: "ワーファリン|ワルファリン|warfarin",
    drugName: "ワーファリン（ワルファリン）",
    ingredients: [
      {
        slug: "vitamin-k",
        name: "ビタミンK",
        mechanism: "ワーファリンの効果を減弱させます",
        severity: "high",
        recommendation:
          "ビタミンK摂取量の急激な変化はワーファリンの効果に影響します。医師・薬剤師にご相談ください",
      },
      {
        slug: "fish-oil",
        name: "フィッシュオイル（EPA/DHA）",
        mechanism: "抗凝固作用を増強し、出血リスクを高める可能性があります",
        severity: "high",
        recommendation:
          "併用時は出血傾向に注意が必要です。医師にご相談ください",
      },
      {
        slug: "vitamin-e",
        name: "ビタミンE",
        mechanism: "抗凝固作用を増強する可能性があります",
        severity: "moderate",
        recommendation: "高用量の併用は避けることが推奨されます",
      },
      {
        slug: "ginkgo",
        name: "イチョウ葉",
        mechanism: "血小板凝集を抑制し、出血リスクを高める可能性があります",
        severity: "high",
        recommendation: "併用は推奨されません。医師にご相談ください",
      },
      {
        slug: "garlic",
        name: "ニンニク",
        mechanism: "抗血小板作用があり、出血リスクを高める可能性があります",
        severity: "moderate",
        recommendation: "高用量サプリメントとの併用には注意が必要です",
      },
      {
        slug: "coq10",
        name: "コエンザイムQ10",
        mechanism: "ワーファリンの効果を減弱させる可能性があります",
        severity: "moderate",
        recommendation: "INRモニタリングが推奨されます",
      },
    ],
  },
  {
    drugPattern: "バイアスピリン|アスピリン|aspirin",
    drugName: "アスピリン",
    ingredients: [
      {
        slug: "fish-oil",
        name: "フィッシュオイル",
        mechanism: "抗血小板作用の相加効果により出血リスクが増加します",
        severity: "moderate",
        recommendation: "出血傾向に注意してください",
      },
      {
        slug: "ginkgo",
        name: "イチョウ葉",
        mechanism: "出血リスクを高める可能性があります",
        severity: "moderate",
        recommendation: "併用には注意が必要です",
      },
    ],
  },

  // ============================================
  // 降圧薬
  // ============================================
  {
    drugPattern:
      "アムロジピン|ノルバスク|アダラート|ニフェジピン|カルシウム拮抗薬",
    drugName: "カルシウム拮抗薬",
    ingredients: [
      {
        slug: "grapefruit",
        name: "グレープフルーツ",
        mechanism: "CYP3A4阻害により薬物濃度が上昇する可能性があります",
        severity: "high",
        recommendation: "グレープフルーツ製品との併用は避けてください",
      },
      {
        slug: "st-johns-wort",
        name: "セントジョンズワート",
        mechanism: "CYP3A4誘導により薬物濃度が低下する可能性があります",
        severity: "high",
        recommendation: "併用は推奨されません",
      },
    ],
  },
  {
    drugPattern: "ACE阻害薬|エナラプリル|リシノプリル|カプトプリル",
    drugName: "ACE阻害薬",
    ingredients: [
      {
        slug: "potassium",
        name: "カリウム",
        mechanism: "高カリウム血症のリスクが増加します",
        severity: "high",
        recommendation:
          "カリウムサプリメントとの併用は医師の指導のもとで行ってください",
      },
    ],
  },
  {
    drugPattern: "ARB|サルタン|バルサルタン|ロサルタン|カンデサルタン",
    drugName: "ARB（アンジオテンシン受容体拮抗薬）",
    ingredients: [
      {
        slug: "potassium",
        name: "カリウム",
        mechanism: "高カリウム血症のリスクが増加します",
        severity: "high",
        recommendation: "カリウムサプリメントとの併用には注意が必要です",
      },
    ],
  },

  // ============================================
  // 糖尿病治療薬
  // ============================================
  {
    drugPattern: "インスリン|insulin",
    drugName: "インスリン",
    ingredients: [
      {
        slug: "chromium",
        name: "クロム",
        mechanism: "血糖降下作用を増強し、低血糖リスクが高まる可能性があります",
        severity: "moderate",
        recommendation: "血糖値のモニタリングを強化してください",
      },
      {
        slug: "alpha-lipoic-acid",
        name: "αリポ酸",
        mechanism: "血糖降下作用を増強する可能性があります",
        severity: "moderate",
        recommendation: "低血糖に注意してください",
      },
    ],
  },
  {
    drugPattern: "メトホルミン|メトグルコ|グルコファージ",
    drugName: "メトホルミン",
    ingredients: [
      {
        slug: "vitamin-b12",
        name: "ビタミンB12",
        mechanism:
          "メトホルミンはビタミンB12の吸収を低下させる可能性があります",
        severity: "low",
        recommendation: "長期服用時はビタミンB12の補充を検討してください",
      },
    ],
  },

  // ============================================
  // 精神神経系薬
  // ============================================
  {
    drugPattern: "SSRI|パロキセチン|セルトラリン|フルオキセチン|抗うつ薬",
    drugName: "SSRI（選択的セロトニン再取り込み阻害薬）",
    ingredients: [
      {
        slug: "st-johns-wort",
        name: "セントジョンズワート",
        mechanism:
          "セロトニン症候群のリスクがあります。重篤な副作用の可能性があります",
        severity: "high",
        recommendation: "併用は避けてください。医師にご相談ください",
      },
      {
        slug: "5-htp",
        name: "5-HTP",
        mechanism: "セロトニン症候群のリスクが高まります",
        severity: "high",
        recommendation: "併用は推奨されません",
      },
      {
        slug: "sam-e",
        name: "SAM-e",
        mechanism: "セロトニン作用が増強される可能性があります",
        severity: "moderate",
        recommendation: "医師にご相談ください",
      },
      {
        slug: "fish-oil",
        name: "フィッシュオイル",
        mechanism: "出血リスクが増加する可能性があります",
        severity: "low",
        recommendation: "高用量では注意が必要です",
      },
    ],
  },
  {
    drugPattern:
      "ベンゾジアゼピン|デパス|ソラナックス|レンドルミン|ハルシオン|睡眠薬",
    drugName: "ベンゾジアゼピン系薬",
    ingredients: [
      {
        slug: "valerian",
        name: "バレリアン",
        mechanism: "鎮静作用が増強される可能性があります",
        severity: "moderate",
        recommendation: "併用には注意が必要です。過度の眠気に注意してください",
      },
      {
        slug: "kava",
        name: "カバ",
        mechanism: "中枢神経抑制作用が増強される可能性があります",
        severity: "high",
        recommendation: "併用は推奨されません",
      },
      {
        slug: "melatonin",
        name: "メラトニン",
        mechanism: "鎮静作用が増強される可能性があります",
        severity: "low",
        recommendation: "過度の眠気に注意してください",
      },
    ],
  },

  // ============================================
  // 甲状腺薬
  // ============================================
  {
    drugPattern: "チラーヂン|レボチロキシン|甲状腺ホルモン",
    drugName: "レボチロキシン（甲状腺ホルモン）",
    ingredients: [
      {
        slug: "calcium",
        name: "カルシウム",
        mechanism: "レボチロキシンの吸収を低下させます",
        severity: "moderate",
        recommendation: "4時間以上間隔をあけて服用してください",
      },
      {
        slug: "iron",
        name: "鉄",
        mechanism: "レボチロキシンの吸収を低下させます",
        severity: "moderate",
        recommendation: "4時間以上間隔をあけて服用してください",
      },
      {
        slug: "soy",
        name: "大豆イソフラボン",
        mechanism: "レボチロキシンの吸収に影響する可能性があります",
        severity: "low",
        recommendation: "服用時間をずらすことを検討してください",
      },
    ],
  },

  // ============================================
  // 免疫抑制剤
  // ============================================
  {
    drugPattern: "シクロスポリン|ネオーラル|免疫抑制剤",
    drugName: "シクロスポリン",
    ingredients: [
      {
        slug: "st-johns-wort",
        name: "セントジョンズワート",
        mechanism: "薬物濃度を低下させ、臓器拒絶反応のリスクがあります",
        severity: "high",
        recommendation: "併用は禁忌です",
      },
      {
        slug: "grapefruit",
        name: "グレープフルーツ",
        mechanism: "薬物濃度を上昇させる可能性があります",
        severity: "high",
        recommendation: "グレープフルーツ製品は避けてください",
      },
    ],
  },

  // ============================================
  // 脂質異常症治療薬
  // ============================================
  {
    drugPattern:
      "スタチン|アトルバスタチン|ロスバスタチン|クレストール|リピトール",
    drugName: "スタチン系薬",
    ingredients: [
      {
        slug: "coq10",
        name: "コエンザイムQ10",
        mechanism:
          "スタチンはCoQ10の産生を低下させます。補充が有益な場合があります",
        severity: "low",
        recommendation: "CoQ10の補充は筋肉症状の軽減に役立つ可能性があります",
      },
      {
        slug: "red-yeast-rice",
        name: "紅麹（ベニコウジ）",
        mechanism:
          "天然のスタチン（モナコリンK）を含み、効果が重複・増強される可能性があります",
        severity: "high",
        recommendation: "併用は推奨されません。医師にご相談ください",
      },
      {
        slug: "grapefruit",
        name: "グレープフルーツ",
        mechanism: "一部のスタチンの血中濃度を上昇させる可能性があります",
        severity: "moderate",
        recommendation: "大量摂取は避けてください",
      },
      {
        slug: "niacin",
        name: "ナイアシン",
        mechanism: "筋障害（横紋筋融解症）のリスクが増加する可能性があります",
        severity: "moderate",
        recommendation: "高用量の併用には注意が必要です",
      },
    ],
  },
];

/**
 * 服用中の薬から相互作用のある成分を取得
 */
export function getBlockedIngredientsForMedications(
  medications: string[],
): Array<{
  ingredientSlug: string;
  ingredientName: string;
  drugName: string;
  mechanism: string;
  severity: InteractionSeverity;
  recommendation: string;
}> {
  const blocked: Array<{
    ingredientSlug: string;
    ingredientName: string;
    drugName: string;
    mechanism: string;
    severity: InteractionSeverity;
    recommendation: string;
  }> = [];

  for (const medication of medications) {
    for (const interaction of DRUG_INGREDIENT_INTERACTIONS) {
      const pattern = new RegExp(interaction.drugPattern, "i");
      if (pattern.test(medication)) {
        for (const ingredient of interaction.ingredients) {
          blocked.push({
            ingredientSlug: ingredient.slug,
            ingredientName: ingredient.name,
            drugName: interaction.drugName,
            mechanism: ingredient.mechanism,
            severity: ingredient.severity,
            recommendation: ingredient.recommendation,
          });
        }
      }
    }
  }

  // 重複を除去（同じ成分が複数の薬で警告される場合、最も高い危険度を保持）
  const uniqueBlocked = blocked.reduce(
    (acc, current) => {
      const existing = acc.find(
        (item) => item.ingredientSlug === current.ingredientSlug,
      );
      if (!existing) {
        acc.push(current);
      } else if (
        getSeverityLevel(current.severity) > getSeverityLevel(existing.severity)
      ) {
        const index = acc.indexOf(existing);
        acc[index] = current;
      }
      return acc;
    },
    [] as typeof blocked,
  );

  return uniqueBlocked;
}

function getSeverityLevel(severity: InteractionSeverity): number {
  switch (severity) {
    case "high":
      return 3;
    case "moderate":
      return 2;
    case "low":
      return 1;
    case "theoretical":
      return 0;
    default:
      return 0;
  }
}
