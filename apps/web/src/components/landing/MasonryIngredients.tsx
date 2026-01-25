"use client";

import { useRef, useState, useCallback, useEffect, MouseEvent } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Flame, Star, Trophy, Medal, Sparkles } from "lucide-react";
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
import { getIngredientOGImage } from "@/lib/og-image";

// モバイル検出
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

// 3D Tilt Hook
const use3DTilt = (intensity: number = 15) => {
  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(y, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-intensity, intensity]);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) / rect.width);
      y.set((e.clientY - centerY) / rect.height);
    },
    [x, y],
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { rotateX, rotateY, handleMouseMove, handleMouseLeave, x, y };
};

interface IngredientWithStats {
  name: string;
  nameEn: string;
  category: string;
  description: string;
  slug: { current: string };
  productCount: number;
  minPrice: number;
  coverImage?: {
    asset: {
      url: string;
    };
  };
  sampleImageUrl?: string;
}

interface MasonryIngredientsProps {
  ingredients: IngredientWithStats[];
  title?: string;
  subtitle?: string;
}

// カテゴリカラー
const categoryColors: Record<string, string> = {
  ビタミン: systemColors.green,
  ミネラル: systemColors.blue,
  アミノ酸: systemColors.indigo,
  ハーブ: systemColors.teal,
  その他: systemColors.purple,
};

// カテゴリ別デフォルト説明文（descriptionがない場合のフォールバック）
const categoryDescriptions: Record<string, string> = {
  ビタミン:
    "体の機能を正常に保つために必要な栄養素。食事からの摂取が基本ですが、不足しがちな場合はサプリメントで補うことも。",
  ミネラル:
    "骨や歯の形成、体液バランスの維持など、様々な生理機能に関与する必須栄養素です。",
  アミノ酸:
    "タンパク質を構成する基本単位。筋肉の合成や疲労回復、免疫機能のサポートに関わります。",
  ハーブ:
    "植物由来の成分で、古くから健康維持に活用されてきました。現代でも研究が進んでいます。",
  その他:
    "健康維持をサポートする様々な成分。科学的な研究に基づいて評価しています。",
};

// 成分名に基づくカスタム説明文
const ingredientDescriptions: Record<string, string> = {
  // ビタミン類
  ビタミンA:
    "視力の維持や皮膚・粘膜の健康に重要。抗酸化作用もあり、免疫機能のサポートにも関わります。",
  ビタミンB1:
    "糖質をエネルギーに変換する際に必要。疲労回復や神経機能の維持に役立ちます。",
  ビタミンB2:
    "エネルギー代謝を助け、皮膚や粘膜の健康維持に貢献。成長期に特に重要な栄養素。",
  ビタミンB6:
    "タンパク質の代謝に関与し、神経伝達物質の合成をサポート。ホルモンバランスにも影響。",
  ビタミンB12:
    "神経系の健康維持や赤血球の形成に必要。植物性食品にはほとんど含まれないため、菜食主義者は特に注意が必要。",
  ビタミンC:
    "抗酸化作用があり、コラーゲンの生成や免疫機能をサポート。水溶性で体内に蓄積されにくいため、毎日の摂取が推奨されます。",
  ビタミンD:
    "カルシウムの吸収を助け、骨の健康維持に重要。日光浴で生成されますが、現代人は不足しがちです。",
  ビタミンE:
    "強力な抗酸化作用を持ち、細胞を酸化ストレスから守ります。血行促進や肌の健康維持にも。",
  ビタミンK:
    "血液凝固や骨の形成に必要な栄養素。納豆や緑黄色野菜に多く含まれます。",
  葉酸: "細胞分裂やDNA合成に必須。妊娠初期に特に重要で、胎児の正常な発育をサポートします。",
  ナイアシン: "エネルギー代謝に関与し、皮膚や粘膜の健康維持を助けます。",
  パントテン酸:
    "エネルギー代謝やホルモン合成に関与。ストレス対策にも重要とされています。",
  ビオチン: "皮膚や髪、爪の健康維持に関与。糖質や脂質の代謝もサポートします。",
  // ミネラル類
  亜鉛: "免疫機能や味覚の維持、傷の治癒に関与。体内で合成できないため、食事からの摂取が必要です。",
  鉄: "赤血球のヘモグロビン形成に必須。特に女性は月経により失われやすく、不足に注意が必要です。",
  マグネシウム:
    "300以上の酵素反応に関与し、筋肉や神経の機能をサポート。ストレスで消費されやすい栄養素。",
  カルシウム:
    "骨や歯の形成に不可欠。筋肉の収縮や神経伝達にも関わる重要なミネラルです。",
  カリウム:
    "体内の水分バランスを調整し、血圧の正常化をサポート。筋肉機能にも重要。",
  セレン:
    "抗酸化酵素の構成成分として、細胞を酸化ダメージから守ります。免疫機能にも関与。",
  銅: "鉄の代謝を助け、コラーゲン生成や神経機能にも関わるミネラルです。",
  マンガン:
    "骨の形成やエネルギー代謝に関与。抗酸化酵素の構成成分でもあります。",
  クロム: "糖質代謝をサポートし、インスリンの働きを助けるミネラルです。",
  // アミノ酸・タンパク質
  BCAA: "バリン、ロイシン、イソロイシンの総称。筋肉のエネルギー源となり、運動時のパフォーマンスをサポート。",
  グルタミン:
    "最も多いアミノ酸で、腸管の健康維持や免疫機能のサポートに関わります。",
  アルギニン:
    "成長ホルモンの分泌促進や血流改善に関与。運動パフォーマンスのサポートにも。",
  シトルリン:
    "血管を広げる作用があり、血流改善やパフォーマンス向上に関する研究があります。",
  タウリン:
    "心臓や筋肉に多く存在し、エネルギー代謝や神経機能をサポートします。",
  グリシン: "コラーゲンの構成成分で、睡眠の質の向上に関する研究もあります。",
  プロテイン:
    "筋肉の合成や維持に必須。運動後の回復や日々のタンパク質補給に活用されます。",
  コラーゲン:
    "皮膚や関節の主要構成成分。肌のハリや関節の健康維持をサポートします。",
  // ハーブ・植物由来
  アシュワガンダ:
    "アーユルヴェーダで使われるアダプトゲンハーブ。ストレス対策に関する研究が注目されています。",
  ロディオラ:
    "極地に自生するハーブで、疲労やストレスへの適応力に関する研究があります。",
  マカ: "アンデス原産の植物で、エネルギーやスタミナのサポートに伝統的に使用されてきました。",
  高麗人参:
    "東洋医学で重宝されるハーブ。活力や免疫機能のサポートに関する研究があります。",
  エキナセア:
    "北米原産のハーブで、免疫機能のサポートに関する研究が行われています。",
  ウコン:
    "クルクミンを含み、抗酸化作用に関する研究が多数。肝臓の健康にも注目されています。",
  ショウガ:
    "消化機能のサポートや体を温める作用で知られ、古くから健康維持に活用されています。",
  緑茶エキス:
    "カテキンやEGCGを含み、抗酸化作用や代謝サポートに関する研究があります。",
  // その他
  オメガ3:
    "EPAとDHAを含む必須脂肪酸。心血管の健康や脳機能のサポートに関する研究が多数あります。",
  DHA: "脳や網膜に多く含まれる必須脂肪酸。認知機能や視力のサポートに関する研究があります。",
  EPA: "血液サラサラ効果で知られる必須脂肪酸。心血管の健康維持をサポートします。",
  プロバイオティクス:
    "腸内環境を整える善玉菌。免疫機能や消化の健康維持に役立つとされています。",
  乳酸菌:
    "腸内フローラのバランスを整え、消化機能や免疫力のサポートに関わります。",
  食物繊維: "腸内環境を整え、血糖値の上昇を緩やかにする働きがあります。",
  コエンザイムQ10:
    "細胞のエネルギー産生に関与する補酵素。抗酸化作用も持ち、加齢とともに減少します。",
  αリポ酸:
    "強力な抗酸化物質で、糖質代謝のサポートにも関与。水溶性と脂溶性の両方の特性を持ちます。",
  レシチン:
    "細胞膜の構成成分で、脳機能や肝臓の健康維持をサポートするとされています。",
  NMN: "NAD+の前駆体として注目される成分。エネルギー代謝や細胞の健康維持に関する研究が進んでいます。",
  レスベラトロール:
    "ブドウの皮などに含まれるポリフェノール。長寿遺伝子との関連で注目されています。",
  クレアチン:
    "筋肉のエネルギー源として働き、高強度運動時のパフォーマンスをサポートします。",
  HMB: "ロイシンの代謝産物で、筋肉の合成促進や分解抑制に関する研究があります。",
  MCTオイル:
    "中鎖脂肪酸を含み、素早くエネルギーに変換されます。ケトジェニックダイエットでも人気。",
  ルテイン:
    "目の黄斑部に存在し、ブルーライトから目を守る働きがあるとされています。",
  アスタキサンチン:
    "強力な抗酸化作用を持つカロテノイド。目や肌の健康維持に注目されています。",
};

// 成分名から説明文を取得（部分一致対応）
function getIngredientDescription(
  name: string,
  category: string,
  description?: string,
): string {
  // 1. Sanityのdescriptionがあればそれを使用
  if (description) return description;

  // 2. 完全一致
  if (ingredientDescriptions[name]) {
    return ingredientDescriptions[name];
  }

  // 3. 括弧を除いた名前で検索（例：「ビタミンA（レチノール）」→「ビタミンA」）
  const nameWithoutParens = name.replace(/[（(].+[)）]/, "").trim();
  if (ingredientDescriptions[nameWithoutParens]) {
    return ingredientDescriptions[nameWithoutParens];
  }

  // 4. 部分一致検索（名前の先頭が一致するものを探す）
  const matchingKey = Object.keys(ingredientDescriptions).find(
    (key) => name.startsWith(key) || key.startsWith(nameWithoutParens),
  );
  if (matchingKey) {
    return ingredientDescriptions[matchingKey];
  }

  // 5. カテゴリのデフォルト説明文
  return categoryDescriptions[category] || categoryDescriptions.その他;
}

// ランキングバッジコンポーネント
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <motion.div
        className="absolute -top-2 -left-2 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
        }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.3 }}
      >
        <Trophy className="w-5 h-5 text-white" />
      </motion.div>
    );
  }
  if (rank === 2) {
    return (
      <motion.div
        className="absolute -top-2 -left-2 z-20 w-9 h-9 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: "linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)",
        }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.4 }}
      >
        <Medal className="w-4 h-4 text-white" />
      </motion.div>
    );
  }
  if (rank === 3) {
    return (
      <motion.div
        className="absolute -top-2 -left-2 z-20 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: "linear-gradient(135deg, #CD7F32 0%, #B87333 100%)",
        }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.5 }}
      >
        <Medal className="w-4 h-4 text-white" />
      </motion.div>
    );
  }
  return null;
}

// トレンドバッジ
function TrendBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    return (
      <motion.span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
        style={{
          background: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)",
          color: "white",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Flame className="w-3 h-3" />
        HOT
      </motion.span>
    );
  }
  if (rank <= 5) {
    return (
      <motion.span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
        style={{
          background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.indigo} 100%)`,
          color: "white",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <TrendingUp className="w-3 h-3" />
        人気
      </motion.span>
    );
  }
  return (
    <motion.span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{
        backgroundColor: `${systemColors.purple}20`,
        color: systemColors.purple,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 }}
    >
      <Star className="w-3 h-3" />
      定番
    </motion.span>
  );
}

// 光沢エフェクトコンポーネント
function ShineEffect({
  mouseX,
  isHovered,
}: {
  mouseX: MotionValue<number>;
  isHovered: boolean;
}) {
  const shineX = useTransform(mouseX, [-0.5, 0.5], ["-100%", "200%"]);

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: isHovered ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)`,
          x: shineX,
        }}
      />
    </motion.div>
  );
}

// Bento カードコンポーネント
function BentoCard({
  ingredient,
  index,
  gridArea,
  isLarge,
}: {
  ingredient: IngredientWithStats;
  index: number;
  gridArea: string;
  isLarge: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  const { rotateX, rotateY, handleMouseMove, handleMouseLeave, x } = use3DTilt(
    isLarge ? 10 : 15,
  );

  const color = categoryColors[ingredient.category] || categoryColors.その他;
  const rank = index + 1;

  const onMouseLeave = useCallback(() => {
    setIsHovered(false);
    handleMouseLeave();
  }, [handleMouseLeave]);

  return (
    <motion.div
      ref={ref}
      className="relative"
      style={{ gridArea, perspective: 1000 }}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: duration.scrollFadeIn,
        delay: index * 0.06,
        ease: appleEase,
      }}
    >
      {/* Rank Badge - 外側に配置してoverflow-hiddenの影響を受けないように */}
      <RankBadge rank={rank} />

      <Link href={`/ingredients/${ingredient.slug.current}`}>
        <motion.div
          className={`relative h-full overflow-hidden rounded-2xl cursor-pointer flex flex-col ${liquidGlassClasses.light}`}
          style={{
            rotateX: isMobile || prefersReducedMotion ? 0 : rotateX,
            rotateY: isMobile || prefersReducedMotion ? 0 : rotateY,
            transformStyle: "preserve-3d",
            borderColor: isHovered ? `${color}40` : "rgba(255, 255, 255, 0.8)",
            boxShadow: isHovered
              ? `0 20px 60px ${color}25, 0 10px 30px rgba(0, 0, 0, 0.1)`
              : "0 4px 24px rgba(0, 0, 0, 0.06)",
            minHeight: isMobile
              ? isLarge
                ? "200px"
                : "160px"
              : isLarge
                ? "320px"
                : "240px",
          }}
          animate={{
            scale: isHovered ? 1.02 : 1,
          }}
          transition={subtleSpring}
          onMouseMove={isMobile ? undefined : handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={onMouseLeave}
        >
          {/* Shine Effect */}
          {!isMobile && !prefersReducedMotion && (
            <ShineEffect mouseX={x} isHovered={isHovered} />
          )}

          {/* Image Section - Top */}
          <div
            className="relative overflow-hidden"
            style={{
              height: isMobile
                ? isLarge
                  ? "120px"
                  : "90px"
                : isLarge
                  ? "45%"
                  : "40%",
            }}
          >
            <Image
              src={getIngredientOGImage(ingredient.slug.current)}
              alt={ingredient.name}
              fill
              className="object-cover transition-transform duration-500"
              style={{
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
              sizes={
                isLarge
                  ? "(max-width: 768px) 100vw, 50vw"
                  : "(max-width: 768px) 50vw, 25vw"
              }
            />
            {/* Category + Trend Badge on Image */}
            <div
              className={`absolute flex items-center gap-1.5 ${isMobile ? "top-2 left-2" : "top-3 left-3"}`}
            >
              <span
                className={`inline-flex items-center rounded-full font-semibold backdrop-blur-md ${isMobile ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-1 text-[11px]"}`}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                  color: color,
                }}
              >
                {ingredient.category}
              </span>
              {!isMobile && <TrendBadge rank={rank} />}
            </div>
          </div>

          {/* Content Section - Bottom */}
          <div
            className={`relative flex-1 flex flex-col justify-between ${isMobile ? "p-3" : "p-4"}`}
            style={{ backgroundColor: "white" }}
          >
            {/* Name + Description */}
            <div>
              <h3
                className={`font-bold leading-tight mb-0.5 ${isMobile ? (isLarge ? "text-base" : "text-sm") : isLarge ? "text-lg" : "text-base"}`}
                style={{
                  color: isHovered ? color : appleWebColors.textPrimary,
                  transition: "color 0.3s ease",
                }}
              >
                {ingredient.name}
              </h3>
              <p
                className={`font-medium tracking-wide uppercase ${isMobile ? "text-[9px] mb-1" : "text-[11px] mb-2"}`}
                style={{ color: appleWebColors.textTertiary }}
              >
                {ingredient.nameEn}
              </p>

              {/* Description (Large cards only) */}
              {isLarge && (
                <p
                  className="text-[13px] leading-relaxed line-clamp-2"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  {getIngredientDescription(
                    ingredient.name,
                    ingredient.category,
                    ingredient.description,
                  )}
                </p>
              )}
            </div>

            {/* Bottom Stats */}
            <div
              className={`flex items-center justify-between border-t ${isMobile ? "pt-2 mt-1" : "pt-3 mt-2"}`}
              style={{ borderColor: `${color}15` }}
            >
              <div>
                <p
                  className={`uppercase tracking-wider ${isMobile ? "text-[8px] mb-0" : "text-[10px] mb-0.5"}`}
                  style={{ color: appleWebColors.textTertiary }}
                >
                  商品数
                </p>
                <p
                  className={`font-semibold ${isMobile ? "text-xs" : isLarge ? "text-base" : "text-sm"}`}
                  style={{ color: appleWebColors.textPrimary }}
                >
                  {ingredient.productCount}
                  <span
                    className={`font-normal ml-0.5 ${isMobile ? "text-[9px]" : "text-[11px]"}`}
                  >
                    種類
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`uppercase tracking-wider ${isMobile ? "text-[8px] mb-0" : "text-[10px] mb-0.5"}`}
                  style={{ color: appleWebColors.textTertiary }}
                >
                  最安価格
                </p>
                <p
                  className={`font-bold ${isMobile ? "text-xs" : isLarge ? "text-base" : "text-sm"}`}
                  style={{ color }}
                >
                  ¥{ingredient.minPrice.toLocaleString()}〜
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Accent Line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 z-20"
            style={{
              background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
            }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4, ease: appleEase }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function MasonryIngredients({
  ingredients,
  title = "人気の成分",
  subtitle = "科学的根拠に基づいた成分ガイド",
}: MasonryIngredientsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const isMobile = useIsMobile();

  const displayIngredients = ingredients.slice(0, isMobile ? 6 : 8);

  // Bento Grid 配置
  // Desktop: 4列レイアウト
  // gridTemplateAreas: "a a b c" "d e e f" "g h h h"
  // a=2列, e=2列, h=3列 が大きいカード
  const gridAreas = isMobile
    ? ["a", "b", "c", "d", "e", "f", "g", "h"]
    : ["a", "b", "c", "d", "e", "f", "g", "h"];

  const isLargeCard = (index: number) => {
    if (isMobile) return index === 0 || index === 5; // a, f が大きいカード
    // a(0)=2列, e(4)=2列, h(7)=3列
    return index === 0 || index === 4 || index === 7;
  };

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-32 overflow-hidden"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
        contain: "layout paint",
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: duration.scrollFadeIn, ease: appleEase }}
        >
          <div>
            <motion.div
              className="flex items-center gap-2 mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: duration.scrollFadeIn,
                delay: 0.08,
                ease: appleEase,
              }}
            >
              <span
                className="text-[13px] font-semibold tracking-[0.2em] uppercase"
                style={{ color: appleWebColors.textTertiary }}
              >
                成分を知る
              </span>
              <motion.span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.orange} 0%, ${systemColors.pink} 100%)`,
                  color: "white",
                }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-3 h-3" />
                RANKING
              </motion.span>
            </motion.div>
            <motion.h2
              className="text-[32px] md:text-[48px] font-bold leading-[1.05] tracking-[-0.015em] mb-2"
              style={{ color: appleWebColors.textPrimary }}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: duration.scrollFadeIn,
                delay: 0.15,
                ease: appleEase,
              }}
            >
              {title}
            </motion.h2>
            <p
              className={typography.title3}
              style={{ color: appleWebColors.textSecondary }}
            >
              {subtitle}
            </p>
          </div>
          <Link
            href="/ingredients"
            className={`group hidden sm:flex items-center gap-2 px-6 py-3 rounded-full min-h-[44px] ${liquidGlassClasses.light}`}
          >
            <span
              className="text-[15px] font-semibold"
              style={{ color: appleWebColors.textPrimary }}
            >
              全て見る
            </span>
            <TrendingUp
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              style={{ color: appleWebColors.textSecondary }}
              aria-hidden="true"
            />
          </Link>
        </motion.div>

        {/* Bento Grid */}
        <div
          className="grid gap-3 sm:gap-5 pt-2 pl-2 sm:pt-3 sm:pl-3"
          style={{
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            gridTemplateRows: isMobile ? "auto" : "auto auto",
            gridTemplateAreas: isMobile
              ? `"a a" "b c" "d e" "f f"`
              : `"a a b c" "d e e f" "g h h h"`,
          }}
        >
          {displayIngredients.map((ingredient, index) => (
            <BentoCard
              key={ingredient.slug.current}
              ingredient={ingredient}
              index={index}
              gridArea={gridAreas[index]}
              isLarge={isLargeCard(index)}
            />
          ))}
        </div>

        {/* Mobile Link */}
        <motion.div
          className="sm:hidden mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, ease: appleEase }}
        >
          <Link
            href="/ingredients"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full min-h-[44px] ${liquidGlassClasses.light}`}
          >
            <span
              className="text-[15px] font-semibold"
              style={{ color: appleWebColors.textPrimary }}
            >
              すべての成分を見る
            </span>
            <TrendingUp
              className="w-4 h-4"
              style={{ color: appleWebColors.textSecondary }}
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
