import { Award, Shield, Beaker } from "lucide-react";

interface IngredientHeaderProps {
  name: string;
  nameEn: string;
  category?: string;
  evidenceLevel?: string;
  description?: string;
}

// エビデンスレベルの色とラベル
const evidenceLevelConfig: Record<string, { color: string; bgColor: string; label: string }> = {
  S: { color: "text-purple-700", bgColor: "bg-purple-100", label: "最高レベル" },
  A: { color: "text-blue-700", bgColor: "bg-blue-100", label: "高い根拠" },
  B: { color: "text-green-700", bgColor: "bg-green-100", label: "中程度の根拠" },
  C: { color: "text-yellow-700", bgColor: "bg-yellow-100", label: "限定的な根拠" },
  D: { color: "text-gray-700", bgColor: "bg-gray-100", label: "根拠不十分" },
  高: { color: "text-blue-700", bgColor: "bg-blue-100", label: "高い根拠" },
  中: { color: "text-green-700", bgColor: "bg-green-100", label: "中程度の根拠" },
  低: { color: "text-yellow-700", bgColor: "bg-yellow-100", label: "限定的な根拠" },
};

export function IngredientHeader({
  name,
  nameEn,
  category,
  evidenceLevel,
  description,
}: IngredientHeaderProps) {
  const evidenceConfig = evidenceLevel
    ? evidenceLevelConfig[evidenceLevel] || evidenceLevelConfig["C"]
    : null;

  return (
    <header className="mb-6 sm:mb-8">
      {/* パンくずリスト */}
      <nav className="text-sm text-gray-500 mb-4">
        <ol className="flex items-center gap-2">
          <li>
            <a href="/" className="hover:text-primary transition-colors">
              ホーム
            </a>
          </li>
          <li>/</li>
          <li>
            <a href="/ingredients" className="hover:text-primary transition-colors">
              成分ガイド
            </a>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium truncate">{name}</li>
        </ol>
      </nav>

      {/* メインヘッダー */}
      <div className="bg-gradient-to-br from-primary/5 via-white to-blue-50 rounded-2xl p-5 sm:p-8 border border-primary/10">
        {/* タイトル */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          {name}
        </h1>
        <p className="text-base sm:text-lg text-gray-500 mb-4 sm:mb-6">{nameEn}</p>

        {/* バッジ群 */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-5 sm:mb-6">
          {category && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full text-xs sm:text-sm font-medium shadow-sm">
              <Beaker size={14} className="text-gray-500" />
              {category}
            </span>
          )}
          {evidenceConfig && (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${evidenceConfig.bgColor} ${evidenceConfig.color} rounded-full text-xs sm:text-sm font-medium`}
            >
              <Award size={14} />
              エビデンス: {evidenceLevel}
              <span className="text-xs opacity-75">({evidenceConfig.label})</span>
            </span>
          )}
        </div>

        {/* 概要説明 */}
        {description && (
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 sm:p-5 border border-gray-100">
            <div className="flex items-start gap-3">
              <Shield size={20} className="flex-shrink-0 text-primary mt-0.5" />
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed sm:leading-loose">
                {description}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
