"use client";

import { useState } from "react";
import Link from "next/link";

interface IngredientWithRisk {
  _id: string;
  name: string;
  nameEn: string;
  slug: { current: string };
  category: string;
  riskLevel?: "low" | "medium" | "high" | "critical";
  contraindications?: string[];
}

interface ContraindicationChecklistProps {
  contraindicationMap: Map<string, IngredientWithRisk[]>;
  contraindicationLabels: Record<string, string>;
}

const riskLevelConfig = {
  critical: {
    color: "bg-red-100 text-red-900",
    icon: "🚨",
  },
  high: {
    color: "bg-orange-100 text-orange-900",
    icon: "⚠️",
  },
  medium: {
    color: "bg-yellow-100 text-yellow-900",
    icon: "⚡",
  },
  low: {
    color: "bg-blue-100 text-blue-900",
    icon: "ℹ️",
  },
};

export function ContraindicationChecklist({
  contraindicationMap,
  contraindicationLabels,
}: ContraindicationChecklistProps) {
  const [expandedTag, setExpandedTag] = useState<string | null>(null);

  const sortedContraindications = Array.from(contraindicationMap.entries())
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 12);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <p className="text-gray-700 mb-4">
        以下の項目に当てはまる場合、注意が必要な成分があります。該当する項目をクリックしてください。
      </p>

      <div className="space-y-3">
        {sortedContraindications.map(([tag, ingredients]) => (
          <div key={tag} className="border-2 border-gray-200 rounded-lg">
            <button
              onClick={() => setExpandedTag(expandedTag === tag ? null : tag)}
              className="w-full text-left p-4 hover:bg-blue-50 transition-all group rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {expandedTag === tag ? "📖" : "📋"}
                  </span>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-900">
                    {contraindicationLabels[tag] || tag}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-gray-600 group-hover:text-blue-600">
                    {ingredients.length}件
                  </span>
                  <span className="text-gray-400 group-hover:text-blue-600 transition-transform">
                    {expandedTag === tag ? "▼" : "▶"}
                  </span>
                </div>
              </div>
            </button>

            {expandedTag === tag && (
              <div className="border-t-2 border-gray-200 p-4 bg-gray-50">
                <p className="text-sm text-gray-600 mb-4">
                  <strong>{contraindicationLabels[tag] || tag}</strong>
                  の方は、以下の成分に注意が必要です：
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  {ingredients.map((ingredient) => {
                    const config = ingredient.riskLevel
                      ? riskLevelConfig[ingredient.riskLevel]
                      : null;

                    return (
                      <Link
                        key={ingredient._id}
                        href={`/ingredients/${ingredient.slug.current}`}
                        className={`block p-3 rounded-lg border-2 hover:shadow-md transition-all ${
                          config
                            ? `${config.color} border-current`
                            : "bg-gray-100 text-gray-900 border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {config && (
                              <span className="text-lg">{config.icon}</span>
                            )}
                            <h4 className="font-bold">{ingredient.name}</h4>
                          </div>
                          <span className="text-xs font-semibold">→</span>
                        </div>
                        {ingredient.category && (
                          <p className="text-xs mt-1 opacity-75">
                            {ingredient.category}
                          </p>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          💡{" "}
          <strong>
            該当する項目がある方は、サプリメントを摂取する前に必ず医師に相談してください。
          </strong>
        </p>
      </div>
    </div>
  );
}
