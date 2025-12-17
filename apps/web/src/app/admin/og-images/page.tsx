"use client";

/**
 * OGP画像管理ページ
 * 成分・記事・ツールのOGP画像を一括/個別生成
 */

import { useState, useEffect, useRef, useCallback } from "react";
import NextImage from "next/image";
import { createClient } from "@/lib/supabase/client";
import { sanity } from "@/lib/sanity.client";
import { getIngredientOGImage } from "@/lib/og-image";
import {
  Image as ImageIcon,
  Loader2,
  Check,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Palette,
  StopCircle,
  CheckCircle2,
  Search,
} from "lucide-react";

// スタイル定義
const OGP_STYLES = {
  "flat-minimal": {
    name: "フラットミニマル",
    description: "シンプルな2Dベクターアート、クリーンなデザイン",
    colorPalette: "ミントグリーン、ライトブルー、クリームホワイト、コーラル",
    colors: ["#98D8C8", "#7EC8E3", "#FFF8E7", "#FFB5A7"],
    elements: "シンプルな幾何学図形、クリーンなアイコン、角丸",
    recommended: true,
  },
  "modern-health": {
    name: "モダンヘルス",
    description: "プロフェッショナルな健康・ウェルネス系イラスト",
    colorPalette: "ティール、ソフトブルー、ホワイト、ライトグレー",
    colors: ["#20B2AA", "#87CEEB", "#FFFFFF", "#F5F5F5"],
    elements: "医療/健康アイコン、抽象的形状、クリーンなスペース",
    recommended: false,
  },
  "gradient-vibrant": {
    name: "グラデーションビビッド",
    description: "鮮やかなグラデーションと大胆な色使い",
    colorPalette: "パープル、ピンク、オレンジ、イエロー",
    colors: ["#8B5CF6", "#EC4899", "#F97316", "#FBBF24"],
    elements: "流動的グラデーション、動的な形状、モダンな雰囲気",
    recommended: false,
  },
  "organic-botanical": {
    name: "オーガニック・ボタニカル",
    description: "自然派サプリに最適、植物的な雰囲気",
    colorPalette: "リーフグリーン、ベージュ、テラコッタ、クリーム",
    colors: ["#4ADE80", "#D4C5A9", "#C2703E", "#FAF7F0"],
    elements: "葉・植物モチーフ、有機的な形状、ナチュラル感",
    recommended: false,
  },
} as const;

type StyleKey = keyof typeof OGP_STYLES;

interface IngredientItem {
  _id: string;
  name: string;
  nameEn?: string;
  slug: { current: string };
  category?: string;
}

interface GenerationStatus {
  [slug: string]: "pending" | "generating" | "success" | "error" | "exists";
}

interface GeneratedImage {
  slug: string;
  url: string;
  type: string;
}

export default function OGImagesAdminPage() {
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingExisting, setCheckingExisting] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus>({});
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleKey>("flat-minimal");
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  // 生成中止用のref
  const cancelRef = useRef(false);

  // 認証トークン取得
  useEffect(() => {
    async function getToken() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        setToken(session.access_token);
      }
    }
    getToken();
  }, []);

  // 成分一覧取得
  useEffect(() => {
    async function fetchIngredients() {
      try {
        const query = `*[_type == "ingredient" && defined(slug.current)] | order(name asc) {
          _id,
          name,
          nameEn,
          slug,
          category
        }`;
        const data = await sanity.fetch(query);
        setIngredients(data || []);
      } catch (err) {
        console.error("Failed to fetch ingredients:", err);
        setError("成分データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    }
    fetchIngredients();
  }, []);

  // 画像が存在するかチェック（Image要素を使用してCORS回避）
  const checkImageExists = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      // タイムアウト設定（5秒）
      const timeout = setTimeout(() => {
        img.src = "";
        resolve(false);
      }, 5000);
      img.onload = () => {
        clearTimeout(timeout);
        resolve(true);
      };
      img.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };
      img.src = url;
    });
  };

  // 既存OGP画像のチェック
  const checkExistingImages = useCallback(async () => {
    if (ingredients.length === 0) return;

    setCheckingExisting(true);
    setError(null);
    const newStatus: GenerationStatus = {};
    const existingImages: GeneratedImage[] = [];

    // URLがデフォルト画像の場合はCloudinaryが未設定
    const testUrl = getIngredientOGImage("test");
    if (testUrl === "/og-image.png") {
      setError("Cloudinaryが未設定です（NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME）");
      setCheckingExisting(false);
      return;
    }

    // 並列でチェック（5件ずつバッチ処理）
    const batchSize = 5;
    for (let i = 0; i < ingredients.length; i += batchSize) {
      const batch = ingredients.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(async (ingredient) => {
          const slug = ingredient.slug.current;
          const ogUrl = getIngredientOGImage(slug);

          const exists = await checkImageExists(ogUrl);
          return { slug, exists, url: ogUrl };
        }),
      );

      results.forEach((result) => {
        if (result.exists) {
          newStatus[result.slug] = "exists";
          existingImages.push({
            slug: result.slug,
            url: result.url,
            type: "ingredient",
          });
        }
      });

      // 進捗表示のため少し待つ
      setProgress({
        current: Math.min(i + batchSize, ingredients.length),
        total: ingredients.length,
      });
    }

    setStatus(newStatus);
    setGeneratedImages(existingImages);
    setCheckingExisting(false);
    setProgress({ current: 0, total: 0 });
  }, [ingredients]);

  // 生成中止
  const cancelGeneration = useCallback(() => {
    cancelRef.current = true;
  }, []);

  // 単一画像生成
  const generateSingleOG = async (ingredient: IngredientItem) => {
    if (!token) return;

    const slug = ingredient.slug.current;
    setStatus((prev) => ({ ...prev, [slug]: "generating" }));

    try {
      const response = await fetch("/api/og/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "ingredient",
          slug,
          name: ingredient.name,
          nameEn: ingredient.nameEn,
          category: ingredient.category,
          style: selectedStyle,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus((prev) => ({ ...prev, [slug]: "success" }));
        setGeneratedImages((prev) => [
          ...prev,
          { slug, url: data.ogImage.url, type: "ingredient" },
        ]);
      } else {
        setStatus((prev) => ({ ...prev, [slug]: "error" }));
        console.error(`Failed to generate OG for ${slug}:`, data.error);
      }
    } catch (err) {
      setStatus((prev) => ({ ...prev, [slug]: "error" }));
      console.error(`Error generating OG for ${slug}:`, err);
    }
  };

  // 選択項目の一括生成
  const generateSelected = async () => {
    if (selectedItems.size === 0 || !token) return;

    setIsGenerating(true);
    cancelRef.current = false;

    const items = ingredients.filter((i) => selectedItems.has(i.slug.current));
    setProgress({ current: 0, total: items.length });

    for (let i = 0; i < items.length; i++) {
      // 中止チェック
      if (cancelRef.current) {
        console.log("Generation cancelled by user");
        break;
      }

      await generateSingleOG(items[i]);
      setProgress({ current: i + 1, total: items.length });

      // APIレート制限対策（最後の1件は待たない）
      if (i < items.length - 1 && !cancelRef.current) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    setIsGenerating(false);
    cancelRef.current = false;
  };

  // 全選択/解除
  const toggleSelectAll = () => {
    if (selectedItems.size === ingredients.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(ingredients.map((i) => i.slug.current)));
    }
  };

  // 個別選択
  const toggleSelect = (slug: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(slug)) {
      newSelected.delete(slug);
    } else {
      newSelected.add(slug);
    }
    setSelectedItems(newSelected);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  OGP画像管理
                </h1>
                <p className="text-gray-500 text-sm">
                  成分・記事・ツールのOGP画像を生成
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* スタイル選択 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-5 h-5 text-purple-500" />
              <h2 className="font-bold text-gray-900">スタイル選択</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(Object.keys(OGP_STYLES) as StyleKey[]).map((styleKey) => {
                const style = OGP_STYLES[styleKey];
                const isSelected = selectedStyle === styleKey;

                return (
                  <button
                    key={styleKey}
                    onClick={() => setSelectedStyle(styleKey)}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? "border-purple-500 bg-purple-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    {style.recommended && (
                      <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold bg-green-500 text-white rounded-full">
                        推奨
                      </span>
                    )}
                    <div className="font-bold text-gray-900 mb-1">
                      {style.name}
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      {style.description}
                    </p>
                    {/* カラーパレット表示 */}
                    <div className="flex gap-1 mb-2">
                      {style.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full border border-gray-200"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">{style.elements}</p>
                    {isSelected && (
                      <div className="absolute top-2 left-2">
                        <Check className="w-5 h-5 text-purple-500" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 操作ボタン */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={checkExistingImages}
              disabled={
                checkingExisting || isGenerating || ingredients.length === 0
              }
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {checkingExisting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  チェック中... ({progress.current}/{progress.total})
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  既存画像をチェック
                </>
              )}
            </button>
            <button
              onClick={toggleSelectAll}
              disabled={isGenerating}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition"
            >
              {selectedItems.size === ingredients.length ? "全解除" : "全選択"}
            </button>
            {isGenerating ? (
              <button
                onClick={cancelGeneration}
                className="px-6 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
              >
                <StopCircle className="w-4 h-4" />
                中止 ({progress.current}/{progress.total})
              </button>
            ) : (
              <button
                onClick={generateSelected}
                disabled={selectedItems.size === 0 || !token}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                選択項目を生成 ({selectedItems.size})
              </button>
            )}
            <span className="text-sm text-gray-500">
              成分数: {ingredients.length}件
              {Object.values(status).filter(
                (s) => s === "exists" || s === "success",
              ).length > 0 && (
                <span className="ml-2 text-green-600">
                  (生成済み:{" "}
                  {
                    Object.values(status).filter(
                      (s) => s === "exists" || s === "success",
                    ).length
                  }
                  件)
                </span>
              )}
            </span>
          </div>

          {/* 進捗バー（生成中またはチェック中に表示） */}
          {(isGenerating || checkingExisting) && progress.total > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>{checkingExisting ? "チェック進捗" : "生成進捗"}</span>
                <span>
                  {progress.current} / {progress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    checkingExisting ? "bg-gray-500" : "bg-blue-500"
                  }`}
                  style={{
                    width: `${(progress.current / progress.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 生成済み画像プレビュー */}
        {generatedImages.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              生成済み画像 ({generatedImages.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {generatedImages.map((img) => (
                <div
                  key={img.slug}
                  className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[1.91/1]"
                >
                  <NextImage
                    src={img.url}
                    alt={img.slug}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2">
                    {img.slug}
                  </div>
                  <a
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 成分一覧 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === ingredients.length}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    成分名
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    英名
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    カテゴリ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ステータス
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ingredients.map((ingredient) => {
                  const slug = ingredient.slug.current;
                  const itemStatus = status[slug];

                  return (
                    <tr key={ingredient._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(slug)}
                          onChange={() => toggleSelect(slug)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {ingredient.name}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {ingredient.nameEn || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {ingredient.category || "-"}
                      </td>
                      <td className="px-4 py-3">
                        {itemStatus === "generating" && (
                          <span className="inline-flex items-center gap-1 text-blue-600 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            生成中
                          </span>
                        )}
                        {itemStatus === "success" && (
                          <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                            <Check className="w-4 h-4" />
                            完了
                          </span>
                        )}
                        {itemStatus === "exists" && (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            生成済み
                          </span>
                        )}
                        {itemStatus === "error" && (
                          <span className="inline-flex items-center gap-1 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            エラー
                          </span>
                        )}
                        {!itemStatus && (
                          <span className="text-gray-400 text-sm">未確認</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => generateSingleOG(ingredient)}
                          disabled={itemStatus === "generating" || !token}
                          className={`px-3 py-1 text-xs font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition ${
                            itemStatus === "exists" || itemStatus === "success"
                              ? "text-orange-600 bg-orange-50 hover:bg-orange-100"
                              : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                          }`}
                        >
                          {itemStatus === "exists" || itemStatus === "success"
                            ? "再生成"
                            : "生成"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 使い方 */}
        <div className="mt-6 bg-blue-50 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">使い方</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>1. 「既存画像をチェック」で生成済み画像を確認</li>
            <li>2. 生成したい成分を選択（複数可）</li>
            <li>3. 「選択項目を生成」ボタンをクリック</li>
            <li>4. 途中で止めたい場合は「中止」ボタンで停止</li>
            <li>5. 画像はCloudinaryに自動アップロード</li>
            <li>6. 成分ページのOGP/アイキャッチに自動適用</li>
          </ul>
          <p className="text-xs text-blue-600 mt-3">
            ※
            生成には1件あたり約10-20秒かかります。APIレート制限のため、連続生成時は2秒間隔で処理されます。
            <br />※ 「再生成」を押すと既存の画像が上書きされます。
          </p>
        </div>
      </div>
    </div>
  );
}
