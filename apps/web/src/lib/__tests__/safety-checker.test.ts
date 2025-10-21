import { describe, it, expect } from "vitest";
import {
  checkProductSafety,
  checkMultipleProductsSafety,
  sortAlertsBySeverity,
  getContraindicationsForIngredient,
  getContraindicationLabel,
  type IngredientInfo,
  type UserHealthProfile,
  type ContraindicationTag,
} from "../safety-checker";

describe("safety-checker", () => {
  // テスト用のモック成分データ
  const mockIngredients: IngredientInfo[] = [
    {
      name: "ビタミンE",
      slug: "vitamin-e",
      contraindications: ["anticoagulant-use", "bleeding-risk", "surgery"],
    },
    {
      name: "オメガ3脂肪酸",
      slug: "omega-3",
      contraindications: ["anticoagulant-use", "shellfish-allergy"],
    },
    {
      name: "イチョウ葉エキス",
      slug: "ginkgo-biloba",
      contraindications: [
        "pregnant",
        "breastfeeding",
        "bleeding-risk",
        "epilepsy",
      ],
    },
    {
      name: "ビタミンC",
      slug: "vitamin-c",
      contraindications: [], // 禁忌なし
    },
    {
      name: "マグネシウム",
      slug: "magnesium",
      contraindications: ["kidney-disease"],
    },
  ];

  describe("checkProductSafety", () => {
    it("禁忌に該当しない場合は安全と判定される", () => {
      const userProfile: UserHealthProfile = {
        conditions: ["diabetes", "hypertension"],
      };

      const result = checkProductSafety([mockIngredients[3]], userProfile); // ビタミンC

      expect(result.isOverallSafe).toBe(true);
      expect(result.alerts).toHaveLength(0);
      expect(result.riskLevel).toBe("safe");
      expect(result.summary).toBe(
        "選択された健康状態に関する禁忌はありません。",
      );
    });

    it("1つの重大な禁忌がある場合はhigh-riskと判定される", () => {
      const userProfile: UserHealthProfile = {
        conditions: ["pregnant"],
      };

      const result = checkProductSafety([mockIngredients[2]], userProfile); // イチョウ葉エキス

      expect(result.isOverallSafe).toBe(false);
      expect(result.alerts.length).toBeGreaterThan(0);
      expect(result.riskLevel).toBe("high-risk");
      expect(result.alerts[0].severity).toBe("critical");
    });

    it("複数の警告レベルの禁忌がある場合はmedium-riskと判定される", () => {
      const userProfile: UserHealthProfile = {
        conditions: ["diabetes", "hypertension"],
      };

      const testIngredient: IngredientInfo = {
        name: "テスト成分",
        slug: "test",
        contraindications: ["diabetes", "hypertension"],
      };

      const result = checkProductSafety([testIngredient], userProfile);

      expect(result.isOverallSafe).toBe(false);
      expect(result.riskLevel).toBe("medium-risk");
      expect(result.alerts).toHaveLength(2);
    });

    it("1つの警告レベルの禁忌がある場合はlow-riskと判定される", () => {
      const userProfile: UserHealthProfile = {
        conditions: ["diabetes"],
      };

      const testIngredient: IngredientInfo = {
        name: "テスト成分",
        slug: "test",
        contraindications: ["diabetes"],
      };

      const result = checkProductSafety([testIngredient], userProfile);

      expect(result.isOverallSafe).toBe(false);
      expect(result.riskLevel).toBe("low-risk");
      expect(result.alerts).toHaveLength(1);
    });

    it("複数の成分でそれぞれ異なる禁忌が検出される", () => {
      const userProfile: UserHealthProfile = {
        conditions: ["anticoagulant-use", "shellfish-allergy"],
      };

      const result = checkProductSafety(
        [mockIngredients[0], mockIngredients[1]], // ビタミンE + オメガ3
        userProfile,
      );

      expect(result.isOverallSafe).toBe(false);
      expect(result.alerts.length).toBeGreaterThanOrEqual(2);

      // ビタミンEの抗凝固薬禁忌
      const vitaminEAlert = result.alerts.find(
        (a) => a.ingredient === "ビタミンE",
      );
      expect(vitaminEAlert).toBeDefined();
      expect(vitaminEAlert?.userConditionTag).toBe("anticoagulant-use");

      // オメガ3の貝アレルギー
      const omega3Alert = result.alerts.find(
        (a) => a.ingredient === "オメガ3脂肪酸",
      );
      expect(omega3Alert).toBeDefined();
    });

    it("アラートメッセージが適切に生成される", () => {
      const userProfile: UserHealthProfile = {
        conditions: ["pregnant"],
      };

      const result = checkProductSafety([mockIngredients[2]], userProfile); // イチョウ葉エキス

      const alert = result.alerts[0];
      expect(alert.message).toContain("イチョウ葉エキス");
      expect(alert.message).toContain("妊娠中");
      expect(alert.message).toContain("推奨されません");
    });

    it("禁忌タグがundefinedの成分は安全とみなされる", () => {
      const userProfile: UserHealthProfile = {
        conditions: ["pregnant"],
      };

      const ingredientWithoutTags: IngredientInfo = {
        name: "安全な成分",
        slug: "safe-ingredient",
        // contraindications プロパティなし
      };

      const result = checkProductSafety([ingredientWithoutTags], userProfile);

      expect(result.isOverallSafe).toBe(true);
      expect(result.alerts).toHaveLength(0);
    });

    it("空の禁忌タグ配列の成分は安全とみなされる", () => {
      const userProfile: UserHealthProfile = {
        conditions: ["pregnant"],
      };

      const result = checkProductSafety([mockIngredients[3]], userProfile); // ビタミンC (禁忌なし)

      expect(result.isOverallSafe).toBe(true);
      expect(result.alerts).toHaveLength(0);
    });
  });

  describe("checkMultipleProductsSafety", () => {
    it("複数商品を一括チェックできる", () => {
      const userProfile: UserHealthProfile = {
        conditions: ["pregnant", "anticoagulant-use"],
      };

      const products = [
        {
          id: "prod-1",
          name: "マルチビタミン",
          ingredients: [mockIngredients[0], mockIngredients[3]], // ビタミンE + ビタミンC
        },
        {
          id: "prod-2",
          name: "オメガ3サプリ",
          ingredients: [mockIngredients[1]], // オメガ3
        },
        {
          id: "prod-3",
          name: "脳サプリ",
          ingredients: [mockIngredients[2]], // イチョウ葉エキス
        },
      ];

      const results = checkMultipleProductsSafety(products, userProfile);

      expect(results).toHaveLength(3);

      // prod-1: ビタミンEが抗凝固薬に該当
      expect(results[0].productId).toBe("prod-1");
      expect(results[0].result.isOverallSafe).toBe(false);

      // prod-2: オメガ3が抗凝固薬に該当
      expect(results[1].productId).toBe("prod-2");
      expect(results[1].result.isOverallSafe).toBe(false);

      // prod-3: イチョウ葉エキスが妊娠中に該当（critical）
      expect(results[2].productId).toBe("prod-3");
      expect(results[2].result.riskLevel).toBe("high-risk");
    });

    it("安全な商品とリスクのある商品を区別できる", () => {
      const userProfile: UserHealthProfile = {
        conditions: ["kidney-disease"],
      };

      const products = [
        {
          id: "prod-safe",
          name: "安全なビタミン",
          ingredients: [mockIngredients[3]], // ビタミンC（禁忌なし）
        },
        {
          id: "prod-risky",
          name: "マグネシウムサプリ",
          ingredients: [mockIngredients[4]], // マグネシウム（腎臓病禁忌）
        },
      ];

      const results = checkMultipleProductsSafety(products, userProfile);

      const safeProduct = results.find((r) => r.productId === "prod-safe");
      const riskyProduct = results.find((r) => r.productId === "prod-risky");

      expect(safeProduct?.result.isOverallSafe).toBe(true);
      expect(riskyProduct?.result.isOverallSafe).toBe(false);
    });
  });

  describe("sortAlertsBySeverity", () => {
    it("アラートが重要度順にソートされる", () => {
      const alerts = [
        {
          severity: "info" as const,
          ingredient: "成分A",
          ingredientSlug: "a",
          userCondition: "条件A",
          userConditionTag: "elderly" as ContraindicationTag,
          message: "情報",
        },
        {
          severity: "critical" as const,
          ingredient: "成分B",
          ingredientSlug: "b",
          userCondition: "条件B",
          userConditionTag: "pregnant" as ContraindicationTag,
          message: "重大",
        },
        {
          severity: "warning" as const,
          ingredient: "成分C",
          ingredientSlug: "c",
          userCondition: "条件C",
          userConditionTag: "diabetes" as ContraindicationTag,
          message: "警告",
        },
      ];

      const sorted = sortAlertsBySeverity(alerts);

      expect(sorted[0].severity).toBe("critical");
      expect(sorted[1].severity).toBe("warning");
      expect(sorted[2].severity).toBe("info");
    });

    it("元の配列を変更しない（イミュータブル）", () => {
      const alerts = [
        {
          severity: "info" as const,
          ingredient: "成分A",
          ingredientSlug: "a",
          userCondition: "条件A",
          userConditionTag: "elderly" as ContraindicationTag,
          message: "情報",
        },
        {
          severity: "critical" as const,
          ingredient: "成分B",
          ingredientSlug: "b",
          userCondition: "条件B",
          userConditionTag: "pregnant" as ContraindicationTag,
          message: "重大",
        },
      ];

      const original = [...alerts];
      sortAlertsBySeverity(alerts);

      expect(alerts).toEqual(original); // 元の配列は変わらない
    });
  });

  describe("getContraindicationsForIngredient", () => {
    it("成分名から禁忌タグを取得できる", () => {
      const contraindications = getContraindicationsForIngredient(
        "ビタミンE",
        mockIngredients,
      );

      expect(contraindications).toContain("anticoagulant-use");
      expect(contraindications).toContain("bleeding-risk");
      expect(contraindications).toContain("surgery");
    });

    it("存在しない成分名の場合は空配列を返す", () => {
      const contraindications = getContraindicationsForIngredient(
        "存在しない成分",
        mockIngredients,
      );

      expect(contraindications).toEqual([]);
    });

    it("禁忌タグがない成分の場合は空配列を返す", () => {
      const contraindications = getContraindicationsForIngredient(
        "ビタミンC",
        mockIngredients,
      );

      expect(contraindications).toEqual([]);
    });
  });

  describe("getContraindicationLabel", () => {
    it("タグから日本語ラベルを取得できる", () => {
      expect(getContraindicationLabel("pregnant")).toBe("妊娠中");
      expect(getContraindicationLabel("anticoagulant-use")).toBe(
        "抗凝固薬服用中",
      );
      expect(getContraindicationLabel("shellfish-allergy")).toBe(
        "貝アレルギー",
      );
    });

    it("未定義のタグの場合はタグそのものを返す", () => {
      const unknownTag = "unknown-tag" as ContraindicationTag;
      expect(getContraindicationLabel(unknownTag)).toBe(unknownTag);
    });
  });

  describe("Edge Cases", () => {
    it("ユーザーの健康状態が空の場合は常に安全と判定", () => {
      const userProfile: UserHealthProfile = {
        conditions: [],
      };

      const result = checkProductSafety(mockIngredients, userProfile);

      expect(result.isOverallSafe).toBe(true);
      expect(result.alerts).toHaveLength(0);
    });

    it("成分リストが空の場合は常に安全と判定", () => {
      const userProfile: UserHealthProfile = {
        conditions: ["pregnant", "diabetes"],
      };

      const result = checkProductSafety([], userProfile);

      expect(result.isOverallSafe).toBe(true);
      expect(result.alerts).toHaveLength(0);
    });

    it("同じ成分で複数の禁忌に該当する場合、すべてアラートが生成される", () => {
      const userProfile: UserHealthProfile = {
        conditions: ["pregnant", "breastfeeding", "bleeding-risk", "epilepsy"],
      };

      const result = checkProductSafety([mockIngredients[2]], userProfile); // イチョウ葉エキス

      expect(result.alerts.length).toBeGreaterThanOrEqual(3);
      expect(
        result.alerts.every((a) => a.ingredient === "イチョウ葉エキス"),
      ).toBe(true);
    });
  });
});
