"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// パーティクルの位置を事前計算（Apple式：ランダム値を再レンダリングで変えない）
const PARTICLE_POSITIONS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`, // 擬似ランダムだが固定値
  top: `${(i * 23 + 11) % 100}%`,
  duration: 4 + (i % 3),
  delay: (i % 5) * 0.6,
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

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const logoScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.5]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.3], [0.1, 0]);

  const springConfig = { damping: 25, stiffness: 100 };
  const springMouseX = useSpring(mouseX, springConfig);
  const springMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);

    // Apple式：requestAnimationFrameでマウス移動を間引き
    let rafId: number | null = null;
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;

      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          const { innerWidth, innerHeight } = window;
          mouseX.set((lastX - innerWidth / 2) / 50);
          mouseY.set((lastY - innerHeight / 2) / 50);
          rafId = null;
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY]);

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
      {/* Animated Gradient Background */}
      <motion.div className="absolute inset-0 -z-20" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a4cb8] via-[#3b66e0] to-[#2a4cb8]" />

        {/* Mesh Gradient Overlays - Animated */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 40%, rgba(100, 229, 179, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse 60% 60% at 80% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse 50% 70% at 40% 80%, rgba(122, 152, 236, 0.35) 0%, transparent 50%),
              radial-gradient(ellipse 70% 50% at 70% 60%, rgba(255, 255, 255, 0.25) 0%, transparent 50%)
            `,
            x: springMouseX,
            y: springMouseY,
          }}
        />
        {/* Static Light Orbs */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(100, 229, 179, 0.4) 0%, transparent 60%)",
            filter: "blur(80px)",
            left: "10%",
            top: "20%",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, transparent 60%)",
            filter: "blur(60px)",
            right: "5%",
            bottom: "10%",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(122, 152, 236, 0.3) 0%, transparent 60%)",
            filter: "blur(70px)",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Animated Grid Pattern */}
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
      </motion.div>

      {/* Floating SUPTIA Logo Background */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center -z-10 select-none pointer-events-none"
        style={{
          scale: logoScale,
          opacity: logoOpacity,
        }}
      >
        <motion.span
          className="text-[20vw] font-black tracking-tighter text-white/5"
          style={{
            x: useTransform(springMouseX, (v) => v * -3),
            y: useTransform(springMouseY, (v) => v * -3),
          }}
        >
          SUPTIA
        </motion.span>
      </motion.div>

      {/* Floating Particles - GPU最適化版 */}
      {mounted && (
        <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
          {PARTICLE_POSITIONS.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 rounded-full bg-white/20 will-change-transform"
              style={{
                left: particle.left,
                top: particle.top,
                transform: "translateZ(0)", // GPU レイヤー強制
              }}
              animate={{
                y: [0, -80, 0],
                opacity: [0, 0.8, 0],
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

        {/* Search Box */}
        <motion.form
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <motion.div
            className="relative group"
            animate={{ scale: isFocused ? 1.02 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Glow Effect */}
            <motion.div
              className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#7a98ec] via-primary to-[#5a7fe6] opacity-0 blur-xl transition-opacity duration-500"
              animate={{
                opacity: isFocused ? 0.5 : 0,
              }}
            />

            {/* Search Input Container */}
            <div
              className={`relative flex items-center rounded-2xl overflow-hidden transition-all duration-500 ${
                isFocused
                  ? "bg-white shadow-2xl shadow-primary/20"
                  : "bg-white/10 backdrop-blur-xl border border-white/20"
              }`}
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 text-white">検索</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.form>

        {/* Popular Searches */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-1.5 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <span className="text-white/40 text-xs mr-1">人気:</span>
          {popularSearches.slice(0, 5).map((search, index) => (
            <motion.button
              key={search.name}
              onClick={() =>
                router.push(`/search?q=${encodeURIComponent(search.name)}`)
              }
              className="px-2.5 py-1 rounded-full text-xs text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              {search.name}
            </motion.button>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <Link href="/diagnosis">
            <motion.div
              className="group relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated Border */}
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

              <div
                className="relative px-8 py-4 rounded-2xl flex items-center gap-3"
                style={{ backgroundColor: "rgba(42, 76, 184, 0.3)" }}
              >
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
                <span className="text-white font-semibold">
                  あなたに最適なサプリを診断
                </span>
                <motion.span
                  className="text-white/60"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
