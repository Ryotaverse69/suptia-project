"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  CookieConsent,
  DEFAULT_CONSENT,
  getCookieConsent,
  saveCookieConsent,
  isDNTEnabled,
  getDNTConsent,
} from "@/lib/cookie-consent";

interface CookieConsentContextType {
  consent: CookieConsent;
  hasConsent: boolean;
  showBanner: boolean;
  showSettings: boolean;
  updateConsent: (consent: CookieConsent) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  closeBanner: () => void;
}

const CookieConsentContext = createContext<
  CookieConsentContextType | undefined
>(undefined);

export function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [consent, setConsent] = useState<CookieConsent>(DEFAULT_CONSENT);
  const [hasConsent, setHasConsent] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // 初期化: 保存された同意設定をロード
    const savedConsent = getCookieConsent();

    if (savedConsent) {
      setConsent(savedConsent);
      setHasConsent(true);
      setShowBanner(false);
    } else {
      // DNTが有効な場合はデフォルトで拒否
      if (isDNTEnabled()) {
        const dntConsent = getDNTConsent();
        setConsent(dntConsent);
        saveCookieConsent(dntConsent);
        setHasConsent(true);
        setShowBanner(false);
      } else {
        // 初回訪問時はバナーを表示
        setShowBanner(true);
      }
    }
  }, []);

  const updateConsent = useCallback((newConsent: CookieConsent) => {
    // 必須Cookieは常に有効
    const finalConsent = { ...newConsent, necessary: true };
    setConsent(finalConsent);
    saveCookieConsent(finalConsent);
    setHasConsent(true);
    setShowBanner(false);
    setShowSettings(false);

    // ページをリロードして設定を反映
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, []);

  const acceptAll = useCallback(() => {
    const allAccepted: CookieConsent = {
      necessary: true,
      analytics: true,
      advertising: true,
      functional: true,
    };
    updateConsent(allAccepted);
  }, [updateConsent]);

  const rejectAll = useCallback(() => {
    const allRejected: CookieConsent = {
      necessary: true,
      analytics: false,
      advertising: false,
      functional: false,
    };
    updateConsent(allRejected);
  }, [updateConsent]);

  const openSettings = useCallback(() => {
    setShowSettings(true);
    setShowBanner(false);
  }, []);

  const closeSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  const closeBanner = useCallback(() => {
    setShowBanner(false);
  }, []);

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hasConsent,
        showBanner,
        showSettings,
        updateConsent,
        acceptAll,
        rejectAll,
        openSettings,
        closeSettings,
        closeBanner,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider",
    );
  }
  return context;
}
