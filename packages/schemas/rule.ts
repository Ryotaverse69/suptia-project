import { defineField, defineType } from "sanity";

export const rule = defineType({
  name: "rule",
  title: "コンプライアンスルール",
  type: "document",
  fields: [
    defineField({
      name: "personaTag",
      title: "ペルソナタグ",
      type: "string",
      options: {
        list: [
          { title: "妊娠中", value: "pregnancy" },
          { title: "授乳中", value: "lactation" },
          { title: "疾患あり", value: "condition" },
          { title: "服薬中", value: "meds" },
          { title: "刺激物敏感", value: "stimulantSensitivity" },
          { title: "全般", value: "general" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ingredient",
      title: "対象成分",
      type: "reference",
      to: [{ type: "ingredient" }],
      description: "特定成分に関するルールの場合",
    }),
    defineField({
      name: "interaction",
      title: "相互作用・注意事項",
      type: "text",
      validation: (Rule) => Rule.required(),
      description: "具体的な相互作用や注意すべき内容",
    }),
    defineField({
      name: "severity",
      title: "重要度",
      type: "string",
      options: {
        list: [
          { title: "低 - 注意喚起", value: "low" },
          { title: "中 - 要注意", value: "medium" },
          { title: "高 - 禁忌", value: "high" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "action",
      title: "推奨アクション",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "医師相談、摂取中止、用量調整など",
    }),
    defineField({
      name: "evidence",
      title: "根拠",
      type: "text",
      description: "警告の根拠となる情報源",
    }),
    defineField({
      name: "isActive",
      title: "アクティブ",
      type: "boolean",
      initialValue: true,
      description: "このルールを有効にするかどうか",
    }),
  ],
  preview: {
    select: {
      personaTag: "personaTag",
      ingredientName: "ingredient.name",
      severity: "severity",
      interaction: "interaction",
    },
    prepare({ personaTag, ingredientName, severity, interaction }) {
      const title = ingredientName
        ? `${ingredientName} - ${personaTag}`
        : personaTag;
      return {
        title,
        subtitle: `${severity.toUpperCase()}: ${interaction?.substring(0, 60)}...`,
      };
    },
  },
});
