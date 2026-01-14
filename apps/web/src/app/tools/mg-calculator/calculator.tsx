"use client";

/**
 * mg単価計算機コンポーネント - Apple HIG Design
 */

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Calculator, Copy, Check, Share2, RotateCcw } from "lucide-react";

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
  cost90Days: number;
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
    borderColor: "border-[#AF52DE]/20",
    gradient: "from-[#AF52DE] to-[#5856D6]",
  },
  good: {
    label: "良好",
    emoji: "💡",
    color: "text-[#34C759]",
    bgColor: "bg-[#34C759]/10",
    borderColor: "border-[#34C759]/20",
    gradient: "from-[#34C759] to-[#00C7BE]",
  },
  average: {
    label: "普通",
    emoji: "⚖️",
    color: "text-[#FF9500]",
    bgColor: "bg-[#FF9500]/10",
    borderColor: "border-[#FF9500]/20",
    gradient: "from-[#FF9500] to-[#FFCC00]",
  },
  poor: {
    label: "割高",
    emoji: "💸",
    color: "text-[#FF3B30]",
    bgColor: "bg-[#FF3B30]/10",
    borderColor: "border-[#FF3B30]/20",
    gradient: "from-[#FF3B30] to-[#FF9500]",
  },
};

export function MgCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [inputs, setInputs] = useState<CalculatorInputs>({
    price: "",
    quantity: "",
    mgPerUnit: "",
    dailyIntake: "1",
  });

  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [copied, setCopied] = useState(false);

  // URLパラメータから初期値を読み込み
  useEffect(() => {
    const p = searchParams.get("p");
    const q = searchParams.get("q");
    const mg = searchParams.get("mg");
    const d = searchParams.get("d");

    if (p || q || mg || d) {
      setInputs({
        price: p || "",
        quantity: q || "",
        mgPerUnit: mg || "",
        dailyIntake: d || "1",
      });
    }
  }, [searchParams]);

  // 入力が変わったら自動計算
  useEffect(() => {
    const price = parseFloat(inputs.price);
    const quantity = parseFloat(inputs.quantity);
    const mgPerUnit = parseFloat(inputs.mgPerUnit);
    const dailyIntake = parseFloat(inputs.dailyIntake) || 1;

    if (price > 0 && quantity > 0 && mgPerUnit > 0) {
      const dailyCost = (price / quantity) * dailyIntake;
      const mgPrice = price / (quantity * mgPerUnit);
      const cost30Days = dailyCost * 30;
      const cost90Days = dailyCost * 90;

      // コスパ判定
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
        cost90Days,
        rating,
        ratingLabel: RATING_CONFIG[rating].label,
        ratingEmoji: RATING_CONFIG[rating].emoji,
      });
    } else {
      setResults(null);
    }
  }, [inputs]);

  const handleInputChange = (field: keyof CalculatorInputs, value: string) => {
    // 数値のみ許可（小数点も）
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleReset = () => {
    setInputs({
      price: "",
      quantity: "",
      mgPerUnit: "",
      dailyIntake: "1",
    });
    setResults(null);
    router.push("/tools/mg-calculator", { scroll: false });
  };

  const handleCopyUrl = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("p", inputs.price);
    url.searchParams.set("q", inputs.quantity);
    url.searchParams.set("mg", inputs.mgPerUnit);
    url.searchParams.set("d", inputs.dailyIntake);

    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [inputs]);

  const handleShare = useCallback(async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("p", inputs.price);
    url.searchParams.set("q", inputs.quantity);
    url.searchParams.set("mg", inputs.mgPerUnit);
    url.searchParams.set("d", inputs.dailyIntake);

    if (navigator.share) {
      try {
        await navigator.share({
          title: "サプリのコスパ計算結果 | サプティア",
          text: results
            ? `mg単価: ${results.mgPrice.toFixed(2)}円/mg（${results.ratingLabel}）`
            : "サプリのコスパを計算してみよう",
          url: url.toString(),
        });
      } catch {
        // シェアがキャンセルされた場合は何もしない
      }
    } else {
      handleCopyUrl();
    }
  }, [inputs, results, handleCopyUrl]);

  const ratingConfig = results ? RATING_CONFIG[results.rating] : null;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* 入力フォーム */}
      <div className="bg-white/80 backdrop-blur-xl backdrop-saturate-[180%] border border-black/[0.04] rounded-[20px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-[17px] font-semibold text-[#1d1d1f] flex items-center gap-2"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            }}
          >
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#007AFF] to-[#5AC8FA] flex items-center justify-center shadow-sm">
              <Calculator size={16} className="text-white" strokeWidth={2} />
            </div>
            商品情報を入力
          </h2>
          <button
            onClick={handleReset}
            className="text-[13px] text-[#86868b] hover:text-[#1d1d1f] flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={12} />
            リセット
          </button>
        </div>

        <div className="space-y-5">
          {/* 商品価格 */}
          <div>
            <label
              htmlFor="price"
              className="block text-[13px] font-medium text-[#86868b] mb-2 tracking-[-0.01em]"
            >
              商品価格
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                id="price"
                value={inputs.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="1980"
                className="w-full px-4 py-3 pr-12 bg-[#f5f5f7] border border-black/[0.04] rounded-[12px] focus:bg-white focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 focus:outline-none transition-all text-[17px] text-[#1d1d1f] placeholder:text-[#86868b]/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[15px] text-[#86868b]">
                円
              </span>
            </div>
          </div>

          {/* 内容量 */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-[13px] font-medium text-[#86868b] mb-2 tracking-[-0.01em]"
            >
              内容量（粒数）
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                id="quantity"
                value={inputs.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="60"
                className="w-full px-4 py-3 pr-12 bg-[#f5f5f7] border border-black/[0.04] rounded-[12px] focus:bg-white focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 focus:outline-none transition-all text-[17px] text-[#1d1d1f] placeholder:text-[#86868b]/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[15px] text-[#86868b]">
                粒
              </span>
            </div>
          </div>

          {/* 1粒あたり成分量 */}
          <div>
            <label
              htmlFor="mgPerUnit"
              className="block text-[13px] font-medium text-[#86868b] mb-2 tracking-[-0.01em]"
            >
              1粒あたり成分量
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                id="mgPerUnit"
                value={inputs.mgPerUnit}
                onChange={(e) => handleInputChange("mgPerUnit", e.target.value)}
                placeholder="1000"
                className="w-full px-4 py-3 pr-14 bg-[#f5f5f7] border border-black/[0.04] rounded-[12px] focus:bg-white focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 focus:outline-none transition-all text-[17px] text-[#1d1d1f] placeholder:text-[#86868b]/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[15px] text-[#86868b]">
                mg
              </span>
            </div>
          </div>

          {/* 1日の摂取量 */}
          <div>
            <label
              htmlFor="dailyIntake"
              className="block text-[13px] font-medium text-[#86868b] mb-2 tracking-[-0.01em]"
            >
              1日の摂取量
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                id="dailyIntake"
                value={inputs.dailyIntake}
                onChange={(e) =>
                  handleInputChange("dailyIntake", e.target.value)
                }
                placeholder="1"
                className="w-full px-4 py-3 pr-12 bg-[#f5f5f7] border border-black/[0.04] rounded-[12px] focus:bg-white focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 focus:outline-none transition-all text-[17px] text-[#1d1d1f] placeholder:text-[#86868b]/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[15px] text-[#86868b]">
                粒
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 計算結果 */}
      <div className="bg-white/80 backdrop-blur-xl backdrop-saturate-[180%] border border-black/[0.04] rounded-[20px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <h2
          className="text-[17px] font-semibold text-[#1d1d1f] mb-6 flex items-center gap-2"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          }}
        >
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#34C759] to-[#00C7BE] flex items-center justify-center shadow-sm">
            <span className="text-white text-sm">📊</span>
          </div>
          計算結果
        </h2>

        {results ? (
          <div className="space-y-6">
            {/* 結果グリッド */}
            <div className="grid grid-cols-2 gap-3">
              <ResultCard
                label="1日あたりコスト"
                value={`${results.dailyCost.toFixed(1)}`}
                unit="円/日"
              />
              <ResultCard
                label="mg単価"
                value={`${results.mgPrice.toFixed(2)}`}
                unit="円/mg"
                highlight
              />
              <ResultCard
                label="30日分コスト"
                value={`${Math.round(results.cost30Days).toLocaleString()}`}
                unit="円"
              />
              <ResultCard
                label="90日分コスト"
                value={`${Math.round(results.cost90Days).toLocaleString()}`}
                unit="円"
              />
            </div>

            {/* コスパ判定 */}
            {ratingConfig && (
              <div
                className={`${ratingConfig.bgColor} ${ratingConfig.borderColor} border rounded-[16px] p-5`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-[14px] bg-gradient-to-br ${ratingConfig.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-2xl">{ratingConfig.emoji}</span>
                  </div>
                  <div>
                    <p
                      className={`font-semibold text-[17px] ${ratingConfig.color}`}
                      style={{
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                      }}
                    >
                      コスパ判定: {ratingConfig.label}
                    </p>
                    <p className="text-[15px] text-[#515154] mt-0.5">
                      {results.mgPrice < 0.1
                        ? "非常にお得な価格です"
                        : results.mgPrice < 0.5
                          ? "平均より安い価格です"
                          : results.mgPrice < 1.0
                            ? "標準的な価格です"
                            : "やや割高な価格です"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* シェアボタン */}
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#007AFF] text-white font-medium text-[15px] rounded-[12px] hover:bg-[#0071e3] active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(0,122,255,0.3)]"
              >
                <Share2 size={16} strokeWidth={2} />
                結果をシェア
              </button>
              <button
                onClick={handleCopyUrl}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-[#f5f5f7] border border-black/[0.04] text-[#1d1d1f] font-medium text-[15px] rounded-[12px] hover:bg-[#e8e8ed] active:scale-[0.98] transition-all"
              >
                {copied ? (
                  <>
                    <Check
                      size={16}
                      className="text-[#34C759]"
                      strokeWidth={2}
                    />
                    コピー済み
                  </>
                ) : (
                  <>
                    <Copy size={16} strokeWidth={2} />
                    URLコピー
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-[#86868b]">
            <div className="w-16 h-16 rounded-[18px] bg-[#f5f5f7] flex items-center justify-center mb-4">
              <Calculator size={32} className="opacity-40" />
            </div>
            <p className="text-center text-[15px] leading-relaxed">
              左側のフォームに
              <br />
              商品情報を入力してください
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  unit,
  highlight = false,
}: {
  label: string;
  value: string;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-[14px] ${
        highlight
          ? "bg-gradient-to-br from-[#007AFF]/10 to-[#5AC8FA]/10 border border-[#007AFF]/20"
          : "bg-[#f5f5f7] border border-black/[0.04]"
      }`}
    >
      <p className="text-[11px] font-medium text-[#86868b] mb-1 tracking-[0.01em] uppercase">
        {label}
      </p>
      <p
        className={`text-[24px] font-bold tracking-[-0.02em] ${
          highlight ? "text-[#007AFF]" : "text-[#1d1d1f]"
        }`}
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        }}
      >
        {value}
        <span className="text-[13px] font-medium text-[#86868b] ml-1">
          {unit}
        </span>
      </p>
    </div>
  );
}
