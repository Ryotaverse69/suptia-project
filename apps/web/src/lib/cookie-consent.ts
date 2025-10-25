/**
 * Cookie同意管理ユーティリティ
 */

export interface CookieConsent {
  necessary: boolean; // 常にtrue（必須Cookie）
  analytics: boolean; // Google Analytics等
  advertising: boolean; // アフィリエイト等
  functional: boolean; // UI設定等
}

export const DEFAULT_CONSENT: CookieConsent = {
  necessary: true,
  analytics: false,
  advertising: false,
  functional: false,
};

const CONSENT_KEY = "suptia_cookie_consent";
const CONSENT_TIMESTAMP_KEY = "suptia_cookie_consent_timestamp";

/**
 * Cookie同意設定を保存
 */
export function saveCookieConsent(consent: CookieConsent): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    localStorage.setItem(CONSENT_TIMESTAMP_KEY, new Date().toISOString());
  } catch (error) {
    console.error("Failed to save cookie consent:", error);
  }
}

/**
 * Cookie同意設定を取得
 */
export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;

  try {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) return null;

    return JSON.parse(consent) as CookieConsent;
  } catch (error) {
    console.error("Failed to get cookie consent:", error);
    return null;
  }
}

/**
 * Cookie同意設定をクリア
 */
export function clearCookieConsent(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(CONSENT_KEY);
    localStorage.removeItem(CONSENT_TIMESTAMP_KEY);
  } catch (error) {
    console.error("Failed to clear cookie consent:", error);
  }
}

/**
 * Cookie同意が存在するかチェック
 */
export function hasConsent(): boolean {
  return getCookieConsent() !== null;
}

/**
 * Do Not Track (DNT) が有効かチェック
 */
export function isDNTEnabled(): boolean {
  if (typeof window === "undefined") return false;

  const dnt =
    navigator.doNotTrack ||
    (window as any).doNotTrack ||
    (navigator as any).msDoNotTrack;

  return dnt === "1" || dnt === "yes";
}

/**
 * DNTが有効な場合のデフォルト設定
 */
export function getDNTConsent(): CookieConsent {
  return {
    necessary: true,
    analytics: false,
    advertising: false,
    functional: false,
  };
}
