import { defineField, defineType } from "sanity";

/**
 * 薬機法・景品表示法コンプライアンスルール
 *
 * NGワード（禁止表現）とOKワード（推奨表現）を管理し、
 * コンテンツ作成時の薬機法違反を防ぎます。
 */
export const complianceRule = defineType({
  name: "complianceRule",
  title: "薬機法・コンプライアンスルール",
  type: "document",
  groups: [
    {
      name: "rule",
      title: "ルール",
    },
    {
      name: "examples",
      title: "使用例",
    },
    {
      name: "meta",
      title: "メタ情報",
    },
  ],
  fields: [
    // ルールID
    defineField({
      name: "ruleId",
      title: "ルールID",
      type: "string",
      description: "一意のルール識別子（例: yakuji-001）",
      validation: (Rule) => Rule.required(),
      group: "rule",
    }),

    // NGワード
    defineField({
      name: "ngWord",
      title: "NGワード（禁止表現）",
      type: "string",
      description: "使用してはいけない表現",
      validation: (Rule) => Rule.required(),
      group: "rule",
    }),

    // 重要度
    defineField({
      name: "severity",
      title: "重要度",
      type: "string",
      options: {
        list: [
          { title: "重大（即違反）", value: "critical" },
          { title: "警告（注意必要）", value: "warning" },
          { title: "推奨（避けるべき）", value: "recommendation" },
        ],
      },
      validation: (Rule) => Rule.required(),
      group: "rule",
    }),

    // カテゴリ
    defineField({
      name: "category",
      title: "カテゴリ",
      type: "string",
      options: {
        list: [
          { title: "医療・治療表現", value: "medical-claims" },
          { title: "効能・効果表現", value: "efficacy-claims" },
          { title: "最上級表現", value: "superlative" },
          { title: "誇大広告", value: "exaggeration" },
          { title: "安全性表現", value: "safety-claims" },
          { title: "保証表現", value: "guarantee" },
          { title: "比較表現", value: "comparison" },
          { title: "その他", value: "other" },
        ],
      },
      validation: (Rule) => Rule.required(),
      group: "rule",
    }),

    // 適用される法律
    defineField({
      name: "law",
      title: "適用される法律",
      type: "string",
      options: {
        list: [
          { title: "薬機法（医薬品医療機器等法）", value: "薬機法" },
          { title: "景品表示法", value: "景品表示法" },
          { title: "健康増進法", value: "健康増進法" },
          { title: "食品表示法", value: "食品表示法" },
        ],
      },
      validation: (Rule) => Rule.required(),
      group: "rule",
    }),

    // OKワード（推奨表現）
    defineField({
      name: "okWords",
      title: "OKワード（推奨表現）",
      type: "array",
      of: [{ type: "string" }],
      description: "NGワードの代わりに使える表現",
      validation: (Rule) => Rule.required().min(1),
      group: "rule",
    }),

    // 詳細説明
    defineField({
      name: "explanation",
      title: "詳細説明",
      type: "text",
      rows: 4,
      description: "なぜNGなのか、どう言い換えるべきかを説明",
      validation: (Rule) => Rule.required(),
      group: "rule",
    }),

    // NG例文
    defineField({
      name: "ngExamples",
      title: "NG例文",
      type: "array",
      of: [{ type: "string" }],
      description: "実際の違反例",
      group: "examples",
    }),

    // OK例文
    defineField({
      name: "okExamples",
      title: "OK例文",
      type: "array",
      of: [{ type: "string" }],
      description: "正しい表現例",
      group: "examples",
    }),

    // 参考URL
    defineField({
      name: "referenceUrls",
      title: "参考URL",
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
          ],
        },
      ],
      description: "関連する法律・ガイドラインへのリンク",
      group: "meta",
    }),

    // 適用対象
    defineField({
      name: "appliesTo",
      title: "適用対象",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "商品説明", value: "product-description" },
          { title: "成分ガイド", value: "ingredient-guide" },
          { title: "ブログ記事", value: "blog-post" },
          { title: "広告コピー", value: "advertising" },
          { title: "FAQ", value: "faq" },
          { title: "レビュー", value: "review" },
        ],
      },
      description: "このルールが適用されるコンテンツタイプ",
      group: "meta",
    }),

    // 有効フラグ
    defineField({
      name: "isActive",
      title: "有効",
      type: "boolean",
      description: "チェック時にこのルールを使用するか",
      initialValue: true,
      group: "meta",
    }),

    // 更新日
    defineField({
      name: "lastUpdated",
      title: "最終更新日",
      type: "datetime",
      description: "ルールの最終更新日時",
      group: "meta",
    }),

    // 更新者メモ
    defineField({
      name: "updateNote",
      title: "更新メモ",
      type: "text",
      rows: 3,
      description: "更新理由や変更内容のメモ",
      group: "meta",
    }),
  ],

  preview: {
    select: {
      ngWord: "ngWord",
      severity: "severity",
      law: "law",
      category: "category",
    },
    prepare({ ngWord, severity, law, category }) {
      const severityEmoji = {
        critical: "🚫",
        warning: "⚠️",
        recommendation: "💡",
      };

      return {
        title: `${severityEmoji[severity as keyof typeof severityEmoji] || "📝"} ${ngWord}`,
        subtitle: `${law} | ${category}`,
      };
    },
  },
});
