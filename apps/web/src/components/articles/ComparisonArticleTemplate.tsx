/**
 * 比較記事テンプレートコンポーネント
 * SEO記事用の共通レイアウト
 */

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  Shield,
  TrendingUp,
  DollarSign,
  FlaskConical,
} from "lucide-react";

// 5つの評価軸の定義
const EVALUATION_AXES = [
  {
    key: "price",
    label: "価格",
    icon: DollarSign,
    emoji: "💰",
    description: "複数ECサイトでの価格比較",
  },
  {
    key: "content",
    label: "成分量",
    icon: FlaskConical,
    emoji: "📊",
    description: "1日あたり有効成分量（mg正規化）",
  },
  {
    key: "costPerformance",
    label: "コスパ",
    icon: TrendingUp,
    emoji: "💡",
    description: "成分量あたりの価格（¥/mg）",
  },
  {
    key: "evidence",
    label: "エビデンス",
    icon: Award,
    emoji: "🔬",
    description: "S/A/B/C/Dの5段階評価",
  },
  {
    key: "safety",
    label: "安全性",
    icon: Shield,
    emoji: "🛡️",
    description: "0-100点、副作用・相互作用警告",
  },
];

// 称号の定義
const BADGES = {
  fiveCrown: {
    label: "Five Crown",
    emoji: "🏆",
    description: "5つすべてがSランク",
    color: "bg-gradient-to-r from-yellow-400 to-amber-500 text-white",
  },
  highEfficiency: {
    label: "高効率モデル",
    emoji: "💡",
    description: "コスパ重視",
    color: "bg-green-100 text-green-800 border border-green-200",
  },
  highSafety: {
    label: "高安全性",
    emoji: "🛡️",
    description: "安心重視",
    color: "bg-blue-100 text-blue-800 border border-blue-200",
  },
  highEvidence: {
    label: "高エビデンス",
    emoji: "🔬",
    description: "科学的根拠重視",
    color: "bg-purple-100 text-purple-800 border border-purple-200",
  },
};

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  brand?: string;
  imageUrl?: string;
  price?: number;
  pricePerMg?: number;
  safetyScore?: number;
  evidenceLevel?: "S" | "A" | "B" | "C" | "D";
  tierRank?: "S+" | "S" | "A" | "B" | "C" | "D";
  badges?: string[];
}

interface FAQ {
  question: string;
  answer: string;
}

interface ComparisonArticleProps {
  // 記事メタ情報
  title: string;
  description: string;
  ingredientName: string;
  ingredientSlug: string;
  publishedAt: string;
  updatedAt?: string;
  // 商品データ
  products: Product[];
  // FAQ
  faqs?: FAQ[];
  // 関連成分
  relatedIngredients?: Array<{
    name: string;
    slug: string;
    reason?: string;
  }>;
}

export function ComparisonArticleTemplate({
  title,
  description,
  ingredientName,
  ingredientSlug,
  publishedAt,
  updatedAt,
  products,
  faqs,
  relatedIngredients,
}: ComparisonArticleProps) {
  // 称号別に商品を分類
  const fiveCrownProducts = products.filter((p) =>
    p.badges?.includes("fiveCrown"),
  );
  const highEfficiencyProducts = products
    .filter((p) => p.badges?.includes("highEfficiency"))
    .sort((a, b) => (a.pricePerMg || 0) - (b.pricePerMg || 0));
  const highSafetyProducts = products
    .filter((p) => p.badges?.includes("highSafety"))
    .sort((a, b) => (b.safetyScore || 0) - (a.safetyScore || 0));
  const highEvidenceProducts = products.filter((p) =>
    p.badges?.includes("highEvidence"),
  );

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* ヘッダー */}
      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/articles" className="hover:text-primary">
            記事一覧
          </Link>
          <span>/</span>
          <Link
            href={`/ingredients/${ingredientSlug}`}
            className="hover:text-primary"
          >
            {ingredientName}
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {title}
        </h1>

        <p className="text-lg text-gray-600 mb-6">{description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <time dateTime={publishedAt}>
            公開: {new Date(publishedAt).toLocaleDateString("ja-JP")}
          </time>
          {updatedAt && (
            <time dateTime={updatedAt}>
              更新: {new Date(updatedAt).toLocaleDateString("ja-JP")}
            </time>
          )}
        </div>
      </header>

      {/* この記事でわかること */}
      <section className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          この記事でわかること
        </h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">✓</span>
            <span>Suptia独自の5軸評価による{ingredientName}サプリ比較</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">✓</span>
            <span>mg単価で見た本当のコスパランキング</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">✓</span>
            <span>各商品の成分量・安全性スコアの違い</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">✓</span>
            <span>称号バッジで一目でわかる商品特性</span>
          </li>
        </ul>
      </section>

      {/* Suptiaの5つの評価軸とは */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Suptiaの5つの評価軸とは
        </h2>
        <p className="text-gray-600 mb-6">
          Suptiaでは、単純な価格比較ではなく、以下の5つの観点から
          サプリメントを総合的に評価しています。
        </p>
        <div className="grid md:grid-cols-5 gap-4">
          {EVALUATION_AXES.map((axis) => {
            const Icon = axis.icon;
            return (
              <div
                key={axis.key}
                className="bg-white border border-gray-200 rounded-xl p-4 text-center"
              >
                <span className="text-2xl mb-2 block">{axis.emoji}</span>
                <h3 className="font-bold text-gray-900 mb-1">{axis.label}</h3>
                <p className="text-xs text-gray-500">{axis.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 比較対象商品一覧 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          比較対象商品（{products.length}商品）
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.slice(0, 9).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        {products.length > 9 && (
          <div className="text-center mt-6">
            <Link
              href={`/products?ingredient=${ingredientSlug}`}
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              全{products.length}商品を見る
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      {/* 称号別おすすめ */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          称号別おすすめ
        </h2>

        {/* Five Crown */}
        {fiveCrownProducts.length > 0 && (
          <BadgeSection
            badge={BADGES.fiveCrown}
            products={fiveCrownProducts}
            description="5つの評価軸すべてでSランクを獲得した最高評価商品"
          />
        )}

        {/* 高効率モデル */}
        {highEfficiencyProducts.length > 0 && (
          <BadgeSection
            badge={BADGES.highEfficiency}
            products={highEfficiencyProducts.slice(0, 3)}
            description="mg単価が優秀でコストパフォーマンスに優れた商品"
          />
        )}

        {/* 高安全性 */}
        {highSafetyProducts.length > 0 && (
          <BadgeSection
            badge={BADGES.highSafety}
            products={highSafetyProducts.slice(0, 3)}
            description="安全性スコアが高く、添加物が少ない商品"
          />
        )}

        {/* 高エビデンス */}
        {highEvidenceProducts.length > 0 && (
          <BadgeSection
            badge={BADGES.highEvidence}
            products={highEvidenceProducts.slice(0, 3)}
            description="科学的根拠のレベルが高い成分を含む商品"
          />
        )}
      </section>

      {/* よくある質問 */}
      {faqs && faqs.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            よくある質問
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <h3 className="font-bold text-gray-900 mb-2">
                  Q. {faq.question}
                </h3>
                <p className="text-gray-600">A. {faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 関連成分 */}
      {relatedIngredients && relatedIngredients.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {ingredientName}と一緒に摂りたい成分
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {relatedIngredients.map((ingredient) => (
              <Link
                key={ingredient.slug}
                href={`/ingredients/${ingredient.slug}`}
                className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-primary transition-colors"
              >
                <span className="text-2xl">🤝</span>
                <div>
                  <h3 className="font-bold text-gray-900">{ingredient.name}</h3>
                  {ingredient.reason && (
                    <p className="text-sm text-gray-500">{ingredient.reason}</p>
                  )}
                </div>
                <ArrowRight size={16} className="ml-auto text-gray-400" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          {ingredientName}サプリをもっと詳しく比較
        </h2>
        <p className="mb-6 opacity-90">
          Suptiaでは、5つの評価軸で{products.length}商品以上を比較できます
        </p>
        <Link
          href={`/products?ingredient=${ingredientSlug}`}
          className="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
        >
          全商品を見る
          <ArrowRight size={18} />
        </Link>
      </section>
    </article>
  );
}

// 商品カード
function ProductCard({ product }: { product: Product }) {
  const tierColors: Record<string, string> = {
    "S+": "bg-gradient-to-r from-yellow-400 to-amber-500 text-white",
    S: "bg-purple-100 text-purple-800",
    A: "bg-blue-100 text-blue-800",
    B: "bg-green-100 text-green-800",
    C: "bg-yellow-100 text-yellow-800",
    D: "bg-gray-100 text-gray-800",
  };

  return (
    <Link
      href={`/products/${product.slug.current}`}
      className="bg-white border border-gray-200 rounded-xl p-4 hover:border-primary hover:shadow-md transition-all"
    >
      {/* 画像 */}
      {product.imageUrl && (
        <div className="relative w-full h-32 mb-3 bg-gray-50 rounded-lg overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>
      )}

      {/* Tierバッジ */}
      {product.tierRank && (
        <span
          className={`inline-block px-2 py-0.5 text-xs font-bold rounded mb-2 ${
            tierColors[product.tierRank] || tierColors.D
          }`}
        >
          {product.tierRank}
        </span>
      )}

      {/* 商品名 */}
      <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
        {product.name}
      </h3>
      {product.brand && (
        <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
      )}

      {/* 価格・mg単価 */}
      <div className="flex items-baseline gap-2">
        {product.price && (
          <span className="font-bold text-lg text-gray-900">
            ¥{product.price.toLocaleString()}
          </span>
        )}
        {product.pricePerMg && (
          <span className="text-xs text-gray-500">
            {product.pricePerMg.toFixed(2)}円/mg
          </span>
        )}
      </div>
    </Link>
  );
}

// 称号セクション
function BadgeSection({
  badge,
  products,
  description,
}: {
  badge: (typeof BADGES)[keyof typeof BADGES];
  products: Product[];
  description: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${badge.color}`}
        >
          {badge.emoji} {badge.label}
        </span>
        <span className="text-sm text-gray-500">{description}</span>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
