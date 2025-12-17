"use client";

/**
 * 埋め込み用mg単価計算機コンポーネント - コンパクト版
 */

import { useState, useEffect } from "react";
import { Calculator } from "lucide-react";

interface CalculatorInputs {
  price: string;
  quantity: string;
  mgPerUnit: string;
  dailyIntake: string;
}

interface CalculatorResults {
  dailyCost: number;
  mgPrice: number;
  cost30Days: number;
  rating: "excellent" | "good" | "average" | "poor";
  ratingLabel: string;
  ratingEmoji: string;
}

const RATING_CONFIG = {
  excellent: {
    label: "非常に良い",
    emoji: "🏆",
    color: "text-[#AF52DE]",
    bgColor: "bg-[#AF52DE]/10",
  },
  good: {
    label: "良好",
    emoji: "💡",
    color: "text-[#34C759]",
    bgColor: "bg-[#34C759]/10",
  },
  average: {
    label: "普通",
    emoji: "⚖️",
    color: "text-[#FF9500]",
    bgColor: "bg-[#FF9500]/10",
  },
  poor: {
    label: "割高",
    emoji: "💸",
    color: "text-[#FF3B30]",
    bgColor: "bg-[#FF3B30]/10",
  },
};

export function EmbedCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    price: "",
    quantity: "",
    mgPerUnit: "",
    dailyIntake: "1",
  });

  const [results, setResults] = useState<CalculatorResults | null>(null);

  useEffect(() => {
    const price = parseFloat(inputs.price);
    const quantity = parseFloat(inputs.quantity);
    const mgPerUnit = parseFloat(inputs.mgPerUnit);
    const dailyIntake = parseFloat(inputs.dailyIntake) || 1;

    if (price > 0 && quantity > 0 && mgPerUnit > 0) {
      const dailyCost = (price / quantity) * dailyIntake;
      const mgPrice = price / (quantity * mgPerUnit);
      const cost30Days = dailyCost * 30;

      let rating: CalculatorResults["rating"];
      if (mgPrice < 0.1) {
        rating = "excellent";
      } else if (mgPrice < 0.5) {
        rating = "good";
      } else if (mgPrice < 1.0) {
        rating = "average";
      } else {
        rating = "poor";
      }

      setResults({
        dailyCost,
        mgPrice,
        cost30Days,
        rating,
        ratingLabel: RATING_CONFIG[rating].label,
        ratingEmoji: RATING_CONFIG[rating].emoji,
      });
    } else {
      setResults(null);
    }
  }, [inputs]);

  const handleInputChange = (field: keyof CalculatorInputs, value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const ratingConfig = results ? RATING_CONFIG[results.rating] : null;

  return (
    <div className="space-y-3">
      {/* ヘッダー */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#007AFF] to-[#5AC8FA] flex items-center justify-center">
          <Calculator size={14} className="text-white" strokeWidth={2} />
        </div>
        <h1 className="text-[14px] font-semibold text-[#1d1d1f]">
          コスパ計算機
        </h1>
      </div>

      {/* 入力フォーム */}
      <div className="bg-white border border-black/[0.06] rounded-xl p-3 space-y-2">
        <InputField
          label="価格"
          value={inputs.price}
          onChange={(v) => handleInputChange("price", v)}
          placeholder="1980"
          unit="円"
        />
        <InputField
          label="内容量"
          value={inputs.quantity}
          onChange={(v) => handleInputChange("quantity", v)}
          placeholder="60"
          unit="粒"
        />
        <InputField
          label="1粒あたり"
          value={inputs.mgPerUnit}
          onChange={(v) => handleInputChange("mgPerUnit", v)}
          placeholder="1000"
          unit="mg"
        />
        <InputField
          label="1日摂取量"
          value={inputs.dailyIntake}
          onChange={(v) => handleInputChange("dailyIntake", v)}
          placeholder="1"
          unit="粒"
        />
      </div>

      {/* 計算結果 */}
      {results && (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3 space-y-2">
          {/* コスパ判定 */}
          {ratingConfig && (
            <div
              className={`${ratingConfig.bgColor} rounded-lg p-2.5 flex items-center gap-2`}
            >
              <span className="text-lg">{ratingConfig.emoji}</span>
              <div>
                <p
                  className={`text-[13px] font-semibold ${ratingConfig.color}`}
                >
                  {ratingConfig.label}
                </p>
                <p className="text-[11px] text-[#86868b]">
                  mg単価 {results.mgPrice.toFixed(2)}円
                </p>
              </div>
            </div>
          )}

          {/* 数値結果 */}
          <div className="grid grid-cols-2 gap-2">
            <ResultItem
              label="1日あたり"
              value={`${results.dailyCost.toFixed(1)}円`}
            />
            <ResultItem
              label="30日分"
              value={`${Math.round(results.cost30Days).toLocaleString()}円`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  unit,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  unit: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-[11px] text-[#86868b] w-14 shrink-0">
        {label}
      </label>
      <div className="relative flex-1">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-2 py-1.5 pr-8 bg-[#f5f5f7] border border-black/[0.04] rounded-lg text-[13px] text-[#1d1d1f] placeholder:text-[#86868b]/50 focus:outline-none focus:border-[#007AFF]"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#86868b]">
          {unit}
        </span>
      </div>
    </div>
  );
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#f5f5f7] rounded-lg p-2 text-center">
      <p className="text-[10px] text-[#86868b]">{label}</p>
      <p className="text-[14px] font-bold text-[#1d1d1f]">{value}</p>
    </div>
  );
}
