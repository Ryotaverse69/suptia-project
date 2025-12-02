/**
 * Sanity用4法対応コンプライアンスチェッカー
 *
 * ブラウザ環境（Sanity Studio）で動作する軽量版
 *
 * 対応法令:
 * 1. 薬機法（医薬品医療機器等法）
 * 2. 健康増進法
 * 3. 食品表示法
 * 4. 食品衛生法
 * 5. 景品表示法（追加）
 * 6. 特定商取引法（追加）
 */

export interface ComplianceValidationResult {
  isValid: boolean;
  message?: string;
  violations?: Array<{
    text: string;
    category: string;
    law: string;
    severity: "critical" | "high" | "medium" | "low";
  }>;
  score?: number;
}

type Severity = "critical" | "high" | "medium" | "low";

interface CompliancePattern {
  pattern: RegExp;
  category: string;
  law: string;
  severity: Severity;
  message: string;
}

/**
 * 4法 + 景品表示法 + 特定商取引法 対応パターン
 */
const COMPLIANCE_PATTERNS: CompliancePattern[] = [
  // ========================================
  // 薬機法（最重要）
  // ========================================
  {
    pattern: /治[るりますまれすいた]|治療|治癒|完治/g,
    category: "疾病治療",
    law: "薬機法",
    severity: "critical",
    message: "疾病の治療効果を標榜する表現は薬機法違反です（第68条）",
  },
  {
    pattern: /糖尿病[にをがで]|高血圧[にをがで]|がん[にをがで]|癌[にをがで]/g,
    category: "疾病名",
    law: "薬機法",
    severity: "critical",
    message: "具体的な疾病名を使った効能表現は薬機法違反です",
  },
  {
    pattern: /心臓病|心筋梗塞|脳梗塞|脳卒中|肝臓病|腎臓病/g,
    category: "疾病名",
    law: "薬機法",
    severity: "critical",
    message: "重大な疾病名を使った効能表現は薬機法違反です",
  },
  {
    pattern:
      /アトピー[にをがで]|花粉症[にをがで]|認知症[にをがで]|うつ病|鬱病/g,
    category: "疾病名",
    law: "薬機法",
    severity: "critical",
    message: "疾病名を使った効能表現は薬機法違反です",
  },
  {
    pattern: /骨粗[しそ]ょう症|関節炎|リウマチ|不眠症|睡眠障害/g,
    category: "疾病名",
    law: "薬機法",
    severity: "critical",
    message: "疾病名を使った効能表現は薬機法違反です",
  },
  {
    pattern: /便秘[がを]治|下痢[がを]治|貧血[がを]治|更年期障害/g,
    category: "疾病名",
    law: "薬機法",
    severity: "critical",
    message: "疾病の治療効果を標榜する表現は薬機法違反です",
  },
  {
    pattern: /予防[するされしますした]|防[ぐぎますれた]/g,
    category: "予防効果",
    law: "薬機法",
    severity: "critical",
    message: "疾病の予防効果を標榜する表現は薬機法違反です（第68条）",
  },
  {
    pattern: /血圧[がを]下げ|血糖値[がを]下げ|コレステロール[がを]下げ/g,
    category: "身体機能変化",
    law: "薬機法",
    severity: "critical",
    message: "身体機能の変化を標榜する表現は薬機法違反です",
  },
  {
    pattern: /シミ[がを]消|シワ[がを]消|くすみ[がを]消|若返[るりますれた]/g,
    category: "美容効果",
    law: "薬機法",
    severity: "critical",
    message: "美容効果を断定する表現は薬機法違反です",
  },
  {
    pattern: /美白効果|ホワイトニング効果|発毛|育毛効果|薄毛[がを]改善/g,
    category: "美容効果",
    law: "薬機法",
    severity: "critical",
    message: "美白・発毛効果は医薬部外品の効能です（第68条）",
  },
  {
    pattern: /効く|効果がある|効能/g,
    category: "医薬品的効能",
    law: "薬機法",
    severity: "high",
    message: "断定的な効果表現は薬機法違反の可能性があります（第66条）",
  },
  {
    pattern: /改善[するされしますした]/g,
    category: "改善効果",
    law: "薬機法",
    severity: "high",
    message: "断定的な改善効果の表現は避けるべきです",
  },
  {
    pattern: /脂肪[がを]燃|脂肪燃焼|代謝[がを]上げ|免疫力[がを]上げ/g,
    category: "身体機能変化",
    law: "薬機法",
    severity: "high",
    message: "身体機能の変化を標榜する表現は避けるべきです",
  },
  {
    pattern: /ホルモン[がを]調整|細胞[がを]活性化|神経[がを]修復/g,
    category: "身体機能変化",
    law: "薬機法",
    severity: "critical",
    message: "身体の組織・機能への影響を標榜する表現は薬機法違反です",
  },
  {
    pattern: /診断|処方|投与|服用/g,
    category: "医療用語",
    law: "薬機法",
    severity: "high",
    message: "医療行為を連想させる用語は避けるべきです",
  },

  // ========================================
  // 健康増進法
  // ========================================
  {
    pattern: /必ず|絶対|確実に|間違いなく/g,
    category: "保証表現",
    law: "健康増進法",
    severity: "critical",
    message: "保証表現は健康増進法第65条違反です",
  },
  {
    pattern: /100%|完全|万全|パーフェクト/g,
    category: "保証表現",
    law: "健康増進法",
    severity: "critical",
    message: "完全性を保証する表現は健康増進法違反です",
  },
  {
    pattern: /副作用なし|副作用ゼロ|安全100%|絶対安全|完全無害/g,
    category: "安全性保証",
    law: "健康増進法",
    severity: "critical",
    message: "安全性を保証する表現は健康増進法違反です（第65条）",
  },
  {
    pattern: /誰でも|どんな方でも|全員|すべての人/g,
    category: "保証表現",
    law: "健康増進法",
    severity: "high",
    message: "全員に効果があるような表現は避けるべきです",
  },
  {
    pattern: /即効|速攻|すぐに効く|即座に|瞬時に/g,
    category: "速効性",
    law: "健康増進法",
    severity: "high",
    message: "速効性を標榜する表現は健康増進法違反の可能性があります",
  },
  {
    pattern: /たった.+で|わずか.+で|.+日で効果|.+週間で実感/g,
    category: "速効性",
    law: "健康増進法",
    severity: "high",
    message: "短期間での効果を標榜する表現は避けるべきです",
  },
  {
    pattern: /飲んですぐ|使ってすぐ|一回で|初回から|翌朝には/g,
    category: "速効性",
    law: "健康増進法",
    severity: "high",
    message: "即効性を標榜する表現は避けるべきです",
  },
  {
    pattern: /必ず痩せ|確実に痩せ|絶対痩せ/g,
    category: "ダイエット保証",
    law: "健康増進法",
    severity: "critical",
    message: "ダイエット効果を保証する表現は健康増進法違反です",
  },
  {
    pattern: /楽して痩せ|簡単に痩せ|飲むだけで痩せ|食べても痩せ/g,
    category: "誇大広告",
    law: "健康増進法",
    severity: "critical",
    message: "誇大なダイエット表現は健康増進法違反です（第65条）",
  },
  {
    pattern: /\d+kg減|\d+キロ減|体重が.+減|ウエスト.+cm/g,
    category: "誇大広告",
    law: "健康増進法",
    severity: "high",
    message: "具体的な減量値を標榜する表現は避けるべきです",
  },
  {
    pattern: /食事制限不要|運動不要|努力不要|リバウンドしない/g,
    category: "誇大広告",
    law: "健康増進法",
    severity: "high",
    message: "努力不要の表現は誇大広告に該当する可能性があります",
  },
  {
    pattern: /医師[がの]推奨|専門家[がの]お墨付き|医学博士[がの]開発/g,
    category: "体験談濫用",
    law: "健康増進法",
    severity: "high",
    message: "権威者の推薦表現は誤認を招く可能性があります",
  },
  {
    pattern: /科学的に証明|医学的に実証|臨床試験で証明/g,
    category: "誇大広告",
    law: "健康増進法",
    severity: "high",
    message: "根拠不十分な科学的主張は避けるべきです",
  },
  {
    pattern: /天然だから安全|自然由来.+安心|オーガニック.+無害/g,
    category: "安全性保証",
    law: "健康増進法",
    severity: "high",
    message: "天然=安全という誤解を招く表現は避けるべきです",
  },

  // ========================================
  // 食品表示法
  // ========================================
  {
    pattern: /アレルギー.+なし|アレルゲンフリー|アレルギー.+安心/g,
    category: "アレルゲン表示",
    law: "食品表示法",
    severity: "critical",
    message: "アレルゲンの不存在を保証する表現は危険です（食品表示基準第3条）",
  },
  {
    pattern: /(卵|乳|小麦|そば|落花生|えび|かに).+不使用.+安全/g,
    category: "アレルゲン表示",
    law: "食品表示法",
    severity: "high",
    message: "コンタミネーションの可能性を考慮した表示が必要です",
  },
  {
    pattern: /カロリーゼロ|カロリーオフ|ノンカロリー/g,
    category: "栄養表示",
    law: "食品表示法",
    severity: "medium",
    message: "カロリー表示は食品表示基準の数値基準を満たす必要があります",
  },
  {
    pattern: /糖質ゼロ|糖質オフ|無糖|シュガーフリー/g,
    category: "栄養表示",
    law: "食品表示法",
    severity: "medium",
    message: "糖質表示は食品表示基準の数値基準を満たす必要があります",
  },
  {
    pattern: /ビタミン.+豊富|ミネラル.+たっぷり|栄養.+満点/g,
    category: "栄養表示",
    law: "食品表示法",
    severity: "medium",
    message: "栄養成分の強調表示は具体的な数値が必要です（第7条）",
  },
  {
    pattern: /機能性.+証明|機能性.+実証/g,
    category: "機能性表示",
    law: "食品表示法",
    severity: "high",
    message: "機能性表示食品は届出番号と届出表示の記載が必要です（第9条）",
  },
  {
    pattern: /トクホ|特定保健用食品|特保/g,
    category: "機能性表示",
    law: "食品表示法",
    severity: "high",
    message: "特定保健用食品は消費者庁の許可番号の記載が必要です（第10条）",
  },
  {
    pattern: /国産.+だから安心|日本製.+安全|外国産.+危険/g,
    category: "原産地表示",
    law: "食品表示法",
    severity: "high",
    message: "原産地と安全性を関連付ける表現は避けるべきです",
  },

  // ========================================
  // 食品衛生法
  // ========================================
  {
    pattern: /無添加.+だから安全|添加物.+ゼロ.+安心|完全無添加/g,
    category: "添加物表示",
    law: "食品衛生法",
    severity: "high",
    message: "無添加表示のガイドラインに注意が必要です（第19条）",
  },
  {
    pattern: /保存料.+不使用.+長持ち|防腐剤.+なし.+日持ち/g,
    category: "添加物表示",
    law: "食品衛生法",
    severity: "high",
    message:
      "保存料不使用と品質保持を関連付ける表現は誤解を招く可能性があります",
  },
  {
    pattern: /雑菌.+ゼロ|無菌|菌.+完全除去/g,
    category: "衛生基準",
    law: "食品衛生法",
    severity: "high",
    message: "無菌を保証する表現は避けるべきです（第11条）",
  },
  {
    pattern: /腐らない|永久に保存|賞味期限.+なし/g,
    category: "衛生基準",
    law: "食品衛生法",
    severity: "critical",
    message: "品質保持期限の表示は義務です（第19条）",
  },

  // ========================================
  // 景品表示法（追加）
  // ========================================
  {
    pattern: /最高|最強|最も|No\.?1|ナンバーワン|第1位/g,
    category: "最上級表現",
    law: "景品表示法",
    severity: "medium",
    message: "最上級表現は客観的根拠がない場合は景品表示法違反です（第5条）",
  },
  {
    pattern: /世界一|日本一|業界一|他社を圧倒|唯一の/g,
    category: "優良誤認",
    law: "景品表示法",
    severity: "high",
    message: "比較優位性の標榜は客観的根拠が必要です（第5条第1号）",
  },
  {
    pattern: /売上No\.?1|人気No\.?1|満足度No\.?1/g,
    category: "優良誤認",
    law: "景品表示法",
    severity: "medium",
    message: "ランキング表示は調査方法の明示が必要です",
  },
  {
    pattern: /今だけ|期間限定|本日限り/g,
    category: "有利誤認",
    law: "景品表示法",
    severity: "low",
    message: "期間限定表示は実態と一致する必要があります（第5条第2号）",
  },
  {
    pattern: /通常価格.+円.+今なら|定価.+円.+特別価格/g,
    category: "有利誤認",
    law: "景品表示法",
    severity: "medium",
    message: "二重価格表示は適切な根拠が必要です",
  },
  {
    pattern: /他店より安い|最安値保証|どこよりも安い/g,
    category: "有利誤認",
    law: "景品表示法",
    severity: "high",
    message: "価格比較表示は客観的根拠が必要です",
  },

  // ========================================
  // 特定商取引法（追加）
  // ========================================
  {
    pattern: /返品不可|キャンセル不可|ノークレーム/g,
    category: "返品表示",
    law: "特定商取引法",
    severity: "high",
    message: "返品条件の表示は特定商取引法に準拠する必要があります（第11条）",
  },
  {
    pattern: /在庫わずか|残り.+個|売り切れ間近/g,
    category: "煽り表示",
    law: "特定商取引法",
    severity: "low",
    message: "在庫表示は実態と一致する必要があります",
  },
];

/**
 * テキストの4法コンプライアンスチェック（Sanityバリデーション用）
 */
export function validateCompliance(
  text: string | null | undefined,
): ComplianceValidationResult {
  // 空文字列はOK
  if (!text || text.trim().length === 0) {
    return { isValid: true, score: 100 };
  }

  const violations: ComplianceValidationResult["violations"] = [];

  // 各パターンをチェック
  for (const rule of COMPLIANCE_PATTERNS) {
    const matches = text.match(rule.pattern);
    if (matches) {
      for (const match of matches) {
        violations.push({
          text: match,
          category: rule.category,
          law: rule.law,
          severity: rule.severity,
        });
      }
    }
  }

  // 重大違反（critical）がある場合はバリデーションエラー
  const criticalViolations = violations.filter(
    (v) => v.severity === "critical",
  );

  // スコア計算
  const score = calculateScore(violations);

  if (criticalViolations.length > 0) {
    const lawGroups = groupByLaw(criticalViolations);
    const messages = Object.entries(lawGroups).map(
      ([law, items]) =>
        `【${law}】${items.map((v) => `「${v.text}」`).join(", ")}`,
    );

    return {
      isValid: false,
      message: `⛔ 法令違反の可能性:\n${messages.join("\n")}`,
      violations,
      score,
    };
  }

  // 高リスク違反は警告のみ（バリデーションは通す）
  const highViolations = violations.filter((v) => v.severity === "high");
  if (highViolations.length > 0) {
    const lawGroups = groupByLaw(highViolations);
    const messages = Object.entries(lawGroups).map(
      ([law, items]) =>
        `【${law}】${items.map((v) => `「${v.text}」`).join(", ")}`,
    );

    return {
      isValid: true, // 保存は可能
      message: `⚠️ 要確認:\n${messages.join("\n")}`,
      violations,
      score,
    };
  }

  // 中・低リスク違反
  if (violations.length > 0) {
    return {
      isValid: true,
      message: `📝 軽微な指摘: ${violations.length}件`,
      violations,
      score,
    };
  }

  return { isValid: true, score: 100 };
}

/**
 * 法令別にグループ化
 */
function groupByLaw(
  violations: NonNullable<ComplianceValidationResult["violations"]>,
): Record<string, typeof violations> {
  const groups: Record<string, typeof violations> = {};
  for (const v of violations) {
    if (!groups[v.law]) {
      groups[v.law] = [];
    }
    groups[v.law].push(v);
  }
  return groups;
}

/**
 * スコア計算（0-100）
 */
function calculateScore(
  violations: NonNullable<ComplianceValidationResult["violations"]>,
): number {
  if (violations.length === 0) return 100;

  const severityPenalty: Record<Severity, number> = {
    critical: 30,
    high: 15,
    medium: 5,
    low: 2,
  };

  let totalPenalty = 0;
  for (const v of violations) {
    totalPenalty += severityPenalty[v.severity];
  }

  return Math.max(0, 100 - totalPenalty);
}

/**
 * OK表現の例（参考用）
 */
export const APPROVED_EXPRESSIONS = {
  general: [
    "健康維持をサポート",
    "栄養補給に",
    "〜に役立つ可能性",
    "一般的に〜と言われています",
    "研究では〜が報告されています",
    "バランスの取れた食生活の一部として",
    "継続的な摂取により",
    "適切な食事と運動と併せて",
  ],
  disclaimer: [
    "※個人の感想であり、効果を保証するものではありません",
    "※効果には個人差があります",
    "※本品は、特定保健用食品とは異なり、消費者庁長官による個別審査を受けたものではありません",
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
 * 対応法令一覧
 */
export const SUPPORTED_LAWS = [
  {
    id: "pharmaceutical_affairs",
    name: "薬機法",
    fullName: "医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律",
    penalty: "2年以下の懲役または200万円以下の罰金",
  },
  {
    id: "health_promotion",
    name: "健康増進法",
    fullName: "健康増進法",
    penalty: "措置命令、課徴金納付命令",
  },
  {
    id: "food_labeling",
    name: "食品表示法",
    fullName: "食品表示法",
    penalty: "措置命令、2年以下の懲役または200万円以下の罰金",
  },
  {
    id: "food_sanitation",
    name: "食品衛生法",
    fullName: "食品衛生法",
    penalty: "営業禁止・停止命令、3年以下の懲役または300万円以下の罰金",
  },
  {
    id: "premiums_representations",
    name: "景品表示法",
    fullName: "不当景品類及び不当表示防止法",
    penalty: "措置命令、課徴金納付命令（売上高の3%）",
  },
  {
    id: "specified_commercial_transactions",
    name: "特定商取引法",
    fullName: "特定商取引に関する法律",
    penalty: "業務停止命令、2年以下の懲役または300万円以下の罰金",
  },
];
