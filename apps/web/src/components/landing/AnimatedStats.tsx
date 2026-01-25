"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Package, BarChart3, CheckCircle2 } from "lucide-react";
import {
  systemColors,
  appleWebColors,
  typography,
  fontStack,
  appleEase,
  subtleSpring,
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

interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
  sublabel?: string;
  color?: string;
  delay?: number;
  icon?: React.ElementType;
  skipAnimation?: boolean;
}

function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const startTime = performance.now(); // より高精度なタイミング

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Apple式イージング: cubic-bezier(0.22, 1, 0.36, 1)
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(Math.floor(easeOutExpo * value));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

function StatCard({
  value,
  suffix,
  label,
  sublabel,
  color = systemColors.blue,
  delay = 0,
  icon: Icon,
  skipAnimation = false,
}: StatItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <motion.div
      ref={ref}
      className="relative group will-change-transform"
      initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: duration.scrollFadeIn, delay, ease: appleEase }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glass Card Container */}
      <motion.div
        className={`relative h-full p-8 overflow-hidden ${liquidGlassClasses.light}`}
        style={{
          boxShadow: isHovered
            ? "0 12px 40px rgba(0, 0, 0, 0.12)"
            : "0 4px 24px rgba(0, 0, 0, 0.06)",
        }}
        animate={isMobile ? {} : { y: isHovered ? -4 : 0 }}
        transition={subtleSpring}
      >
        {/* Icon */}
        {Icon && (
          <motion.div
            className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
            }}
            animate={isMobile ? {} : { scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3, ease: appleEase }}
          >
            <Icon className="w-7 h-7 text-white" aria-hidden="true" />
          </motion.div>
        )}

        {/* Value */}
        <div className="mb-4">
          <span
            className="text-[48px] md:text-[56px] font-bold leading-[1.05] tracking-[-0.015em] tabular-nums"
            style={{ color }}
          >
            {skipAnimation ? (
              <span className="tabular-nums">
                {value.toLocaleString()}
                {suffix}
              </span>
            ) : (
              <AnimatedNumber value={value} suffix={suffix} />
            )}
          </span>
        </div>

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: duration.scrollFadeIn,
            delay: delay + 0.15,
            ease: appleEase,
          }}
        >
          <p
            className={typography.headline}
            style={{ color: appleWebColors.textPrimary }}
          >
            {label}
          </p>
          {sublabel && (
            <p
              className={`${typography.subhead} mt-1`}
              style={{ color: appleWebColors.textSecondary }}
            >
              {sublabel}
            </p>
          )}
        </motion.div>

        {/* Subtle accent gradient */}
        <div
          className="absolute top-0 right-0 w-32 h-32 opacity-[0.08] pointer-events-none"
          style={{
            background: `radial-gradient(circle at 100% 0%, ${color} 0%, transparent 70%)`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

interface AnimatedStatsProps {
  totalProducts: number;
  className?: string;
}

export function AnimatedStats({
  totalProducts,
  className = "",
}: AnimatedStatsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const stats: (StatItemProps & { key: string })[] = [
    {
      key: "products",
      value: totalProducts || 400,
      suffix: "+",
      label: "厳選サプリメント",
      sublabel: "科学的根拠に基づいた商品",
      color: systemColors.blue,
      icon: Package,
    },
    {
      key: "evaluation",
      value: 5,
      suffix: "軸",
      label: "多角的評価",
      sublabel: "価格・成分・コスパ・根拠・安全性",
      color: systemColors.indigo,
      icon: BarChart3,
      skipAnimation: true,
    },
    {
      key: "free",
      value: 0,
      suffix: "円",
      label: "すべて無料",
      sublabel: "全機能をずっと無料で利用可能",
      color: systemColors.green,
      icon: CheckCircle2,
    },
  ];

  return (
    <section
      ref={ref}
      className={`relative py-24 md:py-32 ${className}`}
      style={{
        backgroundColor: appleWebColors.sectionBackground,
        fontFamily: fontStack,
        contain: "layout paint",
      }}
    >
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: duration.scrollFadeIn, ease: appleEase }}
        >
          <motion.span
            className="inline-block text-[13px] font-semibold tracking-[0.2em] uppercase mb-4"
            style={{ color: appleWebColors.textTertiary }}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: duration.scrollFadeIn,
              delay: 0.08,
              ease: appleEase,
            }}
          >
            データで示す
          </motion.span>
          <motion.h2
            className="text-[32px] md:text-[48px] font-bold leading-[1.05] tracking-[-0.015em]"
            style={{ color: appleWebColors.textPrimary }}
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: duration.scrollFadeIn,
              delay: 0.15,
              ease: appleEase,
            }}
          >
            サプティアの実績
          </motion.h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.key}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              sublabel={stat.sublabel}
              color={stat.color}
              icon={stat.icon}
              delay={0.3 + index * 0.12}
              skipAnimation={stat.skipAnimation}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
