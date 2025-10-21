// 商品マッチングロジックのテスト

import { describe, it, expect } from "vitest";
import {
  matchProducts,
  findMatchingProducts,
  createProductLinkage,
} from "../product-matching";
import type { ProductIdentifier } from "../adapters/types";

describe("商品マッチングロジック", () => {
  describe("matchProducts - JAN一致", () => {
    it("JAN完全一致で信頼度1.0を返す", () => {
      const product1: ProductIdentifier = {
        jan: "4573117580016",
        title: "ビタミンC 1000mg",
      };

      const product2: ProductIdentifier = {
        jan: "4573117580016",
        title: "Vitamin C 1000mg",
      };

      const result = matchProducts(product1, product2);

      expect(result.isMatch).toBe(true);
      expect(result.confidence).toBe(1.0);
      expect(result.method).toBe("jan_exact");
    });

    it("JANコードの空白・ハイフンを無視してマッチ", () => {
      const product1: ProductIdentifier = {
        jan: "4573-1175-8001-6",
      };

      const product2: ProductIdentifier = {
        jan: " 4573117580016 ",
      };

      const result = matchProducts(product1, product2);

      expect(result.isMatch).toBe(true);
      expect(result.confidence).toBe(1.0);
      expect(result.method).toBe("jan_exact");
    });
  });

  describe("matchProducts - ASIN一致", () => {
    it("ASIN完全一致で信頼度0.95を返す", () => {
      const product1: ProductIdentifier = {
        asin: "B00TEST123",
        title: "ビタミンC 1000mg",
      };

      const product2: ProductIdentifier = {
        asin: "B00TEST123",
        title: "Vitamin C 1000mg",
      };

      const result = matchProducts(product1, product2);

      expect(result.isMatch).toBe(true);
      expect(result.confidence).toBe(0.95);
      expect(result.method).toBe("asin_exact");
    });

    it("ASINの大文字小文字を無視してマッチ", () => {
      const product1: ProductIdentifier = {
        asin: "b00test123",
      };

      const product2: ProductIdentifier = {
        asin: "B00TEST123",
      };

      const result = matchProducts(product1, product2);

      expect(result.isMatch).toBe(true);
      expect(result.method).toBe("asin_exact");
    });
  });

  describe("matchProducts - EAN一致", () => {
    it("EAN完全一致で信頼度0.95を返す", () => {
      const product1: ProductIdentifier = {
        ean: "1234567890123",
      };

      const product2: ProductIdentifier = {
        ean: "1234567890123",
      };

      const result = matchProducts(product1, product2);

      expect(result.isMatch).toBe(true);
      expect(result.confidence).toBe(0.95);
      expect(result.method).toBe("ean_exact");
    });
  });

  describe("matchProducts - タイトル類似度", () => {
    it("同じ商品名で類似度が高い場合にマッチ", () => {
      const product1: ProductIdentifier = {
        title: "ビタミンC サプリメント",
        brand: "TestBrand",
      };

      const product2: ProductIdentifier = {
        title: "ビタミンC サプリメント",
        brand: "TestBrand",
      };

      const result = matchProducts(product1, product2);

      // 完全一致なので高い類似度が期待される
      expect(result.isMatch).toBe(true);
      expect(result.method).toBe("title_similarity");
    });

    it("類似度が低い場合はマッチしない", () => {
      const product1: ProductIdentifier = {
        title: "ビタミンC 1000mg",
      };

      const product2: ProductIdentifier = {
        title: "ビタミンD3 5000IU",
      };

      const result = matchProducts(product1, product2);

      expect(result.isMatch).toBe(false);
      expect(result.method).toBe("no_match");
    });
  });

  describe("matchProducts - 優先順位", () => {
    it("JAN優先: JANとASINの両方がある場合はJANを優先", () => {
      const product1: ProductIdentifier = {
        jan: "4573117580016",
        asin: "B00TEST123",
      };

      const product2: ProductIdentifier = {
        jan: "4573117580016",
        asin: "B00DIFFERENT",
      };

      const result = matchProducts(product1, product2);

      expect(result.method).toBe("jan_exact");
      expect(result.confidence).toBe(1.0);
    });

    it("ASIN優先: JANがない場合はASINを使用", () => {
      const product1: ProductIdentifier = {
        asin: "B00TEST123",
        title: "Vitamin C",
      };

      const product2: ProductIdentifier = {
        asin: "B00TEST123",
        title: "Different Product",
      };

      const result = matchProducts(product1, product2);

      expect(result.method).toBe("asin_exact");
    });
  });

  describe("findMatchingProducts", () => {
    it("複数候補から信頼度順にマッチを返す", () => {
      const target: ProductIdentifier = {
        jan: "4573117580016",
        title: "ビタミンC 1000mg",
      };

      const candidates = [
        {
          id: "prod-1",
          jan: "4573117580016",
          title: "ビタミンC 1000mg 楽天版",
        },
        {
          id: "prod-2",
          asin: "B00TEST123",
          title: "ビタミンC 1000mg Amazon版",
        },
        {
          id: "prod-3",
          title: "ビタミンC 1000mg iHerb版",
        },
      ];

      const results = findMatchingProducts(target, candidates);

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe("prod-1"); // JANマッチが最優先
      expect(results[0].match.confidence).toBe(1.0);
    });

    it("最小信頼度未満の候補は除外", () => {
      const target: ProductIdentifier = {
        title: "ビタミンC",
      };

      const candidates = [
        {
          id: "prod-1",
          title: "ビタミンD", // 類似度低い
        },
      ];

      const results = findMatchingProducts(target, candidates, 0.92);

      expect(results.length).toBe(0);
    });
  });

  describe("createProductLinkage", () => {
    it("高信頼度マッチでverified状態のリンケージを作成", () => {
      const masterProductId = "suptia:product:001";
      const matches = [
        {
          source: "amazon",
          externalId: "B00TEST123",
          identifier: { asin: "B00TEST123" },
          match: {
            isMatch: true,
            confidence: 0.95,
            method: "asin_exact" as const,
          },
        },
      ];

      const linkage = createProductLinkage(masterProductId, matches);

      expect(linkage.masterProductId).toBe(masterProductId);
      expect(linkage.linkedProducts.length).toBe(1);
      expect(linkage.status).toBe("verified");
    });

    it("低信頼度マッチでpending状態のリンケージを作成", () => {
      const masterProductId = "suptia:product:002";
      const matches = [
        {
          source: "rakuten",
          externalId: "item-code-123",
          identifier: { itemCode: "item-code-123", title: "ビタミンC" },
          match: {
            isMatch: true,
            confidence: 0.92,
            method: "title_similarity" as const,
          },
        },
      ];

      const linkage = createProductLinkage(masterProductId, matches);

      expect(linkage.status).toBe("pending"); // 信頼度0.95未満
    });
  });
});
