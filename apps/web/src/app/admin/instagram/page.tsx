"use client";

import { useState } from "react";
import Image from "next/image";

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
  { id: "modern-minimal", name: "モダンミニマル" },
  { id: "natural-wellness", name: "ナチュラルウェルネス" },
  { id: "scientific", name: "サイエンティフィック" },
  { id: "lifestyle", name: "ライフスタイル" },
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

export default function InstagramDashboard() {
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

        // 画像リストを初期化
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
      } else {
        setError(data.error || "コンテンツ生成に失敗しました");
      }
    } catch (err) {
      setError("エラーが発生しました: " + (err as Error).message);
    } finally {
      setLoading((prev) => ({ ...prev, content: false }));
    }
  };

  // 1枚の画像を生成
  const generateSingleImage = async (index: number) => {
    if (!content.title) return;

    // ステータスを更新
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
            index: index - 1, // 表紙分を引く
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
                  url: data.image.url,
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

  // 全ての未生成画像を順番に生成
  const generateAllPending = async () => {
    for (let i = 0; i < images.length; i++) {
      if (images[i].status === "pending" || images[i].status === "error") {
        await generateSingleImage(i);
        // 次の画像まで少し待つ（過負荷対策）
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

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = () => {
    const doneImages = images.filter((img) => img.status === "done" && img.url);
    doneImages.forEach((img, index) => {
      setTimeout(() => downloadImage(img.url!, img.filename!), index * 500);
    });
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

  const completedCount = images.filter((img) => img.status === "done").length;
  const isGenerating = images.some((img) => img.status === "generating");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Instagram カルーセル投稿ジェネレーター
          </h1>
          <p className="mt-2 text-gray-600">
            表紙 + 内容スライド + キャプションを自動生成（1枚ずつ生成モード）
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-auto mb-6 max-w-2xl rounded-lg bg-red-50 p-4 text-red-700">
            <pre className="whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Step 1: Content Settings */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                  1
                </span>
                コンテンツ設定
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    カテゴリ
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    スライド枚数
                  </label>
                  <div className="flex gap-2">
                    {SLIDE_COUNTS.map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setSlideCount(count)}
                        className={`flex-1 rounded-lg border-2 py-2 font-medium transition-all ${
                          slideCount === count
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {count}枚
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    カスタムトピック（オプション）
                  </label>
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="例: ビタミンDと免疫力の関係"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <button
                  onClick={generateContent}
                  disabled={loading.content}
                  className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white transition-all hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
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
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  2
                </span>
                画像生成（1枚ずつ）
                {images.length > 0 && (
                  <span className="ml-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                    {completedCount} / {images.length} 完了
                  </span>
                )}
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      スタイル
                    </label>
                    <select
                      value={imageStyle}
                      onChange={(e) => setImageStyle(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      {IMAGE_STYLES.map((style) => (
                        <option key={style.id} value={style.id}>
                          {style.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      アスペクト比
                    </label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      {ASPECT_RATIOS.map((ratio) => (
                        <option key={ratio.id} value={ratio.id}>
                          {ratio.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image List */}
                {images.length > 0 ? (
                  <div className="space-y-2">
                    {images.map((img, index) => (
                      <div
                        key={img.type}
                        className={`flex items-center justify-between rounded-lg border p-3 ${
                          img.status === "done"
                            ? "border-green-200 bg-green-50"
                            : img.status === "error"
                              ? "border-red-200 bg-red-50"
                              : img.status === "generating"
                                ? "border-blue-200 bg-blue-50"
                                : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-700">
                            {img.type === "cover"
                              ? "表紙"
                              : `スライド ${index}`}
                          </span>
                          {img.status === "done" && (
                            <span className="text-green-600">✓</span>
                          )}
                          {img.status === "generating" && (
                            <LoadingSpinner small />
                          )}
                          {img.status === "error" && (
                            <span className="text-xs text-red-600">
                              {img.error?.slice(0, 30)}...
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => generateSingleImage(index)}
                          disabled={img.status === "generating" || isGenerating}
                          className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                            img.status === "done"
                              ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                              : img.status === "error"
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : img.status === "generating"
                                  ? "cursor-not-allowed bg-blue-300 text-white"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                          } disabled:opacity-50`}
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

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={generateAllPending}
                        disabled={
                          isGenerating || completedCount === images.length
                        }
                        className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 font-semibold text-white transition-all hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50"
                      >
                        {isGenerating
                          ? "生成中..."
                          : completedCount === images.length
                            ? "全て完了"
                            : `残り${images.length - completedCount}枚を順番に生成`}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="py-4 text-center text-sm text-gray-500">
                    先にコンテンツを生成してください
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                  画像プレビュー
                  {completedCount > 0 && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                      {currentImageIndex + 1} / {images.length}
                    </span>
                  )}
                </h2>
                {completedCount > 0 && (
                  <button
                    onClick={downloadAllImages}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    完了画像をDL ({completedCount}枚)
                  </button>
                )}
              </div>

              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
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
                          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white"
                        >
                          ←
                        </button>
                        <button
                          onClick={() =>
                            setCurrentImageIndex((prev) =>
                              prev === images.length - 1 ? 0 : prev + 1,
                            )
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white"
                        >
                          →
                        </button>
                      </>
                    )}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                      {images[currentImageIndex].type === "cover"
                        ? "表紙"
                        : images[currentImageIndex].type}
                    </div>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <div className="text-center">
                      <span className="text-6xl">📷</span>
                      <p className="mt-2">画像がここに表示されます</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {images.length > 0 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={img.type}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                        currentImageIndex === index
                          ? "border-blue-500"
                          : "border-transparent"
                      } ${!img.url ? "bg-gray-200" : ""}`}
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
                        <div className="flex h-full items-center justify-center text-xs text-gray-500">
                          {img.status === "generating" ? (
                            <LoadingSpinner small />
                          ) : img.status === "error" ? (
                            "!"
                          ) : (
                            index + 1
                          )}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content Preview */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800">
                コンテンツプレビュー
                {content.category && (
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700">
                    {content.category}
                  </span>
                )}
              </h2>

              {content.title ? (
                <div className="space-y-4">
                  {/* Title */}
                  <div className="rounded-lg bg-purple-50 p-4">
                    <div className="mb-1 text-xs font-medium text-purple-600">
                      表紙タイトル
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {content.title}
                    </div>
                  </div>

                  {/* Slides */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">
                      スライド内容
                    </div>
                    {content.slides.map((slide, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 p-3"
                      >
                        <div className="font-semibold text-gray-800">
                          {index + 1}. {slide.heading}
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          {slide.content}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Caption */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-700">
                        キャプション + ハッシュタグ
                      </div>
                      <button
                        onClick={() => copyToClipboard(fullCaption, "caption")}
                        className={`rounded px-3 py-1 text-sm font-medium ${
                          copied === "caption"
                            ? "bg-green-100 text-green-700"
                            : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        }`}
                      >
                        {copied === "caption" ? "✓ コピー済み" : "コピー"}
                      </button>
                    </div>
                    <div className="whitespace-pre-wrap text-sm text-gray-800">
                      {content.caption}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {content.hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[200px] items-center justify-center text-gray-400">
                  <div className="text-center">
                    <span className="text-4xl">✍️</span>
                    <p className="mt-2">コンテンツがここに表示されます</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={openFolder}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-800"
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
            保存フォルダを開く
          </button>
          <p className="mt-3 text-sm text-gray-500">
            画像は{" "}
            <code className="rounded bg-gray-200 px-2 py-1">
              public/instagram/
            </code>{" "}
            に保存されます
          </p>
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
