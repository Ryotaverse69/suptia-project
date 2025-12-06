import { defineField, defineType } from "sanity";

/**
 * 添加物オーバーライドスキーマ
 *
 * TSの静的データを補完・上書きするためのSanityドキュメント
 * - 新しい添加物の追加
 * - 既存データの更新（安全性グレード変更など）
 * - UI用の詳細説明
 */
export const additive = defineType({
  name: "additive",
  title: "添加物",
  type: "document",
  fields: [
    defineField({
      name: "additiveId",
      title: "添加物ID",
      type: "string",
      description:
        "静的データのIDと一致させる（例: titanium-dioxide）。新規追加の場合は新しいIDを設定",
      validation: (Rule) =>
        Rule.required().regex(
          /^[a-z0-9-]+$/,
          "英小文字、数字、ハイフンのみ使用可能",
        ),
    }),
    defineField({
      name: "name",
      title: "日本語名",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "aliases",
      title: "別名リスト",
      type: "array",
      of: [{ type: "string" }],
      description: "E番号、化学名、略称など",
    }),
    defineField({
      name: "category",
      title: "カテゴリ",
      type: "string",
      options: {
        list: [
          { title: "保存料", value: "preservative" },
          { title: "酸化防止剤", value: "antioxidant" },
          { title: "着色料", value: "colorant" },
          { title: "甘味料", value: "sweetener" },
          { title: "乳化剤", value: "emulsifier" },
          { title: "安定剤", value: "stabilizer" },
          { title: "増粘剤", value: "thickener" },
          { title: "コーティング剤", value: "coating" },
          { title: "結合剤", value: "binder" },
          { title: "賦形剤", value: "filler" },
          { title: "香料", value: "flavor" },
          { title: "pH調整剤", value: "acidity-regulator" },
          { title: "固結防止剤", value: "anti-caking" },
          { title: "滑沢剤", value: "lubricant" },
          { title: "カプセル素材", value: "capsule" },
          { title: "その他", value: "other" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "safetyGrade",
      title: "安全性グレード",
      type: "string",
      options: {
        list: [
          { title: "✅ 安全（長期摂取OK）", value: "safe" },
          { title: "⚠️ 注意（条件付き）", value: "caution" },
          { title: "❌ 回避推奨", value: "avoid" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "concerns",
      title: "懸念事項",
      type: "array",
      of: [{ type: "string" }],
      description: "この添加物の懸念点をリストアップ",
    }),
    defineField({
      name: "contraindications",
      title: "禁忌情報",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "condition",
              title: "対象条件",
              type: "string",
              description: "例: 妊娠中、糖尿病、フェニルケトン尿症",
            },
            {
              name: "severity",
              title: "重要度",
              type: "string",
              options: {
                list: [
                  { title: "重大（絶対禁忌）", value: "critical" },
                  { title: "警告（注意が必要）", value: "warning" },
                  { title: "情報（念のため確認）", value: "info" },
                ],
              },
            },
            {
              name: "description",
              title: "説明",
              type: "text",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "adiMgPerKg",
      title: "1日許容摂取量（ADI）",
      type: "number",
      description: "mg/kg体重/日。設定なしの場合は空欄",
    }),
    defineField({
      name: "rationale",
      title: "判定理由",
      type: "object",
      description: "安全性グレードの判定根拠（AI推薦用）",
      fields: [
        {
          name: "summary",
          title: "要約",
          type: "text",
          rows: 3,
        },
        {
          name: "sources",
          title: "データソース",
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
                      { title: "厚生労働省", value: "mhlw" },
                      { title: "JECFA (FAO/WHO)", value: "jecfa" },
                      { title: "EFSA", value: "efsa" },
                      { title: "EWG", value: "ewg" },
                      { title: "Suptia独自", value: "suptia" },
                    ],
                  },
                },
                {
                  name: "detail",
                  title: "詳細",
                  type: "text",
                },
                {
                  name: "url",
                  title: "参照URL",
                  type: "url",
                },
              ],
            },
          ],
        },
        {
          name: "lastReviewed",
          title: "最終レビュー日",
          type: "date",
        },
      ],
    }),
    defineField({
      name: "usageDescription",
      title: "一般的な用途",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "supplementPurpose",
      title: "サプリメントでの使用目的",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "uiDescription",
      title: "UI用詳細説明",
      type: "text",
      rows: 5,
      description: "ユーザー向けの分かりやすい説明文",
    }),
    defineField({
      name: "isOverride",
      title: "静的データを上書き",
      type: "boolean",
      description:
        "ONにすると、同じIDの静的データを上書きします。OFFの場合は新規追加として扱われます",
      initialValue: false,
    }),
    defineField({
      name: "isActive",
      title: "有効",
      type: "boolean",
      description: "OFFにするとこの添加物はチェック対象外になります",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      additiveId: "additiveId",
      safetyGrade: "safetyGrade",
      category: "category",
    },
    prepare({ title, additiveId, safetyGrade, category }) {
      const gradeIcon =
        safetyGrade === "safe" ? "✅" : safetyGrade === "caution" ? "⚠️" : "❌";
      return {
        title: `${gradeIcon} ${title}`,
        subtitle: `${additiveId} | ${category}`,
      };
    },
  },
});
