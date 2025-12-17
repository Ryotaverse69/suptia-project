/**
 * ビタミンC比較記事ページ
 * SEO最適化された比較コンテンツ
 */

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanity } from "@/lib/sanity.client";
import { calculateEffectiveCostPerDay } from "@/lib/cost";
import {
  ArrowRight,
  Award,
  Shield,
  TrendingUp,
  DollarSign,
  FlaskConical,
  CheckCircle2,
  ExternalLink,
  Calculator,
} from "lucide-react";
import {
  appleWebColors,
  systemColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";
import { getArticleOGImage, generateOGImageMeta } from "@/lib/og-image";

export const revalidate = 86400; // 24時間キャッシュ

const ARTICLE_DATA = {
  title: "【2025年最新】ビタミンCサプリおすすめ比較｜コスパ・品質で徹底分析",
  description:
    "ビタミンCサプリメントを価格・成分量・コスパ・安全性で徹底比較。mg単価から見た本当のコスパランキングと、目的別おすすめ商品を紹介。",
  publishedAt: "2025-01-15",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "ビタミンC",
  ingredientSlug: "vitamin-c",
};

// OGP画像を取得（Cloudinaryから自動生成された画像を使用）
const ogImageUrl = getArticleOGImage("vitamin-c-comparison");
const ogImage = generateOGImageMeta(
  ogImageUrl,
  "ビタミンCサプリメント比較 - Suptia",
);

export const metadata: Metadata = {
  title: ARTICLE_DATA.title,
  description: ARTICLE_DATA.description,
  keywords: [
    "ビタミンC",
    "サプリメント",
    "おすすめ",
    "比較",
    "コスパ",
    "2025",
    "ランキング",
    "mg単価",
    "アスコルビン酸",
  ],
  openGraph: {
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    type: "article",
    publishedTime: ARTICLE_DATA.publishedAt,
    modifiedTime: ARTICLE_DATA.updatedAt,
    url: "https://suptia.com/articles/vitamin-c-comparison",
    siteName: "サプティア",
    locale: "ja_JP",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    images: [ogImageUrl],
  },
  alternates: {
    canonical: "https://suptia.com/articles/vitamin-c-comparison",
  },
};

interface Product {
  _id: string;
  name: string;
  priceJPY: number;
  servingsPerContainer: number;
  servingsPerDay: number;
  externalImageUrl?: string;
  slug: { current: string };
  source?: string;
  tierRatings?: {
    priceRank?: string;
    costEffectivenessRank?: string;
    overallRank?: string;
  };
  badges?: string[];
  ingredients?: Array<{
    amountMgPerServing: number;
    ingredient?: { name: string };
  }>;
}

async function getVitaminCProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock" && references(*[_type == "ingredient" && slug.current == "vitamin-c"]._id)] | order(priceJPY asc)[0...20]{
    _id,
    name,
    priceJPY,
    servingsPerContainer,
    servingsPerDay,
    externalImageUrl,
    slug,
    source,
    tierRatings,
    badges,
    ingredients[]{
      amountMgPerServing,
      ingredient->{ name }
    }
  }`;

  try {
    const products = await sanity.fetch(query);
    return products || [];
  } catch (error) {
    console.error("Failed to fetch vitamin C products:", error);
    return [];
  }
}

// 評価軸の定義
const EVALUATION_AXES = [
  {
    key: "price",
    label: "価格",
    icon: DollarSign,
    emoji: "💰",
    description: "複数ECサイトでの最安価格",
    color: "text-[#34C759]",
    bgColor: "bg-[#34C759]/10",
  },
  {
    key: "content",
    label: "成分量",
    icon: FlaskConical,
    emoji: "📊",
    description: "1日あたりのビタミンC含有量",
    color: "text-[#007AFF]",
    bgColor: "bg-[#007AFF]/10",
  },
  {
    key: "costPerformance",
    label: "コスパ",
    icon: TrendingUp,
    emoji: "💡",
    description: "mg単価（¥/mg）で評価",
    color: "text-[#FF9500]",
    bgColor: "bg-[#FF9500]/10",
  },
  {
    key: "evidence",
    label: "エビデンス",
    icon: Award,
    emoji: "🔬",
    description: "科学的根拠のレベル",
    color: "text-[#AF52DE]",
    bgColor: "bg-[#AF52DE]/10",
  },
  {
    key: "safety",
    label: "安全性",
    icon: Shield,
    emoji: "🛡️",
    description: "添加物・副作用リスク",
    color: "text-[#FF3B30]",
    bgColor: "bg-[#FF3B30]/10",
  },
];

// FAQ
const FAQS = [
  {
    question: "ビタミンCサプリは1日どのくらい摂取すればいいですか？",
    answer:
      "厚生労働省の推奨量は成人で1日100mgですが、ストレスが多い方や喫煙者は500〜1000mg程度の摂取が推奨されることもあります。ただし、2000mg以上の過剰摂取は下痢などの副作用リスクがあるため注意が必要です。",
  },
  {
    question: "天然ビタミンCと合成ビタミンCの違いは？",
    answer:
      "化学構造は同じなので、体内での作用に違いはありません。ただし、天然由来の製品にはフラボノイドなどの共存成分が含まれていることがあり、相乗効果が期待できる場合があります。",
  },
  {
    question: "ビタミンCはいつ飲むのが効果的？",
    answer:
      "水溶性ビタミンなので食後に分けて摂取するのが効果的です。一度に大量摂取しても吸収されきれず排泄されてしまうため、朝・昼・晩に分けて摂取することをおすすめします。",
  },
  {
    question: "ビタミンCと一緒に摂ると良い成分は？",
    answer:
      "鉄分（吸収促進）、ビタミンE（抗酸化作用の相乗効果）、コラーゲン（合成サポート）との併用が効果的です。特に植物性の鉄分を摂取している方はビタミンCとの併用で吸収率が大幅に向上します。",
  },
];

export default async function VitaminCComparisonPage() {
  const products = await getVitaminCProducts();

  // コスト計算を追加
  const productsWithCost = products
    .filter(
      (p) =>
        p.priceJPY > 0 && p.servingsPerContainer > 0 && p.servingsPerDay > 0,
    )
    .map((product) => {
      const effectiveCostPerDay = calculateEffectiveCostPerDay({
        priceJPY: product.priceJPY,
        servingsPerContainer: product.servingsPerContainer,
        servingsPerDay: product.servingsPerDay,
      });

      // ビタミンC成分量を取得
      const vitaminCIngredient = product.ingredients?.find((i) =>
        i.ingredient?.name?.includes("ビタミンC"),
      );
      const mgPerServing = vitaminCIngredient?.amountMgPerServing || 0;
      const pricePerMg =
        mgPerServing > 0
          ? product.priceJPY / (mgPerServing * product.servingsPerContainer)
          : 0;

      return {
        ...product,
        effectiveCostPerDay,
        mgPerServing,
        pricePerMg,
      };
    })
    .sort((a, b) => a.effectiveCostPerDay - b.effectiveCostPerDay);

  // トップ3とそれ以外に分類
  const top3Products = productsWithCost.slice(0, 3);
  const otherProducts = productsWithCost.slice(3);

  return (
    <article
      className="min-h-screen"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      {/* パンくずリスト */}
      <div
        className={`sticky top-0 z-10 border-b ${liquidGlassClasses.light}`}
        style={{ borderColor: appleWebColors.borderSubtle }}
      >
        <div className="mx-auto px-4 sm:px-6 py-3 max-w-4xl">
          <nav className="flex items-center gap-2 text-[13px]">
            <Link
              href="/"
              className="hover:opacity-70 transition-opacity"
              style={{ color: systemColors.blue }}
            >
              ホーム
            </Link>
            <span style={{ color: appleWebColors.textSecondary }}>/</span>
            <Link
              href="/articles"
              className="hover:opacity-70 transition-opacity"
              style={{ color: systemColors.blue }}
            >
              記事一覧
            </Link>
            <span style={{ color: appleWebColors.textSecondary }}>/</span>
            <span style={{ color: appleWebColors.textSecondary }}>
              ビタミンC比較
            </span>
          </nav>
        </div>
      </div>

      {/* ヘッダー */}
      <header className="pt-8 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="px-3 py-1 text-[12px] font-medium rounded-full"
              style={{
                backgroundColor: systemColors.blue + "15",
                color: systemColors.blue,
              }}
            >
              比較記事
            </span>
            <span
              className="px-3 py-1 text-[12px] font-medium rounded-full"
              style={{
                backgroundColor: systemColors.green + "15",
                color: systemColors.green,
              }}
            >
              {products.length}商品を比較
            </span>
          </div>

          <h1
            className="text-[28px] md:text-[36px] font-bold leading-[1.15] tracking-[-0.02em] mb-4"
            style={{ color: appleWebColors.textPrimary }}
          >
            {ARTICLE_DATA.title}
          </h1>

          <p
            className="text-[17px] leading-[1.6] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            {ARTICLE_DATA.description}
          </p>

          <div
            className="flex items-center gap-4 text-[13px]"
            style={{ color: appleWebColors.textSecondary }}
          >
            <time dateTime={ARTICLE_DATA.publishedAt}>
              公開: {ARTICLE_DATA.publishedAt}
            </time>
            <time dateTime={ARTICLE_DATA.updatedAt}>
              更新: {ARTICLE_DATA.updatedAt}
            </time>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        {/* この記事でわかること */}
        <section
          className={`${liquidGlassClasses.light} rounded-[20px] p-6 mb-12 border`}
          style={{ borderColor: systemColors.blue + "30" }}
        >
          <h2
            className="text-[20px] font-bold mb-4"
            style={{ color: appleWebColors.textPrimary }}
          >
            この記事でわかること
          </h2>
          <ul className="space-y-3">
            {[
              "Suptia独自の5軸評価によるビタミンCサプリ比較",
              "mg単価で見た本当のコスパランキング",
              "目的別おすすめ商品（コスパ重視・安全性重視など）",
              "ビタミンCの効果的な摂取方法と注意点",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="shrink-0 mt-0.5"
                  style={{ color: systemColors.blue }}
                />
                <span style={{ color: appleWebColors.textPrimary }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* 5つの評価軸 */}
        <section className="mb-12">
          <h2
            className="text-[24px] font-bold mb-6"
            style={{ color: appleWebColors.textPrimary }}
          >
            Suptiaの5つの評価軸とは
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            Suptiaでは、単純な価格比較ではなく、以下の5つの観点からサプリメントを総合的に評価しています。
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {EVALUATION_AXES.map((axis) => {
              const Icon = axis.icon;
              return (
                <div
                  key={axis.key}
                  className={`${liquidGlassClasses.light} rounded-[16px] p-4 text-center border`}
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <span className="text-2xl mb-2 block">{axis.emoji}</span>
                  <h3
                    className="font-bold text-[15px] mb-1"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    {axis.label}
                  </h3>
                  <p
                    className="text-[11px] leading-[1.4]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    {axis.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* コスパTOP3 */}
        <section className="mb-12">
          <h2
            className="text-[24px] font-bold mb-2"
            style={{ color: appleWebColors.textPrimary }}
          >
            コスパTOP3｜ビタミンCサプリ
          </h2>
          <p
            className="text-[15px] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            1日あたりのコストで比較した、最もお得なビタミンCサプリメントです。
          </p>

          <div className="space-y-4">
            {top3Products.map((product, index) => (
              <Link
                key={product._id}
                href={`/products/${product.slug.current}`}
                className={`${liquidGlassClasses.light} rounded-[20px] p-5 flex gap-4 border transition-all hover:shadow-lg hover:-translate-y-0.5`}
                style={{ borderColor: appleWebColors.borderSubtle }}
              >
                {/* 順位バッジ */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-white"
                  style={{
                    background:
                      index === 0
                        ? "linear-gradient(135deg, #FFD700, #FFA500)"
                        : index === 1
                          ? "linear-gradient(135deg, #C0C0C0, #A0A0A0)"
                          : "linear-gradient(135deg, #CD7F32, #8B4513)",
                  }}
                >
                  {index + 1}
                </div>

                {/* 商品画像 */}
                {product.externalImageUrl && (
                  <div className="w-20 h-20 relative shrink-0 bg-white rounded-[12px] overflow-hidden">
                    <Image
                      src={product.externalImageUrl}
                      alt={product.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                )}

                {/* 商品情報 */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-bold text-[15px] mb-1 line-clamp-2"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    {product.name}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
                    <span style={{ color: appleWebColors.textSecondary }}>
                      価格:{" "}
                      <span
                        className="font-bold"
                        style={{ color: systemColors.blue }}
                      >
                        ¥{product.priceJPY.toLocaleString()}
                      </span>
                    </span>
                    <span style={{ color: appleWebColors.textSecondary }}>
                      1日:{" "}
                      <span
                        className="font-bold"
                        style={{ color: systemColors.green }}
                      >
                        ¥{product.effectiveCostPerDay.toFixed(1)}
                      </span>
                    </span>
                    {product.mgPerServing > 0 && (
                      <span style={{ color: appleWebColors.textSecondary }}>
                        含有量:{" "}
                        <span className="font-bold">
                          {product.mgPerServing}mg
                        </span>
                      </span>
                    )}
                  </div>
                  {product.tierRatings?.overallRank && (
                    <span
                      className="inline-block mt-2 px-2 py-0.5 text-[11px] font-bold rounded"
                      style={{
                        backgroundColor:
                          product.tierRatings.overallRank === "S+"
                            ? "#FFD700"
                            : product.tierRatings.overallRank === "S"
                              ? "#AF52DE"
                              : product.tierRatings.overallRank === "A"
                                ? "#007AFF"
                                : "#34C759",
                        color: "white",
                      }}
                    >
                      {product.tierRatings.overallRank}ランク
                    </span>
                  )}
                </div>

                <ArrowRight
                  size={20}
                  className="shrink-0 self-center"
                  style={{ color: appleWebColors.textSecondary }}
                />
              </Link>
            ))}
          </div>

          {/* 計算ツールへのリンク */}
          <div
            className={`${liquidGlassClasses.light} rounded-[16px] p-4 mt-6 flex items-center gap-4 border`}
            style={{ borderColor: systemColors.blue + "30" }}
          >
            <div
              className="w-10 h-10 rounded-[12px] flex items-center justify-center"
              style={{ backgroundColor: systemColors.blue }}
            >
              <Calculator size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p
                className="font-bold text-[15px]"
                style={{ color: appleWebColors.textPrimary }}
              >
                自分でコスパを計算してみる
              </p>
              <p
                className="text-[13px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                お手持ちのサプリメントのmg単価を計算できます
              </p>
            </div>
            <Link
              href="/tools/mg-calculator"
              className="px-4 py-2 rounded-[10px] text-[13px] font-medium text-white"
              style={{ backgroundColor: systemColors.blue }}
            >
              計算ツールへ
            </Link>
          </div>
        </section>

        {/* その他の商品 */}
        {otherProducts.length > 0 && (
          <section className="mb-12">
            <h2
              className="text-[24px] font-bold mb-6"
              style={{ color: appleWebColors.textPrimary }}
            >
              その他のビタミンCサプリ比較
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {otherProducts.slice(0, 6).map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug.current}`}
                  className={`${liquidGlassClasses.light} rounded-[16px] p-4 border transition-all hover:shadow-md`}
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <div className="flex gap-3">
                    {product.externalImageUrl && (
                      <div className="w-16 h-16 relative shrink-0 bg-white rounded-[10px] overflow-hidden">
                        <Image
                          src={product.externalImageUrl}
                          alt={product.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-bold text-[14px] mb-1 line-clamp-2"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {product.name}
                      </h3>
                      <p
                        className="text-[13px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        ¥{product.priceJPY.toLocaleString()} / 1日¥
                        {product.effectiveCostPerDay.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-6">
              <Link
                href="/products?ingredient=vitamin-c"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] font-medium text-white"
                style={{ backgroundColor: systemColors.blue }}
              >
                全{products.length}商品を見る
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mb-12">
          <h2
            className="text-[24px] font-bold mb-6"
            style={{ color: appleWebColors.textPrimary }}
          >
            よくある質問
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className={`${liquidGlassClasses.light} rounded-[16px] p-5 border`}
                style={{ borderColor: appleWebColors.borderSubtle }}
              >
                <h3
                  className="font-bold text-[15px] mb-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  Q. {faq.question}
                </h3>
                <p
                  className="text-[14px] leading-[1.7]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  A. {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 関連成分 */}
        <section className="mb-12">
          <h2
            className="text-[24px] font-bold mb-6"
            style={{ color: appleWebColors.textPrimary }}
          >
            ビタミンCと一緒に摂りたい成分
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                name: "鉄分",
                slug: "iron",
                reason: "ビタミンCが鉄の吸収を促進します",
              },
              {
                name: "ビタミンE",
                slug: "vitamin-e",
                reason: "抗酸化作用の相乗効果が期待できます",
              },
              {
                name: "コラーゲン",
                slug: "collagen",
                reason: "ビタミンCがコラーゲン合成をサポートします",
              },
              {
                name: "亜鉛",
                slug: "zinc",
                reason: "免疫機能をダブルでサポートします",
              },
            ].map((ingredient) => (
              <Link
                key={ingredient.slug}
                href={`/ingredients/${ingredient.slug}`}
                className={`${liquidGlassClasses.light} rounded-[16px] p-4 flex items-center gap-4 border transition-all hover:shadow-md`}
                style={{ borderColor: appleWebColors.borderSubtle }}
              >
                <span className="text-2xl">🤝</span>
                <div className="flex-1">
                  <h3
                    className="font-bold text-[15px]"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    {ingredient.name}
                  </h3>
                  <p
                    className="text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    {ingredient.reason}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  style={{ color: appleWebColors.textSecondary }}
                />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="rounded-[20px] p-8 text-center text-white"
          style={{
            background: `linear-gradient(135deg, ${systemColors.blue}, ${systemColors.purple})`,
          }}
        >
          <h2 className="text-[24px] font-bold mb-4">
            ビタミンCサプリをもっと詳しく比較
          </h2>
          <p className="text-[15px] opacity-90 mb-6">
            Suptiaでは、5つの評価軸で{products.length}商品以上を比較できます
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products?ingredient=vitamin-c"
              className="inline-flex items-center justify-center gap-2 bg-white font-bold px-6 py-3 rounded-[12px] transition-colors hover:bg-gray-100"
              style={{ color: systemColors.blue }}
            >
              全商品を見る
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/ingredients/vitamin-c"
              className="inline-flex items-center justify-center gap-2 bg-white/20 font-medium px-6 py-3 rounded-[12px] transition-colors hover:bg-white/30"
            >
              ビタミンC成分ガイド
              <ExternalLink size={16} />
            </Link>
          </div>
        </section>
      </div>

      {/* 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: ARTICLE_DATA.title,
            description: ARTICLE_DATA.description,
            datePublished: ARTICLE_DATA.publishedAt,
            dateModified: ARTICLE_DATA.updatedAt,
            author: {
              "@type": "Organization",
              name: "サプティア編集部",
              url: "https://suptia.com",
            },
            publisher: {
              "@type": "Organization",
              name: "サプティア",
              logo: {
                "@type": "ImageObject",
                url: "https://suptia.com/logo.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://suptia.com/articles/vitamin-c-comparison",
            },
          }),
        }}
      />

      {/* FAQ構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </article>
  );
}
