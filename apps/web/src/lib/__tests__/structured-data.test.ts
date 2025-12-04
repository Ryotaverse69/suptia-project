import { describe, it, expect } from "vitest";
import {
  generateProductStructuredData,
  generateItemListStructuredData,
  generateBreadcrumbStructuredData,
  generateArticleStructuredData,
  generateFAQStructuredData,
  renderStructuredData,
  mergeStructuredData,
} from "../structured-data";

describe("structured-data", () => {
  describe("generateProductStructuredData", () => {
    it("基本的な商品情報から構造化データを生成できる", () => {
      const result = generateProductStructuredData({
        name: "ビタミンC 1000mg",
        description: "高品質なビタミンCサプリメント",
        price: 1980,
        brand: "Now Foods",
      });

      expect(result["@context"]).toBe("https://schema.org");
      expect(result["@type"]).toBe("Product");
      expect(result.name).toBe("ビタミンC 1000mg");
      expect(result.description).toBe("高品質なビタミンCサプリメント");
      expect(result.brand).toEqual({
        "@type": "Brand",
        name: "Now Foods",
      });
      expect(result.offers).toBeDefined();
      expect(result.offers?.price).toBe(1980);
      expect(result.offers?.priceCurrency).toBe("JPY");
    });

    it("評価情報を含む構造化データを生成できる", () => {
      const result = generateProductStructuredData({
        name: "オメガ3",
        price: 3500,
        rating: {
          value: 4.5,
          count: 120,
        },
      });

      expect(result.aggregateRating).toBeDefined();
      expect(result.aggregateRating?.ratingValue).toBe(4.5);
      expect(result.aggregateRating?.reviewCount).toBe(120);
      expect(result.aggregateRating?.bestRating).toBe(5);
      expect(result.aggregateRating?.worstRating).toBe(1);
    });

    it("在庫状況を指定できる", () => {
      const result = generateProductStructuredData({
        name: "マグネシウム",
        price: 2200,
        availability: "InStock",
      });

      expect(result.offers?.availability).toBe("https://schema.org/InStock");
    });

    it("商品識別子（SKU、GTIN）を含められる", () => {
      const result = generateProductStructuredData({
        name: "プロテイン",
        price: 5000,
        sku: "PROT-001",
        gtin: "4901234567890",
      });

      expect(result.sku).toBe("PROT-001");
      expect(result.gtin).toBe("4901234567890");
    });

    it("成分情報をadditionalPropertyとして含められる", () => {
      const result = generateProductStructuredData({
        name: "マルチビタミン",
        price: 2500,
        ingredients: [
          { name: "ビタミンC", amount: 1000, unit: "mg" },
          { name: "ビタミンD", amount: 25, unit: "μg" },
        ],
      });

      expect(result.additionalProperty).toBeDefined();
      expect(result.additionalProperty).toHaveLength(2);
      expect(result.additionalProperty?.[0]).toEqual({
        "@type": "PropertyValue",
        name: "ビタミンC",
        value: "1000mg",
      });
      expect(result.additionalProperty?.[1]).toEqual({
        "@type": "PropertyValue",
        name: "ビタミンD",
        value: "25μg",
      });
    });

    it("画像URLを含められる", () => {
      const result = generateProductStructuredData({
        name: "亜鉛サプリ",
        price: 1500,
        imageUrl: "https://example.com/zinc.jpg",
      });

      expect(result.image).toBe("https://example.com/zinc.jpg");
    });

    it("カテゴリを含められる", () => {
      const result = generateProductStructuredData({
        name: "鉄サプリ",
        price: 1800,
        category: "ミネラル",
      });

      expect(result.category).toBe("ミネラル");
    });

    it("priceValidUntilを含む（Google推奨）", () => {
      const result = generateProductStructuredData({
        name: "テスト商品",
        price: 1000,
      });

      expect(result.offers?.priceValidUntil).toBeDefined();
      // 日付形式をチェック（YYYY-MM-DD）
      expect(result.offers?.priceValidUntil).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("hasMerchantReturnPolicyを含む（販売者リスティング必須）", () => {
      const result = generateProductStructuredData({
        name: "テスト商品",
        price: 1000,
      });

      expect(result.offers?.hasMerchantReturnPolicy).toBeDefined();
      expect(result.offers?.hasMerchantReturnPolicy?.["@type"]).toBe(
        "MerchantReturnPolicy",
      );
      expect(result.offers?.hasMerchantReturnPolicy?.applicableCountry).toBe(
        "JP",
      );
    });

    it("shippingDetailsを含む（販売者リスティング必須）", () => {
      const result = generateProductStructuredData({
        name: "テスト商品",
        price: 1000,
      });

      expect(result.offers?.shippingDetails).toBeDefined();
      expect(result.offers?.shippingDetails?.["@type"]).toBe(
        "OfferShippingDetails",
      );
      expect(
        result.offers?.shippingDetails?.shippingDestination?.addressCountry,
      ).toBe("JP");
    });

    it("aggregateRatingが常に含まれる（Google推奨）", () => {
      const result = generateProductStructuredData({
        name: "テスト商品",
        price: 1000,
      });

      expect(result.aggregateRating).toBeDefined();
      expect(result.aggregateRating?.["@type"]).toBe("AggregateRating");
      expect(result.aggregateRating?.bestRating).toBe(5);
      expect(result.aggregateRating?.worstRating).toBe(1);
    });

    it("reviewが常に含まれる（Google推奨）", () => {
      const result = generateProductStructuredData({
        name: "テスト商品",
        price: 1000,
        brand: "テストブランド",
      });

      expect(result.review).toBeDefined();
      expect(result.review).toHaveLength(1);
      expect(result.review?.[0]?.["@type"]).toBe("Review");
      expect(result.review?.[0]?.author?.name).toBe("サプティア編集部");
      expect(result.review?.[0]?.reviewBody).toContain("テストブランドの");
    });
  });

  describe("generateItemListStructuredData", () => {
    it("商品リストの構造化データを生成できる", () => {
      const result = generateItemListStructuredData({
        name: "おすすめビタミンサプリ",
        description: "科学的根拠に基づくビタミンサプリメント",
        items: [
          { name: "ビタミンC 1000mg", url: "https://example.com/vitamin-c" },
          { name: "ビタミンD 2000IU", url: "https://example.com/vitamin-d" },
          { name: "マルチビタミン", url: "https://example.com/multi" },
        ],
      });

      expect(result["@context"]).toBe("https://schema.org");
      expect(result["@type"]).toBe("ItemList");
      expect(result.name).toBe("おすすめビタミンサプリ");
      expect(result.numberOfItems).toBe(3);
      expect(result.itemListElement).toHaveLength(3);

      // 1番目の要素
      expect(result.itemListElement[0]).toEqual({
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Product",
          name: "ビタミンC 1000mg",
          url: "https://example.com/vitamin-c",
        },
      });
    });

    it("位置を手動で指定できる", () => {
      const result = generateItemListStructuredData({
        items: [
          { name: "商品A", position: 5 },
          { name: "商品B", position: 10 },
        ],
      });

      expect(result.itemListElement[0].position).toBe(5);
      expect(result.itemListElement[1].position).toBe(10);
    });
  });

  describe("generateBreadcrumbStructuredData", () => {
    it("パンくずリストの構造化データを生成できる", () => {
      const result = generateBreadcrumbStructuredData([
        { name: "ホーム", url: "https://example.com/" },
        { name: "サプリメント", url: "https://example.com/supplements" },
        { name: "ビタミン", url: "https://example.com/supplements/vitamins" },
        { name: "ビタミンC" },
      ]);

      expect(result["@context"]).toBe("https://schema.org");
      expect(result["@type"]).toBe("BreadcrumbList");
      expect(result.itemListElement).toHaveLength(4);

      // 1番目の要素
      expect(result.itemListElement[0]).toEqual({
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: "https://example.com/",
      });

      // 最後の要素（URLなし）
      expect(result.itemListElement[3]).toEqual({
        "@type": "ListItem",
        position: 4,
        name: "ビタミンC",
        item: undefined,
      });
    });
  });

  describe("generateArticleStructuredData", () => {
    it("記事の構造化データを生成できる", () => {
      const result = generateArticleStructuredData({
        headline: "ビタミンCの効果と摂取方法",
        description: "ビタミンCの健康効果と推奨摂取量について解説",
        imageUrl: "https://example.com/vitamin-c-article.jpg",
        datePublished: "2025-01-15T09:00:00+09:00",
        dateModified: "2025-01-20T14:30:00+09:00",
        authorName: "Suptia編集部",
        publisherName: "Suptia",
        publisherLogoUrl: "https://example.com/logo.png",
        url: "https://example.com/ingredients/vitamin-c",
      });

      expect(result["@context"]).toBe("https://schema.org");
      expect(result["@type"]).toBe("Article");
      expect(result.headline).toBe("ビタミンCの効果と摂取方法");
      expect(result.datePublished).toBe("2025-01-15T09:00:00+09:00");
      expect(result.author).toEqual({
        "@type": "Organization",
        name: "Suptia編集部",
      });
      expect(result.publisher).toEqual({
        "@type": "Organization",
        name: "Suptia",
        logo: {
          "@type": "ImageObject",
          url: "https://example.com/logo.png",
        },
      });
      expect(result.mainEntityOfPage).toEqual({
        "@type": "WebPage",
        "@id": "https://example.com/ingredients/vitamin-c",
      });
    });

    it("最小限の情報でも記事の構造化データを生成できる", () => {
      const result = generateArticleStructuredData({
        headline: "マグネシウムの基礎知識",
      });

      expect(result.headline).toBe("マグネシウムの基礎知識");
      expect(result["@type"]).toBe("Article");
    });
  });

  describe("generateFAQStructuredData", () => {
    it("FAQの構造化データを生成できる", () => {
      const result = generateFAQStructuredData([
        {
          question: "ビタミンCはいつ飲むべきですか？",
          answer:
            "ビタミンCは水溶性のため、朝食後や昼食後に摂取するのが効果的です。",
        },
        {
          question: "1日にどれくらい摂取すべきですか？",
          answer:
            "成人の推奨摂取量は1日100mgですが、健康目的では500-1000mgが一般的です。",
        },
      ]);

      expect(result["@context"]).toBe("https://schema.org");
      expect(result["@type"]).toBe("FAQPage");
      expect(result.mainEntity).toHaveLength(2);

      expect(result.mainEntity[0]).toEqual({
        "@type": "Question",
        name: "ビタミンCはいつ飲むべきですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ビタミンCは水溶性のため、朝食後や昼食後に摂取するのが効果的です。",
        },
      });
    });

    it("空のFAQでも正しい構造を返す", () => {
      const result = generateFAQStructuredData([]);

      expect(result.mainEntity).toEqual([]);
    });
  });

  describe("renderStructuredData", () => {
    it("構造化データをJSON文字列に変換できる", () => {
      const data = generateProductStructuredData({
        name: "テスト商品",
        price: 1000,
      });

      const json = renderStructuredData(data);

      expect(typeof json).toBe("string");
      expect(JSON.parse(json)).toEqual(data);
    });

    it("整形されたJSONを出力する", () => {
      const data = { name: "test" };
      const json = renderStructuredData(data);

      // インデント付きで整形されている
      expect(json).toContain("\n");
      expect(json).toContain("  ");
    });
  });

  describe("mergeStructuredData", () => {
    it("複数の構造化データを配列に統合できる", () => {
      const product = generateProductStructuredData({
        name: "商品A",
        price: 1000,
      });

      const breadcrumb = generateBreadcrumbStructuredData([
        { name: "ホーム", url: "/" },
        { name: "商品A" },
      ]);

      const merged = mergeStructuredData([product, breadcrumb]);

      expect(merged).toHaveLength(2);
      expect(merged[0]).toEqual(product);
      expect(merged[1]).toEqual(breadcrumb);
    });

    it("null/undefinedを除外する", () => {
      const product = generateProductStructuredData({
        name: "商品B",
        price: 2000,
      });

      const merged = mergeStructuredData([product, null, undefined, false]);

      expect(merged).toHaveLength(1);
      expect(merged[0]).toEqual(product);
    });
  });

  describe("Real-world Scenarios", () => {
    it("商品詳細ページの構造化データを生成できる", () => {
      const productData = generateProductStructuredData({
        name: "Now Foods ビタミンC 1000mg 250粒",
        description:
          "高品質なアスコルビン酸を使用したビタミンCサプリメント。1粒で1000mgのビタミンCを摂取できます。",
        imageUrl: "https://example.com/products/vitamin-c.jpg",
        brand: "Now Foods",
        price: 1980,
        priceCurrency: "JPY",
        url: "https://example.com/products/vitamin-c-1000mg",
        availability: "InStock",
        rating: {
          value: 4.7,
          count: 350,
        },
        sku: "NOW-VC-1000-250",
        gtin: "4901234567890",
        category: "ビタミン",
        ingredients: [
          { name: "ビタミンC（アスコルビン酸）", amount: 1000, unit: "mg" },
        ],
      });

      const breadcrumbData = generateBreadcrumbStructuredData([
        { name: "ホーム", url: "https://example.com/" },
        { name: "サプリメント", url: "https://example.com/supplements" },
        { name: "ビタミン", url: "https://example.com/supplements/vitamins" },
        { name: "ビタミンC 1000mg" },
      ]);

      const allData = mergeStructuredData([productData, breadcrumbData]);

      expect(allData).toHaveLength(2);
      expect(allData[0]).toHaveProperty("@type", "Product");
      expect(allData[1]).toHaveProperty("@type", "BreadcrumbList");
    });

    it("成分ガイドページの構造化データを生成できる", () => {
      const articleData = generateArticleStructuredData({
        headline: "ビタミンC（アスコルビン酸）完全ガイド",
        description:
          "ビタミンCの効果、推奨摂取量、副作用、研究結果まで徹底解説。科学的根拠に基づいた信頼できる情報を提供します。",
        imageUrl: "https://example.com/articles/vitamin-c-guide.jpg",
        datePublished: "2025-01-15T09:00:00+09:00",
        dateModified: "2025-01-20T14:30:00+09:00",
        authorName: "Suptia編集部",
        publisherName: "Suptia",
        publisherLogoUrl: "https://example.com/logo.png",
        url: "https://example.com/ingredients/vitamin-c",
      });

      const faqData = generateFAQStructuredData([
        {
          question: "ビタミンCの1日の推奨摂取量は？",
          answer:
            "成人の推奨摂取量は100mgですが、免疫力強化や美肌目的では500-1000mgが一般的です。",
        },
        {
          question: "ビタミンCはいつ飲むべき？",
          answer:
            "水溶性ビタミンなので、朝食後や昼食後に分けて摂取すると吸収率が高まります。",
        },
      ]);

      const breadcrumbData = generateBreadcrumbStructuredData([
        { name: "ホーム", url: "https://example.com/" },
        { name: "成分ガイド", url: "https://example.com/ingredients" },
        { name: "ビタミンC" },
      ]);

      const allData = mergeStructuredData([
        articleData,
        faqData,
        breadcrumbData,
      ]);

      expect(allData).toHaveLength(3);
      expect(allData[0]).toHaveProperty("@type", "Article");
      expect(allData[1]).toHaveProperty("@type", "FAQPage");
      expect(allData[2]).toHaveProperty("@type", "BreadcrumbList");
    });

    it("商品リストページの構造化データを生成できる", () => {
      const itemListData = generateItemListStructuredData({
        name: "免疫力強化サプリメント トップ10",
        description: "科学的根拠に基づく免疫力強化に効果的なサプリメント",
        items: [
          {
            name: "ビタミンC 1000mg",
            url: "https://example.com/products/vitamin-c",
          },
          {
            name: "ビタミンD 2000IU",
            url: "https://example.com/products/vitamin-d",
          },
          {
            name: "亜鉛 50mg",
            url: "https://example.com/products/zinc",
          },
        ],
      });

      expect(itemListData.numberOfItems).toBe(3);
      expect(itemListData.itemListElement[0].position).toBe(1);
    });
  });
});
