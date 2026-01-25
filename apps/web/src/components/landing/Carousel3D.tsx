"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useInView,
  useReducedMotion,
  PanInfo,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Award, TrendingUp, Star } from "lucide-react";
import {
  systemColors,
  appleWebColors,
  typography,
  fontStack,
  appleEase,
  subtleSpring,
  tierColors as designTierColors,
  liquidGlass,
  liquidGlassClasses,
  duration,
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

interface Product {
  name: string;
  slug: { current: string };
  priceJPY: number;
  effectiveCostPerDay: number;
  externalImageUrl?: string;
  tierRatings?: {
    overallRank?: string;
  };
  badges?: string[];
  ingredients?: Array<{
    ingredient?: {
      name: string;
    };
  }>;
}

interface Carousel3DProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

// Tier color mapping using design system
const getTierGradient = (tier: string): string => {
  const tierGradients: Record<string, string> = {
    "S+": `linear-gradient(135deg, ${designTierColors["S+"]} 0%, ${systemColors.pink} 100%)`,
    S: `linear-gradient(135deg, ${designTierColors.S} 0%, ${systemColors.indigo} 100%)`,
    A: `linear-gradient(135deg, ${designTierColors.A} 0%, ${systemColors.teal} 100%)`,
    B: `linear-gradient(135deg, ${designTierColors.B} 0%, ${systemColors.green} 100%)`,
    C: `linear-gradient(135deg, ${designTierColors.C} 0%, ${systemColors.yellow} 100%)`,
    D: `linear-gradient(135deg, ${designTierColors.D} 0%, ${appleWebColors.textSecondary} 100%)`,
  };
  return tierGradients[tier] || tierGradients.D;
};

function ProductCard3D({
  product,
  index,
  total,
  rotation,
}: {
  product: Product;
  index: number;
  total: number;
  rotation: number;
}) {
  const angle = (360 / total) * index + rotation;
  const radian = (angle * Math.PI) / 180;
  const radius = 350;

  const x = Math.sin(radian) * radius;
  const z = Math.cos(radian) * radius - radius;
  const rotateY = -angle;

  const opacity = (z + radius * 2) / (radius * 2);
  const isActive = z > -100;

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 will-change-transform"
      style={{
        x: x - 150,
        y: -200,
        z,
        rotateY,
        transformStyle: "preserve-3d",
        transform: "translateZ(0)",
      }}
      animate={{
        scale: isActive ? 1 : 0.85,
        opacity: Math.max(0.3, opacity),
      }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/products/${product.slug.current}`}
        className="block w-[300px]"
      >
        <motion.div
          className={`relative backdrop-blur-[20px] backdrop-saturate-[180%] border rounded-[24px] overflow-hidden transition-all duration-300 will-change-transform ${
            isActive ? "border-white/80" : "border-white/60"
          }`}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            boxShadow: isActive
              ? "0 8px 32px rgba(31, 38, 135, 0.15), inset 0 2px 16px rgba(255, 255, 255, 0.2)"
              : "0 4px 16px rgba(0, 0, 0, 0.04)",
            transform: "translateZ(0)",
          }}
          whileHover={{ scale: 1.05, rotateY: 5 }}
        >
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
            {product.externalImageUrl ? (
              <Image
                src={product.externalImageUrl}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Award className="w-16 h-16 text-white/20" strokeWidth={1} />
              </div>
            )}

            {/* Tier Badge */}
            {product.tierRatings?.overallRank && (
              <div className="absolute top-3 left-3">
                <div
                  className="px-3 py-1.5 rounded-xl font-bold text-white text-base shadow-lg"
                  style={{
                    background: getTierGradient(
                      product.tierRatings.overallRank,
                    ),
                  }}
                >
                  <span className="text-xs font-bold opacity-80 mr-1">
                    RANK
                  </span>
                  {product.tierRatings.overallRank}
                </div>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
                {product.ingredients.slice(0, 2).map((item, i) =>
                  item.ingredient ? (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white backdrop-blur-sm"
                    >
                      {item.ingredient.name}
                    </span>
                  ) : null,
                )}
                {product.ingredients.length > 2 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white">
                    +{product.ingredients.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-sm font-bold text-white mb-4 line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-white/40 mb-0.5">価格</p>
                <p className="text-base font-bold text-white">
                  ¥{(product.priceJPY ?? 0).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/40 mb-0.5">1日あたり</p>
                <p className="text-lg font-black text-[#64e5b3]">
                  ¥{(product.effectiveCostPerDay ?? 0).toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function Carousel3D({
  products,
  title = "おすすめのサプリメント",
  subtitle = "科学的根拠と人気度に基づいた厳選セレクション",
}: Carousel3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const rafRef = useRef<number | null>(null);

  // requestAnimationFrame を使用した滑らかな回転
  useEffect(() => {
    if (!autoRotate || isDragging) return;

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // 60fpsで0.3度回転 = 18度/秒
      setRotation((prev) => prev + (deltaTime / 1000) * 18);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [autoRotate, isDragging]);

  const handleDrag = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setRotation((prev) => prev + info.delta.x * 0.5);
    },
    [],
  );

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    setAutoRotate(false);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setTimeout(() => setAutoRotate(true), 3000);
  }, []);

  const displayProducts = products.slice(0, 10);

  return (
    <section
      ref={containerRef}
      className="relative py-24 bg-[#0A0E27] overflow-hidden"
      style={{ contain: "layout paint" }}
    >
      {/* Background Effects - GPU最適化 */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full will-change-transform"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 102, 224, 0.1) 0%, transparent 70%)",
            filter: "blur(80px)",
            transform: "translateZ(0)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full will-change-transform"
          style={{
            background:
              "radial-gradient(circle, rgba(122, 152, 236, 0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
            transform: "translateZ(0)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: 1,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: duration.scrollFadeIn,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div>
            <motion.span
              className="inline-block text-xs font-semibold tracking-[0.2em] text-white/40 mb-3"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              おすすめ
            </motion.span>
            <h2 className="text-3xl sm:text-4xl font-light text-white mb-2">
              {title}
            </h2>
            <p className="text-white/50">{subtitle}</p>
          </div>
          <Link
            href="/products"
            className="group hidden sm:flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300"
          >
            <span className="text-sm font-semibold text-white">全て見る</span>
            <TrendingUp className="w-4 h-4 text-white/60 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* 3D Carousel */}
        <motion.div
          className="relative h-[500px] cursor-grab active:cursor-grabbing"
          style={{ perspective: 1000 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDrag={handleDrag}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div
            className="absolute top-0 left-1/2 w-full h-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            {displayProducts.map((product, index) => (
              <ProductCard3D
                key={product.slug.current}
                product={product}
                index={index}
                total={displayProducts.length}
                rotation={rotation}
              />
            ))}
          </div>
        </motion.div>

        {/* Navigation Dots */}
        <motion.div
          className="flex justify-center gap-2 mt-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          {displayProducts.map((_, index) => (
            <button
              key={index}
              className="w-2 h-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
              onClick={() =>
                setRotation(-(360 / displayProducts.length) * index)
              }
            />
          ))}
        </motion.div>

        {/* Mobile Link */}
        <motion.div
          className="sm:hidden mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10"
          >
            <span className="text-sm font-semibold text-white">全て見る</span>
            <TrendingUp className="w-4 h-4 text-white/60" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// FlatCarousel用のカードコンポーネント - Apple HIG準拠
function ProductCardFlat({
  product,
  index,
  isInView,
}: {
  product: Product;
  index: number;
  isInView: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <motion.div
      className="flex-shrink-0 w-[280px] sm:w-[320px]"
      initial={{ opacity: 0, y: isMobile ? 15 : 25 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: isMobile ? 0.4 : 0.5,
        delay: isMobile ? 0.04 * Math.min(index, 3) : 0.08 * index,
        ease: appleEase,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/products/${product.slug.current}`}>
        {/* Glass Card */}
        <motion.div
          className="relative rounded-[24px] overflow-hidden border"
          style={{
            ...liquidGlass.light,
            borderColor: isHovered
              ? `rgba(255, 255, 255, 0.8)`
              : "rgba(255, 255, 255, 0.8)",
            boxShadow: isHovered
              ? "0 12px 40px rgba(0, 0, 0, 0.12)"
              : liquidGlass.light.boxShadow,
          }}
          animate={isMobile ? {} : { y: isHovered ? -6 : 0 }}
          transition={subtleSpring}
        >
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {product.externalImageUrl ? (
              <motion.div
                className="relative w-full h-full"
                animate={isMobile ? {} : { scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.4, ease: appleEase }}
              >
                <Image
                  src={product.externalImageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </motion.div>
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: appleWebColors.sectionBackground }}
              >
                <Award
                  className="w-16 h-16"
                  style={{ color: appleWebColors.borderSubtle }}
                  strokeWidth={1}
                  aria-hidden="true"
                />
              </div>
            )}

            {/* Tier Badge */}
            {product.tierRatings?.overallRank && (
              <motion.div
                className="absolute top-3 left-3"
                animate={isMobile ? {} : { scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.3, ease: appleEase }}
              >
                <div
                  className="px-3 py-1.5 rounded-xl font-bold text-white text-base shadow-lg"
                  style={{
                    background: getTierGradient(
                      product.tierRatings.overallRank,
                    ),
                  }}
                >
                  {product.tierRatings.overallRank}
                </div>
              </motion.div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <h3
              className={`${typography.headline} line-clamp-2 min-h-[2.75rem] mb-4`}
              style={{ color: appleWebColors.textPrimary }}
            >
              {product.name}
            </h3>
            <div className="flex items-end justify-between">
              <div>
                <p
                  className="text-[11px] font-medium uppercase tracking-wider mb-1"
                  style={{ color: appleWebColors.textTertiary }}
                >
                  価格
                </p>
                <p
                  className="text-[17px] font-semibold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  ¥{(product.priceJPY ?? 0).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p
                  className="text-[11px] font-medium uppercase tracking-wider mb-1"
                  style={{ color: appleWebColors.textTertiary }}
                >
                  1日あたり
                </p>
                <p
                  className="text-[20px] font-bold"
                  style={{ color: systemColors.green }}
                >
                  ¥{(product.effectiveCostPerDay ?? 0).toFixed(0)}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Accent Line */}
          {!isMobile && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[3px]"
              style={{
                background: `linear-gradient(90deg, ${systemColors.blue}, ${systemColors.indigo})`,
              }}
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

export function FlatCarousel({ products, title, subtitle }: Carousel3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      ref={containerRef}
      className="relative py-24 md:py-32"
      style={{
        backgroundColor: appleWebColors.sectionBackground,
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
          transition={{ duration: duration.scrollFadeIn, ease: appleEase }}
        >
          <div>
            <motion.span
              className="inline-block text-[13px] font-semibold tracking-[0.2em] uppercase mb-3"
              style={{ color: appleWebColors.textTertiary }}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: duration.scrollFadeIn,
                delay: 0.08,
                ease: appleEase,
              }}
            >
              おすすめ
            </motion.span>
            <motion.h2
              className="text-[32px] md:text-[48px] font-bold leading-[1.05] tracking-[-0.015em] mb-2"
              style={{ color: appleWebColors.textPrimary }}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: duration.scrollFadeIn,
                delay: 0.15,
                ease: appleEase,
              }}
            >
              {title || "おすすめのサプリメント"}
            </motion.h2>
            <p
              className={typography.title3}
              style={{ color: appleWebColors.textSecondary }}
            >
              {subtitle}
            </p>
          </div>
          <Link
            href="/products"
            className="group hidden sm:flex items-center gap-2 px-6 py-3 rounded-[24px] border min-h-[44px] backdrop-blur-[20px] backdrop-saturate-[180%]"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              borderColor: "rgba(255, 255, 255, 0.8)",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
            }}
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

        {/* Horizontal Scroll */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <motion.div
            className="flex gap-6 pb-4"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: duration.scrollFadeIn,
              delay: 0.15,
              ease: appleEase,
            }}
          >
            {products.map((product, index) => (
              <ProductCardFlat
                key={product.slug.current}
                product={product}
                index={index}
                isInView={isInView}
              />
            ))}
          </motion.div>
        </div>

        {/* Mobile Link */}
        <motion.div
          className="sm:hidden mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, ease: appleEase }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[24px] border min-h-[44px] backdrop-blur-[20px] backdrop-saturate-[180%]"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              borderColor: "rgba(255, 255, 255, 0.8)",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
            }}
          >
            <span
              className="text-[15px] font-semibold"
              style={{ color: appleWebColors.textPrimary }}
            >
              全て見る
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
