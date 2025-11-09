/**
 * 詳細診断専用の推薦エンジン
 *
 * かんたん診断の基本スコアに加えて、詳細診断で収集した追加情報を活用し、
 * より精度の高い推薦を実現します。
 */

import type {
  ProductForDiagnosis,
  RecommendationResult,
  HealthGoal,
} from "./recommendation-engine";
import { recommendProducts } from "./recommendation-engine";
import type { ContraindicationTag } from "./safety-checker";

/**
 * 詳細診断の追加プロファイル
 */
export interface DetailedDiagnosisProfile {
  // 基本情報（かんたん診断と共通）
  goals: HealthGoal[];
  healthConditions: ContraindicationTag[];
  budgetPerDay?: number;
  priority: string;

  // 詳細診断の追加情報
  secondaryGoals?: HealthGoal[]; // 副次的な健康目標
  ageGroup?: "20s" | "30s" | "40s" | "50s" | "60plus";
  lifestyle?: "morning" | "evening" | "irregular";
  exerciseFrequency?: "daily" | "weekly" | "occasionally" | "rarely";
  stressLevel?: "low" | "moderate" | "high";
  sleepQuality?: "good" | "fair" | "poor";
  dietQuality?: "excellent" | "good" | "fair" | "poor";
  alcoholConsumption?: "none" | "occasional" | "moderate" | "frequent";
  mainConcern?:
    | "fatigue"
    | "sleep"
    | "immunity"
    | "appearance"
    | "weight"
    | "concentration";
  supplementExperience?: "beginner" | "intermediate" | "experienced";
  currentSupplements?: string[]; // 現在使用中のサプリ
}

/**
 * 成分名から健康目標へのマッピング（悩みベース）
 */
const CONCERN_TO_INGREDIENT_BOOST: Record<string, Record<string, number>> = {
  fatigue: {
    // 疲労感
    ビタミンB: 25,
    マグネシウム: 20,
    鉄: 20,
    コエンザイムQ10: 15,
    ビタミンC: 10,
  },
  sleep: {
    // 睡眠の質
    マグネシウム: 25,
    メラトニン: 25,
    グリシン: 20,
    ビタミンB6: 15,
  },
  immunity: {
    // 免疫力
    ビタミンC: 25,
    ビタミンD: 25,
    亜鉛: 20,
    ビタミンA: 15,
    プロバイオティクス: 15,
  },
  appearance: {
    // 美容・肌
    ビタミンC: 25,
    ビタミンE: 20,
    ビタミンA: 20,
    コラーゲン: 15,
    ビオチン: 15,
  },
  weight: {
    // 体重管理
    食物繊維: 25,
    プロテイン: 20,
    緑茶抽出物: 15,
    クロム: 10,
  },
  concentration: {
    // 集中力
    DHA: 25,
    ビタミンB: 20,
    ビタミンE: 15,
    マグネシウム: 15,
  },
};

/**
 * 年齢層に応じた成分ブースト
 */
const AGE_GROUP_BOOST: Record<string, Record<string, number>> = {
  "20s": {
    プロテイン: 10,
    ビタミンB: 5,
  },
  "30s": {
    ビタミンC: 10,
    ビタミンE: 10,
    コエンザイムQ10: 5,
  },
  "40s": {
    ビタミンD: 15,
    カルシウム: 10,
    コエンザイムQ10: 10,
    オメガ3: 10,
  },
  "50s": {
    ビタミンD: 20,
    カルシウム: 15,
    コエンザイムQ10: 15,
    オメガ3: 15,
    グルコサミン: 10,
  },
  "60plus": {
    ビタミンD: 25,
    カルシウム: 20,
    コエンザイムQ10: 20,
    オメガ3: 20,
    グルコサミン: 15,
    ビタミンB12: 15,
  },
};

/**
 * 運動習慣に応じた成分ブースト
 */
const EXERCISE_BOOST: Record<string, Record<string, number>> = {
  daily: {
    プロテイン: 25,
    BCAA: 20,
    ビタミンD: 10,
    マグネシウム: 10,
  },
  weekly: {
    プロテイン: 15,
    BCAA: 10,
    ビタミンD: 5,
  },
  occasionally: {
    ビタミンB: 5,
  },
  rarely: {
    // 特になし
  },
};

/**
 * ストレスレベルに応じた成分ブースト
 */
const STRESS_BOOST: Record<string, Record<string, number>> = {
  high: {
    マグネシウム: 25,
    ビタミンB: 20,
    ビタミンC: 15,
    アシュワガンダ: 15,
  },
  moderate: {
    マグネシウム: 15,
    ビタミンB: 10,
  },
  low: {
    // 特になし
  },
};

/**
 * 睡眠の質に応じた成分ブースト
 */
const SLEEP_BOOST: Record<string, Record<string, number>> = {
  poor: {
    マグネシウム: 25,
    メラトニン: 25,
    グリシン: 20,
    ビタミンB6: 15,
  },
  fair: {
    マグネシウム: 15,
    メラトニン: 10,
  },
  good: {
    // 特になし
  },
};

/**
 * 飲酒習慣に応じた成分ブースト
 */
const ALCOHOL_BOOST: Record<string, Record<string, number>> = {
  frequent: {
    ビタミンB: 25,
    マグネシウム: 20,
    亜鉛: 15,
    ビタミンC: 10,
  },
  moderate: {
    ビタミンB: 15,
    マグネシウム: 10,
  },
  occasional: {
    ビタミンB: 5,
  },
  none: {
    // 特になし
  },
};

/**
 * 詳細診断の追加情報に基づいてスコアを調整
 */
function applyDetailedBoosts(
  recommendations: RecommendationResult[],
  profile: DetailedDiagnosisProfile,
): RecommendationResult[] {
  return recommendations.map((rec) => {
    let totalBoost = 0;
    const boostReasons: string[] = [];

    // 商品の成分リストを取得
    const ingredientNames = rec.product.ingredients.map((ing) => ing.name);

    // 副次的な健康目標に基づくブースト
    if (profile.secondaryGoals && profile.secondaryGoals.length > 0) {
      // 副次的な目標と一致する成分にボーナス
      const secondaryGoalBonus = 5 * profile.secondaryGoals.length;
      totalBoost += secondaryGoalBonus;
      boostReasons.push(`副次的な健康目標との関連性: +${secondaryGoalBonus}点`);
    }

    // 主な悩みに基づくブースト
    if (profile.mainConcern) {
      const concernBoosts = CONCERN_TO_INGREDIENT_BOOST[profile.mainConcern];
      if (concernBoosts) {
        ingredientNames.forEach((name) => {
          // 部分一致でチェック（例：「ビタミンB群」→「ビタミンB」）
          Object.keys(concernBoosts).forEach((boostIngredient) => {
            if (name.includes(boostIngredient)) {
              const boost = concernBoosts[boostIngredient];
              totalBoost += boost;
              boostReasons.push(`${name}（悩みに適合）: +${boost}点`);
            }
          });
        });
      }
    }

    // 年齢層に基づくブースト
    if (profile.ageGroup) {
      const ageBoosts = AGE_GROUP_BOOST[profile.ageGroup];
      if (ageBoosts) {
        ingredientNames.forEach((name) => {
          Object.keys(ageBoosts).forEach((boostIngredient) => {
            if (name.includes(boostIngredient)) {
              const boost = ageBoosts[boostIngredient];
              totalBoost += boost;
              boostReasons.push(`${name}（年齢に適合）: +${boost}点`);
            }
          });
        });
      }
    }

    // 運動習慣に基づくブースト
    if (profile.exerciseFrequency) {
      const exerciseBoosts = EXERCISE_BOOST[profile.exerciseFrequency];
      if (exerciseBoosts) {
        ingredientNames.forEach((name) => {
          Object.keys(exerciseBoosts).forEach((boostIngredient) => {
            if (name.includes(boostIngredient)) {
              const boost = exerciseBoosts[boostIngredient];
              totalBoost += boost;
              boostReasons.push(`${name}（運動習慣に適合）: +${boost}点`);
            }
          });
        });
      }
    }

    // ストレスレベルに基づくブースト
    if (profile.stressLevel) {
      const stressBoosts = STRESS_BOOST[profile.stressLevel];
      if (stressBoosts) {
        ingredientNames.forEach((name) => {
          Object.keys(stressBoosts).forEach((boostIngredient) => {
            if (name.includes(boostIngredient)) {
              const boost = stressBoosts[boostIngredient];
              totalBoost += boost;
              boostReasons.push(`${name}（ストレスレベルに適合）: +${boost}点`);
            }
          });
        });
      }
    }

    // 睡眠の質に基づくブースト
    if (profile.sleepQuality) {
      const sleepBoosts = SLEEP_BOOST[profile.sleepQuality];
      if (sleepBoosts) {
        ingredientNames.forEach((name) => {
          Object.keys(sleepBoosts).forEach((boostIngredient) => {
            if (name.includes(boostIngredient)) {
              const boost = sleepBoosts[boostIngredient];
              totalBoost += boost;
              boostReasons.push(`${name}（睡眠の質に適合）: +${boost}点`);
            }
          });
        });
      }
    }

    // 飲酒習慣に基づくブースト
    if (profile.alcoholConsumption) {
      const alcoholBoosts = ALCOHOL_BOOST[profile.alcoholConsumption];
      if (alcoholBoosts) {
        ingredientNames.forEach((name) => {
          Object.keys(alcoholBoosts).forEach((boostIngredient) => {
            if (name.includes(boostIngredient)) {
              const boost = alcoholBoosts[boostIngredient];
              totalBoost += boost;
              boostReasons.push(`${name}（飲酒習慣を考慮）: +${boost}点`);
            }
          });
        });
      }
    }

    // スコアを調整（最大で+50点まで）
    const cappedBoost = Math.min(totalBoost, 50);
    const newOverallScore = Math.min(
      100,
      rec.scores.overallScore + cappedBoost,
    );

    // 推薦理由に詳細診断ベースの理由を追加
    const newReasons = [...rec.reasons];
    if (boostReasons.length > 0 && cappedBoost > 10) {
      newReasons.unshift(
        `詳細診断の結果、あなたに特に適していると判定されました（+${cappedBoost}点）`,
      );
    }

    return {
      ...rec,
      scores: {
        ...rec.scores,
        overallScore: newOverallScore,
      },
      reasons: newReasons,
    };
  });
}

/**
 * 詳細診断用の推薦エンジン
 *
 * @param products - 商品リスト
 * @param profile - 詳細診断プロファイル
 * @returns ランク付けされた推薦商品リスト
 */
export function recommendProductsDetailed(
  products: ProductForDiagnosis[],
  profile: DetailedDiagnosisProfile,
): RecommendationResult[] {
  // まず基本の推薦エンジンで初期スコアを計算
  const baseRecommendations = recommendProducts(products, {
    goals: profile.goals,
    healthConditions: profile.healthConditions,
    budgetPerDay: profile.budgetPerDay,
    priority: profile.priority as any,
  });

  // 詳細診断の追加情報に基づいてスコアを調整
  const boostedRecommendations = applyDetailedBoosts(
    baseRecommendations,
    profile,
  );

  // 調整後のスコアで再ソート
  const sortedRecommendations = boostedRecommendations.sort(
    (a, b) => b.scores.overallScore - a.scores.overallScore,
  );

  // ランクを再計算
  return sortedRecommendations.map((rec, index) => ({
    ...rec,
    rank: index + 1,
  }));
}
