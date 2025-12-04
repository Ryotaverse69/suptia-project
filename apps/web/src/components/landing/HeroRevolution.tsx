"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Apple式：モバイル検出をCSS media queryベースで
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

// パーティクルの位置を事前計算（Apple式：モバイルでは6個、デスクトップでは12個）
const PARTICLE_POSITIONS_DESKTOP = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`,
  top: `${(i * 23 + 11) % 100}%`,
  duration: 5 + (i % 3),
  delay: (i % 4) * 0.8,
}));

const PARTICLE_POSITIONS_MOBILE = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  left: `${(i * 33 + 10) % 100}%`,
  top: `${(i * 37 + 15) % 100}%`,
  duration: 6 + (i % 2),
  delay: (i % 3) * 1,
}));

interface HeroRevolutionProps {
  popularSearches?: Array<{ name: string }>;
}

export function HeroRevolution({ popularSearches = [] }: HeroRevolutionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Apple式：モバイルではパララックス効果を軽減
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["0%", "20%"] : ["0%", "50%"],
  );
  // Apple式：why-suptiaページと同じスクロールフェードアウト
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  // 即座にフェードアウト開始、50%で完了（why-suptia同様）
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.6],
    isMobile ? [1, 0.95] : [1, 0.9],
  );

  // Apple式：モバイルでは重いロゴエフェクトを無効化
  const logoScale = useTransform(
    scrollYProgress,
    [0, 0.3],
    isMobile ? [1, 1] : [1, 1.5],
  );
  const logoOpacity = useTransform(
    scrollYProgress,
    [0, 0.3],
    isMobile ? [0, 0] : [0.1, 0],
  );

  // パーティクル選択
  const particles = isMobile
    ? PARTICLE_POSITIONS_MOBILE
    : PARTICLE_POSITIONS_DESKTOP;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      style={{
        perspective: 1000,
        contain: "layout paint", // Apple式：再描画の影響範囲を限定
      }}
    >
      {/* Animated Gradient Background - Apple式：モバイルで軽量化 */}
      <motion.div className="absolute inset-0 -z-20" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a4cb8] via-[#3b66e0] to-[#2a4cb8]" />

        {/* Mesh Gradient Overlays - 静的（マウス追従を削除してFPS改善） */}
        <div
          className="absolute inset-0"
          style={{
            background: isMobile
              ? `
                radial-gradient(ellipse 100% 80% at 30% 30%, rgba(100, 229, 179, 0.3) 0%, transparent 60%),
                radial-gradient(ellipse 80% 80% at 70% 70%, rgba(122, 152, 236, 0.25) 0%, transparent 60%)
              `
              : `
                radial-gradient(ellipse 80% 50% at 20% 40%, rgba(100, 229, 179, 0.4) 0%, transparent 50%),
                radial-gradient(ellipse 60% 60% at 80% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
                radial-gradient(ellipse 50% 70% at 40% 80%, rgba(122, 152, 236, 0.35) 0%, transparent 50%),
                radial-gradient(ellipse 70% 50% at 70% 60%, rgba(255, 255, 255, 0.25) 0%, transparent 50%)
              `,
          }}
        />

        {/* Light Orbs - フローティングアニメーション（why-suptia同様） */}
        {!isMobile && !prefersReducedMotion && (
          <>
            <motion.div
              className="absolute w-96 h-96 rounded-full will-change-transform"
              style={{
                background:
                  "radial-gradient(circle, rgba(100, 229, 179, 0.25) 0%, rgba(100, 229, 179, 0.1) 40%, transparent 70%)",
                filter: "blur(60px)",
                left: "5%",
                top: "15%",
                transform: "translateZ(0)",
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, 30, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute w-72 h-72 rounded-full will-change-transform"
              style={{
                background:
                  "radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.08) 40%, transparent 70%)",
                filter: "blur(50px)",
                right: "10%",
                bottom: "15%",
                transform: "translateZ(0)",
              }}
              animate={{
                y: [0, 40, 0],
                x: [0, -20, 0],
                scale: [1, 0.85, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
            <motion.div
              className="absolute w-48 h-48 rounded-full will-change-transform"
              style={{
                background:
                  "radial-gradient(circle, rgba(122, 152, 236, 0.2) 0%, transparent 70%)",
                filter: "blur(40px)",
                left: "45%",
                top: "40%",
                transform: "translateZ(0)",
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, -40, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </>
        )}

        {/* Grid Pattern - モバイルでは非表示 */}
        {!isMobile && (
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        )}
      </motion.div>

      {/* Floating SUPTIA Logo Background - 静的化（FPS改善） */}
      {!isMobile && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center -z-10 select-none pointer-events-none"
          style={{
            scale: logoScale,
            opacity: logoOpacity,
          }}
        >
          <span className="text-[20vw] font-black tracking-tighter text-white/5">
            SUPTIA
          </span>
        </motion.div>
      )}

      {/* Floating Particles - Apple式：モバイルで削減、reduced-motion対応 */}
      {mounted && !prefersReducedMotion && (
        <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 rounded-full bg-white/20 will-change-transform"
              style={{
                left: particle.left,
                top: particle.top,
                transform: "translateZ(0)",
              }}
              animate={{
                y: isMobile ? [0, -40, 0] : [0, -80, 0],
                opacity: [0, isMobile ? 0.6 : 0.8, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20"
        style={{
          y: textY,
          opacity: textOpacity,
          scale,
        }}
      >
        {/* Hero Text */}
        <div className="text-center mb-12">
          {/* Tagline - GPU最適化 */}
          <motion.div
            initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.7,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-6 will-change-[transform,opacity,filter]"
            style={{ transform: "translateZ(0)" }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase bg-white/10 text-white/80 border border-white/10 backdrop-blur-sm">
              AI-Powered Supplement Intelligence
            </span>
          </motion.div>

          {/* Main Title with Split Animation - GPU最適化 */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight tracking-tight mb-6 leading-[1.1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.span
              className="inline-block text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] will-change-[transform,opacity,filter]"
              style={{ transform: "translateZ(0)" }}
              initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.9,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              あなたに最適な
            </motion.span>
            <br />
            <motion.span
              className="inline-block bg-gradient-to-r from-white via-[#c8f7e8] to-[#64e5b3] bg-clip-text text-transparent font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)] will-change-[transform,opacity,filter]"
              style={{ transform: "translateZ(0)" }}
              initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.9,
                delay: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              サプリを見つけよう
            </motion.span>
          </motion.h1>
        </div>

        {/* Search Box - Apple式：統一されたイージングとタイミング */}
        <motion.form
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="relative group"
            animate={isMobile ? {} : { scale: isFocused ? 1.02 : 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Outer White Glow - フォーカス時の白い光（デスクトップのみ） */}
            {!isMobile && (
              <motion.div
                className="absolute -inset-2 rounded-3xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 40%, transparent 70%)",
                  filter: "blur(15px)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isFocused ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            )}

            {/* Inner Gradient Glow（デスクトップのみ） */}
            {!isMobile && (
              <motion.div
                className="absolute -inset-1 rounded-2xl pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(122,152,236,0.5) 0%, rgba(59,102,224,0.3) 50%, rgba(90,127,230,0.5) 100%)",
                  filter: "blur(12px)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isFocused ? 0.6 : 0 }}
                transition={{ duration: 0.3 }}
              />
            )}

            {/* Search Input Container - Apple式：滑らかな背景遷移 */}
            <motion.div
              className="relative flex items-center rounded-2xl overflow-hidden"
              initial={false}
              animate={{
                backgroundColor: isFocused
                  ? "rgba(255,255,255,1)"
                  : isMobile
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.1)",
                boxShadow: isFocused
                  ? "0 25px 50px -12px rgba(59, 102, 224, 0.25), 0 0 0 1px rgba(255,255,255,0.5)"
                  : "0 0 0 1px rgba(255,255,255,0.2)",
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                backdropFilter: !isMobile && !isFocused ? "blur(24px)" : "none",
              }}
            >
              <div className="pl-5 pr-3">
                <Search
                  className={`transition-colors duration-300 ${
                    isFocused ? "text-primary" : "text-white/60"
                  }`}
                  size={22}
                />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="サプリ名・成分名で検索..."
                className={`flex-1 py-5 px-2 text-base bg-transparent outline-none transition-colors duration-300 ${
                  isFocused
                    ? "text-slate-800 placeholder:text-slate-400"
                    : "text-white placeholder:text-white/40"
                }`}
              />
              <motion.button
                type="submit"
                className="relative m-2 px-8 py-3 rounded-xl font-semibold text-sm overflow-hidden bg-[#5647a6]"
                whileHover={isMobile ? {} : { scale: 1.05 }}
                whileTap={isMobile ? {} : { scale: 0.95 }}
              >
                <span className="relative z-10 text-white">検索</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.form>

        {/* Popular Searches - Apple式：統一されたイージングとタイミング */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-1.5 mb-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-white/40 text-xs mr-1">人気:</span>
          {popularSearches.slice(0, 5).map((search, index) => (
            <motion.button
              key={search.name}
              onClick={() =>
                router.push(`/search?q=${encodeURIComponent(search.name)}`)
              }
              className="px-2.5 py-1 rounded-full text-xs text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.75 + index * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={isMobile ? {} : { scale: 1.05 }}
            >
              {search.name}
            </motion.button>
          ))}
        </motion.div>

        {/* CTA Button - Apple式：統一されたイージングとタイミング */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/diagnosis">
            <motion.div
              className="group relative"
              whileHover={isMobile ? {} : { scale: 1.05 }}
              whileTap={isMobile ? {} : { scale: 0.95 }}
            >
              {/* Animated Border - reduced-motion対応 */}
              {isMobile || prefersReducedMotion ? (
                <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-[#7a98ec] via-primary to-[#64e5b3]" />
              ) : (
                <motion.div
                  className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-[#7a98ec] via-primary to-[#64e5b3] bg-[length:200%_100%]"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}

              <div
                className="relative px-8 py-4 rounded-2xl flex items-center gap-3"
                style={{ backgroundColor: "rgba(42, 76, 184, 0.3)" }}
              >
                {isMobile || prefersReducedMotion ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#7a98ec]"
                  >
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ) : (
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#7a98ec]"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                  >
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </motion.svg>
                )}
                <span className="text-white font-semibold">
                  あなたに最適なサプリを診断
                </span>
                {isMobile || prefersReducedMotion ? (
                  <span className="text-white/60">→</span>
                ) : (
                  <motion.span
                    className="text-white/60"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                )}
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
