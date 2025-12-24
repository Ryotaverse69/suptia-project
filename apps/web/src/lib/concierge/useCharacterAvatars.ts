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
  const getAvatarUrl = (characterId: CharacterId): string | undefined => {
    return avatars[characterId];
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
