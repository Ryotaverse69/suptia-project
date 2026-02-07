/**
 * スコア説明ツールチップ
 *
 * 5つの柱のスコア計算方法を説明するツールチップ
 */

"use client";

import { useState, useRef, useCallback } from "react";
import { Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { appleWebColors, systemColors } from "@/lib/design-system";

interface ScoreExplanationTooltipProps {
  pillar: "price" | "amount" | "costPerformance" | "evidence" | "safety";
  score?: number;
  weight?: number;
  className?: string;
}

const PILLAR_EXPLANATIONS = {
  price: {
    icon: "💰",
    label: "価格",
    description: "他の類似商品と比較した価格の評価",
    calculation: [
      "同成分の商品群の中での価格順位",
      "1ヶ月分換算での価格比較",
      "最安値との差額を考慮",
    ],
    scoreGuide: {
      high: "市場平均より15%以上安い",
      medium: "市場平均±15%の範囲内",
      low: "市場平均より15%以上高い",
    },
  },
  amount: {
    icon: "📊",
    label: "成分量",
    description: "1日あたりの有効成分含有量の評価",
    calculation: [
      "推奨摂取量に対する充足率",
      "主要成分のmg正規化比較",
      "同カテゴリ商品との相対評価",
    ],
    scoreGuide: {
      high: "推奨量の80%以上を充足",
      medium: "推奨量の50-80%を充足",
      low: "推奨量の50%未満",
    },
  },
  costPerformance: {
    icon: "💡",
    label: "コスパ",
    description: "成分量あたりの価格効率",
    calculation: [
      "¥/mg（成分1mgあたりの価格）を算出",
      "同成分商品群での相対評価",
      "価格と成分量のバランスを総合判定",
    ],
    scoreGuide: {
      high: "1mgあたりの価格が市場平均の70%以下",
      medium: "1mgあたりの価格が市場平均の70-130%",
      low: "1mgあたりの価格が市場平均の130%以上",
    },
  },
  evidence: {
    icon: "🔬",
    label: "エビデンス",
    description: "科学的根拠の強さ",
    calculation: [
      "PubMed/Cochrane等の査読論文数",
      "メタ分析・RCTの有無",
      "研究の質と一貫性",
    ],
    scoreGuide: {
      high: "S/Aランク - 強固なエビデンス（複数のメタ分析）",
      medium: "B/Cランク - 中程度のエビデンス（一部のRCT）",
      low: "Dランク - 限定的なエビデンス（観察研究のみ）",
    },
  },
  safety: {
    icon: "🛡️",
    label: "安全性",
    description: "副作用・相互作用リスクの低さ",
    calculation: [
      "既知の副作用の重篤度と頻度",
      "薬物相互作用の可能性",
      "添加物・アレルゲンの有無",
    ],
    scoreGuide: {
      high: "90点以上 - 副作用報告が極めて少ない",
      medium: "70-89点 - 軽微な副作用の可能性",
      low: "70点未満 - 注意が必要な副作用あり",
    },
  },
};

export function ScoreExplanationTooltip({
  pillar,
  score,
  weight,
  className,
}: ScoreExplanationTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const explanation = PILLAR_EXPLANATIONS[pillar];

  const openTooltip = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const tooltipW = 256;
      // ツールチップを上に表示、右端がボタンの右端に揃うよう配置
      let left = rect.right - tooltipW;
      // 画面左端からはみ出す場合は補正
      if (left < 8) left = 8;
      // 画面右端からはみ出す場合も補正
      if (left + tooltipW > window.innerWidth - 8)
        left = window.innerWidth - tooltipW - 8;
      setTooltipPos({ top: rect.top - 8, left });
    }
    setIsOpen(true);
  }, []);

  return (
    <div className={cn("relative inline-block", className)}>
      {/* トリガーボタン */}
      <button
        ref={buttonRef}
        onClick={() => (isOpen ? setIsOpen(false) : openTooltip())}
        onMouseEnter={openTooltip}
        onMouseLeave={() => setIsOpen(false)}
        className="p-1 rounded-full hover:bg-black/5 transition-colors"
        title={`${explanation.label}の説明`}
      >
        <Info className="w-3.5 h-3.5" style={{ color: systemColors.gray[4] }} />
      </button>

      {/* ツールチップ（fixed配置で親のoverflow影響を回避） */}
      {isOpen && (
        <div
          className="fixed z-[100] w-64 p-4 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          style={{
            backgroundColor: appleWebColors.sectionBackground,
            border: `1px solid ${appleWebColors.borderSubtle}`,
            top: tooltipPos.top,
            left: tooltipPos.left,
            transform: "translateY(-100%)",
          }}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{explanation.icon}</span>
              <h4
                className="text-[14px] font-semibold"
                style={{ color: appleWebColors.textPrimary }}
              >
                {explanation.label}
              </h4>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-1 rounded-full hover:bg-black/5 transition-colors"
            >
              <X
                className="w-3.5 h-3.5"
                style={{ color: systemColors.gray[4] }}
              />
            </button>
          </div>

          {/* 説明文 */}
          <p
            className="text-[12px] mb-3"
            style={{ color: appleWebColors.textSecondary }}
          >
            {explanation.description}
          </p>

          {/* スコア表示 */}
          {score !== undefined && (
            <div
              className="p-2 rounded-lg mb-3"
              style={{ backgroundColor: `${systemColors.blue}10` }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[11px] font-medium"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  このスコア
                </span>
                <span
                  className="text-[16px] font-bold"
                  style={{ color: systemColors.blue }}
                >
                  {score}
                </span>
              </div>
              {weight !== undefined && weight > 1 && (
                <p
                  className="text-[10px] mt-1"
                  style={{ color: appleWebColors.textTertiary }}
                >
                  ★ このキャラクターは{explanation.label}を重視します
                </p>
              )}
            </div>
          )}

          {/* 計算方法 */}
          <div className="mb-3">
            <h5
              className="text-[11px] font-semibold mb-1.5"
              style={{ color: appleWebColors.textPrimary }}
            >
              計算方法
            </h5>
            <ul className="space-y-1">
              {explanation.calculation.map((item, index) => (
                <li
                  key={index}
                  className="text-[11px] flex items-start gap-1.5"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  <span style={{ color: systemColors.blue }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* スコアガイド */}
          <div>
            <h5
              className="text-[11px] font-semibold mb-1.5"
              style={{ color: appleWebColors.textPrimary }}
            >
              スコアの目安
            </h5>
            <div className="space-y-1">
              <div className="flex items-start gap-1.5">
                <span className="text-[11px]">🟢</span>
                <p
                  className="text-[11px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  {explanation.scoreGuide.high}
                </p>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[11px]">🟡</span>
                <p
                  className="text-[11px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  {explanation.scoreGuide.medium}
                </p>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[11px]">🔴</span>
                <p
                  className="text-[11px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  {explanation.scoreGuide.low}
                </p>
              </div>
            </div>
          </div>

          {/* 矢印（下向き） */}
          <div
            className="absolute w-3 h-3 rotate-45"
            style={{
              backgroundColor: appleWebColors.sectionBackground,
              border: `1px solid ${appleWebColors.borderSubtle}`,
              borderTop: "none",
              borderLeft: "none",
              bottom: "-6px",
              right: "16px",
            }}
          />
        </div>
      )}
    </div>
  );
}
