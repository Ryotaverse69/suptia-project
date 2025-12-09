"use client";

import { useState } from "react";
import Image from "next/image";

interface SlideContent {
  heading: string;
  content: string;
}

interface GeneratedContent {
  title: string | null;
  slides: SlideContent[];
  caption: string | null;
  hashtags: string[];
  category: string | null;
  images: { type: string; url: string; filename: string }[];
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

  const [loading, setLoading] = useState({ content: false, images: false });
  const [content, setContent] = useState<GeneratedContent>({
    title: null,
    slides: [],
    caption: null,
    hashtags: [],
    category: null,
    images: [],
  });
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
        setContent((prev) => ({
          ...prev,
          title: data.title,
          slides: data.slides || [],
          caption: data.caption,
          hashtags: data.hashtags || [],
          category: data.category,
        }));
      } else {
        setError(data.error || "コンテンツ生成に失敗しました");
      }
    } catch (err) {
      setError("エラーが発生しました: " + (err as Error).message);
    } finally {
      setLoading((prev) => ({ ...prev, content: false }));
    }
  };

  // Step 2: 画像を生成（コンテンツに基づいて）
  const generateImages = async () => {
    if (!content.title || content.slides.length === 0) {
      setError("先にコンテンツを生成してください");
      return;
    }

    setLoading((prev) => ({ ...prev, images: true }));
    setError(null);

    try {
      const response = await fetch("/api/instagram/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style: imageStyle === "random" ? null : imageStyle,
          aspectRatio,
          title: content.title,
          slides: content.slides,
          generateCover: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setContent((prev) => ({
          ...prev,
          images: data.images || [],
        }));
        setCurrentImageIndex(0);
      } else {
        setError(data.error || "画像生成に失敗しました");
      }
    } catch (err) {
      setError("エラーが発生しました: " + (err as Error).message);
    } finally {
      setLoading((prev) => ({ ...prev, images: false }));
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
    content.images.forEach((img, index) => {
      setTimeout(() => downloadImage(img.url, img.filename), index * 500);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Instagram カルーセル投稿ジェネレーター
          </h1>
          <p className="mt-2 text-gray-600">
            表紙 + 内容スライド + キャプションを自動生成
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-auto mb-6 max-w-2xl rounded-lg bg-red-50 p-4 text-red-700">
            {error}
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

            {/* Step 2: Image Settings */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  2
                </span>
                画像設定
              </h2>

              <div className="space-y-4">
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
                  <div className="grid grid-cols-3 gap-2">
                    {ASPECT_RATIOS.map((ratio) => (
                      <button
                        key={ratio.id}
                        type="button"
                        onClick={() => setAspectRatio(ratio.id)}
                        className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all ${
                          aspectRatio === ratio.id
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <div>{ratio.name}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          {ratio.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={generateImages}
                  disabled={loading.images || !content.title}
                  className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50"
                >
                  {loading.images ? (
                    <span className="flex items-center justify-center gap-2">
                      <LoadingSpinner /> 画像生成中（{content.slides.length + 1}
                      枚）...
                    </span>
                  ) : (
                    `画像を生成（表紙 + ${content.slides.length}枚）`
                  )}
                </button>
                {!content.title && (
                  <p className="text-center text-sm text-gray-500">
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
                  {content.images.length > 0 && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                      {currentImageIndex + 1} / {content.images.length}
                    </span>
                  )}
                </h2>
                {content.images.length > 0 && (
                  <button
                    onClick={downloadAllImages}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    全画像をダウンロード
                  </button>
                )}
              </div>

              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                {content.images.length > 0 ? (
                  <>
                    <Image
                      src={content.images[currentImageIndex].url}
                      alt={`Slide ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {content.images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setCurrentImageIndex((prev) =>
                              prev === 0 ? content.images.length - 1 : prev - 1,
                            )
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white"
                        >
                          ←
                        </button>
                        <button
                          onClick={() =>
                            setCurrentImageIndex((prev) =>
                              prev === content.images.length - 1 ? 0 : prev + 1,
                            )
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white"
                        >
                          →
                        </button>
                      </>
                    )}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                      {content.images[currentImageIndex].type === "cover"
                        ? "表紙"
                        : content.images[currentImageIndex].type}
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
              {content.images.length > 0 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {content.images.map((img, index) => (
                    <button
                      key={img.filename}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                        currentImageIndex === index
                          ? "border-blue-500"
                          : "border-transparent"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
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

function LoadingSpinner() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
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
