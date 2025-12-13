"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

interface SlideContent {
  heading: string;
  content: string;
}

interface ImageItem {
  type: string;
  url: string | null;
  filename: string | null;
  status: "pending" | "generating" | "done" | "error";
  error?: string;
}

interface GeneratedContent {
  title: string | null;
  slides: SlideContent[];
  caption: string | null;
  hashtags: string[];
  category: string | null;
}

const CATEGORIES = [
  { id: "random", name: "ランダム" },
  { id: "ingredient", name: "成分紹介" },
  { id: "comparison", name: "商品比較" },
  { id: "tips", name: "健康Tips" },
];

const IMAGE_STYLES = [
  { id: "random", name: "ランダム" },
  { id: "flat-minimal", name: "フラットミニマル" },
  { id: "modern-infographic", name: "モダンインフォグラフィック" },
  { id: "organic-wellness", name: "オーガニックウェルネス" },
  { id: "gradient-modern", name: "グラデーションモダン" },
];

const ASPECT_RATIOS = [
  { id: "square", name: "正方形 (1:1)", description: "フィード投稿に最適" },
  { id: "portrait", name: "縦長 (4:5)", description: "フィードで目立つ" },
  {
    id: "story",
    name: "ストーリー (9:16)",
    description: "ストーリー/リール用",
  },
];

const SLIDE_COUNTS = [3, 4, 5, 6, 7];

// シークレットキー（環境変数から取得、フォールバックあり）
const ADMIN_SECRET_KEY =
  process.env.NEXT_PUBLIC_INSTAGRAM_ADMIN_KEY || "suptia-instagram-2024";

export default function InstagramDashboard() {
  const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // 認証チェック
  useEffect(() => {
    const key = searchParams.get("key");
    setIsAuthorized(key === ADMIN_SECRET_KEY);
  }, [searchParams]);

  const [category, setCategory] = useState("random");
  const [customTopic, setCustomTopic] = useState("");
  const [imageStyle, setImageStyle] = useState("random");
  const [aspectRatio, setAspectRatio] = useState("square");
  const [slideCount, setSlideCount] = useState(5);

  const [loading, setLoading] = useState({ content: false });
  const [content, setContent] = useState<GeneratedContent>({
    title: null,
    slides: [],
    caption: null,
    hashtags: [],
    category: null,
  });
  const [images, setImages] = useState<ImageItem[]>([]);
  const [timestamp, setTimestamp] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPostGuide, setShowPostGuide] = useState(false);

  // Step 1: コンテンツ（テキスト）を生成
  const generateContent = async () => {
    setLoading((prev) => ({ ...prev, content: true }));
    setError(null);

    try {
      const response = await fetch("/api/instagram/generate-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: category === "random" ? null : category,
          customTopic: customTopic || null,
          slideCount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setContent({
          title: data.title,
          slides: data.slides || [],
          caption: data.caption,
          hashtags: data.hashtags || [],
          category: data.category,
        });

        const newTimestamp = Date.now();
        setTimestamp(newTimestamp);
        const imageList: ImageItem[] = [
          { type: "cover", url: null, filename: null, status: "pending" },
          ...(data.slides || []).map((_: SlideContent, i: number) => ({
            type: `slide${i + 1}`,
            url: null,
            filename: null,
            status: "pending" as const,
          })),
        ];
        setImages(imageList);
        setCurrentImageIndex(0);
        setShowPostGuide(false);
      } else {
        setError(data.error || "コンテンツ生成に失敗しました");
      }
    } catch (err) {
      setError("エラーが発生しました: " + (err as Error).message);
    } finally {
      setLoading((prev) => ({ ...prev, content: false }));
    }
  };

  const generateSingleImage = async (index: number) => {
    if (!content.title) return;

    setImages((prev) =>
      prev.map((img, i) =>
        i === index ? { ...img, status: "generating", error: undefined } : img,
      ),
    );
    setError(null);

    try {
      const imageItem = images[index];
      const iscover = imageItem.type === "cover";

      const body = iscover
        ? {
            type: "cover",
            title: content.title,
            style: imageStyle === "random" ? null : imageStyle,
            aspectRatio,
            timestamp,
          }
        : {
            type: "slide",
            index: index - 1,
            slideHeading: content.slides[index - 1]?.heading,
            slideContent: content.slides[index - 1]?.content,
            style: imageStyle === "random" ? null : imageStyle,
            aspectRatio,
            timestamp,
          };

      const response = await fetch("/api/instagram/generate-single-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        setImages((prev) =>
          prev.map((img, i) =>
            i === index
              ? {
                  ...img,
                  url: `${data.image.url}?t=${Date.now()}`,
                  filename: data.image.filename,
                  status: "done",
                }
              : img,
          ),
        );
        setCurrentImageIndex(index);
      } else {
        setImages((prev) =>
          prev.map((img, i) =>
            i === index ? { ...img, status: "error", error: data.error } : img,
          ),
        );
        if (data.retryable) {
          setError(data.error);
        }
      }
    } catch (err) {
      setImages((prev) =>
        prev.map((img, i) =>
          i === index
            ? { ...img, status: "error", error: (err as Error).message }
            : img,
        ),
      );
    }
  };

  const generateAllPending = async () => {
    for (let i = 0; i < images.length; i++) {
      if (images[i].status === "pending" || images[i].status === "error") {
        await generateSingleImage(i);
        if (i < images.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const openFolder = async () => {
    try {
      const response = await fetch("/api/instagram/open-folder", {
        method: "POST",
      });
      const data = await response.json();
      if (!data.success) {
        setError(data.error || "フォルダを開けませんでした");
      }
    } catch (err) {
      setError("フォルダを開けませんでした: " + (err as Error).message);
    }
  };

  const fullCaption = content.caption
    ? `${content.caption}\n\n${content.hashtags.map((h) => `#${h}`).join(" ")}`
    : "";

  const hashtagsOnly = content.hashtags.map((h) => `#${h}`).join(" ");

  const completedCount = images.filter((img) => img.status === "done").length;
  const isGenerating = images.some((img) => img.status === "generating");
  const allImagesReady = completedCount === images.length && images.length > 0;

  // 認証チェック中
  if (isAuthorized === null) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: appleWebColors.pageBackground }}
      >
        <div
          className="text-[15px]"
          style={{ color: appleWebColors.textSecondary }}
        >
          読み込み中...
        </div>
      </div>
    );
  }

  // 未認証の場合は404風のページを表示
  if (!isAuthorized) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center"
        style={{ backgroundColor: appleWebColors.pageBackground }}
      >
        <h1
          className="text-[96px] font-bold"
          style={{ color: appleWebColors.textTertiary }}
        >
          404
        </h1>
        <p
          className="mt-4 text-[17px]"
          style={{ color: appleWebColors.textSecondary }}
        >
          ページが見つかりません
        </p>
        <a
          href="/"
          className="mt-6 text-[17px] hover:underline"
          style={{ color: systemColors.blue }}
        >
          ホームに戻る
        </a>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1
            className="text-[28px] font-bold"
            style={{ color: appleWebColors.textPrimary }}
          >
            Suptia Instagram 投稿システム
          </h1>
          <p
            className="mt-2 text-[15px]"
            style={{ color: appleWebColors.textSecondary }}
          >
            カルーセル投稿を簡単作成 → そのままInstagramへ
          </p>
        </div>

        {/* Quick Access Buttons - Always Visible */}
        <div className="mx-auto mb-6 flex max-w-md justify-center gap-3">
          <button
            onClick={openFolder}
            className="flex min-h-[48px] items-center gap-2 rounded-[16px] px-5 font-medium text-white shadow-sm transition-all hover:opacity-90"
            style={{ backgroundColor: appleWebColors.textPrimary }}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
              />
            </svg>
            フォルダを開く
          </button>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[48px] items-center gap-2 rounded-[16px] px-5 font-medium text-white shadow-sm transition-all hover:opacity-90"
            style={{ backgroundColor: systemColors.pink }}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Instagramを開く
          </a>
        </div>

        {/* Ready to Post Banner */}
        {allImagesReady && content.caption && (
          <div
            className="mx-auto mb-6 max-w-4xl rounded-[20px] p-6 text-white"
            style={{
              backgroundColor: systemColors.green,
              backdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-2xl">
                  ✅
                </div>
                <div>
                  <h2 className="text-[20px] font-semibold">投稿準備完了！</h2>
                  <p className="text-[13px] text-white/80">
                    画像{completedCount}枚 + キャプション生成済み
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPostGuide(!showPostGuide)}
                className="min-h-[48px] rounded-[16px] bg-white px-6 py-3 text-[15px] font-semibold transition-opacity hover:opacity-90"
                style={{ color: systemColors.green }}
              >
                {showPostGuide ? "閉じる" : "投稿ガイドを見る"}
              </button>
            </div>

            {/* Posting Guide */}
            {showPostGuide && (
              <div
                className="mt-6 rounded-[16px] p-4"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <h3 className="mb-3 text-[17px] font-semibold">
                  📱 Instagramへの投稿手順
                </h3>
                <ol className="space-y-2 text-[13px]">
                  <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-[11px] font-medium">
                      1
                    </span>
                    <span>
                      「フォルダを開く」で画像を確認 →
                      AirDropまたは写真アプリでiPhoneに転送
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-[11px] font-medium">
                      2
                    </span>
                    <span>
                      Instagramアプリで「+」→「投稿」→
                      複数選択で画像を順番に選択
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-[11px] font-medium">
                      3
                    </span>
                    <span>
                      下の「キャプションをコピー」→
                      Instagramのキャプション欄にペースト
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-[11px] font-medium">
                      4
                    </span>
                    <span>投稿！ 🎉</span>
                  </li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div
            className="mx-auto mb-6 max-w-2xl rounded-[16px] p-4"
            style={{
              backgroundColor: "rgba(255, 59, 48, 0.1)",
              color: systemColors.red,
            }}
          >
            <pre className="whitespace-pre-wrap text-[13px]">{error}</pre>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Step 1: Content Settings */}
            <div
              className={`rounded-[20px] p-6 ${liquidGlassClasses.light}`}
              style={{
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: appleWebColors.borderSubtle,
              }}
            >
              <h2
                className="mb-4 flex items-center gap-2 text-[20px] font-semibold"
                style={{ color: appleWebColors.textPrimary }}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold text-white"
                  style={{ backgroundColor: systemColors.purple }}
                >
                  1
                </span>
                コンテンツ設定
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    className="mb-2 block text-[13px] font-medium"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    カテゴリ
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-[16px] px-4 py-2 text-[15px] outline-none transition-all focus:ring-2"
                    style={{
                      backgroundColor: "white",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: appleWebColors.separator,
                      color: appleWebColors.textPrimary,
                    }}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="mb-2 block text-[13px] font-medium"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    スライド枚数
                  </label>
                  <div className="flex gap-2">
                    {SLIDE_COUNTS.map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setSlideCount(count)}
                        className="flex-1 rounded-[16px] py-2 text-[15px] font-medium transition-all"
                        style={{
                          borderWidth: "2px",
                          borderStyle: "solid",
                          borderColor:
                            slideCount === count
                              ? systemColors.purple
                              : appleWebColors.separator,
                          backgroundColor:
                            slideCount === count
                              ? `${systemColors.purple}10`
                              : "white",
                          color:
                            slideCount === count
                              ? systemColors.purple
                              : appleWebColors.textSecondary,
                        }}
                      >
                        {count}枚
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    className="mb-2 block text-[13px] font-medium"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    カスタムトピック（オプション）
                  </label>
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="例: ビタミンDと免疫力の関係"
                    className="w-full rounded-[16px] px-4 py-2 text-[15px] outline-none transition-all focus:ring-2"
                    style={{
                      backgroundColor: "white",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: appleWebColors.separator,
                      color: appleWebColors.textPrimary,
                    }}
                  />
                </div>

                <button
                  onClick={generateContent}
                  disabled={loading.content}
                  className="min-h-[48px] w-full rounded-[16px] px-6 py-3 text-[17px] font-semibold text-white transition-all disabled:opacity-50"
                  style={{ backgroundColor: systemColors.purple }}
                >
                  {loading.content ? (
                    <span className="flex items-center justify-center gap-2">
                      <LoadingSpinner /> コンテンツ生成中...
                    </span>
                  ) : (
                    "コンテンツを生成"
                  )}
                </button>
              </div>
            </div>

            {/* Step 2: Image Settings & Generation */}
            <div
              className={`rounded-[20px] p-6 ${liquidGlassClasses.light}`}
              style={{
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: appleWebColors.borderSubtle,
              }}
            >
              <h2
                className="mb-4 flex items-center gap-2 text-[20px] font-semibold"
                style={{ color: appleWebColors.textPrimary }}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold text-white"
                  style={{ backgroundColor: systemColors.blue }}
                >
                  2
                </span>
                画像生成
                {images.length > 0 && (
                  <span
                    className="ml-2 rounded-full px-3 py-1 text-[13px] font-medium"
                    style={{
                      backgroundColor: allImagesReady
                        ? `${systemColors.green}20`
                        : `${systemColors.blue}20`,
                      color: allImagesReady
                        ? systemColors.green
                        : systemColors.blue,
                    }}
                  >
                    {completedCount} / {images.length}{" "}
                    {allImagesReady ? "✓" : ""}
                  </span>
                )}
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="mb-2 block text-[13px] font-medium"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      スタイル
                    </label>
                    <select
                      value={imageStyle}
                      onChange={(e) => setImageStyle(e.target.value)}
                      className="w-full rounded-[16px] px-4 py-2 text-[15px] outline-none transition-all focus:ring-2"
                      style={{
                        backgroundColor: "white",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: appleWebColors.separator,
                        color: appleWebColors.textPrimary,
                      }}
                    >
                      {IMAGE_STYLES.map((style) => (
                        <option key={style.id} value={style.id}>
                          {style.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className="mb-2 block text-[13px] font-medium"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      アスペクト比
                    </label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="w-full rounded-[16px] px-4 py-2 text-[15px] outline-none transition-all focus:ring-2"
                      style={{
                        backgroundColor: "white",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: appleWebColors.separator,
                        color: appleWebColors.textPrimary,
                      }}
                    >
                      {ASPECT_RATIOS.map((ratio) => (
                        <option key={ratio.id} value={ratio.id}>
                          {ratio.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {images.length > 0 ? (
                  <div className="space-y-2">
                    {images.map((img, index) => (
                      <div
                        key={img.type}
                        className="flex items-center justify-between rounded-[16px] p-3"
                        style={{
                          borderWidth: "1px",
                          borderStyle: "solid",
                          borderColor:
                            img.status === "done"
                              ? systemColors.green
                              : img.status === "error"
                                ? systemColors.red
                                : img.status === "generating"
                                  ? systemColors.blue
                                  : appleWebColors.separator,
                          backgroundColor:
                            img.status === "done"
                              ? `${systemColors.green}10`
                              : img.status === "error"
                                ? `${systemColors.red}10`
                                : img.status === "generating"
                                  ? `${systemColors.blue}10`
                                  : appleWebColors.sectionBackground,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold"
                            style={{
                              backgroundColor: appleWebColors.separator,
                              color: appleWebColors.textPrimary,
                            }}
                          >
                            {index + 1}
                          </span>
                          <span
                            className="text-[13px] font-medium"
                            style={{ color: appleWebColors.textPrimary }}
                          >
                            {img.type === "cover"
                              ? "表紙"
                              : `スライド ${index}`}
                          </span>
                          {img.status === "done" && (
                            <span style={{ color: systemColors.green }}>✓</span>
                          )}
                          {img.status === "generating" && (
                            <LoadingSpinner small />
                          )}
                        </div>
                        <button
                          onClick={() => generateSingleImage(index)}
                          disabled={img.status === "generating" || isGenerating}
                          className="rounded-[12px] px-3 py-1 text-[13px] font-medium transition-all disabled:opacity-50"
                          style={{
                            backgroundColor:
                              img.status === "done"
                                ? appleWebColors.separator
                                : img.status === "error"
                                  ? systemColors.red
                                  : img.status === "generating"
                                    ? `${systemColors.blue}50`
                                    : systemColors.blue,
                            color:
                              img.status === "done"
                                ? appleWebColors.textSecondary
                                : "white",
                          }}
                        >
                          {img.status === "generating"
                            ? "生成中..."
                            : img.status === "done"
                              ? "再生成"
                              : img.status === "error"
                                ? "リトライ"
                                : "生成"}
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={generateAllPending}
                      disabled={isGenerating || allImagesReady}
                      className="min-h-[48px] w-full rounded-[16px] px-4 py-3 text-[17px] font-semibold text-white transition-all disabled:opacity-50"
                      style={{ backgroundColor: systemColors.blue }}
                    >
                      {isGenerating
                        ? "生成中..."
                        : allImagesReady
                          ? "✓ 全画像完了"
                          : `残り${images.length - completedCount}枚を一括生成`}
                    </button>
                  </div>
                ) : (
                  <p
                    className="py-4 text-center text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    先にコンテンツを生成してください
                  </p>
                )}
              </div>
            </div>

            {/* Step 3: Post to Instagram */}
            {allImagesReady && content.caption && (
              <div
                className={`rounded-[20px] p-6 ${liquidGlassClasses.light}`}
                style={{
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderColor: systemColors.green,
                }}
              >
                <h2
                  className="mb-4 flex items-center gap-2 text-[20px] font-semibold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold text-white"
                    style={{ backgroundColor: systemColors.green }}
                  >
                    3
                  </span>
                  Instagram投稿
                </h2>

                <div className="space-y-3">
                  {/* Open Folder & Instagram Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={openFolder}
                      className="flex min-h-[48px] items-center justify-center gap-2 rounded-[16px] px-4 py-3 font-semibold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: appleWebColors.textPrimary }}
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                        />
                      </svg>
                      フォルダを開く
                    </button>
                    <a
                      href="https://www.instagram.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[48px] items-center justify-center gap-2 rounded-[16px] px-4 py-3 font-semibold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: systemColors.pink }}
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      Instagramを開く
                    </a>
                  </div>

                  {/* Copy Caption */}
                  <button
                    onClick={() => copyToClipboard(fullCaption, "caption")}
                    className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[16px] px-4 py-3 font-semibold transition-all"
                    style={{
                      backgroundColor:
                        copied === "caption"
                          ? systemColors.green
                          : systemColors.pink,
                      color: "white",
                    }}
                  >
                    {copied === "caption" ? (
                      <>✓ コピー済み！</>
                    ) : (
                      <>
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                        キャプション + ハッシュタグをコピー
                      </>
                    )}
                  </button>

                  {/* Copy Hashtags Only */}
                  <button
                    onClick={() => copyToClipboard(hashtagsOnly, "hashtags")}
                    className="flex w-full items-center justify-center gap-2 rounded-[16px] px-4 py-2 text-[13px] font-medium transition-all"
                    style={{
                      backgroundColor:
                        copied === "hashtags"
                          ? `${systemColors.green}20`
                          : `${systemColors.blue}20`,
                      color:
                        copied === "hashtags"
                          ? systemColors.green
                          : systemColors.blue,
                    }}
                  >
                    {copied === "hashtags"
                      ? "✓ コピー済み"
                      : `ハッシュタグのみコピー（${content.hashtags.length}個）`}
                  </button>
                </div>

                <p
                  className="mt-4 text-center text-[11px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  💡 画像をAirDropでiPhoneに転送 → Instagramアプリで投稿
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            {/* Image Preview */}
            <div
              className={`rounded-[20px] p-6 ${liquidGlassClasses.light}`}
              style={{
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: appleWebColors.borderSubtle,
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2
                  className="flex items-center gap-2 text-[20px] font-semibold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  プレビュー
                  {completedCount > 0 && (
                    <span
                      className="rounded-full px-3 py-1 text-[13px] font-medium"
                      style={{
                        backgroundColor: `${systemColors.blue}20`,
                        color: systemColors.blue,
                      }}
                    >
                      {currentImageIndex + 1} / {images.length}
                    </span>
                  )}
                </h2>
              </div>

              <div
                className="relative aspect-square overflow-hidden rounded-[16px]"
                style={{ backgroundColor: appleWebColors.sectionBackground }}
              >
                {images[currentImageIndex]?.url ? (
                  <>
                    <Image
                      src={images[currentImageIndex].url}
                      alt={`Slide ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setCurrentImageIndex((prev) =>
                              prev === 0 ? images.length - 1 : prev - 1,
                            )
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 shadow-lg transition-all hover:opacity-90"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(10px)",
                          }}
                        >
                          ←
                        </button>
                        <button
                          onClick={() =>
                            setCurrentImageIndex((prev) =>
                              prev === images.length - 1 ? 0 : prev + 1,
                            )
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 shadow-lg transition-all hover:opacity-90"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(10px)",
                          }}
                        >
                          →
                        </button>
                      </>
                    )}
                    <div
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[13px] text-white"
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      {currentImageIndex + 1}.{" "}
                      {images[currentImageIndex].type === "cover"
                        ? "表紙"
                        : images[currentImageIndex].type}
                    </div>
                  </>
                ) : (
                  <div
                    className="flex h-full items-center justify-center"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    <div className="text-center">
                      <span className="text-6xl">📷</span>
                      <p className="mt-2 text-[15px]">
                        画像がここに表示されます
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Image Thumbnails with Order */}
              {images.length > 0 && (
                <div className="mt-4">
                  <p
                    className="mb-2 text-[11px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    投稿順序（左から右）
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                      <button
                        key={img.type}
                        onClick={() => setCurrentImageIndex(index)}
                        className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-[12px]"
                        style={{
                          borderWidth: "2px",
                          borderStyle: "solid",
                          borderColor:
                            currentImageIndex === index
                              ? systemColors.blue
                              : "transparent",
                          backgroundColor: !img.url
                            ? appleWebColors.separator
                            : "transparent",
                        }}
                      >
                        {img.url ? (
                          <Image
                            src={img.url}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div
                            className="flex h-full items-center justify-center text-[11px]"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            {img.status === "generating" ? (
                              <LoadingSpinner small />
                            ) : img.status === "error" ? (
                              "!"
                            ) : (
                              ""
                            )}
                          </div>
                        )}
                        <div
                          className="absolute bottom-0 left-0 right-0 py-0.5 text-center text-[11px] text-white"
                          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                        >
                          {index + 1}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Caption Preview */}
            <div
              className={`rounded-[20px] p-6 ${liquidGlassClasses.light}`}
              style={{
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: appleWebColors.borderSubtle,
              }}
            >
              <h2
                className="mb-4 flex items-center gap-2 text-[20px] font-semibold"
                style={{ color: appleWebColors.textPrimary }}
              >
                キャプション
                {content.category && (
                  <span
                    className="rounded-full px-3 py-1 text-[13px] font-medium"
                    style={{
                      backgroundColor: `${systemColors.purple}20`,
                      color: systemColors.purple,
                    }}
                  >
                    {content.category}
                  </span>
                )}
              </h2>

              {content.caption ? (
                <div className="space-y-4">
                  <div
                    className="rounded-[16px] p-4"
                    style={{
                      backgroundColor: appleWebColors.sectionBackground,
                    }}
                  >
                    <div
                      className="whitespace-pre-wrap text-[13px]"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {content.caption}
                    </div>
                    <div
                      className="mt-3 flex flex-wrap gap-1 pt-3"
                      style={{
                        borderTopWidth: "1px",
                        borderTopStyle: "solid",
                        borderTopColor: appleWebColors.separator,
                      }}
                    >
                      {content.hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-[8px] px-2 py-0.5 text-[11px]"
                          style={{
                            backgroundColor: `${systemColors.blue}20`,
                            color: systemColors.blue,
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="flex min-h-[100px] items-center justify-center"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  <p className="text-[15px]">
                    コンテンツを生成するとキャプションが表示されます
                  </p>
                </div>
              )}
            </div>

            {/* Slide Content Reference */}
            {content.slides.length > 0 && (
              <div
                className={`rounded-[20px] p-6 ${liquidGlassClasses.light}`}
                style={{
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: appleWebColors.borderSubtle,
                }}
              >
                <h2
                  className="mb-4 text-[20px] font-semibold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  スライド内容（参考）
                </h2>
                <div className="space-y-2 text-[13px]">
                  <div
                    className="rounded-[16px] p-3"
                    style={{
                      backgroundColor: `${systemColors.purple}15`,
                    }}
                  >
                    <span
                      className="font-bold"
                      style={{ color: systemColors.purple }}
                    >
                      表紙:
                    </span>{" "}
                    <span style={{ color: appleWebColors.textPrimary }}>
                      {content.title}
                    </span>
                  </div>
                  {content.slides.map((slide, index) => (
                    <div
                      key={index}
                      className="rounded-[16px] p-3"
                      style={{
                        backgroundColor: appleWebColors.sectionBackground,
                      }}
                    >
                      <span
                        className="font-bold"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {index + 1}. {slide.heading}
                      </span>
                      <p
                        className="mt-1"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        {slide.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner({ small }: { small?: boolean }) {
  return (
    <svg
      className={`animate-spin ${small ? "h-4 w-4" : "h-5 w-5"}`}
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
