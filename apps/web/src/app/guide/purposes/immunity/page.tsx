import { Metadata } from "next";
import Link from "next/link";
import { Shield, CheckCircle, AlertCircle, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title:
    "免疫力向上サプリガイド｜科学的根拠に基づく免疫サポートサプリの選び方 - サプティア",
  description:
    "免疫機能強化、風邪予防、感染症対策に効果的なサプリメントを科学的根拠に基づいて解説。ビタミンC、ビタミンD、亜鉛、エルダーベリーなど、本当に効果のある免疫サプリの選び方。",
  keywords: [
    "免疫力",
    "風邪予防",
    "ビタミンC",
    "ビタミンD",
    "亜鉛",
    "エルダーベリー",
    "免疫強化",
  ],
};

export default function ImmunityGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ヒーローセクション */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
        <div className="mx-auto px-6 lg:px-12 xl:px-16 py-16 max-w-[1200px]">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-white/10 rounded-xl">
              <Shield size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              免疫力向上サプリガイド
            </h1>
          </div>
          <p className="text-xl text-green-100 max-w-3xl">
            科学的根拠に基づいて、本当に効果のある免疫サポートサプリメントを選びましょう。
            <br />
            感染症に負けない、強い免疫システムを維持する。
          </p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="mx-auto px-6 lg:px-12 xl:px-16 py-12 max-w-[1200px]">
        {/* イントロダクション */}
        <section className="mb-12">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
            <div className="flex items-start gap-3">
              <BookOpen
                className="text-blue-500 flex-shrink-0 mt-1"
                size={24}
              />
              <div>
                <h2 className="text-xl font-bold text-blue-900 mb-2">
                  免疫サプリの基礎知識
                </h2>
                <p className="text-blue-800">
                  免疫システムは、ウイルスや細菌などの外敵から体を守る重要な防御機構です。
                  適切な栄養素を補給することで、免疫細胞の機能を最適化し、感染症のリスクを減らすことができます。
                  <strong className="block mt-2">
                    科学的に効果が実証された成分を選ぶことで、年間を通して健康な免疫システムを維持できます。
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 免疫力向上に効果的な成分 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary-900 mb-6">
            免疫力向上に効果的な主要成分
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* ビタミンD */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                ビタミンD
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: S（最高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                免疫調節に最も重要な栄養素。白血球の機能を強化し、呼吸器感染症のリスクを25%減少させることが大規模研究で確認されています。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  1日 1000〜4000IU（血中濃度30ng/mL以上を維持）
                </p>
              </div>
              <Link
                href="/ingredients/vitamin-d"
                className="text-primary hover:underline text-sm font-semibold"
              >
                ビタミンDの詳細を見る →
              </Link>
            </div>

            {/* ビタミンC */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                ビタミンC
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: S（最高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                強力な抗酸化作用と免疫細胞の機能強化。風邪の予防効果は限定的ですが、風邪の期間を8%短縮し、症状を軽減する効果が確認されています。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  1日 500〜2000mg（風邪予防は1000mg以上推奨）
                </p>
              </div>
              <Link
                href="/ingredients/vitamin-c"
                className="text-primary hover:underline text-sm font-semibold"
              >
                ビタミンCの詳細を見る →
              </Link>
            </div>

            {/* 亜鉛 */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                亜鉛
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: A（高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                免疫細胞の発達と機能に不可欠。風邪の初期症状（24時間以内）に摂取すると、症状の期間を約33%短縮する効果があります。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  予防：1日 15〜30mg / 風邪時：75mg以上（トローチ推奨）
                </p>
              </div>
              <Link
                href="/ingredients/zinc"
                className="text-primary hover:underline text-sm font-semibold"
              >
                亜鉛の詳細を見る →
              </Link>
            </div>

            {/* エルダーベリー */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                エルダーベリー
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: A（高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                強力な抗ウイルス作用を持つベリー。風邪やインフルエンザの症状を2〜4日短縮し、重症度を軽減することが複数の研究で確認されています。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  予防：1日 300〜500mg / 風邪時：1日 4回 175mg
                </p>
              </div>
              <Link
                href="/ingredients/elderberry"
                className="text-primary hover:underline text-sm font-semibold"
              >
                エルダーベリーの詳細を見る →
              </Link>
            </div>

            {/* プロバイオティクス */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                プロバイオティクス
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: A（高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                腸内の善玉菌を増やし、免疫システムの70%が集中する腸の健康を改善。呼吸器感染症のリスクを約40%減少させます。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  1日 10〜100億CFU（Lactobacillus + Bifidobacterium推奨）
                </p>
              </div>
              <Link
                href="/ingredients/probiotics"
                className="text-primary hover:underline text-sm font-semibold"
              >
                プロバイオティクスの詳細を見る →
              </Link>
            </div>

            {/* エキナセア */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                エキナセア
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: B（中）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                伝統的な免疫ハーブ。風邪の発症リスクを約15%減少させ、症状を1〜2日短縮する可能性がありますが、個人差が大きい。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  風邪初期に300〜500mg、1日3回（最大10日間）
                </p>
              </div>
              <Link
                href="/ingredients/echinacea"
                className="text-primary hover:underline text-sm font-semibold"
              >
                エキナセアの詳細を見る →
              </Link>
            </div>
          </div>
        </section>

        {/* 組み合わせのススメ */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary-900 mb-6">
            相乗効果のある組み合わせ
          </h2>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-green-900 mb-4">
              🛡️ 最強コンビネーション
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-bold text-primary-900 mb-2">
                  ビタミンD + 亜鉛
                </h4>
                <p className="text-sm text-primary-700">
                  免疫システムの二大支柱。ビタミンDが免疫細胞を活性化し、亜鉛がその機能を最適化します。年間を通しての基本サプリ。
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-bold text-primary-900 mb-2">
                  ビタミンC + 亜鉛
                </h4>
                <p className="text-sm text-primary-700">
                  風邪の症状を素早く軽減する黄金コンビ。症状が出始めたら即座に摂取すると効果的。
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-bold text-primary-900 mb-2">
                  エルダーベリー + プロバイオティクス
                </h4>
                <p className="text-sm text-primary-700">
                  ウイルス対策と腸内環境改善のダブルアプローチ。免疫システム全体を強化します。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 注意事項 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary-900 mb-6">
            摂取時の注意点
          </h2>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertCircle
                className="text-amber-600 flex-shrink-0 mt-1"
                size={24}
              />
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-amber-900 mb-1">
                    予防が最も重要
                  </h3>
                  <p className="text-sm text-amber-800">
                    サプリメントは免疫を「強化」しますが、基本は栄養バランスの良い食事、十分な睡眠、適度な運動です。
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 mb-1">
                    亜鉛は過剰摂取に注意
                  </h3>
                  <p className="text-sm text-amber-800">
                    長期的に40mg以上摂取すると銅の吸収を阻害します。風邪時の高用量（75mg）は短期間（5〜7日）のみにしましょう。
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 mb-1">
                    自己免疫疾患がある方は医師に相談
                  </h3>
                  <p className="text-sm text-amber-800">
                    エキナセアや一部のプロバイオティクスは免疫を活性化するため、自己免疫疾患（関節リウマチ、多発性硬化症など）の方は医師に相談してください。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 関連リンク */}
        <section>
          <div className="bg-gradient-to-br from-primary-50 to-accent-mint/10 border border-primary-200 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-primary-900 mb-4">
              関連ガイド
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/guide/purposes"
                className="p-4 bg-white rounded-lg hover:shadow-lg transition-shadow border border-primary-200"
              >
                <h4 className="font-bold text-primary-900 mb-2">
                  目的別ガイド
                </h4>
                <p className="text-sm text-primary-700">他の健康目標も見る</p>
              </Link>
              <Link
                href="/ingredients"
                className="p-4 bg-white rounded-lg hover:shadow-lg transition-shadow border border-primary-200"
              >
                <h4 className="font-bold text-primary-900 mb-2">成分ガイド</h4>
                <p className="text-sm text-primary-700">全成分の詳細を確認</p>
              </Link>
              <Link
                href="/guide/dangerous-ingredients"
                className="p-4 bg-white rounded-lg hover:shadow-lg transition-shadow border border-primary-200"
              >
                <h4 className="font-bold text-primary-900 mb-2">
                  危険成分ガイド
                </h4>
                <p className="text-sm text-primary-700">避けるべき成分を確認</p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
