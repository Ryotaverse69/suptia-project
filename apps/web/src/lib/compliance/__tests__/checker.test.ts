import { describe, it, expect } from "vitest";
import {
  checkCompliance,
  highlightViolations,
  autoFixViolations,
  generateComplianceReport,
} from "../checker";

describe("薬機法コンプライアンスチェッカー", () => {
  describe("checkCompliance", () => {
    it("違反がないテキストはスコア100を返す", () => {
      const result = checkCompliance(
        "このサプリメントは健康維持をサポートします",
      );
      expect(result.hasViolations).toBe(false);
      expect(result.score).toBe(100);
      expect(result.riskLevel).toBe("safe");
    });

    it("重大違反（疾病治療）を検出する", () => {
      const result = checkCompliance("この商品で糖尿病が治ります");
      expect(result.hasViolations).toBe(true);
      expect(result.summary.critical).toBeGreaterThan(0);
      expect(result.riskLevel).toBe("critical");
      expect(result.violations[0].category).toBe("disease_treatment");
    });

    it("保証表現を検出する", () => {
      const result = checkCompliance("必ず痩せます");
      expect(result.hasViolations).toBe(true);
      expect(result.violations.some((v) => v.category === "guarantee")).toBe(
        true,
      );
    });

    it("速効性表現を検出する", () => {
      const result = checkCompliance("即効性があります");
      expect(result.hasViolations).toBe(true);
      expect(result.violations.some((v) => v.category === "speed_claim")).toBe(
        true,
      );
    });

    it("複数の違反を検出する", () => {
      const result = checkCompliance(
        "この商品は糖尿病が治り、必ず痩せる即効性があります",
      );
      expect(result.violations.length).toBeGreaterThanOrEqual(3);
    });

    it("最上級表現を検出する", () => {
      const result = checkCompliance("最強のサプリメント");
      expect(result.hasViolations).toBe(true);
      expect(result.violations.some((v) => v.category === "superlative")).toBe(
        true,
      );
    });

    it("安全性保証表現を検出する", () => {
      const result = checkCompliance("副作用なしで絶対安全");
      expect(result.hasViolations).toBe(true);
      expect(result.violations.some((v) => v.category === "safety_claim")).toBe(
        true,
      );
    });

    it("空文字列を正しく処理する", () => {
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
  });

  describe("highlightViolations", () => {
    it("違反箇所をHTMLでハイライトする", () => {
      const text = "この商品で糖尿病が治ります";
      const result = checkCompliance(text);
      const highlighted = highlightViolations(text, result.violations);

      expect(highlighted).toContain("<span");
      expect(highlighted).toContain("compliance-violation");
    });

    it("違反がない場合は元のテキストを返す", () => {
      const text = "健康維持をサポートします";
      const result = checkCompliance(text);
      const highlighted = highlightViolations(text, result.violations);

      expect(highlighted).toBe(text);
    });
  });

  describe("autoFixViolations", () => {
    it("違反箇所を自動修正する", () => {
      const text = "この商品で糖尿病が治ります";
      const result = checkCompliance(text);
      const fixed = autoFixViolations(text, result.violations);

      expect(fixed).not.toContain("治ります");
      expect(fixed).not.toContain("糖尿病が");
    });

    it("違反がない場合は元のテキストを返す", () => {
      const text = "健康維持をサポートします";
      const result = checkCompliance(text);
      const fixed = autoFixViolations(text, result.violations);

      expect(fixed).toBe(text);
    });

    it("複数の違反を正しく修正する", () => {
      const text = "必ず痩せて糖尿病が治る即効性";
      const result = checkCompliance(text);
      const fixed = autoFixViolations(text, result.violations);

      expect(fixed).not.toContain("必ず");
      expect(fixed).not.toContain("治る");
      expect(fixed).not.toContain("即効性");
    });
  });

  describe("generateComplianceReport", () => {
    it("違反がない場合のレポートを生成する", () => {
      const result = checkCompliance("健康維持をサポートします");
      const report = generateComplianceReport(result);

      expect(report).toContain("スコア: 100/100");
      expect(report).toContain("違反は検出されませんでした");
    });

    it("違反がある場合のレポートを生成する", () => {
      const result = checkCompliance("必ず痩せて糖尿病が治ります");
      const report = generateComplianceReport(result);

      expect(report).toContain("違反数:");
      expect(report).toContain("検出された違反");
      expect(report).toContain("提案:");
    });
  });

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
        "飲むだけで必ず10kg痩せる！即効性があり、楽して痩せられます。",
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
});
