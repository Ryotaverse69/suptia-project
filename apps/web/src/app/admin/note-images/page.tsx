"use client";

/**
 * note記事用画像生成ページ（シンプル版）
 * デザインスタイルとプロンプトのみ + 画像生成機能
 */

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Image as ImageIcon,
  Copy,
  Check,
  Sparkles,
  Download,
  Loader2,
  AlertCircle,
  RefreshCw,
  Save,
  Square,
  Clipboard,
  ClipboardPaste,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// デザインスタイル
type DesignStyle =
  | "dark-premium"
  | "minimal-clean"
  | "vector-flat"
  | "infographic";

interface DesignStyleOption {
  id: DesignStyle;
  name: string;
  description: string;
  preview: string;
  promptTemplate: string;
}

const DESIGN_STYLES: DesignStyleOption[] = [
  {
    id: "dark-premium",
    name: "ダークプレミアム",
    description: "ダークグラデーション、3D風、グロー効果",
    preview: "from-slate-900 via-purple-900 to-slate-900",
    promptTemplate: `DESIGN STYLE: Dark Premium

VISUAL STYLE:
- Bold, vibrant gradient background (dark navy to accent color)
- Central 3D-style floating object with depth
- Glowing rim light effect around main subject
- Subtle particle/bokeh effects in background
- Glass morphism accent elements

COLOR PALETTE:
- Background: Dark gradient (#1a1a2e to accent)
- Accent glow: White and accent color light effects
- High contrast with deep shadows

LIGHTING:
- Strong directional light from top-right
- Rim lighting on edges
- Ambient glow for premium feel

MOOD: Premium, trustworthy, modern, eye-catching

MUST AVOID: Any text, Japanese characters, logos, cluttered backgrounds, flat design, realistic photos, cartoonish style, white backgrounds`,
  },
  {
    id: "minimal-clean",
    name: "ミニマルクリーン",
    description: "白背景、フラットデザイン、Apple風",
    preview: "from-gray-50 via-white to-gray-100",
    promptTemplate: `DESIGN STYLE: Minimal Clean (Apple-inspired)

VISUAL STYLE:
- Clean white or light gray (#F5F5F7) background
- Simple 2D vector-style illustrations
- Subtle shadows for depth (soft drop shadows only)
- Plenty of white space
- Flat design with gentle color accents

COLOR PALETTE:
- Background: #FFFFFF to #F5F5F7 gradient
- Accent colors used sparingly
- High contrast for readability

LIGHTING:
- Soft, diffused ambient lighting
- Minimal shadows
- Even illumination
- Clean, professional look

MOOD: Clean, professional, trustworthy, elegant

MUST AVOID: Dark backgrounds, neon glows, 3D effects, busy patterns, heavy shadows, cluttered elements, text`,
  },
  {
    id: "vector-flat",
    name: "ベクターフラット",
    description: "フラットイラスト、幾何学的、ポップ",
    preview: "from-violet-100 via-pink-50 to-orange-100",
    promptTemplate: `DESIGN STYLE: Vector Flat

VISUAL STYLE:
- Modern flat vector illustration
- Clean geometric shapes and simple forms
- Bold, vibrant colors with no gradients on objects
- 2D flat design with layered elements
- Stylized icons
- Sharp edges with rounded corners

COLOR PALETTE:
- Background: Light gradient (#F5F3FF to #FDF2F8)
- Accents: Vibrant pink (#EC4899), purple (#8B5CF6), orange (#F97316)
- Clean white and dark gray for balance

LIGHTING:
- Flat lighting with no realistic shadows
- Simple drop shadows or none
- Even color distribution
- Crisp, clean edges

MOOD: Modern, playful, approachable, trendy

MUST AVOID: Realistic photos, 3D effects, complex gradients, dark backgrounds, text, Japanese characters`,
  },
  {
    id: "infographic",
    name: "インフォグラフィック",
    description: "データビジュアル、図解風、モダン",
    preview: "from-blue-50 via-indigo-50 to-purple-50",
    promptTemplate: `DESIGN STYLE: Infographic

VISUAL STYLE:
- Modern infographic style
- Clean data visualization elements
- Geometric shapes and icons
- Clear visual hierarchy
- Bold color blocks
- Professional chart/diagram aesthetic

COLOR PALETTE:
- Background: Light (#F8FAFC to #E0E7FF)
- Data colors: #007AFF, #34C759, #FF9500, #AF52DE, #FF3B30
- Neutral: #64748B for secondary elements

LIGHTING:
- Flat, even lighting
- No dramatic shadows
- Clear, readable contrast

MOOD: Data-driven, clear, professional, informative

MUST AVOID: Realistic photos, 3D effects, dark backgrounds, decorative elements, text, any writing`,
  },
];

// 生成された画像の型
interface GeneratedImage {
  url: string;
  filename: string;
  type: string;
  size: string;
}

export default function NoteImagesAdminPage() {
  const [selectedStyle, setSelectedStyle] =
    useState<DesignStyle>("dark-premium");
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);

  // 画像生成状態
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // 生成中止用のAbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  // テキストエリアのref
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // アクセストークンを取得
  const getAccessToken = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        setAccessToken(session.access_token);
        return session.access_token;
      }
      return null;
    } catch (err) {
      console.error("Failed to get access token:", err);
      return null;
    }
  }, []);

  // 初回ロード時にトークンを取得
  useEffect(() => {
    getAccessToken();
  }, [getAccessToken]);

  // 選択されたスタイルのテンプレートを取得
  const selectedStyleData = DESIGN_STYLES.find((s) => s.id === selectedStyle);

  // フルプロンプトを生成
  const fullPrompt = prompt
    ? `${prompt}

${selectedStyleData?.promptTemplate || ""}

Aspect ratio: 1280x670px (wide rectangle for hero image)`
    : "";

  // クリップボードにコピー
  const copyToClipboard = async () => {
    if (!fullPrompt) return;
    try {
      await navigator.clipboard.writeText(fullPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // クリップボードから貼り付け（1クリック）
  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setPrompt(text);
      }
    } catch (err) {
      console.error("Failed to paste:", err);
      // フォールバック: テキストエリアにフォーカス
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  // プロンプトをクリア
  const clearPrompt = () => {
    setPrompt("");
  };

  // 画像を生成
  const generateImage = async () => {
    if (!fullPrompt) return;

    // 前回のリクエストがあればキャンセル
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 新しいAbortControllerを作成
    abortControllerRef.current = new AbortController();

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    setSaved(false);
    setImageCopied(false);

    try {
      let token = accessToken;
      if (!token) {
        token = await getAccessToken();
      }
      if (!token) {
        throw new Error("認証トークンが取得できません。ログインしてください。");
      }

      const response = await fetch("/api/note/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          imageType: "eyecatch",
          articleTitle: prompt.slice(0, 50),
        }),
        signal: abortControllerRef.current.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "画像生成に失敗しました");
      }

      if (data.success && data.image) {
        setGeneratedImage(data.image);
      } else {
        throw new Error(data.error || "画像が生成されませんでした");
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        setError("生成を中止しました");
      } else {
        console.error("Image generation error:", err);
        setError((err as Error).message);
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  // 生成を中止
  const abortGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // 画像をダウンロード
  const downloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.href = generatedImage.url;
    link.download = generatedImage.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 画像をクリップボードにコピー
  const copyImageToClipboard = async () => {
    if (!generatedImage) return;

    try {
      // Base64データURLからBlobを作成
      const response = await fetch(generatedImage.url);
      const blob = await response.blob();

      // ClipboardItemを作成してコピー
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      setImageCopied(true);
      setTimeout(() => setImageCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy image:", err);
      // フォールバック: URLをコピー
      try {
        await navigator.clipboard.writeText(generatedImage.url);
        setImageCopied(true);
        setTimeout(() => setImageCopied(false), 2000);
      } catch {
        setError("画像のコピーに失敗しました");
      }
    }
  };

  // 画像を保存（ローカルストレージ）
  const saveImage = () => {
    if (!generatedImage) return;

    try {
      // 保存済み画像のリストを取得
      const savedImagesJson = localStorage.getItem("note-saved-images");
      const savedImages: GeneratedImage[] = savedImagesJson
        ? JSON.parse(savedImagesJson)
        : [];

      // 重複チェック
      if (
        !savedImages.some((img) => img.filename === generatedImage.filename)
      ) {
        savedImages.unshift(generatedImage);
        // 最大20件まで保存
        if (savedImages.length > 20) {
          savedImages.pop();
        }
        localStorage.setItem("note-saved-images", JSON.stringify(savedImages));
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save image:", err);
      setError("画像の保存に失敗しました");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">note画像生成</h1>
            <p className="text-gray-500 text-sm">
              プロンプトを生成してAIで画像作成
            </p>
          </div>
        </div>

        {/* デザインスタイル選択 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Sparkles className="w-4 h-4 inline mr-1" />
            デザインスタイル
          </label>
          <div className="grid grid-cols-2 gap-3">
            {DESIGN_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedStyle === style.id
                    ? "border-green-500 ring-2 ring-green-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-full h-10 rounded-md mb-2 bg-gradient-to-r ${style.preview}`}
                />
                <div className="font-medium text-gray-900">{style.name}</div>
                <div className="text-xs text-gray-500">{style.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* プロンプト入力 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              プロンプト（何を描くか）
            </label>
            {prompt && (
              <button
                onClick={clearPrompt}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                title="プロンプトをクリア"
              >
                <Trash2 className="w-4 h-4" />
                クリア
              </button>
            )}
          </div>
          {/* 貼り付けボタン（プロンプトが空の時に大きく表示） */}
          {!prompt && (
            <button
              onClick={pasteFromClipboard}
              className="w-full mb-3 flex items-center justify-center gap-2 px-6 py-4 text-lg font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-md hover:shadow-lg"
            >
              <ClipboardPaste className="w-6 h-6" />
              貼り付け
            </button>
          )}
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="プロンプトを入力..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">
            ※ 英語で入力すると精度が上がります
          </p>
        </div>

        {/* 出力（折りたたみ可能） */}
        {fullPrompt && (
          <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
            <button
              onClick={() => setIsPromptExpanded(!isPromptExpanded)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  生成プロンプト
                </span>
                <span className="text-xs text-gray-400">
                  ({fullPrompt.length}文字)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard();
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg font-medium transition ${
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      コピー完了
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      コピー
                    </>
                  )}
                </span>
                {isPromptExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>
            {isPromptExpanded && (
              <div className="px-6 pb-6">
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto max-h-48 overflow-y-auto">
                  <pre className="text-sm text-gray-100 whitespace-pre-wrap font-mono">
                    {fullPrompt}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 画像生成セクション */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">画像生成</h2>
            <button
              onClick={generateImage}
              disabled={isGenerating || !fullPrompt}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                isGenerating || !fullPrompt
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl"
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  画像を生成
                </>
              )}
            </button>
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-700 text-sm whitespace-pre-wrap">
                  {error}
                </p>
                <button
                  onClick={generateImage}
                  className="mt-2 text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  再試行
                </button>
              </div>
            </div>
          )}

          {/* 生成中の表示 */}
          {isGenerating && (
            <div className="p-8 bg-gray-50 rounded-lg flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
              <p className="text-gray-600 text-center mb-4">
                画像を生成しています...
                <br />
                <span className="text-sm text-gray-500">
                  30秒〜1分程度かかる場合があります
                </span>
              </p>
              <button
                onClick={abortGeneration}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
              >
                <Square className="w-4 h-4" />
                生成を中止
              </button>
            </div>
          )}

          {/* 生成された画像 */}
          {generatedImage && !isGenerating && (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={generatedImage.url}
                  alt="Generated image"
                  className="w-full h-auto"
                />
              </div>
              <div className="text-sm text-gray-500 mb-2">
                {generatedImage.filename}
              </div>
              {/* アクションボタン */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={saveImage}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    saved
                      ? "bg-green-500 text-white"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {saved ? (
                    <>
                      <Check className="w-4 h-4" />
                      保存済み
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      保存
                    </>
                  )}
                </button>
                <button
                  onClick={copyImageToClipboard}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    imageCopied
                      ? "bg-purple-500 text-white"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
                >
                  {imageCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      コピー済み
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-4 h-4" />
                      コピー
                    </>
                  )}
                </button>
                <button
                  onClick={downloadImage}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                >
                  <Download className="w-4 h-4" />
                  ダウンロード
                </button>
                <button
                  onClick={generateImage}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  再生成
                </button>
              </div>
            </div>
          )}

          {/* 未生成時の案内 */}
          {!generatedImage && !isGenerating && !error && (
            <div className="p-8 bg-gray-50 rounded-lg text-center">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {fullPrompt
                  ? "「画像を生成」ボタンをクリック"
                  : "プロンプトを入力してください"}
              </p>
            </div>
          )}
        </div>

        {/* 使い方 */}
        <div className="bg-green-50 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-2">使い方</h3>
          <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
            <li>デザインスタイルを選択</li>
            <li>プロンプト（画像の内容）を入力</li>
            <li>「画像を生成」ボタンをクリック</li>
            <li>生成された画像をダウンロード</li>
          </ol>
          <p className="text-xs text-green-600 mt-3">
            ※ プロンプトをコピーして
            <a
              href="https://aistudio.google.com/prompts/new_chat"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-green-700 ml-1"
            >
              Google AI Studio
            </a>
            で生成することもできます
          </p>
        </div>
      </div>
    </div>
  );
}
