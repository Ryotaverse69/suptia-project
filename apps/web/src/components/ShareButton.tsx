"use client";

import { Share2, Check, Copy } from "lucide-react";
import { useState, useCallback } from "react";

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  className?: string;
  size?: number;
}

export function ShareButton({
  title,
  text,
  url,
  className = "",
  size = 18,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const shareUrl =
      url || (typeof window !== "undefined" ? window.location.href : "");
    const shareText = text || `${title} | サプティア`;

    // Web Share API が利用可能な場合（主にモバイル）
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (error) {
        // ユーザーがキャンセルした場合は何もしない
        if ((error as Error).name === "AbortError") {
          return;
        }
        // その他のエラーの場合はクリップボードにフォールバック
      }
    }

    // Web Share API が利用できない場合はクリップボードにコピー
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // クリップボードAPIも使えない場合は手動コピー用のプロンプト
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [title, text, url]);

  return (
    <button
      onClick={handleShare}
      className={`p-2 transition-all duration-300 rounded-lg ${
        copied
          ? "text-green-500 bg-green-50"
          : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
      } ${className}`}
      aria-label={copied ? "リンクをコピーしました" : "この商品を共有"}
      title={copied ? "リンクをコピーしました！" : "共有する"}
    >
      {copied ? <Check size={size} /> : <Share2 size={size} />}
    </button>
  );
}
