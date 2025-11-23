"use client";

import { ProductBadges, BadgeSummary } from "@/components/ProductBadges";
import { ImageLightbox } from "@/components/ImageLightbox";
import { TierRatings } from "@/lib/tier-ranking";
import { Activity, Info, FileText, ChevronRight } from "lucide-react";
import {
  SeamlessModal,
  SeamlessModalTrigger,
  SeamlessModalContent,
} from "@/components/SeamlessModal";
import { TierEvaluationDetail } from "@/components/TierEvaluationDetail";
import { TierRankStats } from "@/components/TierRankStats";

interface ProductIdentitySectionProps {
  product: {
    _id: string;
    name: string;
    brandName: string;
    priceJPY: number;
    servingsPerContainer: number;
    externalImageUrl?: string;
    images?: Array<{
      asset: {
        url: string;
      };
      alt?: string;
    }>;
  };
  badges: any[];
  updatedTierRatings?: TierRatings;
  description: string;
  allProductsWithTierRatings?: Array<{
    _id: string;
    tierRatings?: TierRatings;
  }>;
}

export function ProductIdentitySection({
  product,
  badges,
  updatedTierRatings,
  description,
  allProductsWithTierRatings = [],
}: ProductIdentitySectionProps) {
  return (
    <div className="space-y-6">
      {/* Product Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative group hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:border-blue-400/50 transition-all duration-300 hover:-translate-y-1">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
        <div className="p-6">
          <div className="mb-4">
            <div className="flex justify-between items-start">
              <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold tracking-wider rounded uppercase mb-2">
                {product.brandName}
              </span>

              <SeamlessModal layoutId="description-modal">
                <SeamlessModalTrigger>
                  <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors bg-blue-50 px-2 py-1 rounded-full">
                    <Info className="w-3 h-3" />
                    詳細
                  </button>
                </SeamlessModalTrigger>
                <SeamlessModalContent>
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-slate-900">
                            商品詳細
                          </h2>
                          <p className="text-sm text-slate-500">
                            {product.name}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-8 overflow-y-auto custom-scrollbar leading-relaxed text-slate-600 text-base">
                      <div className="whitespace-pre-wrap">{description}</div>
                    </div>
                  </div>
                </SeamlessModalContent>
              </SeamlessModal>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">
              {product.name}
            </h1>
          </div>

          <div className="flex justify-center mb-6 relative">
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full" />
            {product.externalImageUrl ||
            (product.images && product.images.length > 0) ? (
              <ImageLightbox
                src={product.externalImageUrl || product.images![0].asset.url}
                alt={product.images?.[0]?.alt || product.name}
                width={300}
                height={300}
              />
            ) : (
              <div className="w-full aspect-square bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                <span className="text-4xl opacity-50">📦</span>
              </div>
            )}
          </div>

          {/* Product Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="text-sm sm:text-lg text-slate-500 font-medium mb-1 sm:mb-2 flex items-center gap-2">
                  {product.brandName}
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] sm:text-xs rounded-full">
                    国内正規品
                  </span>
                </div>
                <h1 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight">
                  {product.name}
                </h1>
              </div>

              {/* Tier Rank Badge (Mobile Optimized) */}
              {updatedTierRatings?.overallRank && (
                <div className="flex flex-col items-center bg-white rounded-xl sm:rounded-2xl p-2 sm:p-4 border border-slate-200 shadow-sm">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-1">
                    Tier Rank
                  </span>
                  <div
                    className={`text-4xl sm:text-6xl font-black leading-none ${
                      updatedTierRatings.overallRank === "S+"
                        ? "text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-pink-600"
                        : updatedTierRatings.overallRank === "S"
                          ? "text-purple-600"
                          : updatedTierRatings.overallRank === "A"
                            ? "text-blue-600"
                            : "text-slate-700"
                    }`}
                  >
                    {updatedTierRatings.overallRank}
                  </div>
                </div>
              )}
            </div>

            {/* Badges Grid */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
              {badges.map((badge, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold border ${
                    badge.type === "gold"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : badge.type === "silver"
                        ? "bg-slate-50 text-slate-700 border-slate-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
                >
                  {badge.icon && (
                    <span className="text-base sm:text-lg">{badge.icon}</span>
                  )}
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
          {/* Key Stats Row */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-xs text-slate-500 mb-1">PRICE</div>
              <div className="text-lg font-bold text-slate-900">
                ¥{product.priceJPY.toLocaleString()}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-xs text-slate-500 mb-1">SERVINGS</div>
              <div className="text-lg font-bold text-slate-900">
                {product.servingsPerContainer}回分
              </div>
            </div>
          </div>

          {/* Mobile-friendly Description Trigger */}
          <SeamlessModal
            layoutId="description-modal-mobile"
            className="w-full mt-4 block"
          >
            <SeamlessModalTrigger className="w-full">
              <button className="w-full py-2 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 group-hover:border-blue-200">
                <FileText className="w-4 h-4" />
                商品説明を見る
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </SeamlessModalTrigger>
            <SeamlessModalContent>
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        商品詳細
                      </h2>
                      <p className="text-sm text-slate-500">{product.name}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar leading-relaxed text-slate-600">
                  <div className="whitespace-pre-wrap">{description}</div>
                </div>
              </div>
            </SeamlessModalContent>
          </SeamlessModal>
        </div>
      </div>

      {/* Tier Analysis Card (Premium Glass Design) */}
      {updatedTierRatings && (
        <SeamlessModal layoutId="overall-evaluation-modal">
          <SeamlessModalTrigger className="w-full text-left">
            <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-xl group hover:shadow-[0_0_50px_rgba(168,85,247,0.4)] transition-all duration-500 hover:-translate-y-1 cursor-pointer">
              {/* Background Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/40 to-blue-100/40 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-100/40 to-orange-100/40 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

              <div className="relative z-10 p-8">
                <div className="flex flex-col items-center justify-center text-center">
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-8 h-px bg-slate-300"></span>
                    Overall Evaluation
                    <span className="w-8 h-px bg-slate-300"></span>
                  </h2>

                  {/* Main Rank Display */}
                  <div className="relative mb-8 flex flex-col items-center">
                    <div className="text-[8rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-600 via-fuchsia-500 to-indigo-600 drop-shadow-2xl filter">
                      {updatedTierRatings.overallRank || "D"}
                    </div>
                    <div className="absolute -inset-4 bg-purple-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    {/* View Details Button - Always Visible */}
                    <div className="mt-2 z-20">
                      <span className="text-xs font-bold text-purple-500 bg-purple-50 px-4 py-1.5 rounded-full border border-purple-100 shadow-sm flex items-center gap-1 group-hover:bg-purple-100 transition-colors">
                        詳細を見る <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Sub Metrics Grid */}
                  <div className="w-full grid grid-cols-5 gap-2 sm:gap-4">
                    {[
                      {
                        label: "価格",
                        rank: updatedTierRatings.priceRank,
                        color: "text-blue-600",
                        bg: "bg-blue-50",
                      },
                      {
                        label: "コスパ",
                        rank: updatedTierRatings.costEffectivenessRank,
                        color: "text-purple-600",
                        bg: "bg-purple-50",
                      },
                      {
                        label: "含有量",
                        rank: updatedTierRatings.contentRank,
                        color: "text-emerald-600",
                        bg: "bg-emerald-50",
                      },
                      {
                        label: "根拠",
                        rank: updatedTierRatings.evidenceRank,
                        color: "text-indigo-600",
                        bg: "bg-indigo-50",
                      },
                      {
                        label: "安全性",
                        rank: updatedTierRatings.safetyRank,
                        color: "text-teal-600",
                        bg: "bg-teal-50",
                      },
                    ].map((metric, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center gap-1 group/metric"
                      >
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${metric.bg} flex items-center justify-center mb-1 transition-transform group-hover/metric:scale-110`}
                        >
                          <span
                            className={`text-lg sm:text-xl font-black ${metric.color}`}
                          >
                            {metric.rank}
                          </span>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400">
                          {metric.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SeamlessModalTrigger>
          <SeamlessModalContent>
            <div className="p-6 space-y-8">
              {/* Individual Product Evaluation */}
              <TierEvaluationDetail tierRatings={updatedTierRatings} />

              {/* Market Distribution */}
              {allProductsWithTierRatings.length > 0 && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900">
                      市場全体での位置づけ
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      同カテゴリ全商品のランク分布
                    </p>
                  </div>
                  <TierRankStats products={allProductsWithTierRatings} />
                </div>
              )}
            </div>
          </SeamlessModalContent>
        </SeamlessModal>
      )}
    </div>
  );
}
