import { readFileSync } from 'fs';

const token = readFileSync('apps/web/.env.local', 'utf8')
  .match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();

// 新規5記事のbenefitsを箇条書き配列に変換
const benefitsArrays = {
  'creatine': [
    "筋力とパワーの向上：高強度トレーニング中のパフォーマンスを最大15%向上",
    "筋肉量の増加：平均2-4kgの筋肉量増加が複数の研究で確認",
    "運動後の回復促進：筋肉の合成を高め、疲労回復を早める",
    "認知機能の改善：睡眠不足時や高齢者の記憶力と情報処理速度を向上",
    "脳のエネルギー代謝改善：神経保護作用により神経変性疾患の予防に期待",
    "心筋と脳組織のエネルギー供給サポート：全身のエネルギー代謝を最適化"
  ],
  'turmeric': [
    "強力な抗炎症作用：COX-2やLOXなどの炎症性酵素を阻害",
    "関節炎の症状緩解：変形性関節症や関節リウマチに効果的、NSAIDsと同等の効果も報告",
    "肝機能のサポート：肝臓の解毒酵素を活性化し、胆汁分泌を促進",
    "強力な抗酸化作用：活性酸素を中和し、細胞を酸化ストレスから保護",
    "消化器系の健康改善：消化促進、胃粘膜保護、腸内環境の改善に貢献",
    "認知機能の維持：BDNFレベルを高め、気分改善やうつ症状の軽減に期待",
    "心血管の健康サポート：内皮機能を改善し、動脈硬化の予防に役立つ"
  ],
  'ginkgo': [
    "脳血流の改善：血管を拡張し、脳への酸素と栄養素の供給を増加",
    "認知機能のサポート：記憶力、集中力、情報処理速度の向上",
    "加齢に伴う認知機能低下の改善：軽度認知障害（MCI）に対して有望な効果",
    "強力な抗酸化作用：フリーラジカルから脳細胞を保護し、神経変性疾患を予防",
    "末梢血管の血流改善：冷え性、間欠性跛行の症状緩和に効果",
    "耳鳴りやめまいの軽減：内耳の血流を改善することで症状を軽減",
    "眼の血流改善：緑内障や加齢黄斑変性の進行を遅らせる効果を研究中",
    "不安症状の軽減：ストレス対処能力の向上に期待"
  ],
  'l-carnitine': [
    "脂肪酸代謝の促進：長鎖脂肪酸をミトコンドリア内に輸送し、エネルギー産生をサポート",
    "有酸素運動中の脂肪燃焼効率向上：体脂肪の減少をサポート",
    "運動パフォーマンスの向上：筋肉の乳酸蓄積を減らし、疲労感を軽減",
    "運動後の筋肉痛と疲労軽減：回復を促進する効果が報告",
    "心血管機能の維持：心筋のエネルギー供給を最適化し、心不全や狭心症の補助的治療に使用",
    "精子の運動性向上：男性不妊の改善に期待",
    "脳の認知機能サポート：加齢に伴うエネルギー低下の改善",
    "インスリン感受性の改善：糖尿病患者の血糖コントロール向上"
  ],
  'astaxanthin': [
    "史上最強クラスの抗酸化作用：ビタミンEの500-1000倍、β-カロテンの40-100倍の抗酸化力",
    "紫外線による肌ダメージ軽減：シミ、しわ、たるみの予防に効果的",
    "肌の美容効果：8-12週間で肌の弾力性、水分量、きめの細かさが改善",
    "眼の健康維持：黄斑や水晶体に蓄積し、紫外線やブルーライトから眼を保護",
    "眼精疲労の軽減：視力の維持、加齢黄斑変性や白内障のリスク低減",
    "運動パフォーマンスの向上：筋肉の酸化ストレスを軽減し、持久力を向上",
    "疲労回復の促進：運動後の筋肉痛を軽減",
    "心血管の健康サポート：LDLコレステロールの酸化を防ぎ、血流を改善、血圧を低下",
    "脳の炎症抑制：認知機能の維持や神経保護作用に期待",
    "免疫機能の強化：関節の炎症軽減、男性不妊の改善にも有望"
  ]
};

const mutations = [];

for (const [slug, benefits] of Object.entries(benefitsArrays)) {
  const idMap = {
    'creatine': 'ingredient-creatine',
    'turmeric': 'ingredient-turmeric',
    'ginkgo': 'ingredient-ginkgo',
    'l-carnitine': 'ingredient-l-carnitine',
    'astaxanthin': 'ingredient-astaxanthin'
  };

  mutations.push({
    patch: {
      id: idMap[slug],
      set: { benefits }
    }
  });

  console.log(`✓ Prepared: ${slug} (${benefits.length} benefit items)`);
}

console.log(`\n✓ Created mutations for ${mutations.length} ingredients`);
console.log('Sending to Sanity...\n');

try {
  const response = await fetch('https://fny3jdcg.api.sanity.io/v2023-05-03/data/mutate/production', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mutations }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('Error response:', JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log('✅ Success! Updated', result.results?.length || 0, 'ingredients');
  console.log('\nTransaction ID:', result.transactionId);

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
