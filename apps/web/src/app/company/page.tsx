import { Metadata } from "next";
import { Building2, Mail, MapPin, Users } from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  typography,
  glassCardStyles,
  containerClasses,
  sectionPadding,
  liquidGlassClasses,
} from "@/lib/design-system";

export const metadata: Metadata = {
  title: "運営会社について - サプティア",
  description: "サプティアの運営会社情報をご紹介します。",
};

export default function CompanyPage() {
  return (
    <div
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
        minHeight: "100vh",
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          background:
            "linear-gradient(to bottom, rgba(0, 122, 255, 0.03), transparent)",
          borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
        }}
        className="py-16 md:py-20"
      >
        <div className={containerClasses("md")}>
          <h1
            className={typography.largeTitle}
            style={{ color: appleWebColors.textPrimary, marginBottom: "12px" }}
          >
            運営会社について
          </h1>
          <p
            className={typography.body}
            style={{ color: appleWebColors.textSecondary }}
          >
            サプティアの運営会社情報をご紹介します
          </p>
        </div>
      </div>

      <div className={`${containerClasses("md")} ${sectionPadding("md")}`}>
        {/* 会社概要 */}
        <section style={{ marginBottom: "64px" }}>
          <h2
            className={typography.title1}
            style={{ color: appleWebColors.textPrimary, marginBottom: "24px" }}
          >
            会社概要
          </h2>
          <div
            className={liquidGlassClasses.light}
            style={{
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr
                  style={{
                    borderBottom: `1px solid ${appleWebColors.separator}`,
                  }}
                >
                  <td
                    className={typography.headline}
                    style={{
                      backgroundColor: appleWebColors.sectionBackground,
                      color: appleWebColors.textPrimary,
                      padding: "20px 24px",
                      width: "200px",
                      verticalAlign: "top",
                    }}
                  >
                    会社名
                  </td>
                  <td
                    className={typography.body}
                    style={{
                      color: appleWebColors.textPrimary,
                      padding: "20px 24px",
                    }}
                  >
                    [会社名]
                  </td>
                </tr>
                <tr
                  style={{
                    borderBottom: `1px solid ${appleWebColors.separator}`,
                  }}
                >
                  <td
                    className={typography.headline}
                    style={{
                      backgroundColor: appleWebColors.sectionBackground,
                      color: appleWebColors.textPrimary,
                      padding: "20px 24px",
                      verticalAlign: "top",
                    }}
                  >
                    代表者名
                  </td>
                  <td
                    className={typography.body}
                    style={{
                      color: appleWebColors.textPrimary,
                      padding: "20px 24px",
                    }}
                  >
                    [代表者名]
                  </td>
                </tr>
                <tr
                  style={{
                    borderBottom: `1px solid ${appleWebColors.separator}`,
                  }}
                >
                  <td
                    className={typography.headline}
                    style={{
                      backgroundColor: appleWebColors.sectionBackground,
                      color: appleWebColors.textPrimary,
                      padding: "20px 24px",
                      verticalAlign: "top",
                    }}
                  >
                    所在地
                  </td>
                  <td
                    className={typography.body}
                    style={{
                      color: appleWebColors.textPrimary,
                      padding: "20px 24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      <MapPin
                        size={20}
                        style={{
                          color: systemColors.blue,
                          marginTop: "2px",
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div>[郵便番号]</div>
                        <div>[都道府県市区町村]</div>
                        <div>[番地・建物名]</div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr
                  style={{
                    borderBottom: `1px solid ${appleWebColors.separator}`,
                  }}
                >
                  <td
                    className={typography.headline}
                    style={{
                      backgroundColor: appleWebColors.sectionBackground,
                      color: appleWebColors.textPrimary,
                      padding: "20px 24px",
                      verticalAlign: "top",
                    }}
                  >
                    設立
                  </td>
                  <td
                    className={typography.body}
                    style={{
                      color: appleWebColors.textPrimary,
                      padding: "20px 24px",
                    }}
                  >
                    [設立年月日]
                  </td>
                </tr>
                <tr
                  style={{
                    borderBottom: `1px solid ${appleWebColors.separator}`,
                  }}
                >
                  <td
                    className={typography.headline}
                    style={{
                      backgroundColor: appleWebColors.sectionBackground,
                      color: appleWebColors.textPrimary,
                      padding: "20px 24px",
                      verticalAlign: "top",
                    }}
                  >
                    資本金
                  </td>
                  <td
                    className={typography.body}
                    style={{
                      color: appleWebColors.textPrimary,
                      padding: "20px 24px",
                    }}
                  >
                    [資本金]
                  </td>
                </tr>
                <tr
                  style={{
                    borderBottom: `1px solid ${appleWebColors.separator}`,
                  }}
                >
                  <td
                    className={typography.headline}
                    style={{
                      backgroundColor: appleWebColors.sectionBackground,
                      color: appleWebColors.textPrimary,
                      padding: "20px 24px",
                      verticalAlign: "top",
                    }}
                  >
                    事業内容
                  </td>
                  <td
                    className={typography.body}
                    style={{
                      color: appleWebColors.textPrimary,
                      padding: "20px 24px",
                    }}
                  >
                    <ul
                      style={{
                        paddingLeft: "20px",
                        margin: 0,
                        listStyleType: "disc",
                      }}
                    >
                      <li style={{ marginBottom: "8px" }}>
                        サプリメント比較・検索プラットフォームの運営
                      </li>
                      <li style={{ marginBottom: "8px" }}>
                        健康・ウェルネス関連情報の提供
                      </li>
                      <li>Webメディアの企画・運営</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td
                    className={typography.headline}
                    style={{
                      backgroundColor: appleWebColors.sectionBackground,
                      color: appleWebColors.textPrimary,
                      padding: "20px 24px",
                      verticalAlign: "top",
                    }}
                  >
                    お問い合わせ
                  </td>
                  <td
                    className={typography.body}
                    style={{
                      color: appleWebColors.textPrimary,
                      padding: "20px 24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <Mail
                        size={20}
                        style={{ color: systemColors.blue, flexShrink: 0 }}
                      />
                      <a
                        href="/contact"
                        style={{
                          color: systemColors.blue,
                          textDecoration: "none",
                        }}
                        className="hover:underline"
                      >
                        お問い合わせフォーム
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ミッション */}
        <section style={{ marginBottom: "64px" }}>
          <h2
            className={typography.title1}
            style={{ color: appleWebColors.textPrimary, marginBottom: "24px" }}
          >
            私たちのミッション
          </h2>
          <div
            className={liquidGlassClasses.light}
            style={{
              background:
                "linear-gradient(135deg, rgba(0, 122, 255, 0.05) 0%, rgba(52, 199, 89, 0.05) 100%)",
              borderRadius: "20px",
              padding: "32px",
            }}
          >
            <p
              className={typography.title2}
              style={{
                color: appleWebColors.textPrimary,
                marginBottom: "16px",
              }}
            >
              科学的根拠に基づいた情報で、すべての人の健康的な生活をサポートする
            </p>
            <p
              className={typography.body}
              style={{
                color: appleWebColors.textSecondary,
                margin: 0,
              }}
            >
              サプリメント市場には膨大な製品が存在し、消費者は何を選べば良いのか分からない状況にあります。
              私たちは科学的根拠に基づいた中立的な情報を提供することで、一人ひとりが自分に最適なサプリメントを選択できる環境を作ることを目指しています。
            </p>
          </div>
        </section>

        {/* ビジョン */}
        <section style={{ marginBottom: "64px" }}>
          <h2
            className={typography.title1}
            style={{ color: appleWebColors.textPrimary, marginBottom: "24px" }}
          >
            ビジョン
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            <div
              className={`hover:-translate-y-1 transition-all ${liquidGlassClasses.light}`}
              style={{
                borderRadius: "20px",
                padding: "28px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: `rgba(0, 122, 255, 0.1)`,
                  }}
                >
                  <Users size={24} style={{ color: systemColors.blue }} />
                </div>
                <h3
                  className={typography.title3}
                  style={{ color: appleWebColors.textPrimary, margin: 0 }}
                >
                  透明性
                </h3>
              </div>
              <p
                className={typography.body}
                style={{ color: appleWebColors.textSecondary, margin: 0 }}
              >
                すべての評価基準、データソース、アフィリエイト関係を公開し、透明性を保ちます。
              </p>
            </div>

            <div
              className={`hover:-translate-y-1 transition-all ${liquidGlassClasses.light}`}
              style={{
                borderRadius: "20px",
                padding: "28px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: `rgba(52, 199, 89, 0.1)`,
                  }}
                >
                  <Building2 size={24} style={{ color: systemColors.green }} />
                </div>
                <h3
                  className={typography.title3}
                  style={{ color: appleWebColors.textPrimary, margin: 0 }}
                >
                  中立性
                </h3>
              </div>
              <p
                className={typography.body}
                style={{ color: appleWebColors.textSecondary, margin: 0 }}
              >
                特定メーカーとの利害関係を持たず、科学的根拠のみに基づいた評価を行います。
              </p>
            </div>
          </div>
        </section>

        {/* バリュー */}
        <section style={{ marginBottom: "64px" }}>
          <h2
            className={typography.title1}
            style={{ color: appleWebColors.textPrimary, marginBottom: "24px" }}
          >
            私たちの価値観
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              className={liquidGlassClasses.light}
              style={{
                borderRadius: "16px",
                borderLeft: `4px solid ${systemColors.blue}`,
                padding: "20px 24px",
              }}
            >
              <h3
                className={typography.headline}
                style={{
                  color: appleWebColors.textPrimary,
                  marginBottom: "8px",
                }}
              >
                科学的根拠を最優先
              </h3>
              <p
                className={typography.body}
                style={{ color: appleWebColors.textSecondary, margin: 0 }}
              >
                すべての情報は査読済み論文など信頼できるソースに基づいています。
              </p>
            </div>

            <div
              className={liquidGlassClasses.light}
              style={{
                borderRadius: "16px",
                borderLeft: `4px solid ${systemColors.green}`,
                padding: "20px 24px",
              }}
            >
              <h3
                className={typography.headline}
                style={{
                  color: appleWebColors.textPrimary,
                  marginBottom: "8px",
                }}
              >
                ユーザーファースト
              </h3>
              <p
                className={typography.body}
                style={{ color: appleWebColors.textSecondary, margin: 0 }}
              >
                広告主ではなく、ユーザーの健康と利益を最優先に考えます。
              </p>
            </div>

            <div
              className={liquidGlassClasses.light}
              style={{
                borderRadius: "16px",
                borderLeft: `4px solid ${systemColors.purple}`,
                padding: "20px 24px",
              }}
            >
              <h3
                className={typography.headline}
                style={{
                  color: appleWebColors.textPrimary,
                  marginBottom: "8px",
                }}
              >
                継続的改善
              </h3>
              <p
                className={typography.body}
                style={{ color: appleWebColors.textSecondary, margin: 0 }}
              >
                最新の研究結果を反映し、常にサービスの質を向上させ続けます。
              </p>
            </div>
          </div>
        </section>

        {/* 注意書き */}
        <div
          style={{
            backgroundColor: "rgba(255, 204, 0, 0.08)",
            borderRadius: "16px",
            border: `1px solid rgba(255, 204, 0, 0.2)`,
            padding: "20px 24px",
          }}
        >
          <p
            className={typography.subhead}
            style={{ color: appleWebColors.textPrimary, margin: 0 }}
          >
            <span style={{ fontWeight: 600 }}>⚠️ 注意事項:</span> 本ページの [ ]
            内の情報は、実際の会社情報に置き換える必要があります。
          </p>
        </div>
      </div>
    </div>
  );
}
