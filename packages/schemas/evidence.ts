import { defineField, defineType } from "sanity";

export const evidence = defineType({
  name: "evidence",
  title: "エビデンス",
  type: "document",
  fields: [
    defineField({
      name: "ingredient",
      title: "対象成分",
      type: "reference",
      to: [{ type: "ingredient" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "claim",
      title: "効果・効能",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "研究で示された効果や効能",
    }),
    defineField({
      name: "studyType",
      title: "研究タイプ",
      type: "string",
      options: {
        list: [
          { title: "ランダム化比較試験 (RCT)", value: "RCT" },
          { title: "メタ分析", value: "meta-analysis" },
          { title: "システマティックレビュー", value: "systematic-review" },
          { title: "コホート研究", value: "cohort" },
          { title: "症例対照研究", value: "case-control" },
          { title: "横断研究", value: "cross-sectional" },
          { title: "動物実験", value: "animal-study" },
          { title: "in vitro研究", value: "in-vitro" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "研究概要",
      type: "text",
      validation: (Rule) => Rule.required(),
      description: "研究結果の要約（一般向け）",
    }),
    defineField({
      name: "pubmedId",
      title: "PubMed ID",
      type: "string",
      description: "PubMedの論文ID（任意）",
    }),
    defineField({
      name: "doi",
      title: "DOI",
      type: "string",
      description: "デジタルオブジェクト識別子（任意）",
    }),
    defineField({
      name: "grade",
      title: "エビデンスグレード",
      type: "string",
      options: {
        list: [
          { title: "A - 高品質", value: "A" },
          { title: "B - 中品質", value: "B" },
          { title: "C - 低品質", value: "C" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sampleSize",
      title: "サンプルサイズ",
      type: "number",
      description: "研究参加者数",
    }),
    defineField({
      name: "duration",
      title: "研究期間",
      type: "string",
      description: "例: 12週間、6ヶ月など",
    }),
    defineField({
      name: "dosage",
      title: "使用された用量",
      type: "object",
      fields: [
        {
          name: "amount",
          title: "量",
          type: "number",
        },
        {
          name: "unit",
          title: "単位",
          type: "string",
          options: {
            list: ["mg", "g", "mcg", "IU"],
          },
        },
        {
          name: "frequency",
          title: "頻度",
          type: "string",
        },
      ],
    }),
    defineField({
      name: "population",
      title: "対象集団",
      type: "string",
      description: "例: 健康な成人、高齢者、特定疾患患者など",
    }),
    defineField({
      name: "limitations",
      title: "研究の限界",
      type: "array",
      of: [{ type: "string" }],
      description: "研究の制約や注意点",
    }),
  ],
  preview: {
    select: {
      claim: "claim",
      ingredientName: "ingredient.name",
      grade: "grade",
      studyType: "studyType",
    },
    prepare({ claim, ingredientName, grade, studyType }) {
      return {
        title: claim,
        subtitle: `${ingredientName} - ${studyType} (Grade ${grade})`,
      };
    },
  },
});
