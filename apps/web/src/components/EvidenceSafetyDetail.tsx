/**
 * エビデンスと安全性の詳細表示コンポーネント
 */

import {
  Microscope,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

interface EvidenceSafetyDetailProps {
  evidenceLevel?: "S" | "A" | "B" | "C" | "D";
  evidenceScore?: number;
  safetyScore?: number;
  thirdPartyTested?: boolean;
  warnings?: string[];
  references?: Array<{
    title?: string;
    url?: string;
    source?: string;
  }>;
  ingredientName?: string;
  ingredientEvidenceLevel?: "S" | "A" | "B" | "C" | "D";
  className?: string;
}

export function EvidenceSafetyDetail({
  evidenceLevel,
  evidenceScore = 0,
  safetyScore = 0,
  thirdPartyTested = false,
  warnings = [],
  references = [],
  ingredientName,
  ingredientEvidenceLevel,
  className = "",
}: EvidenceSafetyDetailProps) {
  // エビデンスレベルの説明
  const evidenceLevelInfo = {
    S: {
      label: "エビデンスS - 最高レベル",
      description:
        "大規模なランダム化比較試験（RCT）やメタ解析により、高い効果が実証されています。",
      color: "from-purple-500 to-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-300",
      textColor: "text-purple-900",
    },
    A: {
      label: "エビデンスA - 高い信頼性",
      description:
        "良質な研究により効果が確認されています。複数の研究で一貫した結果が得られています。",
      color: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300",
      textColor: "text-blue-900",
    },
    B: {
      label: "エビデンスB - 中程度の信頼性",
      description:
        "限定的な研究または条件付きで効果が確認されています。さらなる研究が期待されます。",
      color: "from-green-500 to-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
      textColor: "text-green-900",
    },
    C: {
      label: "エビデンスC - 限定的",
      description:
        "動物実験や小規模な試験レベルです。人間への効果は十分に実証されていません。",
      color: "from-yellow-500 to-yellow-700",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-300",
      textColor: "text-yellow-900",
    },
    D: {
      label: "エビデンスD - 未検証",
      description: "理論的根拠のみで、科学的研究による実証が不十分です。",
      color: "from-gray-500 to-gray-700",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-300",
      textColor: "text-gray-900",
    },
  };

  const currentEvidenceInfo = evidenceLevel
    ? evidenceLevelInfo[evidenceLevel]
    : evidenceLevelInfo.D;

  // 安全性レベルの判定（S/A/B/C/D）
  const getSafetyLevel = (score: number) => {
    if (score >= 90)
      return {
        grade: "S",
        label: "安全性S - 最高レベル",
        description:
          "非常に高い安全性が確認されています。重大な副作用の報告がなく、長期使用の実績があります。",
        color: "text-green-700",
        bgColor: "bg-green-50",
        borderColor: "border-green-300",
        icon: CheckCircle2,
      };
    if (score >= 80)
      return {
        grade: "A",
        label: "安全性A - 高い安全性",
        description:
          "高い安全性が確認されています。適切な使用下では問題ありません。",
        color: "text-blue-700",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-300",
        icon: CheckCircle2,
      };
    if (score >= 70)
      return {
        grade: "B",
        label: "安全性B - 中程度の安全性",
        description:
          "一般的に安全ですが、一部の方には注意が必要な場合があります。",
        color: "text-yellow-700",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-300",
        icon: AlertTriangle,
      };
    if (score >= 60)
      return {
        grade: "C",
        label: "安全性C - 注意が必要",
        description: "使用には注意が必要です。医師への相談を推奨します。",
        color: "text-orange-700",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-300",
        icon: AlertTriangle,
      };
    return {
      grade: "D",
      label: "安全性D - 要注意",
      description:
        "安全性に懸念があります。使用前に必ず医師に相談してください。",
      color: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
      icon: AlertTriangle,
    };
  };

  const safetyLevel = getSafetyLevel(safetyScore);
  const SafetyIcon = safetyLevel.icon;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* エビデンスレベル */}
      <div className="bg-white border border-primary-200 rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-primary-900 mb-4 flex items-center gap-2">
          <Microscope size={24} />
          科学的エビデンス
        </h2>

        {/* エビデンスレベルバッジ */}
        <div
          className={`p-6 rounded-xl bg-gradient-to-r ${currentEvidenceInfo.color} mb-6`}
        >
          <div className="text-white">
            <p className="text-3xl font-bold mb-2">
              {evidenceLevel || "D"}ランク
            </p>
            <p className="text-lg opacity-90">{currentEvidenceInfo.label}</p>
          </div>
        </div>

        {/* 説明 */}
        <div
          className={`p-4 rounded-lg ${currentEvidenceInfo.bgColor} border ${currentEvidenceInfo.borderColor}`}
        >
          <p className={`text-sm ${currentEvidenceInfo.textColor}`}>
            {currentEvidenceInfo.description}
          </p>
        </div>

        {/* エビデンススコア */}
        {evidenceScore > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">
                エビデンススコア
              </span>
              <span className="text-2xl font-bold text-primary">
                {evidenceScore}点
              </span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary-700 transition-all duration-500"
                style={{ width: `${evidenceScore}%` }}
              />
            </div>
          </div>
        )}

        {/* 成分のエビデンスレベル */}
        {ingredientName && ingredientEvidenceLevel && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              主要成分のエビデンス評価
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{ingredientName}:</span>
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold">
                  {ingredientEvidenceLevel}
                </span>
              </div>
              <span className="text-xs text-gray-600">
                {evidenceLevelInfo[ingredientEvidenceLevel]?.label}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              この成分自体の科学的根拠は{ingredientEvidenceLevel}
              ランクに評価されています。
            </p>
          </div>
        )}

        {/* 参考文献 */}
        {references.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              参考文献
            </h3>
            <div className="space-y-2">
              {references.map((ref, index) => (
                <a
                  key={index}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <ExternalLink
                    size={16}
                    className="text-primary mt-0.5 group-hover:scale-110 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
                      {ref.title}
                    </p>
                    {ref.source && (
                      <p className="text-xs text-gray-500 mt-1">{ref.source}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 安全性 */}
      <div className="bg-white border border-primary-200 rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-primary-900 mb-4 flex items-center gap-2">
          <Shield size={24} />
          安全性評価
        </h2>

        {/* 安全性レベルバッジ */}
        <div
          className={`p-6 ${safetyLevel.bgColor} border ${safetyLevel.borderColor} rounded-lg mb-6`}
        >
          <div className="flex items-center gap-3 mb-3">
            <SafetyIcon size={28} className={safetyLevel.color} />
            <div>
              <p className={`text-3xl font-bold ${safetyLevel.color}`}>
                {safetyLevel.grade}ランク
              </p>
              <p className={`text-sm font-semibold ${safetyLevel.color}`}>
                {safetyLevel.label}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-700">{safetyLevel.description}</p>
        </div>

        {/* 第三者機関検査 */}
        {thirdPartyTested && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-400 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle2 size={20} />
              <div>
                <p className="font-bold">第三者機関検査済み</p>
                <p className="text-sm">
                  独立した検査機関による品質検査を受けています。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 注意事項 */}
        {warnings.length > 0 && (
          <div className="p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
            <div className="flex items-start gap-2 text-yellow-800">
              <AlertTriangle size={20} className="mt-0.5" />
              <div className="flex-1">
                <p className="font-bold mb-2">注意事項</p>
                <ul className="space-y-1 text-sm">
                  {warnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-600">•</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 安全性の詳細説明 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            安全性スコアの評価基準
          </h4>
          <ul className="space-y-1 text-xs text-gray-600">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>第三者機関による品質検査の有無</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>副作用や相互作用の報告</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>推奨摂取量に対する安全マージン</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>原材料の品質と由来の透明性</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>製造工程の管理体制（GMP認証など）</span>
            </li>
          </ul>
        </div>

        {/* 参考文献 */}
        {references.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <ExternalLink size={16} />
              参考文献
            </h4>
            <ul className="space-y-2">
              {references.map((ref, index) => (
                <li key={index} className="text-sm">
                  <a
                    href={ref.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-start gap-2"
                  >
                    <span className="text-gray-500">[{index + 1}]</span>
                    <span className="flex-1">
                      {ref.title || "参考文献"}
                      {ref.source && (
                        <span className="text-gray-600 ml-2">
                          ({ref.source})
                        </span>
                      )}
                    </span>
                    <ExternalLink size={12} className="mt-1 flex-shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
