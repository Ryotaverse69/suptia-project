"use client";

import { useRef, useCallback, useState } from "react";
import { motion, useScroll, useSpring, useInView } from "framer-motion";
import { Search, BarChart3, CheckCircle2, Sparkles } from "lucide-react";

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
    title: "検索・発見",
    description:
      "Tierランク（S+〜D）で瞬時にサプリの実力を把握。科学的根拠に基づいた評価で、本当に価値のある商品を見つけられます。",
    icon: Search,
    color: "#3b66e0",
    gradient: "from-[#3b66e0] to-[#7a98ec]",
  },
  {
    number: "02",
    title: "比較・分析",
    description:
      "成分・コスパ・安全性を5軸チャートで徹底比較。複数のECサイトから最安値を自動取得し、賢い選択をサポートします。",
    icon: BarChart3,
    color: "#5a7fe6",
    gradient: "from-[#5a7fe6] to-[#3b66e0]",
  },
  {
    number: "03",
    title: "選択・購入",
    description:
      "最適なサプリを見つけて最安値で購入。あなたの健康目標に合った、理由を理解した選択ができます。",
    icon: CheckCircle2,
    color: "#64e5b3",
    gradient: "from-[#64e5b3] to-[#3b66e0]",
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
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
            duration: 0.6,
            delay: 0.4,
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
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transform: "translateZ(0)" }}
        >
          {step.title}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed will-change-transform"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
  const Icon = step.icon;

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <motion.div
      className="relative group will-change-transform"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: 0.2 + index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transform: "translateZ(0)" }}
    >
      {/* Connector Line - 強化版 */}
      {index < steps.length - 1 && (
        <motion.div
          className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px"
          style={{
            background: `linear-gradient(90deg, ${step.color}30, transparent)`,
          }}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 + index * 0.15 }}
        />
      )}

      {/* Card */}
      <motion.div
        className="relative p-8 rounded-3xl bg-white border border-slate-200 shadow-lg overflow-hidden will-change-transform"
        animate={{
          y: isHovered ? -10 : 0,
          boxShadow: isHovered
            ? `0 25px 50px -12px ${step.color}25`
            : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          transform: "translateZ(0)",
          borderColor: isHovered ? `${step.color}40` : undefined,
        }}
      >
        {/* Hover Glow - 強化版 */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: `
              radial-gradient(circle at 50% 0%, ${step.color}20 0%, transparent 50%),
              radial-gradient(circle at 0% 100%, ${step.color}10 0%, transparent 40%)
            `,
          }}
        />

        {/* Floating Particles in Card */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {CARD_PARTICLES.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full will-change-transform"
              style={{
                backgroundColor: `${step.color}20`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                transform: "translateZ(0)",
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0, 0.5, 0],
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

        {/* Number Badge - 強化版 */}
        <motion.div
          className="absolute top-4 right-4 text-7xl font-black pointer-events-none"
          style={{
            color: isHovered ? `${step.color}15` : "#f1f5f9",
            transition: "color 0.3s ease",
          }}
        >
          {step.number}
        </motion.div>

        {/* Icon - 強化版 */}
        <motion.div
          className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 will-change-transform"
          style={{
            backgroundColor: `${step.color}15`,
            transform: "translateZ(0)",
          }}
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 5 : 0,
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Icon Glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `radial-gradient(circle, ${step.color}30 0%, transparent 70%)`,
              filter: "blur(8px)",
            }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          <Icon
            className="relative z-10 w-8 h-8"
            style={{ color: step.color }}
            strokeWidth={1.5}
          />
        </motion.div>

        {/* Content */}
        <motion.h3
          className="text-xl font-semibold text-slate-800 mb-3"
          animate={{
            color: isHovered ? step.color : "#1e293b",
          }}
          transition={{ duration: 0.3 }}
        >
          {step.title}
        </motion.h3>
        <p className="text-sm text-slate-500 leading-relaxed relative z-10">
          {step.description}
        </p>

        {/* Bottom Accent Line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ backgroundColor: step.color }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
}

export function CompactSteps() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      ref={ref}
      className="relative py-24 bg-white"
      style={{ contain: "layout paint" }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #3b66e0 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header - 強化版 */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] uppercase text-slate-400 mb-4"
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
            How It Works
          </motion.span>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-800"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            3ステップで
            <span className="bg-gradient-to-r from-[#7a98ec] to-[#3b66e0] bg-clip-text text-transparent ml-2">
              最適なサプリ
            </span>
            を発見
          </motion.h2>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
