/**
 * 健康目標と推奨成分のマッピング
 *
 * 各健康目標に対して、科学的根拠に基づいた推奨成分を定義します。
 */

import type { HealthGoal } from "./recommendation-engine";

export interface RecommendedIngredient {
  name: string; // 成分名（日本語）
  nameEn: string; // 成分名（英語）
  slug?: string; // 成分詳細ページへのslug
  reason: string; // 推奨理由（簡潔に）
  evidenceLevel: "S" | "A" | "B" | "C" | "D"; // エビデンスレベル
}

/**
 * 健康目標別の推奨成分マッピング
 */
export const GOAL_INGREDIENT_MAPPING: Record<
  HealthGoal,
  RecommendedIngredient[]
> = {
  "immune-boost": [
    {
      name: "ビタミンC",
      nameEn: "Vitamin C",
      slug: "vitamin-c",
      reason: "免疫細胞の機能をサポートし、風邪予防に役立ちます",
      evidenceLevel: "A",
    },
    {
      name: "ビタミンD",
      nameEn: "Vitamin D",
      slug: "vitamin-d",
      reason: "免疫システムの調整に重要な役割を果たします",
      evidenceLevel: "A",
    },
    {
      name: "亜鉛",
      nameEn: "Zinc",
      slug: "zinc",
      reason: "免疫細胞の正常な働きに必要なミネラルです",
      evidenceLevel: "B",
    },
    {
      name: "ビタミンA",
      nameEn: "Vitamin A",
      slug: "vitamin-a",
      reason: "粘膜の健康を維持し、病原体の侵入を防ぎます",
      evidenceLevel: "B",
    },
  ],

  "skin-health": [
    {
      name: "ビタミンC",
      nameEn: "Vitamin C",
      slug: "vitamin-c",
      reason: "コラーゲン生成を促進し、肌のハリを保ちます",
      evidenceLevel: "A",
    },
    {
      name: "ビタミンE",
      nameEn: "Vitamin E",
      slug: "vitamin-e",
      reason: "抗酸化作用により肌の老化を防ぎます",
      evidenceLevel: "B",
    },
    {
      name: "ビタミンA",
      nameEn: "Vitamin A",
      slug: "vitamin-a",
      reason: "肌の新陳代謝を促進し、健康的な肌を維持します",
      evidenceLevel: "A",
    },
    {
      name: "ナイアシンアミド（ビタミンB3）",
      nameEn: "Niacinamide",
      slug: "vitamin-b3",
      reason: "肌のバリア機能を強化し、水分を保持します",
      evidenceLevel: "B",
    },
  ],

  "energy-recovery": [
    {
      name: "ビタミンB群",
      nameEn: "B Vitamins",
      slug: "vitamin-b-complex",
      reason: "エネルギー代謝に必須で、疲労回復をサポートします",
      evidenceLevel: "A",
    },
    {
      name: "マグネシウム",
      nameEn: "Magnesium",
      slug: "magnesium",
      reason: "エネルギー生成とストレス軽減に役立ちます",
      evidenceLevel: "B",
    },
    {
      name: "コエンザイムQ10",
      nameEn: "CoQ10",
      slug: "coenzyme-q10",
      reason: "細胞内のエネルギー生成を促進します",
      evidenceLevel: "B",
    },
    {
      name: "鉄",
      nameEn: "Iron",
      slug: "iron",
      reason: "酸素運搬に必要で、疲労感の軽減に役立ちます",
      evidenceLevel: "A",
    },
  ],

  "muscle-growth": [
    {
      name: "プロテイン",
      nameEn: "Protein",
      slug: "protein",
      reason: "筋肉の合成と修復に不可欠な栄養素です",
      evidenceLevel: "S",
    },
    {
      name: "クレアチン",
      nameEn: "Creatine",
      slug: "creatine",
      reason: "筋力向上とパフォーマンス改善に効果的です",
      evidenceLevel: "A",
    },
    {
      name: "BCAA（分岐鎖アミノ酸）",
      nameEn: "BCAA",
      slug: "bcaa",
      reason: "筋肉の分解を防ぎ、回復を促進します",
      evidenceLevel: "B",
    },
    {
      name: "ビタミンD",
      nameEn: "Vitamin D",
      slug: "vitamin-d",
      reason: "筋力維持と筋肉機能に重要な役割を果たします",
      evidenceLevel: "B",
    },
  ],

  "bone-health": [
    {
      name: "カルシウム",
      nameEn: "Calcium",
      slug: "calcium",
      reason: "骨の主要な構成成分で、骨密度を維持します",
      evidenceLevel: "S",
    },
    {
      name: "ビタミンD",
      nameEn: "Vitamin D",
      slug: "vitamin-d",
      reason: "カルシウムの吸収を促進し、骨の健康を保ちます",
      evidenceLevel: "A",
    },
    {
      name: "ビタミンK2",
      nameEn: "Vitamin K2",
      slug: "vitamin-k2",
      reason: "カルシウムを骨に沈着させ、骨密度を高めます",
      evidenceLevel: "B",
    },
    {
      name: "マグネシウム",
      nameEn: "Magnesium",
      slug: "magnesium",
      reason: "骨の形成とカルシウム代謝に必要です",
      evidenceLevel: "B",
    },
  ],

  "heart-health": [
    {
      name: "オメガ3脂肪酸（EPA/DHA）",
      nameEn: "Omega-3",
      slug: "omega-3",
      reason: "中性脂肪を減らし、心血管の健康をサポートします",
      evidenceLevel: "A",
    },
    {
      name: "コエンザイムQ10",
      nameEn: "CoQ10",
      slug: "coenzyme-q10",
      reason: "心筋のエネルギー生成を促進します",
      evidenceLevel: "B",
    },
    {
      name: "マグネシウム",
      nameEn: "Magnesium",
      slug: "magnesium",
      reason: "血圧調整と心臓のリズムを正常に保ちます",
      evidenceLevel: "B",
    },
    {
      name: "ビタミンE",
      nameEn: "Vitamin E",
      slug: "vitamin-e",
      reason: "抗酸化作用により血管を保護します",
      evidenceLevel: "B",
    },
  ],

  "brain-function": [
    {
      name: "オメガ3脂肪酸（DHA）",
      nameEn: "DHA",
      slug: "omega-3",
      reason: "脳の構成成分で、認知機能をサポートします",
      evidenceLevel: "A",
    },
    {
      name: "ビタミンB群",
      nameEn: "B Vitamins",
      slug: "vitamin-b-complex",
      reason: "神経伝達物質の合成と脳機能の維持に必要です",
      evidenceLevel: "B",
    },
    {
      name: "ビタミンE",
      nameEn: "Vitamin E",
      slug: "vitamin-e",
      reason: "脳細胞の酸化ストレスから保護します",
      evidenceLevel: "B",
    },
    {
      name: "マグネシウム",
      nameEn: "Magnesium",
      slug: "magnesium",
      reason: "記憶力と学習能力の向上に役立ちます",
      evidenceLevel: "B",
    },
  ],

  "sleep-quality": [
    {
      name: "マグネシウム",
      nameEn: "Magnesium",
      slug: "magnesium",
      reason: "神経系を鎮静化し、睡眠の質を改善します",
      evidenceLevel: "B",
    },
    {
      name: "メラトニン",
      nameEn: "Melatonin",
      slug: "melatonin",
      reason: "睡眠リズムを調整し、入眠をサポートします",
      evidenceLevel: "A",
    },
    {
      name: "グリシン",
      nameEn: "Glycine",
      slug: "glycine",
      reason: "深部体温を下げ、睡眠の質を高めます",
      evidenceLevel: "B",
    },
    {
      name: "ビタミンB6",
      nameEn: "Vitamin B6",
      slug: "vitamin-b6",
      reason: "セロトニン合成を促進し、睡眠ホルモンの生成を助けます",
      evidenceLevel: "C",
    },
  ],

  "stress-relief": [
    {
      name: "マグネシウム",
      nameEn: "Magnesium",
      slug: "magnesium",
      reason: "ストレスホルモンを調整し、リラックスを促進します",
      evidenceLevel: "B",
    },
    {
      name: "ビタミンB群",
      nameEn: "B Vitamins",
      slug: "vitamin-b-complex",
      reason: "ストレス応答に必要な神経伝達物質の合成を助けます",
      evidenceLevel: "B",
    },
    {
      name: "ビタミンC",
      nameEn: "Vitamin C",
      slug: "vitamin-c",
      reason: "副腎機能をサポートし、ストレス耐性を高めます",
      evidenceLevel: "B",
    },
    {
      name: "アシュワガンダ",
      nameEn: "Ashwagandha",
      slug: "ashwagandha",
      reason: "ストレスホルモンのコルチゾールを低下させます",
      evidenceLevel: "B",
    },
  ],

  "digestive-health": [
    {
      name: "プロバイオティクス",
      nameEn: "Probiotics",
      slug: "probiotics",
      reason: "腸内環境を整え、消化機能を改善します",
      evidenceLevel: "A",
    },
    {
      name: "食物繊維",
      nameEn: "Fiber",
      slug: "fiber",
      reason: "腸の動きを促進し、便通を改善します",
      evidenceLevel: "A",
    },
    {
      name: "消化酵素",
      nameEn: "Digestive Enzymes",
      slug: "digestive-enzymes",
      reason: "食べ物の分解を助け、消化不良を防ぎます",
      evidenceLevel: "B",
    },
    {
      name: "グルタミン",
      nameEn: "Glutamine",
      slug: "glutamine",
      reason: "腸粘膜の修復と保護に役立ちます",
      evidenceLevel: "B",
    },
  ],

  "eye-health": [
    {
      name: "ルテイン",
      nameEn: "Lutein",
      slug: "lutein",
      reason: "黄斑部を保護し、視力低下を防ぎます",
      evidenceLevel: "B",
    },
    {
      name: "ゼアキサンチン",
      nameEn: "Zeaxanthin",
      slug: "zeaxanthin",
      reason: "ブルーライトから目を守り、眼精疲労を軽減します",
      evidenceLevel: "B",
    },
    {
      name: "ビタミンA",
      nameEn: "Vitamin A",
      slug: "vitamin-a",
      reason: "暗順応と視覚機能の維持に必要です",
      evidenceLevel: "A",
    },
    {
      name: "オメガ3脂肪酸",
      nameEn: "Omega-3",
      slug: "omega-3",
      reason: "ドライアイの改善と網膜の健康をサポートします",
      evidenceLevel: "B",
    },
  ],

  "anti-aging": [
    {
      name: "ビタミンC",
      nameEn: "Vitamin C",
      slug: "vitamin-c",
      reason: "コラーゲン生成を促進し、肌の老化を防ぎます",
      evidenceLevel: "A",
    },
    {
      name: "ビタミンE",
      nameEn: "Vitamin E",
      slug: "vitamin-e",
      reason: "強力な抗酸化作用で細胞を保護します",
      evidenceLevel: "B",
    },
    {
      name: "レスベラトロール",
      nameEn: "Resveratrol",
      slug: "resveratrol",
      reason: "長寿遺伝子を活性化し、老化を遅らせます",
      evidenceLevel: "C",
    },
    {
      name: "コエンザイムQ10",
      nameEn: "CoQ10",
      slug: "coenzyme-q10",
      reason: "細胞のエネルギー生成を助け、老化を抑制します",
      evidenceLevel: "B",
    },
  ],

  "weight-management": [
    {
      name: "食物繊維",
      nameEn: "Fiber",
      slug: "fiber",
      reason: "満腹感を高め、カロリー吸収を抑えます",
      evidenceLevel: "A",
    },
    {
      name: "プロテイン",
      nameEn: "Protein",
      slug: "protein",
      reason: "筋肉量を維持し、代謝を高めます",
      evidenceLevel: "A",
    },
    {
      name: "緑茶抽出物（EGCG）",
      nameEn: "Green Tea Extract",
      slug: "green-tea-extract",
      reason: "脂肪燃焼を促進し、代謝を向上させます",
      evidenceLevel: "B",
    },
    {
      name: "クロム",
      nameEn: "Chromium",
      slug: "chromium",
      reason: "血糖値を安定させ、食欲をコントロールします",
      evidenceLevel: "B",
    },
  ],

  "joint-health": [
    {
      name: "グルコサミン",
      nameEn: "Glucosamine",
      slug: "glucosamine",
      reason: "軟骨の修復を促進し、関節痛を軽減します",
      evidenceLevel: "B",
    },
    {
      name: "コンドロイチン",
      nameEn: "Chondroitin",
      slug: "chondroitin",
      reason: "軟骨の弾力性を保ち、関節の健康を維持します",
      evidenceLevel: "B",
    },
    {
      name: "オメガ3脂肪酸",
      nameEn: "Omega-3",
      slug: "omega-3",
      reason: "炎症を抑え、関節の痛みを和らげます",
      evidenceLevel: "B",
    },
    {
      name: "ビタミンD",
      nameEn: "Vitamin D",
      slug: "vitamin-d",
      reason: "骨と関節の健康を維持します",
      evidenceLevel: "B",
    },
  ],

  "general-wellness": [
    {
      name: "マルチビタミン",
      nameEn: "Multivitamin",
      slug: "multivitamin",
      reason: "日常的な栄養バランスを補い、全般的な健康を支えます",
      evidenceLevel: "B",
    },
    {
      name: "ビタミンD",
      nameEn: "Vitamin D",
      slug: "vitamin-d",
      reason: "免疫、骨、筋肉など多くの機能に必要です",
      evidenceLevel: "A",
    },
    {
      name: "オメガ3脂肪酸",
      nameEn: "Omega-3",
      slug: "omega-3",
      reason: "心血管、脳、関節など全身の健康をサポートします",
      evidenceLevel: "A",
    },
    {
      name: "プロバイオティクス",
      nameEn: "Probiotics",
      slug: "probiotics",
      reason: "腸内環境を整え、免疫機能を向上させます",
      evidenceLevel: "B",
    },
  ],
};

/**
 * ユーザーの健康目標に基づいて推奨成分を取得
 *
 * @param goals - ユーザーの健康目標（複数可）
 * @returns 推奨成分のリスト（重複排除、エビデンスレベル順）
 */
export function getRecommendedIngredients(
  goals: HealthGoal[],
): RecommendedIngredient[] {
  if (goals.length === 0) {
    return [];
  }

  // 全ての目標から成分を収集
  const allIngredients: RecommendedIngredient[] = [];
  goals.forEach((goal) => {
    const ingredients = GOAL_INGREDIENT_MAPPING[goal] || [];
    allIngredients.push(...ingredients);
  });

  // 重複排除（成分名でユニーク化）
  const uniqueIngredients = new Map<string, RecommendedIngredient>();
  allIngredients.forEach((ingredient) => {
    const existing = uniqueIngredients.get(ingredient.name);
    // すでに同じ成分があり、既存のものの方がエビデンスレベルが高い場合はスキップ
    if (
      existing &&
      evidenceLevelToNumber(existing.evidenceLevel) >
        evidenceLevelToNumber(ingredient.evidenceLevel)
    ) {
      return;
    }
    uniqueIngredients.set(ingredient.name, ingredient);
  });

  // エビデンスレベルでソート（高い順）
  return Array.from(uniqueIngredients.values()).sort(
    (a, b) =>
      evidenceLevelToNumber(b.evidenceLevel) -
      evidenceLevelToNumber(a.evidenceLevel),
  );
}

/**
 * エビデンスレベルを数値に変換（ソート用）
 */
function evidenceLevelToNumber(level: string): number {
  const mapping: Record<string, number> = {
    S: 5,
    A: 4,
    B: 3,
    C: 2,
    D: 1,
  };
  return mapping[level] || 0;
}
