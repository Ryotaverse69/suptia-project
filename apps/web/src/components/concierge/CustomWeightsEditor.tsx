/**
 * カスタム重み付けエディター
 *
 * Pro+Safety / Admin限定機能
 * ユーザーが5つの柱の重み付けを自由にカスタマイズ
 */

"use client";

import { useState, useEffect } from "react";
import { Save, RotateCcw, Lock, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { appleWebColors, systemColors } from "@/lib/design-system";
import type { UserPlan } from "@/contexts/UserProfileContext";

interface CustomWeights {
  price: number;
  amount: number;
  costPerformance: number;
  evidence: number;
  safety: number;
}

interface CustomWeightsEditorProps {
  userPlan: UserPlan | "guest";
  initialWeights?: CustomWeights;
  onSave: (weights: CustomWeights) => Promise<void>;
  onReset: () => Promise<void>;
  className?: string;
}

const WEIGHT_CONFIG = {
  price: {
    icon: "💰",
    label: "価格",
    description: "安さを重視",
    color: systemColors.yellow,
  },
  amount: {
    icon: "📊",
    label: "成分量",
    description: "含有量を重視",
    color: systemColors.blue,
  },
  costPerformance: {
    icon: "💡",
    label: "コスパ",
    description: "費用対効果を重視",
    color: systemColors.green,
  },
  evidence: {
    icon: "🔬",
    label: "エビデンス",
    description: "科学的根拠を重視",
    color: systemColors.purple,
  },
  safety: {
    icon: "🛡️",
    label: "安全性",
    description: "副作用リスクの低さを重視",
    color: systemColors.teal,
  },
};

const DEFAULT_WEIGHTS: CustomWeights = {
  price: 20,
  amount: 20,
  costPerformance: 20,
  evidence: 20,
  safety: 20,
};

export function CustomWeightsEditor({
  userPlan,
  initialWeights,
  onSave,
  onReset,
  className,
}: CustomWeightsEditorProps) {
  const [weights, setWeights] = useState<CustomWeights>(
    initialWeights || DEFAULT_WEIGHTS,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Pro+Safety / Admin以外はロック表示
  const isLocked = userPlan !== "pro_safety" && userPlan !== "admin";

  // 初期値が変更された場合に反映
  useEffect(() => {
    if (initialWeights) {
      setWeights(initialWeights);
    }
  }, [initialWeights]);

  // 変更検知
  useEffect(() => {
    const initial = initialWeights || DEFAULT_WEIGHTS;
    const changed = Object.keys(weights).some(
      (key) =>
        weights[key as keyof CustomWeights] !==
        initial[key as keyof CustomWeights],
    );
    setHasChanges(changed);
  }, [weights, initialWeights]);

  // スライダー変更時の処理（合計100%を保つ）
  const handleWeightChange = (key: keyof CustomWeights, value: number) => {
    if (isLocked) return;

    // 新しい値を設定
    const newWeights = { ...weights, [key]: value };

    // 合計を計算
    const total = Object.values(newWeights).reduce((sum, w) => sum + w, 0);

    // 合計が100を超える場合は、他の値を比例配分で調整
    if (total > 100) {
      const excess = total - 100;
      const otherKeys = (
        Object.keys(newWeights) as Array<keyof CustomWeights>
      ).filter((k) => k !== key);
      const otherTotal = otherKeys.reduce((sum, k) => sum + newWeights[k], 0);

      if (otherTotal > 0) {
        otherKeys.forEach((k) => {
          const reduction = (newWeights[k] / otherTotal) * excess;
          newWeights[k] = Math.max(0, Math.round(newWeights[k] - reduction));
        });
      }
    }

    // 合計が100未満の場合は、最大値のキーに追加
    const finalTotal = Object.values(newWeights).reduce((sum, w) => sum + w, 0);
    if (finalTotal < 100) {
      const maxKey = (
        Object.keys(newWeights) as Array<keyof CustomWeights>
      ).reduce((max, k) => (newWeights[k] > newWeights[max] ? k : max));
      newWeights[maxKey] += 100 - finalTotal;
    }

    setWeights(newWeights);
  };

  // 保存
  const handleSave = async () => {
    if (isLocked || !hasChanges) return;

    setIsSaving(true);
    try {
      await onSave(weights);
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  // リセット
  const handleReset = async () => {
    if (isLocked || isSaving) return;

    setIsSaving(true);
    try {
      await onReset();
      setWeights(DEFAULT_WEIGHTS);
      setHasChanges(false);
    } catch (error) {
      console.error("Reset failed:", error);
      // エラーは親コンポーネントで処理
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={cn("p-4 rounded-2xl relative", className)}
      style={{
        backgroundColor: appleWebColors.sectionBackground,
        border: `1px solid ${appleWebColors.borderSubtle}`,
      }}
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h4
            className="text-[14px] font-semibold"
            style={{ color: appleWebColors.textPrimary }}
          >
            カスタム重み付け
          </h4>
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{
              backgroundColor: `${systemColors.purple}15`,
              color: systemColors.purple,
            }}
          >
            Pro+Safety
          </span>
        </div>

        {/* 情報アイコン */}
        <button
          className="p-1 rounded-full hover:bg-black/5 transition-colors"
          title="カスタム重み付けについて"
        >
          <Info
            className="w-3.5 h-3.5"
            style={{ color: systemColors.gray[4] }}
          />
        </button>
      </div>

      {/* ロック表示 */}
      {isLocked && (
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center z-10 backdrop-blur-sm"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
        >
          <Lock
            size={32}
            style={{ color: systemColors.gray[4] }}
            className="mb-2"
          />
          <p
            className="text-[13px] font-medium mb-1"
            style={{ color: appleWebColors.textPrimary }}
          >
            Pro+Safetyプラン限定
          </p>
          <p
            className="text-[11px] text-center px-4"
            style={{ color: appleWebColors.textSecondary }}
          >
            あなた専用の重み付けで
            <br />
            最適な商品を見つけましょう
          </p>
        </div>
      )}

      {/* 説明文 */}
      <p
        className="text-[11px] mb-4"
        style={{ color: appleWebColors.textSecondary }}
      >
        5つの柱の重要度を調整して、あなたの価値観に合った推薦を受けられます
      </p>

      {/* 重み付けスライダー */}
      <div className="space-y-4 mb-4">
        {(Object.keys(WEIGHT_CONFIG) as Array<keyof CustomWeights>).map(
          (key) => (
            <div key={key}>
              {/* ラベル */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[13px]">{WEIGHT_CONFIG[key].icon}</span>
                  <span
                    className="text-[12px] font-medium"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    {WEIGHT_CONFIG[key].label}
                  </span>
                  <span
                    className="text-[10px]"
                    style={{ color: appleWebColors.textTertiary }}
                  >
                    {WEIGHT_CONFIG[key].description}
                  </span>
                </div>
                <span
                  className="text-[12px] font-bold"
                  style={{ color: WEIGHT_CONFIG[key].color }}
                >
                  {weights[key]}%
                </span>
              </div>

              {/* スライダー */}
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={weights[key]}
                onChange={(e) =>
                  handleWeightChange(key, parseInt(e.target.value))
                }
                disabled={isLocked}
                className={cn(
                  "w-full h-2 rounded-full appearance-none cursor-pointer",
                  isLocked && "opacity-50 cursor-not-allowed",
                )}
                style={{
                  background: `linear-gradient(to right, ${WEIGHT_CONFIG[key].color} 0%, ${WEIGHT_CONFIG[key].color} ${weights[key]}%, ${appleWebColors.borderSubtle} ${weights[key]}%, ${appleWebColors.borderSubtle} 100%)`,
                }}
              />
            </div>
          ),
        )}
      </div>

      {/* 合計表示 */}
      <div
        className="p-2 rounded-lg mb-4"
        style={{ backgroundColor: `${systemColors.blue}10` }}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-[11px] font-medium"
            style={{ color: appleWebColors.textSecondary }}
          >
            合計
          </span>
          <span
            className="text-[14px] font-bold"
            style={{ color: systemColors.blue }}
          >
            {Object.values(weights).reduce((sum, w) => sum + w, 0)}%
          </span>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex gap-2">
        <button
          onClick={handleReset}
          disabled={isLocked || isSaving || !initialWeights}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all",
            isLocked || isSaving || !initialWeights
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-80 active:scale-[0.98]",
          )}
          style={{
            backgroundColor: appleWebColors.sectionBackground,
            border: `1px solid ${appleWebColors.borderSubtle}`,
            color: appleWebColors.textPrimary,
          }}
        >
          <RotateCcw size={14} />
          {isSaving ? "処理中..." : "リセット"}
        </button>
        <button
          onClick={handleSave}
          disabled={isLocked || isSaving || !hasChanges}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium text-white transition-all",
            isLocked || isSaving || !hasChanges
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-90 active:scale-[0.98]",
          )}
          style={{ backgroundColor: systemColors.blue }}
        >
          <Save size={14} />
          {isSaving ? "処理中..." : "保存"}
        </button>
      </div>

      {/* 注意書き */}
      <p
        className="mt-3 text-[10px] text-center"
        style={{ color: appleWebColors.textTertiary }}
      >
        カスタム重み付けは、AIコンシェルジュの推薦ロジックに反映されます
      </p>
    </div>
  );
}
