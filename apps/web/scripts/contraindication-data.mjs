/**
 * 科学的根拠に基づく成分別の禁忌タグとリスクレベルのマッピング
 *
 * 参考文献：
 * - NIH Office of Dietary Supplements
 * - European Food Safety Authority (EFSA)
 * - 厚生労働省「日本人の食事摂取基準」
 * - 各種医学文献（PubMed）
 */

export const contraindicationData = {
  // ========== 最高リスク（Critical） ==========

  "ビタミンA（レチノール）": {
    riskLevel: "high", // 妊娠中の催奇形性のため
    contraindications: [
      "pregnant", // 催奇形性（1日10,000IU以上で危険）
      "breastfeeding", // 過剰摂取注意
      "liver-disease", // 肝臓で代謝
      "smoking", // 喫煙者は肺がんリスク増加（βカロテン）
    ],
  },

  // ========== 高リスク（High） ==========

  "アシュワガンダ": {
    riskLevel: "high",
    contraindications: [
      "pregnant", // 流産リスク
      "breastfeeding", // 安全性未確立
      "autoimmune-disease", // 免疫系刺激
      "thyroid-disorder", // 甲状腺ホルモンに影響
      "surgery", // 手術前2週間は中止
    ],
  },

  "ギンコ（イチョウ葉）": {
    riskLevel: "high",
    contraindications: [
      "pregnant",
      "breastfeeding",
      "bleeding-risk", // 出血リスク増加
      "surgery", // 手術前2週間は中止
      "anticoagulant-use", // ワルファリンなどと相互作用
      "antiplatelet-use", // アスピリンなどと相互作用
      "epilepsy", // 発作リスク
    ],
  },

  "ウコン（ターメリック）": {
    riskLevel: "medium",
    contraindications: [
      "pregnant", // 子宮刺激作用
      "breastfeeding",
      "bleeding-risk",
      "surgery", // 手術前2週間は中止
      "liver-disease", // 胆汁分泌促進
      "anticoagulant-use",
    ],
  },

  // ========== 中リスク（Medium） ==========

  "ビタミンD": {
    riskLevel: "medium",
    contraindications: [
      "kidney-disease", // 高カルシウム血症リスク
      "hypercalcemia", // カルシウム過剰
    ],
  },

  "ビタミンE": {
    riskLevel: "medium",
    contraindications: [
      "bleeding-risk",
      "surgery", // 手術前1ヶ月は中止推奨
      "anticoagulant-use", // 出血リスク増加
    ],
  },

  "ビタミンK": {
    riskLevel: "medium",
    contraindications: [
      "anticoagulant-use", // ワルファリンの効果を減弱
    ],
  },

  "ナイアシン（ビタミンB3）": {
    riskLevel: "medium",
    contraindications: [
      "liver-disease", // 肝機能障害リスク（高用量）
      "diabetes", // 血糖値への影響
      "stomach-ulcer", // 胃潰瘍悪化
    ],
  },

  "鉄分": {
    riskLevel: "medium",
    contraindications: [
      "hemochromatosis", // 鉄過剰症
      "stomach-ulcer", // 胃腸障害
    ],
  },

  "セレン": {
    riskLevel: "medium",
    contraindications: [
      "thyroid-disorder", // 甲状腺への影響
    ],
  },

  "ヨウ素": {
    riskLevel: "medium",
    contraindications: [
      "thyroid-disorder", // 甲状腺機能亢進症・低下症
      "autoimmune-disease", // 橋本病など
    ],
  },

  "亜鉛": {
    riskLevel: "medium",
    contraindications: [
      "kidney-disease", // 腎臓での蓄積
    ],
  },

  "カルシウム": {
    riskLevel: "low",
    contraindications: [
      "kidney-disease", // 腎結石リスク
      "hypercalcemia", // カルシウム過剰
    ],
  },

  "マグネシウム": {
    riskLevel: "low",
    contraindications: [
      "kidney-disease", // マグネシウム蓄積
    ],
  },

  "マグネシウムグリシネート": {
    riskLevel: "low",
    contraindications: [
      "kidney-disease",
    ],
  },

  "カリウム": {
    riskLevel: "medium",
    contraindications: [
      "kidney-disease", // 高カリウム血症リスク
      "heart-disease", // 不整脈リスク
    ],
  },

  "クロム": {
    riskLevel: "low",
    contraindications: [
      "diabetes", // 血糖値への影響（低血糖注意）
      "kidney-disease",
      "liver-disease",
    ],
  },

  // ========== アミノ酸系 ==========

  "BCAA(分岐鎖アミノ酸)": {
    riskLevel: "low",
    contraindications: [
      "surgery", // 血糖値への影響
    ],
  },

  "L-カルニチン": {
    riskLevel: "low",
    contraindications: [
      "thyroid-disorder", // 甲状腺ホルモン作用を阻害する可能性
    ],
  },

  "NAC（N-アセチルシステイン）": {
    riskLevel: "low",
    contraindications: [
      "asthma", // 気管支痙攣リスク
    ],
  },

  "クレアチン": {
    riskLevel: "low",
    contraindications: [
      "kidney-disease", // 腎機能への負担
    ],
  },

  "グルコサミン": {
    riskLevel: "low",
    contraindications: [
      "shellfish-allergy", // 甲殻類由来
      "diabetes", // 血糖値への影響（軽微）
    ],
  },

  // ========== その他 ==========

  "コエンザイムQ10": {
    riskLevel: "low",
    contraindications: [
      "anticoagulant-use", // ワルファリンの効果を減弱
      "surgery", // 血圧への影響
    ],
  },

  "プロバイオティクス": {
    riskLevel: "low",
    contraindications: [
      "immunosuppressant-use", // 免疫抑制者は感染リスク
    ],
  },

  "アスタキサンチン": {
    riskLevel: "low",
    contraindications: [
      "hormone-therapy", // ホルモン作用の可能性（軽微）
    ],
  },

  "ルテイン": {
    riskLevel: "low",
    contraindications: [],
  },

  "コラーゲン": {
    riskLevel: "low",
    contraindications: [
      "shellfish-allergy", // 海洋性コラーゲンの場合
    ],
  },

  // ========== 既に設定済み（上書きしない） ==========

  "ビタミンB6（ピリドキシン）": {
    // 既存: medium, anticonvulsant-use, pregnant, breastfeeding
    riskLevel: "medium",
    contraindications: [
      "anticonvulsant-use",
      "pregnant", // 高用量（100mg/日以上）で注意
      "breastfeeding",
    ],
  },

  "メラトニン": {
    // 既存: medium, 多数の禁忌
    riskLevel: "medium",
    contraindications: [
      "pregnant",
      "breastfeeding",
      "children",
      "autoimmune-disease",
      "mental-disorder",
      "epilepsy",
      "diabetes",
      "hypertension",
      "anticoagulant-use",
      "antidepressant-use",
      "immunosuppressant-use",
    ],
  },

  "DHA・EPA（オメガ3脂肪酸）": {
    // 既存: low, bleeding-risk, surgery
    riskLevel: "low",
    contraindications: [
      "bleeding-risk",
      "surgery",
      "anticoagulant-use",
    ],
  },

  "オメガ3脂肪酸（EPA・DHA）": {
    riskLevel: "low",
    contraindications: [
      "bleeding-risk",
      "surgery",
      "anticoagulant-use",
    ],
  },

  "グルタミン": {
    // 既存: low, liver-disease, kidney-disease, epilepsy
    riskLevel: "low",
    contraindications: [
      "liver-disease",
      "kidney-disease",
      "epilepsy",
    ],
  },

  "ビオチン（ビタミンB7）": {
    riskLevel: "low",
    contraindications: [],
  },

  // ========== 一般的に安全な成分 ==========

  "ビタミンC（アスコルビン酸）": {
    riskLevel: "low",
    contraindications: [
      "kidney-disease", // 腎結石リスク（高用量）
    ],
  },

  "ビタミンB12（コバラミン）": {
    riskLevel: "low",
    contraindications: [],
  },

  "ビタミンB群": {
    riskLevel: "low",
    contraindications: [],
  },

  "葉酸": {
    riskLevel: "low",
    contraindications: [
      "epilepsy", // 抗てんかん薬との相互作用
    ],
  },

  "プロテイン": {
    riskLevel: "low",
    contraindications: [
      "kidney-disease", // タンパク質制限が必要な場合
      "liver-disease", // 肝性脳症のリスク
    ],
  },
};

// 追加の禁忌タグ定義（既存のものに追加）
export const additionalContraindicationLabels = {
  "hypercalcemia": "高カルシウム血症",
  "hemochromatosis": "鉄過剰症",
  "stomach-ulcer": "胃潰瘍",
  "smoking": "喫煙者",
  "asthma": "喘息",
};
