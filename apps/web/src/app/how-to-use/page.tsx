"use client";

import {
  Search,
  Filter,
  BarChart3,
  ShoppingCart,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Star,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        {/* Static gradient background (same as hero search) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #7a98ec 0%, #5a7fe6 25%, #3b66e0 50%, #2d4fb8 75%, #243d94 100%)",
          }}
        ></div>
        <div className="relative mx-auto max-w-6xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
            <Sparkles size={16} />
            <span>3ステップでかんたん</span>
          </div>
          <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">
            サプティアの使い方
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-primary-100">
            検索から購入まで、たった3ステップ。
            <br />
            最適なサプリメントを、科学的根拠に基づいて見つけることができます。
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-primary transition-all hover:scale-105 hover:shadow-xl"
          >
            今すぐ検索してみる
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Main Steps */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl space-y-24">
          {/* Step 1 */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-600 text-2xl font-bold text-white">
                1
              </div>
              <h2 className="mb-4 text-3xl font-bold text-primary-900">
                目的に合わせて検索
              </h2>
              <p className="mb-6 text-lg text-primary-700">
                健康目標や気になる成分名を入力するだけで、あなたにぴったりのサプリメントを検索できます。
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-mint text-white">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-900">
                      キーワード検索
                    </h3>
                    <p className="text-primary-700">
                      「ビタミンC」「免疫力」「美肌」など、自由に検索。商品名検索窓で更に絞り込みも可能
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-mint text-white">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-900">
                      エビデンスランクフィルター
                    </h3>
                    <p className="text-primary-700">
                      S~Dの科学的根拠レベルで絞り込み
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-mint text-white">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-900">
                      安全性ランクフィルター
                    </h3>
                    <p className="text-primary-700">
                      S〜D（90点以上〜60点以上）の安全性ランクで絞り込み
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-primary-200 bg-white p-8 shadow-xl">
              <div className="mb-4 flex items-center gap-3 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3">
                <Search size={20} className="text-primary-600" />
                <span className="text-primary-700">
                  例: ビタミンC 美肌 免疫力
                </span>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg border border-primary-100 bg-gradient-to-r from-primary-50 to-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold text-primary-900">
                      ビタミンC 1000mg
                    </span>
                    <span className="text-sm text-accent-mint font-medium">
                      安全性 98%
                    </span>
                  </div>
                  <p className="text-sm text-primary-700">
                    高濃度ビタミンCサプリメント
                  </p>
                </div>
                <div className="rounded-lg border border-primary-100 bg-gradient-to-r from-primary-50 to-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold text-primary-900">
                      リポソームビタミンC
                    </span>
                    <span className="text-sm text-accent-mint font-medium">
                      安全性 95%
                    </span>
                  </div>
                  <p className="text-sm text-primary-700">
                    吸収率の高いビタミンC
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 rounded-2xl border border-primary-200 bg-white p-8 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-primary-100 bg-primary-50 p-4">
                  <span className="font-semibold text-primary-900">価格</span>
                  <span className="text-primary-700">¥1,200 〜 ¥3,800</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-primary-100 bg-primary-50 p-4">
                  <span className="font-semibold text-primary-900">
                    ビタミンC含有量
                  </span>
                  <span className="text-primary-700">500mg 〜 1000mg</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-primary-100 bg-primary-50 p-4">
                  <span className="font-semibold text-primary-900">
                    1日あたりコスト
                  </span>
                  <span className="text-primary-700">¥40 〜 ¥127</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-primary-100 bg-primary-50 p-4">
                  <span className="font-semibold text-primary-900">
                    安全性スコア
                  </span>
                  <span className="text-accent-mint font-semibold">
                    85% 〜 98%
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-primary-100 bg-primary-50 p-4">
                  <span className="font-semibold text-primary-900">
                    ユーザー評価
                  </span>
                  <div className="flex items-center gap-1">
                    <Star
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-primary-700">4.2 〜 4.8</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-mint to-accent-mint/80 text-2xl font-bold text-white">
                2
              </div>
              <h2 className="mb-4 text-3xl font-bold text-primary-900">
                多角的に比較検討
              </h2>
              <p className="mb-6 text-lg text-primary-700">
                価格、成分量、安全性、エビデンスレベルなど、複数の視点から製品を比較。データに基づいた賢い選択ができます。
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-900">
                      価格・コスト比較
                    </h3>
                    <p className="text-primary-700">
                      楽天市場・Yahoo!ショッピングから最安値を自動検索（Amazon準備中）
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-900">
                      成分量・配合比較
                    </h3>
                    <p className="text-primary-700">
                      有効成分の含有量を一目で比較
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-900">
                      安全性・品質評価
                    </h3>
                    <p className="text-primary-700">
                      第三者認証、製造プロセスを独自評価
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-900">
                      エビデンスレベル確認
                    </h3>
                    <p className="text-primary-700">
                      各成分のエビデンスランク（S~D）を確認して、科学的根拠に基づいた選択
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-purple to-accent-purple/80 text-2xl font-bold text-white">
                3
              </div>
              <h2 className="mb-4 text-3xl font-bold text-primary-900">
                最安値で購入
              </h2>
              <p className="mb-6 text-lg text-primary-700">
                比較検討した製品を、最もお得な価格で購入できるECサイトへ直接リンク。安心してお買い物ができます。
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-purple text-white">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-900">
                      複数ECサイトから最安値検索
                    </h3>
                    <p className="text-primary-700">
                      楽天市場、Yahoo!ショッピングの価格を自動比較（Amazon・iHerb準備中）
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-purple text-white">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-900">
                      送料・ポイントも考慮
                    </h3>
                    <p className="text-primary-700">
                      実質価格で最もお得な購入先を提案
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-purple text-white">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-900">
                      定期購入・まとめ買い情報
                    </h3>
                    <p className="text-primary-700">
                      さらにお得になる購入方法も紹介
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-primary-200 bg-white p-8 shadow-xl">
              <h3 className="mb-4 text-xl font-bold text-primary-900">
                最安値の購入先
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-accent-mint bg-accent-mint/10 p-4">
                  <div>
                    <div className="font-semibold text-primary-900">
                      楽天市場
                    </div>
                    <div className="text-sm text-primary-700">ポイント10倍</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-accent-mint">
                      ¥1,380
                    </div>
                    <div className="text-xs text-accent-mint font-medium">
                      最安値
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-primary-100 bg-primary-50 p-4">
                  <div>
                    <div className="font-semibold text-primary-900">
                      Yahoo!ショッピング
                    </div>
                    <div className="text-sm text-primary-700">
                      PayPayポイント
                    </div>
                  </div>
                  <div className="text-lg font-bold text-primary-700">
                    ¥1,420
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-primary-100 bg-primary-50/50 p-4 opacity-60">
                  <div>
                    <div className="font-semibold text-primary-900">
                      Amazon（準備中）
                    </div>
                    <div className="text-sm text-primary-700">近日対応予定</div>
                  </div>
                  <div className="text-lg font-bold text-primary-700">-</div>
                </div>
              </div>
              <button className="mt-6 w-full rounded-lg bg-gradient-to-r from-primary to-primary-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg">
                楽天市場で購入する
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-primary-900">
              さらに便利な機能
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-primary-700">
              サプティアならではの、賢いサプリメント選びをサポートする機能
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-white to-primary-50 p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                <Filter size={24} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-primary-900">
                詳細フィルター
              </h3>
              <p className="text-primary-700">
                アレルゲン、ヴィーガン対応、グルテンフリーなど、あなたのニーズに合わせた絞り込みが可能
              </p>
            </div>

            <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-white to-primary-50 p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-mint text-white">
                <Shield size={24} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-primary-900">
                安全性チェック
              </h3>
              <p className="text-primary-700">
                第三者認証、製造基準、原材料の透明性を独自のスコアリングシステムで評価
              </p>
            </div>

            <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-white to-primary-50 p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-purple text-white">
                <BarChart3 size={24} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-primary-900">
                成分ガイド
              </h3>
              <p className="text-primary-700">
                各成分の効果、推奨摂取量、科学的根拠を分かりやすく解説。正しい知識でサプリを選べる
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        {/* Static gradient background (same as hero search) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #7a98ec 0%, #5a7fe6 25%, #3b66e0 50%, #2d4fb8 75%, #243d94 100%)",
          }}
        ></div>
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">
            さあ、サプティアを使ってみよう
          </h2>
          <p className="mb-8 text-xl text-primary-100">
            69以上の厳選サプリメントから、あなたにぴったりの1つを見つけましょう。毎週新商品追加中。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-primary transition-all hover:scale-105 hover:shadow-xl"
            >
              無料で検索を始める
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              サプティアについて
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
