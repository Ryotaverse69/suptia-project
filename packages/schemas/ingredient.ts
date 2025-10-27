import { defineField, defineType } from "sanity";
import { validateCompliance } from "./utils/compliance";

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
      name: "coverImage",
      title: "アイキャッチ画像",
      type: "image",
      description:
        "成分ガイドのアイキャッチ画像（推奨サイズ: 1200x630px）トップページの成分カルーセルにも使用されます",
      options: {
        hotspot: true,
      },
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
      description:
        "成分の簡潔な説明（300-500文字程度）※記事全体で2,500〜3,500文字を目指してください",
      validation: (Rule) =>
        Rule.required()
          .min(300)
          .max(600)
          .custom((value) => {
            const result = validateCompliance(value);
            return result.isValid
              ? true
              : result.message || "薬機法違反の可能性があります";
          })
          .warning(),
      group: "content",
    }),

    // コンテンツ
    defineField({
      name: "benefits",
      title: "主な効果・効能",
      type: "array",
      of: [{ type: "string" }],
      description:
        "箇条書きで効果を記載（8〜10項目推奨）各項目は詳細に記述してください",
      validation: (Rule) =>
        Rule.required()
          .min(5)
          .custom((items: string[] | undefined) => {
            if (!items || items.length === 0) return true;
            for (const item of items) {
              const result = validateCompliance(item);
              if (!result.isValid) {
                return `効果・効能に薬機法違反の可能性: ${result.message}`;
              }
            }
            return true;
          })
          .warning(),
      group: "content",
    }),
    defineField({
      name: "recommendedDosage",
      title: "推奨摂取量",
      type: "text",
      rows: 8,
      description:
        "推奨摂取量の詳細な説明（500-800文字程度）具体的な数値、状況別の推奨量、摂取タイミングなどを含めてください",
      validation: (Rule) =>
        Rule.required()
          .min(400)
          .custom((value) => {
            const result = validateCompliance(value);
            return result.isValid
              ? true
              : result.message || "薬機法違反の可能性があります";
          })
          .warning(),
      group: "content",
    }),
    defineField({
      name: "foodSources",
      title: "豊富に含まれる食品",
      type: "array",
      of: [{ type: "string" }],
      description:
        "食品名と含有量を記載（例：サケ（100gあたり約25μg））10〜15項目推奨",
      validation: (Rule) => Rule.min(8),
      group: "content",
    }),

    // 科学的情報
    defineField({
      name: "evidenceLevel",
      title: "科学的根拠レベル",
      type: "string",
      options: {
        list: [
          { title: "S: 大規模RCTやメタ解析", value: "S" },
          { title: "A: 良質な研究で効果確認", value: "A" },
          { title: "B: 限定的研究・条件付き", value: "B" },
          { title: "C: 動物実験・小規模試験", value: "C" },
          { title: "D: 理論・未検証レベル", value: "D" },
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
      rows: 10,
      description:
        "研究や科学的根拠についての詳細説明（800-1,200文字程度）具体的な研究名、年代、結果を含めてください",
      validation: (Rule) =>
        Rule.required()
          .min(600)
          .custom((value) => {
            const result = validateCompliance(value);
            return result.isValid
              ? true
              : result.message || "薬機法違反の可能性があります";
          })
          .warning(),
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
      description:
        "副作用や注意事項を箇条書きで記載（5〜7項目推奨）各項目は詳細に記述してください",
      validation: (Rule) =>
        Rule.min(3).custom((items: string[] | undefined) => {
          if (!items || items.length === 0) return true;
          for (const item of items) {
            const result = validateCompliance(item);
            if (!result.isValid) {
              return `副作用に薬機法違反の可能性: ${result.message}`;
            }
          }
          return true;
        }),
      group: "safety",
    }),
    defineField({
      name: "interactions",
      title: "他の成分・医薬品との相互作用",
      type: "array",
      of: [{ type: "string" }],
      description:
        "相互作用について記載（5〜8項目推奨）具体的な薬剤名や影響の詳細を含めてください",
      validation: (Rule) =>
        Rule.min(3).custom((items: string[] | undefined) => {
          if (!items || items.length === 0) return true;
          for (const item of items) {
            const result = validateCompliance(item);
            if (!result.isValid) {
              return `相互作用に薬機法違反の可能性: ${result.message}`;
            }
          }
          return true;
        }),
      group: "safety",
    }),
    defineField({
      name: "contraindications",
      title: "禁忌タグ",
      type: "array",
      of: [{ type: "string" }],
      description:
        "この成分を避けるべき人・状況のタグ。診断機能で使用されます。",
      options: {
        list: [
          { title: "妊娠中", value: "pregnant" },
          { title: "授乳中", value: "breastfeeding" },
          { title: "乳幼児", value: "infants" },
          { title: "小児", value: "children" },
          { title: "高齢者", value: "elderly" },
          { title: "血液凝固障害", value: "blood-clotting-disorder" },
          { title: "出血リスク", value: "bleeding-risk" },
          { title: "手術前後", value: "surgery" },
          { title: "糖尿病", value: "diabetes" },
          { title: "高血圧", value: "hypertension" },
          { title: "低血圧", value: "hypotension" },
          { title: "腎臓病", value: "kidney-disease" },
          { title: "肝臓病", value: "liver-disease" },
          { title: "心疾患", value: "heart-disease" },
          { title: "甲状腺疾患", value: "thyroid-disorder" },
          { title: "自己免疫疾患", value: "autoimmune-disease" },
          { title: "消化器疾患", value: "digestive-disorder" },
          { title: "てんかん", value: "epilepsy" },
          { title: "精神疾患", value: "mental-disorder" },
          { title: "抗凝固薬服用中", value: "anticoagulant-use" },
          { title: "抗血小板薬服用中", value: "antiplatelet-use" },
          { title: "抗うつ薬服用中", value: "antidepressant-use" },
          { title: "免疫抑制薬服用中", value: "immunosuppressant-use" },
          { title: "ホルモン剤服用中", value: "hormone-therapy" },
          { title: "化学療法中", value: "chemotherapy" },
          { title: "アレルギー体質", value: "allergy-prone" },
          { title: "貝アレルギー", value: "shellfish-allergy" },
          { title: "大豆アレルギー", value: "soy-allergy" },
          { title: "ナッツアレルギー", value: "nut-allergy" },
        ],
      },
      group: "safety",
    }),
    defineField({
      name: "relatedGoals",
      title: "関連する健康目標",
      type: "array",
      of: [{ type: "string" }],
      description: "この成分が貢献する健康目標のタグ。診断機能で使用されます。",
      options: {
        list: [
          { title: "免疫力強化", value: "immune-boost" },
          { title: "肌の健康", value: "skin-health" },
          { title: "抗老化", value: "anti-aging" },
          { title: "心臓の健康", value: "heart-health" },
          { title: "脳の健康", value: "brain-health" },
          { title: "骨の健康", value: "bone-health" },
          { title: "関節の健康", value: "joint-health" },
          { title: "消化器の健康", value: "digestive-health" },
          { title: "目の健康", value: "eye-health" },
          { title: "エネルギー増強", value: "energy-boost" },
          { title: "ストレス軽減", value: "stress-relief" },
          { title: "睡眠改善", value: "sleep-improvement" },
          { title: "体重管理", value: "weight-management" },
          { title: "筋肉増強", value: "muscle-building" },
          { title: "運動パフォーマンス向上", value: "athletic-performance" },
        ],
      },
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
              rows: 8,
              description: "各回答は200-400文字程度で詳細に記述してください",
              validation: (Rule) =>
                Rule.required()
                  .min(150)
                  .custom((value) => {
                    const result = validateCompliance(value);
                    return result.isValid
                      ? true
                      : result.message || "薬機法違反の可能性があります";
                  })
                  .warning(),
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
      description: "5〜6項目推奨。SEO強化のため、詳細な回答を心がけてください",
      validation: (Rule) => Rule.min(3).max(8),
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
