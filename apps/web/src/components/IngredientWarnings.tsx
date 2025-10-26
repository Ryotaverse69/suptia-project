import { AlertTriangle, Info } from "lucide-react";

interface IngredientWarningsProps {
  sideEffects?: string[];
  interactions?: string[];
}

/**
 * 妊婦・授乳婦への警告を自動検出して表示
 */
export function IngredientWarnings({
  sideEffects,
  interactions,
}: IngredientWarningsProps) {
  // 警告キーワードの検出
  const pregnancyKeywords = [
    "妊婦",
    "妊娠",
    "授乳",
    "胎児",
    "妊娠中",
    "授乳中",
    "妊産婦",
  ];

  const allText = [...(sideEffects || []), ...(interactions || [])].join(" ");

  const hasPregnancyWarning = pregnancyKeywords.some((keyword) =>
    allText.includes(keyword),
  );

  if (!hasPregnancyWarning) return null;

  // 妊婦関連の文章を抽出
  const pregnancyRelatedTexts = [
    ...(sideEffects || []),
    ...(interactions || []),
  ]
    .filter((text) =>
      pregnancyKeywords.some((keyword) => text.includes(keyword)),
    )
    .slice(0, 2); // 最大2つまで表示

  return (
    <div className="mb-8">
      <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-6 shadow-md">
        <div className="flex items-start gap-3">
          <AlertTriangle
            className="text-red-600 flex-shrink-0 mt-0.5"
            size={24}
          />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-900 mb-3">
              ⚠️ 妊娠中・授乳中の方への注意
            </h3>
            <div className="space-y-2">
              {pregnancyRelatedTexts.map((text, index) => (
                <p
                  key={index}
                  className="text-sm sm:text-base text-red-800 leading-relaxed"
                >
                  {text}
                </p>
              ))}
            </div>
            <p className="text-sm text-red-700 mt-4 font-semibold">
              使用前に必ず医師または薬剤師にご相談ください。
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
