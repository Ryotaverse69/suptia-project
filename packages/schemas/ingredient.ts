import { defineField, defineType } from "sanity";

export const ingredient = defineType({
  name: "ingredient",
  title: "成分ガイド",
  type: "document",
  groups: [
    {
      name: "basic",
      title: "基本情報",
    },
    {
      name: "content",
      title: "コンテンツ",
    },
    {
      name: "scientific",
      title: "科学的情報",
    },
    {
      name: "safety",
      title: "安全性",
    },
    {
      name: "seo",
      title: "SEO設定",
    },
  ],
  fields: [
    // 基本情報
    defineField({
      name: "name",
      title: "成分名（日本語）",
      type: "string",
      validation: (Rule) => Rule.required(),
      group: "basic",
    }),
    defineField({
      name: "nameEn",
      title: "成分名（英語）",
      type: "string",
      validation: (Rule) => Rule.required(),
      group: "basic",
    }),
    defineField({
      name: "slug",
      title: "スラッグ",
      type: "slug",
      options: {
        source: "nameEn",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      group: "basic",
    }),
    defineField({
      name: "category",
      title: "カテゴリー",
      type: "string",
      options: {
        list: [
          { title: "ビタミン", value: "ビタミン" },
          { title: "ミネラル", value: "ミネラル" },
          { title: "脂肪酸", value: "脂肪酸" },
          { title: "アミノ酸", value: "アミノ酸" },
          { title: "プロバイオティクス", value: "プロバイオティクス" },
          { title: "ハーブ", value: "ハーブ" },
          { title: "その他", value: "その他" },
        ],
      },
      validation: (Rule) => Rule.required(),
      group: "basic",
    }),
    defineField({
      name: "description",
      title: "概要説明",
      type: "text",
      rows: 4,
      description: "成分の簡潔な説明（200-300文字程度）",
      validation: (Rule) => Rule.required(),
      group: "content",
    }),

    // コンテンツ
    defineField({
      name: "benefits",
      title: "主な効果・効能",
      type: "array",
      of: [{ type: "string" }],
      description: "箇条書きで効果を記載",
      validation: (Rule) => Rule.required().min(3),
      group: "content",
    }),
    defineField({
      name: "recommendedDosage",
      title: "推奨摂取量",
      type: "text",
      rows: 3,
      description: "推奨摂取量の詳細な説明",
      validation: (Rule) => Rule.required(),
      group: "content",
    }),
    defineField({
      name: "foodSources",
      title: "豊富に含まれる食品",
      type: "array",
      of: [{ type: "string" }],
      description: "食品名と含有量を記載（例：サケ（100gあたり約25μg））",
      group: "content",
    }),

    // 科学的情報
    defineField({
      name: "evidenceLevel",
      title: "科学的根拠レベル",
      type: "string",
      options: {
        list: [
          { title: "高", value: "高" },
          { title: "中", value: "中" },
          { title: "低", value: "低" },
        ],
      },
      validation: (Rule) => Rule.required(),
      group: "scientific",
    }),
    defineField({
      name: "scientificBackground",
      title: "科学的背景・エビデンス",
      type: "text",
      rows: 5,
      description: "研究や科学的根拠についての詳細説明",
      validation: (Rule) => Rule.required(),
      group: "scientific",
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
              title: "文献名",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "url",
              title: "URL",
              type: "url",
            },
          ],
        },
      ],
      group: "scientific",
    }),

    // 安全性
    defineField({
      name: "sideEffects",
      title: "副作用・注意点",
      type: "array",
      of: [{ type: "string" }],
      description: "副作用や注意事項を箇条書きで記載",
      group: "safety",
    }),
    defineField({
      name: "interactions",
      title: "他の成分・医薬品との相互作用",
      type: "array",
      of: [{ type: "string" }],
      description: "相互作用について記載",
      group: "safety",
    }),

    // FAQ
    defineField({
      name: "faqs",
      title: "よくある質問",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "question",
              title: "質問",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "answer",
              title: "回答",
              type: "text",
              rows: 4,
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: "question",
              subtitle: "answer",
            },
          },
        },
      ],
      group: "content",
    }),

    // 関連情報
    defineField({
      name: "relatedIngredients",
      title: "関連する成分",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "ingredient" }],
        },
      ],
      group: "content",
    }),

    // SEO
    defineField({
      name: "seoTitle",
      title: "SEOタイトル",
      type: "string",
      description: "検索結果に表示されるタイトル（未設定の場合は自動生成）",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO説明文",
      type: "text",
      rows: 3,
      description: "検索結果に表示される説明文（未設定の場合は自動生成）",
      group: "seo",
    }),
    defineField({
      name: "seoKeywords",
      title: "SEOキーワード",
      type: "array",
      of: [{ type: "string" }],
      description: "検索で引っかかるキーワード",
      group: "seo",
    }),

    // 旧フィールド（互換性のため残す）
    defineField({
      name: "synonyms",
      title: "別名・同義語",
      type: "array",
      of: [{ type: "string" }],
      description: "検索で使用される別名や同義語",
      hidden: true,
    }),
    defineField({
      name: "mechanisms",
      title: "作用機序",
      type: "array",
      of: [{ type: "string" }],
      description: "体内での主な作用メカニズム",
      hidden: true,
    }),
    defineField({
      name: "safetyNotes",
      title: "安全性に関する注意",
      type: "array",
      of: [{ type: "string" }],
      description: "副作用、相互作用、注意事項など",
      hidden: true,
    }),
    defineField({
      name: "tags",
      title: "タグ",
      type: "array",
      of: [{ type: "string" }],
      description: "健康目標や効果に関するタグ",
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "nameEn",
      category: "category",
      evidenceLevel: "evidenceLevel",
    },
    prepare({ title, subtitle, category, evidenceLevel }) {
      return {
        title,
        subtitle: `${subtitle} | ${category} | 根拠: ${evidenceLevel}`,
      };
    },
  },
});
