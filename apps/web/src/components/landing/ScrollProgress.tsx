"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

interface ScrollProgressProps {
  className?: string;
  color?: string;
  height?: number;
  showPercentage?: boolean;
}

export function ScrollProgress({
  className = "",
  color = "linear-gradient(90deg, #7a98ec, #3b66e0, #64e5b3)",
  height = 3,
  showPercentage = false,
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const [percentage, setPercentage] = useState(0);

  // Apple式スプリング設定
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // パーセンテージ表示用
  useEffect(() => {
    if (!showPercentage) return;
    const unsubscribe = scrollYProgress.on("change", (value) => {
      setPercentage(Math.round(value * 100));
    });
    return () => unsubscribe();
  }, [scrollYProgress, showPercentage]);

  return (
    <>
      {/* Main Progress Bar */}
      <motion.div
        className={`fixed top-0 left-0 right-0 z-[9999] origin-left will-change-transform ${className}`}
        style={{
          scaleX,
          height,
          background: color,
          transform: "translateZ(0)",
        }}
      />

      {/* Glow Effect */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[9998] origin-left will-change-transform pointer-events-none"
        style={{
          scaleX,
          height: height + 4,
          background: color,
          filter: "blur(8px)",
          opacity: 0.5,
          transform: "translateZ(0)",
        }}
      />

      {/* Percentage Badge */}
      {showPercentage && (
        <motion.div
          className="fixed top-4 right-4 z-[9999] bg-slate-900/80 backdrop-blur-sm text-white text-xs font-mono px-3 py-1.5 rounded-full will-change-transform"
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transform: "translateZ(0)" }}
        >
          <span className="tabular-nums">{percentage}%</span>
        </motion.div>
      )}
    </>
  );
}

export function ScrollProgressCircle({
  size = 60,
  strokeWidth = 3,
  color = "#3b66e0",
}: {
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const { scrollYProgress } = useScroll();
  const [percentage, setPercentage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Apple式スプリング設定
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // 事前計算（useMemoで最適化）
  const { radius, circumference } = useMemo(() => {
    const r = (size - strokeWidth) / 2;
    return {
      radius: r,
      circumference: 2 * Math.PI * r,
    };
  }, [size, strokeWidth]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      setPercentage(Math.round(value * 100));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-[9999] will-change-transform"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: "spring", damping: 20 }}
      style={{ transform: "translateZ(0)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-full will-change-transform"
        style={{
          background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
          filter: "blur(10px)",
          transform: "translateZ(0)",
        }}
        animate={{
          scale: isHovered ? 1.5 : 1.2,
          opacity: isHovered ? 0.8 : 0.5,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* SVG Circle */}
      <motion.svg
        width={size}
        height={size}
        className="-rotate-90 will-change-transform"
        style={{ transform: "translateZ(0) rotate(-90deg)" }}
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="rgba(255,255,255,0.1)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={strokeWidth}
        />

        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            pathLength,
            strokeDasharray: circumference,
            strokeDashoffset: 0,
          }}
        />

        {/* Gradient Overlay for Progress */}
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#7a98ec" />
            <stop offset="50%" stopColor={color} />
            <stop offset="100%" stopColor="#64e5b3" />
          </linearGradient>
        </defs>
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            pathLength,
            strokeDasharray: circumference,
            strokeDashoffset: 0,
            opacity: 0.5,
          }}
        />
      </motion.svg>

      {/* Percentage Text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center will-change-transform"
        style={{ transform: "translateZ(0)" }}
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="font-mono text-xs font-bold text-white tabular-nums">
          {percentage}
        </span>
      </motion.div>

      {/* Pulse Ring on Hover */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 will-change-transform pointer-events-none"
        style={{
          borderColor: `${color}50`,
          transform: "translateZ(0)",
        }}
        animate={{
          scale: isHovered ? [1, 1.3, 1.3] : 1,
          opacity: isHovered ? [0.5, 0, 0] : 0,
        }}
        transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
      />
    </motion.div>
  );
}

// ミニマルな線形プログレスバー（ヘッダー埋め込み用）
export function ScrollProgressMinimal({
  height = 2,
  className = "",
}: {
  height?: number;
  className?: string;
}) {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
    restDelta: 0.001,
  });

  // スクロール位置に応じて色が変化
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#7a98ec", "#3b66e0", "#64e5b3"],
  );

  return (
    <motion.div
      className={`origin-left will-change-transform ${className}`}
      style={{
        scaleX,
        height,
        backgroundColor,
        transform: "translateZ(0)",
      }}
    />
  );
}
