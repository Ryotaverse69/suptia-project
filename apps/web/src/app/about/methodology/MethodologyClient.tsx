"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import {
  Microscope,
  BookOpen,
  Shield,
  TrendingUp,
  DollarSign,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  FileText,
  Database,
  Scale,
  ChevronDown,
  ExternalLink,
  Award,
  Beaker,
  LucideIcon,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
  appleEase,
  subtleSpring,
} from "@/lib/design-system";

// ============================================================
// Types
// ============================================================

interface FAQItem {
  question: string;
  answer: string;
}

interface MethodologyClientProps {
  faqData: FAQItem[];
}

// ============================================================
// Animation Variants
// ============================================================

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: appleEase,
    },
  }),
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: appleEase },
  },
};

// ============================================================
// Data
// ============================================================

const pillarsData = [
  {
    icon: DollarSign,
    title: "価格の比較",
    description:
      "楽天市場、Yahoo!ショッピング、Amazonなど複数ECサイトの価格を毎日自動取得。JANコードベースで同一商品を正確にマッチングし、最安値を表示します。",
    criteria:
      "Sランク: 最安値 / Aランク: 最安値の1.1倍以内 / Bランク: 1.2倍以内 / Cランク: 1.3倍以内 / Dランク: 1.3倍超",
    color: systemColors.green,
  },
  {
    icon: BarChart3,
    title: "成分量の比較",
    description:
      "1日あたりの有効成分量をmg単位で正規化して比較。同じ成分カテゴリ内で成分量が多い順にランク付けします。",
    criteria:
      "Sランク: カテゴリ内最高含有量 / Aランク: 上位20% / Bランク: 上位40% / Cランク: 上位60% / Dランク: 下位40%",
    color: systemColors.blue,
  },
  {
    icon: TrendingUp,
    title: "コスパの比較",
    description:
      "成分量あたりの価格（¥/mg）を算出し、真のコストパフォーマンスを比較。実効コスト/日も表示します。",
    criteria:
      "Sランク: 最高コスパ / Aランク: 上位20% / Bランク: 上位40% / Cランク: 上位60% / Dランク: 下位40%",
    color: systemColors.purple,
  },
  {
    icon: Microscope,
    title: "エビデンスレベル",
    description:
      "PubMed、Cochrane Libraryなどの医学文献に基づき、各成分の科学的根拠の強さを評価。参考文献へのリンクも提供します。",
    criteria:
      "Sランク: 大規模RCT・メタ解析で確認 / Aランク: 複数RCTで確認 / Bランク: 小規模研究で示唆 / Cランク: 動物実験のみ / Dランク: 根拠不十分",
    color: systemColors.indigo,
  },
  {
    icon: Shield,
    title: "安全性評価",
    description:
      "副作用、薬物相互作用、過剰摂取リスク、妊娠中の安全性、添加物を総合評価し、0-100点でスコア化します。",
    criteria:
      "Sランク: 90点以上 / Aランク: 80-89点 / Bランク: 70-79点 / Cランク: 60-69点 / Dランク: 60点未満",
    color: systemColors.pink,
  },
];

const sourcesData = [
  {
    name: "PubMed",
    org: "米国国立医学図書館（NLM）",
    description: "3,500万件以上の医学文献を収録する世界最大の医学データベース",
    url: "https://pubmed.ncbi.nlm.nih.gov/",
  },
  {
    name: "Cochrane Library",
    org: "コクラン共同計画",
    description: "エビデンスに基づく医療のためのシステマティックレビュー集",
    url: "https://www.cochranelibrary.com/",
  },
  {
    name: "日本人の食事摂取基準",
    org: "厚生労働省",
    description: "日本人に適した栄養素の推奨摂取量・上限量を規定",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html",
  },
  {
    name: "Office of Dietary Supplements",
    org: "米国国立衛生研究所（NIH）",
    description: "サプリメント成分の科学的情報を提供する公的機関",
    url: "https://ods.od.nih.gov/",
  },
  {
    name: "EFSA",
    org: "欧州食品安全機関",
    description: "EUにおける食品・サプリメントの安全性評価を担当",
    url: "https://www.efsa.europa.eu/",
  },
  {
    name: "Natural Medicines",
    org: "Therapeutic Research Center",
    description: "医療従事者向けの天然物医薬品データベース",
    url: "https://naturalmedicines.therapeuticresearch.com/",
  },
];

const evidenceLevels = [
  {
    rank: "S",
    label: "最高エビデンス",
    color: systemColors.green,
    description:
      "大規模ランダム化比較試験（RCT）またはメタ解析により、有効性が高い信頼度で確認されている成分。",
    examples: "オメガ3脂肪酸（心血管系）、ビタミンD（骨密度）",
    criteria: [
      "1,000人以上の大規模RCT",
      "複数のRCTを統合したメタ解析",
      "Cochrane Reviewで有効性確認",
    ],
  },
  {
    rank: "A",
    label: "高エビデンス",
    color: systemColors.blue,
    description: "複数の質の高い臨床試験により、有効性が示されている成分。",
    examples: "マグネシウム（筋肉機能）、亜鉛（免疫機能）",
    criteria: [
      "複数のRCT（各100人以上）",
      "一貫した効果の報告",
      "再現性のある結果",
    ],
  },
  {
    rank: "B",
    label: "中程度エビデンス",
    color: systemColors.cyan,
    description:
      "限定的な研究により、有効性が示唆されているが追加研究が必要な成分。",
    examples: "CoQ10（疲労軽減）、プロバイオティクス（腸内環境）",
    criteria: [
      "小規模RCT（100人未満）",
      "観察研究での一貫した報告",
      "メカニズムの科学的説明あり",
    ],
  },
  {
    rank: "C",
    label: "低エビデンス",
    color: systemColors.orange,
    description:
      "主に動物実験や試験管内研究に基づく成分。ヒトでの効果は未確認。",
    examples: "一部のハーブ成分、新規成分",
    criteria: [
      "動物実験での効果確認",
      "試験管内（in vitro）研究",
      "予備的なヒト研究のみ",
    ],
  },
  {
    rank: "D",
    label: "根拠不十分",
    color: systemColors.gray[1],
    description: "科学的根拠がほとんどない、または効果が否定された成分。",
    examples: "科学的に否定された成分、伝承のみの成分",
    criteria: ["信頼できる研究なし", "効果が否定された", "安全性に懸念あり"],
  },
];

// ============================================================
// Components
// ============================================================

// Animated Counter
function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      setCount(value);
      return;
    }

    const duration = 1500;
    const startTime = Date.now();
    let animationId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(value * easeOut));
      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isInView, prefersReducedMotion, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// Section Header with animation
function SectionHeader({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  color,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      className="mb-16 text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: appleEase }}
    >
      <motion.div
        className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2"
        style={{
          backgroundColor: `${color}10`,
          border: `1px solid ${color}20`,
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.1, ease: appleEase }}
      >
        <Icon size={16} style={{ color }} />
        <span className="text-[13px] font-semibold" style={{ color }}>
          {eyebrow}
        </span>
      </motion.div>
      <h2
        className="mb-4 text-[28px] lg:text-[40px] font-bold"
        style={{ color: appleWebColors.textPrimary }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="mx-auto max-w-2xl text-[17px]"
          style={{ color: appleWebColors.textSecondary }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

// Pillar Card with hover effect
function PillarCard({
  pillar,
  index,
}: {
  pillar: (typeof pillarsData)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const Icon = pillar.icon;

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUpVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ y: -4 }}
      transition={subtleSpring}
      className={`group relative overflow-hidden rounded-2xl p-6 ${liquidGlassClasses.light}`}
    >
      {/* Gradient overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${pillar.color}08 0%, transparent 50%)`,
        }}
      />

      <div className="flex flex-col lg:flex-row items-start gap-5 relative z-10">
        <motion.div
          className="flex-shrink-0 rounded-2xl p-4"
          style={{ backgroundColor: `${pillar.color}15` }}
          whileHover={{ scale: 1.05, rotate: 3 }}
          transition={subtleSpring}
        >
          <Icon size={28} strokeWidth={1.5} style={{ color: pillar.color }} />
        </motion.div>
        <div className="flex-1">
          <h3
            className="mb-2 text-[19px] font-semibold"
            style={{ color: appleWebColors.textPrimary }}
          >
            {pillar.title}
          </h3>
          <p
            className="text-[15px] leading-relaxed mb-3"
            style={{ color: appleWebColors.textSecondary }}
          >
            {pillar.description}
          </p>
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: appleWebColors.sectionBackground }}
          >
            <p
              className="text-[13px] font-medium"
              style={{ color: appleWebColors.textSecondary }}
            >
              <span
                className="font-semibold"
                style={{ color: appleWebColors.textPrimary }}
              >
                評価基準:
              </span>{" "}
              {pillar.criteria}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Source Card with hover effect
function SourceCard({
  source,
  index,
}: {
  source: (typeof sourcesData)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.a
      ref={ref}
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      custom={index}
      variants={fadeUpVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ y: -4 }}
      transition={subtleSpring}
      className={`group block rounded-2xl p-5 ${liquidGlassClasses.light}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <motion.div whileHover={{ rotate: 10 }} transition={subtleSpring}>
          <FileText size={20} style={{ color: systemColors.cyan }} />
        </motion.div>
        <h3
          className="text-[17px] font-semibold group-hover:underline"
          style={{ color: appleWebColors.textPrimary }}
        >
          {source.name}
        </h3>
        <ExternalLink
          size={14}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: systemColors.cyan }}
        />
      </div>
      <p
        className="text-[13px] font-medium mb-2"
        style={{ color: systemColors.cyan }}
      >
        {source.org}
      </p>
      <p
        className="text-[15px] leading-relaxed"
        style={{ color: appleWebColors.textSecondary }}
      >
        {source.description}
      </p>
    </motion.a>
  );
}

// Evidence Level Card
function EvidenceLevelCard({
  level,
  index,
}: {
  level: (typeof evidenceLevels)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUpVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`relative overflow-hidden rounded-2xl p-6 ${liquidGlassClasses.light}`}
    >
      <div className="flex flex-col lg:flex-row items-start gap-5">
        <div className="flex items-center gap-4">
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-[28px] font-bold"
            style={{ backgroundColor: level.color }}
            whileHover={{ scale: 1.1 }}
            transition={subtleSpring}
          >
            {level.rank}
          </motion.div>
          <div className="lg:hidden">
            <h3
              className="text-[19px] font-semibold"
              style={{ color: appleWebColors.textPrimary }}
            >
              {level.label}
            </h3>
          </div>
        </div>
        <div className="flex-1">
          <h3
            className="hidden lg:block mb-2 text-[19px] font-semibold"
            style={{ color: appleWebColors.textPrimary }}
          >
            {level.label}
          </h3>
          <p
            className="text-[15px] leading-relaxed mb-4"
            style={{ color: appleWebColors.textSecondary }}
          >
            {level.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: appleWebColors.sectionBackground }}
            >
              <p
                className="text-[11px] font-semibold uppercase tracking-wider mb-2"
                style={{ color: appleWebColors.textTertiary }}
              >
                例
              </p>
              <p
                className="text-[15px]"
                style={{ color: appleWebColors.textPrimary }}
              >
                {level.examples}
              </p>
            </div>
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: appleWebColors.sectionBackground }}
            >
              <p
                className="text-[11px] font-semibold uppercase tracking-wider mb-2"
                style={{ color: appleWebColors.textTertiary }}
              >
                基準
              </p>
              <ul className="space-y-1">
                {level.criteria.map((c, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[13px]"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    <CheckCircle2
                      size={14}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: level.color }}
                    />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// FAQ Accordion Item
function FAQAccordion({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUpVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`rounded-2xl overflow-hidden ${liquidGlassClasses.light}`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left"
        style={{ color: appleWebColors.textPrimary }}
      >
        <h3 className="text-[17px] font-semibold pr-4">{faq.question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: appleEase }}
        >
          <ChevronDown
            size={20}
            style={{ color: appleWebColors.textSecondary }}
          />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: appleEase }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="px-5 pb-5"
              style={{ color: appleWebColors.textSecondary }}
            >
              <p className="text-[15px] leading-relaxed">{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================
// Main Component
// ============================================================

export function MethodologyClient({ faqData }: MethodologyClientProps) {
  const prefersReducedMotion = useReducedMotion();
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0);

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
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative overflow-hidden min-h-[80vh] flex items-center justify-center"
        style={{
          background: `linear-gradient(180deg, #0a0a0a 0%, #111 50%, #1a1a2e 100%)`,
        }}
      >
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 30%, ${systemColors.indigo}25 0%, transparent 60%)`,
          }}
        />

        <motion.div
          className="relative z-10 container mx-auto px-6 max-w-5xl text-center py-24"
          style={prefersReducedMotion ? {} : { y: heroY, opacity: heroOpacity }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 mb-8"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
          >
            <Beaker className="w-4 h-4" style={{ color: systemColors.cyan }} />
            <span className="text-[13px] font-medium text-white/80">
              評価方法論
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-bold leading-[1.05] tracking-[-0.02em] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: appleEase }}
          >
            <span className="text-white">サプリメントの</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${systemColors.cyan}, ${systemColors.indigo})`,
              }}
            >
              科学的比較方法とは
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-[17px] lg:text-[19px] text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: appleEase }}
          >
            PubMed、Cochrane Library、厚生労働省などの
            <span className="text-white font-medium">信頼できる一次ソース</span>
            に基づき、成分の有効性・安全性・推奨摂取量を客観的に評価・比較する手法です。
          </motion.p>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: appleEase }}
          >
            {[
              { value: 5, suffix: "つの評価軸", label: "透明な評価基準" },
              { value: 6, suffix: "以上", label: "参照ソース" },
              { value: 100, suffix: "+", label: "評価済み成分" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-[32px] font-bold text-white mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[13px] text-white/50">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: appleEase }}
          >
            <Link
              href="/products"
              className="group flex items-center justify-center gap-2 rounded-full px-8 py-3 min-h-[48px] font-semibold text-[17px] transition-all"
              style={{ backgroundColor: systemColors.blue, color: "#FFFFFF" }}
            >
              評価済み商品を見る
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/ingredients"
              className="group flex items-center justify-center gap-2 rounded-full px-8 py-3 min-h-[48px] font-semibold text-[17px] bg-white/10 backdrop-blur-xl border border-white/20 text-white transition-all hover:bg-white/20"
            >
              成分ガイドを見る
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={24} className="text-white/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* Definition Section */}
      <section className="relative z-10 px-6 lg:px-12 py-20 bg-white">
        <div className="mx-auto max-w-4xl">
          <motion.div
            className={`p-8 ${liquidGlassClasses.light}`}
            style={{
              background: `linear-gradient(135deg, ${systemColors.blue}05 0%, ${systemColors.indigo}05 100%)`,
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: appleEase }}
          >
            <div className="flex items-start gap-4">
              <motion.div
                className="flex-shrink-0 rounded-xl p-3"
                style={{ backgroundColor: `${systemColors.blue}15` }}
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={subtleSpring}
              >
                <BookOpen size={24} style={{ color: systemColors.blue }} />
              </motion.div>
              <div>
                <h2
                  className="text-[22px] font-bold mb-4"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  サプリメントの科学的比較とは
                </h2>
                <p
                  className="text-[17px] leading-relaxed"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  サプリメントの科学的比較とは、医学文献データベース（PubMed）、システマティックレビュー（Cochrane
                  Library）、各国の公的機関（厚生労働省、NIH、EFSA）が公開する一次ソースに基づき、サプリメント成分の有効性（エビデンスレベル）、安全性（副作用・相互作用リスク）、適切な摂取量（RDA/UL）を数値化・ランク化して比較評価する手法です。
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5 Pillars Section */}
      <section
        className="py-24 px-6 lg:px-12"
        style={{ backgroundColor: appleWebColors.pageBackground }}
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="5つの評価軸"
            title="サプティアの5つの柱"
            subtitle="すべてのサプリメントを以下の5つの観点から評価し、S/A/B/C/Dの5段階でランク付けしています。"
            icon={Scale}
            color={systemColors.indigo}
          />

          <div className="space-y-4">
            {pillarsData.map((pillar, index) => (
              <PillarCard key={pillar.title} pillar={pillar} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Reference Sources Section */}
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="情報源"
            title="参照する一次ソース"
            subtitle="サプティアは以下の信頼性の高い情報源のみを参照しています。"
            icon={Database}
            color={systemColors.cyan}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sourcesData.map((source, index) => (
              <SourceCard key={source.name} source={source} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Evidence Level Section */}
      <section
        className="py-24 px-6 lg:px-12"
        style={{ backgroundColor: appleWebColors.pageBackground }}
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="エビデンス評価"
            title="エビデンスレベルの詳細"
            subtitle="サプリメント成分の科学的根拠を5段階で評価"
            icon={Microscope}
            color={systemColors.purple}
          />

          <div className="space-y-4">
            {evidenceLevels.map((level, index) => (
              <EvidenceLevelCard key={level.rank} level={level} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            eyebrow="よくある質問"
            title="FAQ"
            icon={Award}
            color={systemColors.blue}
          />

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <FAQAccordion
                key={index}
                faq={faq}
                index={index}
                isOpen={openFAQIndex === index}
                onToggle={() => handleFAQToggle(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-28">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${systemColors.blue}20 0%, transparent 60%)`,
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
          >
            <h2 className="mb-4 text-[28px] lg:text-[40px] font-bold text-white">
              科学的根拠に基づいた
              <br />
              サプリメント選びを
            </h2>
            <p className="mb-8 text-[17px] text-white/60">
              サプティアは透明な評価基準で、あなたに最適なサプリメント選びをサポートします。
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/products"
                className="group flex items-center gap-2 rounded-full px-8 py-3 min-h-[48px] font-semibold text-[17px] transition-all"
                style={{ backgroundColor: systemColors.blue, color: "#FFFFFF" }}
              >
                商品を探す
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/diagnosis"
                className="group flex items-center gap-2 rounded-full px-8 py-3 min-h-[48px] font-semibold text-[17px] bg-white/10 backdrop-blur-xl border border-white/20 text-white transition-all hover:bg-white/20"
              >
                無料診断を受ける
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
