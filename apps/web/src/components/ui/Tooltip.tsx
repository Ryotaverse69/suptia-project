/**
 * Tooltipコンポーネント
 * ホバー時に説明テキストを表示する汎用コンポーネント
 */

"use client";

import { ReactNode, useState } from "react";
import { Info } from "lucide-react";

interface TooltipProps {
  content: string | ReactNode;
  children?: ReactNode;
  icon?: boolean; // アイコンのみ表示（デフォルト: false）
  position?: "top" | "bottom" | "left" | "right"; // ツールチップの位置
  className?: string;
}

export function Tooltip({
  content,
  children,
  icon = false,
  position = "top",
  className = "",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  // 位置別のクラス
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* トリガー要素 */}
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {icon ? (
          <Info size={16} className="text-gray-500 hover:text-primary" />
        ) : (
          children
        )}
      </div>

      {/* ツールチップ */}
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap ${positionClasses[position]} pointer-events-none`}
          style={{ minWidth: "200px", maxWidth: "300px", whiteSpace: "normal" }}
        >
          {content}
          {/* 矢印 */}
          <div
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === "top"
                ? "bottom-[-4px] left-1/2 -translate-x-1/2"
                : position === "bottom"
                  ? "top-[-4px] left-1/2 -translate-x-1/2"
                  : position === "left"
                    ? "right-[-4px] top-1/2 -translate-y-1/2"
                    : "left-[-4px] top-1/2 -translate-y-1/2"
            }`}
          ></div>
        </div>
      )}
    </div>
  );
}
