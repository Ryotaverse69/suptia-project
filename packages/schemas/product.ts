import { defineField, defineType } from "sanity";

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
      name: "warnings",
      title: "注意事項",
      type: "array",
      of: [{ type: "string" }],
      description: "アレルギー情報、相互作用など",
    }),
    defineField({
      name: "description",
      title: "商品説明",
      type: "text",
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
                  { title: "Amazon", value: "amazon" },
                  { title: "iHerb", value: "iherb" },
                ],
              },
              validation: (Rule) => Rule.required(),
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
              amount: "amount",
              fetchedAt: "fetchedAt",
            },
            prepare({ source, amount, fetchedAt }) {
              return {
                title: `${source}: ¥${amount?.toLocaleString()}`,
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
