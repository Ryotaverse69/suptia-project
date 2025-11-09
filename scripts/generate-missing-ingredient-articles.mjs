#!/usr/bin/env node

/**
 * 未登録成分の記事雛形を生成
 *
 * 各成分の基本情報を含むJSON記事を生成します。
 * 生成後、内容を確認・修正してからSanityにインポートしてください。
 */

import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 成分記事のテンプレート
const ingredientArticles = [
  {
    _id: "ingredient-bilberry",
    _type: "ingredient",
    name: "ビルベリー（ブルーベリー）",
    nameEn: "Bilberry (European Blueberry)",
    slug: { _type: "slug", current: "bilberry" },
    category: "植物エキス",
    description: "ビルベリーは北欧原産のブルーベリーの一種で、アントシアニンを豊富に含む果実です。特に目の健康維持に役立つとされ、眼精疲労や視力低下の予防に使用されています。",
    benefits: [
      "視覚機能のサポート：アントシアニンが網膜のロドプシン再合成を促進",
      "眼精疲労の軽減：長時間のデジタル機器使用による目の疲れを和らげる",
      "夜間視力の改善：暗所での視覚適応能力を向上させる",
      "抗酸化作用：目の組織を酸化ストレスから保護",
      "血流改善：目の毛細血管の健康をサポート"
    ],
    recommendedDosage: "一般的な推奨量は、ビルベリーエキスとして1日80〜160mg（アントシアニン36%標準化）です。効果は摂取後2〜4時間で現れ始め、継続的な摂取が推奨されます。",
    foodSources: [
      "ビルベリー（生果実）",
      "ブルーベリー",
      "カシス",
      "ブラックベリー",
      "アサイーベリー"
    ],
    sideEffects: "一般的に安全とされていますが、過剰摂取により消化器症状（下痢、吐き気）が現れることがあります。血液凝固阻害薬との相互作用の可能性があるため、服用中の方は医師に相談してください。",
    interactions: [
      "血液凝固阻害薬（ワルファリンなど）：出血リスクが増加する可能性",
      "糖尿病治療薬：血糖値に影響を与える可能性",
      "他の抗酸化サプリメント：効果が重複する可能性"
    ],
    evidenceLevel: "B",
    safetyScore: 85,
    faqs: [
      {
        question: "ビルベリーとブルーベリーの違いは？",
        answer: "ビルベリーは北欧原産の野生種で、一般的なブルーベリーよりもアントシアニン含有量が約4倍高いとされています。果実全体が濃い紫色で、アントシアニンが果皮だけでなく果肉にも含まれています。"
      },
      {
        question: "効果を実感するまでどれくらいかかる？",
        answer: "個人差がありますが、一般的に2〜4週間の継続摂取で効果を実感する方が多いです。眼精疲労の軽減は比較的早く（数日〜1週間）、視力改善には1〜3ヶ月の継続が推奨されます。"
      },
      {
        question: "妊娠中・授乳中でも摂取できる？",
        answer: "食品として通常量を摂取する場合は問題ありませんが、高用量のサプリメントとしての安全性は十分に確立されていません。妊娠中・授乳中の方は医師に相談してください。"
      }
    ],
    references: [
      {
        title: "Bilberry (Vaccinium myrtillus) extracts and anthocyanins",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        source: "PubMed"
      }
    ]
  },
  {
    _id: "ingredient-sesamin",
    _type: "ingredient",
    name: "セサミン",
    nameEn: "Sesamin",
    slug: { _type: "slug", current: "sesamin" },
    category: "植物リグナン",
    description: "セサミンはゴマに含まれるリグナン類の一種で、強力な抗酸化作用を持つ成分です。肝機能のサポート、コレステロール値の改善、疲労回復などの効果が期待されています。",
    benefits: [
      "肝機能のサポート：肝臓での脂質代謝を促進",
      "抗酸化作用：細胞を酸化ストレスから保護",
      "コレステロール値の改善：LDLコレステロールを低下させる",
      "疲労回復：エネルギー代謝を効率化",
      "アルコール代謝のサポート：二日酔いの予防",
      "血圧調整：血管の健康をサポート"
    ],
    recommendedDosage: "一般的な推奨量は1日10〜50mgです。食事と一緒に摂取することで吸収率が向上します。ビタミンEと併用することで相乗効果が期待できます。",
    foodSources: [
      "ゴマ（黒ゴマ、白ゴマ）",
      "ゴマ油",
      "練りゴマ",
      "ゴマペースト"
    ],
    sideEffects: "一般的に安全とされていますが、ゴマアレルギーの方は摂取を避けてください。過剰摂取により消化器症状が現れることがあります。",
    interactions: [
      "血圧降下薬：血圧を過度に下げる可能性",
      "肝臓で代謝される薬物：薬物代謝に影響を与える可能性",
      "抗凝固薬：出血リスクが増加する可能性"
    ],
    evidenceLevel: "B",
    safetyScore: 90,
    faqs: [
      {
        question: "セサミンとビタミンEを一緒に摂取すべき？",
        answer: "はい、セサミンとビタミンEは相乗効果があります。セサミンがビタミンEの抗酸化作用を増強し、体内での利用効率を高めることが研究で示されています。多くの製品がこの組み合わせで配合されています。"
      },
      {
        question: "効果を実感するまでどれくらいかかる？",
        answer: "個人差がありますが、肝機能の改善や疲労感の軽減は2〜4週間程度で実感する方が多いです。コレステロール値の改善には3〜6ヶ月の継続が推奨されます。"
      },
      {
        question: "どの時間帯に摂取するのが効果的？",
        answer: "食事と一緒に摂取することで吸収率が向上します。特に脂質を含む食事（朝食や夕食）と一緒に摂取するのが効果的です。"
      }
    ],
    references: [
      {
        title: "Sesamin: A naturally occurring lignan with health benefits",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        source: "PubMed"
      }
    ]
  },
  {
    _id: "ingredient-maca",
    _type: "ingredient",
    name: "マカ",
    nameEn: "Maca (Lepidium meyenii)",
    slug: { _type: "slug", current: "maca" },
    category: "植物エキス",
    description: "マカはペルー原産のアブラナ科の植物で、古くから滋養強壮やエネルギー増強に使用されてきました。アミノ酸、ミネラル、ビタミンを豊富に含み、ホルモンバランスのサポートや疲労回復に効果があるとされています。",
    benefits: [
      "エネルギー・スタミナの向上：持久力と活力を高める",
      "ホルモンバランスのサポート：男性・女性ともに内分泌系をサポート",
      "性機能の改善：リビドー（性欲）の向上",
      "疲労回復：身体的・精神的疲労を軽減",
      "気分の改善：不安やうつ症状の軽減",
      "認知機能のサポート：記憶力と集中力を向上"
    ],
    recommendedDosage: "一般的な推奨量は1日1,500〜3,000mg（乾燥マカ末として）です。効果は2〜4週間の継続摂取で現れ始めます。朝食時に摂取することで1日を通してエネルギーをサポートできます。",
    foodSources: [
      "マカパウダー（乾燥粉末）",
      "マカエキス（濃縮抽出物）",
      "マカ根（生・乾燥）"
    ],
    sideEffects: "一般的に安全とされていますが、甲状腺疾患のある方は注意が必要です。マカにはゴイトロゲン（甲状腺腫誘発物質）が含まれているため、甲状腺機能低下症の方は医師に相談してください。過剰摂取により消化器症状や不眠が現れることがあります。",
    interactions: [
      "甲状腺ホルモン製剤：甲状腺機能に影響を与える可能性",
      "ホルモン療法：ホルモンバランスに影響する可能性",
      "血圧の薬：血圧に影響を与える可能性"
    ],
    evidenceLevel: "B",
    safetyScore: 85,
    faqs: [
      {
        question: "マカは男性専用のサプリメント？",
        answer: "いいえ、マカは男女ともに有益です。男性では性機能やスタミナ向上、女性では更年期症状の緩和やホルモンバランスのサポートに役立ちます。女性の生殖機能にも良い影響があるとされています。"
      },
      {
        question: "効果を実感するまでどれくらいかかる？",
        answer: "個人差がありますが、エネルギーレベルの向上は1〜2週間で感じる方が多いです。性機能やホルモンバランスへの効果は2〜3ヶ月の継続摂取で現れることが一般的です。"
      },
      {
        question: "マカの色（赤・黒・黄）で効果は違う？",
        answer: "はい、色によって若干効果が異なります。赤マカは骨密度と前立腺の健康に、黒マカは精子の質と記憶力に、黄マカは一般的な健康維持に良いとされています。市販品は通常、複数の色をブレンドしています。"
      }
    ],
    references: [
      {
        title: "Maca (Lepidium meyenii): A plant from the highlands of Peru",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        source: "PubMed"
      }
    ]
  },
  {
    _id: "ingredient-squalene",
    _type: "ingredient",
    name: "スクワレン（深海鮫エキス）",
    nameEn: "Squalene (Deep Sea Shark Extract)",
    slug: { _type: "slug", current: "squalene" },
    category: "脂質",
    description: "スクワレンは深海鮫の肝油に多く含まれる不飽和炭化水素で、強力な抗酸化作用と細胞の酸素供給能力を持つ成分です。免疫力の向上、疲労回復、美肌効果などが期待されています。",
    benefits: [
      "酸素供給の促進：細胞レベルで酸素利用効率を向上",
      "免疫機能の強化：免疫細胞の活性化",
      "抗酸化作用：細胞を酸化ストレスから保護",
      "疲労回復：エネルギー代謝をサポート",
      "美肌効果：皮膚の保湿と弾力性を向上",
      "肝機能のサポート：肝臓の解毒機能を助ける"
    ],
    recommendedDosage: "一般的な推奨量は1日300〜1,000mgです。食事と一緒に摂取することで吸収率が向上します。継続的な摂取が推奨されますが、3〜6ヶ月ごとに1〜2週間の休薬期間を設けることが望ましいとされています。",
    foodSources: [
      "深海鮫の肝油",
      "オリーブオイル（少量）",
      "米ぬか油（少量）",
      "アマランサス油（植物性スクワレン）"
    ],
    sideEffects: "一般的に安全とされていますが、魚介類アレルギーのある方は注意が必要です。過剰摂取により消化器症状（下痢、吐き気）や頭痛が現れることがあります。",
    interactions: [
      "抗凝固薬：出血リスクが増加する可能性",
      "免疫抑制剤：免疫機能に影響を与える可能性",
      "他の脂質サプリメント：効果が重複する可能性"
    ],
    evidenceLevel: "C",
    safetyScore: 80,
    faqs: [
      {
        question: "植物性スクワレンと動物性（深海鮫）の違いは？",
        answer: "化学構造は同じですが、深海鮫由来の方が純度と含有量が高い傾向にあります。植物性（オリーブ、米ぬかなど）は持続可能性の観点で優れています。効果に大きな差はないとされていますが、動物性の方が伝統的に使用されてきた実績があります。"
      },
      {
        question: "効果を実感するまでどれくらいかかる？",
        answer: "個人差がありますが、疲労回復や活力向上は2〜4週間で実感する方が多いです。美肌効果や免疫機能の改善には2〜3ヶ月の継続が推奨されます。"
      },
      {
        question: "妊娠中・授乳中でも摂取できる？",
        answer: "妊娠中・授乳中の安全性は十分に確立されていません。また、深海鮫由来の製品には微量の重金属が含まれる可能性があるため、妊娠中・授乳中の方は摂取を控えるか、医師に相談してください。"
      }
    ],
    references: [
      {
        title: "Squalene: A natural compound with therapeutic potential",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        source: "PubMed"
      }
    ]
  },
  {
    _id: "ingredient-manuka-honey",
    _type: "ingredient",
    name: "マヌカハニー",
    nameEn: "Manuka Honey",
    slug: { _type: "slug", current: "manuka-honey" },
    category: "蜂産品",
    description: "マヌカハニーはニュージーランド原産のマヌカの木の花から採れる蜂蜜で、強力な抗菌作用を持つメチルグリオキサール（MGO）を豊富に含んでいます。喉の健康、消化器系のサポート、免疫力の向上に効果があるとされています。",
    benefits: [
      "抗菌・抗ウイルス作用：強力な天然の抗菌成分を含有",
      "喉の痛みの緩和：咳や喉の炎症を和らげる",
      "消化器系の健康：胃腸の炎症を軽減し、ピロリ菌の抑制",
      "免疫機能の強化：免疫細胞の活性化",
      "傷の治癒促進：外用により創傷治癒を加速",
      "口腔衛生：虫歯や歯周病の予防"
    ],
    recommendedDosage: "一般的な推奨量は1日1〜2ティースプーン（5〜10g）です。空腹時または食前30分に摂取することで効果が最大化されます。UMF（Unique Manuka Factor）10+以上、またはMGO（メチルグリオキサール）100+以上の製品が推奨されます。",
    foodSources: [
      "マヌカハニー（UMF10+以上）",
      "マヌカハニー（MGO100+以上）"
    ],
    sideEffects: "1歳未満の乳児には与えないでください（ボツリヌス菌のリスク）。糖尿病の方は血糖値への影響に注意が必要です。過剰摂取により血糖値の上昇や体重増加のリスクがあります。",
    interactions: [
      "糖尿病治療薬：血糖値に影響を与える可能性",
      "抗凝固薬：出血リスクが増加する可能性",
      "化学療法薬：薬物の効果に影響を与える可能性"
    ],
    evidenceLevel: "B",
    safetyScore: 85,
    faqs: [
      {
        question: "UMFとMGOの違いは？",
        answer: "UMF（Unique Manuka Factor）は抗菌活性の総合指標で、MGO（メチルグリオキサール）は特定の抗菌成分の含有量です。UMF10+はMGO100+に相当し、UMF15+はMGO250+、UMF20+はMGO400+に相当します。どちらの表記も信頼できますが、MGOの方がより具体的な数値です。"
      },
      {
        question: "加熱してもマヌカハニーの効果は失われない？",
        answer: "マヌカハニーの主要な抗菌成分であるMGOは熱に比較的安定していますが、40℃以上の加熱は避けることが推奨されます。温かい飲み物に入れる場合は、少し冷ましてから加えるのが良いでしょう。"
      },
      {
        question: "通常の蜂蜜とマヌカハニーの違いは？",
        answer: "マヌカハニーは通常の蜂蜜よりも抗菌作用が強く、特にメチルグリオキサール（MGO）の含有量が桁違いに高いです。通常の蜂蜜のMGO含有量は1〜20mg/kgですが、マヌカハニーは100〜1,000mg/kg以上含まれています。"
      }
    ],
    references: [
      {
        title: "Manuka honey: A review of its antimicrobial and wound healing properties",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        source: "PubMed"
      }
    ]
  },
  {
    _id: "ingredient-propolis",
    _type: "ingredient",
    name: "プロポリス",
    nameEn: "Propolis (Bee Glue)",
    slug: { _type: "slug", current: "propolis" },
    category: "蜂産品",
    description: "プロポリスはミツバチが植物の樹脂などから作る天然の抗菌物質で、「天然の抗生物質」とも呼ばれています。フラボノイドやフェノール化合物を豊富に含み、免疫力の向上、抗炎症作用、抗酸化作用などが期待されています。",
    benefits: [
      "免疫機能の強化：免疫細胞の活性化と抗体産生の促進",
      "抗菌・抗ウイルス作用：細菌、ウイルス、真菌に対する広範な活性",
      "抗炎症作用：炎症性疾患の症状を軽減",
      "抗酸化作用：細胞を酸化ストレスから保護",
      "口腔衛生：歯周病や口内炎の予防・改善",
      "創傷治癒の促進：傷の修復を加速"
    ],
    recommendedDosage: "一般的な推奨量は1日200〜500mg（エキスとして）です。カプセル、液体、スプレーなど様々な形態があります。食事と一緒に摂取することで消化器症状を予防できます。",
    foodSources: [
      "プロポリスエキス（液体）",
      "プロポリスカプセル",
      "プロポリススプレー",
      "プロポリス含有喉飴"
    ],
    sideEffects: "アレルギー反応に注意が必要です。蜂産品や花粉にアレルギーのある方は使用を避けてください。口内炎や皮膚炎などのアレルギー症状が現れた場合は直ちに使用を中止してください。",
    interactions: [
      "免疫抑制剤：免疫機能に影響を与える可能性",
      "抗凝固薬：出血リスクが増加する可能性",
      "薬物代謝酵素：肝臓での薬物代謝に影響する可能性"
    ],
    evidenceLevel: "B",
    safetyScore: 80,
    faqs: [
      {
        question: "プロポリスとローヤルゼリーの違いは？",
        answer: "プロポリスは植物の樹脂からミツバチが作る抗菌物質で、主に免疫力向上と抗菌作用があります。ローヤルゼリーは働き蜂が分泌する栄養物質で、女王蜂の餌となり、主に栄養補給とホルモンバランスのサポートに使われます。"
      },
      {
        question: "効果を実感するまでどれくらいかかる？",
        answer: "個人差がありますが、喉の痛みや口内炎などの急性症状には数日で効果が現れることがあります。免疫機能の向上や体質改善には2〜3ヶ月の継続が推奨されます。"
      },
      {
        question: "アルコール抽出と水抽出の違いは？",
        answer: "アルコール抽出の方がフラボノイドなどの有効成分を効率的に抽出できますが、アルコールに敏感な方や子供には水抽出（またはプロポリスカプセル）が適しています。効果に大きな差はありませんが、アルコール抽出の方が一般的です。"
      }
    ],
    references: [
      {
        title: "Propolis: A review of its anti-inflammatory and healing actions",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        source: "PubMed"
      }
    ]
  }
];

console.log("🎨 未登録成分の記事雛形を生成中...\n");

let generatedCount = 0;

for (const article of ingredientArticles) {
  const filename = `${article.slug.current}-article.json`;
  const filepath = join(__dirname, "..", filename);

  try {
    writeFileSync(filepath, JSON.stringify(article, null, 2));
    console.log(`✅ 生成完了: ${filename}`);
    console.log(`   成分名: ${article.name}`);
    console.log(`   ID: ${article._id}\n`);
    generatedCount++;
  } catch (error) {
    console.error(`❌ エラー: ${filename} - ${error.message}\n`);
  }
}

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(`📊 生成結果: ${generatedCount}/${ingredientArticles.length}件\n`);

console.log("💡 次のステップ:");
console.log("1. 生成されたJSONファイルの内容を確認・修正");
console.log("2. Sanityにインポート:");
console.log("   a. 全てまとめてインポート:");
console.log("      cat *-article.json | jq -s '.' | npx sanity dataset import - production --replace\n");
console.log("   b. 個別にインポート:");
console.log("      npx sanity dataset import bilberry-article.json production\n");
console.log("3. apply-suggested-ingredients-fixed.mjs を再実行して商品に成分を登録\n");

console.log("✅ 完了\n");
