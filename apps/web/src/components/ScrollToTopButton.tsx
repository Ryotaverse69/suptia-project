"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

/**
 * 画面右下に表示されるトップへ戻るボタン
 * スクロール時にフェードイン/アウト
 */
export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // 300px以上スクロールしたら表示
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary-700 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{
        pointerEvents: isVisible ? "auto" : "none",
      }}
      aria-label="トップへ戻る"
    >
      <ArrowUp size={24} />
    </button>
  );
}
