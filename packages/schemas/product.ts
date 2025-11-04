import { defineField, defineType } from "sanity";
import { validateCompliance } from "./utils/compliance";

export const product = defineType({
  name: "product",
  title: "商品",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "商品名",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "スラッグ",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "brand",
      title: "ブランド",
      type: "reference",
      to: [{ type: "brand" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "source",
      title: "取得元ECサイト",
      type: "string",
      options: {
        list: [
          { title: "楽天市場", value: "rakuten" },
          { title: "Yahoo!ショッピング", value: "yahoo" },
          { title: "Amazon", value: "amazon" },
          { title: "iHerb", value: "iherb" },
          { title: "手動登録", value: "manual" },
        ],
      },
      description: "商品データの取得元ECサイト（フィルタリングに使用）",
    }),
    defineField({
      name: "janCode",
      title: "JANコード（便利なショートカット）",
      type: "string",
      description: "identifiers.janのショートカット（クエリの簡略化用）",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true;
          const isValid = /^\d{8}$|^\d{13}$/.test(value);
          return (
            isValid || "JANコードは8桁または13桁の数字である必要があります"
          );
        }),
    }),
    defineField({
      name: "itemCode",
      title: "EC商品コード",
      type: "string",
      description: "楽天itemCode、Yahoo商品コードなど",
    }),
    defineField({
      name: "affiliateUrl",
      title: "アフィリエイトURL",
      type: "url",
      description: "メインのアフィリエイトリンク",
    }),
    defineField({
      name: "identifiers",
      title: "商品識別子",
      type: "object",
      description:
        "JANコード、ASIN等の商品識別番号（価格取得の精度向上に使用）",
      fields: [
        {
          name: "jan",
          title: "JANコード",
          type: "string",
          description: "日本の標準商品コード（13桁または8桁）",
          validation: (Rule) =>
            Rule.custom((value) => {
              if (!value) return true; // オプショナル
              const isValid = /^\d{8}$|^\d{13}$/.test(value);
              return (
                isValid || "JANコードは8桁または13桁の数字である必要があります"
              );
            }),
        },
        {
          name: "asin",
          title: "ASIN",
          type: "string",
          description: "Amazon商品識別番号（10文字）",
          validation: (Rule) =>
            Rule.custom((value) => {
              if (!value) return true; // オプショナル
              const isValid = /^[A-Z0-9]{10}$/.test(value);
              return isValid || "ASINは10文字の英数字である必要があります";
            }),
        },
        {
          name: "upc",
          title: "UPC",
          type: "string",
          description: "米国の標準商品コード（12桁）",
          validation: (Rule) =>
            Rule.custom((value) => {
              if (!value) return true; // オプショナル
              const isValid = /^\d{12}$/.test(value);
              return isValid || "UPCは12桁の数字である必要があります";
            }),
        },
        {
          name: "ean",
          title: "EAN",
          type: "string",
          description: "欧州商品コード（13桁）",
          validation: (Rule) =>
            Rule.custom((value) => {
              if (!value) return true; // オプショナル
              const isValid = /^\d{13}$/.test(value);
              return isValid || "EANは13桁の数字である必要があります";
            }),
        },
        {
          name: "rakutenItemCode",
          title: "楽天商品コード",
          type: "string",
          description: "楽天市場の商品コード（例: shopid:itemid）",
        },
        {
          name: "yahooCode",
          title: "Yahoo!商品コード",
          type: "string",
          description: "Yahoo!ショッピングの商品コード",
        },
      ],
    }),
    defineField({
      name: "ingredients",
      title: "成分構成",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "ingredient",
              title: "成分",
              type: "reference",
              to: [{ type: "ingredient" }],
              validation: (Rule) => Rule.required(),
            },
            {
              name: "amountMgPerServing",
              title: "1回分あたりの含有量 (mg)",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            },
          ],
          preview: {
            select: {
              ingredientName: "ingredient.name",
              amount: "amountMgPerServing",
            },
            prepare({ ingredientName, amount }) {
              return {
                title: ingredientName || "成分未選択",
                subtitle: `${amount}mg`,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "servingsPerDay",
      title: "1日あたりの摂取回数",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "servingsPerContainer",
      title: "1容器あたりの回数",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "priceJPY",
      title: "価格 (円)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "urls",
      title: "購入リンク",
      type: "object",
      fields: [
        {
          name: "amazon",
          title: "Amazon",
          type: "url",
        },
        {
          name: "rakuten",
          title: "楽天",
          type: "url",
        },
        {
          name: "iherb",
          title: "iHerb",
          type: "url",
        },
      ],
    }),
    defineField({
      name: "images",
      title: "商品画像",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: "externalImageUrl",
      title: "外部画像URL",
      type: "url",
      description: "EC APIから取得した商品画像のURL（楽天・Yahoo等）",
    }),
    defineField({
      name: "warnings",
      title: "注意事項",
      type: "array",
      of: [{ type: "string" }],
      description: "アレルギー情報、相互作用など",
    }),
    defineField({
      name: "references",
      title: "参考文献",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "タイトル",
              type: "string",
            },
            {
              name: "url",
              title: "URL",
              type: "url",
            },
            {
              name: "source",
              title: "出典",
              type: "string",
              description: "PubMed, 厚生労働省など",
            },
          ],
        },
      ],
      description: "科学的根拠となる論文や公的機関の情報",
    }),
    defineField({
      name: "description",
      title: "商品説明",
      type: "text",
      validation: (Rule) =>
        Rule.custom((value) => {
          const result = validateCompliance(value);
          return result.isValid
            ? true
            : result.message || "薬機法違反の可能性があります";
        }).warning(),
    }),
    defineField({
      name: "allIngredients",
      title: "全成分表示",
      type: "text",
      description:
        "全成分リスト（有効成分、添加物、保存料を含む）。商品パッケージや公式情報に記載されている全成分を入力してください。",
      rows: 5,
    }),
    defineField({
      name: "form",
      title: "剤形",
      type: "string",
      options: {
        list: [
          { title: "カプセル", value: "capsule" },
          { title: "タブレット", value: "tablet" },
          { title: "ソフトジェル", value: "softgel" },
          { title: "パウダー", value: "powder" },
          { title: "リキッド", value: "liquid" },
          { title: "グミ", value: "gummy" },
        ],
      },
    }),
    defineField({
      name: "thirdPartyTested",
      title: "第三者機関検査済み",
      type: "boolean",
      description: "品質検査の有無",
    }),
    defineField({
      name: "scores",
      title: "評価スコア",
      type: "object",
      description: "各種評価スコア（0-100）",
      fields: [
        {
          name: "safety",
          title: "安全性スコア",
          type: "number",
          validation: (Rule) => Rule.min(0).max(100),
          description: "成分の安全性、第三者機関検査、警告事項などに基づく",
        },
        {
          name: "evidence",
          title: "エビデンススコア",
          type: "number",
          validation: (Rule) => Rule.min(0).max(100),
          description: "科学的根拠の質と量に基づく",
        },
        {
          name: "costEffectiveness",
          title: "コストパフォーマンス",
          type: "number",
          validation: (Rule) => Rule.min(0).max(100),
          description: "成分量あたりの価格、実効コストに基づく",
        },
        {
          name: "overall",
          title: "総合スコア",
          type: "number",
          validation: (Rule) => Rule.min(0).max(100),
          description: "上記3つのスコアを総合した評価",
        },
      ],
    }),
    defineField({
      name: "reviewStats",
      title: "レビュー統計",
      type: "object",
      description: "ユーザーレビューの集計データ",
      fields: [
        {
          name: "averageRating",
          title: "平均評価",
          type: "number",
          validation: (Rule) => Rule.min(0).max(5),
          description: "5段階評価の平均値",
        },
        {
          name: "reviewCount",
          title: "レビュー数",
          type: "number",
          validation: (Rule) => Rule.min(0),
          description: "総レビュー件数",
        },
      ],
    }),
    defineField({
      name: "availability",
      title: "入手可能性",
      type: "string",
      options: {
        list: [
          { title: "在庫あり", value: "in-stock" },
          { title: "在庫僅少", value: "low-stock" },
          { title: "入荷待ち", value: "out-of-stock" },
          { title: "販売終了", value: "discontinued" },
        ],
      },
      initialValue: "in-stock",
      description: "商品の入手可能性ステータス",
    }),
    defineField({
      name: "tierRatings",
      title: "Tierランク評価",
      type: "object",
      description:
        "5つの評価軸でのS~Dランク（価格・コスパ・含有量・エビデンス・安全性）",
      fields: [
        {
          name: "priceRank",
          title: "💰 価格ランク",
          type: "string",
          options: {
            list: [
              { title: "Sランク（最高）", value: "S" },
              { title: "Aランク（優秀）", value: "A" },
              { title: "Bランク（良好）", value: "B" },
              { title: "Cランク（普通）", value: "C" },
              { title: "Dランク（要改善）", value: "D" },
            ],
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: "costEffectivenessRank",
          title: "💡 コスパランク",
          type: "string",
          options: {
            list: [
              { title: "Sランク（最高）", value: "S" },
              { title: "Aランク（優秀）", value: "A" },
              { title: "Bランク（良好）", value: "B" },
              { title: "Cランク（普通）", value: "C" },
              { title: "Dランク（要改善）", value: "D" },
            ],
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: "contentRank",
          title: "📊 含有量ランク",
          type: "string",
          options: {
            list: [
              { title: "Sランク（最高）", value: "S" },
              { title: "Aランク（優秀）", value: "A" },
              { title: "Bランク（良好）", value: "B" },
              { title: "Cランク（普通）", value: "C" },
              { title: "Dランク（要改善）", value: "D" },
            ],
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: "evidenceRank",
          title: "🔬 エビデンスランク",
          type: "string",
          options: {
            list: [
              { title: "Sランク（最高）", value: "S" },
              { title: "Aランク（優秀）", value: "A" },
              { title: "Bランク（良好）", value: "B" },
              { title: "Cランク（普通）", value: "C" },
              { title: "Dランク（要改善）", value: "D" },
            ],
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: "safetyRank",
          title: "🛡️ 安全性ランク",
          type: "string",
          options: {
            list: [
              { title: "Sランク（最高）", value: "S" },
              { title: "Aランク（優秀）", value: "A" },
              { title: "Bランク（良好）", value: "B" },
              { title: "Cランク（普通）", value: "C" },
              { title: "Dランク（要改善）", value: "D" },
            ],
          },
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "costPerDay",
      title: "1日あたりのコスト（円）",
      type: "number",
      description:
        "価格 ÷ (1容器あたりの回数 ÷ 1日あたりの摂取回数) で自動計算",
      readOnly: true,
    }),
    defineField({
      name: "priceData",
      title: "価格データ（自動取得）",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "source",
              title: "ソース",
              type: "string",
              options: {
                list: [
                  { title: "楽天", value: "rakuten" },
                  { title: "Yahoo!ショッピング", value: "yahoo" },
                  { title: "Amazon", value: "amazon" },
                  { title: "iHerb", value: "iherb" },
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: "shopName",
              title: "店舗名",
              type: "string",
              description:
                "楽天市場内の店舗名（例: マツモトキヨシ楽天市場店）、Amazonセラー名など",
            },
            {
              name: "amount",
              title: "価格（円）",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            },
            {
              name: "currency",
              title: "通貨",
              type: "string",
              initialValue: "JPY",
            },
            {
              name: "url",
              title: "購入URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "fetchedAt",
              title: "取得日時",
              type: "datetime",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "confidence",
              title: "信頼度",
              type: "number",
              validation: (Rule) => Rule.min(0).max(1),
              description: "0〜1の範囲（1が最高信頼度）",
            },
          ],
          preview: {
            select: {
              source: "source",
              shopName: "shopName",
              amount: "amount",
              fetchedAt: "fetchedAt",
            },
            prepare({ source, shopName, amount, fetchedAt }) {
              const shopLabel = shopName ? ` - ${shopName}` : "";
              return {
                title: `${source}${shopLabel}: ¥${amount?.toLocaleString()}`,
                subtitle: fetchedAt
                  ? new Date(fetchedAt).toLocaleString("ja-JP")
                  : "未取得",
              };
            },
          },
        },
      ],
      description: "API経由で自動取得された最新の価格情報",
    }),
    defineField({
      name: "priceHistory",
      title: "価格履歴",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "source",
              title: "ソース",
              type: "string",
            },
            {
              name: "amount",
              title: "価格（円）",
              type: "number",
            },
            {
              name: "recordedAt",
              title: "記録日時",
              type: "datetime",
            },
          ],
        },
      ],
      description: "過去の価格変動履歴（最大100件）",
      readOnly: true,
    }),
    // キャンペーン・割引情報
    defineField({
      name: "originalPrice",
      title: "元の価格（割引前）",
      type: "number",
      description: "割引前の価格（円）。設定すると割引率が自動計算されます",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "discountPercentage",
      title: "割引率（%）",
      type: "number",
      description: "自動計算: ((元の価格 - 現在価格) / 元の価格) × 100",
      readOnly: true,
    }),
    defineField({
      name: "isCampaign",
      title: "キャンペーン商品",
      type: "boolean",
      description: "キャンペーン対象商品としてマークする",
      initialValue: false,
    }),
    defineField({
      name: "campaignEndDate",
      title: "キャンペーン終了日",
      type: "datetime",
      description: "キャンペーンの終了日時",
      hidden: ({ document }) => !document?.isCampaign,
    }),
    defineField({
      name: "recommendationScore",
      title: "おすすめスコア",
      type: "number",
      description:
        "おすすめ度スコア = (キャンペーン: 100点) + (割引率 × 2) ※自動計算",
      initialValue: 0,
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      brandName: "brand.name",
      price: "priceJPY",
      media: "images.0",
    },
    prepare({ title, brandName, price, media }) {
      return {
        title,
        subtitle: `${brandName || "ブランド未設定"} - ¥${price?.toLocaleString()}`,
        media,
      };
    },
  },
});
