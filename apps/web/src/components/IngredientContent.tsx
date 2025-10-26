"use client";

import { useEffect, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={`ingredient-content ${className}`}>
      {/* メインの説明文 */}
      <div
        className={`
          text-primary-800
          ${isMobile ? "text-sm leading-7" : "text-base leading-8"}
          ${isMobile ? "px-2" : ""}
        `}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: formatTextWithParagraphs(description),
          }}
          className="formatted-content"
        />
      </div>

      {/* 効果・効能のリスト */}
      {benefits && benefits.length > 0 && (
        <div className="mt-6">
          <div
            dangerouslySetInnerHTML={{
              __html: formatList(benefits, "bullet"),
            }}
            className={`
              ${isMobile ? "text-sm" : "text-base"}
              text-primary-800
            `}
          />
        </div>
      )}

      {/* スタイル定義 */}
      <style jsx global>{`
        .ingredient-content {
          word-break: keep-all;
          overflow-wrap: break-word;
        }

        .formatted-content > div {
          margin-bottom: 1.25rem;
        }

        .formatted-content > div:last-child {
          margin-bottom: 0;
        }

        /* 強調テキスト */
        .formatted-content strong {
          font-weight: 600;
          color: rgb(var(--primary-900));
        }

        /* コードブロック */
        .formatted-content code {
          padding: 0.125rem 0.25rem;
          background-color: rgba(var(--primary-100), 0.5);
          border-radius: 0.25rem;
          font-size: 0.875em;
        }

        /* モバイル用の追加スタイル */
        @media (max-width: 640px) {
          .formatted-content > div {
            margin-bottom: 1rem;
            padding: 0 0.25rem;
          }

          .formatted-content br + br {
            display: none; /* 連続した改行を1つに */
          }
        }

        /* タブレット用 */
        @media (min-width: 640px) and (max-width: 1024px) {
          .formatted-content > div {
            margin-bottom: 1.125rem;
          }
        }
      `}</style>
    </div>
  );
}
