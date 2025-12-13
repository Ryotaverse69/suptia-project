"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  tierColors,
  typography,
  borderRadius,
  spacing,
  liquidGlassClasses,
} from "@/lib/design-system";

interface Product {
  _id: string;
  name: string;
  priceJPY: number;
  servingsPerContainer: number;
  servingsPerDay: number;
  externalImageUrl?: string;
  slug: {
    current: string;
  };
  tierRatings?: {
    overall?: string;
    price?: string;
    ingredient?: string;
    costPerformance?: string;
    evidence?: string;
    safety?: string;
  };
  ingredients?: Array<{
    amountMgPerServing: number;
    ingredient?: {
      name: string;
      nameEn: string;
    };
  }>;
}

export default function ComparePage() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // URLパラメータから商品IDを取得
    const params = new URLSearchParams(window.location.search);
    const productIds = params.get("products")?.split(",") || [];

    // 実際の実装ではここでAPIから商品データを取得
    // 今はダミーデータを使用
    if (productIds.length > 0) {
      // fetchProducts(productIds);
    }
  }, []);

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  const handleAddProduct = () => {
    // 商品選択モーダルを開く処理
    console.log("Add product");
  };

  const calculatePricePerDay = (product: Product) => {
    if (!product.servingsPerContainer || !product.servingsPerDay) return 0;
    const totalDays = product.servingsPerContainer / product.servingsPerDay;
    return Math.round(product.priceJPY / totalDays);
  };

  const getComparisonIcon = (value: number, otherValues: number[]) => {
    const avg = otherValues.reduce((a, b) => a + b, 0) / otherValues.length;
    if (value < avg * 0.9) {
      return (
        <TrendingDown
          className="w-4 h-4"
          style={{ color: systemColors.green }}
        />
      );
    } else if (value > avg * 1.1) {
      return (
        <TrendingUp className="w-4 h-4" style={{ color: systemColors.red }} />
      );
    }
    return (
      <Minus
        className="w-4 h-4"
        style={{ color: appleWebColors.textSecondary }}
      />
    );
  };

  const getTierBadgeStyle = (tier?: string) => {
    if (!tier) return null;
    const tierKey = tier as keyof typeof tierColors;
    const colors = tierColors[tierKey] || tierColors.D;
    return {
      background: colors.bg,
      color: colors.text,
      borderColor: colors.border,
    };
  };

  if (!isClient) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
        minHeight: "100vh",
      }}
    >
      {/* ヘッダー */}
      <div
        className={liquidGlassClasses.light}
        style={{
          borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          className="container mx-auto px-4 sm:px-6"
          style={{
            maxWidth: "1200px",
            paddingTop: `${spacing.screenEdge}px`,
            paddingBottom: `${spacing.screenEdge}px`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/products"
                className="flex items-center gap-2 transition-opacity hover:opacity-60"
                style={{
                  color: systemColors.blue,
                  fontSize: "17px",
                  fontWeight: 400,
                  lineHeight: "22px",
                  letterSpacing: "-0.43px",
                }}
              >
                <ChevronLeft className="w-5 h-5" />
                <span>商品一覧</span>
              </Link>
              <div
                style={{
                  width: "1px",
                  height: "24px",
                  backgroundColor: appleWebColors.separator,
                }}
              />
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  lineHeight: "34px",
                  letterSpacing: "0.36px",
                  color: appleWebColors.textPrimary,
                }}
              >
                商品比較
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div
        className="container mx-auto px-4 sm:px-6"
        style={{
          maxWidth: "1200px",
          paddingTop: `${spacing.sectionGap}px`,
          paddingBottom: `${spacing.sectionGap}px`,
        }}
      >
        {selectedProducts.length === 0 ? (
          // 空の状態
          <div
            className={liquidGlassClasses.light}
            style={{
              borderRadius: `${borderRadius.large}px`,
              border: `1px solid ${appleWebColors.borderSubtle}`,
              padding: "64px 32px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                margin: "0 auto 24px",
                backgroundColor: appleWebColors.sectionBackground,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plus
                className="w-10 h-10"
                style={{ color: appleWebColors.textSecondary }}
              />
            </div>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: 700,
                lineHeight: "34px",
                letterSpacing: "0.36px",
                color: appleWebColors.textPrimary,
                marginBottom: "12px",
              }}
            >
              比較する商品を選択
            </h2>
            <p
              style={{
                fontSize: "17px",
                fontWeight: 400,
                lineHeight: "22px",
                letterSpacing: "-0.43px",
                color: appleWebColors.textSecondary,
                marginBottom: "32px",
                maxWidth: "500px",
                margin: "0 auto 32px",
              }}
            >
              サプリメントの成分量、価格、コスパを正確に比較できます。
              <br />
              商品一覧から最大4つまで選択してください。
            </p>
            <Link
              href="/products"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: systemColors.blue,
                color: "#FFFFFF",
                fontSize: "17px",
                fontWeight: 600,
                lineHeight: "22px",
                letterSpacing: "-0.41px",
                padding: "14px 28px",
                borderRadius: `${borderRadius.small}px`,
                textDecoration: "none",
                transition: "all 0.2s ease",
                minHeight: "44px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  appleWebColors.blueHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = systemColors.blue;
              }}
            >
              商品を選ぶ
            </Link>
          </div>
        ) : (
          // 比較テーブル
          <div>
            {/* 商品カード */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(selectedProducts.length, 4)}, 1fr)`,
                gap: `${spacing.groupGap}px`,
                marginBottom: `${spacing.sectionGap}px`,
              }}
            >
              {selectedProducts.map((product) => (
                <div
                  key={product._id}
                  className={`transition-all duration-300 hover:-translate-y-1 ${liquidGlassClasses.light}`}
                  style={{
                    borderRadius: `${borderRadius.medium}px`,
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* 削除ボタン */}
                  <button
                    onClick={() => handleRemoveProduct(product._id)}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      backdropFilter: "blur(10px)",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      zIndex: 2,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(0, 0, 0, 0.7)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(0, 0, 0, 0.5)";
                    }}
                  >
                    <X className="w-4 h-4" style={{ color: "#FFFFFF" }} />
                  </button>

                  {/* 商品画像 */}
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      backgroundColor: appleWebColors.sectionBackground,
                      position: "relative",
                    }}
                  >
                    {product.externalImageUrl && (
                      <Image
                        src={product.externalImageUrl}
                        alt={product.name}
                        fill
                        style={{ objectFit: "contain", padding: "16px" }}
                      />
                    )}
                  </div>

                  {/* 商品情報 */}
                  <div style={{ padding: "16px" }}>
                    <h3
                      style={{
                        fontSize: "17px",
                        fontWeight: 600,
                        lineHeight: "22px",
                        letterSpacing: "-0.41px",
                        color: appleWebColors.textPrimary,
                        marginBottom: "8px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product.name}
                    </h3>

                    {/* 総合評価バッジ */}
                    {product.tierRatings?.overall && (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "4px 12px",
                          borderRadius: `${borderRadius.small}px`,
                          fontSize: "13px",
                          fontWeight: 600,
                          lineHeight: "18px",
                          letterSpacing: "-0.08px",
                          marginBottom: "12px",
                          ...getTierBadgeStyle(product.tierRatings.overall),
                        }}
                      >
                        {product.tierRatings.overall}
                      </div>
                    )}

                    {/* 価格 */}
                    <div style={{ marginTop: "12px" }}>
                      <div
                        style={{
                          fontSize: "28px",
                          fontWeight: 700,
                          lineHeight: "34px",
                          letterSpacing: "0.36px",
                          color: appleWebColors.textPrimary,
                        }}
                      >
                        ¥{product.priceJPY.toLocaleString()}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 400,
                          lineHeight: "18px",
                          letterSpacing: "-0.08px",
                          color: appleWebColors.textSecondary,
                          marginTop: "4px",
                        }}
                      >
                        1日あたり ¥{calculatePricePerDay(product)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* 追加ボタン */}
              {selectedProducts.length < 4 && (
                <button
                  onClick={handleAddProduct}
                  className={liquidGlassClasses.light}
                  style={{
                    borderRadius: `${borderRadius.medium}px`,
                    border: `2px dashed ${appleWebColors.separator}`,
                    minHeight: "400px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = systemColors.blue;
                    e.currentTarget.style.backgroundColor =
                      "rgba(0, 122, 255, 0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      appleWebColors.separator;
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: appleWebColors.sectionBackground,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <Plus
                      className="w-8 h-8"
                      style={{ color: systemColors.blue }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "17px",
                      fontWeight: 600,
                      lineHeight: "22px",
                      letterSpacing: "-0.41px",
                      color: systemColors.blue,
                    }}
                  >
                    商品を追加
                  </span>
                </button>
              )}
            </div>

            {/* 比較詳細 */}
            {selectedProducts.length >= 2 && (
              <div
                className={liquidGlassClasses.light}
                style={{
                  borderRadius: `${borderRadius.large}px`,
                  border: `1px solid ${appleWebColors.borderSubtle}`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "24px",
                    borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
                  }}
                >
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: 700,
                      lineHeight: "28px",
                      letterSpacing: "0.35px",
                      color: appleWebColors.textPrimary,
                    }}
                  >
                    詳細比較
                  </h2>
                </div>

                {/* 比較テーブル */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      {/* 価格 */}
                      <ComparisonRow
                        label="価格"
                        values={selectedProducts.map(
                          (p) => `¥${p.priceJPY.toLocaleString()}`,
                        )}
                        icons={selectedProducts.map((p, i) =>
                          getComparisonIcon(
                            p.priceJPY,
                            selectedProducts.map((prod) => prod.priceJPY),
                          ),
                        )}
                      />

                      {/* 1日あたり価格 */}
                      <ComparisonRow
                        label="1日あたり価格"
                        values={selectedProducts.map(
                          (p) => `¥${calculatePricePerDay(p)}`,
                        )}
                        icons={selectedProducts.map((p, i) =>
                          getComparisonIcon(
                            calculatePricePerDay(p),
                            selectedProducts.map((prod) =>
                              calculatePricePerDay(prod),
                            ),
                          ),
                        )}
                      />

                      {/* 内容量 */}
                      <ComparisonRow
                        label="内容量"
                        values={selectedProducts.map(
                          (p) => `${p.servingsPerContainer}回分`,
                        )}
                      />

                      {/* 1日の摂取回数 */}
                      <ComparisonRow
                        label="1日の摂取回数"
                        values={selectedProducts.map(
                          (p) => `${p.servingsPerDay}回`,
                        )}
                      />

                      {/* 評価 */}
                      {selectedProducts[0].tierRatings && (
                        <>
                          <ComparisonRow
                            label="価格評価"
                            values={selectedProducts.map(
                              (p) => p.tierRatings?.price || "-",
                            )}
                            isTier
                          />
                          <ComparisonRow
                            label="成分量評価"
                            values={selectedProducts.map(
                              (p) => p.tierRatings?.ingredient || "-",
                            )}
                            isTier
                          />
                          <ComparisonRow
                            label="コスパ評価"
                            values={selectedProducts.map(
                              (p) => p.tierRatings?.costPerformance || "-",
                            )}
                            isTier
                          />
                          <ComparisonRow
                            label="エビデンス"
                            values={selectedProducts.map(
                              (p) => p.tierRatings?.evidence || "-",
                            )}
                            isTier
                          />
                          <ComparisonRow
                            label="安全性"
                            values={selectedProducts.map(
                              (p) => p.tierRatings?.safety || "-",
                            )}
                            isTier
                          />
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 比較行コンポーネント
function ComparisonRow({
  label,
  values,
  icons,
  isTier = false,
}: {
  label: string;
  values: string[];
  icons?: React.ReactNode[];
  isTier?: boolean;
}) {
  const getTierBadgeStyle = (tier: string) => {
    if (!tier || tier === "-") return null;
    const tierKey = tier as keyof typeof tierColors;
    const colors = tierColors[tierKey] || tierColors.D;
    return {
      background: colors.bg,
      color: colors.text,
      borderColor: colors.border,
    };
  };

  return (
    <tr
      style={{
        borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
      }}
    >
      <td
        style={{
          padding: "16px 24px",
          fontSize: "15px",
          fontWeight: 600,
          lineHeight: "20px",
          letterSpacing: "-0.24px",
          color: appleWebColors.textPrimary,
          backgroundColor: appleWebColors.sectionBackground,
          minWidth: "150px",
        }}
      >
        {label}
      </td>
      {values.map((value, index) => (
        <td
          key={index}
          style={{
            padding: "16px 24px",
            fontSize: "15px",
            fontWeight: 400,
            lineHeight: "20px",
            letterSpacing: "-0.24px",
            color: appleWebColors.textPrimary,
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {icons && icons[index]}
            {isTier && value !== "-" ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 12px",
                  borderRadius: `${borderRadius.small}px`,
                  fontSize: "13px",
                  fontWeight: 600,
                  lineHeight: "18px",
                  letterSpacing: "-0.08px",
                  ...getTierBadgeStyle(value),
                }}
              >
                {value}
              </span>
            ) : (
              <span>{value}</span>
            )}
          </div>
        </td>
      ))}
    </tr>
  );
}
