"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { Sparkles, ArrowRight, Shield, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  systemColors,
  appleWebColors,
  typography,
  fontStack,
  appleEase,
  subtleSpring,
  bouncySpring,
} from "@/lib/design-system";
import { classifyIntent } from "@/lib/intent";

// Mobile detection using CSS media query
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
};

// iOS detection
const useIsIOS = () => {
  const [isIOS, setIsIOS] = useState(false);
  useEffect(() => {
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
  }, []);
  return isIOS;
};

interface HeroRevolutionProps {
  popularSearches?: Array<{ name: string }>;
}

// プレースホルダーの質問例（ローテーション用）- 相談形で生活文脈を含める
const PLACEHOLDER_QUESTIONS = [
  "妊娠中でも飲める？",
  "今の自分に必要？",
  "このサプリ、安全性は大丈夫？",
  "疲れやすいんだけど、何がいい？",
];

export function HeroRevolution({ popularSearches = [] }: HeroRevolutionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLFormElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isAIButtonHovered, setIsAIButtonHovered] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const router = useRouter();
  const isMobile = useIsMobile();
  const isIOS = useIsIOS();
  const prefersReducedMotion = useReducedMotion();

  // プレースホルダーのローテーション（5秒ごと）
  useEffect(() => {
    if (isFocused || searchQuery) return; // フォーカス中・入力中は停止
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_QUESTIONS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isFocused, searchQuery]);

  // iOS keyboard handling - scroll input into view
  const handleIOSFocus = useCallback(() => {
    if (isIOS && searchContainerRef.current) {
      // Delay to wait for keyboard to appear
      setTimeout(() => {
        searchContainerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  }, [isIOS]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Apple-style subtle parallax
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["0%", "10%"] : ["0%", "20%"],
  );
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    const result = classifyIntent(query);
    const encodedQuery = encodeURIComponent(query);

    if (result.destination === "concierge") {
      // 悩み・疑問・条件 → AIコンシェルジュへ（クエリパラメータ付き）
      router.push(`/concierge?q=${encodedQuery}`);
    } else {
      // 成分名・商品名 → 検索ページへ
      router.push(`/search?q=${encodedQuery}`);
    }
  };

  // Apple-style staggered animation config
  const staggerDelay = 0.12;
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: i * staggerDelay,
        ease: appleEase,
      },
    }),
  };

  return (
    <motion.section
      ref={containerRef}
      className={`relative flex items-center justify-center overflow-hidden ${
        isIOS && isFocused ? "min-h-[50vh]" : "min-h-[90vh]"
      }`}
      style={{
        fontFamily: fontStack,
        contain: "layout paint",
        // iOS: smoother transition when keyboard opens
        transition: isIOS ? "min-height 0.3s ease" : undefined,
      }}
    >
      {/* Clean Apple-style Background */}
      <motion.div className="absolute inset-0 -z-20" style={{ y: backgroundY }}>
        {/* Subtle gradient: off-white to white */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, #f5f5f7 0%, #ffffff 50%, #fafafa 100%)`,
          }}
        />

        {/* Very subtle accent glow - Apple style */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,122,255,0.04) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 80%, rgba(88,86,214,0.03) 0%, transparent 50%)
            `,
          }}
        />
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20"
        style={{
          // iOS: disable parallax when focused to prevent visual issues
          y: isIOS && isFocused ? 0 : textY,
          opacity: isIOS && isFocused ? 1 : textOpacity,
        }}
      >
        {/* Hero Text */}
        <div className="text-center mb-12">
          {/* Tagline Badge - Apple style minimal */}
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <span
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[13px] font-medium tracking-wide"
              style={{
                backgroundColor: "rgba(0, 122, 255, 0.08)",
                color: systemColors.blue,
              }}
            >
              <Shield className="w-4 h-4" aria-hidden="true" />
              AI × サプリ比較
            </span>
          </motion.div>

          {/* Main Title - Apple style large typography with solid colors */}
          <motion.h1
            className="text-[40px] sm:text-[52px] md:text-[64px] lg:text-[76px] font-bold tracking-[-0.025em] mb-8 leading-[1.05]"
            style={{ color: appleWebColors.textPrimary }}
          >
            <motion.span
              className="inline-block"
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              選ぶ理由が、
            </motion.span>
            <br />
            <motion.span
              className="inline-block"
              style={{ color: systemColors.blue }}
              custom={2}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              見える。
            </motion.span>
          </motion.h1>

          {/* Subtitle - Apple style */}
          <motion.p
            className="text-[17px] sm:text-[19px] md:text-[21px] leading-relaxed max-w-2xl mx-auto"
            style={{ color: appleWebColors.textSecondary }}
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            根拠が見える。
            <br className="hidden sm:block" />
            だから、安心して選べる。
          </motion.p>
        </div>

        {/* AI Input - AIに判断材料を渡すための入力欄 */}
        <motion.form
          ref={searchContainerRef}
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto mb-10"
          custom={4}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="relative group"
            animate={isMobile ? {} : { scale: isFocused ? 1.01 : 1 }}
            transition={subtleSpring}
          >
            {/* Search Input Container - Apple style elevated card */}
            <motion.div
              className="relative flex items-center rounded-full overflow-hidden"
              initial={false}
              animate={{
                boxShadow: isFocused
                  ? `0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 2px ${systemColors.blue}`
                  : "0 4px 20px rgba(0, 0, 0, 0.08)",
              }}
              transition={{ duration: 0.25, ease: appleEase }}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid rgba(0, 0, 0, 0.06)",
              }}
            >
              <div className="pl-6 pr-3">
                <Sparkles
                  className="transition-colors duration-200"
                  style={{
                    color: isFocused
                      ? systemColors.blue
                      : appleWebColors.textSecondary,
                  }}
                  size={20}
                  aria-hidden="true"
                />
              </div>
              {/* Input wrapper with custom animated placeholder */}
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    setIsFocused(true);
                    handleIOSFocus();
                  }}
                  onBlur={() => setIsFocused(false)}
                  className={`w-full py-4 px-2 ${typography.body} bg-transparent outline-none transition-colors duration-200`}
                  style={{
                    color: appleWebColors.textPrimary,
                    // iOS: prevent zoom on focus
                    fontSize: "16px",
                  }}
                  aria-label="AIに質問する"
                />
                {/* Custom animated placeholder overlay */}
                {!searchQuery && !isFocused && (
                  <div
                    className="absolute inset-0 flex items-center px-2 pointer-events-none overflow-hidden"
                    aria-hidden="true"
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={placeholderIndex}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{
                          duration: prefersReducedMotion ? 0 : 0.4,
                          ease: appleEase,
                        }}
                        className={`${typography.body} truncate`}
                        style={{
                          color: "#86868b",
                          fontSize: "16px",
                        }}
                      >
                        {PLACEHOLDER_QUESTIONS[placeholderIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                )}
              </div>
              <motion.button
                type="submit"
                className="glow-wrapper-hero m-1.5"
                whileTap={{ scale: 0.97 }}
                transition={bouncySpring}
              >
                <div className="glow-layer" />
                <span
                  className={`glow-button-inner-hero ${typography.headline}`}
                >
                  AIに聞く
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.form>

        {/* Popular Searches - Apple style tags */}
        <motion.div
          className={`flex justify-center items-center mb-12 ${
            isMobile
              ? "flex-nowrap overflow-x-auto gap-1.5 px-2"
              : "flex-wrap gap-2"
          }`}
          custom={5}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          style={{
            // iOS: hide scrollbar
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <span
            className={`${isMobile ? "text-[11px] mr-0.5 flex-shrink-0" : "text-[13px] mr-1"}`}
            style={{ color: appleWebColors.textSecondary }}
          >
            よく調べられている成分:
          </span>
          {popularSearches.slice(0, isMobile ? 4 : 5).map((search, index) => (
            <motion.button
              key={search.name}
              onClick={() =>
                router.push(`/search?q=${encodeURIComponent(search.name)}`)
              }
              className={`rounded-full font-medium transition-all duration-200 flex-shrink-0 ${
                isMobile
                  ? "px-2.5 py-1 text-[11px] min-h-[28px]"
                  : "px-4 py-2 text-[13px] min-h-[36px]"
              }`}
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                color: appleWebColors.textPrimary,
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.6 + index * 0.06,
                ease: appleEase,
              }}
              whileHover={
                isMobile
                  ? {}
                  : {
                      backgroundColor: "rgba(0, 122, 255, 0.1)",
                      color: systemColors.blue,
                      scale: 1.02,
                    }
              }
              whileTap={{ scale: 0.97 }}
            >
              {search.name}
            </motion.button>
          ))}
        </motion.div>

        {/* CTA Buttons - Apple style clean */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4"
          custom={6}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 主CTA: AIコンシェルジュボタン - Apple Intelligence風グロー */}
          <div className="flex flex-col items-center">
            <Link href="/concierge">
              <div
                className={`glow-wrapper ${isAIButtonHovered ? "glow-active" : ""}`}
                onMouseEnter={() => setIsAIButtonHovered(true)}
                onMouseLeave={() => setIsAIButtonHovered(false)}
              >
                {/* グローレイヤー（実際のdiv要素） */}
                <div className="glow-layer" />
                {/* ボタン本体 */}
                <div className="glow-button-inner">
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />
                  <span>AIに相談する</span>
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </div>
              </div>
            </Link>
            <span
              className="mt-1.5 text-[12px]"
              style={{ color: appleWebColors.textTertiary }}
            >
              理由・注意点まで解説
            </span>
          </div>

          {/* 副CTA: 診断ボタン - 控えめなテキストリンク風 */}
          <Link href="/diagnosis">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 text-[15px] font-medium"
              style={{ color: appleWebColors.textSecondary }}
              whileHover={isMobile ? {} : { color: systemColors.blue }}
              transition={{ duration: 0.2 }}
            >
              <span>簡単診断から始める</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
