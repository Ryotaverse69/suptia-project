"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";

interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
  sublabel?: string;
  color?: string;
  delay?: number;
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
  color = "#3b66e0",
  delay = 0,
}: StatItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <motion.div
      ref={ref}
      className="relative group will-change-transform"
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
        transform: "translateZ(0)", // GPU レイヤー強制
      }}
    >
      {/* Card Container */}
      <motion.div
        className="relative h-full bg-white border border-slate-200 rounded-3xl p-8 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 will-change-transform"
        animate={{
          rotateY: isHovered ? 5 : 0,
          rotateX: isHovered ? -5 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          transformStyle: "preserve-3d",
          transform: "translateZ(0)",
        }}
      >
        {/* Background Glow - 強化版 */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, ${color}20 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, ${color}15 0%, transparent 50%)
            `,
          }}
        />

        {/* Animated Border Glow */}
        <motion.div
          className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${color}40 0%, transparent 40%, transparent 60%, ${color}40 100%)`,
          }}
        />

        {/* Floating Particles - カード内の微細エフェクト */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: `${color}30`,
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Value with enhanced styling */}
          <div className="mb-4">
            <motion.span
              className="text-5xl sm:text-6xl lg:text-7xl font-extralight tracking-tight will-change-transform"
              style={{
                color,
                textShadow: isHovered ? `0 0 40px ${color}30` : "none",
                transition: "text-shadow 0.3s ease",
              }}
            >
              <AnimatedNumber value={value} suffix={suffix} />
            </motion.span>
          </div>

          {/* Label with stagger animation */}
          <motion.div
            className="space-y-1"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: delay + 0.3 }}
          >
            <p className="text-slate-800 text-lg font-medium">{label}</p>
            {sublabel && <p className="text-slate-500 text-sm">{sublabel}</p>}
          </motion.div>
        </div>

        {/* Enhanced Shine Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.4) 50%, transparent 55%)",
            transform: "translateX(-100%)",
          }}
          animate={isHovered ? { transform: "translateX(100%)" } : {}}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Corner Accent */}
        <div
          className="absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
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

  const stats = [
    {
      value: totalProducts || 400,
      suffix: "+",
      label: "Products",
      sublabel: "厳選されたサプリメント",
      color: "#3b66e0",
    },
    {
      value: 5,
      suffix: "軸",
      label: "Evaluation",
      sublabel: "多角的評価システム",
      color: "#7a98ec",
    },
    {
      value: 0,
      suffix: "円",
      label: "Forever Free",
      sublabel: "すべての機能が無料",
      color: "#64e5b3",
    },
  ];

  return (
    <section
      ref={ref}
      className={`relative py-20 bg-slate-50 ${className}`}
      style={{ contain: "layout paint" }}
    >
      {/* Decorative Line - 強化版 */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px will-change-transform"
        style={{
          background:
            "linear-gradient(90deg, transparent, #cbd5e1 30%, #cbd5e1 70%, transparent)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Background subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #3b66e0 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Title - 強化版 */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-slate-400 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Our Numbers
          </motion.span>
          <motion.h2
            className="text-3xl sm:text-4xl font-light text-slate-800"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            数字で見る
            <span className="bg-gradient-to-r from-[#7a98ec] to-primary bg-clip-text text-transparent ml-2">
              Suptia
            </span>
          </motion.h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} {...stat} delay={0.3 + index * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
}
