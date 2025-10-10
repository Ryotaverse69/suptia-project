import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
});

// Protein, Probiotics, Vitamin B Complex の英語フィールドを日本語に更新
const updates = [
  {
    slug: 'protein',
    benefits: [
      "筋タンパク質合成を刺激し筋肉の成長・修復・回復をサポート（レジスタンストレーニング+1.6-2.2g/kg摂取で月0.5-2kg増加）",
      "満腹ホルモン増加とグレリン減少により満腹感向上、1日200-400kcalの自然な摂取減少",
      "食事誘発性熱産生で代謝率アップ、タンパク質は消化に20-30%のカロリー必要（炭水化物5-10%、脂肪0-3%）",
      "カロリー制限中の除脂肪体重保持（1.8-2.4g/kg摂取で20-30%多く保持）",
      "骨の健康サポート、カルシウム吸収改善・骨密度増加（高齢者の股関節骨折リスク10-20%減）",
      "創傷治癒と組織修復の加速、必須アミノ酸でコラーゲン合成・免疫細胞生産をサポート",
      "健康的な血圧維持、内皮機能改善で血圧2-5mmHg低下",
      "サルコペニア予防、50歳以降の筋肉減少を40%遅延",
      "免疫機能強化、抗体産生・免疫細胞増殖に必要なアミノ酸を提供",
      "運動パフォーマンス向上、筋損傷マーカー20-40%減・筋肉痛軽減・回復加速"
    ],
    recommendedDosage: "タンパク質必要量は年齢・性別・活動レベル等で異なります。座りがちな成人:0.8g/kg、活動的な人:持久系1.2-1.6g/kg・筋力系1.6-2.2g/kg、高齢者（65歳以上）:1.2-1.5g/kg、減量中:1.8-2.7g/kg。1食20-40gを3-5回に分散、運動後2時間以内20-40g摂取で回復促進。就寝前30-40g（カゼイン等）で一晩の筋合成強化。動物性タンパク質は完全なアミノ酸プロファイル・高吸収率（90-95%）、植物性は生物学的価値やや低め（70-85%）。2.5-3.0g/kg超の極端な高摂取は不要。",
    sideEffects: "推奨量では安全ですが、急激な増加で消化不快感（膨満感・ガス・排便変化）が10-20%に発生、徐々に増やすと軽減。腎臓病患者は医師相談必須。健康な腎機能への悪影響はなし（2.0-2.5g/kgまで）。高タンパク摂取で脱水リスク増のため十分な水分補給必要（35-40ml/kg）。乳タンパク質は乳糖不耐症者に影響、卵・大豆はアレルゲン。痛風傾向者は内臓肉・特定魚・赤身肉を適度に。繊維・水分不足で便秘の可能性。極端な低炭水化物との組み合わせで一時的疲労や口臭発生の可能性。",
    interactions: "レボドパ（パーキンソン病薬）:アミノ酸と競合、30-60分離して服用。甲状腺ホルモン薬:タンパク質・大豆・カルシウム・鉄から30-60分離。ビスホスホネート:30分以上離す。カルシウム吸収は適度な摂取で向上、極端な高摂取（2.5g/kg超）で尿中排泄増。植物性鉄は動物性タンパク質・ビタミンCで吸収向上、カルシウム・フィチン酸で低下。高齢者・酸減少薬服用者はB12豊富な動物性タンパク質必要。アルコール代謝はタンパク質食で遅延。",
    scientificBackground: "タンパク質は20種のアミノ酸がペプチド結合した高分子、人体に8-40万種存在。筋タンパク質合成（MPS）はレジスタンス運動とアミノ酸（特にロイシン2.5-3g）で活性化、mTOR経路を刺激。20-40gの高品質タンパク質で最大刺激、大柄な人・全身トレーニング後は40g以上有益。筋肉満腹効果:摂取3-5時間後にMPSがプラトー、分解後リセット。PDCAAS/DIAASでタンパク質品質測定、ホエイ1.0-1.09、卵白1.0、牛肉0.92、大豆0.91、小麦0.42。ロイシン閾値:1食2.5-3gでMPS最適刺激。タンパク質代謝回転:成人1日250-300g、組織により数日～数年。必須アミノ酸1つでも不足で合成制限、完全タンパク質源の重要性を示す。"
  }
];

async function updateArticles() {
  console.log('英語記事を日本語に更新します...\n');
  
  for (const update of updates) {
    try {
      console.log(`Processing: ${update.slug}...`);
      
      const existing = await client.fetch(
        `*[_type == "ingredient" && slug.current == $slug][0]{_id}`,
        { slug: update.slug }
      );
      
      if (!existing) {
        console.log(`  ✗ Not found: ${update.slug}`);
        continue;
      }
      
      await client
        .patch(existing._id)
        .set({
          benefits: update.benefits,
          recommendedDosage: update.recommendedDosage,
          sideEffects: update.sideEffects,
          interactions: update.interactions,
          scientificBackground: update.scientificBackground
        })
        .commit();
      
      console.log(`  ✓ Updated: ${update.slug}\n`);
    } catch (error) {
      console.error(`  ✗ Error: ${update.slug}:`, error.message);
    }
  }
  
  console.log('完了しました！');
}

updateArticles();
