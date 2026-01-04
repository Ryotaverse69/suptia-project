"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import {
  Scale,
  Clock,
  FileText,
  Bell,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ChevronDown,
  Award,
  Zap,
  Shield,
  TrendingUp,
  Star,
  Package,
  FlaskConical,
  Store,
  LucideIcon,
  MessageCircle,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  typography,
  fontStack,
  appleEase,
  subtleSpring,
  liquidGlassClasses,
} from "@/lib/design-system";

// ============================================================
// Types
// ============================================================

export interface WhySuptiaStats {
  productCount: number;
  ingredientCount: number;
  ecSiteCount: number;
}

interface StatItem {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

// ============================================================
// Data
// ============================================================

const aiLimitations = [
  {
    icon: Scale,
    title: "法的責任がない",
    description: "AIは薬機法を考慮せず、誤った情報を出力するリスクがあります。",
    color: systemColors.red,
  },
  {
    icon: Users,
    title: "あなたを知らない",
    description:
      "既往歴、服用中の薬、アレルギーを考慮した個別アドバイスは不可能です。",
    color: systemColors.orange,
  },
  {
    icon: Clock,
    title: "価格は瞬間的",
    description: "価格の推移やセールパターン、買い時の判断はAIにはできません。",
    color: systemColors.cyan,
  },
  {
    icon: FileText,
    title: "根拠が不透明",
    description: "「なぜその商品を選んだか」が不明確で、判断を検証できません。",
    color: systemColors.indigo,
  },
  {
    icon: Bell,
    title: "購入後フォローなし",
    description: "価格が下がった時の通知や継続的なサポートは期待できません。",
    color: systemColors.teal,
  },
  {
    icon: Search,
    title: "エビデンスが浅い",
    description: "PubMedやCochraneに基づく深い科学的評価は困難です。",
    color: systemColors.blue,
  },
];

const comparisonData = [
  { feature: "薬機法コンプライアンス", ai: false, suptia: true },
  {
    feature: "個人の既往歴に基づく判定",
    ai: false,
    suptia: true,
    note: "Pro+Safety",
  },
  {
    feature: "成分×薬剤の相互作用チェック",
    ai: false,
    suptia: true,
    note: "Pro+Safety",
  },
  { feature: "複数ECサイトの価格比較", ai: "limited", suptia: true },
  {
    feature: "価格履歴・トレンド分析",
    ai: false,
    suptia: true,
    note: "coming soon",
  },
  { feature: "価格アラート通知", ai: false, suptia: true },
  { feature: "推薦根拠の100%明示", ai: false, suptia: true },
  { feature: "PubMed/Cochraneの引用", ai: "unstable", suptia: true },
  { feature: "エビデンスレベル評価", ai: false, suptia: true, note: "S+〜D" },
];

const pillars = [
  {
    icon: TrendingUp,
    title: "価格比較",
    description: "複数ECサイトの最安値を表示",
    color: systemColors.green,
  },
  {
    icon: Zap,
    title: "成分量比較",
    description: "1日あたりの有効成分量を表示",
    color: systemColors.blue,
  },
  {
    icon: Star,
    title: "コスパ比較",
    description: "成分量あたりの価格を算出",
    color: systemColors.purple,
  },
  {
    icon: Search,
    title: "エビデンス",
    description: "S〜Dの5段階で科学的根拠を評価",
    color: systemColors.indigo,
  },
  {
    icon: Shield,
    title: "安全性",
    description: "0-100点と副作用・相互作用情報",
    color: systemColors.pink,
  },
];

const faqData = [
  {
    question: "AIコンシェルジュとは何ですか？",
    answer:
      "サプティアのAIコンシェルジュは、悩みを伝えるだけで最適なサプリメントを提案するAI機能です。4人のキャラクターから選べ、あなたの判断スタイル（コスパ重視、安全性重視など）に合わせて提案内容が変わります。「なぜそれが良いか」まで解説するので、根拠を理解した上で選べます。",
  },
  {
    question: "AI検索とサプティアの違いは何ですか？",
    answer:
      "AI検索（ChatGPT、Perplexity等）は一般論を返しますが、サプティアのAIコンシェルジュは価格・成分量・コスパ・エビデンス・安全性の5つの視点で具体的な商品を比較し、根拠と注意点まで解説します。",
  },
  {
    question: "サプティアの情報は信頼できますか？",
    answer:
      "すべての情報はPubMed、Cochrane Library、厚生労働省などの一次ソースに基づいています。コンテンツは薬機法に準拠し、エビデンスレベル（S+〜D）で科学的根拠の強さを明示しています。",
  },
  {
    question: "無料で使えますか？",
    answer:
      "はい、基本機能は完全無料です。AIコンシェルジュ、商品検索、価格比較、成分ガイド、診断機能、マイページ、価格アラートなどをお使いいただけます。",
  },
  {
    question: "サプティアはどうやって収益を得ていますか？",
    answer:
      "ECサイトへのアフィリエイトリンクを通じて収益を得ています。ただし、アフィリエイト収益は推薦順位に一切影響しません。すべての商品は客観的な基準で評価されています。",
  },
];

// ============================================================
// Components
// ============================================================

// Stat Card with animated counter
function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const cardRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const cardInView = useInView(cardRef, { once: true, margin: "-10%" });
  const prefersReducedMotion = useReducedMotion();
  const Icon = stat.icon;

  // Animated counter effect - properly in useEffect
  useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion) {
      setCount(stat.value);
      return;
    }

    const duration = 2000;
    const startTime = Date.now();
    let animationId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(stat.value * easeOut));
      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };
    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [isInView, prefersReducedMotion, stat.value]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={cardInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: appleEase }}
      className="text-center"
    >
      <motion.div
        className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: `${stat.color}12` }}
        whileHover={{ scale: 1.05 }}
        transition={subtleSpring}
      >
        <Icon className="w-7 h-7 md:w-8 md:h-8" style={{ color: stat.color }} />
      </motion.div>
      <div
        ref={ref}
        className="text-[36px] md:text-[48px] font-bold mb-1"
        style={{ color: appleWebColors.textPrimary }}
      >
        {count.toLocaleString()}
        {stat.suffix}
      </div>
      <p
        className="text-[15px]"
        style={{ color: appleWebColors.textSecondary }}
      >
        {stat.label}
      </p>
    </motion.div>
  );
}

// Glass Card Component with Liquid Glass styling
function GlassCard({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <motion.div
      className={`${liquidGlassClasses.light} ${className}`}
      whileHover={hover ? { y: -4 } : {}}
      transition={subtleSpring}
    >
      {children}
    </motion.div>
  );
}

// Section Header with Apple styling
function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <motion.div
      ref={ref}
      className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : ""}`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: appleEase }}
    >
      {eyebrow && (
        <motion.p
          className="text-[13px] font-semibold tracking-[0.2em] uppercase mb-4"
          style={{
            color: dark ? "rgba(255,255,255,0.6)" : appleWebColors.textTertiary,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: appleEase }}
        >
          {eyebrow}
        </motion.p>
      )}
      <h2
        className="text-[28px] md:text-[40px] lg:text-[48px] font-bold leading-[1.08] tracking-[-0.015em] mb-4"
        style={{ color: dark ? "#FFFFFF" : appleWebColors.textPrimary }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-[17px] lg:text-[19px] max-w-3xl leading-relaxed ${align === "center" ? "mx-auto" : ""}`}
          style={{
            color: dark
              ? "rgba(255,255,255,0.7)"
              : appleWebColors.textSecondary,
          }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

// AI Limitation Card
function LimitationCard({
  item,
  index,
}: {
  item: (typeof aiLimitations)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const Icon = item.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: appleEase }}
    >
      <GlassCard className="p-6 h-full">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
          style={{ backgroundColor: `${item.color}12` }}
          aria-hidden="true"
        >
          <Icon
            className="w-5 h-5"
            style={{ color: item.color }}
            aria-hidden="true"
          />
        </div>
        <h3
          className="text-[17px] font-semibold mb-2"
          style={{ color: appleWebColors.textPrimary }}
        >
          {item.title}
        </h3>
        <p
          className="text-[15px] leading-relaxed"
          style={{ color: appleWebColors.textSecondary }}
        >
          {item.description}
        </p>
      </GlassCard>
    </motion.div>
  );
}

// Comparison Table
function ComparisonTable() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: appleEase }}
    >
      <GlassCard className="overflow-hidden p-0" hover={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]" role="table">
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
                }}
              >
                <th
                  className="text-[15px] font-semibold text-left px-5 py-4"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  機能
                </th>
                <th
                  className="text-[13px] font-medium text-center px-4 py-4 w-24"
                  style={{ color: appleWebColors.textTertiary }}
                >
                  AI検索
                </th>
                <th
                  className="text-[13px] font-semibold text-center px-4 py-4 w-28"
                  style={{ color: systemColors.blue }}
                >
                  サプティア
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((item, index) => (
                <motion.tr
                  key={item.feature}
                  style={{
                    borderBottom:
                      index < comparisonData.length - 1
                        ? `1px solid ${appleWebColors.borderSubtle}`
                        : "none",
                  }}
                  initial={{ opacity: 0, x: -15 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.4,
                    delay: 0.15 + index * 0.04,
                    ease: appleEase,
                  }}
                >
                  <td
                    className="text-[15px] px-5 py-3.5"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    {item.feature}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {item.ai === false ? (
                      <XCircle
                        className="inline w-4 h-4"
                        style={{ color: systemColors.red }}
                        aria-label="非対応"
                      />
                    ) : (
                      <span
                        className="text-[12px] px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${systemColors.orange}15`,
                          color: systemColors.orange,
                        }}
                      >
                        {item.ai === "limited" ? "限定的" : "不安定"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <CheckCircle2
                        className="w-4 h-4"
                        style={{ color: systemColors.green }}
                        aria-label="対応"
                      />
                      {item.note && (
                        <span
                          className="text-[10px]"
                          style={{ color: appleWebColors.textTertiary }}
                        >
                          {item.note}
                        </span>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// Pillar Card
function PillarCard({
  pillar,
  index,
}: {
  pillar: (typeof pillars)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const prefersReducedMotion = useReducedMotion();
  const Icon = pillar.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: appleEase }}
    >
      <motion.div
        className={`relative overflow-hidden rounded-2xl p-5 md:p-6 text-center h-full ${liquidGlassClasses.light}`}
        style={{
          background: `linear-gradient(135deg, ${pillar.color}10, ${pillar.color}05)`,
        }}
        whileHover={prefersReducedMotion ? {} : { y: -4 }}
        transition={subtleSpring}
      >
        <motion.div
          className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${pillar.color}15` }}
          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          transition={subtleSpring}
        >
          <Icon
            className="w-6 h-6 md:w-7 md:h-7"
            style={{ color: pillar.color }}
          />
        </motion.div>
        <h3
          className="text-[15px] md:text-[17px] font-semibold mb-1.5"
          style={{ color: appleWebColors.textPrimary }}
        >
          {pillar.title}
        </h3>
        <p
          className="text-[12px] md:text-[13px] leading-relaxed"
          style={{ color: appleWebColors.textSecondary }}
        >
          {pillar.description}
        </p>
      </motion.div>
    </motion.div>
  );
}

// FAQ Item
function FAQItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: (typeof faqData)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      style={{ borderBottom: `1px solid ${appleWebColors.borderSubtle}` }}
      className="last:border-0"
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06, ease: appleEase }}
    >
      <button
        className="w-full flex items-center justify-between py-4 md:py-5 text-left min-h-[52px] group"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <span
          className="text-[15px] font-semibold pr-4 transition-colors"
          style={{ color: appleWebColors.textPrimary }}
        >
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: appleEase }}
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ backgroundColor: appleWebColors.pageBackground }}
          aria-hidden="true"
        >
          <ChevronDown
            className="w-4 h-4"
            style={{ color: appleWebColors.textTertiary }}
          />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: appleEase }}
            style={{ overflow: "hidden" }}
          >
            <p
              className="text-[15px] leading-relaxed pb-5"
              style={{ color: appleWebColors.textSecondary }}
            >
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Apple-style Button (per components.md - min 44pt touch target)
function AppleButton({
  href,
  variant = "primary",
  size = "large",
  children,
  icon,
}: {
  href: string;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "large" | "medium";
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();

  const baseStyles = `
    inline-flex items-center justify-center gap-2
    ${size === "large" ? "min-h-[56px] px-8" : "min-h-[44px] px-6"}
    rounded-full
    ${typography.headline}
    transition-all duration-200
  `;

  return (
    <Link href={href}>
      <motion.button
        className={baseStyles}
        style={{
          backgroundColor:
            variant === "primary"
              ? appleWebColors.blue
              : variant === "secondary"
                ? appleWebColors.textPrimary
                : "transparent",
          color: variant === "tertiary" ? appleWebColors.blue : "white",
        }}
        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
        transition={subtleSpring}
      >
        {children}
        {icon && <span aria-hidden="true">{icon}</span>}
      </motion.button>
    </Link>
  );
}

// ============================================================
// Main Client Component
// ============================================================

export function WhySuptiaClient({ stats }: { stats: WhySuptiaStats }) {
  const prefersReducedMotion = useReducedMotion();
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0);

  // Build stats data from props
  const statsData: StatItem[] = [
    {
      icon: Package,
      value: stats.productCount,
      suffix: "+",
      label: "掲載商品数",
      color: systemColors.blue,
    },
    {
      icon: FlaskConical,
      value: stats.ingredientCount,
      suffix: "+",
      label: "成分ガイド",
      color: systemColors.green,
    },
    {
      icon: Store,
      value: stats.ecSiteCount,
      suffix: "店舗",
      label: "EC連携",
      color: systemColors.teal,
    },
  ];

  // Parallax for hero
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleFAQToggle = useCallback((index: number) => {
    setOpenFAQIndex((current) => (current === index ? null : index));
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: fontStack,
        backgroundColor: appleWebColors.pageBackground,
      }}
    >
      {/* ============================================================ */}
      {/* Hero Section - Apple Style with Visual Impact */}
      {/* ============================================================ */}
      <section
        ref={heroRef}
        className="relative min-h-[100vh] flex items-center justify-center overflow-hidden"
      >
        {/* Premium dark gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, #0a0a0a 0%, #111 40%, #0a0a0a 100%)`,
          }}
        />

        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 50%, ${systemColors.blue}20 0%, transparent 70%)`,
          }}
        />

        {/* Floating orbs - visual engagement (optimized blur values) */}
        {!prefersReducedMotion && (
          <>
            <div
              className="absolute w-[400px] h-[400px] rounded-full blur-[40px] will-change-transform animate-float-slow"
              style={{
                backgroundColor: `${systemColors.blue}15`,
                top: "10%",
                left: "-10%",
              }}
            />
            <div
              className="absolute w-[300px] h-[300px] rounded-full blur-[32px] will-change-transform animate-float-medium"
              style={{
                backgroundColor: `${systemColors.indigo}15`,
                bottom: "20%",
                right: "-5%",
              }}
            />
            <div
              className="absolute w-[200px] h-[200px] rounded-full blur-[24px] will-change-transform animate-float-fast"
              style={{
                backgroundColor: `${systemColors.teal}12`,
                top: "30%",
                right: "20%",
              }}
            />
          </>
        )}

        <motion.div
          className="relative z-10 container mx-auto px-6 max-w-5xl text-center"
          style={prefersReducedMotion ? {} : { y: heroY, opacity: heroOpacity }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 mb-8"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
          >
            <Award
              className="w-4 h-4"
              style={{ color: systemColors.teal }}
              aria-hidden="true"
            />
            <span className={`${typography.caption1} text-white/80`}>
              AI時代のサプリメント選び
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="text-[44px] sm:text-[56px] md:text-[72px] lg:text-[80px] font-bold leading-[1.02] tracking-[-0.02em] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: appleEase }}
          >
            <span className="block text-white">AIが答えを出す時代。</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${systemColors.teal}, ${systemColors.blue}, ${systemColors.indigo})`,
              }}
            >
              Suptiaはその根拠を示す。
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className={`${typography.title3} text-white/60 max-w-2xl mx-auto mb-12`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: appleEase }}
          >
            ChatGPTやPerplexityは便利。でも、あなたの身体のことは
            <span className="text-white font-medium">
              {" "}
              AIコンシェルジュが根拠と一緒に解説してくれる
            </span>
            サプティアに。
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: appleEase }}
          >
            <AppleButton
              href="/concierge"
              variant="primary"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              AIに相談する
            </AppleButton>
            <AppleButton href="/diagnosis" variant="secondary">
              簡単診断から始める
            </AppleButton>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* Stats Section - Trust Indicators */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.p
            className="text-center text-[13px] font-semibold tracking-[0.2em] uppercase mb-12"
            style={{ color: appleWebColors.textTertiary }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: appleEase }}
          >
            サプティアの実績
          </motion.p>
          <div className="grid grid-cols-3 gap-8 md:gap-12">
            {statsData.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* AI Limitations Section */}
      {/* ============================================================ */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: appleWebColors.sectionBackground }}
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <SectionHeader
            eyebrow="AI検索の限界"
            title="便利なAI。でも、サプリ選びには限界がある。"
            subtitle="ChatGPT、Perplexity、Google SGEは素晴らしいツール。しかし、サプリメント選びにおいては重要な限界があります。"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {aiLimitations.map((item, index) => (
              <LimitationCard key={item.title} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Comparison Section */}
      {/* ============================================================ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <SectionHeader
            eyebrow="機能比較"
            title="AI検索 vs サプティア"
            subtitle="サプリメント選びに必要な機能を比較してみましょう。"
          />
          <ComparisonTable />
        </div>
      </section>

      {/* ============================================================ */}
      {/* Five Pillars Section */}
      {/* ============================================================ */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: appleWebColors.sectionBackground }}
      >
        <div className="container mx-auto px-6 max-w-5xl">
          <SectionHeader
            eyebrow="5つの評価軸"
            title="サプティアの5つの柱"
            subtitle="すべての商品を5つの観点で透明に評価。「なぜこの商品を選ぶべきか」が100%理解できます。"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {pillars.map((pillar, index) => (
              <PillarCard key={pillar.title} pillar={pillar} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Catchphrase Section - Visual Impact */}
      {/* ============================================================ */}
      <section className="relative py-28 md:py-40 bg-white overflow-hidden">
        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse 100% 60% at 50% 100%, ${systemColors.blue}08 0%, transparent 60%)`,
          }}
        />

        <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.8, ease: appleEase }}
          >
            {/* Decorative element */}
            <motion.div
              className="w-16 h-1 mx-auto mb-10 rounded-full"
              style={{ backgroundColor: systemColors.blue }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: appleEase }}
            />

            <h2
              className="text-[36px] md:text-[56px] lg:text-[72px] font-bold leading-[1.02] tracking-[-0.02em] mb-8"
              style={{ fontFamily: fontStack }}
            >
              <motion.span
                className="block"
                style={{ color: systemColors.blue }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: appleEase }}
              >
                AIは一般論。
              </motion.span>
              <motion.span
                className="block"
                style={{ color: appleWebColors.textPrimary }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4, ease: appleEase }}
              >
                サプティアはあなた専用。
              </motion.span>
            </h2>
            <motion.p
              className={`${typography.title3} max-w-2xl mx-auto mb-12`}
              style={{ color: appleWebColors.textSecondary }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5, ease: appleEase }}
            >
              サプリメント選びは、価格だけでなく、あなたの身体、目的、安全性を総合的に考慮する必要があります。
              AIコンシェルジュが、あなたの判断スタイルに合わせて一緒に考えます。
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6, ease: appleEase }}
            >
              <AppleButton href="/concierge" variant="primary">
                AIに相談する
              </AppleButton>
              <AppleButton href="/ingredients" variant="tertiary">
                成分を学ぶ
              </AppleButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FAQ Section */}
      {/* ============================================================ */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: appleWebColors.sectionBackground }}
      >
        <div className="container mx-auto px-6 max-w-3xl">
          <SectionHeader eyebrow="FAQ" title="よくある質問" />
          <GlassCard className="px-6 md:px-8" hover={false}>
            {faqData.map((item, index) => (
              <FAQItem
                key={index}
                item={item}
                index={index}
                isOpen={openFAQIndex === index}
                onToggle={() => handleFAQToggle(index)}
              />
            ))}
          </GlassCard>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Final CTA Section - Premium Dark Theme */}
      {/* ============================================================ */}
      <section className="relative py-28 md:py-40 overflow-hidden">
        {/* Premium dark gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)`,
          }}
        />

        {/* Radial glow effect */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${systemColors.blue}25 0%, transparent 60%)`,
          }}
        />

        {/* Floating orbs (optimized) */}
        {!prefersReducedMotion && (
          <>
            <div
              className="absolute w-[300px] h-[300px] rounded-full blur-[32px] will-change-transform animate-float-medium"
              style={{
                backgroundColor: `${systemColors.blue}12`,
                top: "20%",
                left: "10%",
              }}
            />
            <div
              className="absolute w-[250px] h-[250px] rounded-full blur-[28px] will-change-transform animate-float-slow"
              style={{
                backgroundColor: `${systemColors.indigo}12`,
                bottom: "10%",
                right: "15%",
              }}
            />
          </>
        )}

        <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.8, ease: appleEase }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: appleEase }}
            >
              <span className="text-[12px] text-white/70">
                完全無料で始められます
              </span>
            </motion.div>

            <h2
              className="text-[32px] md:text-[48px] lg:text-[56px] font-bold leading-[1.05] tracking-[-0.015em] mb-6"
              style={{ fontFamily: fontStack }}
            >
              <span className="text-white">根拠を持って</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${systemColors.teal}, ${systemColors.blue})`,
                }}
              >
                サプリを選ぼう
              </span>
            </h2>
            <p
              className={`${typography.title3} text-white/60 max-w-lg mx-auto mb-10`}
            >
              {stats.productCount}以上の商品、{stats.ingredientCount}
              以上の成分ガイド。
              科学的根拠に基づいた、あなたに最適なサプリメント選びを。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AppleButton
                href="/concierge"
                variant="primary"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                AIに相談する
              </AppleButton>
              <AppleButton href="/diagnosis" variant="secondary">
                簡単診断から始める
              </AppleButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
