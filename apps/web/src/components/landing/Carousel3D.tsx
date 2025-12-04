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

const tierColors: Record<string, string> = {
  "S+": "from-purple-600 to-pink-600",
  S: "from-purple-600 to-indigo-600",
  A: "from-blue-500 to-cyan-500",
  B: "from-emerald-500 to-teal-500",
  C: "from-yellow-400 to-orange-400",
  D: "from-slate-400 to-slate-500",
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
          className={`relative bg-white/10 backdrop-blur-xl border rounded-3xl overflow-hidden transition-all duration-300 will-change-transform ${
            isActive
              ? "border-white/30 shadow-2xl shadow-primary/20"
              : "border-white/10"
          }`}
          whileHover={{ scale: 1.05, rotateY: 5 }}
          style={{ transform: "translateZ(0)" }}
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
                  className={`px-3 py-1.5 rounded-lg font-black text-white text-lg bg-gradient-to-br ${
                    tierColors[product.tierRatings.overallRank] || tierColors.D
                  } shadow-lg`}
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
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <motion.span
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] uppercase text-white/40 mb-3"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              <Star className="w-4 h-4" />
              Featured Products
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

// FlatCarousel用のカードコンポーネント - Apple式モバイル最適化
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
      className="flex-shrink-0 w-[280px] sm:w-[320px] will-change-transform"
      initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: isMobile ? 0.3 : 0.5,
        delay: isMobile ? 0.05 * Math.min(index, 3) : 0.1 * index,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transform: "translateZ(0)" }}
    >
      <Link href={`/products/${product.slug.current}`}>
        {/* Apple式：モバイルではアニメーションを簡略化 */}
        <motion.div
          className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden will-change-transform shadow-sm"
          animate={
            isMobile
              ? {}
              : {
                  y: isHovered ? -10 : 0,
                  scale: isHovered ? 1.02 : 1,
                  boxShadow: isHovered
                    ? "0 25px 50px -12px rgba(59, 102, 224, 0.25)"
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }
          }
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            transform: "translateZ(0)",
            borderColor:
              !isMobile && isHovered ? "rgba(59, 102, 224, 0.3)" : undefined,
          }}
        >
          {/* Image - モバイルではズーム無効 */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {product.externalImageUrl ? (
              isMobile ? (
                <Image
                  src={product.externalImageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <motion.div
                  className="relative w-full h-full"
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src={product.externalImageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </motion.div>
              )
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                <Award className="w-16 h-16 text-slate-300" strokeWidth={1} />
              </div>
            )}

            {/* Tier Badge - モバイルでは静的 */}
            {product.tierRatings?.overallRank &&
              (isMobile ? (
                <div className="absolute top-3 left-3">
                  <div
                    className={`px-3 py-1.5 rounded-lg font-black text-white text-lg bg-gradient-to-br shadow-lg ${
                      tierColors[product.tierRatings.overallRank] ||
                      tierColors.D
                    }`}
                  >
                    {product.tierRatings.overallRank}
                  </div>
                </div>
              ) : (
                <motion.div
                  className="absolute top-3 left-3"
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`px-3 py-1.5 rounded-lg font-black text-white text-lg bg-gradient-to-br shadow-lg ${
                      tierColors[product.tierRatings.overallRank] ||
                      tierColors.D
                    }`}
                  >
                    {product.tierRatings.overallRank}
                  </div>
                </motion.div>
              ))}

            {/* Hover Overlay - デスクトップのみ */}
            {!isMobile && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4 line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-slate-400">価格</p>
                <p className="text-base font-bold text-slate-800">
                  ¥{(product.priceJPY ?? 0).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400">1日あたり</p>
                {isMobile ? (
                  <p className="text-lg font-black text-primary">
                    ¥{(product.effectiveCostPerDay ?? 0).toFixed(0)}
                  </p>
                ) : (
                  <motion.p
                    className="text-lg font-black text-primary"
                    animate={{ scale: isHovered ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    ¥{(product.effectiveCostPerDay ?? 0).toFixed(0)}
                  </motion.p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Accent - デスクトップのみ */}
          {!isMobile && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-[#7a98ec]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
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
      className="relative py-24 bg-slate-50"
      style={{ contain: "layout paint" }}
    >
      {/* Background subtle pattern - モバイルでは非表示 */}
      {!isMobile && (
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #3b66e0 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header - Apple式：モバイルで簡略化 */}
        <motion.div
          className="flex items-center justify-between mb-10"
          initial={{ opacity: 0, y: isMobile ? 15 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: isMobile ? 0.5 : 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div>
            <motion.span
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] uppercase text-slate-400 mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* スターアニメーション - モバイル・reduced-motionでは無効 */}
              {isMobile || prefersReducedMotion ? (
                <Star className="w-4 h-4" />
              ) : (
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <Star className="w-4 h-4" />
                </motion.div>
              )}
              Featured Products
            </motion.span>
            <motion.h2
              className="text-3xl sm:text-4xl font-light text-slate-800 mb-2"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {title || "おすすめのサプリメント"}
            </motion.h2>
            <p className="text-slate-500">{subtitle}</p>
          </div>
          <Link
            href="/products"
            className="group hidden sm:flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
          >
            <span className="text-sm font-semibold text-slate-700">
              全て見る
            </span>
            <TrendingUp className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Horizontal Scroll - GPU最適化 */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <motion.div
            className="flex gap-6 pb-4"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
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
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 shadow-md"
          >
            <span className="text-sm font-semibold text-slate-700">
              全て見る
            </span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
