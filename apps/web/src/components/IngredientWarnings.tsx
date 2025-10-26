import { AlertTriangle, Info } from "lucide-react";

interface IngredientWarningsProps {
  sideEffects?: string[];
  interactions?: string[];
}

/**
 * 妊婦・授乳婦への警告を自動検出して表示
 * 重大なリスクがある場合のみ表示
 */
export function IngredientWarnings({
  sideEffects,
  interactions,
}: IngredientWarningsProps) {
  const allText = [...(sideEffects || []), ...(interactions || [])].join(" ");

  // 重大な危険を示すキーワード（これらがある場合のみ警告を表示）
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

  // 妊婦・授乳婦関連のキーワードも含まれているか確認
  const pregnancyKeywords = [
    "妊婦",
    "妊娠",
    "授乳",
    "胎児",
    "妊娠中",
    "授乳中",
  ];
  const hasPregnancyMention = pregnancyKeywords.some((keyword) =>
    allText.includes(keyword),
  );

  // 重大な警告があり、かつ妊婦関連の言及がある場合のみ表示
  if (!hasCriticalWarning || !hasPregnancyMention) return null;

  return (
    <div className="mb-6">
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
