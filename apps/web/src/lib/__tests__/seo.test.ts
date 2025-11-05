import { describe, it, expect, beforeEach, afterEach, beforeAll } from "vitest";
import {
  generateMetadata,
  generateProductMetadata,
  generateProductJsonLd,
  generateBreadcrumbJsonLd,
  cleanUrl,
} from "../seo";

describe("SEO Utilities", () => {
  const originalEnv = process.env;

  // テスト時に SITE_URL を明示的に設定して、実装と期待値を一致させる
  beforeAll(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://suptia.com";
  });

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_BASE_URL = "https://test.suptia.com";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("generateMetadata", () => {
    it("基本的なメタデータを生成する", () => {
      const metadata = generateMetadata({
        title: "テストページ",
        description: "テスト説明",
        canonical: "/test",
      });

      expect(metadata.title).toBe("テストページ | サプティア");
      expect(metadata.description).toBe("テスト説明");
      expect(metadata.alternates?.canonical).toBe("https://suptia.com/test");
      expect(metadata.openGraph?.title).toBe("テストページ | サプティア");
      expect(metadata.twitter?.title).toBe("テストページ | サプティア");
    });

    it("デフォルト値を使用する", () => {
      const metadata = generateMetadata();

      expect(metadata.title).toBe("サプティア");
      expect(metadata.description).toBe(
        "安全 × 価格 × 説明可能性のサプリ意思決定エンジン",
      );
      expect(metadata.alternates?.canonical).toBe("https://suptia.com");
    });

    it("noIndexが設定される", () => {
      const metadata = generateMetadata({ noIndex: true });

      expect(metadata.robots).toBe("noindex,nofollow");
    });

    it("キーワードが設定される", () => {
      const metadata = generateMetadata({
        keywords: ["サプリ", "健康", "価格比較"],
      });

      expect(metadata.keywords).toBe("サプリ, 健康, 価格比較");
    });
  });

  describe("generateProductMetadata", () => {
    const mockProduct = {
      name: "ビタミンC 1000mg",
      brand: "テストブランド",
      priceJPY: 2980,
      slug: "vitamin-c-1000",
      description: "テスト商品の説明",
    };

    it("商品メタデータを生成する", () => {
      const metadata = generateProductMetadata(mockProduct);

      // 新しいSEOロジック: priceJPYがある場合は最安値を表示（【日付】プレフィックス付き）
      expect(metadata.title).toContain("ビタミンC 1000mg");
      expect(metadata.title).toContain("最安値¥2,980");
      expect(metadata.title).toContain("サプティア");
      expect(metadata.description).toBe("テスト商品の説明");
      expect(metadata.alternates?.canonical).toBe(
        "https://suptia.com/products/vitamin-c-1000",
      );
    });

    it("説明がない場合デフォルト説明を生成する", () => {
      const productWithoutDesc = { ...mockProduct, description: undefined };
      const metadata = generateProductMetadata(productWithoutDesc);

      // 新しいSEOロジック: 最安値を強調した説明文を生成（「選ぶ前に必読！」フォーマット）
      expect(metadata.description).toContain("ビタミンC 1000mg");
      expect(metadata.description).toContain("最安値¥2,980");
      expect(metadata.description).toContain("テストブランド");
    });

    it("適切なキーワードが設定される", () => {
      const metadata = generateProductMetadata(mockProduct);

      expect(metadata.keywords).toContain("ビタミンC 1000mg");
      expect(metadata.keywords).toContain("テストブランド");
      expect(metadata.keywords).toContain("サプリメント");
    });

    it("複数価格がある場合は最安値と最高値を表示する", () => {
      const productWithMultiplePrices = {
        ...mockProduct,
        description: undefined,
        prices: [
          { amount: 1880, source: "rakuten" },
          { amount: 2480, source: "yahoo" },
          { amount: 2980, source: "amazon" },
        ],
      };

      const metadata = generateProductMetadata(productWithMultiplePrices);

      // タイトルに最安値を表示（【日付】プレフィックス付き）
      expect(metadata.title).toContain("ビタミンC 1000mg");
      expect(metadata.title).toContain("最安値¥1,880");

      // 説明に最安値と節約額を表示
      expect(metadata.description).toContain("最安値¥1,880");
      expect(metadata.description).toContain("最大¥1,100お得"); // 2980 - 1880
      expect(metadata.description).toContain("3サイト"); // 「3サイトの価格を3秒で比較」
    });
  });

  describe("generateProductJsonLd", () => {
    const mockProduct = {
      name: "ビタミンC 1000mg",
      brand: "テストブランド",
      priceJPY: 2980,
      slug: "vitamin-c-1000",
      description: "テスト商品の説明",
      images: ["https://example.com/image.jpg"],
    };

    it("Product JSON-LDを生成する", () => {
      const jsonLd = generateProductJsonLd(mockProduct);

      expect(jsonLd["@context"]).toBe("https://schema.org");
      expect(jsonLd["@type"]).toBe("Product");
      expect(jsonLd.name).toBe("ビタミンC 1000mg");
      expect(jsonLd.brand.name).toBe("テストブランド");
      expect(jsonLd.offers.price).toBe(2980);
      expect(jsonLd.offers.priceCurrency).toBe("JPY");
      expect(jsonLd.offers.availability).toBe("https://schema.org/InStock");
      expect(jsonLd.url).toBe("https://suptia.com/products/vitamin-c-1000");
    });

    it("画像がない場合プレースホルダーを使用する", () => {
      const productWithoutImage = { ...mockProduct, images: undefined };
      const jsonLd = generateProductJsonLd(productWithoutImage);

      expect(jsonLd.image).toBe("https://suptia.com/product-placeholder.jpg");
    });

    it("複数価格がある場合はAggregateOfferを生成する", () => {
      const productWithMultiplePrices = {
        ...mockProduct,
        prices: [
          { amount: 1880, source: "rakuten" },
          { amount: 2480, source: "yahoo" },
          { amount: 2980, source: "amazon" },
        ],
      };

      const jsonLd = generateProductJsonLd(productWithMultiplePrices);

      expect(jsonLd.offers["@type"]).toBe("AggregateOffer");
      expect(jsonLd.offers.lowPrice).toBe(1880);
      expect(jsonLd.offers.highPrice).toBe(2980);
      expect(jsonLd.offers.offerCount).toBe(3);
      expect(jsonLd.offers.priceCurrency).toBe("JPY");
      expect(jsonLd.offers.availability).toBe("https://schema.org/InStock");
    });

    it("単一価格の場合はOfferを生成する", () => {
      const productWithSinglePrice = {
        ...mockProduct,
        prices: [{ amount: 2980, source: "rakuten" }],
      };

      const jsonLd = generateProductJsonLd(productWithSinglePrice);

      expect(jsonLd.offers["@type"]).toBe("Offer");
      expect(jsonLd.offers.price).toBe(2980);
      expect(jsonLd.offers.priceCurrency).toBe("JPY");
      expect(jsonLd.offers.availability).toBe("https://schema.org/InStock");
    });
  });

  describe("generateBreadcrumbJsonLd", () => {
    it("BreadcrumbList JSON-LDを生成する", () => {
      const items = [
        { name: "ホーム", url: "/" },
        { name: "商品", url: "/products" },
        { name: "ビタミンC", url: "/products/vitamin-c" },
      ];

      const jsonLd = generateBreadcrumbJsonLd(items);

      expect(jsonLd["@context"]).toBe("https://schema.org");
      expect(jsonLd["@type"]).toBe("BreadcrumbList");
      expect(jsonLd.itemListElement).toHaveLength(3);

      expect(jsonLd.itemListElement[0].position).toBe(1);
      expect(jsonLd.itemListElement[0].name).toBe("ホーム");
      expect(jsonLd.itemListElement[0].item).toBe("https://suptia.com/");

      expect(jsonLd.itemListElement[2].position).toBe(3);
      expect(jsonLd.itemListElement[2].name).toBe("ビタミンC");
      expect(jsonLd.itemListElement[2].item).toBe(
        "https://suptia.com/products/vitamin-c",
      );
    });
  });

  describe("cleanUrl", () => {
    it("トラッキングパラメータを除去する", () => {
      const dirtyUrl =
        "https://example.com/page?utm_source=google&utm_medium=cpc&fbclid=123&normal=keep";
      const cleanedUrl = cleanUrl(dirtyUrl);

      expect(cleanedUrl).toBe("https://example.com/page?normal=keep");
    });

    it("すべてのパラメータが除去される場合", () => {
      const dirtyUrl = "https://example.com/page?utm_source=google&fbclid=123";
      const cleanedUrl = cleanUrl(dirtyUrl);

      expect(cleanedUrl).toBe("https://example.com/page");
    });

    it("トラッキングパラメータがない場合はそのまま返す", () => {
      const cleanUrl1 = "https://example.com/page?id=123&category=test";
      const result = cleanUrl(cleanUrl1);

      expect(result).toBe(cleanUrl1);
    });

    it("複数の同じタイプのパラメータを処理する", () => {
      const dirtyUrl =
        "https://example.com/page?utm_source=google&utm_campaign=test&gclid=456&keep=this";
      const cleanedUrl = cleanUrl(dirtyUrl);

      expect(cleanedUrl).toBe("https://example.com/page?keep=this");
    });
  });
});
