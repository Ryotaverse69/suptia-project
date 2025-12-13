import { Metadata } from "next";
import {
  Search,
  BarChart3,
  ShoppingCart,
  Star,
  Shield,
  Zap,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

export const metadata: Metadata = {
  title: "サプティアの使い方 - サプティア",
  description:
    "科学的根拠に基づいた最適なサプリメントを3つのステップで見つける方法。商品検索、価格比較、安全性スコア評価など、サプティアの全機能を詳しく解説します。",
};

export default function HowItWorksPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h1
            className="text-[34px] md:text-[48px] font-bold mb-4 tracking-tight"
            style={{ color: appleWebColors.textPrimary }}
          >
            サプティアの使い方
          </h1>
          <p
            className="text-[17px] md:text-[21px] leading-relaxed"
            style={{ color: appleWebColors.textSecondary }}
          >
            科学的根拠に基づいた最適なサプリメントを見つける方法
          </p>
        </div>

        {/* ステップバイステップガイド */}
        <section className="mb-20">
          <h2
            className="text-[28px] md:text-[34px] font-bold mb-12 text-center tracking-tight"
            style={{ color: appleWebColors.textPrimary }}
          >
            3つのステップで最適なサプリメントを見つける
          </h2>

          <div className="space-y-6">
            {/* ステップ1 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-[28px] font-bold"
                  style={{
                    backgroundColor: systemColors.blue,
                    color: "#FFFFFF",
                  }}
                >
                  1
                </div>
              </div>
              <div
                className={`flex-1 rounded-[16px] p-6 ${liquidGlassClasses.light}`}
                style={{
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Search
                    className="w-8 h-8"
                    style={{ color: systemColors.blue }}
                  />
                  <h3
                    className="text-[22px] font-bold"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    検索する
                  </h3>
                </div>
                <p
                  className="text-[17px] leading-[1.47059] mb-4"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  目的や成分、ブランド名で検索。または、カテゴリから製品を探せます。
                </p>
                <div
                  className="rounded-[12px] p-4"
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                >
                  <p
                    className="text-[15px] font-semibold mb-2"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    検索方法:
                  </p>
                  <ul
                    className="text-[15px] space-y-1.5"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    <li>
                      • 目的別検索（例：睡眠改善、免疫サポート、エネルギー向上）
                    </li>
                    <li>
                      • 成分別検索（例：ビタミンD、オメガ3、マグネシウム）
                    </li>
                    <li>• ブランド検索（例：NOW Foods、Nature Made）</li>
                    <li>• フリーワード検索</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ステップ2 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-[28px] font-bold"
                  style={{
                    backgroundColor: systemColors.green,
                    color: "#FFFFFF",
                  }}
                >
                  2
                </div>
              </div>
              <div
                className={`flex-1 rounded-[16px] p-6 ${liquidGlassClasses.light}`}
                style={{
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <BarChart3
                    className="w-8 h-8"
                    style={{ color: systemColors.green }}
                  />
                  <h3
                    className="text-[22px] font-bold"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    比較する
                  </h3>
                </div>
                <p
                  className="text-[17px] leading-[1.47059] mb-4"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  科学的根拠、品質、価格、レビューを総合的に比較。信頼スコアで一目瞭然。
                </p>
                <div
                  className="rounded-[12px] p-4"
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                >
                  <p
                    className="text-[15px] font-semibold mb-2"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    比較項目:
                  </p>
                  <ul
                    className="text-[15px] space-y-1.5"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    <li>
                      • 信頼スコア（エビデンスレベル、品質認証、成分含有量）
                    </li>
                    <li>• 価格比較（複数ECサイトから最安値を表示）</li>
                    <li>• ユーザーレビュー・評価</li>
                    <li>• 第三者認証（NSF、USP、Informed Choice等）</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ステップ3 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-[28px] font-bold"
                  style={{
                    backgroundColor: systemColors.orange,
                    color: "#FFFFFF",
                  }}
                >
                  3
                </div>
              </div>
              <div
                className={`flex-1 rounded-[16px] p-6 ${liquidGlassClasses.light}`}
                style={{
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <ShoppingCart
                    className="w-8 h-8"
                    style={{ color: systemColors.orange }}
                  />
                  <h3
                    className="text-[22px] font-bold"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    購入する
                  </h3>
                </div>
                <p
                  className="text-[17px] leading-[1.47059] mb-4"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  最適な製品を見つけたら、お好きなECサイトで購入。Amazon、楽天、iHerb等から選択可能。
                </p>
                <div
                  className="rounded-[12px] p-4"
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                >
                  <p
                    className="text-[15px] font-semibold mb-2"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    購入オプション:
                  </p>
                  <ul
                    className="text-[15px] space-y-1.5"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    <li>• 複数ECサイトの価格を一括比較</li>
                    <li>• ポイント還元率も考慮した最安値検索</li>
                    <li>• 定期購入オプションの有無</li>
                    <li>• 配送期間・送料の確認</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 主要機能 */}
        <section className="mb-20">
          <h2
            className="text-[28px] md:text-[34px] font-bold mb-12 text-center tracking-tight"
            style={{ color: appleWebColors.textPrimary }}
          >
            主要機能
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div
              className={`rounded-[16px] p-6 ${liquidGlassClasses.light}`}
              style={{
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ backgroundColor: `${systemColors.blue}15` }}
              >
                <Shield
                  className="w-6 h-6"
                  style={{ color: systemColors.blue }}
                />
              </div>
              <h3
                className="font-semibold text-[17px] mb-2"
                style={{ color: appleWebColors.textPrimary }}
              >
                信頼スコア
              </h3>
              <p
                className="text-[15px] leading-[1.4]"
                style={{ color: appleWebColors.textSecondary }}
              >
                科学的エビデンス、品質認証、成分の生物学的利用能を総合評価し、0〜100点でスコア化。
              </p>
            </div>

            <div
              className={`rounded-[16px] p-6 ${liquidGlassClasses.light}`}
              style={{
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ backgroundColor: `${systemColors.yellow}15` }}
              >
                <Star
                  className="w-6 h-6"
                  style={{ color: systemColors.yellow }}
                />
              </div>
              <h3
                className="font-semibold text-[17px] mb-2"
                style={{ color: appleWebColors.textPrimary }}
              >
                レビュー統合
              </h3>
              <p
                className="text-[15px] leading-[1.4]"
                style={{ color: appleWebColors.textSecondary }}
              >
                複数ECサイトのレビューを統合表示。ユーザーの生の声を確認できます。
              </p>
            </div>

            <div
              className={`rounded-[16px] p-6 ${liquidGlassClasses.light}`}
              style={{
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ backgroundColor: `${systemColors.green}15` }}
              >
                <BarChart3
                  className="w-6 h-6"
                  style={{ color: systemColors.green }}
                />
              </div>
              <h3
                className="font-semibold text-[17px] mb-2"
                style={{ color: appleWebColors.textPrimary }}
              >
                価格履歴
              </h3>
              <p
                className="text-[15px] leading-[1.4]"
                style={{ color: appleWebColors.textSecondary }}
              >
                過去の価格変動を追跡。セール時期を見逃さず、最適なタイミングで購入可能。
              </p>
            </div>

            <div
              className={`rounded-[16px] p-6 ${liquidGlassClasses.light}`}
              style={{
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ backgroundColor: `${systemColors.purple}15` }}
              >
                <Zap
                  className="w-6 h-6"
                  style={{ color: systemColors.purple }}
                />
              </div>
              <h3
                className="font-semibold text-[17px] mb-2"
                style={{ color: appleWebColors.textPrimary }}
              >
                AIレコメンド
              </h3>
              <p
                className="text-[15px] leading-[1.4]"
                style={{ color: appleWebColors.textSecondary }}
              >
                閲覧履歴や目的に基づき、AIがパーソナライズされた製品を提案します。
              </p>
            </div>

            <div
              className={`rounded-[16px] p-6 ${liquidGlassClasses.light}`}
              style={{
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ backgroundColor: `${systemColors.teal}15` }}
              >
                <Search
                  className="w-6 h-6"
                  style={{ color: systemColors.teal }}
                />
              </div>
              <h3
                className="font-semibold text-[17px] mb-2"
                style={{ color: appleWebColors.textPrimary }}
              >
                高度なフィルター
              </h3>
              <p
                className="text-[15px] leading-[1.4]"
                style={{ color: appleWebColors.textSecondary }}
              >
                価格帯、認証、成分形態、アレルゲン、食事制限（ビーガン等）で絞り込み可能。
              </p>
            </div>

            <div
              className={`rounded-[16px] p-6 ${liquidGlassClasses.light}`}
              style={{
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ backgroundColor: `${systemColors.orange}15` }}
              >
                <ShoppingCart
                  className="w-6 h-6"
                  style={{ color: systemColors.orange }}
                />
              </div>
              <h3
                className="font-semibold text-[17px] mb-2"
                style={{ color: appleWebColors.textPrimary }}
              >
                お気に入り機能
              </h3>
              <p
                className="text-[15px] leading-[1.4]"
                style={{ color: appleWebColors.textSecondary }}
              >
                気になる製品をお気に入り登録。価格変動時に通知を受け取れます（開発予定）。
              </p>
            </div>
          </div>
        </section>

        {/* 信頼スコアの仕組み */}
        <section className="mb-20">
          <h2
            className="text-[28px] md:text-[34px] font-bold mb-8 text-center tracking-tight"
            style={{ color: appleWebColors.textPrimary }}
          >
            信頼スコアの仕組み
          </h2>
          <div className="max-w-4xl mx-auto">
            <p
              className="text-[17px] leading-[1.47059] mb-8 text-center"
              style={{ color: appleWebColors.textSecondary }}
            >
              サプティアの信頼スコアは、以下の要素を総合的に評価して算出されます：
            </p>

            <div className="space-y-4">
              <div
                className={`rounded-[16px] p-6 ${liquidGlassClasses.light}`}
                style={{
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className="font-semibold text-[17px]"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    科学的エビデンス
                  </h3>
                  <span
                    className="text-[15px] font-semibold"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    40%
                  </span>
                </div>
                <div
                  className="w-full rounded-full h-2 mb-3"
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                >
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: "40%",
                      backgroundColor: systemColors.blue,
                    }}
                  ></div>
                </div>
                <p
                  className="text-[15px] leading-[1.4]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  査読済み論文、臨床試験データに基づくエビデンスレベル（A〜D）
                </p>
              </div>

              <div
                className={`rounded-[16px] p-6 ${liquidGlassClasses.light}`}
                style={{
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className="font-semibold text-[17px]"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    品質認証
                  </h3>
                  <span
                    className="text-[15px] font-semibold"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    30%
                  </span>
                </div>
                <div
                  className="w-full rounded-full h-2 mb-3"
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                >
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: "30%",
                      backgroundColor: systemColors.green,
                    }}
                  ></div>
                </div>
                <p
                  className="text-[15px] leading-[1.4]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  NSF、USP、GMP等の第三者認証の有無と信頼性
                </p>
              </div>

              <div
                className={`rounded-[16px] p-6 ${liquidGlassClasses.light}`}
                style={{
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className="font-semibold text-[17px]"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    成分品質
                  </h3>
                  <span
                    className="text-[15px] font-semibold"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    20%
                  </span>
                </div>
                <div
                  className="w-full rounded-full h-2 mb-3"
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                >
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: "20%",
                      backgroundColor: systemColors.orange,
                    }}
                  ></div>
                </div>
                <p
                  className="text-[15px] leading-[1.4]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  含有量の正確性、成分形態（吸収率の高い形態か）、純度
                </p>
              </div>

              <div
                className={`rounded-[16px] p-6 ${liquidGlassClasses.light}`}
                style={{
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className="font-semibold text-[17px]"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    透明性
                  </h3>
                  <span
                    className="text-[15px] font-semibold"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    10%
                  </span>
                </div>
                <div
                  className="w-full rounded-full h-2 mb-3"
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                >
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: "10%",
                      backgroundColor: systemColors.purple,
                    }}
                  ></div>
                </div>
                <p
                  className="text-[15px] leading-[1.4]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  製造プロセス、原材料の原産地、試験結果の公開度
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* よくある使い方 */}
        <section className="mb-20">
          <h2
            className="text-[28px] md:text-[34px] font-bold mb-12 text-center tracking-tight"
            style={{ color: appleWebColors.textPrimary }}
          >
            よくある使い方
          </h2>

          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            <div
              className={`rounded-[16px] p-6 ${liquidGlassClasses.light}`}
              style={{
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
            >
              <h3
                className="font-semibold text-[17px] mb-3"
                style={{ color: appleWebColors.textPrimary }}
              >
                目的別で探す
              </h3>
              <p
                className="text-[15px] leading-[1.4] mb-3"
                style={{ color: appleWebColors.textSecondary }}
              >
                「睡眠を改善したい」「免疫力をサポートしたい」など、目的から検索。
              </p>
              <ol
                className="text-[15px] leading-[1.4] space-y-1.5 list-decimal list-inside"
                style={{ color: appleWebColors.textSecondary }}
              >
                <li>目的を選択（例：睡眠改善）</li>
                <li>関連成分の製品が表示される</li>
                <li>信頼スコアで並び替え</li>
                <li>レビューを確認して購入</li>
              </ol>
            </div>

            <div
              className={`rounded-[16px] p-6 ${liquidGlassClasses.light}`}
              style={{
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
            >
              <h3
                className="font-semibold text-[17px] mb-3"
                style={{ color: appleWebColors.textPrimary }}
              >
                成分名で探す
              </h3>
              <p
                className="text-[15px] leading-[1.4] mb-3"
                style={{ color: appleWebColors.textSecondary }}
              >
                「ビタミンD」「マグネシウム」など、特定成分の製品を比較。
              </p>
              <ol
                className="text-[15px] leading-[1.4] space-y-1.5 list-decimal list-inside"
                style={{ color: appleWebColors.textSecondary }}
              >
                <li>成分名で検索</li>
                <li>成分形態でフィルター（例：クエン酸マグネシウム）</li>
                <li>含有量と価格を比較</li>
                <li>コスパの良い製品を選択</li>
              </ol>
            </div>

            <div
              className={`rounded-[16px] p-6 ${liquidGlassClasses.light}`}
              style={{
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
            >
              <h3
                className="font-semibold text-[17px] mb-3"
                style={{ color: appleWebColors.textPrimary }}
              >
                ブランドで探す
              </h3>
              <p
                className="text-[15px] leading-[1.4] mb-3"
                style={{ color: appleWebColors.textSecondary }}
              >
                お気に入りのブランドから製品を探す。
              </p>
              <ol
                className="text-[15px] leading-[1.4] space-y-1.5 list-decimal list-inside"
                style={{ color: appleWebColors.textSecondary }}
              >
                <li>ブランド名で検索</li>
                <li>製品ラインナップを確認</li>
                <li>同ブランド内で最適な製品を選択</li>
              </ol>
            </div>

            <div
              className={`rounded-[16px] p-6 ${liquidGlassClasses.light}`}
              style={{
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
            >
              <h3
                className="font-semibold text-[17px] mb-3"
                style={{ color: appleWebColors.textPrimary }}
              >
                価格重視で探す
              </h3>
              <p
                className="text-[15px] leading-[1.4] mb-3"
                style={{ color: appleWebColors.textSecondary }}
              >
                コストパフォーマンスを重視した製品選び。
              </p>
              <ol
                className="text-[15px] leading-[1.4] space-y-1.5 list-decimal list-inside"
                style={{ color: appleWebColors.textSecondary }}
              >
                <li>価格でソート</li>
                <li>1日あたりのコストを計算</li>
                <li>品質とコスパのバランスを確認</li>
                <li>セール情報をチェック</li>
              </ol>
            </div>
          </div>
        </section>

        {/* 安全な使い方 */}
        <section className="mb-20">
          <div
            className="rounded-[20px] p-8 max-w-4xl mx-auto"
            style={{
              backgroundColor: "rgba(255, 204, 0, 0.08)",
              border: `1px solid ${systemColors.yellow}40`,
            }}
          >
            <h2
              className="text-[22px] font-bold mb-6 flex items-center gap-2"
              style={{ color: appleWebColors.textPrimary }}
            >
              安全にご利用いただくために
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <span
                  className="mt-1 text-[17px]"
                  style={{ color: systemColors.yellow }}
                >
                  ✓
                </span>
                <p
                  className="text-[15px] leading-[1.4]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  <strong style={{ color: appleWebColors.textPrimary }}>
                    医師に相談:
                  </strong>{" "}
                  新しいサプリメントを開始する前に、必ず医師または専門家にご相談ください。
                </p>
              </li>
              <li className="flex items-start space-x-3">
                <span
                  className="mt-1 text-[17px]"
                  style={{ color: systemColors.yellow }}
                >
                  ✓
                </span>
                <p
                  className="text-[15px] leading-[1.4]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  <strong style={{ color: appleWebColors.textPrimary }}>
                    用法用量を守る:
                  </strong>{" "}
                  製品に記載された用法用量を必ず守ってください。
                </p>
              </li>
              <li className="flex items-start space-x-3">
                <span
                  className="mt-1 text-[17px]"
                  style={{ color: systemColors.yellow }}
                >
                  ✓
                </span>
                <p
                  className="text-[15px] leading-[1.4]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  <strong style={{ color: appleWebColors.textPrimary }}>
                    相互作用に注意:
                  </strong>{" "}
                  処方薬との相互作用がある場合があります。
                </p>
              </li>
              <li className="flex items-start space-x-3">
                <span
                  className="mt-1 text-[17px]"
                  style={{ color: systemColors.yellow }}
                >
                  ✓
                </span>
                <p
                  className="text-[15px] leading-[1.4]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  <strong style={{ color: appleWebColors.textPrimary }}>
                    妊娠・授乳中:
                  </strong>{" "}
                  妊娠中・授乳中の方は特に注意が必要です。
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* サポート */}
        <section>
          <div
            className="text-center pt-12"
            style={{
              borderTop: `1px solid ${appleWebColors.separator}`,
            }}
          >
            <h2
              className="text-[22px] md:text-[28px] font-bold mb-4 tracking-tight"
              style={{ color: appleWebColors.textPrimary }}
            >
              さらに詳しく知りたい方へ
            </h2>
            <p
              className="text-[17px] leading-[1.47059] mb-8"
              style={{ color: appleWebColors.textSecondary }}
            >
              使い方でお困りの場合は、FAQをご確認いただくか、お問い合わせください
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/faq"
                className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-[12px] font-semibold text-[17px] transition-all duration-200 hover:bg-[#007AFF]/10"
                style={{
                  border: `1px solid ${systemColors.blue}`,
                  color: systemColors.blue,
                  backgroundColor: "transparent",
                }}
              >
                FAQを見る
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-[12px] font-semibold text-[17px] transition-all duration-200 hover:bg-[#0051D5]"
                style={{
                  backgroundColor: systemColors.blue,
                  color: "#FFFFFF",
                }}
              >
                お問い合わせ
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
