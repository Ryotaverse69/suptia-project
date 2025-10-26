import { formatTextWithParagraphs, formatList } from "@/lib/text-formatter";

interface IngredientContentProps {
  description: string;
  benefits?: string[];
  className?: string;
}

/**
 * 成分記事の本文表示コンポーネント
 * モバイル対応・読みやすさ最適化済み
 */
export function IngredientContent({
  description,
  benefits,
  className = "",
}: IngredientContentProps) {
  return (
    <div className={`ingredient-content ${className}`}>
      {/* メインの説明文 */}
      <div className="text-primary-800 text-sm sm:text-base leading-7 sm:leading-8 px-2 sm:px-0">
        <div
          dangerouslySetInnerHTML={{
            __html: formatTextWithParagraphs(description),
          }}
          className="formatted-content prose prose-sm sm:prose-base max-w-none"
        />
      </div>

      {/* 効果・効能のリスト */}
      {benefits && benefits.length > 0 && (
        <div className="mt-6">
          <div
            dangerouslySetInnerHTML={{
              __html: formatList(benefits, "bullet"),
            }}
            className="text-sm sm:text-base text-primary-800"
          />
        </div>
      )}
    </div>
  );
}
