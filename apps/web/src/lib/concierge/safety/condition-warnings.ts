/**
 * 既往歴と避けるべき成分のマッピング
 *
 * 出典: PMDA、Natural Medicines Comprehensive Database、NIH ODS
 * 最終更新: 2026-01-11
 *
 * 重要: AIはこのデータを基に情報を提供するが、結論は作らない
 */

import type { ConditionIngredientWarning, InteractionSeverity } from "./types";

export const CONDITION_INGREDIENT_WARNINGS: ConditionIngredientWarning[] = [
  // ============================================
  // 循環器系
  // ============================================
  {
    conditionValue: "hypertension",
    conditionLabel: "高血圧",
    ingredients: [
      {
        slug: "licorice",
        name: "甘草（リコリス）",
        reason:
          "偽アルドステロン症を引き起こし、血圧を上昇させる可能性があります",
        severity: "high",
      },
      {
        slug: "ephedra",
        name: "エフェドラ（麻黄）",
        reason: "交感神経刺激作用により血圧を上昇させる可能性があります",
        severity: "high",
      },
      {
        slug: "ginseng",
        name: "高麗人参",
        reason: "一部の研究で血圧上昇との関連が報告されています",
        severity: "moderate",
      },
      {
        slug: "caffeine",
        name: "カフェイン",
        reason: "一時的に血圧を上昇させる可能性があります",
        severity: "low",
      },
    ],
  },
  {
    conditionValue: "hypotension",
    conditionLabel: "低血圧",
    ingredients: [
      {
        slug: "coq10",
        name: "コエンザイムQ10",
        reason:
          "血圧を低下させる作用があり、低血圧を悪化させる可能性があります",
        severity: "moderate",
      },
      {
        slug: "garlic",
        name: "ニンニク",
        reason: "血圧降下作用があり、低血圧を悪化させる可能性があります",
        severity: "moderate",
      },
    ],
  },
  {
    conditionValue: "heart-disease",
    conditionLabel: "心臓疾患",
    ingredients: [
      {
        slug: "ephedra",
        name: "エフェドラ（麻黄）",
        reason: "心拍数増加、不整脈のリスクがあります",
        severity: "high",
      },
      {
        slug: "bitter-orange",
        name: "ビターオレンジ",
        reason: "心血管系への刺激作用があります",
        severity: "high",
      },
      {
        slug: "caffeine",
        name: "カフェイン",
        reason: "心拍数を増加させる可能性があります",
        severity: "moderate",
      },
    ],
  },
  {
    conditionValue: "blood-clotting",
    conditionLabel: "血液凝固障害",
    ingredients: [
      {
        slug: "fish-oil",
        name: "フィッシュオイル（EPA/DHA）",
        reason: "血液凝固を抑制し、出血リスクを高める可能性があります",
        severity: "high",
      },
      {
        slug: "vitamin-e",
        name: "ビタミンE",
        reason: "高用量で血液凝固を抑制する可能性があります",
        severity: "moderate",
      },
      {
        slug: "ginkgo",
        name: "イチョウ葉",
        reason: "血液凝固を抑制し、出血リスクを高める可能性があります",
        severity: "high",
      },
      {
        slug: "garlic",
        name: "ニンニク",
        reason: "血液凝固を抑制する可能性があります",
        severity: "moderate",
      },
      {
        slug: "vitamin-k",
        name: "ビタミンK",
        reason: "血液凝固因子に影響を与える可能性があります",
        severity: "moderate",
      },
    ],
  },

  // ============================================
  // 代謝系
  // ============================================
  {
    conditionValue: "diabetes",
    conditionLabel: "糖尿病",
    ingredients: [
      {
        slug: "chromium",
        name: "クロム",
        reason: "血糖値に影響を与える可能性があります",
        severity: "moderate",
      },
      {
        slug: "alpha-lipoic-acid",
        name: "αリポ酸",
        reason: "血糖値を低下させる可能性があり、低血糖リスクがあります",
        severity: "moderate",
      },
      {
        slug: "cinnamon",
        name: "シナモン",
        reason: "血糖値に影響を与える可能性があります",
        severity: "low",
      },
    ],
  },
  {
    conditionValue: "gout",
    conditionLabel: "痛風",
    ingredients: [
      {
        slug: "niacin",
        name: "ナイアシン（ビタミンB3）",
        reason: "尿酸値を上昇させ、痛風発作を誘発する可能性があります",
        severity: "high",
      },
    ],
  },
  {
    conditionValue: "thyroid-disorder",
    conditionLabel: "甲状腺疾患",
    ingredients: [
      {
        slug: "iodine",
        name: "ヨウ素",
        reason: "甲状腺機能に直接影響を与えます",
        severity: "high",
      },
      {
        slug: "kelp",
        name: "ケルプ（海藻）",
        reason: "高濃度のヨウ素を含み、甲状腺機能に影響します",
        severity: "high",
      },
      {
        slug: "selenium",
        name: "セレン",
        reason: "甲状腺ホルモン代謝に関与します",
        severity: "moderate",
      },
    ],
  },

  // ============================================
  // 内臓系
  // ============================================
  {
    conditionValue: "liver-disease",
    conditionLabel: "肝臓疾患",
    ingredients: [
      {
        slug: "vitamin-a",
        name: "ビタミンA",
        reason: "肝臓で代謝され、過剰摂取は肝毒性のリスクがあります",
        severity: "high",
      },
      {
        slug: "iron",
        name: "鉄",
        reason: "肝臓に蓄積し、肝障害を悪化させる可能性があります",
        severity: "high",
      },
      {
        slug: "niacin",
        name: "ナイアシン",
        reason: "高用量で肝毒性のリスクがあります",
        severity: "moderate",
      },
      {
        slug: "kava",
        name: "カバ",
        reason: "肝毒性との関連が報告されています",
        severity: "high",
      },
    ],
  },
  {
    conditionValue: "kidney-disease",
    conditionLabel: "腎臓疾患",
    ingredients: [
      {
        slug: "potassium",
        name: "カリウム",
        reason: "腎機能低下時に高カリウム血症のリスクがあります",
        severity: "high",
      },
      {
        slug: "phosphorus",
        name: "リン",
        reason: "腎機能低下時にリン蓄積のリスクがあります",
        severity: "high",
      },
      {
        slug: "magnesium",
        name: "マグネシウム",
        reason: "腎機能低下時に蓄積のリスクがあります",
        severity: "moderate",
      },
      {
        slug: "vitamin-d",
        name: "ビタミンD",
        reason: "腎臓での活性化に影響があり、過剰摂取に注意が必要です",
        severity: "moderate",
      },
      {
        slug: "creatine",
        name: "クレアチン",
        reason: "腎機能への負担が懸念されます",
        severity: "moderate",
      },
    ],
  },

  // ============================================
  // 特別な状態
  // ============================================
  {
    conditionValue: "pregnant",
    conditionLabel: "妊娠中",
    ingredients: [
      {
        slug: "vitamin-a",
        name: "ビタミンA（レチノール）",
        reason: "過剰摂取は胎児奇形のリスクがあります",
        severity: "high",
      },
      {
        slug: "dong-quai",
        name: "当帰",
        reason: "子宮収縮作用の可能性があります",
        severity: "high",
      },
      {
        slug: "black-cohosh",
        name: "ブラックコホシュ",
        reason: "妊娠中の安全性が確立されていません",
        severity: "high",
      },
      {
        slug: "caffeine",
        name: "カフェイン",
        reason: "高用量は流産リスクとの関連が報告されています",
        severity: "moderate",
      },
    ],
  },
  {
    conditionValue: "breastfeeding",
    conditionLabel: "授乳中",
    ingredients: [
      {
        slug: "sage",
        name: "セージ",
        reason: "母乳分泌を減少させる可能性があります",
        severity: "moderate",
      },
      {
        slug: "caffeine",
        name: "カフェイン",
        reason: "母乳を通じて乳児に移行します",
        severity: "low",
      },
    ],
  },
  {
    conditionValue: "surgery-planned",
    conditionLabel: "手術予定（2週間以内）",
    ingredients: [
      {
        slug: "fish-oil",
        name: "フィッシュオイル",
        reason:
          "出血リスクを高める可能性があります。手術2週間前から中止を検討してください",
        severity: "high",
      },
      {
        slug: "vitamin-e",
        name: "ビタミンE",
        reason: "出血リスクを高める可能性があります",
        severity: "high",
      },
      {
        slug: "ginkgo",
        name: "イチョウ葉",
        reason: "出血リスクを高める可能性があります",
        severity: "high",
      },
      {
        slug: "garlic",
        name: "ニンニク",
        reason: "出血リスクを高める可能性があります",
        severity: "moderate",
      },
      {
        slug: "ginger",
        name: "生姜",
        reason: "出血リスクを高める可能性があります",
        severity: "moderate",
      },
      {
        slug: "st-johns-wort",
        name: "セントジョンズワート",
        reason: "麻酔薬との相互作用の可能性があります",
        severity: "high",
      },
    ],
  },

  // ============================================
  // 精神・神経系
  // ============================================
  {
    conditionValue: "mental-disorder",
    conditionLabel: "精神疾患",
    ingredients: [
      {
        slug: "st-johns-wort",
        name: "セントジョンズワート",
        reason:
          "抗うつ薬との相互作用が報告されています。セロトニン症候群のリスクがあります",
        severity: "high",
      },
      {
        slug: "5-htp",
        name: "5-HTP",
        reason: "セロトニン系薬剤との併用でセロトニン症候群のリスクがあります",
        severity: "high",
      },
      {
        slug: "sam-e",
        name: "SAM-e",
        reason: "抗うつ薬との相互作用の可能性があります",
        severity: "moderate",
      },
    ],
  },
  {
    conditionValue: "insomnia",
    conditionLabel: "不眠症",
    ingredients: [
      {
        slug: "caffeine",
        name: "カフェイン",
        reason: "睡眠を妨げる可能性があります",
        severity: "moderate",
      },
    ],
  },

  // ============================================
  // がん治療
  // ============================================
  {
    conditionValue: "cancer-treatment",
    conditionLabel: "がん治療中",
    ingredients: [
      {
        slug: "antioxidants",
        name: "抗酸化サプリメント（ビタミンC、E、セレンなど）",
        reason: "放射線療法や一部の化学療法の効果を減弱させる可能性があります",
        severity: "high",
      },
      {
        slug: "st-johns-wort",
        name: "セントジョンズワート",
        reason: "多くの抗がん剤の代謝に影響を与えます",
        severity: "high",
      },
      {
        slug: "grapefruit",
        name: "グレープフルーツ",
        reason: "多くの薬剤の代謝に影響を与えます",
        severity: "high",
      },
    ],
  },

  // ============================================
  // 自己免疫疾患
  // ============================================
  {
    conditionValue: "autoimmune-disease",
    conditionLabel: "自己免疫疾患",
    ingredients: [
      {
        slug: "echinacea",
        name: "エキナセア",
        reason: "免疫系を刺激し、自己免疫疾患を悪化させる可能性があります",
        severity: "moderate",
      },
      {
        slug: "astragalus",
        name: "アストラガルス（黄耆）",
        reason: "免疫刺激作用があり、自己免疫疾患に影響する可能性があります",
        severity: "moderate",
      },
      {
        slug: "cat-claw",
        name: "キャッツクロー",
        reason: "免疫調節作用があります",
        severity: "moderate",
      },
    ],
  },
];

/**
 * 既往歴から避けるべき成分を取得
 */
export function getBlockedIngredientsForConditions(
  conditions: string[],
): Array<{
  ingredientSlug: string;
  ingredientName: string;
  reason: string;
  severity: InteractionSeverity;
  conditionValue: string;
  conditionLabel: string;
}> {
  const blocked: Array<{
    ingredientSlug: string;
    ingredientName: string;
    reason: string;
    severity: InteractionSeverity;
    conditionValue: string;
    conditionLabel: string;
  }> = [];

  for (const conditionValue of conditions) {
    const warning = CONDITION_INGREDIENT_WARNINGS.find(
      (w) => w.conditionValue === conditionValue,
    );
    if (warning) {
      for (const ingredient of warning.ingredients) {
        blocked.push({
          ingredientSlug: ingredient.slug,
          ingredientName: ingredient.name,
          reason: ingredient.reason,
          severity: ingredient.severity,
          conditionValue: warning.conditionValue,
          conditionLabel: warning.conditionLabel,
        });
      }
    }
  }

  // 重複を除去（同じ成分が複数の既往歴で警告される場合）
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
        // より高い危険度で上書き
        const index = acc.indexOf(existing);
        acc[index] = current;
      }
      return acc;
    },
    [] as typeof blocked,
  );

  return uniqueBlocked;
}

/**
 * 危険度をレベル値に変換（比較用）
 */
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
