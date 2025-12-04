"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import { TrendingUp, Sparkles, Beaker } from "lucide-react";

// Apple式：モバイル検出
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

interface IngredientWithStats {
  name: string;
  nameEn: string;
  category: string;
  description: string;
  slug: { current: string };
  productCount: number;
  minPrice: number;
}

interface MasonryIngredientsProps {
  ingredients: IngredientWithStats[];
  title?: string;
  subtitle?: string;
}

const categoryColors: Record<string, string> = {
  ビタミン: "#64e5b3",
  ミネラル: "#3b66e0",
  アミノ酸: "#7a98ec",
  ハーブ: "#5a7fe6",
  その他: "#8b9fd9",
};

// 事前計算されたフローティングアニメーションパラメータ
const FLOAT_PARAMS = [
  { delay: 0, duration: 5 },
  { delay: 0.3, duration: 6 },
  { delay: 0.6, duration: 5 },
  { delay: 0.9, duration: 6 },
  { delay: 1.2, duration: 5 },
  { delay: 1.5, duration: 6 },
  { delay: 1.8, duration: 5 },
  { delay: 2.1, duration: 6 },
];

function IngredientCard({
  ingredient,
  index,
  size = "normal",
}: {
  ingredient: IngredientWithStats;
  index: number;
  size?: "small" | "normal" | "large";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  // Apple式：モバイルではパララックス無効
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile
      ? [0, 0]
      : [20 * (index % 2 === 0 ? 1 : -1), -20 * (index % 2 === 0 ? 1 : -1)],
  );

  const sizeClasses = {
    small: "aspect-[3/4]",
    normal: "aspect-square",
    large: "aspect-[4/5]",
  };

  const color = categoryColors[ingredient.category] || categoryColors.その他;
  const floatParam = FLOAT_PARAMS[index % FLOAT_PARAMS.length];

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <motion.div
      ref={ref}
      className="will-change-transform"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: isMobile ? 0.4 : 0.6,
        delay: isMobile ? index * 0.05 : index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transform: "translateZ(0)" }}
    >
      <motion.div style={{ y }} className="will-change-transform">
        <Link href={`/search?q=${encodeURIComponent(ingredient.name)}`}>
          <motion.div
            className={`relative ${sizeClasses[size]} rounded-2xl overflow-hidden cursor-pointer will-change-transform shadow-md`}
            animate={
              isMobile
                ? {}
                : {
                    scale: isHovered ? 1.03 : 1,
                    y: isHovered ? -8 : 0,
                    boxShadow: isHovered
                      ? `0 20px 40px -10px ${color}40, 0 12px 24px -12px rgba(0,0,0,0.25)`
                      : `0 4px 20px -5px ${color}25, 0 8px 16px -8px rgba(0,0,0,0.15)`,
                  }
            }
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ transform: "translateZ(0)" }}
          >
            {/* Card Background */}
            <div className="absolute inset-0 bg-white">
              {/* Subtle gradient background */}
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  background: `linear-gradient(135deg, ${color} 0%, transparent 60%)`,
                }}
              />
            </div>

            {/* Top Section - Icon/Visual */}
            <div className="absolute top-0 left-0 right-0 h-[55%] overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
                }}
              />

              {/* Decorative circles - Apple式：モバイルでは静的 */}
              {isMobile || prefersReducedMotion ? (
                <>
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
                    style={{ backgroundColor: color }}
                  />
                  <div
                    className="absolute bottom-0 -left-8 w-24 h-24 rounded-full opacity-10"
                    style={{ backgroundColor: color }}
                  />
                </>
              ) : (
                <>
                  <motion.div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 will-change-transform"
                    style={{
                      backgroundColor: color,
                      transform: "translateZ(0)",
                    }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute bottom-0 -left-8 w-24 h-24 rounded-full opacity-10 will-change-transform"
                    style={{
                      backgroundColor: color,
                      transform: "translateZ(0)",
                    }}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />
                </>
              )}

              {/* Category Badge - モバイルでは静的 */}
              {isMobile ? (
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${color}20`,
                      color: color,
                    }}
                  >
                    <Beaker className="w-2.5 h-2.5" />
                    {ingredient.category}
                  </span>
                </div>
              ) : (
                <motion.div
                  className="absolute top-3 left-3 z-10"
                  animate={{ scale: isHovered ? 1.05 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${color}20`,
                      color: color,
                    }}
                  >
                    <Beaker className="w-2.5 h-2.5" />
                    {ingredient.category}
                  </span>
                </motion.div>
              )}

              {/* Centered Icon - Apple式：モバイルでは静的 */}
              <div className="absolute inset-0 flex items-center justify-center">
                {isMobile ? (
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                    }}
                  >
                    <span className="text-white text-2xl font-bold">
                      {ingredient.name.charAt(0)}
                    </span>
                  </div>
                ) : (
                  <motion.div
                    className="relative will-change-transform"
                    animate={{
                      scale: isHovered ? 1.1 : 1,
                      rotate: isHovered ? 5 : 0,
                    }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transform: "translateZ(0)" }}
                  >
                    {/* Icon Glow */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
                        filter: "blur(10px)",
                      }}
                      animate={{
                        opacity: isHovered ? 1 : 0,
                        scale: isHovered ? 1.3 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg relative z-10"
                      style={{
                        background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                      }}
                    >
                      <span className="text-white text-2xl font-bold">
                        {ingredient.name.charAt(0)}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Bottom Section - Content */}
            <div className="absolute bottom-0 left-0 right-0 h-[45%] p-4 flex flex-col justify-between bg-white">
              {/* Name - モバイルでは静的 */}
              <div>
                {isMobile ? (
                  <h3 className="text-base font-bold text-slate-800 mb-0.5 line-clamp-1">
                    {ingredient.name}
                  </h3>
                ) : (
                  <motion.h3
                    className="text-base font-bold text-slate-800 mb-0.5 line-clamp-1 transition-colors"
                    animate={{ color: isHovered ? color : "#1e293b" }}
                    transition={{ duration: 0.3 }}
                  >
                    {ingredient.name}
                  </motion.h3>
                )}
                <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                  {ingredient.nameEn}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider">
                    商品
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {ingredient.productCount}
                    <span className="text-[10px] font-normal ml-0.5">種類</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider">
                    最安
                  </p>
                  {isMobile ? (
                    <p className="text-sm font-bold" style={{ color }}>
                      ¥{ingredient.minPrice.toLocaleString()}
                    </p>
                  ) : (
                    <motion.p
                      className="text-sm font-bold"
                      style={{ color }}
                      animate={{ scale: isHovered ? 1.1 : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      ¥{ingredient.minPrice.toLocaleString()}
                    </motion.p>
                  )}
                </div>
                {/* TrendingUp icon - デスクトップのみ */}
                {!isMobile && (
                  <motion.div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${color}15` }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      scale: isHovered ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <TrendingUp className="w-4 h-4" style={{ color }} />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Hover Border Effect - デスクトップのみ */}
            {!isMobile && (
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  boxShadow: `inset 0 0 0 2px ${color}30`,
                }}
              />
            )}

            {/* Bottom Accent Line - デスクトップのみ */}
            {!isMobile && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: color }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export function MasonryIngredients({
  ingredients,
  title = "人気の成分",
  subtitle = "科学的根拠に基づいた成分ガイド",
}: MasonryIngredientsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const displayIngredients = ingredients.slice(0, 8);

  const sizes: Array<"small" | "normal" | "large"> = [
    "large",
    "normal",
    "small",
    "normal",
    "large",
    "small",
    "normal",
    "large",
  ];

  return (
    <section
      ref={ref}
      className="relative py-24 bg-white overflow-hidden"
      style={{ contain: "layout paint" }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #3b66e0 1px, transparent 0)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header - 強化版 */}
        <motion.div
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <motion.span
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] uppercase text-slate-400 mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              Popular Ingredients
            </motion.span>
            <motion.h2
              className="text-3xl sm:text-4xl font-light text-slate-800 mb-2"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {title}
            </motion.h2>
            <p className="text-slate-500">{subtitle}</p>
          </div>
          <Link
            href="/ingredients"
            className="group hidden sm:flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
          >
            <span className="text-sm font-semibold text-slate-700">
              全て見る
            </span>
            <TrendingUp className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayIngredients.map((ingredient, index) => (
            <IngredientCard
              key={ingredient.slug.current}
              ingredient={ingredient}
              index={index}
              size={sizes[index % sizes.length]}
            />
          ))}
        </div>

        {/* Mobile Link */}
        <motion.div
          className="sm:hidden mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/ingredients"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 shadow-md"
          >
            <span className="text-sm font-semibold text-slate-700">
              すべての成分を見る
            </span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
