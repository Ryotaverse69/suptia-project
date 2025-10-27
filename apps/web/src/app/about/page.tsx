"use client";

import { Metadata } from "next";
import {
  Shield,
  TrendingUp,
  Search,
  BarChart3,
  CheckCircle2,
  Star,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
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
            <span>科学的根拠に基づくサプリメント選び</span>
          </div>
          <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">
            サプティアとは
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-primary-100">
            あなたに最適なサプリメントを見つける、科学的根拠に基づいた比較検索プラットフォーム。
            <br />
            複数のECサイトから最安値を比較し、透明性にこだわった新しいサプリメント選びを体験してください。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-primary transition-all hover:scale-105 hover:shadow-xl"
            >
              今すぐ検索してみる
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/how-to-use"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              使い方を見る
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-primary-200 bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">69+</div>
              <div className="text-primary-700">掲載サプリメント</div>
              <div className="text-sm text-primary-500 mt-1">毎週更新中</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">3社</div>
              <div className="text-primary-700">連携ECサイト</div>
              <div className="text-sm text-primary-500 mt-1">
                楽天・Yahoo・Amazon（準備中）
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">S〜D</div>
              <div className="text-primary-700">安全性ランク評価</div>
              <div className="text-sm text-primary-500 mt-1">
                科学的根拠に基づく
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is サプティア */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-primary-900">
              サプティアができること
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-primary-700">
              複雑で分かりにくいサプリメント選びを、科学的根拠に基づいてシンプルに。
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group rounded-2xl border border-primary-200 bg-white p-8 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-600 text-white">
                <Search size={28} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-primary-900">
                簡単検索
              </h3>
              <p className="text-primary-700">
                目的や成分から、あなたにぴったりのサプリメントを数秒で検索。商品名検索窓で絞り込みも可能。楽天・Yahoo!ショッピングから最安値を比較できます。
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-2xl border border-primary-200 bg-white p-8 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-mint to-accent-mint/80 text-white">
                <Shield size={28} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-primary-900">
                科学的根拠
              </h3>
              <p className="text-primary-700">
                すべての情報は査読済み論文に基づいています。エビデンスランク（S/A/B/C）を明確に表示し、信頼できる選択をサポート。
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-2xl border border-primary-200 bg-white p-8 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-purple to-accent-purple/80 text-white">
                <BarChart3 size={28} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-primary-900">
                詳細比較
              </h3>
              <p className="text-primary-700">
                価格、成分量、1日あたりのコストなど、複数の製品を一目で比較。データに基づいた賢い選択が可能です。
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-2xl border border-primary-200 bg-white p-8 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-600 text-white">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-primary-900">
                安全性チェック
              </h3>
              <p className="text-primary-700">
                第三者認証、製造プロセス、原材料の透明性を独自のスコアリングシステムで評価。安全性ランク（S〜D）で一目で判断できます。
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group rounded-2xl border border-primary-200 bg-white p-8 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-mint to-accent-mint/80 text-white">
                <Star size={28} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-primary-900">
                詳細フィルター
              </h3>
              <p className="text-primary-700">
                価格帯、エビデンスランク、安全性ランク、商品名で簡単に絞り込み。あなたのニーズにぴったりの商品を素早く見つけられます。
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group rounded-2xl border border-primary-200 bg-white p-8 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-purple to-accent-purple/80 text-white">
                <TrendingUp size={28} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-primary-900">
                AIレコメンド（準備中）
              </h3>
              <p className="text-primary-700">
                将来的には、あなたの健康目標、体質、予算に合わせて、AIが最適な製品を提案。パーソナライズされた選択を実現します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why サプティア */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-primary-900">
              なぜサプティアなのか
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-primary-700">
              他のサプリメントサイトとは、ここが違います
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-primary-900">
                    完全中立な評価
                  </h3>
                  <p className="text-primary-700">
                    特定メーカーとの利害関係なし。すべての製品を同じ科学的基準で公平に評価します。
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-primary-900">
                    透明性へのこだわり
                  </h3>
                  <p className="text-primary-700">
                    データソース、評価基準、アフィリエイト関係をすべて公開。隠し事は一切ありません。
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-primary-900">
                    科学的根拠の重視
                  </h3>
                  <p className="text-primary-700">
                    査読済み論文やエビデンスレベルに基づいた情報提供を心がけ、信頼できる情報源のみを使用しています。
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-primary-900">
                    常に最新の情報
                  </h3>
                  <p className="text-primary-700">
                    最新の研究結果を随時反映。古い情報に惑わされることなく、現時点でのベストな選択が可能です。
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="sticky top-24 rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-accent-mint/10 p-8">
                <h3 className="mb-6 text-2xl font-bold text-primary-900">
                  サプティアの約束
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-mint text-white">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="text-primary-800">
                      広告主の都合で評価を歪めません
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-mint text-white">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="text-primary-800">
                      科学的根拠のない情報は掲載しません
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-mint text-white">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="text-primary-800">
                      ユーザーの健康を最優先に考えます
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-mint text-white">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="text-primary-800">
                      すべての情報を透明に公開します
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-mint text-white">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="text-primary-800">
                      継続的に情報を更新し続けます
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Preview */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-primary-900">
              使い方はとてもシンプル
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-primary-700">
              3ステップで、あなたに最適なサプリメントが見つかります
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="relative text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-600 text-3xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-xl font-bold text-primary-900">
                検索する
              </h3>
              <p className="text-primary-700">
                目的や成分名を入力して検索。カテゴリーやフィルターで絞り込みも簡単。
              </p>
            </div>

            <div className="relative text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent-mint to-accent-mint/80 text-3xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-xl font-bold text-primary-900">
                比較する
              </h3>
              <p className="text-primary-700">
                価格、成分、安全性、レビューなど、多角的に製品を比較。データで納得して選択。
              </p>
            </div>

            <div className="relative text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent-purple to-accent-purple/80 text-3xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-xl font-bold text-primary-900">
                購入する
              </h3>
              <p className="text-primary-700">
                最安値のECサイトへ直接リンク。お得に、安心して購入できます。
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/how-to-use"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold"
            >
              詳しい使い方を見る
              <ArrowRight size={20} />
            </Link>
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
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">
            今すぐ、最適なサプリメントを見つけよう
          </h2>
          <p className="mb-8 text-xl text-primary-100">
            69以上の厳選サプリメントから、あなたにぴったりの1つを。毎週新商品追加中。
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
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              お問い合わせ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
