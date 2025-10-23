/**
 * 薬機法コンプライアンスルール定義
 *
 * 参考:
 * - 医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律（薬機法）
 * - 医薬品等適正広告基準
 * - 健康増進法
 */

export interface ComplianceRule {
  pattern: string; // 正規表現パターン
  category: ComplianceCategory; // 違反カテゴリ
  severity: ComplianceSeverity; // 重大度
  suggest: string; // 代替表現の提案
  description?: string; // ルールの説明
}

export type ComplianceCategory =
  | "medical_effect" // 医薬品的効能効果
  | "disease_treatment" // 疾病の治療・予防
  | "exaggeration" // 誇大広告
  | "guarantee" // 保証表現
  | "superlative" // 最上級表現
  | "safety_claim" // 安全性の保証
  | "body_structure" // 身体の組織機能の変化
  | "speed_claim"; // 速効性・即効性

export type ComplianceSeverity = "critical" | "high" | "medium" | "low";

/**
 * 薬機法NG表現ルール
 */
export const COMPLIANCE_RULES: ComplianceRule[] = [
  // ========================================
  // 1. 疾病の治療・予防効果（最重要）
  // ========================================
  {
    pattern: "治る|治す|治療|治癒|完治",
    category: "disease_treatment",
    severity: "critical",
    suggest: "健康維持をサポート",
    description: "疾病の治療効果を標榜する表現は薬機法違反です",
  },
  {
    pattern: "予防する|防ぐ|防止|予防効果",
    category: "disease_treatment",
    severity: "critical",
    suggest: "〜のリスクに配慮",
    description: "疾病の予防効果を標榜する表現は薬機法違反です",
  },
  {
    pattern: "改善する|改善効果",
    category: "disease_treatment",
    severity: "high",
    suggest: "サポートする可能性",
    description: "断定的な改善効果の標榜は避けるべきです",
  },

  // ========================================
  // 2. 具体的な疾病名を使った効能効果
  // ========================================
  {
    pattern: "がんに効く|癌を|ガンに",
    category: "disease_treatment",
    severity: "critical",
    suggest: "健康維持に",
    description: "がんに関する効能効果は絶対に使用不可",
  },
  {
    pattern: "糖尿病を|糖尿病に効く",
    category: "disease_treatment",
    severity: "critical",
    suggest: "血糖値の健康維持に",
    description: "糖尿病に関する効能効果は使用不可",
  },
  {
    pattern: "高血圧を|血圧を下げる",
    category: "disease_treatment",
    severity: "critical",
    suggest: "血圧の健康維持に",
    description: "高血圧に関する効能効果は使用不可",
  },
  {
    pattern: "アトピーを|アトピー性",
    category: "disease_treatment",
    severity: "critical",
    suggest: "肌の健康維持に",
    description: "アトピーに関する効能効果は使用不可",
  },
  {
    pattern: "花粉症を|花粉症に効く",
    category: "disease_treatment",
    severity: "critical",
    suggest: "季節の健康維持に",
    description: "花粉症に関する効能効果は使用不可",
  },
  {
    pattern: "認知症を|アルツハイマー",
    category: "disease_treatment",
    severity: "critical",
    suggest: "脳の健康維持に",
    description: "認知症に関する効能効果は使用不可",
  },
  {
    pattern: "うつ病|鬱病|抑うつ",
    category: "disease_treatment",
    severity: "critical",
    suggest: "気分の健康維持に",
    description: "うつ病に関する効能効果は使用不可",
  },

  // ========================================
  // 3. 医薬品的効能効果
  // ========================================
  {
    pattern: "効く|効果がある|効能",
    category: "medical_effect",
    severity: "high",
    suggest: "役立つ可能性がある",
    description: "断定的な効果表現は避けるべきです",
  },
  {
    pattern: "効きます|効果があります",
    category: "medical_effect",
    severity: "high",
    suggest: "サポートします",
    description: "断定的な効果表現は避けるべきです",
  },
  {
    pattern: "症状|病気|疾患",
    category: "medical_effect",
    severity: "medium",
    suggest: "健康状態",
    description: "医学的用語の使用は避けるべきです",
  },

  // ========================================
  // 4. 身体の組織機能の変化
  // ========================================
  {
    pattern: "血圧が下がる|血圧低下",
    category: "body_structure",
    severity: "critical",
    suggest: "血圧の健康維持に",
    description: "身体機能の変化を標榜する表現は使用不可",
  },
  {
    pattern: "血糖値が下がる|血糖値低下",
    category: "body_structure",
    severity: "critical",
    suggest: "血糖値の健康維持に",
    description: "身体機能の変化を標榜する表現は使用不可",
  },
  {
    pattern: "コレステロールが下がる|コレステロール低下",
    category: "body_structure",
    severity: "critical",
    suggest: "コレステロールの健康維持に",
    description: "身体機能の変化を標榜する表現は使用不可",
  },
  {
    pattern: "脂肪が燃える|脂肪燃焼",
    category: "body_structure",
    severity: "high",
    suggest: "エネルギー代謝をサポート",
    description: "身体機能の変化を標榜する表現は避けるべきです",
  },
  {
    pattern: "代謝が上がる|代謝アップ",
    category: "body_structure",
    severity: "high",
    suggest: "代謝をサポート",
    description: "身体機能の変化を標榜する表現は避けるべきです",
  },

  // ========================================
  // 5. 誇大広告・保証表現
  // ========================================
  {
    pattern: "必ず|絶対|確実に",
    category: "guarantee",
    severity: "critical",
    suggest: "可能性がある",
    description: "保証表現は薬機法違反です",
  },
  {
    pattern: "100%|完全|万全",
    category: "guarantee",
    severity: "critical",
    suggest: "サポート",
    description: "保証表現は薬機法違反です",
  },
  {
    pattern: "誰でも|どんな方でも|全員",
    category: "guarantee",
    severity: "high",
    suggest: "多くの方に",
    description: "全員に効果があるような表現は避けるべきです",
  },

  // ========================================
  // 6. 速効性・即効性
  // ========================================
  {
    pattern: "即効|速攻|すぐに効く|即座に",
    category: "speed_claim",
    severity: "high",
    suggest: "継続的な摂取により",
    description: "速効性を標榜する表現は避けるべきです",
  },
  {
    pattern: "たった〜で|わずか〜で|〜日で効果",
    category: "speed_claim",
    severity: "high",
    suggest: "継続的な利用により",
    description: "短期間での効果を標榜する表現は避けるべきです",
  },
  {
    pattern: "飲んですぐ|使ってすぐ|一回で",
    category: "speed_claim",
    severity: "high",
    suggest: "継続的な摂取により",
    description: "即効性を標榜する表現は避けるべきです",
  },

  // ========================================
  // 7. 最上級表現・比較優位性
  // ========================================
  {
    pattern: "最高|最強|最も|No\\.?1|ナンバーワン",
    category: "superlative",
    severity: "medium",
    suggest: "高品質",
    description: "最上級表現は根拠がない場合は避けるべきです",
  },
  {
    pattern: "世界一|日本一|業界一|他社を圧倒",
    category: "superlative",
    severity: "high",
    suggest: "高品質",
    description: "比較優位性の標榜は根拠が必要です",
  },

  // ========================================
  // 8. 安全性の保証
  // ========================================
  {
    pattern: "副作用なし|副作用ゼロ|安全100%",
    category: "safety_claim",
    severity: "critical",
    suggest: "一般的に安全性が高いと考えられています",
    description: "安全性を保証する表現は使用不可",
  },
  {
    pattern: "無害|害がない|危険性なし",
    category: "safety_claim",
    severity: "critical",
    suggest: "適切な摂取量を守れば",
    description: "安全性を保証する表現は使用不可",
  },
  {
    pattern: "絶対安全|完全に安全",
    category: "safety_claim",
    severity: "critical",
    suggest: "一般的に安全性が高いと考えられています",
    description: "安全性を保証する表現は使用不可",
  },

  // ========================================
  // 9. ダイエット関連（特に注意）
  // ========================================
  {
    pattern: "必ず痩せる|確実に痩せる|絶対痩せる",
    category: "guarantee",
    severity: "critical",
    suggest: "体重管理をサポートする可能性",
    description: "ダイエット効果を保証する表現は使用不可",
  },
  {
    pattern: "楽して痩せる|簡単に痩せる|飲むだけで痩せる",
    category: "exaggeration",
    severity: "high",
    suggest: "適切な食事と運動と併せて体重管理をサポート",
    description: "誇大なダイエット表現は避けるべきです",
  },
  {
    pattern: "〜kg減|〜キロ減|体重が〜減る",
    category: "guarantee",
    severity: "high",
    suggest: "体重管理をサポート",
    description: "具体的な減量値を標榜する表現は避けるべきです",
  },

  // ========================================
  // 10. 美容関連（特に注意）
  // ========================================
  {
    pattern: "シミが消える|シワが消える|美白効果",
    category: "medical_effect",
    severity: "critical",
    suggest: "肌の健康維持をサポート",
    description: "美容効果を断定する表現は使用不可",
  },
  {
    pattern: "若返る|アンチエイジング効果|老化防止",
    category: "medical_effect",
    severity: "high",
    suggest: "年齢に応じた健康維持に",
    description: "若返り効果を標榜する表現は避けるべきです",
  },
  {
    pattern: "肌が白くなる|美肌効果",
    category: "medical_effect",
    severity: "high",
    suggest: "肌の健康維持に",
    description: "美容効果を断定する表現は避けるべきです",
  },
];

/**
 * 薬機法OK表現の例
 */
export const APPROVED_EXPRESSIONS = [
  "健康維持をサポート",
  "栄養補給に",
  "〜をサポートする可能性",
  "一般的に〜と言われています",
  "研究では〜が報告されています",
  "〜に役立つ可能性があります",
  "〜の健康維持に",
  "適切な食事と運動と併せて",
  "継続的な摂取により",
  "バランスの取れた食生活の一部として",
];

/**
 * カテゴリ別の重大度スコア
 */
export const CATEGORY_SEVERITY_SCORE: Record<ComplianceCategory, number> = {
  disease_treatment: 100, // 最重要
  medical_effect: 80,
  body_structure: 80,
  safety_claim: 90,
  guarantee: 70,
  exaggeration: 60,
  speed_claim: 50,
  superlative: 40,
};

/**
 * 重大度別のスコア
 */
export const SEVERITY_SCORE: Record<ComplianceSeverity, number> = {
  critical: 100,
  high: 75,
  medium: 50,
  low: 25,
};
