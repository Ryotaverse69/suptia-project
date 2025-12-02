/**
 * 法令コンプライアンスルール定義
 *
 * 対応法令:
 * 1. 薬機法（医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律）
 * 2. 健康増進法（誇大表示の禁止、栄養表示基準）
 * 3. 食品表示法（アレルゲン表示、栄養成分表示、原材料名表示）
 * 4. 食品衛生法（添加物表示、衛生基準）
 *
 * 参考:
 * - 医薬品等適正広告基準
 * - 消費者庁「健康食品に関する景品表示法及び健康増進法上の留意事項」
 * - 食品表示基準（内閣府令）
 * - 食品衛生法施行規則
 */

export interface ComplianceRule {
  pattern: string; // 正規表現パターン
  category: ComplianceCategory; // 違反カテゴリ
  severity: ComplianceSeverity; // 重大度
  suggest: string; // 代替表現の提案
  description?: string; // ルールの説明
  law: ComplianceLaw; // 関連法令
  lawArticle?: string; // 根拠条文
}

/**
 * 対応法令
 */
export type ComplianceLaw =
  | "pharmaceutical_affairs" // 薬機法
  | "health_promotion" // 健康増進法
  | "food_labeling" // 食品表示法
  | "food_sanitation"; // 食品衛生法

/**
 * 違反カテゴリ
 */
export type ComplianceCategory =
  // 薬機法関連
  | "medical_effect" // 医薬品的効能効果
  | "disease_treatment" // 疾病の治療・予防
  | "body_structure" // 身体の組織機能の変化
  // 健康増進法関連
  | "exaggeration" // 誇大広告・虚偽表示
  | "guarantee" // 保証表現
  | "superlative" // 最上級表現
  | "speed_claim" // 速効性・即効性
  | "testimonial_misuse" // 体験談の不適切使用
  // 食品表示法関連
  | "allergen_labeling" // アレルゲン表示
  | "nutrition_labeling" // 栄養成分表示
  | "origin_labeling" // 原産地表示
  | "functional_claim" // 機能性表示
  // 食品衛生法関連
  | "additive_labeling" // 添加物表示
  | "safety_claim" // 安全性の保証
  | "hygiene_claim"; // 衛生基準

export type ComplianceSeverity = "critical" | "high" | "medium" | "low";

/**
 * 法令の日本語名
 */
export const LAW_NAMES: Record<ComplianceLaw, string> = {
  pharmaceutical_affairs: "薬機法",
  health_promotion: "健康増進法",
  food_labeling: "食品表示法",
  food_sanitation: "食品衛生法",
};

/**
 * カテゴリの日本語名
 */
export const CATEGORY_NAMES: Record<ComplianceCategory, string> = {
  medical_effect: "医薬品的効能効果",
  disease_treatment: "疾病の治療・予防",
  body_structure: "身体の組織機能の変化",
  exaggeration: "誇大広告・虚偽表示",
  guarantee: "保証表現",
  superlative: "最上級表現",
  speed_claim: "速効性・即効性",
  testimonial_misuse: "体験談の不適切使用",
  allergen_labeling: "アレルゲン表示",
  nutrition_labeling: "栄養成分表示",
  origin_labeling: "原産地表示",
  functional_claim: "機能性表示",
  additive_labeling: "添加物表示",
  safety_claim: "安全性の保証",
  hygiene_claim: "衛生基準",
};

// ============================================
// 薬機法ルール
// ============================================
const PHARMACEUTICAL_RULES: ComplianceRule[] = [
  // 1. 疾病の治療・予防効果（最重要）
  {
    pattern: "治[るります]+|治す|治療|治癒|完治|治[りれた]+",
    category: "disease_treatment",
    severity: "critical",
    suggest: "健康維持をサポート",
    description: "疾病の治療効果を標榜する表現は薬機法違反です",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条（承認前の医薬品等の広告の禁止）",
  },
  {
    pattern: "予防[するできます]+|防[ぐぎぎます]+|防止|予防効果",
    category: "disease_treatment",
    severity: "critical",
    suggest: "〜のリスクに配慮",
    description: "疾病の予防効果を標榜する表現は薬機法違反です",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "改善[するします]+|改善効果",
    category: "disease_treatment",
    severity: "high",
    suggest: "サポートする可能性",
    description: "断定的な改善効果の標榜は避けるべきです",
    law: "pharmaceutical_affairs",
    lawArticle: "第66条（誇大広告等の禁止）",
  },

  // 2. 具体的な疾病名を使った効能効果
  {
    pattern: "(がん|癌|ガン)[をがに]|[がガ]ん.*効く|抗がん",
    category: "disease_treatment",
    severity: "critical",
    suggest: "健康維持に",
    description: "がんに関する効能効果は絶対に使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "糖尿病[をがに]|糖尿病.*効く|血糖値を下げる",
    category: "disease_treatment",
    severity: "critical",
    suggest: "血糖値の健康維持に",
    description: "糖尿病に関する効能効果は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "高血圧を|血圧を下げる|降圧",
    category: "disease_treatment",
    severity: "critical",
    suggest: "血圧の健康維持に",
    description: "高血圧に関する効能効果は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "アトピーを|アトピー性.*改善|アトピー.*効く",
    category: "disease_treatment",
    severity: "critical",
    suggest: "肌の健康維持に",
    description: "アトピーに関する効能効果は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "花粉症を|花粉症に効く|花粉症.*改善",
    category: "disease_treatment",
    severity: "critical",
    suggest: "季節の健康維持に",
    description: "花粉症に関する効能効果は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "認知症を|アルツハイマー|認知症.*予防",
    category: "disease_treatment",
    severity: "critical",
    suggest: "脳の健康維持に",
    description: "認知症に関する効能効果は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "うつ病|鬱病|抑うつ|うつ.*改善",
    category: "disease_treatment",
    severity: "critical",
    suggest: "気分の健康維持に",
    description: "うつ病に関する効能効果は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "心臓病|心筋梗塞|脳梗塞|脳卒中",
    category: "disease_treatment",
    severity: "critical",
    suggest: "循環器の健康維持に",
    description: "心血管疾患に関する効能効果は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "肝臓病|肝硬変|脂肪肝.*改善",
    category: "disease_treatment",
    severity: "critical",
    suggest: "肝臓の健康維持に",
    description: "肝臓疾患に関する効能効果は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "腎臓病|腎不全|透析.*不要",
    category: "disease_treatment",
    severity: "critical",
    suggest: "腎臓の健康維持に",
    description: "腎臓疾患に関する効能効果は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "骨粗[しそ]ょう症|骨密度.*上がる",
    category: "disease_treatment",
    severity: "critical",
    suggest: "骨の健康維持に",
    description: "骨粗しょう症に関する効能効果は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "関節炎|リウマチ|関節痛.*治",
    category: "disease_treatment",
    severity: "critical",
    suggest: "関節の健康維持に",
    description: "関節疾患に関する効能効果は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "不眠症|睡眠障害.*治|眠れるようになる",
    category: "disease_treatment",
    severity: "critical",
    suggest: "睡眠の質をサポート",
    description: "睡眠障害に関する効能効果は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "便秘.*治|下痢.*治|胃腸病",
    category: "disease_treatment",
    severity: "critical",
    suggest: "お腹の調子をサポート",
    description: "消化器疾患に関する効能効果は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "貧血.*治|貧血.*改善",
    category: "disease_treatment",
    severity: "critical",
    suggest: "鉄分補給に",
    description: "貧血に関する効能効果は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "更年期障害.*改善|更年期.*治",
    category: "disease_treatment",
    severity: "critical",
    suggest: "女性の健康維持に",
    description: "更年期障害に関する効能効果は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "ED.*改善|勃起不全|性機能.*回復",
    category: "disease_treatment",
    severity: "critical",
    suggest: "男性の健康維持に",
    description: "性機能障害に関する効能効果は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },

  // 3. 医薬品的効能効果
  {
    pattern: "効く|効果がある|効能",
    category: "medical_effect",
    severity: "high",
    suggest: "役立つ可能性がある",
    description: "断定的な効果表現は避けるべきです",
    law: "pharmaceutical_affairs",
    lawArticle: "第66条",
  },
  {
    pattern: "効きます|効果があります",
    category: "medical_effect",
    severity: "high",
    suggest: "サポートします",
    description: "断定的な効果表現は避けるべきです",
    law: "pharmaceutical_affairs",
    lawArticle: "第66条",
  },
  {
    pattern: "症状|病気|疾患",
    category: "medical_effect",
    severity: "medium",
    suggest: "健康状態",
    description: "医学的用語の使用は文脈に注意が必要です",
    law: "pharmaceutical_affairs",
    lawArticle: "第66条",
  },
  {
    pattern: "診断|処方|投与|服用",
    category: "medical_effect",
    severity: "high",
    suggest: "摂取",
    description: "医療行為を連想させる用語は避けるべきです",
    law: "pharmaceutical_affairs",
    lawArticle: "第66条",
  },

  // 4. 身体の組織機能の変化
  {
    pattern: "血圧が下がる|血圧低下",
    category: "body_structure",
    severity: "critical",
    suggest: "血圧の健康維持に",
    description: "身体機能の変化を標榜する表現は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "血糖値が下がる|血糖値低下",
    category: "body_structure",
    severity: "critical",
    suggest: "血糖値の健康維持に",
    description: "身体機能の変化を標榜する表現は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "コレステロールが下がる|コレステロール低下",
    category: "body_structure",
    severity: "critical",
    suggest: "コレステロールの健康維持に",
    description: "身体機能の変化を標榜する表現は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "脂肪が燃える|脂肪燃焼|脂肪を分解",
    category: "body_structure",
    severity: "high",
    suggest: "エネルギー代謝をサポート",
    description: "身体機能の変化を標榜する表現は避けるべきです",
    law: "pharmaceutical_affairs",
    lawArticle: "第66条",
  },
  {
    pattern: "代謝が上がる|代謝アップ|基礎代謝.*向上",
    category: "body_structure",
    severity: "high",
    suggest: "代謝をサポート",
    description: "身体機能の変化を標榜する表現は避けるべきです",
    law: "pharmaceutical_affairs",
    lawArticle: "第66条",
  },
  {
    pattern: "免疫力.*上がる|免疫.*強化|免疫.*向上",
    category: "body_structure",
    severity: "high",
    suggest: "健康維持に",
    description: "免疫機能の変化を標榜する表現は避けるべきです",
    law: "pharmaceutical_affairs",
    lawArticle: "第66条",
  },
  {
    pattern: "ホルモン.*調整|ホルモン.*正常化",
    category: "body_structure",
    severity: "critical",
    suggest: "体のリズムをサポート",
    description: "ホルモン機能への影響は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "神経.*修復|神経.*再生",
    category: "body_structure",
    severity: "critical",
    suggest: "神経の健康維持に",
    description: "神経組織への影響は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "細胞.*活性化|細胞.*若返|細胞.*再生",
    category: "body_structure",
    severity: "high",
    suggest: "健康維持に",
    description: "細胞への影響を標榜する表現は避けるべきです",
    law: "pharmaceutical_affairs",
    lawArticle: "第66条",
  },

  // 5. 美容関連
  {
    pattern:
      "(シミ|シワ|くすみ)が消え[るます]+|(シミ|シワ|くすみ).*なくな[るります]+",
    category: "medical_effect",
    severity: "critical",
    suggest: "肌の健康維持をサポート",
    description: "美容効果を断定する表現は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第66条",
  },
  {
    pattern: "美白効果|ホワイトニング効果",
    category: "medical_effect",
    severity: "critical",
    suggest: "透明感のある肌に",
    description: "美白効果は医薬部外品の効能です",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "若返[るります]+|アンチエイジング効果|老化防止",
    category: "medical_effect",
    severity: "high",
    suggest: "年齢に応じた健康維持に",
    description: "若返り効果を標榜する表現は避けるべきです",
    law: "pharmaceutical_affairs",
    lawArticle: "第66条",
  },
  {
    pattern: "肌が白くなる|美肌効果|肌質.*改善",
    category: "medical_effect",
    severity: "high",
    suggest: "肌の健康維持に",
    description: "美容効果を断定する表現は避けるべきです",
    law: "pharmaceutical_affairs",
    lawArticle: "第66条",
  },
  {
    pattern: "ニキビ.*治|吹き出物.*治|肌荒れ.*治",
    category: "disease_treatment",
    severity: "critical",
    suggest: "肌の健康維持に",
    description: "皮膚疾患の治療効果は使用不可",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
  {
    pattern: "発毛|育毛効果|薄毛.*改善|抜け毛.*防",
    category: "medical_effect",
    severity: "critical",
    suggest: "頭皮の健康維持に",
    description: "発毛・育毛効果は医薬部外品の効能です",
    law: "pharmaceutical_affairs",
    lawArticle: "第68条",
  },
];

// ============================================
// 健康増進法ルール
// ============================================
const HEALTH_PROMOTION_RULES: ComplianceRule[] = [
  // 1. 誇大広告・虚偽表示（第65条）
  {
    pattern: "必ず|絶対|確実に|間違いなく",
    category: "guarantee",
    severity: "critical",
    suggest: "〜の可能性がある",
    description: "保証表現は健康増進法第65条違反です",
    law: "health_promotion",
    lawArticle: "第65条（誇大表示の禁止）",
  },
  {
    pattern: "100%|完全|万全|パーフェクト",
    category: "guarantee",
    severity: "critical",
    suggest: "サポート",
    description: "保証表現は健康増進法違反です",
    law: "health_promotion",
    lawArticle: "第65条",
  },
  {
    pattern: "誰でも|どんな方でも|全員|すべての人",
    category: "guarantee",
    severity: "high",
    suggest: "多くの方に",
    description: "全員に効果があるような表現は避けるべきです",
    law: "health_promotion",
    lawArticle: "第65条",
  },
  {
    pattern: "科学的に証明|医学的に実証|臨床試験で証明",
    category: "exaggeration",
    severity: "high",
    suggest: "研究では〜が報告されています",
    description: "根拠不十分な科学的主張は避けるべきです",
    law: "health_promotion",
    lawArticle: "第65条",
  },
  {
    pattern: "特許取得.*効果|独自製法.*効く",
    category: "exaggeration",
    severity: "medium",
    suggest: "独自の製法で作られています",
    description: "特許と効果を関連付ける表現は避けるべきです",
    law: "health_promotion",
    lawArticle: "第65条",
  },

  // 2. 速効性・即効性
  {
    pattern: "即効|速攻|すぐに効く|即座に|瞬時に",
    category: "speed_claim",
    severity: "high",
    suggest: "継続的な摂取により",
    description: "速効性を標榜する表現は健康増進法違反の可能性",
    law: "health_promotion",
    lawArticle: "第65条",
  },
  {
    pattern: "たった〜で|わずか〜で|〜日で効果|〜週間で実感",
    category: "speed_claim",
    severity: "high",
    suggest: "継続的な利用により",
    description: "短期間での効果を標榜する表現は避けるべきです",
    law: "health_promotion",
    lawArticle: "第65条",
  },
  {
    pattern: "飲んですぐ|使ってすぐ|一回で|初回から",
    category: "speed_claim",
    severity: "high",
    suggest: "継続的な摂取により",
    description: "即効性を標榜する表現は避けるべきです",
    law: "health_promotion",
    lawArticle: "第65条",
  },
  {
    pattern: "翌朝には|翌日から|その日のうちに",
    category: "speed_claim",
    severity: "high",
    suggest: "継続的な摂取をおすすめします",
    description: "短期間での効果を標榜する表現は避けるべきです",
    law: "health_promotion",
    lawArticle: "第65条",
  },

  // 3. 最上級表現・比較優位性
  {
    pattern: "最高|最強|最も|No\\.?1|ナンバーワン|第1位",
    category: "superlative",
    severity: "medium",
    suggest: "高品質",
    description: "最上級表現は根拠がない場合は避けるべきです",
    law: "health_promotion",
    lawArticle: "第65条",
  },
  {
    pattern: "世界一|日本一|業界一|他社を圧倒|唯一の",
    category: "superlative",
    severity: "high",
    suggest: "高品質",
    description: "比較優位性の標榜は客観的根拠が必要です",
    law: "health_promotion",
    lawArticle: "第65条",
  },
  {
    pattern: "他にはない|ここだけ|当社だけ|独占",
    category: "superlative",
    severity: "medium",
    suggest: "こだわりの",
    description: "独自性の主張は事実に基づく必要があります",
    law: "health_promotion",
    lawArticle: "第65条",
  },
  {
    pattern: "売上No\\.?1|人気No\\.?1|満足度No\\.?1",
    category: "superlative",
    severity: "medium",
    suggest: "多くの方にご愛用いただいています",
    description: "ランキング表示は調査方法の明示が必要です",
    law: "health_promotion",
    lawArticle: "第65条",
  },

  // 4. ダイエット関連（特に注意）
  {
    pattern: "必ず痩せる|確実に痩せる|絶対痩せる",
    category: "guarantee",
    severity: "critical",
    suggest: "体重管理をサポートする可能性",
    description: "ダイエット効果を保証する表現は健康増進法違反",
    law: "health_promotion",
    lawArticle: "第65条",
  },
  {
    pattern: "楽して痩せる|簡単に痩せる|飲むだけで痩せる|食べても痩せる",
    category: "exaggeration",
    severity: "critical",
    suggest: "適切な食事と運動と併せて体重管理をサポート",
    description: "誇大なダイエット表現は健康増進法違反",
    law: "health_promotion",
    lawArticle: "第65条",
  },
  {
    pattern: "〜kg減|〜キロ減|体重が〜減る|ウエスト〜cm",
    category: "guarantee",
    severity: "high",
    suggest: "体重管理をサポート",
    description: "具体的な減量値を標榜する表現は避けるべきです",
    law: "health_promotion",
    lawArticle: "第65条",
  },
  {
    pattern: "食事制限不要|運動不要|努力不要",
    category: "exaggeration",
    severity: "high",
    suggest: "バランスの取れた生活と併せて",
    description: "努力不要の表現は誇大広告に該当する可能性",
    law: "health_promotion",
    lawArticle: "第65条",
  },
  {
    pattern: "リバウンドしない|リバウンド防止",
    category: "guarantee",
    severity: "high",
    suggest: "継続的な健康管理をサポート",
    description: "リバウンド防止の保証は避けるべきです",
    law: "health_promotion",
    lawArticle: "第65条",
  },

  // 5. 体験談の不適切使用
  {
    pattern: "個人の感想です.*効果.*保証|※個人の感想.*結果.*個人差",
    category: "testimonial_misuse",
    severity: "medium",
    suggest: "（個人の感想であり、効果を保証するものではありません）",
    description: "体験談使用時は適切な打ち消し表示が必要です",
    law: "health_promotion",
    lawArticle: "第65条",
  },
  {
    pattern: "医師.*推奨|専門家.*お墨付き|医学博士.*開発",
    category: "testimonial_misuse",
    severity: "high",
    suggest: "専門家の監修のもと開発",
    description: "権威者の推薦表現は誤認を招く可能性があります",
    law: "health_promotion",
    lawArticle: "第65条",
  },
  {
    pattern: "芸能人.*愛用|有名人.*使用|モデル.*御用達",
    category: "testimonial_misuse",
    severity: "medium",
    suggest: "多くの方にご愛用いただいています",
    description: "有名人の使用を暗示する表現は注意が必要です",
    law: "health_promotion",
    lawArticle: "第65条",
  },

  // 6. 安全性の保証
  {
    pattern: "副作用なし|副作用ゼロ|安全100%|完全無害",
    category: "safety_claim",
    severity: "critical",
    suggest: "一般的に安全性が高いと考えられています",
    description: "安全性を保証する表現は健康増進法違反",
    law: "health_promotion",
    lawArticle: "第65条",
  },
  {
    pattern: "無害|害がない|危険性なし|リスクゼロ",
    category: "safety_claim",
    severity: "critical",
    suggest: "適切な摂取量を守れば",
    description: "安全性を保証する表現は使用不可",
    law: "health_promotion",
    lawArticle: "第65条",
  },
  {
    pattern: "絶対安全|完全に安全|誰でも安心",
    category: "safety_claim",
    severity: "critical",
    suggest: "一般的に安全性が高いと考えられています",
    description: "安全性を保証する表現は使用不可",
    law: "health_promotion",
    lawArticle: "第65条",
  },
  {
    pattern: "天然だから安全|自然由来.*安心|オーガニック.*無害",
    category: "safety_claim",
    severity: "high",
    suggest: "天然由来の成分を使用しています",
    description: "天然=安全という誤解を招く表現は避けるべきです",
    law: "health_promotion",
    lawArticle: "第65条",
  },
];

// ============================================
// 食品表示法ルール
// ============================================
const FOOD_LABELING_RULES: ComplianceRule[] = [
  // 1. アレルゲン表示（特定原材料7品目 + 推奨21品目）
  {
    pattern: "アレルギー.*なし|アレルゲンフリー|アレルギー.*安心",
    category: "allergen_labeling",
    severity: "critical",
    suggest: "アレルギー物質については原材料をご確認ください",
    description:
      "アレルゲンの不存在を保証する表現は危険です。特定原材料の表示義務があります",
    law: "food_labeling",
    lawArticle: "食品表示基準 第3条（アレルゲン表示）",
  },
  {
    pattern: "(卵|乳|小麦|そば|落花生|えび|かに).*不使用.*安全",
    category: "allergen_labeling",
    severity: "high",
    suggest:
      "〇〇を使用していません（製造ラインでは〇〇を含む製品を製造しています）",
    description: "コンタミネーション（混入）の可能性を考慮した表示が必要です",
    law: "food_labeling",
    lawArticle: "食品表示基準 第3条",
  },
  {
    pattern: "アレルギー対応|低アレルゲン",
    category: "allergen_labeling",
    severity: "medium",
    suggest: "特定原材料（卵・乳・小麦等）を使用していません",
    description: "アレルゲン関連の表示は具体的な情報が必要です",
    law: "food_labeling",
    lawArticle: "食品表示基準 第3条",
  },

  // 2. 栄養成分表示
  {
    pattern: "カロリーオフ|カロリーゼロ|ノンカロリー",
    category: "nutrition_labeling",
    severity: "medium",
    suggest: "低カロリー（100gあたり〇kcal）",
    description:
      "カロリー表示は食品表示基準に基づく数値基準があります（100gあたり5kcal以下がゼロ）",
    law: "food_labeling",
    lawArticle: "食品表示基準 第7条（栄養成分表示）",
  },
  {
    pattern: "糖質ゼロ|糖質オフ|無糖|シュガーフリー",
    category: "nutrition_labeling",
    severity: "medium",
    suggest: "低糖質（100gあたり〇g）",
    description:
      "糖質表示は食品表示基準に基づく数値基準があります（100gあたり0.5g以下がゼロ）",
    law: "food_labeling",
    lawArticle: "食品表示基準 第7条",
  },
  {
    pattern: "塩分ゼロ|減塩|塩分控えめ|ナトリウムフリー",
    category: "nutrition_labeling",
    severity: "medium",
    suggest: "食塩相当量（100gあたり〇g）",
    description: "塩分表示は食品表示基準に基づく表示が必要です",
    law: "food_labeling",
    lawArticle: "食品表示基準 第7条",
  },
  {
    pattern: "高タンパク|タンパク質豊富|プロテイン強化",
    category: "nutrition_labeling",
    severity: "low",
    suggest: "タンパク質〇g配合",
    description: "栄養強調表示は基準値を満たす必要があります",
    law: "food_labeling",
    lawArticle: "食品表示基準 第7条",
  },
  {
    pattern: "ビタミン.*豊富|ミネラル.*たっぷり|栄養.*満点",
    category: "nutrition_labeling",
    severity: "medium",
    suggest: "1日分の〇〇を配合",
    description: "栄養成分の強調表示は具体的な数値が必要です",
    law: "food_labeling",
    lawArticle: "食品表示基準 第7条",
  },

  // 3. 機能性表示
  {
    pattern: "機能性.*証明|機能性.*実証",
    category: "functional_claim",
    severity: "high",
    suggest: "届出表示：〇〇",
    description: "機能性表示食品は届出番号と届出表示の記載が必要です",
    law: "food_labeling",
    lawArticle: "食品表示基準 第9条（機能性表示食品）",
  },
  {
    pattern: "トクホ|特定保健用食品|特保",
    category: "functional_claim",
    severity: "high",
    suggest: "（許可番号の記載が必要）",
    description: "特定保健用食品は消費者庁の許可番号の記載が必要です",
    law: "food_labeling",
    lawArticle: "食品表示基準 第10条（特定保健用食品）",
  },
  {
    pattern: "栄養機能食品.*効果|栄養機能.*改善",
    category: "functional_claim",
    severity: "high",
    suggest: "栄養機能食品（〇〇）：〇〇は、〜の栄養素です",
    description: "栄養機能食品は規格基準に基づく表示が必要です",
    law: "food_labeling",
    lawArticle: "食品表示基準 第8条（栄養機能食品）",
  },

  // 4. 原産地表示
  {
    pattern: "国産.*だから安心|日本製.*安全|外国産.*危険",
    category: "origin_labeling",
    severity: "high",
    suggest: "原産国：日本",
    description: "原産地と安全性を関連付ける表現は避けるべきです",
    law: "food_labeling",
    lawArticle: "食品表示基準 第3条（原産地表示）",
  },
  {
    pattern: "〇〇産.*100%|純〇〇産",
    category: "origin_labeling",
    severity: "medium",
    suggest: "主要原材料の原産地：〇〇",
    description: "原産地表示は正確な情報に基づく必要があります",
    law: "food_labeling",
    lawArticle: "食品表示基準 第3条",
  },
];

// ============================================
// 食品衛生法ルール
// ============================================
const FOOD_SANITATION_RULES: ComplianceRule[] = [
  // 1. 添加物表示
  {
    pattern: "無添加.*だから安全|添加物.*ゼロ.*安心|完全無添加",
    category: "additive_labeling",
    severity: "high",
    suggest: "〇〇不使用",
    description:
      "「無添加」表示のガイドラインが2022年に改正されました。具体的な添加物名の記載が推奨されます",
    law: "food_sanitation",
    lawArticle: "食品衛生法第19条、食品添加物表示ガイドライン",
  },
  {
    pattern: "保存料.*不使用.*長持ち|防腐剤.*なし.*日持ち",
    category: "additive_labeling",
    severity: "high",
    suggest: "保存料（〇〇）不使用",
    description: "保存料不使用と品質保持を関連付ける表現は誤解を招く可能性",
    law: "food_sanitation",
    lawArticle: "食品衛生法第19条",
  },
  {
    pattern: "着色料.*無添加|合成着色料.*不使用",
    category: "additive_labeling",
    severity: "low",
    suggest: "合成着色料不使用（天然色素使用）",
    description: "着色料の種類を明確にする表示が推奨されます",
    law: "food_sanitation",
    lawArticle: "食品衛生法第19条",
  },
  {
    pattern: "人工甘味料.*不使用|合成甘味料.*ゼロ",
    category: "additive_labeling",
    severity: "low",
    suggest: "人工甘味料不使用",
    description: "甘味料の種類を明確にする表示が推奨されます",
    law: "food_sanitation",
    lawArticle: "食品衛生法第19条",
  },
  {
    pattern: "化学調味料.*不使用|MSG.*フリー",
    category: "additive_labeling",
    severity: "low",
    suggest: "調味料（アミノ酸等）不使用",
    description: "正式な添加物名での表示が推奨されます",
    law: "food_sanitation",
    lawArticle: "食品衛生法第19条",
  },

  // 2. 衛生基準
  {
    pattern: "雑菌.*ゼロ|無菌|菌.*完全除去",
    category: "hygiene_claim",
    severity: "high",
    suggest: "衛生管理された環境で製造",
    description: "無菌を保証する表現は避けるべきです",
    law: "food_sanitation",
    lawArticle: "食品衛生法第11条",
  },
  {
    pattern: "腐らない|永久に保存|賞味期限.*なし",
    category: "hygiene_claim",
    severity: "critical",
    suggest: "賞味期限：〇〇",
    description: "品質保持期限の表示は義務です",
    law: "food_sanitation",
    lawArticle: "食品衛生法第19条",
  },
  {
    pattern: "衛生的.*だから安全|清潔.*安心",
    category: "hygiene_claim",
    severity: "medium",
    suggest: "HACCP対応の工場で製造",
    description: "衛生と安全性を直接関連付ける表現は注意が必要です",
    law: "food_sanitation",
    lawArticle: "食品衛生法第50条の2（HACCP）",
  },
  {
    pattern: "GMP認証|ISO認証.*安全",
    category: "hygiene_claim",
    severity: "medium",
    suggest: "GMP認証工場で製造",
    description: "認証と安全性を直接関連付ける表現は注意が必要です",
    law: "food_sanitation",
    lawArticle: "食品衛生法第50条の2",
  },

  // 3. 容器・包装
  {
    pattern: "環境ホルモン.*不検出|ビスフェノール.*フリー",
    category: "hygiene_claim",
    severity: "medium",
    suggest: "食品衛生法に適合した容器を使用",
    description: "容器の安全性は食品衛生法の基準に準拠する必要があります",
    law: "food_sanitation",
    lawArticle: "食品衛生法第18条（器具及び容器包装）",
  },
];

// ============================================
// 全ルールを統合
// ============================================
export const COMPLIANCE_RULES: ComplianceRule[] = [
  ...PHARMACEUTICAL_RULES,
  ...HEALTH_PROMOTION_RULES,
  ...FOOD_LABELING_RULES,
  ...FOOD_SANITATION_RULES,
];

/**
 * 法令別ルールを取得
 */
export function getRulesByLaw(law: ComplianceLaw): ComplianceRule[] {
  return COMPLIANCE_RULES.filter((rule) => rule.law === law);
}

/**
 * カテゴリ別ルールを取得
 */
export function getRulesByCategory(
  category: ComplianceCategory,
): ComplianceRule[] {
  return COMPLIANCE_RULES.filter((rule) => rule.category === category);
}

/**
 * 薬機法OK表現の例
 */
export const APPROVED_EXPRESSIONS = {
  general: [
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
  ],
  disclaimer: [
    "※個人の感想であり、効果を保証するものではありません",
    "※効果には個人差があります",
    "※本品は、特定保健用食品とは異なり、消費者庁長官による個別審査を受けたものではありません",
    "※食生活は、主食、主菜、副菜を基本に、食事のバランスを",
    "※本品は、疾病の診断、治療、予防を目的としたものではありません",
    "※体調に異変を感じた際は、速やかに摂取を中止し、医師に相談してください",
  ],
  allergen: [
    "アレルギー物質（特定原材料等）：〇〇",
    "本製品は〇〇を含む製品と共通の設備で製造しています",
    "原材料をご確認の上、食物アレルギーのある方はお召し上がりにならないでください",
  ],
};

/**
 * カテゴリ別の重大度スコア
 */
export const CATEGORY_SEVERITY_SCORE: Record<ComplianceCategory, number> = {
  // 薬機法関連（最重要）
  disease_treatment: 100,
  medical_effect: 80,
  body_structure: 80,
  // 健康増進法関連
  exaggeration: 70,
  guarantee: 70,
  testimonial_misuse: 60,
  speed_claim: 50,
  superlative: 40,
  // 食品表示法関連
  allergen_labeling: 90, // アレルゲンは健康被害に直結
  nutrition_labeling: 50,
  origin_labeling: 40,
  functional_claim: 70,
  // 食品衛生法関連
  additive_labeling: 50,
  safety_claim: 90,
  hygiene_claim: 60,
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

/**
 * 法令別の重要度
 */
export const LAW_IMPORTANCE: Record<ComplianceLaw, number> = {
  pharmaceutical_affairs: 100, // 最重要（刑事罰あり）
  health_promotion: 80, // 重要（措置命令、課徴金）
  food_labeling: 70, // 重要（措置命令）
  food_sanitation: 90, // 非常に重要（営業禁止）
};
