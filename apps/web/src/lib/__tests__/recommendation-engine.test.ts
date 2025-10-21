import { describe, it, expect } from "vitest";
import {
  evaluateProduct,
  recommendProduct,
  recommendProducts,
  getTopRecommendations,
  type ProductForDiagnosis,
  type UserDiagnosisProfile,
  type HealthGoal,
} from "../recommendation-engine";

describe("recommendation-engine", () => {
  // テスト用のモック商品データ
  const mockProducts: ProductForDiagnosis[] = [
    {
      id: "prod-1",
      name: "高品質ビタミンC 1000mg",
      brand: "Now Foods",
      priceJPY: 1980,
      servingsPerDay: 2,
      servingsPerContainer: 250,
      ingredients: [
        {
          name: "ビタミンC",
          slug: "vitamin-c",
          category: "ビタミン",
          evidenceLevel: "A",
          relatedGoals: ["immune-boost", "skin-health", "anti-aging"],
          contraindications: [],
          amountMgPerServing: 1000,
        },
      ],
    },
    {
      id: "prod-2",
      name: "オメガ3フィッシュオイル",
      brand: "Nordic Naturals",
      priceJPY: 3500,
      servingsPerDay: 2,
      servingsPerContainer: 60,
      ingredients: [
        {
          name: "EPA/DHA",
          slug: "omega-3",
          category: "脂肪酸",
          evidenceLevel: "S",
          relatedGoals: ["heart-health", "brain-function", "anti-aging"],
          contraindications: ["anticoagulant-use", "surgery", "bleeding-risk"],
          amountMgPerServing: 1000,
        },
      ],
    },
    {
      id: "prod-3",
      name: "マグネシウム 400mg",
      brand: "Doctor's Best",
      priceJPY: 2200,
      servingsPerDay: 2,
      servingsPerContainer: 120,
      ingredients: [
        {
          name: "マグネシウム",
          slug: "magnesium",
          category: "ミネラル",
          evidenceLevel: "B",
          relatedGoals: ["sleep-quality", "muscle-growth", "stress-relief"],
          contraindications: ["kidney-disease"],
          amountMgPerServing: 400,
        },
      ],
    },
    {
      id: "prod-4",
      name: "イチョウ葉エキス 120mg",
      brand: "Nature's Way",
      priceJPY: 2800,
      servingsPerDay: 1,
      servingsPerContainer: 60,
      ingredients: [
        {
          name: "イチョウ葉エキス",
          slug: "ginkgo-biloba",
          category: "ハーブ",
          evidenceLevel: "B",
          relatedGoals: ["brain-function"],
          contraindications: [
            "pregnant",
            "breastfeeding",
            "bleeding-risk",
            "epilepsy",
          ],
          amountMgPerServing: 120,
        },
      ],
    },
    {
      id: "prod-5",
      name: "低品質マルチビタミン",
      brand: "Generic Brand",
      priceJPY: 800,
      servingsPerDay: 1,
      servingsPerContainer: 30,
      ingredients: [
        {
          name: "ビタミンミックス",
          slug: "vitamin-mix",
          category: "その他",
          evidenceLevel: "D",
          relatedGoals: ["general-wellness"],
          contraindications: [],
          amountMgPerServing: 500,
        },
      ],
    },
  ];

  describe("evaluateProduct", () => {
    it("バランス重視の場合、4スコアが適切に計算される", () => {
      const userProfile: UserDiagnosisProfile = {
        goals: ["immune-boost", "skin-health"],
        healthConditions: [],
        budgetPerDay: 100,
        priority: "balanced",
      };

      const scores = evaluateProduct(mockProducts[0], userProfile);

      expect(scores.effectivenessScore).toBeGreaterThan(60); // 目標に合致
      expect(scores.safetyScore).toBe(100); // 禁忌なし
      expect(scores.costScore).toBeGreaterThan(70); // 予算内
      expect(scores.evidenceScore).toBeGreaterThan(70); // エビデンスレベルA
      expect(scores.overallScore).toBeGreaterThan(60);
    });

    it("禁忌がある場合、安全性スコアが低くなる", () => {
      const userProfile: UserDiagnosisProfile = {
        goals: ["heart-health"],
        healthConditions: ["anticoagulant-use"], // 抗凝固薬服用中
        budgetPerDay: 200,
        priority: "balanced",
      };

      const scores = evaluateProduct(mockProducts[1], userProfile); // オメガ3（禁忌あり）

      expect(scores.safetyScore).toBeLessThan(50); // 安全性が低い
      expect(scores.safetyDetails.hasContraindications).toBe(true);
    });

    it("予算オーバーの商品はコストスコアが低くなる", () => {
      const userProfile: UserDiagnosisProfile = {
        goals: ["heart-health"],
        healthConditions: [],
        budgetPerDay: 50, // 低予算
        priority: "balanced",
      };

      const scores = evaluateProduct(mockProducts[1], userProfile); // オメガ3（高額）

      expect(scores.costScore).toBeLessThan(40);
      expect(scores.costDetails.costEfficiencyRating).toBe("poor");
    });

    it("エビデンスレベルSの商品はエビデンススコアが高い", () => {
      const userProfile: UserDiagnosisProfile = {
        goals: ["heart-health"],
        healthConditions: [],
        budgetPerDay: 200,
        priority: "balanced",
      };

      const scores = evaluateProduct(mockProducts[1], userProfile); // オメガ3（エビデンスS）

      expect(scores.evidenceScore).toBeGreaterThan(90);
      expect(scores.evidenceDetails.overallEvidenceLevel).toBe("S");
      expect(scores.evidenceDetails.hasHighQualityEvidence).toBe(true);
    });

    it("エビデンスレベルDの商品はエビデンススコアが低い", () => {
      const userProfile: UserDiagnosisProfile = {
        goals: ["general-wellness"],
        healthConditions: [],
        budgetPerDay: 100,
        priority: "balanced",
      };

      const scores = evaluateProduct(mockProducts[4], userProfile); // 低品質マルチビタミン

      expect(scores.evidenceScore).toBeLessThan(50);
      expect(scores.evidenceDetails.hasHighQualityEvidence).toBe(false);
    });
  });

  describe("優先事項による重み付け", () => {
    const baseProfile: UserDiagnosisProfile = {
      goals: ["immune-boost"],
      healthConditions: [],
      budgetPerDay: 100,
      priority: "balanced",
    };

    it("効果重視の場合、効果スコアが総合スコアに大きく影響する", () => {
      const effectivenessProfile: UserDiagnosisProfile = {
        ...baseProfile,
        priority: "effectiveness",
      };

      const scoresBalanced = evaluateProduct(mockProducts[0], baseProfile);
      const scoresEffectiveness = evaluateProduct(
        mockProducts[0],
        effectivenessProfile,
      );

      // 効果スコアが高い商品は効果重視でより高い総合スコアになる
      expect(scoresEffectiveness.overallScore).toBeGreaterThanOrEqual(
        scoresBalanced.overallScore,
      );
    });

    it("安全性重視の場合、禁忌がある商品のスコアが大幅に下がる", () => {
      const safetyProfile: UserDiagnosisProfile = {
        goals: ["heart-health"],
        healthConditions: ["anticoagulant-use"],
        budgetPerDay: 200,
        priority: "safety",
      };

      const balancedProfile: UserDiagnosisProfile = {
        ...safetyProfile,
        priority: "balanced",
      };

      const scoresSafety = evaluateProduct(mockProducts[1], safetyProfile); // オメガ3（禁忌あり）
      const scoresBalanced = evaluateProduct(mockProducts[1], balancedProfile);

      expect(scoresSafety.overallScore).toBeLessThan(
        scoresBalanced.overallScore,
      );
    });

    it("コスト重視の場合、安価な商品の総合スコアが上がる", () => {
      const costProfile: UserDiagnosisProfile = {
        ...baseProfile,
        priority: "cost",
      };

      const scoresBalanced = evaluateProduct(mockProducts[4], baseProfile); // 安価なマルチビタミン
      const scoresCost = evaluateProduct(mockProducts[4], costProfile);

      expect(scoresCost.overallScore).toBeGreaterThanOrEqual(
        scoresBalanced.overallScore,
      );
    });

    it("エビデンス重視の場合、高エビデンス商品の総合スコアが上がる", () => {
      const evidenceProfile: UserDiagnosisProfile = {
        goals: ["heart-health"],
        healthConditions: [],
        budgetPerDay: 200,
        priority: "evidence",
      };

      const balancedProfile: UserDiagnosisProfile = {
        ...evidenceProfile,
        priority: "balanced",
      };

      const scoresEvidence = evaluateProduct(mockProducts[1], evidenceProfile); // オメガ3（エビデンスS）
      const scoresBalanced = evaluateProduct(mockProducts[1], balancedProfile);

      expect(scoresEvidence.overallScore).toBeGreaterThanOrEqual(
        scoresBalanced.overallScore,
      );
    });
  });

  describe("recommendProduct", () => {
    it("推薦理由が適切に生成される", () => {
      const userProfile: UserDiagnosisProfile = {
        goals: ["immune-boost", "skin-health"],
        healthConditions: [],
        budgetPerDay: 100,
        priority: "balanced",
      };

      const result = recommendProduct(mockProducts[0], userProfile);

      expect(result.reasons.length).toBeGreaterThan(0);
      expect(result.reasons.some((r) => r.includes("免疫力強化"))).toBe(true);
    });

    it("禁忌がある場合は警告が生成される", () => {
      const userProfile: UserDiagnosisProfile = {
        goals: ["heart-health"],
        healthConditions: ["anticoagulant-use"],
        budgetPerDay: 200,
        priority: "balanced",
      };

      const result = recommendProduct(mockProducts[1], userProfile); // オメガ3（禁忌あり）

      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it("総合スコアが高い場合はhighly-recommendedになる", () => {
      const userProfile: UserDiagnosisProfile = {
        goals: ["immune-boost", "skin-health"],
        healthConditions: [],
        budgetPerDay: 100,
        priority: "balanced",
      };

      const result = recommendProduct(mockProducts[0], userProfile);

      if (result.scores.overallScore >= 80) {
        expect(result.recommendation).toBe("highly-recommended");
      }
    });

    it("安全性スコアが極端に低い場合はnot-recommendedになる", () => {
      const userProfile: UserDiagnosisProfile = {
        goals: ["heart-health"],
        healthConditions: ["anticoagulant-use", "surgery", "bleeding-risk"], // 複数の禁忌
        budgetPerDay: 200,
        priority: "balanced",
      };

      const result = recommendProduct(mockProducts[1], userProfile);

      if (result.scores.safetyScore < 30) {
        expect(result.recommendation).toBe("not-recommended");
      }
    });
  });

  describe("recommendProducts", () => {
    it("複数商品が総合スコア順にランキングされる", () => {
      const userProfile: UserDiagnosisProfile = {
        goals: ["immune-boost"],
        healthConditions: [],
        budgetPerDay: 100,
        priority: "balanced",
      };

      const results = recommendProducts(mockProducts, userProfile);

      expect(results.length).toBe(mockProducts.length);
      expect(results[0].rank).toBe(1);
      expect(results[results.length - 1].rank).toBe(mockProducts.length);

      // スコアが降順になっているか確認
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].scores.overallScore).toBeGreaterThanOrEqual(
          results[i + 1].scores.overallScore,
        );
      }
    });

    it("禁忌がある商品は下位にランキングされる", () => {
      const userProfile: UserDiagnosisProfile = {
        goals: ["brain-function"],
        healthConditions: ["pregnant"], // 妊娠中
        budgetPerDay: 150,
        priority: "safety", // 安全性重視
      };

      const results = recommendProducts(mockProducts, userProfile);

      // イチョウ葉エキス（妊娠中禁忌）は下位になるはず
      const ginkgoProduct = results.find((r) => r.product.id === "prod-4");
      expect(ginkgoProduct).toBeDefined();
      expect(ginkgoProduct!.rank).toBeGreaterThan(2); // 少なくとも3位以下
    });

    it("目標に合致しない商品は下位にランキングされる", () => {
      const userProfile: UserDiagnosisProfile = {
        goals: ["sleep-quality", "stress-relief"], // 睡眠・ストレス
        healthConditions: [],
        budgetPerDay: 100,
        priority: "effectiveness",
      };

      const results = recommendProducts(mockProducts, userProfile);

      // マグネシウム（睡眠・ストレス関連）が上位になるはず
      const magnesiumProduct = results.find((r) => r.product.id === "prod-3");
      expect(magnesiumProduct).toBeDefined();
      expect(magnesiumProduct!.rank).toBeLessThanOrEqual(3); // 上位3位以内
    });
  });

  describe("getTopRecommendations", () => {
    it("指定した件数のトップ商品を取得できる", () => {
      const userProfile: UserDiagnosisProfile = {
        goals: ["general-wellness"],
        healthConditions: [],
        budgetPerDay: 100,
        priority: "balanced",
      };

      const topThree = getTopRecommendations(mockProducts, userProfile, 3);

      expect(topThree.length).toBe(3);
      expect(topThree[0].rank).toBe(1);
      expect(topThree[1].rank).toBe(2);
      expect(topThree[2].rank).toBe(3);
    });

    it("商品数より多い件数を指定した場合は全商品を返す", () => {
      const userProfile: UserDiagnosisProfile = {
        goals: ["general-wellness"],
        healthConditions: [],
        budgetPerDay: 100,
        priority: "balanced",
      };

      const topTen = getTopRecommendations(mockProducts, userProfile, 10);

      expect(topTen.length).toBe(mockProducts.length);
    });
  });

  describe("Edge Cases", () => {
    it("目標が未設定の場合でも評価できる", () => {
      const userProfile: UserDiagnosisProfile = {
        goals: [],
        healthConditions: [],
        budgetPerDay: 100,
        priority: "balanced",
      };

      const scores = evaluateProduct(mockProducts[0], userProfile);

      expect(scores.effectivenessScore).toBeDefined();
      expect(scores.overallScore).toBeGreaterThanOrEqual(0);
    });

    it("予算が未設定の場合でも評価できる", () => {
      const userProfile: UserDiagnosisProfile = {
        goals: ["immune-boost"],
        healthConditions: [],
        // budgetPerDay: undefined
        priority: "balanced",
      };

      const scores = evaluateProduct(mockProducts[0], userProfile);

      expect(scores.costScore).toBeDefined();
      expect(scores.overallScore).toBeGreaterThanOrEqual(0);
    });

    it("成分にエビデンスレベルが設定されていない場合でも評価できる", () => {
      const productWithoutEvidence: ProductForDiagnosis = {
        id: "prod-test",
        name: "テスト商品",
        priceJPY: 1000,
        servingsPerDay: 1,
        servingsPerContainer: 30,
        ingredients: [
          {
            name: "テスト成分",
            slug: "test",
            // evidenceLevel: undefined
            amountMgPerServing: 500,
          },
        ],
      };

      const userProfile: UserDiagnosisProfile = {
        goals: ["general-wellness"],
        healthConditions: [],
        budgetPerDay: 100,
        priority: "balanced",
      };

      const scores = evaluateProduct(productWithoutEvidence, userProfile);

      expect(scores.evidenceScore).toBeDefined();
      expect(scores.evidenceScore).toBe(50); // デフォルト値
    });
  });

  describe("Real-world Scenarios", () => {
    it("シナリオ1: 妊娠中の女性が免疫力強化を求める", () => {
      const userProfile: UserDiagnosisProfile = {
        goals: ["immune-boost"],
        healthConditions: ["pregnant"],
        budgetPerDay: 100,
        priority: "safety", // 安全性最重視
      };

      const results = getTopRecommendations(mockProducts, userProfile, 3);

      // 1位はビタミンC（禁忌なし、免疫力強化）のはず
      expect(results[0].product.id).toBe("prod-1");
      expect(results[0].scores.safetyScore).toBe(100);

      // イチョウ葉エキスは上位に来ないはず
      const ginkgoProduct = results.find((r) => r.product.id === "prod-4");
      expect(ginkgoProduct).toBeUndefined(); // トップ3に入らない
    });

    it("シナリオ2: 抗凝固薬服用中で心臓の健康を求める", () => {
      const userProfile: UserDiagnosisProfile = {
        goals: ["heart-health"],
        healthConditions: ["anticoagulant-use"],
        budgetPerDay: 150,
        priority: "safety",
      };

      const results = recommendProducts(mockProducts, userProfile);

      // オメガ3（心臓に良いが禁忌あり）は下位になるはず
      const omega3Product = results.find((r) => r.product.id === "prod-2");
      expect(omega3Product).toBeDefined();
      expect(omega3Product!.scores.safetyScore).toBeLessThan(50);
      expect(omega3Product!.recommendation).not.toBe("highly-recommended");
    });

    it("シナリオ3: 低予算で総合的な健康維持を求める", () => {
      const userProfile: UserDiagnosisProfile = {
        goals: ["general-wellness"],
        healthConditions: [],
        budgetPerDay: 30, // 非常に低予算
        priority: "cost",
      };

      const results = getTopRecommendations(mockProducts, userProfile, 3);

      // 安価なマルチビタミンが上位に来るはず
      const cheapProduct = results.find((r) => r.product.id === "prod-5");
      expect(cheapProduct).toBeDefined();
      expect(cheapProduct!.rank).toBeLessThanOrEqual(2); // トップ2以内
    });
  });
});
