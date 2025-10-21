import { describe, it, expect } from "vitest";
import {
  calculateCostPerDay,
  calculateCostPerServing,
  calculateDaysPerContainer,
  calculateTotalMgPerServing,
  calculateTotalMgPerDay,
  calculateCostPerMg,
  calculateComprehensiveCost,
  calculateNormalizedCost,
  compareCostEffectiveness,
  getCostEfficiencyLabel,
  calculateSavings,
  type ProductCostData,
} from "../cost-calculator";

describe("cost-calculator", () => {
  // テスト用のモック商品データ
  const mockProduct: ProductCostData = {
    priceJPY: 1980,
    servingsPerDay: 2,
    servingsPerContainer: 250,
    ingredients: [
      { amountMgPerServing: 1000 }, // ビタミンC
    ],
  };

  const mockProductB: ProductCostData = {
    priceJPY: 1200,
    servingsPerDay: 2,
    servingsPerContainer: 200,
    ingredients: [
      { amountMgPerServing: 500 }, // ビタミンC (低含有量)
    ],
  };

  describe("calculateCostPerDay", () => {
    it("1日あたりのコストを正しく計算する", () => {
      const result = calculateCostPerDay(mockProduct);
      // ¥1,980 ÷ 250粒 × 2粒/日 = ¥15.84/日
      expect(result).toBeCloseTo(15.84, 2);
    });

    it("1日1粒の場合も正しく計算する", () => {
      const product = { ...mockProduct, servingsPerDay: 1 };
      const result = calculateCostPerDay(product);
      // ¥1,980 ÷ 250粒 × 1粒/日 = ¥7.92/日
      expect(result).toBeCloseTo(7.92, 2);
    });
  });

  describe("calculateCostPerServing", () => {
    it("1回あたりのコストを正しく計算する", () => {
      const result = calculateCostPerServing(mockProduct);
      // ¥1,980 ÷ 250粒 = ¥7.92/粒
      expect(result).toBeCloseTo(7.92, 2);
    });
  });

  describe("calculateDaysPerContainer", () => {
    it("1容器で何日分かを正しく計算する", () => {
      const result = calculateDaysPerContainer(mockProduct);
      // 250粒 ÷ 2粒/日 = 125日分
      expect(result).toBe(125);
    });

    it("割り切れない場合も正しく計算する", () => {
      const product = { ...mockProduct, servingsPerContainer: 100 };
      const result = calculateDaysPerContainer(product);
      // 100粒 ÷ 2粒/日 = 50日分
      expect(result).toBe(50);
    });
  });

  describe("calculateTotalMgPerServing", () => {
    it("1回分の総mg数を正しく計算する（単一成分）", () => {
      const result = calculateTotalMgPerServing(mockProduct);
      expect(result).toBe(1000);
    });

    it("1回分の総mg数を正しく計算する（複数成分）", () => {
      const product: ProductCostData = {
        ...mockProduct,
        ingredients: [
          { amountMgPerServing: 1000 }, // ビタミンC
          { amountMgPerServing: 200 }, // マグネシウム
          { amountMgPerServing: 50 }, // 亜鉛
        ],
      };
      const result = calculateTotalMgPerServing(product);
      expect(result).toBe(1250); // 1000 + 200 + 50
    });
  });

  describe("calculateTotalMgPerDay", () => {
    it("1日分の総mg数を正しく計算する", () => {
      const result = calculateTotalMgPerDay(mockProduct);
      // 1000mg/粒 × 2粒/日 = 2000mg/日
      expect(result).toBe(2000);
    });
  });

  describe("calculateCostPerMg", () => {
    it("1mgあたりのコストを正しく計算する", () => {
      const result = calculateCostPerMg(mockProduct);
      // ¥1,980 ÷ (1000mg × 250粒) = ¥0.00792/mg
      expect(result).toBeCloseTo(0.00792, 5);
    });

    it("総mg数が0の場合は0を返す", () => {
      const product: ProductCostData = {
        ...mockProduct,
        ingredients: [{ amountMgPerServing: 0 }],
      };
      const result = calculateCostPerMg(product);
      expect(result).toBe(0);
    });
  });

  describe("calculateComprehensiveCost", () => {
    it("すべてのコスト指標を正しく計算する", () => {
      const result = calculateComprehensiveCost(mockProduct);

      expect(result.costPerDay).toBeCloseTo(15.84, 2);
      expect(result.costPerServing).toBeCloseTo(7.92, 2);
      expect(result.daysPerContainer).toBe(125);
      expect(result.totalMgPerServing).toBe(1000);
      expect(result.totalMgPerDay).toBe(2000);
      expect(result.costPerMg).toBeCloseTo(0.00792, 5);
    });
  });

  describe("calculateNormalizedCost", () => {
    it("正規化コストを正しく計算する（基準量1000mg）", () => {
      const result = calculateNormalizedCost(mockProduct, 1000);

      expect(result.baselineMg).toBe(1000);
      expect(result.normalizedCost).toBeCloseTo(7.92, 2);
      expect(result.costEfficiencyScore).toBeGreaterThan(0);
      expect(result.costEfficiencyScore).toBeLessThanOrEqual(100);
    });

    it("正規化コストを正しく計算する（基準量500mg）", () => {
      const result = calculateNormalizedCost(mockProduct, 500);

      expect(result.baselineMg).toBe(500);
      expect(result.normalizedCost).toBeCloseTo(3.96, 2); // 7.92 / 2
    });

    it("デフォルト基準量は1000mg", () => {
      const result = calculateNormalizedCost(mockProduct);
      expect(result.baselineMg).toBe(1000);
    });

    it("コスト効率スコアが正しい範囲に収まる", () => {
      const result = calculateNormalizedCost(mockProduct);
      expect(result.costEfficiencyScore).toBeGreaterThanOrEqual(0);
      expect(result.costEfficiencyScore).toBeLessThanOrEqual(100);
    });
  });

  describe("compareCostEffectiveness", () => {
    it("複数商品をコスト効率順にソートする", () => {
      const products = [mockProduct, mockProductB];
      const results = compareCostEffectiveness(products);

      // 結果は2つ
      expect(results).toHaveLength(2);

      // 1位の商品のrankは1
      expect(results[0].rank).toBe(1);
      expect(results[1].rank).toBe(2);

      // コストが安い順に並んでいる
      expect(results[0].normalizedCost).toBeLessThanOrEqual(
        results[1].normalizedCost,
      );
    });

    it("各商品に元のインデックスが保持される", () => {
      const products = [mockProduct, mockProductB];
      const results = compareCostEffectiveness(products);

      expect(results[0].productIndex).toBeGreaterThanOrEqual(0);
      expect(results[0].productIndex).toBeLessThan(products.length);
    });
  });

  describe("getCostEfficiencyLabel", () => {
    it("正しいラベルを返す", () => {
      expect(getCostEfficiencyLabel(5)).toBe("非常に優秀");
      expect(getCostEfficiencyLabel(10)).toBe("非常に優秀");
      expect(getCostEfficiencyLabel(15)).toBe("優秀");
      expect(getCostEfficiencyLabel(25)).toBe("良好");
      expect(getCostEfficiencyLabel(35)).toBe("平均的");
      expect(getCostEfficiencyLabel(45)).toBe("要検討");
    });
  });

  describe("calculateSavings", () => {
    it("節約額と節約率を正しく計算する", () => {
      const savings = calculateSavings(mockProduct, mockProductB, 30);

      // mockProductの方が1日あたり安い場合
      expect(savings.savingsAmount).toBeGreaterThan(0);
      expect(savings.savingsRate).toBeGreaterThan(0);
      expect(savings.savingsRate).toBeLessThanOrEqual(100);
    });

    it("より安い商品を正しく識別する", () => {
      const costPerDayA = calculateCostPerDay(mockProduct);
      const costPerDayB = calculateCostPerDay(mockProductB);

      const savings = calculateSavings(mockProduct, mockProductB, 30);

      if (costPerDayA < costPerDayB) {
        expect(savings.cheaperProduct).toBe("A");
      } else {
        expect(savings.cheaperProduct).toBe("B");
      }
    });

    it("デフォルト期間は30日", () => {
      const savings30 = calculateSavings(mockProduct, mockProductB, 30);
      const savingsDefault = calculateSavings(mockProduct, mockProductB);

      expect(savings30.savingsAmount).toBe(savingsDefault.savingsAmount);
    });
  });
});
