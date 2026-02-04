/**
 * 4法対応コンプライアンスチェッカーのテスト
 */

import { describe, it, expect } from "vitest";
import {
  checkCompliance,
  checkPharmaceuticalAffairs,
  checkHealthPromotion,
  checkFoodLabeling,
  checkFoodSanitation,
  highlightViolations,
  autoFixViolations,
  generateComplianceReport,
  generateLawReport,
  getQuickSummary,
  getCriticalViolations,
  COMPLIANCE_RULES,
  LAW_NAMES,
} from "../index";

describe("4法対応コンプライアンスチェッカー", () => {
  // ============================================
  // 薬機法テスト
  // ============================================
  describe("薬機法チェック", () => {
    it("疾病治療効果を検出する", () => {
      const result = checkCompliance("この商品で糖尿病が治ります");
      expect(result.hasViolations).toBe(true);
      expect(result.riskLevel).toBe("critical");

      const pharmaViolations = result.violations.filter(
        (v) => v.law === "pharmaceutical_affairs",
      );
      expect(pharmaViolations.length).toBeGreaterThan(0);
    });

    it("がんに関する効能効果を検出する", () => {
      const result = checkPharmaceuticalAffairs("がんに効くサプリメント");
      expect(result.hasViolations).toBe(true);
      expect(result.summary.critical).toBeGreaterThan(0);
    });

    it("身体機能の変化を標榜する表現を検出する", () => {
      const result = checkPharmaceuticalAffairs("血圧が下がる効果があります");
      expect(result.hasViolations).toBe(true);
      expect(
        result.violations.some((v) => v.category === "body_structure"),
      ).toBe(true);
    });

    it("医薬品的効能効果を検出する", () => {
      const result = checkPharmaceuticalAffairs("この成分は効果があります");
      expect(result.hasViolations).toBe(true);
      expect(
        result.violations.some((v) => v.category === "medical_effect"),
      ).toBe(true);
    });

    it("美容効果の断定表現を検出する", () => {
      const result = checkPharmaceuticalAffairs("シミが消えます");
      expect(result.hasViolations).toBe(true);
    });

    it("発毛・育毛効果を検出する", () => {
      const result = checkPharmaceuticalAffairs("発毛効果があります");
      expect(result.hasViolations).toBe(true);
    });

    it("法令別スコアを正しく計算する", () => {
      const result = checkCompliance("糖尿病が治ります");
      const pharmaLaw = result.byLaw.find(
        (l) => l.law === "pharmaceutical_affairs",
      );
      expect(pharmaLaw).toBeDefined();
      expect(pharmaLaw!.totalViolations).toBeGreaterThan(0);
      expect(pharmaLaw!.score).toBeLessThan(100);
    });
  });

  // ============================================
  // 健康増進法テスト
  // ============================================
  describe("健康増進法チェック", () => {
    it("保証表現を検出する", () => {
      const result = checkHealthPromotion("必ず効く");
      expect(result.hasViolations).toBe(true);
      expect(result.violations.some((v) => v.category === "guarantee")).toBe(
        true,
      );
    });

    it("誇大広告を検出する", () => {
      const result = checkHealthPromotion("飲むだけで痩せる");
      expect(result.hasViolations).toBe(true);
      expect(result.violations.some((v) => v.category === "exaggeration")).toBe(
        true,
      );
    });

    it("速効性の標榜を検出する", () => {
      const result = checkHealthPromotion("即効で効果を実感");
      expect(result.hasViolations).toBe(true);
      expect(result.violations.some((v) => v.category === "speed_claim")).toBe(
        true,
      );
    });

    it("最上級表現を検出する", () => {
      const result = checkHealthPromotion("業界No.1の品質");
      expect(result.hasViolations).toBe(true);
      expect(result.violations.some((v) => v.category === "superlative")).toBe(
        true,
      );
    });

    it("安全性の保証を検出する", () => {
      const result = checkHealthPromotion("副作用なし、100%安全");
      expect(result.hasViolations).toBe(true);
      expect(result.violations.some((v) => v.category === "safety_claim")).toBe(
        true,
      );
    });

    it("体験談の不適切使用を検出する", () => {
      const result = checkHealthPromotion("医師が推奨するサプリメント");
      expect(result.hasViolations).toBe(true);
      expect(
        result.violations.some((v) => v.category === "testimonial_misuse"),
      ).toBe(true);
    });
  });

  // ============================================
  // 食品表示法テスト
  // ============================================
  describe("食品表示法チェック", () => {
    it("アレルゲン表示の問題を検出する", () => {
      const result = checkFoodLabeling(
        "アレルギーの心配なし、アレルゲンフリー",
      );
      expect(result.hasViolations).toBe(true);
      expect(
        result.violations.some((v) => v.category === "allergen_labeling"),
      ).toBe(true);
    });

    it("栄養成分表示の問題を検出する", () => {
      const result = checkFoodLabeling("カロリーゼロでビタミン豊富");
      expect(result.hasViolations).toBe(true);
      expect(
        result.violations.some((v) => v.category === "nutrition_labeling"),
      ).toBe(true);
    });

    it("機能性表示の問題を検出する", () => {
      const result = checkFoodLabeling("機能性が科学的に証明された");
      expect(result.hasViolations).toBe(true);
    });

    it("原産地表示の問題を検出する", () => {
      const result = checkFoodLabeling("国産だから安心です");
      expect(result.hasViolations).toBe(true);
      expect(
        result.violations.some((v) => v.category === "origin_labeling"),
      ).toBe(true);
    });
  });

  // ============================================
  // 食品衛生法テスト
  // ============================================
  describe("食品衛生法チェック", () => {
    it("添加物表示の問題を検出する", () => {
      const result = checkFoodSanitation("完全無添加だから安全");
      expect(result.hasViolations).toBe(true);
      expect(
        result.violations.some((v) => v.category === "additive_labeling"),
      ).toBe(true);
    });

    it("衛生基準の誤った主張を検出する", () => {
      const result = checkFoodSanitation("完全無菌で製造");
      expect(result.hasViolations).toBe(true);
      expect(
        result.violations.some((v) => v.category === "hygiene_claim"),
      ).toBe(true);
    });

    it("品質保持期限の問題を検出する", () => {
      const result = checkFoodSanitation("腐らない、永久に保存可能");
      expect(result.hasViolations).toBe(true);
    });
  });

  // ============================================
  // 総合テスト
  // ============================================
  describe("総合チェック", () => {
    it("違反のないテキストは安全と判定される", () => {
      const result = checkCompliance("健康維持をサポートします");
      expect(result.hasViolations).toBe(false);
      expect(result.score).toBe(100);
      expect(result.riskLevel).toBe("safe");
    });

    it("空文字列は安全と判定される", () => {
      const result = checkCompliance("");
      expect(result.hasViolations).toBe(false);
      expect(result.score).toBe(100);
    });

    it("null/undefinedを正しく処理する", () => {
      const result1 = checkCompliance(null as any);
      const result2 = checkCompliance(undefined as any);
      expect(result1.hasViolations).toBe(false);
      expect(result2.hasViolations).toBe(false);
    });

    it("複数の法令違反を同時に検出する", () => {
      const text = "糖尿病が治る！必ず痩せる！アレルギーなし！無添加で安全！";
      const result = checkCompliance(text);
      expect(result.hasViolations).toBe(true);

      // 複数の法令で違反があるか確認
      const lawsWithViolations = result.byLaw.filter(
        (l) => l.totalViolations > 0,
      );
      expect(lawsWithViolations.length).toBeGreaterThanOrEqual(2);
    });

    it("法令別のサマリーが正しく生成される", () => {
      const result = checkCompliance("糖尿病が治る、必ず痩せる");
      expect(result.byLaw).toHaveLength(4);

      for (const lawSummary of result.byLaw) {
        expect(lawSummary).toHaveProperty("law");
        expect(lawSummary).toHaveProperty("lawName");
        expect(lawSummary).toHaveProperty("totalViolations");
        expect(lawSummary).toHaveProperty("score");
        expect(lawSummary).toHaveProperty("riskLevel");
      }
    });

    it("カテゴリ別の集計が正しい", () => {
      const result = checkCompliance("糖尿病が治る、必ず痩せる");
      expect(result.byCategory).toBeDefined();
    });
  });

  // ============================================
  // ユーティリティ関数テスト
  // ============================================
  describe("ユーティリティ関数", () => {
    it("highlightViolationsが違反箇所をハイライトする", () => {
      const text = "この商品で糖尿病が治ります";
      const result = checkCompliance(text);
      const highlighted = highlightViolations(text, result.violations);

      expect(highlighted).toContain("<span");
      expect(highlighted).toContain("compliance-violation");
    });

    it("highlightViolationsは違反がない場合元のテキストを返す", () => {
      const text = "健康維持をサポートします";
      const result = checkCompliance(text);
      const highlighted = highlightViolations(text, result.violations);

      expect(highlighted).toBe(text);
    });

    it("autoFixViolationsが違反を修正する", () => {
      const text = "この商品は効果があります";
      const result = checkCompliance(text);
      const fixed = autoFixViolations(text, result.violations);
      expect(fixed).not.toBe(text);
      expect(fixed).toContain("サポート");
    });

    it("autoFixViolationsは違反がない場合元のテキストを返す", () => {
      const text = "健康維持をサポートします";
      const result = checkCompliance(text);
      const fixed = autoFixViolations(text, result.violations);

      expect(fixed).toBe(text);
    });

    it("generateComplianceReportがレポートを生成する", () => {
      const result = checkCompliance("糖尿病が治る");
      const report = generateComplianceReport(result);
      expect(report).toContain("法令コンプライアンスレポート");
      expect(report).toContain("薬機法");
    });

    it("generateComplianceReportが違反なしの場合正しいレポートを生成する", () => {
      const result = checkCompliance("健康維持をサポートします");
      const report = generateComplianceReport(result);

      expect(report).toContain("スコア: 100/100");
      expect(report).toContain("違反は検出されませんでした");
    });

    it("generateLawReportが法令別レポートを生成する", () => {
      const result = checkCompliance("糖尿病が治る");
      const report = generateLawReport(result, "pharmaceutical_affairs");
      expect(report).toContain("薬機法");
    });

    it("getQuickSummaryが簡易サマリーを生成する", () => {
      const safeResult = checkCompliance("健康維持をサポート");
      expect(getQuickSummary(safeResult)).toContain("法令準拠OK");

      const violationResult = checkCompliance("糖尿病が治る");
      expect(getQuickSummary(violationResult)).toContain("スコア");
    });

    it("getCriticalViolationsが重大違反のみを取得する", () => {
      const result = checkCompliance("糖尿病が治る、効果がある");
      const critical = getCriticalViolations(result);
      expect(critical.every((v) => v.severity === "critical")).toBe(true);
    });
  });

  // ============================================
  // チェックオプションテスト
  // ============================================
  describe("チェックオプション", () => {
    it("特定の法令のみをチェックできる", () => {
      const text = "糖尿病が治る、必ず痩せる、アレルギーなし";
      const result = checkCompliance(text, {
        laws: ["pharmaceutical_affairs"],
      });

      // 薬機法以外の法令違反は検出されない
      expect(
        result.violations.every((v) => v.law === "pharmaceutical_affairs"),
      ).toBe(true);
    });

    it("特定のカテゴリを無視できる", () => {
      const text = "糖尿病が治る、最強のサプリ";
      const result = checkCompliance(text, {
        ignoreCategories: ["superlative"],
      });

      expect(result.violations.some((v) => v.category === "superlative")).toBe(
        false,
      );
    });

    it("最低重大度でフィルタリングできる", () => {
      const text = "糖尿病が治る、最強のサプリ";
      const result = checkCompliance(text, {
        minSeverity: "critical",
      });

      expect(result.violations.every((v) => v.severity === "critical")).toBe(
        true,
      );
    });
  });

  // ============================================
  // ルール統計テスト
  // ============================================
  describe("ルール統計", () => {
    it("ルール数が十分にある", () => {
      expect(COMPLIANCE_RULES.length).toBeGreaterThan(50);
    });

    it("すべてのルールに必須フィールドがある", () => {
      for (const rule of COMPLIANCE_RULES) {
        expect(rule).toHaveProperty("pattern");
        expect(rule).toHaveProperty("category");
        expect(rule).toHaveProperty("severity");
        expect(rule).toHaveProperty("suggest");
        expect(rule).toHaveProperty("law");
      }
    });

    it("すべての法令にルールがある", () => {
      const laws = [
        "pharmaceutical_affairs",
        "health_promotion",
        "food_labeling",
        "food_sanitation",
      ];
      for (const law of laws) {
        const lawRules = COMPLIANCE_RULES.filter((r) => r.law === law);
        expect(lawRules.length).toBeGreaterThan(0);
      }
    });
  });

  // ============================================
  // 法令情報テスト
  // ============================================
  describe("法令情報", () => {
    it("LAW_NAMESに4つの法令がある", () => {
      expect(Object.keys(LAW_NAMES)).toHaveLength(4);
      expect(LAW_NAMES.pharmaceutical_affairs).toBe("薬機法");
      expect(LAW_NAMES.health_promotion).toBe("健康増進法");
      expect(LAW_NAMES.food_labeling).toBe("食品表示法");
      expect(LAW_NAMES.food_sanitation).toBe("食品衛生法");
    });
  });

  // ============================================
  // 実際のサプリメント説明での検証
  // ============================================
  describe("実際のサプリメント説明での検証", () => {
    it("OK例: 適切な表現", () => {
      const result = checkCompliance(
        "ビタミンCは健康維持をサポートします。バランスの取れた食生活の一部としてお召し上がりください。",
      );
      expect(result.hasViolations).toBe(false);
      expect(result.score).toBe(100);
    });

    it("NG例: 医薬品的効能効果", () => {
      const result = checkCompliance(
        "このビタミンCで風邪が治り、がんを予防できます。",
      );
      expect(result.hasViolations).toBe(true);
      expect(result.riskLevel).toBe("critical");
    });

    it("NG例: ダイエット誇大広告", () => {
      const result = checkCompliance(
        "飲むだけで必ず効く！即効性があり、楽して痩せられます。",
      );
      expect(result.hasViolations).toBe(true);
      expect(result.summary.critical).toBeGreaterThan(0);
    });

    it("NG例: 美容効果の断定", () => {
      const result = checkCompliance(
        "シミが消えてシワがなくなり、若返ります。",
      );
      expect(result.hasViolations).toBe(true);
    });

    it("グレーゾーン: 改善表現（高リスク）", () => {
      const result = checkCompliance("血圧を改善します");
      expect(result.hasViolations).toBe(true);
      expect(result.violations.some((v) => v.severity === "high")).toBe(true);
    });
  });

  // ============================================
  // エッジケーステスト
  // ============================================
  describe("エッジケース", () => {
    it("非常に長いテキストでも正しく動作する", () => {
      const longText = "健康維持をサポートします。".repeat(1000);
      const result = checkCompliance(longText);
      expect(result).toBeDefined();
    });

    it("特殊文字を含むテキストでも正しく動作する", () => {
      const specialText = "効果があります！？（特殊文字テスト）★☆";
      const result = checkCompliance(specialText);
      expect(result.hasViolations).toBe(true);
    });

    it("複数回同じパターンが出現する場合もすべて検出する", () => {
      const text = "治る、治る、治る";
      const result = checkCompliance(text);
      expect(result.violations.length).toBe(3);
    });
  });
});
