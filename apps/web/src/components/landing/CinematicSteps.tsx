"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { MessageCircle, Sparkles, CheckCircle2 } from "lucide-react";
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

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "AIに相談",
    description:
      "悩みを伝えるだけ。AIコンシェルジュが、あなたの判断スタイルに合わせて一緒に考えます。",
    icon: MessageCircle,
    color: systemColors.blue,
    gradient: `from-[${systemColors.blue}] to-[${systemColors.teal}]`,
  },
  {
    number: "02",
    title: "理由を理解",
    description:
      "なぜおすすめなのか、理由がわかる。健康判断に必要な5つの視点で、選んだ根拠と注意点を解説します。",
    icon: Sparkles,
    color: systemColors.indigo,
    gradient: `from-[${systemColors.indigo}] to-[${systemColors.blue}]`,
  },
  {
    number: "03",
    title: "安心して選べる",
    description:
      "後悔しない選択を。理由がわかるから安心できる。最安値も自動で見つけて比較できます。",
    icon: CheckCircle2,
    color: systemColors.green,
    gradient: `from-[${systemColors.green}] to-[${systemColors.teal}]`,
  },
];

// パーティクル位置の事前計算
const STEP_PARTICLES = [
  { left: "15%", top: "20%", size: 2, duration: 3, delay: 0 },
  { left: "85%", top: "30%", size: 3, duration: 4, delay: 1 },
  { left: "10%", top: "70%", size: 2, duration: 3.5, delay: 0.5 },
  { left: "90%", top: "80%", size: 2, duration: 4.5, delay: 1.5 },
];

function StepCard({ step, index }: { step: Step; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      className="relative min-h-screen flex items-center justify-center snap-start px-4 sm:px-8 will-change-transform"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: duration.scrollFadeIn, ease: [0.22, 1, 0.36, 1] }}
      style={{ transform: "translateZ(0)" }}
    >
      {/* Background Number - GPU最適化 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden will-change-transform"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 0.03, scale: 1 } : {}}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ transform: "translateZ(0)" }}
      >
        <span className="text-[40vw] font-black text-white leading-none">
          {step.number}
        </span>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Step Number */}
        <motion.div
          className="mb-8 will-change-transform"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: duration.scrollFadeIn,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ transform: "translateZ(0)" }}
        >
          <span
            className={`inline-block text-sm font-bold tracking-[0.3em] uppercase bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}
          >
            Step {step.number}
          </span>
        </motion.div>

        {/* Icon - 強化版 */}
        <motion.div
          className="mb-8 flex justify-center will-change-transform"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{
            duration: duration.scrollFadeIn,
            delay: 0.25,
            type: "spring",
            stiffness: 200,
          }}
          style={{ transform: "translateZ(0)" }}
        >
          <motion.div
            className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center"
            style={{ backgroundColor: `${step.color}15` }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            {/* Enhanced Glow */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: `radial-gradient(circle, ${step.color}40 0%, transparent 70%)`,
                filter: "blur(20px)",
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <Icon
              className="relative z-10 w-12 h-12 sm:w-16 sm:h-16"
              style={{ color: step.color }}
              strokeWidth={1.5}
            />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h3
          className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6 will-change-transform"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: duration.scrollFadeIn,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ transform: "translateZ(0)" }}
        >
          {step.title}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed will-change-transform"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: duration.scrollFadeIn,
            delay: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ transform: "translateZ(0)" }}
        >
          {step.description}
        </motion.p>

        {/* Decorative Particles - GPU最適化版 */}
        {STEP_PARTICLES.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full will-change-transform"
            style={{
              backgroundColor: step.color,
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              transform: "translateZ(0)",
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
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
    </motion.div>
  );
}

export function CinematicSteps() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section
      ref={containerRef}
      className="relative bg-[#0A0E27]"
      style={{ contain: "layout paint" }}
    >
      {/* Progress Bar */}
      <div className="fixed top-1/2 right-8 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-2">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="w-3 h-3 rounded-full border-2 transition-colors duration-300"
              style={{
                borderColor: step.color,
                backgroundColor: "transparent",
              }}
            />
            {index < steps.length - 1 && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-8 bg-white/10" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Steps */}
      <div className="snap-y snap-mandatory h-screen overflow-y-auto scrollbar-hide">
        {steps.map((step, index) => (
          <StepCard key={index} step={step} index={index} />
        ))}
      </div>

      {/* Bottom Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0E27] to-transparent pointer-events-none" />
    </section>
  );
}

// CompactSteps用のカード内パーティクル位置
const CARD_PARTICLES = [
  { x: 20, y: 25, size: 4, duration: 4, delay: 0 },
  { x: 70, y: 60, size: 3, duration: 5, delay: 0.5 },
  { x: 40, y: 80, size: 3, duration: 4.5, delay: 1 },
];

function CompactStepCard({
  step,
  index,
  isInView,
}: {
  step: Step;
  index: number;
  isInView: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const Icon = step.icon;

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: duration.scrollFadeIn,
        delay: 0.15 + index * 0.08,
        ease: appleEase,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Connector Line */}
      {index < steps.length - 1 && (
        <motion.div
          className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px"
          style={{
            background: `linear-gradient(90deg, ${step.color}25, transparent)`,
          }}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{
            duration: duration.scrollFadeIn,
            delay: 0.25 + index * 0.08,
            ease: appleEase,
          }}
        />
      )}

      {/* Glass Card */}
      <motion.div
        className={`relative p-8 overflow-hidden ${liquidGlassClasses.light}`}
        style={{
          borderColor: isHovered
            ? `${step.color}30`
            : "rgba(255, 255, 255, 0.8)",
          boxShadow: isHovered
            ? `0 12px 40px rgba(0, 0, 0, 0.12)`
            : "0 4px 24px rgba(0, 0, 0, 0.06)",
        }}
        animate={isMobile ? {} : { y: isHovered ? -6 : 0 }}
        transition={subtleSpring}
      >
        {/* Number Badge */}
        <div
          className="absolute top-4 right-4 text-6xl font-bold pointer-events-none"
          style={{
            color: isHovered
              ? `${step.color}15`
              : appleWebColors.sectionBackground,
            transition: "color 0.3s ease",
          }}
        >
          {step.number}
        </div>

        {/* Icon */}
        <motion.div
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
          style={{
            background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}cc 100%)`,
          }}
          animate={isMobile ? {} : { scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3, ease: appleEase }}
        >
          <Icon
            className="w-7 h-7 text-white"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </motion.div>

        {/* Content */}
        <h3
          className={typography.headline}
          style={{
            color: isHovered ? step.color : appleWebColors.textPrimary,
            transition: "color 0.3s ease",
            marginBottom: "12px",
          }}
        >
          {step.title}
        </h3>
        <p
          className={typography.subhead}
          style={{ color: appleWebColors.textSecondary }}
        >
          {step.description}
        </p>

        {/* Bottom Accent Line */}
        {!isMobile && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[3px]"
            style={{ backgroundColor: step.color }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3, ease: appleEase }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

export function CompactSteps() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32"
      style={{
        backgroundColor: appleWebColors.pageBackground,
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
            使い方
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
            3ステップで完了
          </motion.h2>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <CompactStepCard
              key={index}
              step={step}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
