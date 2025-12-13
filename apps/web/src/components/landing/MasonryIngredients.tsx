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
import { TrendingUp, Beaker } from "lucide-react";
import {
  systemColors,
  appleWebColors,
  typography,
  fontStack,
  appleEase,
  subtleSpring,
  liquidGlassClasses,
} from "@/lib/design-system";

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

// Category colors using Apple system colors
const categoryColors: Record<string, string> = {
  ビタミン: systemColors.green,
  ミネラル: systemColors.blue,
  アミノ酸: systemColors.indigo,
  ハーブ: systemColors.teal,
  その他: systemColors.purple,
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

  const sizeClasses = {
    small: "aspect-[3/4]",
    normal: "aspect-square",
    large: "aspect-[4/5]",
  };

  const color = categoryColors[ingredient.category] || categoryColors.その他;

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: isMobile ? index * 0.04 : index * 0.08,
        ease: appleEase,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/search?q=${encodeURIComponent(ingredient.name)}`}>
        <motion.div
          className={`relative ${sizeClasses[size]} overflow-hidden ${liquidGlassClasses.light}`}
          style={{
            borderColor: isHovered ? `${color}30` : "rgba(255, 255, 255, 0.8)",
            boxShadow: isHovered
              ? "0 12px 40px rgba(0, 0, 0, 0.12)"
              : "0 4px 24px rgba(0, 0, 0, 0.06)",
          }}
          animate={isMobile ? {} : { y: isHovered ? -6 : 0 }}
          transition={subtleSpring}
        >
          {/* Top Section - Icon/Visual */}
          <div
            className="absolute top-0 left-0 right-0 h-[55%] overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${color}12 0%, ${color}05 100%)`,
            }}
          >
            {/* Category Badge */}
            <motion.div
              className="absolute top-3 left-3 z-10"
              animate={isMobile ? {} : { scale: isHovered ? 1.03 : 1 }}
              transition={{ duration: 0.3, ease: appleEase }}
            >
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{
                  backgroundColor: `${color}18`,
                  color: color,
                }}
              >
                <Beaker className="w-3 h-3" aria-hidden="true" />
                {ingredient.category}
              </span>
            </motion.div>

            {/* Centered Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative"
                animate={isMobile ? {} : { scale: isHovered ? 1.08 : 1 }}
                transition={{ duration: 0.3, ease: appleEase }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                  }}
                >
                  <span className="text-white text-xl font-bold">
                    {ingredient.name.charAt(0)}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Section - Content */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[45%] p-4 flex flex-col justify-between"
            style={{ backgroundColor: "white" }}
          >
            {/* Name */}
            <div>
              <h3
                className={`${typography.headline} line-clamp-1 mb-0.5`}
                style={{
                  color: isHovered ? color : appleWebColors.textPrimary,
                  transition: "color 0.3s ease",
                }}
              >
                {ingredient.name}
              </h3>
              <p
                className="text-[11px] font-medium tracking-wide uppercase"
                style={{ color: appleWebColors.textTertiary }}
              >
                {ingredient.nameEn}
              </p>
            </div>

            {/* Stats */}
            <div
              className="flex items-center justify-between pt-2 border-t"
              style={{ borderColor: appleWebColors.borderSubtle }}
            >
              <div>
                <p
                  className="text-[10px] uppercase tracking-wider mb-0.5"
                  style={{ color: appleWebColors.textTertiary }}
                >
                  商品
                </p>
                <p
                  className="text-[15px] font-semibold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  {ingredient.productCount}
                  <span className="text-[11px] font-normal ml-0.5">種類</span>
                </p>
              </div>
              <div className="text-right">
                <p
                  className="text-[10px] uppercase tracking-wider mb-0.5"
                  style={{ color: appleWebColors.textTertiary }}
                >
                  最安
                </p>
                <p className="text-[15px] font-bold" style={{ color }}>
                  ¥{ingredient.minPrice.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Accent Line */}
          {!isMobile && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[3px]"
              style={{ backgroundColor: color }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, ease: appleEase }}
            />
          )}
        </motion.div>
      </Link>
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
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

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
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
        contain: "layout paint",
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: appleEase }}
        >
          <div>
            <motion.span
              className="inline-block text-[13px] font-semibold tracking-[0.2em] uppercase mb-3"
              style={{ color: appleWebColors.textTertiary }}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: appleEase }}
            >
              成分を知る
            </motion.span>
            <motion.h2
              className="text-[32px] md:text-[48px] font-bold leading-[1.05] tracking-[-0.015em] mb-2"
              style={{ color: appleWebColors.textPrimary }}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: appleEase }}
            >
              {title}
            </motion.h2>
            <p
              className={typography.title3}
              style={{ color: appleWebColors.textSecondary }}
            >
              {subtitle}
            </p>
          </div>
          <Link
            href="/ingredients"
            className={`group hidden sm:flex items-center gap-2 px-6 py-3 rounded-full min-h-[44px] ${liquidGlassClasses.light}`}
          >
            <span
              className="text-[15px] font-semibold"
              style={{ color: appleWebColors.textPrimary }}
            >
              全て見る
            </span>
            <TrendingUp
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              style={{ color: appleWebColors.textSecondary }}
              aria-hidden="true"
            />
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
          transition={{ delay: 0.5, ease: appleEase }}
        >
          <Link
            href="/ingredients"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full min-h-[44px] ${liquidGlassClasses.light}`}
          >
            <span
              className="text-[15px] font-semibold"
              style={{ color: appleWebColors.textPrimary }}
            >
              すべての成分を見る
            </span>
            <TrendingUp
              className="w-4 h-4"
              style={{ color: appleWebColors.textSecondary }}
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
