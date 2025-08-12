import { defineField, defineType } from "sanity";

export const persona = defineType({
  name: "persona",
  title: "ユーザーペルソナ",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "ペルソナ名",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "例: 妊娠中の女性、高血圧の高齢者など",
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
      name: "tags",
      title: "タグ",
      type: "array",
      of: [
        {
          type: "string",
          options: {
            list: [
              { title: "妊娠中", value: "pregnancy" },
              { title: "授乳中", value: "lactation" },
              { title: "疾患あり", value: "condition" },
              { title: "服薬中", value: "meds" },
              { title: "刺激物敏感", value: "stimulantSensitivity" },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "description",
      title: "説明",
      type: "text",
      description: "このペルソナの特徴や背景",
    }),
    defineField({
      name: "healthGoals",
      title: "健康目標",
      type: "array",
      of: [{ type: "string" }],
      description: "一般的な健康目標（疲労回復、美肌など）",
    }),
    defineField({
      name: "restrictions",
      title: "制限事項",
      type: "array",
      of: [{ type: "string" }],
      description: "避けるべき成分や注意事項",
    }),
    defineField({
      name: "recommendedIngredients",
      title: "推奨成分",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "ingredient" }],
        },
      ],
      description: "このペルソナに特に推奨される成分",
    }),
    defineField({
      name: "avoidIngredients",
      title: "避けるべき成分",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "ingredient" }],
        },
      ],
      description: "このペルソナが避けるべき成分",
    }),
    defineField({
      name: "notes",
      title: "備考",
      type: "text",
      description: "追加の注意事項や特記事項",
    }),
  ],
  preview: {
    select: {
      title: "name",
      tags: "tags",
      description: "description",
    },
    prepare({ title, tags, description }) {
      const tagList = tags?.join(", ") || "";
      return {
        title,
        subtitle: `${tagList} - ${description?.substring(0, 50)}...`,
      };
    },
  },
});
