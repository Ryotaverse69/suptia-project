"use client";

/**
 * OGP画像管理ページ
 * 成分・記事・ツールのOGP画像を一括/個別生成
 */

import { useState, useEffect } from "react";
import NextImage from "next/image";
import { createClient } from "@/lib/supabase/client";
import { sanity } from "@/lib/sanity.client";
import {
  Image as ImageIcon,
  Loader2,
  Check,
  AlertCircle,
  RefreshCw,
  Download,
  ExternalLink,
} from "lucide-react";

interface IngredientItem {
  _id: string;
  name: string;
  nameEn?: string;
  slug: { current: string };
  category?: string;
}

interface GenerationStatus {
  [slug: string]: "pending" | "generating" | "success" | "error";
}

interface GeneratedImage {
  slug: string;
  url: string;
  type: string;
}

export default function OGImagesAdminPage() {
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus>({});
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const items = ingredients.filter((i) => selectedItems.has(i.slug.current));

    for (const item of items) {
      await generateSingleOG(item);
      // APIレート制限対策
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    setIsGenerating(false);
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

          {/* 操作ボタン */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSelectAll}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              {selectedItems.size === ingredients.length ? "全解除" : "全選択"}
            </button>
            <button
              onClick={generateSelected}
              disabled={selectedItems.size === 0 || isGenerating || !token}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  選択項目を生成 ({selectedItems.size})
                </>
              )}
            </button>
            <span className="text-sm text-gray-500">
              成分数: {ingredients.length}件
            </span>
          </div>
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
                        {itemStatus === "error" && (
                          <span className="inline-flex items-center gap-1 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            エラー
                          </span>
                        )}
                        {!itemStatus && (
                          <span className="text-gray-400 text-sm">未生成</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => generateSingleOG(ingredient)}
                          disabled={itemStatus === "generating" || !token}
                          className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          生成
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
            <li>1. 生成したい成分を選択（複数可）</li>
            <li>2. 「選択項目を生成」ボタンをクリック</li>
            <li>3. 画像はCloudinaryに自動アップロード</li>
            <li>4. 成分ページのOGP/アイキャッチに自動適用</li>
          </ul>
          <p className="text-xs text-blue-600 mt-3">
            ※
            生成には1件あたり約10-20秒かかります。APIレート制限のため、連続生成時は2秒間隔で処理されます。
          </p>
        </div>
      </div>
    </div>
  );
}
