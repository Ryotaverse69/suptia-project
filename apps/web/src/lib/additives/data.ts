/**
 * 添加物マスタデータ（主要50種）
 *
 * サプリメントで一般的に使用される添加物を中心に収録
 * データソース: 厚生労働省、JECFA、EFSA、EWG
 *
 * 今後200-400種まで拡張予定
 */

import type { AdditiveInfo } from "./types";

export const ADDITIVES_DATA: AdditiveInfo[] = [
  // ============================================
  // 賦形剤・増量剤 (Filler)
  // ============================================
  {
    id: "cellulose",
    name: "セルロース",
    aliases: ["結晶セルロース", "微結晶セルロース", "MCC", "E460", "植物繊維"],
    category: "filler",
    safetyGrade: "safe",
    concerns: [],
    contraindications: [],
    rationale: {
      summary:
        "植物由来の食物繊維。消化されずに排出され、安全性が確立されている",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし（安全性が十分に確立）",
        },
        {
          source: "efsa",
          detail: "食品添加物として安全と評価",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "カプセルや錠剤の形を整えるための増量剤",
    supplementPurpose: "錠剤の成形、カプセル充填",
  },
  {
    id: "maltodextrin",
    name: "マルトデキストリン",
    aliases: ["デキストリン", "難消化性デキストリン", "食物繊維"],
    category: "filler",
    safetyGrade: "safe",
    concerns: ["高GI食品のため、糖尿病の方は過剰摂取に注意"],
    contraindications: [
      {
        condition: "糖尿病",
        severity: "warning",
        description: "血糖値に影響する可能性があるため、過剰摂取に注意",
      },
    ],
    rationale: {
      summary: "でんぷん由来の多糖類。一般的に安全だが、GI値が高い",
      sources: [
        {
          source: "mhlw",
          detail: "既存添加物として使用可",
        },
        {
          source: "jecfa",
          detail: "ADI設定なし",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "粉末の流動性向上、増量剤",
    supplementPurpose: "パウダー製品の安定化",
  },
  {
    id: "calcium-carbonate",
    name: "炭酸カルシウム",
    aliases: ["�iteiteite", "CaCO3", "石灰石", "E170"],
    category: "filler",
    safetyGrade: "safe",
    concerns: [],
    contraindications: [
      {
        condition: "腎臓病",
        severity: "warning",
        description: "腎機能低下時はカルシウム蓄積のリスク",
      },
    ],
    rationale: {
      summary: "天然由来のカルシウム源。適量であれば安全",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし（安全）",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "増量剤、カルシウム強化",
    supplementPurpose: "錠剤の増量、カルシウム補給",
  },
  {
    id: "rice-flour",
    name: "米粉",
    aliases: ["ライスパウダー", "rice powder"],
    category: "filler",
    safetyGrade: "safe",
    concerns: [],
    contraindications: [],
    rationale: {
      summary: "天然の米由来。アレルゲンリスクが低く安全",
      sources: [
        {
          source: "mhlw",
          detail: "食品として安全性確立",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "カプセル充填材",
    supplementPurpose: "グルテンフリーの増量剤",
  },

  // ============================================
  // カプセル素材 (Capsule)
  // ============================================
  {
    id: "gelatin",
    name: "ゼラチン",
    aliases: ["豚ゼラチン", "牛ゼラチン", "魚ゼラチン", "E441"],
    category: "capsule",
    safetyGrade: "safe",
    concerns: ["動物由来のためベジタリアン不可", "アレルギーの可能性（稀）"],
    contraindications: [],
    rationale: {
      summary: "動物性タンパク質由来。長い使用実績があり安全",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし",
        },
        {
          source: "efsa",
          detail: "安全性に問題なし",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "ソフトジェル・ハードカプセルの主原料",
    supplementPurpose: "カプセル製造",
  },
  {
    id: "hpmc",
    name: "ヒプロメロース",
    aliases: [
      "HPMC",
      "ヒドロキシプロピルメチルセルロース",
      "植物性カプセル",
      "E464",
    ],
    category: "capsule",
    safetyGrade: "safe",
    concerns: [],
    contraindications: [],
    rationale: {
      summary: "植物由来セルロースから製造。ベジタリアン対応で安全",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし（安全）",
        },
        {
          source: "efsa",
          detail: "食品添加物として承認",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "植物性ハードカプセルの原料",
    supplementPurpose: "ベジタリアン対応カプセル",
  },
  {
    id: "pullulan",
    name: "プルラン",
    aliases: ["プルランカプセル", "E1204"],
    category: "capsule",
    safetyGrade: "safe",
    concerns: [],
    contraindications: [],
    rationale: {
      summary: "天然多糖類由来。酸素バリア性が高く安全",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "高品質カプセルの原料",
    supplementPurpose: "酸化防止効果のあるカプセル",
  },

  // ============================================
  // コーティング剤・光沢剤 (Coating)
  // ============================================
  {
    id: "shellac",
    name: "シェラック",
    aliases: ["セラック", "ラックカイガラムシ", "E904"],
    category: "coating",
    safetyGrade: "safe",
    concerns: ["昆虫由来のためビーガン不可"],
    contraindications: [],
    rationale: {
      summary: "天然樹脂。長い使用実績があり安全",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "錠剤のコーティング、光沢剤",
    supplementPurpose: "錠剤の保護膜形成",
  },
  {
    id: "carnauba-wax",
    name: "カルナウバロウ",
    aliases: ["カルナバワックス", "E903"],
    category: "coating",
    safetyGrade: "safe",
    concerns: [],
    contraindications: [],
    rationale: {
      summary: "ブラジルヤシ由来の天然ワックス。植物性で安全",
      sources: [
        {
          source: "jecfa",
          detail: "ADI 7mg/kg体重/日",
        },
        {
          source: "efsa",
          detail: "安全性確認済み",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    adiMgPerKg: 7,
    usageDescription: "錠剤の光沢剤",
    supplementPurpose: "錠剤表面の保護",
  },
  {
    id: "beeswax",
    name: "ミツロウ",
    aliases: ["蜜蝋", "ビーズワックス", "E901"],
    category: "coating",
    safetyGrade: "safe",
    concerns: ["蜂製品のためビーガン不可", "蜂アレルギーの方は注意"],
    contraindications: [],
    rationale: {
      summary: "天然の蜂由来ワックス。安全性確立",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "ソフトジェルのコーティング",
    supplementPurpose: "カプセルの保護",
  },

  // ============================================
  // 滑沢剤 (Lubricant)
  // ============================================
  {
    id: "magnesium-stearate",
    name: "ステアリン酸マグネシウム",
    aliases: ["ステアリン酸Mg", "E470b"],
    category: "lubricant",
    safetyGrade: "safe",
    concerns: ["極端な高用量で吸収阻害の可能性（通常使用量では問題なし）"],
    contraindications: [],
    rationale: {
      summary:
        "製造工程で広く使用される滑沢剤。通常の使用量では安全性に問題なし",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし（ステアリン酸として安全）",
        },
        {
          source: "efsa",
          detail: "マグネシウム塩として安全と評価",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "錠剤製造時の滑沢剤（機械への付着防止）",
    supplementPurpose: "製造効率向上",
  },
  {
    id: "stearic-acid",
    name: "ステアリン酸",
    aliases: ["オクタデカン酸", "E570"],
    category: "lubricant",
    safetyGrade: "safe",
    concerns: [],
    contraindications: [],
    rationale: {
      summary: "天然脂肪酸。体内でも生成される物質で安全",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "滑沢剤、乳化剤",
    supplementPurpose: "錠剤の成形補助",
  },
  {
    id: "silicon-dioxide",
    name: "二酸化ケイ素",
    aliases: ["シリカ", "微粒二酸化ケイ素", "E551"],
    category: "lubricant",
    safetyGrade: "safe",
    concerns: [],
    contraindications: [],
    rationale: {
      summary: "天然鉱物由来。消化管で吸収されず排出される",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし",
        },
        {
          source: "efsa",
          detail: "ナノ粒子以外は安全と評価",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "固結防止剤、流動性向上",
    supplementPurpose: "パウダーのさらさら感維持",
  },

  // ============================================
  // 甘味料 (Sweetener)
  // ============================================
  {
    id: "stevia",
    name: "ステビア",
    aliases: ["ステビオサイド", "レバウディオサイドA", "E960"],
    category: "sweetener",
    safetyGrade: "safe",
    concerns: [],
    contraindications: [],
    rationale: {
      summary: "植物由来の天然甘味料。砂糖の代替として安全",
      sources: [
        {
          source: "jecfa",
          detail: "ADI 4mg/kg体重/日（ステビオール当量）",
        },
        {
          source: "efsa",
          detail: "安全性確認済み",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    adiMgPerKg: 4,
    usageDescription: "低カロリー甘味料",
    supplementPurpose: "チュアブル錠・グミの甘味付け",
  },
  {
    id: "erythritol",
    name: "エリスリトール",
    aliases: ["E968"],
    category: "sweetener",
    safetyGrade: "safe",
    concerns: ["大量摂取で消化器症状の可能性（他の糖アルコールより少ない）"],
    contraindications: [],
    rationale: {
      summary: "糖アルコールの中で最も消化器への影響が少ない",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし（安全）",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "低カロリー甘味料",
    supplementPurpose: "糖質制限対応製品の甘味",
  },
  {
    id: "xylitol",
    name: "キシリトール",
    aliases: ["E967"],
    category: "sweetener",
    safetyGrade: "caution",
    concerns: [
      "大量摂取で下痢・腹部膨満感",
      "犬には有毒（ペットのいる家庭は保管注意）",
    ],
    contraindications: [
      {
        condition: "消化器疾患",
        severity: "warning",
        description: "過敏性腸症候群などの方は下痢を起こしやすい",
      },
    ],
    rationale: {
      summary: "糖アルコール。適量なら安全だが、過剰摂取で消化器症状",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし（一般的な摂取量で安全）",
        },
        {
          source: "efsa",
          detail: "10g/日以上で下痢リスク",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "低カロリー甘味料",
    supplementPurpose: "チュアブル錠の甘味",
  },
  {
    id: "sucralose",
    name: "スクラロース",
    aliases: ["E955"],
    category: "sweetener",
    safetyGrade: "caution",
    concerns: [
      "高温調理で有害物質生成の報告あり",
      "腸内細菌への影響の研究あり",
    ],
    contraindications: [],
    rationale: {
      summary: "人工甘味料。安全性は確立しているが、一部研究で懸念あり",
      sources: [
        {
          source: "jecfa",
          detail: "ADI 15mg/kg体重/日",
        },
        {
          source: "efsa",
          detail: "設定ADI内で安全",
        },
        {
          source: "ewg",
          detail: "一部研究で腸内細菌への影響を指摘",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    adiMgPerKg: 15,
    usageDescription: "高甘味度人工甘味料",
    supplementPurpose: "低カロリー製品の甘味",
  },
  {
    id: "aspartame",
    name: "アスパルテーム",
    aliases: ["E951", "パルスイート"],
    category: "sweetener",
    safetyGrade: "caution",
    concerns: [
      "フェニルケトン尿症患者は禁忌",
      "IARCによる「ヒトに対して発がん性がある可能性」分類（2B）",
    ],
    contraindications: [
      {
        condition: "フェニルケトン尿症",
        severity: "critical",
        description: "フェニルアラニンを含むため絶対禁忌",
      },
    ],
    rationale: {
      summary: "ADI内では安全とされるが、IARC分類とPKU禁忌のため注意カテゴリ",
      sources: [
        {
          source: "jecfa",
          detail: "ADI 40mg/kg体重/日",
        },
        {
          source: "efsa",
          detail: "ADI内で安全",
        },
        {
          source: "suptia",
          detail: "PKU禁忌とIARC分類を考慮し注意カテゴリに分類",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    adiMgPerKg: 40,
    usageDescription: "高甘味度人工甘味料",
    supplementPurpose: "低カロリー製品",
  },
  {
    id: "acesulfame-k",
    name: "アセスルファムK",
    aliases: ["アセスルファムカリウム", "E950"],
    category: "sweetener",
    safetyGrade: "caution",
    concerns: ["長期的な健康影響についての研究が継続中"],
    contraindications: [],
    rationale: {
      summary: "人工甘味料。公的機関では安全とされるが、一部研究で懸念",
      sources: [
        {
          source: "jecfa",
          detail: "ADI 15mg/kg体重/日",
        },
        {
          source: "ewg",
          detail: "一部の動物実験で懸念が指摘",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    adiMgPerKg: 15,
    usageDescription: "高甘味度人工甘味料",
    supplementPurpose: "低カロリー製品",
  },

  // ============================================
  // 着色料 (Colorant)
  // ============================================
  {
    id: "titanium-dioxide",
    name: "二酸化チタン",
    aliases: ["酸化チタン", "E171"],
    category: "colorant",
    safetyGrade: "avoid",
    concerns: [
      "EUでは2022年に食品添加物として禁止",
      "ナノ粒子の安全性懸念",
      "遺伝毒性の可能性を排除できない",
    ],
    contraindications: [],
    rationale: {
      summary: "EUで禁止された着色料。日本では使用可だが回避を推奨",
      sources: [
        {
          source: "efsa",
          detail: "2021年に安全性を再評価し、遺伝毒性の懸念を指摘",
        },
        {
          source: "mhlw",
          detail: "日本では引き続き使用可能",
        },
        {
          source: "suptia",
          detail: "EUの禁止措置を受け、回避推奨に分類",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "白色着色料",
    supplementPurpose: "錠剤・カプセルの白色化",
  },
  {
    id: "caramel-color",
    name: "カラメル色素",
    aliases: ["カラメル", "E150a", "E150b", "E150c", "E150d"],
    category: "colorant",
    safetyGrade: "caution",
    concerns: ["E150c/E150dには4-MEIという発がん性物質が微量含まれる可能性"],
    contraindications: [],
    rationale: {
      summary: "種類により安全性が異なる。E150a/bは安全、E150c/dは注意",
      sources: [
        {
          source: "jecfa",
          detail: "種類別にADI設定あり",
        },
        {
          source: "efsa",
          detail: "E150c/dの4-MEI含有量に基準設定",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "茶色系着色料",
    supplementPurpose: "錠剤の着色",
  },
  {
    id: "beta-carotene",
    name: "β-カロテン",
    aliases: ["ベータカロテン", "カロチン", "E160a"],
    category: "colorant",
    safetyGrade: "safe",
    concerns: ["喫煙者への高用量サプリ摂取は肺がんリスク増加の報告あり"],
    contraindications: [
      {
        condition: "喫煙者",
        severity: "warning",
        description: "高用量サプリメントでの摂取は避ける",
      },
    ],
    rationale: {
      summary: "天然色素でビタミンA前駆体。着色料としての使用量は安全",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし（食品由来として安全）",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "オレンジ〜黄色の天然着色料",
    supplementPurpose: "天然由来の着色",
  },
  {
    id: "riboflavin",
    name: "リボフラビン",
    aliases: ["ビタミンB2", "E101"],
    category: "colorant",
    safetyGrade: "safe",
    concerns: [],
    contraindications: [],
    rationale: {
      summary: "ビタミンB2そのもの。栄養素として安全",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "黄色の着色料",
    supplementPurpose: "栄養強化兼着色",
  },
  {
    id: "annatto",
    name: "アナトー色素",
    aliases: ["ベニノキ", "E160b"],
    category: "colorant",
    safetyGrade: "safe",
    concerns: ["稀にアレルギー反応の報告"],
    contraindications: [],
    rationale: {
      summary: "天然植物由来色素。長い使用実績があり安全",
      sources: [
        {
          source: "jecfa",
          detail: "ADI 0-0.65mg/kg体重/日（ビキシン/ノルビキシンとして）",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    adiMgPerKg: 0.65,
    usageDescription: "黄〜オレンジ色の天然着色料",
    supplementPurpose: "天然由来の着色",
  },
  {
    id: "red-40",
    name: "赤色40号",
    aliases: ["アルラレッドAC", "E129", "食用赤色40号"],
    category: "colorant",
    safetyGrade: "avoid",
    concerns: [
      "子供の行動への影響（ADHDとの関連）の研究あり",
      "一部の国で子供向け食品から除外",
    ],
    contraindications: [
      {
        condition: "小児",
        severity: "warning",
        description: "行動への影響の可能性があるため、子供は避けた方が良い",
      },
    ],
    rationale: {
      summary: "タール色素。子供への影響懸念から回避推奨",
      sources: [
        {
          source: "jecfa",
          detail: "ADI 7mg/kg体重/日",
        },
        {
          source: "efsa",
          detail: "Southampton研究を受けて注意喚起",
        },
        {
          source: "suptia",
          detail: "子供への影響懸念から回避推奨に分類",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    adiMgPerKg: 7,
    usageDescription: "赤色合成着色料",
    supplementPurpose: "グミ・チュアブルの着色",
  },
  {
    id: "yellow-5",
    name: "黄色5号",
    aliases: ["タートラジン", "E102", "食用黄色5号"],
    category: "colorant",
    safetyGrade: "avoid",
    concerns: [
      "アスピリンアレルギーとの交差反応",
      "子供の行動への影響の研究あり",
    ],
    contraindications: [
      {
        condition: "アスピリンアレルギー",
        severity: "warning",
        description: "交差反応の可能性",
      },
    ],
    rationale: {
      summary: "タール色素。アレルギーと子供への影響懸念",
      sources: [
        {
          source: "jecfa",
          detail: "ADI 7.5mg/kg体重/日",
        },
        {
          source: "efsa",
          detail: "アレルギー反応の報告あり",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    adiMgPerKg: 7.5,
    usageDescription: "黄色合成着色料",
    supplementPurpose: "錠剤の着色",
  },

  // ============================================
  // 保存料 (Preservative)
  // ============================================
  {
    id: "sorbic-acid",
    name: "ソルビン酸",
    aliases: ["ソルビン酸K", "ソルビン酸カリウム", "E200", "E202"],
    category: "preservative",
    safetyGrade: "safe",
    concerns: [],
    contraindications: [],
    rationale: {
      summary: "広く使用される保存料。適切な使用量では安全",
      sources: [
        {
          source: "jecfa",
          detail: "ADI 25mg/kg体重/日（ソルビン酸として）",
        },
        {
          source: "efsa",
          detail: "安全性確認済み",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    adiMgPerKg: 25,
    usageDescription: "カビ・酵母の抑制",
    supplementPurpose: "製品の保存性向上",
  },
  {
    id: "sodium-benzoate",
    name: "安息香酸ナトリウム",
    aliases: ["安息香酸Na", "E211"],
    category: "preservative",
    safetyGrade: "caution",
    concerns: ["ビタミンCと反応してベンゼン生成の可能性"],
    contraindications: [],
    rationale: {
      summary: "広く使用されるが、ビタミンCとの併用で懸念あり",
      sources: [
        {
          source: "jecfa",
          detail: "ADI 5mg/kg体重/日",
        },
        {
          source: "efsa",
          detail: "アスコルビン酸との反応に注意",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    adiMgPerKg: 5,
    usageDescription: "保存料",
    supplementPurpose: "液体製品の保存",
  },

  // ============================================
  // 酸化防止剤 (Antioxidant)
  // ============================================
  {
    id: "tocopherol",
    name: "トコフェロール",
    aliases: ["ビタミンE", "d-α-トコフェロール", "混合トコフェロール", "E306"],
    category: "antioxidant",
    safetyGrade: "safe",
    concerns: [],
    contraindications: [],
    rationale: {
      summary: "天然ビタミンE。抗酸化剤として安全",
      sources: [
        {
          source: "jecfa",
          detail: "ADI 0.15-2mg/kg体重/日（d-α-トコフェロールとして）",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    adiMgPerKg: 2,
    usageDescription: "油脂の酸化防止",
    supplementPurpose: "オメガ3製品などの酸化防止",
  },
  {
    id: "ascorbic-acid",
    name: "アスコルビン酸",
    aliases: ["ビタミンC", "L-アスコルビン酸", "E300"],
    category: "antioxidant",
    safetyGrade: "safe",
    concerns: [],
    contraindications: [],
    rationale: {
      summary: "ビタミンC。栄養素として広く認められ安全",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "酸化防止剤",
    supplementPurpose: "製品の安定化",
  },
  {
    id: "rosemary-extract",
    name: "ローズマリー抽出物",
    aliases: ["ローズマリーエキス", "E392"],
    category: "antioxidant",
    safetyGrade: "safe",
    concerns: [],
    contraindications: [],
    rationale: {
      summary: "天然ハーブ由来。安全性確立",
      sources: [
        {
          source: "efsa",
          detail: "ADI設定あり、安全性確認済み",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "天然酸化防止剤",
    supplementPurpose: "天然由来の酸化防止",
  },
  {
    id: "bht",
    name: "BHT",
    aliases: ["ジブチルヒドロキシトルエン", "E321"],
    category: "antioxidant",
    safetyGrade: "caution",
    concerns: ["一部の動物実験で発がん性の報告", "内分泌かく乱の懸念"],
    contraindications: [],
    rationale: {
      summary: "合成酸化防止剤。公的ADI内では安全だが、天然代替品あり",
      sources: [
        {
          source: "jecfa",
          detail: "ADI 0.3mg/kg体重/日",
        },
        {
          source: "ewg",
          detail: "天然代替品への切り替えを推奨",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    adiMgPerKg: 0.3,
    usageDescription: "合成酸化防止剤",
    supplementPurpose: "油脂の酸化防止",
  },
  {
    id: "bha",
    name: "BHA",
    aliases: ["ブチルヒドロキシアニソール", "E320"],
    category: "antioxidant",
    safetyGrade: "caution",
    concerns: ["IARC分類2B（発がん性の可能性）", "内分泌かく乱の懸念"],
    contraindications: [],
    rationale: {
      summary: "IARC分類により注意カテゴリ。天然代替品への切り替え推奨",
      sources: [
        {
          source: "jecfa",
          detail: "ADI 0.5mg/kg体重/日",
        },
        {
          source: "suptia",
          detail: "IARC分類2Bのため注意カテゴリに分類",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    adiMgPerKg: 0.5,
    usageDescription: "合成酸化防止剤",
    supplementPurpose: "油脂の酸化防止",
  },

  // ============================================
  // 乳化剤 (Emulsifier)
  // ============================================
  {
    id: "lecithin",
    name: "レシチン",
    aliases: ["大豆レシチン", "ひまわりレシチン", "E322"],
    category: "emulsifier",
    safetyGrade: "safe",
    concerns: ["大豆由来の場合、大豆アレルギーに注意"],
    contraindications: [
      {
        condition: "大豆アレルギー",
        severity: "warning",
        description: "大豆レシチンの場合は避ける（ひまわりレシチンは可）",
      },
    ],
    rationale: {
      summary: "天然由来の乳化剤。安全性確立",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "天然乳化剤",
    supplementPurpose: "ソフトジェルの製造",
  },
  {
    id: "glycerin",
    name: "グリセリン",
    aliases: ["グリセロール", "植物性グリセリン", "E422"],
    category: "emulsifier",
    safetyGrade: "safe",
    concerns: [],
    contraindications: [],
    rationale: {
      summary: "天然由来。体内でも生成される物質で安全",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "保湿剤、溶剤",
    supplementPurpose: "ソフトジェルの可塑剤",
  },
  {
    id: "polysorbate-80",
    name: "ポリソルベート80",
    aliases: ["Tween 80", "E433"],
    category: "emulsifier",
    safetyGrade: "caution",
    concerns: ["腸内細菌への影響の研究あり", "炎症促進の可能性"],
    contraindications: [],
    rationale: {
      summary: "一部研究で腸内環境への影響が指摘されている",
      sources: [
        {
          source: "jecfa",
          detail: "ADI 25mg/kg体重/日",
        },
        {
          source: "ewg",
          detail: "腸内細菌叢への影響を指摘する研究あり",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    adiMgPerKg: 25,
    usageDescription: "乳化剤",
    supplementPurpose: "液体製品の安定化",
  },

  // ============================================
  // 安定剤・増粘剤 (Stabilizer/Thickener)
  // ============================================
  {
    id: "xanthan-gum",
    name: "キサンタンガム",
    aliases: ["E415"],
    category: "thickener",
    safetyGrade: "safe",
    concerns: ["大量摂取で消化器症状の可能性"],
    contraindications: [],
    rationale: {
      summary: "微生物発酵由来の多糖類。一般的に安全",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "増粘剤、安定剤",
    supplementPurpose: "液体・クリーム製品の安定化",
  },
  {
    id: "guar-gum",
    name: "グアーガム",
    aliases: ["E412"],
    category: "thickener",
    safetyGrade: "safe",
    concerns: ["大量摂取で消化器症状"],
    contraindications: [],
    rationale: {
      summary: "天然植物由来の増粘剤。安全性確立",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "増粘剤",
    supplementPurpose: "製品の粘度調整",
  },
  {
    id: "pectin",
    name: "ペクチン",
    aliases: ["E440"],
    category: "thickener",
    safetyGrade: "safe",
    concerns: [],
    contraindications: [],
    rationale: {
      summary: "果物由来の天然食物繊維。安全",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "ゲル化剤、増粘剤",
    supplementPurpose: "グミサプリの製造",
  },
  {
    id: "carrageenan",
    name: "カラギナン",
    aliases: ["カラギーナン", "E407"],
    category: "thickener",
    safetyGrade: "caution",
    concerns: ["分解カラギナンは発がん性懸念", "腸内炎症の研究あり"],
    contraindications: [
      {
        condition: "消化器疾患",
        severity: "warning",
        description: "炎症性腸疾患の方は避けた方が良い",
      },
    ],
    rationale: {
      summary: "海藻由来だが、腸への影響を指摘する研究あり",
      sources: [
        {
          source: "jecfa",
          detail: "ADI 75mg/kg体重/日",
        },
        {
          source: "ewg",
          detail: "腸内炎症との関連を指摘する研究あり",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    adiMgPerKg: 75,
    usageDescription: "増粘剤、ゲル化剤",
    supplementPurpose: "液体製品の安定化",
  },

  // ============================================
  // pH調整剤 (Acidity Regulator)
  // ============================================
  {
    id: "citric-acid",
    name: "クエン酸",
    aliases: ["E330"],
    category: "acidity-regulator",
    safetyGrade: "safe",
    concerns: [],
    contraindications: [],
    rationale: {
      summary: "天然有機酸。体内でも生成される物質で安全",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "酸味料、pH調整剤",
    supplementPurpose: "製品の安定化",
  },
  {
    id: "malic-acid",
    name: "リンゴ酸",
    aliases: ["E296"],
    category: "acidity-regulator",
    safetyGrade: "safe",
    concerns: [],
    contraindications: [],
    rationale: {
      summary: "天然有機酸。果物に含まれる成分で安全",
      sources: [
        {
          source: "jecfa",
          detail: "ADI設定なし",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "酸味料",
    supplementPurpose: "風味調整",
  },

  // ============================================
  // 香料 (Flavor)
  // ============================================
  {
    id: "natural-flavor",
    name: "天然香料",
    aliases: ["天然フレーバー", "植物性香料"],
    category: "flavor",
    safetyGrade: "safe",
    concerns: ["具体的な成分が不明なことが多い"],
    contraindications: [],
    rationale: {
      summary: "天然由来の香料。一般的に安全",
      sources: [
        {
          source: "mhlw",
          detail: "天然香料として使用可",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "風味付け",
    supplementPurpose: "チュアブル・グミの風味",
  },
  {
    id: "artificial-flavor",
    name: "人工香料",
    aliases: ["合成香料"],
    category: "flavor",
    safetyGrade: "caution",
    concerns: ["具体的な化学物質が不明", "一部は安全性データ不十分"],
    contraindications: [],
    rationale: {
      summary: "合成香料は成分が多様で、個別評価が難しい",
      sources: [
        {
          source: "suptia",
          detail: "透明性の観点から天然香料より低評価",
        },
      ],
      lastReviewed: "2024-01-15",
    },
    usageDescription: "風味付け",
    supplementPurpose: "製品の風味",
  },
];

/**
 * IDで添加物を検索
 */
export function getAdditiveById(id: string): AdditiveInfo | undefined {
  return ADDITIVES_DATA.find((a) => a.id === id);
}

/**
 * カテゴリで添加物を絞り込み
 */
export function getAdditivesByCategory(
  category: AdditiveInfo["category"],
): AdditiveInfo[] {
  return ADDITIVES_DATA.filter((a) => a.category === category);
}

/**
 * 安全性グレードで添加物を絞り込み
 */
export function getAdditivesBySafetyGrade(
  grade: AdditiveInfo["safetyGrade"],
): AdditiveInfo[] {
  return ADDITIVES_DATA.filter((a) => a.safetyGrade === grade);
}

/**
 * 名前または別名で添加物を検索（部分一致）
 */
export function searchAdditive(query: string): AdditiveInfo | undefined {
  const normalizedQuery = query.toLowerCase().trim();

  return ADDITIVES_DATA.find((additive) => {
    // 正式名称で完全一致
    if (additive.name.toLowerCase() === normalizedQuery) {
      return true;
    }

    // 別名で完全一致
    if (
      additive.aliases.some((alias) => alias.toLowerCase() === normalizedQuery)
    ) {
      return true;
    }

    // 正式名称で部分一致
    if (additive.name.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // 別名で部分一致
    if (
      additive.aliases.some((alias) =>
        alias.toLowerCase().includes(normalizedQuery),
      )
    ) {
      return true;
    }

    return false;
  });
}
