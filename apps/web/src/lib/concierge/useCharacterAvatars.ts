/**
 * キャラクターアバターを取得するフック
 *
 * DBに保存されたアバターURLを取得し、キャッシュする
 */

import { useState, useEffect } from "react";
import type { CharacterId } from "./types";

interface CharacterAvatars {
  [key: string]: string;
}

// 旧ID → 新ID のマッピング（DB移行前の互換性のため）
const LEGACY_ID_MAP: Record<string, CharacterId> = {
  navi: "core",
  doc: "repha",
  haru: "haku",
};

// 新ID → 旧ID のマッピング（逆引き）
const NEW_TO_LEGACY_MAP: Record<CharacterId, string> = {
  core: "navi",
  mint: "mint",
  repha: "doc",
  haku: "haru",
};

// グローバルキャッシュ（コンポーネント間で共有）
let avatarCache: CharacterAvatars | null = null;
let fetchPromise: Promise<CharacterAvatars> | null = null;

async function fetchAvatars(): Promise<CharacterAvatars> {
  try {
    const response = await fetch("/api/admin/character-avatars");
    const data = await response.json();
    return data.avatars || {};
  } catch (error) {
    console.error("Failed to fetch character avatars:", error);
    return {};
  }
}

export function useCharacterAvatars() {
  const [avatars, setAvatars] = useState<CharacterAvatars>(avatarCache || {});
  const [isLoading, setIsLoading] = useState(!avatarCache);

  useEffect(() => {
    // キャッシュがあればそれを使用
    if (avatarCache) {
      setAvatars(avatarCache);
      setIsLoading(false);
      return;
    }

    // 既にフェッチ中なら待機
    if (fetchPromise) {
      fetchPromise.then((data) => {
        avatarCache = data;
        setAvatars(data);
        setIsLoading(false);
      });
      return;
    }

    // 新規フェッチ
    fetchPromise = fetchAvatars();
    fetchPromise.then((data) => {
      avatarCache = data;
      setAvatars(data);
      setIsLoading(false);
      fetchPromise = null;
    });
  }, []);

  // キャッシュをクリアする関数（管理画面で更新後に使用）
  const refreshAvatars = async () => {
    setIsLoading(true);
    avatarCache = null;
    fetchPromise = null;
    const data = await fetchAvatars();
    avatarCache = data;
    setAvatars(data);
    setIsLoading(false);
  };

  // 特定キャラクターのアバターURLを取得
  // 新ID（core, repha, haku）と旧ID（navi, doc, haru）の両方をチェック
  const getAvatarUrl = (characterId: CharacterId): string | undefined => {
    // まず新IDで検索
    if (avatars[characterId]) {
      return avatars[characterId];
    }
    // なければ旧IDで検索（DB移行前の互換性）
    const legacyId = NEW_TO_LEGACY_MAP[characterId];
    if (legacyId && avatars[legacyId]) {
      return avatars[legacyId];
    }
    return undefined;
  };

  return {
    avatars,
    isLoading,
    getAvatarUrl,
    refreshAvatars,
  };
}

// キャッシュをクリアするためのエクスポート（管理画面から使用）
export function clearAvatarCache() {
  avatarCache = null;
  fetchPromise = null;
}
