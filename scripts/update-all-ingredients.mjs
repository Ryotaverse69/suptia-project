import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
});

// 既存の全成分を取得して、3000文字基準に拡充・SEO最適化
const enhancedIngredients = {
  'vitamin-c': {
    description: `ビタミンCは、水溶性ビタミンの一つで、強力な抗酸化作用を持つ必須栄養素です。正式名称はアスコルビン酸（Ascorbic Acid）といい、「壊血病を防ぐ酸」という意味があります。

人間は体内でビタミンCを合成することができないため、食事やサプリメントから毎日摂取する必要があります。水溶性ビタミンであるため体内に蓄積されにくく、過剰摂取のリスクは比較的低いですが、継続的な摂取が重要です。

ビタミンCは、コラーゲンの生成、免疫機能のサポート、鉄の吸収促進、強力な抗酸化作用など、体内で多岐にわたる重要な役割を果たしています。特にストレスの多い現代社会において、ビタミンCの需要は高まっており、サプリメントとしての摂取も広く普及しています。

18世紀の大航海時代、長期航海中の船員たちが壊血病に苦しんでいましたが、柑橘類を摂取することで予防できることが発見されました。これがビタミンCの重要性が認識された最初のきっかけとなりました。現代では、美容、健康維持、免疫サポートなど、幅広い目的でビタミンCが活用されています。`,
    scientificBackground: `ビタミンCの健康効果については、世界中で数千以上の研究が行われており、その重要性は科学的に十分に実証されています。

特に注目されている研究領域は以下の通りです：

**免疫機能への効果**
複数のメタ分析により、ビタミンCの定期的な摂取が風邪の期間を約8%短縮することが示されています。特にマラソンランナーやスキー選手など、激しい運動をする人では、風邪の発症率が50%減少したという報告もあります。

**心血管疾患の予防**
大規模な疫学研究では、ビタミンCの摂取量が多い人ほど、心臓病や脳卒中のリスクが低いことが示されています。ビタミンCは血管内皮機能を改善し、LDLコレステロールの酸化を防ぐことで、動脈硬化の進行を抑制すると考えられています。

**抗酸化作用**
ビタミンCは、フリーラジカルを中和する強力な抗酸化物質として働きます。酸化ストレスは、老化、がん、心血管疾患など多くの慢性疾患の原因となるため、ビタミンCの抗酸化作用は予防医学の観点から非常に重要です。

**コラーゲン生成**
ビタミンCはコラーゲン合成に不可欠な補酵素として働きます。コラーゲンは皮膚、骨、血管、腱など、体の結合組織の主要な構造タンパク質であり、創傷治癒や皮膚の健康維持に重要な役割を果たします。

厚生労働省の「日本人の食事摂取基準（2020年版）」でも、ビタミンCの重要性が強調されており、成人の推奨量が明確に設定されています。`,
  },
  // 他の成分も同様に拡充していきます
};

async function updateIngredient(slug, updates) {
  try {
    console.log(`Updating: ${slug}...`);

    // 既存のドキュメントを取得
    const existing = await client.fetch(
      `*[_type == "ingredient" && slug.current == $slug][0]`,
      { slug }
    );

    if (!existing) {
      console.log(`  ⚠️  Not found: ${slug}`);
      return;
    }

    // パッチで更新
    await client
      .patch(existing._id)
      .set(updates)
      .commit();

    console.log(`  ✓ Updated: ${slug}`);
  } catch (error) {
    console.error(`  ✗ Error updating ${slug}:`, error.message);
  }
}

async function updateAllIngredients() {
  console.log('全成分記事の更新を開始します（3000文字基準・SEO最適化）...\n');

  for (const [slug, updates] of Object.entries(enhancedIngredients)) {
    await updateIngredient(slug, updates);
  }

  console.log('\n完了しました！');
}

updateAllIngredients();
