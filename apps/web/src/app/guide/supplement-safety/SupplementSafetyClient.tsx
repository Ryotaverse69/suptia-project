"use client";

import { useRef, useState, useCallback } from "react";
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
  AlertTriangle,
  Shield,
  Search,
  TrendingUp,
  Zap,
  Star,
  ArrowRight,
  ChevronDown,
  Clock,
  FileText,
  Users,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Info,
  ExternalLink,
  Scale,
  FlaskConical,
  HeartPulse,
  Brain,
  LucideIcon,
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
// Data
// ============================================================

const incidentStats = [
  {
    value: "240",
    suffix: "人以上",
    label: "入院者数",
    color: systemColors.red,
  },
  {
    value: "9.4",
    suffix: "万件",
    label: "相談件数",
    color: systemColors.orange,
  },
  {
    value: "100",
    suffix: "件超",
    label: "死亡疑い事例",
    color: systemColors.red,
  },
];

const timelineEvents = [
  {
    date: "2024年1月15日",
    title: "医師から第一報",
    description: "健康被害の最初の報告が製造元企業に届く",
    severity: "warning",
  },
  {
    date: "2024年3月22日",
    title: "自主回収発表",
    description:
      "第一報から2ヶ月以上経過後に自主回収を発表。対応の遅れが被害拡大の一因と指摘されている",
    severity: "critical",
  },
  {
    date: "2024年3月26日",
    title: "死亡事例公表",
    description: "サプリを継続摂取していた方が腎疾患で死亡したと発表",
    severity: "critical",
  },
  {
    date: "2024年9月1日",
    title: "制度改正施行",
    description:
      "機能性表示食品の健康被害報告義務化、GMP要件化などの改正が施行",
    severity: "info",
  },
];

const rootCauses = [
  {
    icon: FlaskConical,
    title: "製造管理体制の問題",
    description:
      "第三者委員会の報告によると、製造設備の衛生管理に関する報告が適切に対応されなかったとされている",
    color: systemColors.red,
  },
  {
    icon: Clock,
    title: "初動対応の遅れ",
    description: "第一報から自主回収まで2ヶ月以上を要したと報告されている",
    color: systemColors.orange,
  },
  {
    icon: FileText,
    title: "機能性表示食品制度の課題",
    description:
      "届出制のため国による事前審査がなく、安全性担保の仕組みに課題があると指摘されている",
    color: systemColors.yellow,
  },
];

const aiLimitations = [
  {
    icon: FileText,
    title: "情報の出典が不明確",
    description: "「〇〇は健康に良いとされています」── 誰が言った？どの研究？",
    example: "一般的なAI回答",
  },
  {
    icon: Clock,
    title: "古い情報との混在",
    description: "2020年の論文と2024年の論文が区別なく表示される",
    example: "情報の鮮度問題",
  },
  {
    icon: Scale,
    title: "利益相反の非開示",
    description: "メーカー寄りの情報か、中立的な情報か判別できない",
    example: "バイアスの問題",
  },
  {
    icon: Shield,
    title: "安全性情報の軽視",
    description: "効果の説明ばかりで、副作用や相互作用の情報が薄い",
    example: "リスク情報の欠如",
  },
];

const suptiaFeatures = [
  {
    icon: Search,
    title: "エビデンスレベルの明示",
    description: "すべての成分情報にS/A/B/C/Dの5段階評価を付与",
    color: systemColors.indigo,
    detail: "PubMed、Cochraneなど一次ソースに基づく評価",
  },
  {
    icon: Shield,
    title: "安全性スコア（0-100点）",
    description: "副作用報告の頻度、重篤度、相互作用リスクを総合評価",
    color: systemColors.pink,
    detail: "医薬品との相互作用、禁忌情報も網羅",
  },
  {
    icon: Zap,
    title: "成分量の可視化",
    description: "1日あたりの有効成分量をmg単位で正規化",
    color: systemColors.blue,
    detail: "「なんとなく」ではなく数値で比較",
  },
  {
    icon: TrendingUp,
    title: "コスパの透明化",
    description: "成分量あたりの価格（¥/mg）を算出",
    color: systemColors.green,
    detail: "高い＝良い、ではないことを数値で証明",
  },
  {
    icon: Star,
    title: "推薦根拠の100%明示",
    description: "なぜその商品をおすすめするのかを明確に説明",
    color: systemColors.purple,
    detail: "ブラックボックスのない推薦システム",
  },
];

const faqData = [
  {
    question: "紅麹事件の原因は何だったのですか？",
    answer:
      "製造過程でプベルル酸などの有害物質が混入したことが原因と考えられています。第三者委員会の報告では、製造管理体制に問題があったとされています。ただし、2025年1月時点でも原因究明は完了していません。",
  },
  {
    question: "機能性表示食品は安全ではないのですか？",
    answer:
      "機能性表示食品は、国が審査するのではなく企業が自己責任で届け出る制度です。紅麹事件を受けて、健康被害報告の義務化やGMP要件化などの制度改正が行われましたが、消費者自身が情報を吟味する必要性は変わりません。",
  },
  {
    question: "AI検索でサプリを調べるのは危険ですか？",
    answer:
      "AI検索自体は便利なツールですが、サプリメント選びには限界があります。出典の信頼性、情報の鮮度、あなた個人の条件（持病、服用薬、アレルギーなど）を考慮した回答は期待できません。一般論として参考にしつつ、専門的な情報源と組み合わせることをおすすめします。",
  },
  {
    question: "サプティアの情報は信頼できますか？",
    answer:
      "すべての情報はPubMed、Cochrane Library、厚生労働省などの一次ソースに基づいています。エビデンスレベル（S+〜D）で科学的根拠の強さを明示し、薬機法に準拠したコンテンツ制作を行っています。推薦根拠は100%公開しています。",
  },
  {
    question: "サプリメントを選ぶ際に最も重要なことは？",
    answer:
      "「何を選ぶか」以上に「何を根拠に選ぶか」が重要です。効果だけでなく、安全性（副作用、相互作用）、エビデンスの質、あなた個人の条件との適合性を総合的に判断してください。不明な点は医師や薬剤師に相談することを強くおすすめします。",
  },
];

// ============================================================
// Components
// ============================================================

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

function StatCard({
  stat,
  index,
}: {
  stat: (typeof incidentStats)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: appleEase }}
    >
      <div
        className="text-[48px] md:text-[64px] font-bold mb-1"
        style={{ color: stat.color }}
      >
        {stat.value}
        <span className="text-[24px] md:text-[32px]">{stat.suffix}</span>
      </div>
      <p
        className="text-[15px] font-medium"
        style={{ color: appleWebColors.textSecondary }}
      >
        {stat.label}
      </p>
    </motion.div>
  );
}

function TimelineItem({
  event,
  index,
  isLast,
}: {
  event: (typeof timelineEvents)[0];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const severityConfig = {
    critical: { color: systemColors.red, icon: AlertTriangle },
    warning: { color: systemColors.orange, icon: AlertCircle },
    info: { color: systemColors.blue, icon: Info },
  };

  const config = severityConfig[event.severity as keyof typeof severityConfig];
  const Icon = config.icon;

  return (
    <motion.div
      ref={ref}
      className="relative flex gap-4 md:gap-6"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: appleEase }}
    >
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div
          className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${config.color}15` }}
        >
          <Icon
            className="w-5 h-5 md:w-6 md:h-6"
            style={{ color: config.color }}
          />
        </div>
        {!isLast && (
          <div
            className="w-0.5 flex-1 my-2"
            style={{ backgroundColor: appleWebColors.borderSubtle }}
          />
        )}
      </div>

      {/* Content */}
      <div className={`pb-8 ${isLast ? "" : ""}`}>
        <span
          className="text-[13px] font-medium"
          style={{ color: config.color }}
        >
          {event.date}
        </span>
        <h3
          className="text-[17px] font-semibold mt-1 mb-2"
          style={{ color: appleWebColors.textPrimary }}
        >
          {event.title}
        </h3>
        <p
          className="text-[15px] leading-relaxed"
          style={{ color: appleWebColors.textSecondary }}
        >
          {event.description}
        </p>
      </div>
    </motion.div>
  );
}

function CauseCard({
  cause,
  index,
}: {
  cause: (typeof rootCauses)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const Icon = cause.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: appleEase }}
    >
      <GlassCard className="p-6 h-full">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ backgroundColor: `${cause.color}12` }}
        >
          <Icon className="w-6 h-6" style={{ color: cause.color }} />
        </div>
        <h3
          className="text-[17px] font-semibold mb-2"
          style={{ color: appleWebColors.textPrimary }}
        >
          {cause.title}
        </h3>
        <p
          className="text-[15px] leading-relaxed"
          style={{ color: appleWebColors.textSecondary }}
        >
          {cause.description}
        </p>
      </GlassCard>
    </motion.div>
  );
}

function AILimitationCard({
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
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: appleEase }}
      className="flex gap-4 p-4 rounded-2xl"
      style={{ backgroundColor: `${systemColors.red}06` }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${systemColors.red}12` }}
      >
        <Icon className="w-5 h-5" style={{ color: systemColors.red }} />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4
            className="text-[15px] font-semibold"
            style={{ color: appleWebColors.textPrimary }}
          >
            {item.title}
          </h4>
          <span
            className="text-[11px] px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: appleWebColors.sectionBackground,
              color: appleWebColors.textTertiary,
            }}
          >
            {item.example}
          </span>
        </div>
        <p
          className="text-[14px] leading-relaxed"
          style={{ color: appleWebColors.textSecondary }}
        >
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof suptiaFeatures)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: appleEase }}
    >
      <GlassCard className="p-6 h-full">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ backgroundColor: `${feature.color}12` }}
        >
          <Icon className="w-6 h-6" style={{ color: feature.color }} />
        </div>
        <h3
          className="text-[17px] font-semibold mb-2"
          style={{ color: appleWebColors.textPrimary }}
        >
          {feature.title}
        </h3>
        <p
          className="text-[15px] leading-relaxed mb-3"
          style={{ color: appleWebColors.textSecondary }}
        >
          {feature.description}
        </p>
        <p
          className="text-[13px]"
          style={{ color: appleWebColors.textTertiary }}
        >
          {feature.detail}
        </p>
      </GlassCard>
    </motion.div>
  );
}

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
      >
        <span
          className="text-[15px] font-semibold pr-4"
          style={{ color: appleWebColors.textPrimary }}
        >
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: appleEase }}
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ backgroundColor: appleWebColors.pageBackground }}
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
// Main Component
// ============================================================

export function SupplementSafetyClient() {
  const prefersReducedMotion = useReducedMotion();
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0);

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
      {/* Hero Section - Shocking Statistics */}
      {/* ============================================================ */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      >
        {/* Dark gradient background with red tint */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, #0a0a0a 0%, #1a0a0a 40%, #0a0a0a 100%)`,
          }}
        />

        {/* Subtle warning glow */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 50%, ${systemColors.red}20 0%, transparent 70%)`,
          }}
        />

        <motion.div
          className="relative z-10 container mx-auto px-6 max-w-5xl text-center"
          style={prefersReducedMotion ? {} : { y: heroY, opacity: heroOpacity }}
        >
          {/* Warning Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/10 backdrop-blur-xl border border-red-500/20 mb-8"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
          >
            <AlertTriangle
              className="w-4 h-4"
              style={{ color: systemColors.red }}
            />
            <span className="text-[13px] text-red-400">
              2024年 紅麹サプリメント健康被害事件
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-bold leading-[1.05] tracking-[-0.02em] mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: appleEase }}
          >
            <span className="block text-white">サプリメント選びで</span>
            <span className="block" style={{ color: systemColors.red }}>
              命を落とさないために
            </span>
          </motion.h1>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: appleEase }}
          >
            {incidentStats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-[32px] md:text-[48px] font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                  <span className="text-[16px] md:text-[24px]">
                    {stat.suffix}
                  </span>
                </div>
                <p className="text-[12px] md:text-[14px] text-white/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-[17px] md:text-[19px] text-white/60 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: appleEase }}
          >
            この事件は単なる製造上の問題ではありません。
            <br className="hidden sm:block" />
            <span className="text-white font-medium">
              「何を根拠に安全と判断するか」
            </span>
            という根本的な問いを突きつけました。
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-6 h-6 text-white/40" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* Timeline Section - What Happened */}
      {/* ============================================================ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <SectionHeader
            eyebrow="事件の経緯"
            title="紅麹サプリ事件で何が起きたのか"
            subtitle="2024年に発生した紅麹を含む機能性表示食品による健康被害の経緯"
          />

          <div className="max-w-2xl mx-auto">
            {timelineEvents.map((event, index) => (
              <TimelineItem
                key={event.date}
                event={event}
                index={index}
                isLast={index === timelineEvents.length - 1}
              />
            ))}
          </div>

          {/* Source link */}
          <motion.div
            className="mt-8 text-center space-y-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p
              className="text-[12px]"
              style={{ color: appleWebColors.textTertiary }}
            >
              出典：
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/kinosei/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[12px] hover:underline"
                style={{ color: appleWebColors.textTertiary }}
              >
                厚生労働省「機能性表示食品について」
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.caa.go.jp/policies/policy/food_labeling/foods_with_function_claims/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[12px] hover:underline"
                style={{ color: appleWebColors.textTertiary }}
              >
                消費者庁「機能性表示食品制度」
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Root Causes Section */}
      {/* ============================================================ */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: appleWebColors.sectionBackground }}
      >
        <div className="container mx-auto px-6 max-w-5xl">
          <SectionHeader
            eyebrow="問題の本質"
            title="なぜ被害は拡大したのか"
            subtitle="紅麹事件が明らかにした3つの構造的問題"
          />

          <div className="grid md:grid-cols-3 gap-6">
            {rootCauses.map((cause, index) => (
              <CauseCard key={cause.title} cause={cause} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* AI Limitations Section */}
      {/* ============================================================ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <SectionHeader
            eyebrow="AI検索の限界"
            title="「AI検索で調べれば大丈夫」は本当か？"
            subtitle="ChatGPTやPerplexityは便利なツール。しかしサプリメント選びには構造的な限界があります。"
          />

          <GlassCard className="p-6 md:p-8" hover={false}>
            <div className="space-y-4">
              {aiLimitations.map((item, index) => (
                <AILimitationCard key={item.title} item={item} index={index} />
              ))}
            </div>

            <div
              className="mt-6 p-4 rounded-xl"
              style={{ backgroundColor: appleWebColors.sectionBackground }}
            >
              <p
                className="text-[15px] leading-relaxed"
                style={{ color: appleWebColors.textSecondary }}
              >
                <span className="font-semibold">結論：</span>
                「このサプリは安全ですか？」とAIに聞いても、返ってくるのは
                <span className="font-semibold">一般論</span>
                です。あなたの年齢、持病、服用中の薬、体質 ──
                そうした個別の条件を踏まえた回答ではありません。
              </p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Suptia Solution Section */}
      {/* ============================================================ */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: appleWebColors.sectionBackground }}
      >
        <div className="container mx-auto px-6 max-w-5xl">
          <SectionHeader
            eyebrow="サプティアの取り組み"
            title="根拠を示さない推薦はしない"
            subtitle="サプティアは「情報の非対称性を解消する」ために設計されました"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suptiaFeatures.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Key Message Section */}
      {/* ============================================================ */}
      <section className="relative py-28 md:py-40 bg-white overflow-hidden">
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
            <motion.div
              className="w-16 h-1 mx-auto mb-10 rounded-full"
              style={{ backgroundColor: systemColors.blue }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: appleEase }}
            />

            <h2 className="text-[28px] md:text-[40px] lg:text-[48px] font-bold leading-[1.08] tracking-[-0.015em] mb-6">
              <span style={{ color: appleWebColors.textPrimary }}>
                サプリメント選びで大切なのは
              </span>
              <br />
              <span style={{ color: systemColors.blue }}>
                「何を選ぶか」以上に「何を根拠に選ぶか」
              </span>
            </h2>

            <p
              className="text-[17px] md:text-[19px] max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ color: appleWebColors.textSecondary }}
            >
              紅麹事件のような悲劇を繰り返さないために。
              <br />
              科学的根拠と安全性を、誰もが確認できる世界へ。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AppleButton
                href="/concierge"
                variant="primary"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                AIコンシェルジュに相談
              </AppleButton>
              <AppleButton
                href="/guide/dangerous-ingredients"
                variant="secondary"
              >
                危険成分ガイドを見る
              </AppleButton>
            </div>
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
      {/* Disclaimer Section */}
      {/* ============================================================ */}
      <section className="py-12 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div
            className="rounded-2xl p-6 border"
            style={{
              backgroundColor: `${systemColors.orange}08`,
              borderColor: `${systemColors.orange}20`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="p-3 rounded-xl flex-shrink-0"
                style={{ backgroundColor: `${systemColors.orange}15` }}
              >
                <AlertCircle
                  className="w-5 h-5"
                  style={{ color: systemColors.orange }}
                />
              </div>
              <div>
                <h3
                  className="text-[15px] font-semibold mb-2"
                  style={{ color: systemColors.orange }}
                >
                  重要な免責事項
                </h3>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  このページの情報は一般的な情報提供を目的としており、医学的アドバイスではありません。
                  サプリメントを開始する前に、必ず医師または薬剤師に相談してください。
                  異常を感じたらすぐに使用を中止し、医療機関を受診してください。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Final CTA Section */}
      {/* ============================================================ */}
      <section className="relative py-28 md:py-40 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)`,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${systemColors.blue}25 0%, transparent 60%)`,
          }}
        />

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
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: appleEase }}
            >
              <span className="text-[12px] text-white/70">
                AIが答えを出す時代。サプティアはその根拠を示す。
              </span>
            </motion.div>

            <h2 className="text-[32px] md:text-[48px] lg:text-[56px] font-bold leading-[1.05] tracking-[-0.015em] mb-6">
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

            <p className="text-[17px] md:text-[19px] text-white/60 max-w-lg mx-auto mb-10">
              科学的根拠に基づいた、あなたに最適なサプリメント選びを。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AppleButton
                href="/concierge"
                variant="primary"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                AIコンシェルジュに相談
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
