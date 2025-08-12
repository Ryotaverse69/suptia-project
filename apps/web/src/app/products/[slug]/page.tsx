import { sanity } from "@/lib/sanity.client";
import { calculateEffectiveCostPerDay, formatCostJPY } from "@/lib/cost";
import { checkCompliance, generateSampleDescription } from "@/lib/compliance";
import { WarningBanner } from "@/components/WarningBanner";
import { notFound } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  brand: string;
  priceJPY: number;
  servingsPerContainer: number;
  servingsPerDay: number;
  description?: string;
  slug: {
    current: string;
  };
}

async function getProduct(slug: string): Promise<Product | null> {
  const query = `*[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    brand,
    priceJPY,
    servingsPerContainer,
    servingsPerDay,
    description,
    slug
  }`;

  try {
    const product = await sanity.fetch(query, { slug });
    return product || null;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  // Generate sample description if not available
  const description =
    product.description || generateSampleDescription(product.name);

  // Check compliance
  const complianceResult = checkCompliance(description);

  // Calculate costs
  let effectiveCostPerDay = 0;
  let costError = false;

  try {
    effectiveCostPerDay = calculateEffectiveCostPerDay({
      priceJPY: product.priceJPY,
      servingsPerContainer: product.servingsPerContainer,
      servingsPerDay: product.servingsPerDay,
    });
  } catch (error) {
    costError = true;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Compliance Warning Banner */}
      {complianceResult.hasViolations && (
        <WarningBanner violations={complianceResult.violations} />
      )}

      {/* Product Header */}
      <div className="mb-8">
        <nav className="text-sm text-gray-500 mb-4">
          <a href="/" className="hover:text-gray-700">
            ホーム
          </a>
          <span className="mx-2">/</span>
          <span>商品詳細</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>
        <p className="text-lg text-gray-600">{product.brand}</p>
      </div>

      {/* Product Description */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">商品説明</h2>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>

      {/* Price Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">価格情報</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {formatCostJPY(product.priceJPY)}
            </div>
            <div className="text-sm text-gray-600">商品価格</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {product.servingsPerContainer}回分
            </div>
            <div className="text-sm text-gray-600">容量</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {product.servingsPerDay}回/日
            </div>
            <div className="text-sm text-gray-600">1日摂取量</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {costError ? (
                <span className="text-red-500 text-base">計算不可</span>
              ) : (
                formatCostJPY(effectiveCostPerDay)
              )}
            </div>
            <div className="text-sm text-gray-600">実効コスト/日</div>
          </div>
        </div>
      </div>

      {/* Normalized Price Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">正規化価格テーブル</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  項目
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">
                  値
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 text-gray-600">実効コスト/日</td>
                <td className="py-3 px-4 text-right font-semibold">
                  {costError ? (
                    <span className="text-red-500">計算不可</span>
                  ) : (
                    <span className="text-green-600">
                      {formatCostJPY(effectiveCostPerDay)}
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600">継続日数</td>
                <td className="py-3 px-4 text-right font-semibold">
                  {Math.floor(
                    product.servingsPerContainer / product.servingsPerDay,
                  )}
                  日
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600">1回あたりコスト</td>
                <td className="py-3 px-4 text-right font-semibold">
                  {formatCostJPY(
                    product.priceJPY / product.servingsPerContainer,
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center">
        <a
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          商品一覧に戻る
        </a>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: "商品が見つかりません",
    };
  }

  return {
    title: `${product.name} - ${product.brand} | サプティア`,
    description: `${product.name}の詳細情報。価格: ${product.priceJPY}円、実効コスト/日を含む詳細な価格分析をご覧いただけます。`,
  };
}
