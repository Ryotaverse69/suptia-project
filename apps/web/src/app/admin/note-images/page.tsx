"use client";

/**
 * note記事用画像生成ページ
 * Gemini 3 Pro Image Previewで画像を直接生成
 */

import { useState, useCallback, useEffect } from "react";
import {
  Image as ImageIcon,
  Copy,
  Check,
  Sparkles,
  FileText,
  Palette,
  ChevronDown,
  ChevronUp,
  Download,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// 成分別カラーガイド
const INGREDIENT_COLORS: Record<
  string,
  { color: string; hex: string; image: string }
> = {
  "vitamin-d": { color: "Yellow", hex: "#FFD60A", image: "太陽、光、日光浴" },
  "vitamin-c": {
    color: "Orange",
    hex: "#FF9500",
    image: "オレンジ、柑橘類、レモン",
  },
  "vitamin-b": {
    color: "Green",
    hex: "#34C759",
    image: "エネルギー、活力、葉野菜",
  },
  omega3: { color: "Blue", hex: "#007AFF", image: "海、魚、波" },
  magnesium: { color: "Cyan", hex: "#32ADE6", image: "ミネラル、水、結晶" },
  zinc: { color: "Gray", hex: "#8E8E93", image: "金属、シールド、防御" },
  iron: { color: "Red", hex: "#FF3B30", image: "血液、活力、エネルギー" },
  protein: { color: "Purple", hex: "#AF52DE", image: "筋肉、パワー、強さ" },
  creatine: { color: "Purple", hex: "#AF52DE", image: "筋肉、パワー、運動" },
  collagen: { color: "Pink", hex: "#FF6B9D", image: "美容、肌、輝き" },
  probiotics: {
    color: "Green",
    hex: "#34C759",
    image: "腸内環境、バクテリア、健康",
  },
  nmn: { color: "Violet", hex: "#BF5AF2", image: "若返り、先進的、DNA" },
  "mct-oil": {
    color: "Yellow",
    hex: "#FBBF24",
    image: "エネルギー、ケトン、油",
  },
  ashwagandha: {
    color: "Earth",
    hex: "#A78B5C",
    image: "ハーブ、自然、リラックス",
  },
  general: { color: "Blue", hex: "#007AFF", image: "健康、科学、データ" },
};

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
  preview: string; // Tailwind gradient for preview
}

const DESIGN_STYLES: DesignStyleOption[] = [
  {
    id: "dark-premium",
    name: "ダークプレミアム",
    description: "ダークグラデーション、3D風、グロー効果",
    preview: "from-slate-900 via-purple-900 to-slate-900",
  },
  {
    id: "minimal-clean",
    name: "ミニマルクリーン",
    description: "白背景、フラットデザイン、Apple風",
    preview: "from-gray-50 via-white to-gray-100",
  },
  {
    id: "vector-flat",
    name: "ベクターフラット",
    description: "フラットイラスト、幾何学的、ポップ",
    preview: "from-violet-100 via-pink-50 to-orange-100",
  },
  {
    id: "infographic",
    name: "インフォグラフィック",
    description: "データビジュアル、図解風、モダン",
    preview: "from-blue-50 via-indigo-50 to-purple-50",
  },
];

// 画像タイプ
type ImageType = "eyecatch" | "insert-5axis" | "insert-cospa" | "insert-custom";

interface ImageTypeOption {
  id: ImageType;
  name: string;
  description: string;
  size: string;
  apiType: "eyecatch" | "insert";
}

const IMAGE_TYPES: ImageTypeOption[] = [
  {
    id: "eyecatch",
    name: "アイキャッチ",
    description: "記事のサムネイル・OGP用",
    size: "1280×670px",
    apiType: "eyecatch",
  },
  {
    id: "insert-5axis",
    name: "5つの評価軸",
    description: "サプティアの評価軸を示すアイコン図",
    size: "1200×630px",
    apiType: "insert",
  },
  {
    id: "insert-cospa",
    name: "コスパ計算",
    description: "¥/mg計算の概念図",
    size: "1200×630px",
    apiType: "insert",
  },
  {
    id: "insert-custom",
    name: "カスタム",
    description: "自由に内容を指定",
    size: "1200×630px",
    apiType: "insert",
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
  const [articleTitle, setArticleTitle] = useState("");
  const [selectedIngredient, setSelectedIngredient] =
    useState<string>("general");
  const [selectedImageType, setSelectedImageType] =
    useState<ImageType>("eyecatch");
  const [selectedStyle, setSelectedStyle] =
    useState<DesignStyle>("dark-premium");
  const [customContent, setCustomContent] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAllPrompts, setShowAllPrompts] = useState(false);

  // 画像生成状態
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

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

  // スタイル別のプロンプト設定
  const getStylePrompt = (
    style: DesignStyle,
    ingredient: { color: string; hex: string; image: string },
  ) => {
    switch (style) {
      case "dark-premium":
        return {
          background: `Dark gradient background (deep navy #0f172a to ${ingredient.hex}40)`,
          visualStyle: `
- Bold, vibrant ${ingredient.color.toLowerCase()} gradient background (dark to light, diagonal)
- Central 3D-style floating object with depth
- Glowing rim light effect around main subject (${ingredient.hex} glow)
- Subtle particle/bokeh effects in background for depth
- Glass morphism accent elements (frosted glass shapes)`,
          colorPalette: `
- Primary: ${ingredient.hex} (saturated, bold)
- Background gradient: Dark (#1a1a2e) to ${ingredient.hex}
- Accent glow: White and ${ingredient.hex} light effects
- Contrast: Deep shadows for dramatic depth`,
          lighting: `
- Strong directional light from top-right
- Rim lighting on main subject edges
- Ambient glow creating premium feel
- High dynamic range look`,
          mood: "Premium, trustworthy, modern, eye-catching, professional yet bold",
          avoid:
            "Any text, Japanese characters, logos, cluttered busy backgrounds, flat boring design, realistic pill photos, cartoonish cheap look, white backgrounds",
        };
      case "minimal-clean":
        return {
          background: "Clean white or very light gray (#F5F5F7) background",
          visualStyle: `
- Apple-inspired minimalist design
- Soft gradient background (white to light ${ingredient.color.toLowerCase()})
- Clean, simple 2D vector-style illustrations
- Subtle shadows for depth (no harsh shadows)
- Plenty of white space and breathing room
- Flat design with gentle color accents`,
          colorPalette: `
- Primary: ${ingredient.hex} (as accent only)
- Background: #FFFFFF to #F5F5F7 gradient
- Secondary: Light gray (#E5E5E5) for subtle elements
- Text-safe: High contrast areas for potential overlays`,
          lighting: `
- Soft, diffused ambient lighting
- Minimal shadows (soft drop shadows only)
- Even illumination across the image
- Clean, professional look`,
          mood: "Clean, professional, trustworthy, scientific, Apple-style elegant",
          avoid:
            "Dark backgrounds, neon glows, 3D effects, busy patterns, heavy shadows, cluttered elements",
        };
      case "vector-flat":
        return {
          background:
            "Soft gradient background (light purple #F5F3FF to light pink #FDF2F8)",
          visualStyle: `
- Modern flat vector illustration style
- Clean geometric shapes and simple forms
- Bold, vibrant colors with no gradients on objects
- 2D flat design with layered elements
- Stylized icons and characters
- Playful yet professional aesthetic
- Sharp edges with rounded corners`,
          colorPalette: `
- Primary: ${ingredient.hex} (bold, saturated)
- Background: Light gradient (#F5F3FF to #FDF2F8)
- Accents: Vibrant pink (#EC4899), purple (#8B5CF6), orange (#F97316)
- Contrast: Clean white and dark gray (#1F2937) for balance`,
          lighting: `
- Flat lighting with no realistic shadows
- Simple drop shadows or none
- Even color distribution
- Crisp, clean edges`,
          mood: "Modern, playful, approachable, trendy, eye-catching, professional",
          avoid:
            "Realistic photos, 3D effects, complex gradients, dark backgrounds, cluttered details, realistic shadows",
        };
      case "infographic":
        return {
          background:
            "Light gradient background (#F8FAFC to #EEF2FF) for data clarity",
          visualStyle: `
- Modern infographic style
- Clean data visualization elements
- Geometric shapes and icons
- Clear visual hierarchy
- Bold color blocks for information
- Professional chart/diagram aesthetic`,
          colorPalette: `
- Primary: ${ingredient.hex} (bold, clear)
- Background: Light (#F8FAFC to #E0E7FF)
- Data colors: #007AFF, #34C759, #FF9500, #AF52DE, #FF3B30
- Neutral: #64748B for secondary elements`,
          lighting: `
- Flat, even lighting
- No dramatic shadows
- Clear, readable contrast
- Professional presentation style`,
          mood: "Data-driven, clear, professional, informative, modern, trustworthy",
          avoid:
            "Realistic photos, 3D effects, dark backgrounds, decorative elements, busy patterns",
        };
    }
  };

  // プロンプト生成
  const generatePrompt = (type: ImageType): string => {
    const ingredient = INGREDIENT_COLORS[selectedIngredient];
    const topic = articleTitle || "[記事のテーマ]";
    const styleConfig = getStylePrompt(selectedStyle, ingredient);

    switch (type) {
      case "eyecatch":
        return `Create a visually striking hero image for a health supplement article.

Topic: "${topic}"

DESIGN STYLE: ${DESIGN_STYLES.find((s) => s.id === selectedStyle)?.name}

COMPOSITION:
- Strong focal point in center-right area (main visual element)
- Clean left side reserved for text overlay (30% of width)
- Dynamic flow guiding eye from top-left to center
- Main subject: stylized ${ingredient.image} element

VISUAL STYLE:${styleConfig.visualStyle}

COLOR PALETTE:${styleConfig.colorPalette}

LIGHTING:${styleConfig.lighting}

MOOD: ${styleConfig.mood}
Aspect ratio: 1280x670px (wide rectangle)

MUST AVOID: ${styleConfig.avoid}`;

      case "insert-5axis":
        return `Create an infographic showing 5 evaluation pillars for supplement analysis.

DESIGN STYLE: ${DESIGN_STYLES.find((s) => s.id === selectedStyle)?.name}

CONTENT: Five distinct icons in a horizontal arrangement:
1. 💰 Price Analysis - Yen coin or price tag icon
2. 📊 Ingredient Dosage - Measuring beaker with level indicator
3. 💡 Cost Efficiency - Balance scale icon
4. 🔬 Evidence Rating - Microscope or DNA helix
5. 🛡️ Safety Score - Shield with checkmark

VISUAL STYLE:${styleConfig.visualStyle}
- Icons evenly spaced in horizontal row
- Each icon has distinct color: Blue, Green, Orange, Purple, Cyan

COLOR PALETTE:${styleConfig.colorPalette}
- Icon colors: #007AFF, #34C759, #FF9500, #AF52DE, #32ADE6

LIGHTING:${styleConfig.lighting}

LAYOUT:
- Clear horizontal arrangement
- Clean space above and below
- Aspect ratio: 1200x630px

MOOD: ${styleConfig.mood}
AVOID: ${styleConfig.avoid}`;

      case "insert-cospa":
        return `Create a comparison infographic showing cost-efficiency concept.

DESIGN STYLE: ${DESIGN_STYLES.find((s) => s.id === selectedStyle)?.name}

CONCEPT: "Smart Choice vs Standard Choice" visual comparison

LEFT SIDE (Less Efficient):
- Dimmed, less prominent supplement icon
- Muted gray tones
- "X" or minus indicator

RIGHT SIDE (More Efficient - WINNER):
- Highlighted supplement icon
- Vibrant accent color
- Checkmark or crown indicator
- Visual prominence

CENTER:
- Comparison element (arrows or divider)

VISUAL STYLE:${styleConfig.visualStyle}
- Winner side has clear visual prominence
- Loser side is visually receding

COLOR PALETTE:${styleConfig.colorPalette}

LIGHTING:${styleConfig.lighting}

LAYOUT:
- Clear left-right split
- Winner takes 60% visual attention
- Aspect ratio: 1200x630px

MOOD: ${styleConfig.mood}
AVOID: ${styleConfig.avoid}`;

      case "insert-custom":
        return `Create an infographic illustration.

DESIGN STYLE: ${DESIGN_STYLES.find((s) => s.id === selectedStyle)?.name}

CONTENT: ${customContent || "[カスタム内容を入力してください]"}

VISUAL STYLE:${styleConfig.visualStyle}

COLOR PALETTE:${styleConfig.colorPalette}

LIGHTING:${styleConfig.lighting}

COMPOSITION:
- Clear visual hierarchy
- Strong focal point
- Clean space for potential text overlay
- Aspect ratio: 1200x630px

MOOD: ${styleConfig.mood}
AVOID: ${styleConfig.avoid}`;

      default:
        return "";
    }
  };

  // クリップボードにコピー
  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // 画像を生成
  const generateImage = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      let token = accessToken;
      if (!token) {
        token = await getAccessToken();
      }
      if (!token) {
        throw new Error("認証トークンが取得できません。ログインしてください。");
      }

      const currentPrompt = generatePrompt(selectedImageType);
      const imageTypeOption = IMAGE_TYPES.find(
        (t) => t.id === selectedImageType,
      );

      const response = await fetch("/api/note/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: currentPrompt,
          imageType: imageTypeOption?.apiType || "eyecatch",
          articleTitle,
        }),
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
      console.error("Image generation error:", err);
      setError((err as Error).message);
    } finally {
      setIsGenerating(false);
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

  // 現在選択されているプロンプト
  const currentPrompt = generatePrompt(selectedImageType);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">note画像生成</h1>
              <p className="text-gray-500 text-sm">
                Gemini 3 Pro Image Preview で画像を生成
              </p>
            </div>
          </div>

          {/* 記事タイトル入力 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              記事タイトル
            </label>
            <input
              type="text"
              value={articleTitle}
              onChange={(e) => setArticleTitle(e.target.value)}
              placeholder="例: サプリ選びに「根拠」を。サプティア（Suptia）とは"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* 成分選択 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Palette className="w-4 h-4 inline mr-1" />
              成分カラー
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {Object.entries(INGREDIENT_COLORS).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSelectedIngredient(key)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedIngredient === key
                      ? "border-gray-900 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: value.hex }}
                  />
                  <div className="text-xs text-gray-600 truncate">
                    {key === "general"
                      ? "一般"
                      : key === "vitamin-d"
                        ? "ビタミンD"
                        : key === "vitamin-c"
                          ? "ビタミンC"
                          : key === "vitamin-b"
                            ? "ビタミンB"
                            : key === "omega3"
                              ? "オメガ3"
                              : key === "magnesium"
                                ? "Mg"
                                : key === "zinc"
                                  ? "亜鉛"
                                  : key === "iron"
                                    ? "鉄"
                                    : key === "protein"
                                      ? "プロテイン"
                                      : key === "creatine"
                                        ? "クレアチン"
                                        : key === "collagen"
                                          ? "コラーゲン"
                                          : key === "probiotics"
                                            ? "乳酸菌"
                                            : key === "nmn"
                                              ? "NMN"
                                              : key === "mct-oil"
                                                ? "MCT"
                                                : key === "ashwagandha"
                                                  ? "アシュワ"
                                                  : key}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* デザインスタイル選択 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Palette className="w-4 h-4 inline mr-1" />
              デザインスタイル
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DESIGN_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedStyle === style.id
                      ? "border-green-500 ring-2 ring-green-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-full h-8 rounded-md mb-2 bg-gradient-to-r ${style.preview}`}
                  />
                  <div className="font-medium text-gray-900 text-sm">
                    {style.name}
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-2">
                    {style.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 画像タイプ選択 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Sparkles className="w-4 h-4 inline mr-1" />
              画像タイプ
            </label>
            <div className="grid grid-cols-2 gap-3">
              {IMAGE_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedImageType(type.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedImageType === type.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium text-gray-900">{type.name}</div>
                  <div className="text-xs text-gray-500">
                    {type.description}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{type.size}</div>
                </button>
              ))}
            </div>
          </div>

          {/* カスタム内容（カスタムタイプ選択時のみ） */}
          {selectedImageType === "insert-custom" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カスタム内容
              </label>
              <textarea
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                placeholder="例: エビデンスレベルS〜Dを示すピラミッド図。Sが頂点、Dが底辺。"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* 画像生成セクション */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">画像生成</h2>
            <button
              onClick={generateImage}
              disabled={isGenerating}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                isGenerating
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
              <p className="text-gray-600 text-center">
                画像を生成しています...
                <br />
                <span className="text-sm text-gray-500">
                  30秒〜1分程度かかる場合があります
                </span>
              </p>
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
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {generatedImage.filename}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={downloadImage}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
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
            </div>
          )}

          {/* 未生成時の案内 */}
          {!generatedImage && !isGenerating && !error && (
            <div className="p-8 bg-gray-50 rounded-lg text-center">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                上の設定を調整して「画像を生成」ボタンをクリック
              </p>
            </div>
          )}
        </div>

        {/* プロンプト出力 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">生成プロンプト</h2>
            <button
              onClick={() => copyToClipboard(currentPrompt, "main")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                copiedId === "main"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {copiedId === "main" ? (
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
            </button>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-100 whitespace-pre-wrap font-mono">
              {currentPrompt}
            </pre>
          </div>
        </div>

        {/* 全プロンプト表示トグル */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <button
            onClick={() => setShowAllPrompts(!showAllPrompts)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
          >
            <span className="font-medium text-gray-900">
              この記事の全画像プロンプト（{IMAGE_TYPES.length}種類）
            </span>
            {showAllPrompts ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {showAllPrompts && (
            <div className="border-t border-gray-200 divide-y divide-gray-200">
              {IMAGE_TYPES.map((type) => {
                const prompt = generatePrompt(type.id);
                const copyId = `all-${type.id}`;

                return (
                  <div key={type.id} className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {type.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {type.description} ({type.size})
                        </p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(prompt, copyId)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                          copiedId === copyId
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {copiedId === copyId ? (
                          <>
                            <Check className="w-3 h-3" />
                            完了
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            コピー
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                      <pre className="text-xs text-gray-100 whitespace-pre-wrap font-mono max-h-40 overflow-y-auto">
                        {prompt}
                      </pre>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 使い方 */}
        <div className="mt-6 bg-green-50 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-2">使い方</h3>
          <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
            <li>記事タイトルを入力</li>
            <li>成分に合わせたカラーを選択</li>
            <li>画像タイプを選択（アイキャッチ / 挿入画像）</li>
            <li>「画像を生成」ボタンをクリック</li>
            <li>生成された画像をダウンロード</li>
            <li>note記事にアップロード</li>
          </ol>
          <p className="text-xs text-green-600 mt-3">
            ※ 生成には30秒〜1分程度かかる場合があります
            <br />※
            モデルが混雑している場合はエラーが出ることがあります。その場合は再試行してください
          </p>
        </div>
      </div>
    </div>
  );
}
