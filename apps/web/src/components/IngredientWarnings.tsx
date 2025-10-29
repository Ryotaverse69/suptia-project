import { AlertTriangle, Info, ShieldAlert, AlertOctagon } from "lucide-react";

interface IngredientWarningsProps {
  sideEffects?: string[];
  interactions?: string[];
  riskLevel?: "low" | "medium" | "high" | "critical";
  specialWarnings?: Array<{
    severity: "critical" | "warning" | "info";
    message: string;
    affectedGroups?: string[];
  }>;
  overdoseRisks?: string[];
}

/**
 * 成分の危険性・警告を表示するコンポーネント
 * - 特別警告（specialWarnings）
 * - リスクレベル（riskLevel）
 * - 妊婦・授乳婦への自動検出警告
 * - 過剰摂取リスク（overdoseRisks）
 */
export function IngredientWarnings({
  sideEffects,
  interactions,
  riskLevel,
  specialWarnings,
  overdoseRisks,
}: IngredientWarningsProps) {
  const allText = [...(sideEffects || []), ...(interactions || [])].join(" ");

  // 重大な危険を示すキーワード
  const criticalKeywords = [
    "禁忌",
    "避ける",
    "禁止",
    "控える",
    "使用しない",
    "摂取しない",
    "中止",
    "危険",
    "催奇形性",
    "先天性奇形",
    "流産",
    "早産",
  ];

  const hasCriticalWarning = criticalKeywords.some((keyword) =>
    allText.includes(keyword),
  );

  // 妊婦・授乳婦関連のキーワード
  const pregnancyKeywords = [
    "妊婦",
    "妊娠",
    "授乳",
    "胎児",
    "妊娠中",
    "授乳中",
    "乳児",
  ];
  const hasPregnancyMention = pregnancyKeywords.some((keyword) =>
    allText.includes(keyword),
  );

  const showPregnancyWarning = hasCriticalWarning && hasPregnancyMention;

  // 何も表示するものがない場合は早期リターン
  if (
    !showPregnancyWarning &&
    !specialWarnings?.length &&
    !riskLevel &&
    !overdoseRisks?.length
  ) {
    return null;
  }

  const riskLevelConfig = {
    critical: {
      bgColor: "bg-red-50",
      borderColor: "border-red-500",
      textColor: "text-red-900",
      icon: <AlertOctagon className="text-red-600" size={24} />,
      label: "最高リスク",
      description: "使用前に必ず医師に相談してください",
    },
    high: {
      bgColor: "bg-orange-50",
      borderColor: "border-orange-500",
      textColor: "text-orange-900",
      icon: <AlertTriangle className="text-orange-600" size={24} />,
      label: "高リスク",
      description: "広範囲で注意が必要です",
    },
    medium: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-500",
      textColor: "text-yellow-900",
      icon: <ShieldAlert className="text-yellow-600" size={24} />,
      label: "中リスク",
      description: "特定の条件下で注意してください",
    },
    low: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      textColor: "text-blue-900",
      icon: <Info className="text-blue-600" size={24} />,
      label: "低リスク",
      description: "一般的に安全ですが、過剰摂取には注意",
    },
  };

  return (
    <div className="mb-6 space-y-4">
      {/* 特別警告（最優先表示） */}
      {specialWarnings?.map((warning, index) => {
        const warningConfig = {
          critical: {
            bgColor: "bg-red-50",
            borderColor: "border-red-500",
            textColor: "text-red-900",
            icon: <AlertOctagon className="text-red-600" size={20} />,
          },
          warning: {
            bgColor: "bg-orange-50",
            borderColor: "border-orange-500",
            textColor: "text-orange-900",
            icon: <AlertTriangle className="text-orange-600" size={20} />,
          },
          info: {
            bgColor: "bg-blue-50",
            borderColor: "border-blue-500",
            textColor: "text-blue-900",
            icon: <Info className="text-blue-600" size={20} />,
          },
        };
        const config = warningConfig[warning.severity];

        return (
          <div
            key={index}
            className={`${config.bgColor} border-l-4 ${config.borderColor} rounded-r-lg p-4 shadow-sm`}
          >
            <div className="flex items-start gap-3">
              {config.icon}
              <div className="flex-1">
                <p
                  className={`text-sm sm:text-base ${config.textColor} font-semibold`}
                >
                  {warning.message}
                </p>
                {warning.affectedGroups &&
                  warning.affectedGroups.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {warning.affectedGroups.map((group) => (
                        <span
                          key={group}
                          className={`text-xs px-2 py-1 rounded-full bg-white ${config.textColor}`}
                        >
                          {group}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </div>
        );
      })}

      {/* リスクレベル表示 */}
      {riskLevel && riskLevel !== "low" && (
        <div
          className={`${riskLevelConfig[riskLevel].bgColor} border-l-4 ${riskLevelConfig[riskLevel].borderColor} rounded-r-lg p-4 shadow-sm`}
        >
          <div className="flex items-start gap-3">
            {riskLevelConfig[riskLevel].icon}
            <div className="flex-1">
              <p
                className={`text-sm sm:text-base ${riskLevelConfig[riskLevel].textColor} font-semibold`}
              >
                {riskLevelConfig[riskLevel].label}：
                {riskLevelConfig[riskLevel].description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 妊婦・授乳婦への自動検出警告 */}
      {showPregnancyWarning && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="text-red-600 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div className="flex-1">
              <p className="text-sm sm:text-base text-red-900 font-semibold">
                妊娠中・授乳中の方は使用前に必ず医師にご相談ください
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 過剰摂取リスク */}
      {overdoseRisks && overdoseRisks.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="text-orange-600 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div className="flex-1">
              <p className="text-sm sm:text-base text-orange-900 font-semibold mb-2">
                過剰摂取に注意
              </p>
              <ul className="text-sm text-orange-800 space-y-1 list-disc list-inside">
                {overdoseRisks.map((risk, index) => (
                  <li key={index}>{risk}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 成分の要約を1行で表示
 */
interface IngredientSummaryProps {
  description: string;
}

export function IngredientSummary({ description }: IngredientSummaryProps) {
  // descriptionの最初の文を抽出（句点まで）
  const firstSentence = description.split(/[。！？]/)[0] + "。";

  // 150文字を超える場合は切り詰め
  const summary =
    firstSentence.length > 150
      ? firstSentence.substring(0, 147) + "..."
      : firstSentence;

  return (
    <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
        <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-medium">
          {summary}
        </p>
      </div>
    </div>
  );
}
