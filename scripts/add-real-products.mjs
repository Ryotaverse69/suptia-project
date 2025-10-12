import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "fny3jdcg",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
});

// まず既存のブランドと成分のIDを取得
async function getExistingData() {
  const brands = await client.fetch(`*[_type == "brand"]{ _id, name }`);
  const ingredients = await client.fetch(
    `*[_type == "ingredient"]{ _id, name, slug }`
  );

  const brandMap = Object.fromEntries(brands.map((b) => [b.name, b._id]));
  const ingredientMap = Object.fromEntries(
    ingredients.map((i) => [i.slug.current, i._id])
  );

  return { brandMap, ingredientMap };
}

async function addRealProducts() {
  const { brandMap, ingredientMap } = await getExistingData();

  console.log("利用可能なブランド:", Object.keys(brandMap));
  console.log("利用可能な成分:", Object.keys(ingredientMap).slice(0, 10), "...");

  const products = [
    // DHC製品
    {
      name: "DHC ビタミンC（ハードカプセル）30日分",
      slug: "dhc-vitamin-c-30days",
      brand: brandMap["DHC"],
      ingredients: [ingredientMap["vitamin-c"]],
      priceJPY: 380,
      servingSize: "2粒",
      servingsPerContainer: 30,
      description:
        "1日2粒で1000mgのビタミンCが摂取できる、DHCのロングセラー商品。ビタミンB2も配合されており、美容と健康をサポートします。ハードカプセルタイプで飲みやすく、続けやすい価格設定が魅力です。",
      scores: {
        safety: 95,
        evidence: 90,
        costEffectiveness: 98,
        overall: 94,
      },
      reviewStats: {
        averageRating: 4.6,
        reviewCount: 3248,
      },
      availability: "in-stock",
      costPerDay: 12.7,
      images: [],
      certifications: ["GMP"],
    },
    {
      name: "DHC マルチビタミン 30日分",
      slug: "dhc-multivitamin-30days",
      brand: brandMap["DHC"],
      ingredients: [
        ingredientMap["vitamin-c"],
        ingredientMap["vitamin-d"],
        ingredientMap["vitamin-b-complex"],
      ],
      priceJPY: 458,
      servingSize: "1粒",
      servingsPerContainer: 30,
      description:
        "12種類のビタミンをバランス良く配合したオールインワンサプリ。ビタミンB群、C、D、Eなど日常的に不足しがちな栄養素を1粒で補給できます。忙しい現代人に最適な総合ビタミン剤です。",
      scores: {
        safety: 93,
        evidence: 88,
        costEffectiveness: 92,
        overall: 91,
      },
      reviewStats: {
        averageRating: 4.5,
        reviewCount: 2156,
      },
      availability: "in-stock",
      costPerDay: 15.3,
      images: [],
      certifications: ["GMP"],
    },
    {
      name: "DHC EPA 30日分",
      slug: "dhc-epa-30days",
      brand: brandMap["DHC"],
      ingredients: [ingredientMap["omega-3"]],
      priceJPY: 918,
      servingSize: "3粒",
      servingsPerContainer: 30,
      description:
        "青魚由来のEPAを高濃度配合したサプリメント。1日3粒で510mgのEPAを摂取可能。血液サラサラ効果が期待でき、生活習慣が気になる方におすすめです。",
      scores: {
        safety: 92,
        evidence: 93,
        costEffectiveness: 85,
        overall: 90,
      },
      reviewStats: {
        averageRating: 4.4,
        reviewCount: 1872,
      },
      availability: "in-stock",
      costPerDay: 30.6,
      images: [],
      certifications: ["GMP"],
    },
    {
      name: "DHC 亜鉛 30日分",
      slug: "dhc-zinc-30days",
      brand: brandMap["DHC"],
      ingredients: [ingredientMap["zinc"]],
      priceJPY: 287,
      servingSize: "1粒",
      servingsPerContainer: 30,
      description:
        "1日1粒で15mgの亜鉛を補給できるサプリメント。クロムとセレンも配合し、男性の活力サポートや免疫機能の維持に役立ちます。コストパフォーマンスに優れた製品です。",
      scores: {
        safety: 94,
        evidence: 87,
        costEffectiveness: 97,
        overall: 93,
      },
      reviewStats: {
        averageRating: 4.5,
        reviewCount: 2941,
      },
      availability: "in-stock",
      costPerDay: 9.6,
      images: [],
      certifications: ["GMP"],
    },

    // 大塚製薬製品
    {
      name: "ネイチャーメイド スーパーマルチビタミン&ミネラル 120粒",
      slug: "naturemade-super-multi-120",
      brand: brandMap["大塚製薬"],
      ingredients: [
        ingredientMap["vitamin-c"],
        ingredientMap["vitamin-d"],
        ingredientMap["vitamin-b-complex"],
        ingredientMap["calcium"],
        ingredientMap["magnesium-glycinate"],
        ingredientMap["zinc"],
        ingredientMap["iron"],
      ],
      priceJPY: 1980,
      servingSize: "1粒",
      servingsPerContainer: 120,
      description:
        "12種類のビタミンと7種類のミネラルを配合した総合栄養サプリメント。アメリカの薬剤師が最も推奨するブランドとして知られるネイチャーメイドの人気商品。栄養バランスが気になる方に最適です。",
      scores: {
        safety: 96,
        evidence: 91,
        costEffectiveness: 88,
        overall: 92,
      },
      reviewStats: {
        averageRating: 4.7,
        reviewCount: 4521,
      },
      availability: "in-stock",
      costPerDay: 16.5,
      images: [],
      certifications: ["GMP", "USP"],
    },
    {
      name: "ネイチャーメイド ビタミンD 1000IU 100粒",
      slug: "naturemade-vitamin-d-1000iu",
      brand: brandMap["大塚製薬"],
      ingredients: [ingredientMap["vitamin-d"]],
      priceJPY: 798,
      servingSize: "1粒",
      servingsPerContainer: 100,
      description:
        "1日1粒で1000IUのビタミンDを摂取できるサプリメント。骨の健康維持や免疫機能のサポートに役立ちます。日照時間が少ない地域や屋内で過ごすことが多い方におすすめです。",
      scores: {
        safety: 95,
        evidence: 94,
        costEffectiveness: 90,
        overall: 93,
      },
      reviewStats: {
        averageRating: 4.6,
        reviewCount: 2834,
      },
      availability: "in-stock",
      costPerDay: 8.0,
      images: [],
      certifications: ["GMP", "USP"],
    },

    // NOW Foods製品
    {
      name: "NOW Foods ビタミンD-3 5000IU 240ソフトジェル",
      slug: "now-vitamin-d3-5000iu",
      brand: brandMap["NOW Foods"],
      ingredients: [ingredientMap["vitamin-d"]],
      priceJPY: 1680,
      servingSize: "1粒",
      servingsPerContainer: 240,
      description:
        "高濃度5000IUのビタミンD3を配合したソフトジェルカプセル。骨の健康、免疫機能、カルシウム吸収をサポートします。240粒入りの大容量でコストパフォーマンスに優れています。",
      scores: {
        safety: 93,
        evidence: 95,
        costEffectiveness: 94,
        overall: 94,
      },
      reviewStats: {
        averageRating: 4.7,
        reviewCount: 5632,
      },
      availability: "in-stock",
      costPerDay: 7.0,
      images: [],
      certifications: ["GMP", "Non-GMO"],
    },
    {
      name: "NOW Foods オメガ-3 1000mg 200ソフトジェル",
      slug: "now-omega3-1000mg",
      brand: brandMap["NOW Foods"],
      ingredients: [ingredientMap["omega-3"]],
      priceJPY: 2180,
      servingSize: "2粒",
      servingsPerContainer: 100,
      description:
        "EPA 180mg、DHA 120mgを含む高品質なオメガ-3フィッシュオイル。心血管の健康、脳機能、関節の健康をサポートします。分子蒸留により不純物を除去した純度の高い製品です。",
      scores: {
        safety: 92,
        evidence: 94,
        costEffectiveness: 86,
        overall: 91,
      },
      reviewStats: {
        averageRating: 4.6,
        reviewCount: 3947,
      },
      availability: "in-stock",
      costPerDay: 21.8,
      images: [],
      certifications: ["GMP", "Non-GMO"],
    },
    {
      name: "NOW Foods 亜鉛 50mg 250錠",
      slug: "now-zinc-50mg",
      brand: brandMap["NOW Foods"],
      ingredients: [ingredientMap["zinc"]],
      priceJPY: 1480,
      servingSize: "1粒",
      servingsPerContainer: 250,
      description:
        "グルコン酸亜鉛50mgを配合したタブレット。免疫機能、皮膚の健康、タンパク質合成をサポートします。250錠入りの大容量で長期間の使用に適しています。",
      scores: {
        safety: 91,
        evidence: 89,
        costEffectiveness: 95,
        overall: 92,
      },
      reviewStats: {
        averageRating: 4.5,
        reviewCount: 2783,
      },
      availability: "in-stock",
      costPerDay: 5.9,
      images: [],
      certifications: ["GMP", "Non-GMO", "Vegan"],
    },
    {
      name: "NOW Foods マグネシウム 400mg 180カプセル",
      slug: "now-magnesium-400mg",
      brand: brandMap["NOW Foods"],
      ingredients: [ingredientMap["magnesium-glycinate"]],
      priceJPY: 1880,
      servingSize: "3粒",
      servingsPerContainer: 60,
      description:
        "グリシン酸マグネシウム400mgを配合したカプセル。筋肉の機能、神経系の健康、エネルギー代謝をサポートします。吸収率の高いグリシン酸型を採用しています。",
      scores: {
        safety: 94,
        evidence: 90,
        costEffectiveness: 87,
        overall: 90,
      },
      reviewStats: {
        averageRating: 4.6,
        reviewCount: 3156,
      },
      availability: "in-stock",
      costPerDay: 31.3,
      images: [],
      certifications: ["GMP", "Non-GMO", "Vegan"],
    },

    // Thorne製品
    {
      name: "Thorne マルチビタミン エリート AM/PM",
      slug: "thorne-multi-elite-am-pm",
      brand: brandMap["Thorne"],
      ingredients: [
        ingredientMap["vitamin-c"],
        ingredientMap["vitamin-d"],
        ingredientMap["vitamin-b-complex"],
        ingredientMap["magnesium-glycinate"],
      ],
      priceJPY: 8900,
      servingSize: "4粒（AM）+ 4粒（PM）",
      servingsPerContainer: 30,
      description:
        "朝用と夜用に分けられたプレミアムマルチビタミン。活性型ビタミンを使用し、最高の吸収率を実現しています。アスリートや健康意識の高い方に支持されるThornの最高峰製品です。",
      scores: {
        safety: 98,
        evidence: 96,
        costEffectiveness: 72,
        overall: 89,
      },
      reviewStats: {
        averageRating: 4.8,
        reviewCount: 1432,
      },
      availability: "in-stock",
      costPerDay: 297.0,
      images: [],
      certifications: ["NSF Certified for Sport", "GMP", "TGA"],
    },
    {
      name: "Thorne ビタミンD-3 5000IU",
      slug: "thorne-vitamin-d3-5000iu",
      brand: brandMap["Thorne"],
      ingredients: [ingredientMap["vitamin-d"]],
      priceJPY: 3200,
      servingSize: "1粒",
      servingsPerContainer: 90,
      description:
        "高純度のビタミンD3を5000IU配合。第三者機関によるテスト済みで、不純物や汚染物質を含みません。Thorneの厳格な品質基準を満たした医療グレードのサプリメントです。",
      scores: {
        safety: 98,
        evidence: 95,
        costEffectiveness: 80,
        overall: 91,
      },
      reviewStats: {
        averageRating: 4.8,
        reviewCount: 2183,
      },
      availability: "in-stock",
      costPerDay: 35.6,
      images: [],
      certifications: ["NSF Certified for Sport", "GMP", "TGA"],
    },

    // Life Extension製品
    {
      name: "Life Extension ツーパーデイ カプセル 120粒",
      slug: "life-extension-two-per-day-120",
      brand: brandMap["Life Extension"],
      ingredients: [
        ingredientMap["vitamin-c"],
        ingredientMap["vitamin-d"],
        ingredientMap["vitamin-b-complex"],
        ingredientMap["zinc"],
      ],
      priceJPY: 3280,
      servingSize: "2粒",
      servingsPerContainer: 60,
      description:
        "科学的根拠に基づいて設計された高品質マルチビタミン。25種類以上の栄養素を最適な量で配合し、長寿研究の知見を反映しています。Life Extensionの人気No.1製品です。",
      scores: {
        safety: 96,
        evidence: 94,
        costEffectiveness: 84,
        overall: 91,
      },
      reviewStats: {
        averageRating: 4.7,
        reviewCount: 3892,
      },
      availability: "in-stock",
      costPerDay: 54.7,
      images: [],
      certifications: ["Non-GMO", "GMP"],
    },
    {
      name: "Life Extension スーパーオメガ-3 EPA/DHA",
      slug: "life-extension-super-omega3",
      brand: brandMap["Life Extension"],
      ingredients: [ingredientMap["omega-3"]],
      priceJPY: 4180,
      servingSize: "2粒",
      servingsPerContainer: 60,
      description:
        "EPA 720mg、DHA 480mgを含む高濃度オメガ-3サプリメント。IFOS（国際魚油基準）5つ星認証を取得した最高品質のフィッシュオイルです。心血管の健康と脳機能をサポートします。",
      scores: {
        safety: 97,
        evidence: 96,
        costEffectiveness: 78,
        overall: 90,
      },
      reviewStats: {
        averageRating: 4.8,
        reviewCount: 2674,
      },
      availability: "in-stock",
      costPerDay: 69.7,
      images: [],
      certifications: ["IFOS 5-Star", "Non-GMO", "GMP"],
    },
    {
      name: "Life Extension ビタミンC 1000mg",
      slug: "life-extension-vitamin-c-1000mg",
      brand: brandMap["Life Extension"],
      ingredients: [ingredientMap["vitamin-c"]],
      priceJPY: 2180,
      servingSize: "1粒",
      servingsPerContainer: 250,
      description:
        "1日1粒で1000mgのビタミンCを摂取できるタブレット。250粒入りの大容量で、8ヶ月以上使用可能。抗酸化作用、免疫サポート、コラーゲン生成に役立ちます。",
      scores: {
        safety: 95,
        evidence: 92,
        costEffectiveness: 92,
        overall: 93,
      },
      reviewStats: {
        averageRating: 4.6,
        reviewCount: 3421,
      },
      availability: "in-stock",
      costPerDay: 8.7,
      images: [],
      certifications: ["Non-GMO", "GMP", "Vegan"],
    },
  ];

  console.log(`\n${products.length}件の実商品データを追加します...\n`);

  const mutations = products.map((product) => ({
    create: {
      _type: "product",
      ...product,
      ingredients: product.ingredients
        .filter(Boolean)
        .map((id) => ({ _type: "reference", _ref: id })),
      brand: { _type: "reference", _ref: product.brand },
    },
  }));

  try {
    const result = await client
      .transaction(mutations.map((m) => client.create(m.create)))
      .commit();
    console.log(`✅ ${result.length}件の商品を追加しました`);
    return result;
  } catch (error) {
    console.error("❌ エラー:", error.message);
    throw error;
  }
}

addRealProducts()
  .then(() => {
    console.log("\n✅ 実商品データの追加が完了しました");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ 実行中にエラーが発生しました:", error);
    process.exit(1);
  });
