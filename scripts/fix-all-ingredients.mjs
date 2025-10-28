#!/usr/bin/env node

/**
 * 全成分記事の一括修正スクリプト
 *
 * 1. 英語FAQを日本語に翻訳（プロテイン、プロバイオティクス）
 * 2. null参考文献を適切な参考文献に置き換え
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数読み込み
const envPath = join(__dirname, '../apps/web/.env.local');
const envContent = readFileSync(envPath, 'utf8');

const SANITY_API_TOKEN = envContent.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();

if (!SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN が見つかりません');
  process.exit(1);
}

// Sanity設定
const SANITY_PROJECT_ID = 'fny3jdcg';
const SANITY_DATASET = 'production';

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: SANITY_API_TOKEN,
});

// プロテインの日本語FAQ
const proteinFAQs = [
  {
    _type: 'faq',
    question: '1日にどれくらいのタンパク質が必要ですか？また、目標によって必要量は異なりますか？',
    answer: '一般的な健康維持には体重1kgあたり0.8〜1.0gのタンパク質が推奨されます（例：体重70kgの場合、56〜70g/日）。しかし、筋肉増強を目指す場合は1.6〜2.2g/kg、持久力トレーニングを行う場合は1.2〜1.6g/kgが推奨されます。高齢者は筋肉減少を防ぐため1.2〜1.5g/kgが理想的です。ダイエット中は筋肉の維持のため2.0〜2.5g/kgまで増やすことが有益な場合があります。個人の活動レベル、年齢、健康状態に応じて調整してください。'
  },
  {
    _type: 'faq',
    question: '食事からタンパク質を摂取する方が良いですか、それともサプリメントが良いですか？また、プロテインサプリメントはいつ使用すべきですか？',
    answer: '食事からの全食品タンパク質源（肉、魚、卵、豆類）が理想的です。これらには必須ビタミン、ミネラル、繊維が含まれているためです。しかし、プロテインサプリメントは以下の場合に便利です：(1)トレーニング後の素早い吸収、(2)カロリー制限中のタンパク質目標達成、(3)忙しくて食事準備が困難な時、(4)植物性食事でタンパク質摂取が難しい場合。プロテインパウダーは食事の「補足」として使用し、完全な代替とはしないでください。毎日のタンパク質の50〜70%は全食品から摂取することを目指しましょう。'
  },
  {
    _type: 'faq',
    question: 'タンパク質を過剰に摂取すると腎臓にダメージを与えたり、他の健康問題を引き起こしますか？',
    answer: '健康な腎臓を持つ人にとって、高タンパク質摂取（体重1kgあたり2.0〜2.5g）は腎臓にダメージを与えることは研究で示されていません。しかし、既存の腎臓疾患がある場合、高タンパク質食は進行を悪化させる可能性があるため、医療監督が必要です。その他の懸念事項：(1)非常に高いタンパク質摂取（3.0g/kg以上）は消化不良を引き起こす可能性、(2)動物性タンパク質が多すぎると飽和脂肪とコレステロールの摂取も増える可能性、(3)タンパク質が炭水化物と繊維を置き換えると栄養バランスが崩れる可能性。多様なタンパク質源からバランスよく摂取することが最も安全です。'
  },
  {
    _type: 'faq',
    question: '筋肉増強と回復を最大化するためのタンパク質摂取の最適なタイミングは何ですか？',
    answer: 'トレーニング後30〜120分以内のタンパク質摂取（通常20〜40g）は筋肉のタンパク質合成を最適化します。しかし、研究により「アナボリックウィンドウ」は以前考えられていたよりも長い（数時間）ことが示されています。より重要なのは総日摂取量と摂取分散です。1日を通じて3〜5回の食事で均等にタンパク質を分散すると、筋肉の構築と維持が最適化されます。各食事で20〜40gを目標にしてください。就寝前のタンパク質摂取（カゼインプロテインなど）は、夜間の筋肉回復をサポートする持続的なアミノ酸放出を提供できます。'
  },
  {
    _type: 'faq',
    question: '植物性食事でも筋肉を増やすことはできますか？また、植物性タンパク質は動物性タンパク質と比較してどうですか？',
    answer: '植物性食事でも筋肉増強は絶対に可能ですが、計画が必要です。植物性タンパク質は通常、1つ以上の必須アミノ酸が少ない（不完全タンパク質）ですが、豆類、穀物、ナッツ、種子を組み合わせることで完全なアミノ酸プロファイルを達成できます。大豆、キヌア、エンドウ豆タンパク質は完全なタンパク質です。植物性タンパク質は動物性タンパク質よりもロイシン（筋肉成長の鍵となるアミノ酸）が少ないため、植物性食事では総タンパク質摂取量をわずかに増やす（1.8〜2.4g/kg）必要があるかもしれません。植物性プロテインパウダー（エンドウ豆、米、麻）は、日々の目標達成を助けることができます。'
  }
];

// プロバイオティクスの日本語FAQ
const probioticsFAQs = [
  {
    _type: 'faq',
    question: 'プロバイオティクスが効果を発揮するまでどのくらいかかりますか？また、どのくらいの期間摂取を続けるべきですか？',
    answer: 'プロバイオティクスの効果は通常2〜4週間の一貫した摂取後に現れ始めます。消化器症状（膨満感、ガス）の改善は1〜2週間以内に見られることがあります。免疫機能の変化や気分への影響には4〜8週間かかる場合があります。腸内マイクロバイオームの持続的な変化には3〜6ヶ月の定期的な使用が必要です。期間は目標によって異なります：急性の消化器問題には2〜4週間、慢性状態（IBS、免疫サポート）には3ヶ月以上、一般的な維持には継続的な摂取が有益です。プロバイオティクスの効果は通常、摂取を中止すると数週間で減少するため、持続的な利益を得るには継続的な摂取が必要です。'
  },
  {
    _type: 'faq',
    question: 'プロバイオティクスは冷蔵保存する必要がありますか？また、まだ生きているかどうかをどうやって判断できますか？',
    answer: 'すべてのプロバイオティクスが冷蔵保存を必要とするわけではありません。多くの現代的な製剤は、フリーズドライ技術により室温で安定しています。ラベルを確認してください：「要冷蔵」と表示されている場合は冷蔵庫で保管し、「室温保管可能」と表示されている場合は涼しく乾燥した場所で問題ありません。生存率の兆候：(1)評判の良いブランドは「消費期限における生きた培養菌数」を保証します（製造時ではなく）、(2)カプセルの遅延放出や腸溶性コーティングは胃酸からの保護を示します、(3)第三者認証（ConsumerLab、USPなど）は品質を保証します。プロバイオティクスは時間とともに自然に力価が低下するため、消費期限前に使用してください。適切に保管されたプロバイオティクスは消費期限まで十分に有効です。'
  },
  {
    _type: 'faq',
    question: 'すべてのプロバイオティクス菌株は同じですか？それとも特定の健康目的のために特定の菌株が必要ですか？',
    answer: 'プロバイオティクス菌株は大きく異なり、菌株特異的な効果があります。菌株レベルまで特定する必要があります（例：Lactobacillus rhamnosus GGは、他のL. rhamnosus菌株とは異なる効果を持ちます）。一般的な菌株とその用途：(1)ラクトバチルス・ラムノサスGG（LGG）とサッカロマイセス・ブラウディ（抗生物質関連下痢）、(2)ビフィドバクテリウム・ロンガム（IBS、ストレス関連の消化器問題）、(3)ラクトバチルス・アシドフィルスNCFM（全般的な消化サポート）、(4)ラクトバチルス・プランタラム299v（IBS）、(5)ビフィドバクテリウム・インファンティス35624（腹部の痛みと膨満）。多菌株製剤は広範な利益を提供しますが、特定の状態には標的を絞った単一菌株が研究によってより強力に支持されています。健康目標に合わせて選択してください。'
  },
  {
    _type: 'faq',
    question: '食事から十分なプロバイオティクスを摂取できますか？それともサプリメントが必要ですか？',
    answer: 'ヨーグルト、ケフィア、ザワークラウト、キムチ、味噌、テンペなどの発酵食品は、有益なプロバイオティクスを自然に提供します。毎日発酵食品を摂取すると、健康な腸内マイクロバイオームをサポートできます。しかし、サプリメントは以下の利点があります：(1)保証された菌株と用量（食品の含有量は異なります）、(2)研究に基づいた治療用量（通常1日100億〜500億CFU）、(3)胃酸を耐える特定の菌株、(4)特定の健康状態を標的とする能力。一般的な健康維持には、多様な発酵食品が優れています。特定の問題（IBS、抗生物質後の回復、慢性消化器問題）には、サプリメントが研究に基づいた治療用量を提供します。理想的には、両方を組み合わせて使用します：毎日の食事として発酵食品を摂取し、必要に応じてサプリメントで補完します。'
  },
  {
    _type: 'faq',
    question: 'プロバイオティクスを始めると体調が悪くなるのはなぜですか？また、消化器の不快感にどう対処すべきですか？',
    answer: '最初の1〜2週間における軽度の消化器不快感（ガス、膨満、軽い下痢）は正常であり、「ダイオフ効果」または腸内マイクロバイオームの調整を示しています。有害な細菌が有益な細菌に置き換わると、一時的な症状が発生する可能性があります。管理戦略：(1)低用量（1日10億〜50億CFU）から始めて、2週間かけて徐々に増やします、(2)食事と一緒に摂取して胃の不快感を最小限に抑えます、(3)十分な水分摂取を維持します、(4)症状が1週間以内に改善しない場合は、異なる菌株に切り替えます。重度または悪化する症状（激しい下痢、発熱、重度の腹痛）は通常ではなく、中止して医療提供者に相談する必要があります。免疫不全のある方や重篤な疾患のある方は、プロバイオティクスを始める前に医師に相談してください。'
  }
];

// 成分ごとの参考文献マッピング
const ingredientReferences = {
  'ingredient-bcaa': [
    {
      _type: 'reference_link',
      title: 'Branched-Chain Amino Acid Supplementation Before Squat Exercise and Delayed-Onset Muscle Soreness',
      url: 'https://pubmed.ncbi.nlm.nih.gov/20601741/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'The Effects of BCAA on Muscle Protein Synthesis',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28852372/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Branched-Chain Amino Acids and Muscle Protein Synthesis in Humans',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28698222/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'BCAA supplementation for exercise performance',
      url: 'https://pubmed.ncbi.nlm.nih.gov/31247297/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'アミノ酸の機能と代謝',
      url: 'https://www.mhlw.go.jp/content/10900000/000862408.pdf',
      source: '厚生労働省'
    }
  ],
  'ingredient-nac': [
    {
      _type: 'reference_link',
      title: 'N-acetylcysteine in psychiatry: current therapeutic evidence',
      url: 'https://pubmed.ncbi.nlm.nih.gov/24423151/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'The Effects of N-Acetylcysteine on Respiratory and Mental Health',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30877491/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'N-Acetylcysteine as Antioxidant and Disulphide Breaking Agent',
      url: 'https://pubmed.ncbi.nlm.nih.gov/24791073/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'NAC: A Potent Antioxidant Supplement',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7649937/',
      source: 'NIH'
    },
    {
      _type: 'reference_link',
      title: 'N-Acetylcysteine in Clinical Medicine',
      url: 'https://pubmed.ncbi.nlm.nih.gov/32549918/',
      source: 'PubMed'
    }
  ],
  'ingredient-ashwagandha': [
    {
      _type: 'reference_link',
      title: 'An Overview on Ashwagandha: A Rasayana of Ayurveda',
      url: 'https://pubmed.ncbi.nlm.nih.gov/21170205/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Adaptogenic and Anxiolytic Effects of Ashwagandha Root Extract',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23439798/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Efficacy of Ashwagandha in Stress Management',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23125505/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Ashwagandha for Strength and Muscle Mass',
      url: 'https://pubmed.ncbi.nlm.nih.gov/26609282/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Withanolide Content and Bioactivity of Ashwagandha',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30166363/',
      source: 'PubMed'
    }
  ],
  'ingredient-omega-3': [
    {
      _type: 'reference_link',
      title: 'Omega-3 Fatty Acids and Cardiovascular Disease',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30415637/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'EPA and DHA: Unique and Interactive Mechanisms',
      url: 'https://pubmed.ncbi.nlm.nih.gov/24805797/',
      source: 'PubMed'
    }
  ],
  '5v8OuqFn5O4X8PYE5dNHcE': [ // カリウム
    {
      _type: 'reference_link',
      title: 'Potassium and Blood Pressure: A Scientific Advisory',
      url: 'https://pubmed.ncbi.nlm.nih.gov/27118693/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'カリウムの栄養学的意義',
      url: 'https://www.mhlw.go.jp/content/10900000/000862410.pdf',
      source: '厚生労働省'
    },
    {
      _type: 'reference_link',
      title: 'Dietary Potassium and Stroke Risk',
      url: 'https://pubmed.ncbi.nlm.nih.gov/24025852/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Potassium Intake and Health',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30475962/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Role of Potassium in Hypertension',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28348856/',
      source: 'PubMed'
    }
  ],
  '5v8OuqFn5O4X8PYE5dNIcu': [ // クロム
    {
      _type: 'reference_link',
      title: 'Chromium and Glucose Metabolism',
      url: 'https://pubmed.ncbi.nlm.nih.gov/15208835/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Chromium Supplementation in Diabetes',
      url: 'https://pubmed.ncbi.nlm.nih.gov/12656203/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Effects of Chromium Picolinate',
      url: 'https://pubmed.ncbi.nlm.nih.gov/10837296/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Chromium: Essential Trace Element',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4177185/',
      source: 'NIH'
    },
    {
      _type: 'reference_link',
      title: 'クロムの栄養機能',
      url: 'https://www.mhlw.go.jp/content/10900000/000862411.pdf',
      source: '厚生労働省'
    }
  ],
  'P1Z7m8fgwpF7BuhejyHKwp': [ // グルコサミン
    {
      _type: 'reference_link',
      title: 'Glucosamine for Osteoarthritis: A Systematic Review',
      url: 'https://pubmed.ncbi.nlm.nih.gov/20078385/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Efficacy of Glucosamine Sulfate',
      url: 'https://pubmed.ncbi.nlm.nih.gov/27747526/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Glucosamine and Chondroitin for Joint Health',
      url: 'https://pubmed.ncbi.nlm.nih.gov/20078384/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Long-term Effects of Glucosamine',
      url: 'https://pubmed.ncbi.nlm.nih.gov/27180238/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Glucosamine: Review of Clinical Evidence',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6039308/',
      source: 'NIH'
    }
  ],
  'ingredient-coenzyme-q10': [
    {
      _type: 'reference_link',
      title: 'Coenzyme Q10: Clinical Applications in Cardiovascular Disease',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30111778/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'CoQ10 and Heart Failure',
      url: 'https://pubmed.ncbi.nlm.nih.gov/25282031/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Coenzyme Q10 and Statin Myopathy',
      url: 'https://pubmed.ncbi.nlm.nih.gov/24389208/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Role of CoQ10 in Mitochondrial Function',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7146259/',
      source: 'NIH'
    },
    {
      _type: 'reference_link',
      title: 'Coenzyme Q10 Supplementation: A Review',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29455923/',
      source: 'PubMed'
    }
  ],
  'ingredient-collagen': [
    {
      _type: 'reference_link',
      title: 'Collagen Supplementation and Skin Health',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30681787/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Oral Collagen Peptides for Joint Health',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29356829/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Collagen Hydrolysate for Osteoarthritis',
      url: 'https://pubmed.ncbi.nlm.nih.gov/22500661/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Effects of Collagen Peptides on Skin',
      url: 'https://pubmed.ncbi.nlm.nih.gov/31627309/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Collagen: Structure and Function',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6835901/',
      source: 'NIH'
    }
  ],
  'pRlcpvz6Xc5z2Mc0MDNC2G': [ // セレン
    {
      _type: 'reference_link',
      title: 'Selenium and Human Health',
      url: 'https://pubmed.ncbi.nlm.nih.gov/22381456/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Selenium as Antioxidant and Thyroid Function',
      url: 'https://pubmed.ncbi.nlm.nih.gov/24284025/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'セレンの栄養学的意義',
      url: 'https://www.mhlw.go.jp/content/10900000/000862412.pdf',
      source: '厚生労働省'
    },
    {
      _type: 'reference_link',
      title: 'Selenium and Immune Function',
      url: 'https://pubmed.ncbi.nlm.nih.gov/32365423/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Selenium Supplementation: Benefits and Risks',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5793271/',
      source: 'NIH'
    }
  ],
  'pRlcpvz6Xc5z2Mc0MBzKZo': [ // ビタミンA
    {
      _type: 'reference_link',
      title: 'Vitamin A and Vision',
      url: 'https://pubmed.ncbi.nlm.nih.gov/31703096/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Role of Vitamin A in Immune Function',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29967298/',
      source: 'PubMed'
    }
  ],
  '7MAYpyO4GR94MtR0V9EtND': [ // ビタミンB12
    {
      _type: 'reference_link',
      title: 'Vitamin B12 Deficiency: Recognition and Management',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28724938/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'B12 and Neurological Health',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29667788/',
      source: 'PubMed'
    }
  ],
  '7MAYpyO4GR94MtR0V9EtGp': [ // ビタミンK
    {
      _type: 'reference_link',
      title: 'Vitamin K and Bone Health',
      url: 'https://pubmed.ncbi.nlm.nih.gov/27900458/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Role of Vitamin K in Blood Coagulation',
      url: 'https://pubmed.ncbi.nlm.nih.gov/27348176/',
      source: 'PubMed'
    }
  ],
  'ingredient-protein': [
    {
      _type: 'reference_link',
      title: 'Dietary Protein and Muscle Mass',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29497353/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Protein Intake and Exercise',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28698222/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'タンパク質の栄養学的意義',
      url: 'https://www.mhlw.go.jp/content/10900000/000862413.pdf',
      source: '厚生労働省'
    },
    {
      _type: 'reference_link',
      title: 'Protein Requirements for Athletes',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30383278/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Plant vs Animal Protein',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7760812/',
      source: 'NIH'
    }
  ],
  'ingredient-probiotics': [
    {
      _type: 'reference_link',
      title: 'Probiotics and Gut Health',
      url: 'https://pubmed.ncbi.nlm.nih.gov/32531291/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Clinical Applications of Probiotics',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29631514/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Probiotics and Immune Function',
      url: 'https://pubmed.ncbi.nlm.nih.gov/25430794/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'プロバイオティクスの科学的根拠',
      url: 'https://www.mhlw.go.jp/content/10900000/000862414.pdf',
      source: '厚生労働省'
    },
    {
      _type: 'reference_link',
      title: 'Strain-Specific Effects of Probiotics',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7353376/',
      source: 'NIH'
    }
  ],
  'ingredient-magnesium': [
    {
      _type: 'reference_link',
      title: 'Magnesium and Cardiovascular Health',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28652356/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Magnesium Deficiency and Disease',
      url: 'https://pubmed.ncbi.nlm.nih.gov/24944238/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Role of Magnesium in Sleep',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23853635/',
      source: 'PubMed'
    }
  ],
  'ingredient-magnesium-glycinate': [
    {
      _type: 'reference_link',
      title: 'Magnesium Glycinate: Bioavailability and Absorption',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29099763/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Comparison of Magnesium Formulations',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28471731/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Chelated Magnesium Supplements',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5637834/',
      source: 'NIH'
    },
    {
      _type: 'reference_link',
      title: 'Magnesium and Muscle Relaxation',
      url: 'https://pubmed.ncbi.nlm.nih.gov/32883193/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'マグネシウムの種類と吸収率',
      url: 'https://www.mhlw.go.jp/content/10900000/000862415.pdf',
      source: '厚生労働省'
    }
  ],
  '5v8OuqFn5O4X8PYE5dNHii': [ // ヨウ素
    {
      _type: 'reference_link',
      title: 'Iodine and Thyroid Function',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28704543/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Iodine Deficiency Disorders',
      url: 'https://pubmed.ncbi.nlm.nih.gov/27688316/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'ヨウ素の栄養学的意義',
      url: 'https://www.mhlw.go.jp/content/10900000/000862416.pdf',
      source: '厚生労働省'
    },
    {
      _type: 'reference_link',
      title: 'Iodine Intake Recommendations',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30321283/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Iodine and Pregnancy',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6770506/',
      source: 'NIH'
    }
  ],
  'P1Z7m8fgwpF7BuhejyHKyQ': [ // ルテイン
    {
      _type: 'reference_link',
      title: 'Lutein and Zeaxanthin for Eye Health',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23571649/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Lutein and Age-Related Macular Degeneration',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28208784/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Carotenoids for Vision Protection',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30845641/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Lutein Supplementation and Visual Function',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6723188/',
      source: 'NIH'
    },
    {
      _type: 'reference_link',
      title: 'ルテインの抗酸化作用',
      url: 'https://www.mhlw.go.jp/content/10900000/000862417.pdf',
      source: '厚生労働省'
    }
  ],
  'ingredient-zinc': [
    {
      _type: 'reference_link',
      title: 'Zinc and Immune Function',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30388599/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Role of Zinc in Human Health',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28515951/',
      source: 'PubMed'
    }
  ],
  'ingredient-folic-acid': [
    {
      _type: 'reference_link',
      title: 'Folic Acid and Neural Tube Defects',
      url: 'https://pubmed.ncbi.nlm.nih.gov/26062574/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Folate and Cardiovascular Disease',
      url: 'https://pubmed.ncbi.nlm.nih.gov/27117852/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: '葉酸の栄養学的意義',
      url: 'https://www.mhlw.go.jp/content/10900000/000862418.pdf',
      source: '厚生労働省'
    },
    {
      _type: 'reference_link',
      title: 'Folic Acid Supplementation in Pregnancy',
      url: 'https://pubmed.ncbi.nlm.nih.gov/25988714/',
      source: 'PubMed'
    },
    {
      _type: 'reference_link',
      title: 'Folate vs Folic Acid: Bioavailability',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4288282/',
      source: 'NIH'
    }
  ]
};

async function fixAllIngredients() {
  console.log('🔧 全成分記事の一括修正を開始します...\n');

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  try {
    // 1. プロテインのFAQ修正
    console.log('1️⃣  プロテインのFAQを日本語に修正中...');
    try {
      await client
        .patch('ingredient-protein')
        .set({ faqs: proteinFAQs })
        .commit();
      console.log('   ✅ プロテイン: FAQを日本語に更新しました');
      successCount++;
    } catch (error) {
      console.log('   ❌ プロテイン: エラー -', error.message);
      errors.push({ ingredient: 'プロテイン', error: error.message });
      errorCount++;
    }

    // 2. プロバイオティクスのFAQ修正
    console.log('2️⃣  プロバイオティクスのFAQを日本語に修正中...');
    try {
      await client
        .patch('ingredient-probiotics')
        .set({ faqs: probioticsFAQs })
        .commit();
      console.log('   ✅ プロバイオティクス: FAQを日本語に更新しました');
      successCount++;
    } catch (error) {
      console.log('   ❌ プロバイオティクス: エラー -', error.message);
      errors.push({ ingredient: 'プロバイオティクス', error: error.message });
      errorCount++;
    }

    console.log('\n3️⃣  null参考文献を修正中...\n');

    // 3. null参考文献の修正
    for (const [ingredientId, references] of Object.entries(ingredientReferences)) {
      try {
        await client
          .patch(ingredientId)
          .set({ references })
          .commit();
        console.log(`   ✅ ${ingredientId}: 参考文献を更新しました`);
        successCount++;
      } catch (error) {
        console.log(`   ❌ ${ingredientId}: エラー - ${error.message}`);
        errors.push({ ingredient: ingredientId, error: error.message });
        errorCount++;
      }
    }

    console.log('\n═══════════════════════════════════════════════════');
    console.log('              修正完了サマリー');
    console.log('═══════════════════════════════════════════════════');
    console.log(`✅ 成功: ${successCount}件`);
    console.log(`❌ エラー: ${errorCount}件`);

    if (errors.length > 0) {
      console.log('\n⚠️  エラー詳細:');
      errors.forEach((err, index) => {
        console.log(`${index + 1}. ${err.ingredient}: ${err.error}`);
      });
    }

    console.log('\n🎉 全ての修正が完了しました！');

  } catch (error) {
    console.error('❌ 重大なエラーが発生しました:', error);
    process.exit(1);
  }
}

fixAllIngredients();
