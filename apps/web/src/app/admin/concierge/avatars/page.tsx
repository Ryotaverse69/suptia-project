"use client";

/**
 * キャラクターアバター管理ページ
 * Gemini 2.0 Flash で画像生成し、全ユーザー共通で使用
 */

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Loader2,
  Check,
  AlertCircle,
  RefreshCw,
  Save,
  User,
  X,
} from "lucide-react";
import { CHARACTERS } from "@/lib/concierge/characters";
import type { CharacterId } from "@/lib/concierge/types";

// 新ID → 旧ID のマッピング（DB互換性）
const NEW_TO_LEGACY_MAP: Record<CharacterId, string> = {
  core: "navi",
  mint: "mint",
  repha: "doc",
  haku: "haru",
};

// 共通スタイルガイド（統一感のため）
const COMMON_STYLE = `Common Style:
- Japanese anime illustration, modern clean design
- High quality, professional anime art
- Soft shading, clean linework, vibrant colors
- Portrait view, upper body focus
- Friendly and approachable expression`;

// キャラクター別のデフォルトプロンプト（日本アニメ風で統一）
const DEFAULT_PROMPTS: Record<CharacterId, string> = {
  core: `Create a Japanese anime style avatar of a friendly wellness guide.

${COMMON_STYLE}
- Square avatar icon, clean mint-green gradient background

Character Specifics:
- Gender: Androgynous/neutral appearance
- Hair: Short, neat, dark green or teal color
- Expression: Calm, trustworthy smile
- Outfit: Smart casual attire (polo shirt, neat sweater)
- Colors: Green and teal accents
- Vibe: Reliable, approachable, knowledgeable`,

  mint: `Create a Japanese anime style avatar of a cheerful young assistant.

${COMMON_STYLE}
- Square avatar icon, clean cyan gradient background

Character Specifics:
- Gender: Androgynous/neutral appearance
- Hair: Medium length, bright mint green with playful styling
- Expression: Big happy smile, sparkling eyes
- Outfit: Casual, trendy clothing
- Colors: Mint green and cyan accents
- Vibe: Energetic, friendly, youthful
- Optional: Small sparkle effects around`,

  repha: `Create a Japanese anime style avatar of a scholarly researcher.

${COMMON_STYLE}
- Square avatar icon, clean deep blue gradient background

Character Specifics:
- Gender: Androgynous/neutral appearance
- Hair: Neat, dark blue or indigo color
- Expression: Confident, intellectual gaze, slight smile
- Outfit: Academic attire (blazer, dress shirt, vest)
- Accessories: Stylish glasses
- Colors: Deep blue and purple accents
- Vibe: Knowledgeable, analytical, trustworthy`,

  haku: `Create a Japanese anime style avatar of a gentle caring companion.

${COMMON_STYLE}
- Square avatar icon, clean warm orange gradient background

Character Specifics:
- Gender: Androgynous/neutral appearance
- Hair: Soft, wavy, warm orange or light brown color
- Expression: Kind, gentle smile, soft eyes
- Outfit: Comfortable, cozy clothing (sweater, cardigan)
- Colors: Warm orange and soft yellow accents
- Vibe: Nurturing, supportive, calming`,
};

interface GeneratedAvatar {
  base64: string;
  mimeType: string;
}

interface SavedAvatar {
  character_id: string;
  image_url: string;
  updated_at: string;
}

export default function CharacterAvatarsPage() {
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterId>("core");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedAvatar, setGeneratedAvatar] =
    useState<GeneratedAvatar | null>(null);
  const [savedAvatars, setSavedAvatars] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<{
    url: string;
    name: string;
  } | null>(null);

  // 保存済みアバターを取得
  useEffect(() => {
    async function fetchAvatars() {
      try {
        const response = await fetch("/api/admin/character-avatars");
        const data = await response.json();
        if (data.avatars) {
          setSavedAvatars(data.avatars);
        }
      } catch (err) {
        console.error("Failed to fetch avatars:", err);
      }
    }
    fetchAvatars();
  }, []);

  // キャラクター変更時にプロンプトをリセット
  useEffect(() => {
    setCustomPrompt(DEFAULT_PROMPTS[selectedCharacter]);
    setGeneratedAvatar(null);
    setError(null);
    setSuccessMessage(null);
  }, [selectedCharacter]);

  // 画像生成
  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setSuccessMessage(null);
    setGeneratedAvatar(null);

    try {
      const response = await fetch("/api/admin/character-avatars/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: selectedCharacter,
          customPrompt: customPrompt || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "生成に失敗しました");
      }

      setGeneratedAvatar(data.image);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "生成中にエラーが発生しました",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // 画像保存
  const handleSave = async () => {
    if (!generatedAvatar) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/character-avatars/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: selectedCharacter,
          base64Image: generatedAvatar.base64,
          mimeType: generatedAvatar.mimeType,
          prompt: customPrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "保存に失敗しました");
      }

      // 保存成功
      setSavedAvatars((prev) => ({
        ...prev,
        [selectedCharacter]: data.imageUrl,
      }));
      setSuccessMessage("アバターを保存しました！全ユーザーに反映されます。");
      setGeneratedAvatar(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "保存中にエラーが発生しました",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const character = CHARACTERS[selectedCharacter];

  // 新IDでアバターURLを取得（旧IDへのフォールバック付き）
  const getAvatarUrl = (id: CharacterId): string | undefined => {
    // まず新IDで検索
    if (savedAvatars[id]) {
      return savedAvatars[id];
    }
    // なければ旧IDで検索
    const legacyId = NEW_TO_LEGACY_MAP[id];
    if (legacyId && savedAvatars[legacyId]) {
      return savedAvatars[legacyId];
    }
    return undefined;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                キャラクターアバター管理
              </h1>
              <p className="text-gray-500 text-sm">
                Gemini 3 Pro Image Previewでアバター画像を生成（全ユーザー共通）
              </p>
            </div>
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* 成功メッセージ */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-green-700">
                <Check className="w-5 h-5" />
                <span>{successMessage}</span>
              </div>
            </div>
          )}
        </div>

        {/* キャラクター選択 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            キャラクター選択
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Object.keys(CHARACTERS) as CharacterId[]).map((id) => {
              const char = CHARACTERS[id];
              const isSelected = selectedCharacter === id;
              const avatarUrl = getAvatarUrl(id);
              const hasSavedAvatar = !!avatarUrl;

              return (
                <button
                  key={id}
                  onClick={() => setSelectedCharacter(id)}
                  className={`relative p-4 rounded-xl border-2 text-center transition-all ${
                    isSelected
                      ? "border-green-500 bg-green-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  {/* アバター表示 */}
                  <div
                    className={`w-16 h-16 mx-auto mb-3 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center ${hasSavedAvatar ? "cursor-zoom-in hover:ring-2 hover:ring-green-400 transition-all" : ""}`}
                    onClick={(e) => {
                      if (hasSavedAvatar && avatarUrl) {
                        e.stopPropagation();
                        setPreviewAvatar({
                          url: avatarUrl,
                          name: char.name,
                        });
                      }
                    }}
                  >
                    {hasSavedAvatar && avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={char.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="font-bold text-gray-900">{char.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {char.recommendationStyle}
                  </div>
                  {hasSavedAvatar && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold bg-green-500 text-white rounded-full">
                      設定済
                    </span>
                  )}
                  {isSelected && (
                    <div className="absolute top-2 left-2">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* プロンプト編集 & 生成 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {character.name} のアバター生成
          </h2>

          {/* キャラクター情報 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="text-sm text-gray-600">
              <p>
                <strong>性格:</strong> {character.personality}
              </p>
              <p>
                <strong>スタイル:</strong> {character.recommendationStyleLabel}
              </p>
            </div>
          </div>

          {/* プロンプト編集 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              生成プロンプト（編集可能）
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
              placeholder="画像生成のプロンプトを入力..."
            />
            <button
              onClick={() =>
                setCustomPrompt(DEFAULT_PROMPTS[selectedCharacter])
              }
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              デフォルトに戻す
            </button>
          </div>

          {/* 生成ボタン */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !customPrompt.trim()}
            className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                生成中...（約10-30秒）
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                アバターを生成
              </>
            )}
          </button>
        </div>

        {/* 生成結果 */}
        {generatedAvatar && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              生成結果プレビュー
            </h2>

            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* 生成画像 */}
              <div className="w-48 h-48 rounded-xl overflow-hidden bg-gray-100 shadow-lg">
                <Image
                  src={`data:${generatedAvatar.mimeType};base64,${generatedAvatar.base64}`}
                  alt="Generated avatar"
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 保存ボタン */}
              <div className="flex-1">
                <p className="text-gray-600 mb-4">
                  この画像を {character.name} のアバターとして保存しますか？
                  <br />
                  <span className="text-sm text-gray-500">
                    ※ 保存すると全ユーザーのコンシェルジュUIに反映されます
                  </span>
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 py-3 px-6 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        この画像を保存
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="py-3 px-6 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 disabled:opacity-50 transition flex items-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    再生成
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 現在のアバター一覧 */}
        {Object.keys(savedAvatars).length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              現在のアバター一覧
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(Object.keys(CHARACTERS) as CharacterId[]).map((id) => {
                const char = CHARACTERS[id];
                const avatarUrl = getAvatarUrl(id);

                return (
                  <div key={id} className="text-center">
                    <div
                      className={`w-20 h-20 mx-auto mb-2 rounded-xl overflow-hidden bg-gray-100 ${avatarUrl ? "cursor-zoom-in hover:ring-2 hover:ring-green-400 transition-all" : ""}`}
                      onClick={() => {
                        if (avatarUrl) {
                          setPreviewAvatar({
                            url: avatarUrl,
                            name: char.name,
                          });
                        }
                      }}
                    >
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={char.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {char.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {avatarUrl ? "設定済み" : "未設定"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 使い方 */}
        <div className="mt-6 bg-blue-50 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">使い方</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>1. キャラクターを選択</li>
            <li>2. プロンプトを編集（任意）</li>
            <li>3. 「アバターを生成」をクリック</li>
            <li>4. 生成結果を確認し「この画像を保存」をクリック</li>
            <li>5. 保存すると全ユーザーのUIに自動反映されます</li>
          </ul>
          <p className="text-xs text-blue-600 mt-3">
            ※ 画像生成には約10-30秒かかります。
            <br />※ Gemini 3 Pro Image Preview
            (models/gemini-3-pro-image-preview) を使用しています。
          </p>
        </div>
      </div>

      {/* アバター拡大プレビューモーダル */}
      {previewAvatar && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewAvatar(null)}
        >
          <div
            className="relative bg-white rounded-2xl p-4 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 閉じるボタン */}
            <button
              onClick={() => setPreviewAvatar(null)}
              className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* キャラクター名 */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {previewAvatar.name}
              </h3>
            </div>

            {/* 拡大画像 */}
            <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={previewAvatar.url}
                alt={previewAvatar.name}
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
