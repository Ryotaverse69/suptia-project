import { defineField, defineType } from "sanity";

export const brand = defineType({
  name: "brand",
  title: "ブランド",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "ブランド名",
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
      name: "logo",
      title: "ロゴ",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "description",
      title: "ブランド説明",
      type: "text",
      rows: 4,
      description: "ブランドの特徴や理念を簡潔に記載",
    }),
    defineField({
      name: "country",
      title: "原産国",
      type: "string",
      options: {
        list: [
          { title: "日本", value: "JP" },
          { title: "アメリカ", value: "US" },
          { title: "カナダ", value: "CA" },
          { title: "イギリス", value: "UK" },
          { title: "ドイツ", value: "DE" },
          { title: "フランス", value: "FR" },
          { title: "オーストラリア", value: "AU" },
          { title: "その他", value: "other" },
        ],
      },
    }),
    defineField({
      name: "website",
      title: "公式サイト",
      type: "url",
      description: "ブランドの公式ウェブサイトURL",
    }),
    defineField({
      name: "certifications",
      title: "認証・規格",
      type: "array",
      of: [{ type: "string" }],
      description: "GMP、NSF、USDAオーガニック、ISO認証など",
    }),
    defineField({
      name: "trustScore",
      title: "信頼性スコア",
      type: "number",
      validation: (Rule) => Rule.min(0).max(100),
      description:
        "第三者機関検査、透明性、歴史、評判などに基づくスコア（0-100）",
    }),
    defineField({
      name: "foundedYear",
      title: "設立年",
      type: "number",
      validation: (Rule) => Rule.min(1800).max(new Date().getFullYear() + 1),
      description: "ブランドの設立年",
    }),
    defineField({
      name: "specialties",
      title: "専門分野",
      type: "array",
      of: [{ type: "string" }],
      description: "ブランドの得意分野（ビタミン、プロテイン、ハーブなど）",
    }),
    defineField({
      name: "priceRange",
      title: "価格帯",
      type: "string",
      options: {
        list: [
          { title: "エコノミー（低価格）", value: "economy" },
          { title: "ミッドレンジ（中価格）", value: "mid-range" },
          { title: "プレミアム（高価格）", value: "premium" },
          { title: "ラグジュアリー（最高価格）", value: "luxury" },
        ],
      },
      description: "ブランドの一般的な価格帯",
    }),
  ],
  preview: {
    select: {
      title: "name",
      country: "country",
      trustScore: "trustScore",
      media: "logo",
    },
    prepare({ title, country, trustScore, media }) {
      const countryMap: { [key: string]: string } = {
        JP: "日本",
        US: "アメリカ",
        CA: "カナダ",
        UK: "イギリス",
        DE: "ドイツ",
        FR: "フランス",
        AU: "オーストラリア",
        other: "その他",
      };
      const countryLabel = country ? countryMap[country] || country : "国不明";
      const trustLabel =
        trustScore !== undefined ? `信頼度: ${trustScore}` : "未評価";

      return {
        title,
        subtitle: `${countryLabel} | ${trustLabel}`,
        media,
      };
    },
  },
});
