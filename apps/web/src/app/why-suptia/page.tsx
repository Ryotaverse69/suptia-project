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
  Bot,
  ShieldCheck,
  TrendingUp,
  FileText,
  Bell,
  Users,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Search,
  Scale,
  Clock,
  Heart,
  Plus,
  Zap,
} from "lucide-react";

// Apple式：モバイル検出フック
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

// Apple式イージング
const appleEase = [0.22, 1, 0.36, 1] as const;

// AI限界カードのデータ
const aiLimitations = [
  {
    icon: Scale,
    title: "法的責任がない",
    description:
      "AIは法的責任を取れません。薬機法に違反する表現をそのまま出力するリスクがあり、誤った情報を信じてしまう危険性があります。",
  },
  {
    icon: Users,
    title: "あなたを知らない",
    description:
      "AIは一般論しか答えられません。あなたの既往歴、服用中の薬、アレルギーを考慮した個別のアドバイスは不可能です。",
  },
  {
    icon: Clock,
    title: "価格は瞬間的",
    description:
      "AIは「今の価格」しか知りません。価格の推移、セールのパターン、買い時の判断はAIには不可能です。",
  },
  {
    icon: FileText,
    title: "根拠が不透明",
    description:
      "AIの推薦は「なぜその商品を選んだか」が不明確。根拠を確認できず、判断の正当性を検証できません。",
  },
  {
    icon: Bell,
    title: "購入後フォローなし",
    description:
      "AIは一度の回答で終わり。価格が下がった時の通知、継続的なサポートは期待できません。",
  },
  {
    icon: Search,
    title: "エビデンスが浅い",
    description:
      "AIは表面的な情報しか提供しません。PubMedやCochraneの一次ソースに基づく深い科学的評価は困難です。",
  },
];

// 比較表データ
const comparisonData = [
  { feature: "薬機法コンプライアンス", ai: false, suptia: true, note: null },
  {
    feature: "個人の既往歴に基づく判定",
    ai: false,
    suptia: true,
    note: "coming soon",
  },
  {
    feature: "成分×薬剤の相互作用チェック",
    ai: false,
    suptia: true,
    note: "coming soon",
  },
  {
    feature: "複数ECサイトの価格比較",
    ai: "limited",
    suptia: true,
    note: "4サイト対応",
  },
  {
    feature: "価格履歴・トレンド分析",
    ai: false,
    suptia: true,
    note: "coming soon",
  },
  {
    feature: "価格アラート通知",
    ai: false,
    suptia: true,
    note: "coming soon",
  },
  {
    feature: "推薦根拠の100%明示",
    ai: false,
    suptia: true,
    note: "5つの柱で評価",
  },
  {
    feature: "PubMed/Cochraneの引用",
    ai: "unstable",
    suptia: true,
    note: null,
  },
  {
    feature: "エビデンスレベル評価",
    ai: false,
    suptia: true,
    note: "S/A/B/C/D評価",
  },
];

// 5つの柱データ
const pillars = [
  {
    emoji: "💰",
    title: "価格比較",
    description: "楽天・Amazon・Yahoo・iHerbの最安値を表示",
    gradient: "from-amber-50 to-amber-100/50",
    color: "#f59e0b",
  },
  {
    emoji: "📊",
    title: "成分量比較",
    description: "1日あたりの有効成分量を正確に表示",
    gradient: "from-blue-50 to-blue-100/50",
    color: "#3b82f6",
  },
  {
    emoji: "💡",
    title: "コスパ比較",
    description: "成分量あたりの価格（¥/mg）を算出",
    gradient: "from-emerald-50 to-emerald-100/50",
    color: "#10b981",
  },
  {
    emoji: "🔬",
    title: "エビデンス",
    description: "S/A/B/C/Dの5段階で科学的根拠を評価",
    gradient: "from-violet-50 to-violet-100/50",
    color: "#8b5cf6",
  },
  {
    emoji: "🛡️",
    title: "安全性",
    description: "0-100点のスコアと副作用・相互作用情報",
    gradient: "from-rose-50 to-rose-100/50",
    color: "#f43f5e",
  },
];

// FAQデータ
const faqData = [
  {
    question: "AI検索とサプティアを併用すべきですか？",
    answer:
      "はい、併用をおすすめします。AI検索は一般的な情報収集に優れています。一方、サプティアは価格比較、安全性評価、エビデンス確認など、購入判断に必要な具体的な情報を提供します。AI検索で興味を持った商品をサプティアで詳しく調べる、という使い方が効果的です。",
  },
  {
    question: "サプティアの情報は信頼できますか？",
    answer:
      "サプティアのすべての情報は、PubMed、Cochrane Library、厚生労働省などの信頼できる一次ソースに基づいています。また、すべてのコンテンツは薬機法に準拠しており、エビデンスレベル（S/A/B/C/D）で科学的根拠の強さを明示しています。",
  },
  {
    question: "無料で使えますか？",
    answer:
      "はい、基本機能は完全無料です。商品検索、価格比較、成分ガイド、診断機能などをお使いいただけます。将来的には、価格アラートや相互作用チェッカーなどの高度な機能を提供するプレミアムプランも予定しています。",
  },
  {
    question: "サプティアはどうやって収益を得ていますか？",
    answer:
      "サプティアは、ECサイトへのアフィリエイトリンクを通じて収益を得ています。ただし、アフィリエイト収益は推薦順位に一切影響しません。すべての商品は、エビデンス、安全性、コストパフォーマンスの客観的な基準で評価されています。",
  },
];

// ========== コンポーネント ==========

// AI限界カード
function LimitationCard({
  item,
  index,
}: {
  item: (typeof aiLimitations)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  const Icon = item.icon;

  return (
    <motion.div
      ref={ref}
      className="relative will-change-transform"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: isMobile ? 0.4 : 0.6,
        delay: isMobile ? index * 0.05 : index * 0.1,
        ease: appleEase,
      }}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      style={{ transform: "translateZ(0)" }}
    >
      <motion.div
        className="relative bg-white rounded-2xl p-6 border border-slate-100 overflow-hidden will-change-transform"
        animate={
          isMobile
            ? {}
            : {
                scale: isHovered ? 1.02 : 1,
                y: isHovered ? -4 : 0,
                boxShadow: isHovered
                  ? "0 20px 40px -15px rgba(220, 38, 38, 0.15)"
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
              }
        }
        transition={{ duration: 0.3, ease: appleEase }}
        style={{ transform: "translateZ(0)" }}
      >
        {/* ホバー時のグロー */}
        {!isMobile && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.05) 0%, transparent 60%)",
            }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        )}

        <motion.div
          className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 will-change-transform"
          animate={
            isMobile
              ? {}
              : {
                  scale: isHovered ? 1.1 : 1,
                  rotate: isHovered ? -5 : 0,
                }
          }
          transition={{ duration: 0.3, ease: appleEase }}
          style={{ transform: "translateZ(0)" }}
        >
          <Icon className="text-red-500" size={24} />
        </motion.div>
        <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">
          {item.description}
        </p>

        {/* 底部アクセントライン */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-400 to-red-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: appleEase }}
          style={{ transformOrigin: "left" }}
        />
      </motion.div>
    </motion.div>
  );
}

// 比較表の行
function ComparisonRow({
  item,
  index,
}: {
  item: (typeof comparisonData)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const isMobile = useIsMobile();

  return (
    <motion.tr
      ref={ref}
      className="border-b border-slate-100 last:border-0"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: appleEase,
      }}
    >
      <td className="px-4 sm:px-6 py-4 text-slate-800 text-sm sm:text-base">
        {item.feature}
      </td>
      <td className="px-4 sm:px-6 py-4 text-center">
        {item.ai === false ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.3, delay: index * 0.05 + 0.2 }}
          >
            <XCircle className="inline text-red-400" size={20} />
          </motion.div>
        ) : (
          <span className="text-slate-400 text-xs sm:text-sm">
            {item.ai === "limited" ? "限定的" : "不安定"}
          </span>
        )}
      </td>
      <td className="px-4 sm:px-6 py-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{
            duration: 0.4,
            delay: index * 0.05 + 0.3,
            type: isMobile ? "tween" : "spring",
            stiffness: 200,
          }}
        >
          <CheckCircle2 className="inline text-emerald-500" size={20} />
          {item.note && (
            <span className="text-xs text-slate-400 block mt-0.5">
              {item.note}
            </span>
          )}
        </motion.div>
      </td>
    </motion.tr>
  );
}

// 5つの柱カード
function PillarCard({
  pillar,
  index,
}: {
  pillar: (typeof pillars)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className="relative will-change-transform"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: isMobile ? 0.4 : 0.6,
        delay: isMobile ? index * 0.05 : index * 0.1,
        ease: appleEase,
      }}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      style={{ transform: "translateZ(0)" }}
    >
      <motion.div
        className={`relative bg-gradient-to-br ${pillar.gradient} rounded-2xl p-6 text-center overflow-hidden will-change-transform`}
        animate={
          isMobile
            ? {}
            : {
                scale: isHovered ? 1.05 : 1,
                y: isHovered ? -8 : 0,
                boxShadow: isHovered
                  ? `0 25px 50px -12px ${pillar.color}30`
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
              }
        }
        transition={{ duration: 0.4, ease: appleEase }}
        style={{ transform: "translateZ(0)" }}
      >
        {/* フローティング絵文字 */}
        <motion.div
          className="text-4xl sm:text-5xl mb-4 will-change-transform"
          animate={
            isMobile || prefersReducedMotion
              ? {}
              : {
                  y: isHovered ? -5 : 0,
                  scale: isHovered ? 1.2 : 1,
                  rotate: isHovered ? [0, -10, 10, 0] : 0,
                }
          }
          transition={{ duration: 0.4, ease: appleEase }}
          style={{ transform: "translateZ(0)" }}
        >
          {pillar.emoji}
        </motion.div>
        <h3 className="font-bold text-slate-800 mb-2">{pillar.title}</h3>
        <p className="text-slate-500 text-sm">{pillar.description}</p>

        {/* ホバー時のシャイン効果 */}
        {!isMobile && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.6) 45%, rgba(255,255,255,0.6) 50%, transparent 55%)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: isHovered ? "100%" : "-100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

// FAQアコーディオンアイテム
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
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  return (
    <motion.div
      ref={ref}
      className="relative will-change-transform"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: appleEase,
      }}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      style={{ transform: "translateZ(0)" }}
    >
      <motion.div
        className={`relative overflow-hidden rounded-2xl border transition-colors duration-300 will-change-transform ${
          isOpen
            ? "bg-slate-50 border-primary/20"
            : "bg-white border-slate-200 hover:border-primary/20"
        }`}
        animate={{
          boxShadow: isOpen
            ? "0 20px 25px -5px rgba(59, 102, 224, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            : isHovered && !isMobile
              ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
              : "0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
        style={{ transform: "translateZ(0)" }}
      >
        <motion.button
          className="w-full flex items-center justify-between p-5 sm:p-6 text-left will-change-transform"
          onClick={onToggle}
          whileHover={isMobile ? {} : { x: 4 }}
          transition={{ duration: 0.2 }}
          style={{ transform: "translateZ(0)" }}
        >
          <span className="flex items-center gap-3 sm:gap-4">
            <motion.span
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
                isOpen ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
              }`}
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: appleEase }}
            >
              {String(index + 1).padStart(2, "0")}
            </motion.span>
            <motion.span
              className="text-sm sm:text-base font-medium text-slate-800 pr-4"
              animate={{ color: isOpen ? "#3b66e0" : "#1e293b" }}
              transition={{ duration: 0.3 }}
            >
              {item.question}
            </motion.span>
          </span>

          <motion.div
            className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
              isOpen ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
            }`}
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: appleEase }}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.div>
        </motion.button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: {
                  height: { duration: 0.4, ease: appleEase },
                  opacity: { duration: 0.3, delay: 0.1 },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: { duration: 0.3, ease: appleEase },
                  opacity: { duration: 0.2 },
                },
              }}
              style={{ overflow: "hidden" }}
            >
              <motion.div
                className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2 will-change-transform"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1, ease: appleEase }}
                style={{ transform: "translateZ(0)" }}
              >
                <div className="pl-11 sm:pl-12 border-l-2 border-primary/30">
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 底部アクセントライン */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-[#7a98ec]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isOpen ? 1 : 0 }}
          transition={{ duration: 0.4, ease: appleEase }}
          style={{ transformOrigin: "left" }}
        />
      </motion.div>
    </motion.div>
  );
}

// ========== メインページ ==========

export default function WhySuptiaPage() {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  // スクロールパララックス用
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.5], [1, 0]);

  // 各セクションの参照
  const limitationsRef = useRef(null);
  const limitationsInView = useInView(limitationsRef, {
    once: true,
    margin: "-10%",
  });
  const comparisonRef = useRef(null);
  const comparisonInView = useInView(comparisonRef, {
    once: true,
    margin: "-10%",
  });
  const pillarsRef = useRef(null);
  const pillarsInView = useInView(pillarsRef, { once: true, margin: "-10%" });
  const catchphraseRef = useRef(null);
  const catchphraseInView = useInView(catchphraseRef, {
    once: true,
    margin: "-10%",
  });
  const faqRef = useRef(null);
  const faqInView = useInView(faqRef, { once: true, margin: "-10%" });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-10%" });

  // FAQ state
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0);
  const handleFAQToggle = useCallback((index: number) => {
    setOpenFAQIndex((current) => (current === index ? null : index));
  }, []);

  // ホバー状態
  const [heroButtonHovered, setHeroButtonHovered] = useState(false);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-50 to-white"
      style={{ contain: "layout" }}
    >
      {/* ========== ヒーローセクション - 革新的デザイン ========== */}
      <motion.section
        ref={heroRef}
        className="relative overflow-hidden py-24 sm:py-32 lg:py-40 min-h-[90vh] flex items-center"
      >
        {/* アニメーション背景グラデーション */}
        {isMobile || prefersReducedMotion ? (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
            }}
          />
        ) : (
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={{ transform: "translateZ(0)" }}
            animate={{
              background: [
                "linear-gradient(135deg, #0f172a 0%, #1e3a5f 25%, #1e293b 50%, #0f172a 100%)",
                "linear-gradient(135deg, #1e293b 0%, #0f172a 25%, #1e3a5f 50%, #1e293b 100%)",
                "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0f172a 50%, #1e3a5f 100%)",
                "linear-gradient(135deg, #0f172a 0%, #1e3a5f 25%, #1e293b 50%, #0f172a 100%)",
              ],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* グリッドパターン */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59,102,224,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59,102,224,0.3) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* フローティングオーブ - 強化版 */}
        {!isMobile && !prefersReducedMotion && (
          <>
            {/* メインブルーオーブ */}
            <motion.div
              className="absolute top-[10%] left-[5%] w-96 h-96 rounded-full will-change-transform"
              style={{
                background:
                  "radial-gradient(circle, rgba(59,102,224,0.25) 0%, rgba(59,102,224,0.1) 40%, transparent 70%)",
                filter: "blur(60px)",
                transform: "translateZ(0)",
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, 30, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* ミントグリーンオーブ */}
            <motion.div
              className="absolute bottom-[15%] right-[10%] w-72 h-72 rounded-full will-change-transform"
              style={{
                background:
                  "radial-gradient(circle, rgba(100,229,179,0.2) 0%, rgba(100,229,179,0.08) 40%, transparent 70%)",
                filter: "blur(50px)",
                transform: "translateZ(0)",
              }}
              animate={{
                y: [0, 40, 0],
                x: [0, -20, 0],
                scale: [1, 0.85, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
            {/* パープルオーブ */}
            <motion.div
              className="absolute top-[40%] right-[20%] w-48 h-48 rounded-full will-change-transform"
              style={{
                background:
                  "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
                filter: "blur(40px)",
                transform: "translateZ(0)",
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, -40, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
            {/* オレンジオーブ */}
            <motion.div
              className="absolute bottom-[30%] left-[15%] w-36 h-36 rounded-full will-change-transform"
              style={{
                background:
                  "radial-gradient(circle, rgba(251,146,60,0.15) 0%, transparent 70%)",
                filter: "blur(30px)",
                transform: "translateZ(0)",
              }}
              animate={{
                y: [0, 25, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3,
              }}
            />
          </>
        )}

        {/* フローティングパーティクル */}
        {!isMobile && !prefersReducedMotion && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/30"
                style={{
                  left: `${5 + ((i * 4.5) % 90)}%`,
                  top: `${10 + ((i * 7) % 80)}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 4 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}

        {/* ジオメトリックシェイプ - デスクトップのみ */}
        {!isMobile && !prefersReducedMotion && (
          <>
            {/* 回転する六角形 */}
            <motion.div
              className="absolute top-[20%] right-[25%] w-16 h-16 border border-primary/20 will-change-transform"
              style={{
                clipPath:
                  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                transform: "translateZ(0)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            {/* 回転するダイアモンド */}
            <motion.div
              className="absolute bottom-[25%] left-[20%] w-12 h-12 border border-[#64e5b3]/20 will-change-transform"
              style={{
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                transform: "translateZ(0)",
              }}
              animate={{ rotate: -360, scale: [1, 1.2, 1] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            {/* パルスリング */}
            <motion.div
              className="absolute top-[60%] right-[10%] w-24 h-24 rounded-full border border-primary/10 will-change-transform"
              style={{ transform: "translateZ(0)" }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
            />
          </>
        )}

        <motion.div
          className="container mx-auto px-4 max-w-6xl relative z-10"
          style={isMobile ? {} : { y: heroY, opacity: heroOpacity }}
        >
          <div className="max-w-4xl mx-auto text-center">
            {/* バッジ - 強化版 */}
            <motion.div
              className="relative inline-flex items-center gap-2 mb-8"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: appleEase }}
            >
              {/* パルスリング */}
              {!isMobile && !prefersReducedMotion && (
                <>
                  <motion.div
                    className="absolute -inset-2 rounded-full bg-primary/20"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -inset-1 rounded-full bg-primary/30"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                  />
                </>
              )}
              <div className="relative px-5 py-2.5 bg-gradient-to-r from-primary/20 to-[#7a98ec]/20 backdrop-blur-sm rounded-full border border-primary/30">
                <span className="flex items-center gap-2 text-sm font-medium text-white">
                  <Bot size={16} className="text-primary" />
                  AI時代のサプリメント選び
                </span>
              </div>
            </motion.div>

            {/* メインタイトル - 文字アニメーション強化 */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-[1.1]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span
                className="block text-white mb-2"
                initial={{ opacity: 0, y: 40, rotateX: -30 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
              >
                AIが答えを出す時代。
              </motion.span>
              <motion.span
                className="block relative"
                initial={{ opacity: 0, y: 40, rotateX: -30 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: appleEase }}
              >
                {/* グラデーションテキスト */}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #64e5b3 0%, #3b66e0 50%, #7a98ec 100%)",
                  }}
                >
                  Suptiaはその根拠を示す。
                </span>
                {/* テキストグロー */}
                {!isMobile && (
                  <motion.span
                    className="absolute inset-0 bg-clip-text text-transparent pointer-events-none"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #64e5b3 0%, #3b66e0 50%, #7a98ec 100%)",
                      filter: "blur(20px)",
                      opacity: 0.5,
                    }}
                    aria-hidden
                  >
                    Suptiaはその根拠を示す。
                  </motion.span>
                )}
              </motion.span>
            </motion.h1>

            {/* サブテキスト */}
            <motion.p
              className="text-lg sm:text-xl lg:text-2xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: appleEase }}
            >
              ChatGPTやPerplexityは便利です。
              <br className="hidden sm:block" />
              でも、あなたの身体のことは
              <br className="sm:hidden" />
              <strong className="text-white font-semibold">
                根拠を持って判断できるサプティア
              </strong>
              に。
            </motion.p>

            {/* CTAボタン - 強化版 */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: appleEase }}
            >
              <Link href="/products">
                <motion.button
                  className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-semibold text-lg overflow-hidden will-change-transform"
                  whileHover={isMobile ? {} : { scale: 1.05 }}
                  whileTap={isMobile ? {} : { scale: 0.95 }}
                  onMouseEnter={() => setHeroButtonHovered(true)}
                  onMouseLeave={() => setHeroButtonHovered(false)}
                  style={{ transform: "translateZ(0)" }}
                >
                  {/* パルスリング */}
                  {!isMobile && !prefersReducedMotion && (
                    <motion.div
                      className="absolute -inset-1 rounded-2xl"
                      style={{
                        background:
                          "linear-gradient(135deg, #64e5b3, #3b66e0, #7a98ec)",
                      }}
                      animate={{
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  {/* グラデーション背景 */}
                  {isMobile || prefersReducedMotion ? (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#64e5b3] to-primary rounded-2xl" />
                  ) : (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#64e5b3] via-primary to-[#7a98ec] bg-[length:200%_100%] rounded-2xl"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}
                  {/* シャイン効果 */}
                  {!isMobile && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl"
                      initial={{ x: "-100%" }}
                      animate={{ x: heroButtonHovered ? "100%" : "-100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 text-white font-bold">
                    商品を探す
                  </span>
                  <motion.span
                    className="relative z-10"
                    animate={
                      !isMobile && !prefersReducedMotion ? { x: [0, 5, 0] } : {}
                    }
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="text-white" size={20} />
                  </motion.span>
                </motion.button>
              </Link>
              <Link href="/diagnosis">
                <motion.button
                  className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-semibold text-lg overflow-hidden will-change-transform bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
                  whileHover={isMobile ? {} : { scale: 1.05 }}
                  whileTap={isMobile ? {} : { scale: 0.95 }}
                  style={{ transform: "translateZ(0)" }}
                >
                  <span className="text-white">診断を受ける</span>
                  {isMobile || prefersReducedMotion ? (
                    <Sparkles size={20} className="text-[#64e5b3]" />
                  ) : (
                    <motion.span
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles size={20} className="text-[#64e5b3]" />
                    </motion.span>
                  )}
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* ========== AI検索の限界セクション ========== */}
      <section
        ref={limitationsRef}
        className="py-20 sm:py-24"
        style={{ contain: "layout paint" }}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          {/* ヘッダー */}
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={limitationsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: appleEase }}
          >
            <motion.div
              className="inline-flex items-center justify-center gap-3 mb-6"
              initial={{ scale: 0 }}
              animate={limitationsInView ? { scale: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.2,
                type: isMobile ? "tween" : "spring",
                stiffness: 200,
              }}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
            </motion.div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              AI検索は便利。でも、サプリ選びには限界がある。
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              ChatGPT、Perplexity、Google
              SGEなどのAI検索は素晴らしいツールです。
              しかし、サプリメント選びにおいては重要な限界があります。
            </p>
          </motion.div>

          {/* カードグリッド */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {aiLimitations.map((item, index) => (
              <LimitationCard key={item.title} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== 比較表セクション ========== */}
      <section
        ref={comparisonRef}
        className="py-20 sm:py-24 bg-slate-50"
        style={{ contain: "layout paint" }}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          {/* ヘッダー */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={comparisonInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: appleEase }}
          >
            <motion.div
              className="inline-flex items-center justify-center gap-3 mb-6"
              initial={{ scale: 0, rotate: isMobile ? 0 : -180 }}
              animate={comparisonInView ? { scale: 1, rotate: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2,
                type: isMobile ? "tween" : "spring",
                stiffness: 200,
              }}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7a98ec] to-primary flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </motion.div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              AI検索 vs サプティア
            </h2>
            <p className="text-slate-500">
              サプリメント選びに必要な機能を比較してみましょう
            </p>
          </motion.div>

          {/* テーブル */}
          <motion.div
            className="overflow-x-auto rounded-2xl shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={comparisonInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: appleEase }}
          >
            <table className="w-full bg-white overflow-hidden min-w-[500px]">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-4 sm:px-6 py-4 text-left font-semibold text-slate-800">
                    機能
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-center font-semibold text-slate-400">
                    AI検索
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-center font-semibold text-primary">
                    サプティア
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <ComparisonRow key={item.feature} item={item} index={index} />
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ========== 5つの柱セクション ========== */}
      <section
        ref={pillarsRef}
        className="py-20 sm:py-24"
        style={{ contain: "layout paint" }}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          {/* ヘッダー */}
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={pillarsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: appleEase }}
          >
            <motion.div
              className="inline-flex items-center justify-center gap-3 mb-6"
              initial={{ scale: 0 }}
              animate={pillarsInView ? { scale: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.2,
                type: isMobile ? "tween" : "spring",
                stiffness: 200,
              }}
            >
              {isMobile || prefersReducedMotion ? (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#64e5b3] to-primary flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
              ) : (
                <motion.div
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#64e5b3] to-primary flex items-center justify-center shadow-lg will-change-transform"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  style={{ transform: "translateZ(0)" }}
                >
                  <ShieldCheck className="w-6 h-6 text-white" />
                </motion.div>
              )}
            </motion.div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              サプティアの5つの柱
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              すべての商品を5つの観点で透明に評価。
              <br />
              <strong className="text-slate-700">
                「なぜこの商品を選ぶべきか」が100%理解できます。
              </strong>
            </p>
          </motion.div>

          {/* 柱カード */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {pillars.map((pillar, index) => (
              <PillarCard key={pillar.title} pillar={pillar} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== キャッチコピーセクション ========== */}
      <section
        ref={catchphraseRef}
        className="relative py-20 sm:py-24 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(59,102,224,0.05) 0%, rgba(59,102,224,0.1) 100%)",
          contain: "layout paint",
        }}
      >
        {/* 背景デコレーション */}
        {!isMobile && !prefersReducedMotion && (
          <motion.div
            className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
            style={{
              background:
                "radial-gradient(circle, rgba(59,102,224,0.1) 0%, transparent 70%)",
              filter: "blur(60px)",
              transform: "translateZ(0)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          {/* バッジ */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={catchphraseInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: appleEase }}
          >
            <Heart size={16} />
            あなたの健康のために
          </motion.div>

          {/* メインテキスト */}
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={catchphraseInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: appleEase }}
          >
            <motion.span
              className="text-primary"
              initial={{ opacity: 0 }}
              animate={catchphraseInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              AIは一般論。
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0 }}
              animate={catchphraseInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              サプティアはあなた専用。
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={catchphraseInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: appleEase }}
          >
            サプリメント選びは、価格だけでなく、あなたの身体、目的、安全性を総合的に考慮する必要があります。
            サプティアは、科学的根拠に基づいて「あなたに最適な選択」を支援します。
          </motion.p>

          {/* CTAボタン */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={catchphraseInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: appleEase }}
          >
            <Link href="/products">
              <motion.button
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow will-change-transform"
                whileHover={isMobile ? {} : { scale: 1.02 }}
                whileTap={isMobile ? {} : { scale: 0.98 }}
                style={{ transform: "translateZ(0)" }}
              >
                商品を探す
                <ArrowRight size={18} />
              </motion.button>
            </Link>
            <Link href="/ingredients">
              <motion.button
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-800 rounded-xl font-semibold border-2 border-slate-200 hover:border-primary/30 hover:bg-slate-50 transition-all will-change-transform"
                whileHover={isMobile ? {} : { scale: 1.02 }}
                whileTap={isMobile ? {} : { scale: 0.98 }}
                style={{ transform: "translateZ(0)" }}
              >
                成分を学ぶ
                <FileText size={18} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========== FAQセクション ========== */}
      <section
        ref={faqRef}
        className="py-20 sm:py-24"
        style={{ contain: "layout paint" }}
      >
        <div className="container mx-auto px-4 max-w-4xl">
          {/* ヘッダー */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: appleEase }}
          >
            <motion.div
              className="inline-flex items-center justify-center gap-3 mb-6"
              initial={{ scale: 0, rotate: isMobile ? 0 : -180 }}
              animate={faqInView ? { scale: 1, rotate: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2,
                type: isMobile ? "tween" : "spring",
                stiffness: 200,
              }}
            >
              {isMobile || prefersReducedMotion ? (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7a98ec] to-primary flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              ) : (
                <motion.div
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7a98ec] to-primary flex items-center justify-center shadow-lg will-change-transform"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  style={{ transform: "translateZ(0)" }}
                >
                  <Zap className="w-6 h-6 text-white" />
                </motion.div>
              )}
            </motion.div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              よくある質問
            </h2>
          </motion.div>

          {/* FAQアイテム */}
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <FAQItem
                key={index}
                item={item}
                index={index}
                isOpen={openFAQIndex === index}
                onToggle={() => handleFAQToggle(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========== 最終CTAセクション ========== */}
      <section
        ref={ctaRef}
        className="relative py-20 sm:py-24 overflow-hidden"
        style={{ contain: "layout paint" }}
      >
        {/* グラデーション背景 */}
        {isMobile || prefersReducedMotion ? (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#5a7fe6] to-primary" />
        ) : (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary via-[#5a7fe6] to-[#7a98ec] bg-[length:200%_200%] will-change-transform"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ transform: "translateZ(0)" }}
          />
        )}

        {/* 背景パターン */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* フローティングオーブ */}
        {!isMobile && !prefersReducedMotion && (
          <>
            <motion.div
              className="absolute top-10 left-[20%] w-32 h-32 rounded-full will-change-transform"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
                filter: "blur(20px)",
                transform: "translateZ(0)",
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-10 right-[20%] w-24 h-24 rounded-full will-change-transform"
              style={{
                background:
                  "radial-gradient(circle, rgba(100,229,179,0.3) 0%, transparent 70%)",
                filter: "blur(15px)",
                transform: "translateZ(0)",
              }}
              animate={{
                y: [0, 15, 0],
                x: [0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </>
        )}

        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: appleEase }}
          >
            根拠を持ってサプリを選ぼう
          </motion.h2>
          <motion.p
            className="text-white/80 mb-8 max-w-2xl mx-auto text-base sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
          >
            476以上の商品、100以上の成分ガイド。
            <br />
            科学的根拠に基づいた、あなたに最適なサプリメント選びを。
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: appleEase }}
          >
            <Link href="/diagnosis">
              <motion.button
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-semibold shadow-xl overflow-hidden will-change-transform"
                whileHover={isMobile ? {} : { scale: 1.05 }}
                whileTap={isMobile ? {} : { scale: 0.95 }}
                style={{ transform: "translateZ(0)" }}
              >
                {/* シャイン効果 */}
                {!isMobile && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">無料診断を受ける</span>
                <ArrowRight className="relative z-10" size={18} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
