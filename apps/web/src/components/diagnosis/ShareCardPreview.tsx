"use client";

import { useState } from "react";
import {
  Share2,
  MessageCircle,
  Check,
  Download,
  Image as ImageIcon,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  liquidGlassClasses,
} from "@/lib/design-system";

type CardFormat = "ogp" | "story" | "square";

interface ShareCardPreviewProps {
  goals: string[];
  topProduct: string;
  tierRank: string;
  pricePerDay: number;
  scores: {
    price?: string;
    content?: string;
    costEffectiveness?: string;
    evidence?: string;
    safety?: string;
  };
  className?: string;
}

const FORMAT_LABELS: Record<CardFormat, { label: string; desc: string }> = {
  ogp: { label: "X / Facebook", desc: "1200x630" },
  story: { label: "Stories", desc: "1080x1920" },
  square: { label: "LINE", desc: "1080x1080" },
};

function buildCardUrl(
  props: Omit<ShareCardPreviewProps, "className">,
  format: CardFormat,
): string {
  const params = new URLSearchParams();
  params.set("goals", props.goals.join(","));
  params.set("topProduct", props.topProduct);
  params.set("tierRank", props.tierRank);
  params.set("pricePerDay", String(props.pricePerDay));
  params.set("format", format);
  if (props.scores.price) params.set("price", props.scores.price);
  if (props.scores.content) params.set("content", props.scores.content);
  if (props.scores.costEffectiveness)
    params.set("costEffectiveness", props.scores.costEffectiveness);
  if (props.scores.evidence) params.set("evidence", props.scores.evidence);
  if (props.scores.safety) params.set("safety", props.scores.safety);
  return `/api/og/diagnosis?${params.toString()}`;
}

export function ShareCardPreview({
  goals,
  topProduct,
  tierRank,
  pricePerDay,
  scores,
  className = "",
}: ShareCardPreviewProps) {
  const [format, setFormat] = useState<CardFormat>("ogp");
  const [copied, setCopied] = useState(false);

  const cardProps = { goals, topProduct, tierRank, pricePerDay, scores };
  const cardUrl = buildCardUrl(cardProps, format);

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

  const handleXShare = () => {
    const url = window.location.href;
    const text = `サプティアでサプリメント診断をしました！\n${topProduct}が総合${tierRank}ランクでおすすめ（¥${pricePerDay}/日）`;
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(xUrl, "_blank", "width=550,height=420");
  };

  const handleLineShare = () => {
    const url = window.location.href;
    const text = `サプティアでサプリメント診断をしました！\n${topProduct}が総合${tierRank}ランクでおすすめ（¥${pricePerDay}/日）`;
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(text + "\n" + url)}`;
    window.open(lineUrl, "_blank");
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(cardUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `suptia-diagnosis-${format}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download card:", err);
    }
  };

  const handleInstagramShare = async () => {
    // Instagram はWeb APIで直接シェアできないので、画像ダウンロード + キャプションコピー
    const caption = `サプティアでサプリメント診断！\n${topProduct}が総合${tierRank}ランクでおすすめ（¥${pricePerDay}/日）\n\n5つの柱でサプリを科学的に比較\nsuptia.com/diagnosis\n\n#サプティア #サプリメント #サプリ比較 #サプリメント診断`;
    try {
      await navigator.clipboard.writeText(caption);
    } catch {
      // silent fail
    }
    // 画像ダウンロード（Story形式）
    const storyUrl = buildCardUrl(cardProps, "story");
    const response = await fetch(storyUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "suptia-diagnosis-story.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`${className}`}>
      {/* カードプレビュー */}
      <div className={`${liquidGlassClasses.light} p-4 sm:p-6`}>
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon size={18} style={{ color: systemColors.purple }} />
          <h3
            className="text-[15px] font-semibold"
            style={{ color: appleWebColors.textPrimary }}
          >
            シェアカード
          </h3>
        </div>

        {/* フォーマット切替タブ */}
        <div className="flex gap-2 mb-4">
          {(Object.keys(FORMAT_LABELS) as CardFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className="px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors min-h-[36px]"
              style={{
                backgroundColor:
                  format === f
                    ? systemColors.blue
                    : appleWebColors.sectionBackground,
                color: format === f ? "#ffffff" : appleWebColors.textSecondary,
              }}
            >
              {FORMAT_LABELS[f].label}
            </button>
          ))}
        </div>

        {/* プレビュー画像 */}
        <div
          className="rounded-xl overflow-hidden border mb-4"
          style={{
            borderColor: appleWebColors.borderSubtle,
            maxHeight: format === "story" ? "400px" : "auto",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cardUrl}
            alt="シェアカードプレビュー"
            className="w-full h-auto"
            style={{
              maxHeight: format === "story" ? "400px" : "auto",
              objectFit: "contain",
            }}
          />
        </div>

        <p
          className="text-[12px] mb-4"
          style={{ color: appleWebColors.textTertiary }}
        >
          {FORMAT_LABELS[format].desc} — {FORMAT_LABELS[format].label}向け
        </p>

        {/* シェアボタン群 */}
        <div className="flex flex-wrap gap-2">
          {/* X (Twitter) */}
          <button
            onClick={handleXShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors min-h-[44px]"
            style={{
              backgroundColor: "#000000",
              color: "#ffffff",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Xでシェア
          </button>

          {/* LINE */}
          <button
            onClick={handleLineShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors min-h-[44px]"
            style={{
              backgroundColor: "#06C755",
              color: "#ffffff",
            }}
          >
            <MessageCircle size={14} />
            LINEでシェア
          </button>

          {/* Instagram (ダウンロード+キャプション) */}
          <button
            onClick={handleInstagramShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors min-h-[44px]"
            style={{
              background:
                "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
              color: "#ffffff",
            }}
          >
            <Download size={14} />
            Instagram用
          </button>

          {/* URLコピー */}
          <button
            onClick={handleCopyUrl}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors min-h-[44px]"
            style={{
              backgroundColor: appleWebColors.sectionBackground,
              color: appleWebColors.textPrimary,
            }}
          >
            {copied ? (
              <>
                <Check size={14} style={{ color: systemColors.green }} />
                コピー済み
              </>
            ) : (
              <>
                <Share2 size={14} />
                URLコピー
              </>
            )}
          </button>

          {/* 画像ダウンロード */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors min-h-[44px]"
            style={{
              backgroundColor: appleWebColors.sectionBackground,
              color: appleWebColors.textPrimary,
            }}
          >
            <Download size={14} />
            画像保存
          </button>
        </div>
      </div>
    </div>
  );
}
