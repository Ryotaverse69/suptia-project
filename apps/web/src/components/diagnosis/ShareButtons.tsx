"use client";

import { useState } from "react";
import { Share2, Twitter, MessageCircle, Check } from "lucide-react";

interface ShareButtonsProps {
  className?: string;
}

export function ShareButtons({ className = "" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleTwitterShare = () => {
    const url = window.location.href;
    const text = "サプティアでサプリメント診断をしました！あなたに最適なサプリメントを見つけよう";
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "width=550,height=420");
  };

  const handleLineShare = () => {
    const url = window.location.href;
    const text = "サプティアでサプリメント診断をしました！あなたに最適なサプリメントを見つけよう";
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(text + " " + url)}`;
    window.open(lineUrl, "_blank");
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Share2 size={16} />
        <span>この結果を共有：</span>
      </div>

      <div className="flex gap-2">
        {/* URLコピー */}
        <button
          onClick={handleCopyUrl}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
        >
          {copied ? (
            <>
              <Check size={16} className="text-green-600" />
              <span>コピーしました</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
              </svg>
              <span>URLをコピー</span>
            </>
          )}
        </button>

        {/* Twitter */}
        <button
          onClick={handleTwitterShare}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Twitter size={16} />
          <span className="hidden sm:inline">Twitter</span>
        </button>

        {/* LINE */}
        <button
          onClick={handleLineShare}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <MessageCircle size={16} />
          <span className="hidden sm:inline">LINE</span>
        </button>
      </div>
    </div>
  );
}
