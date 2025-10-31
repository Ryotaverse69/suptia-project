import { Metadata } from "next";
import Link from "next/link";
import { Moon, CheckCircle, AlertCircle, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title:
    "睡眠改善サプリガイド｜科学的根拠に基づく睡眠サプリの選び方 - サプティア",
  description:
    "睡眠の質向上、入眠促進、深い眠りに効果的なサプリメントを科学的根拠に基づいて解説。メラトニン、マグネシウム、GABA、テアニンなど、本当に効果のある睡眠サプリの選び方。",
  keywords: [
    "睡眠改善",
    "不眠症",
    "メラトニン",
    "マグネシウム",
    "GABA",
    "テアニン",
    "グリシン",
  ],
};

export default function SleepGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ヒーローセクション */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="mx-auto px-6 lg:px-12 xl:px-16 py-16 max-w-[1200px]">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-white/10 rounded-xl">
              <Moon size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              睡眠改善サプリガイド
            </h1>
          </div>
          <p className="text-xl text-indigo-100 max-w-3xl">
            科学的根拠に基づいて、本当に効果のある睡眠サプリメントを選びましょう。
            <br />
            質の高い睡眠で、心身の回復と健康維持をサポートする。
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
                  睡眠サプリの基礎知識
                </h2>
                <p className="text-blue-800">
                  睡眠は心身の健康維持に不可欠ですが、現代人の多くが睡眠の質に悩んでいます。
                  適切なサプリメントは、入眠をスムーズにし、深い眠りをサポートし、翌朝の目覚めを改善する助けになります。
                  <strong className="block mt-2">
                    科学的に効果が確認された成分を選ぶことで、自然な睡眠リズムを取り戻すことができます。
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 睡眠改善に効果的な成分 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary-900 mb-6">
            睡眠改善に効果的な主要成分
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* メラトニン */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                メラトニン
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: S（最高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                睡眠ホルモンとして知られ、体内時計の調整に重要。入眠時間の短縮と時差ボケ改善に最も効果が実証されている成分です。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  就寝30分〜1時間前に0.5〜5mg（低用量から開始推奨）
                </p>
              </div>
              <Link
                href="/ingredients/melatonin"
                className="text-primary hover:underline text-sm font-semibold"
              >
                メラトニンの詳細を見る →
              </Link>
            </div>

            {/* マグネシウム */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                マグネシウム
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: A（高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                神経系のリラックスを促進し、睡眠の質を向上。GABA受容体を活性化し、深い眠りをサポートします。グリシン酸マグネシウムが吸収率良好。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  就寝1〜2時間前に200〜400mg（グリシン酸塩またはクエン酸塩）
                </p>
              </div>
              <Link
                href="/ingredients/magnesium"
                className="text-primary hover:underline text-sm font-semibold"
              >
                マグネシウムの詳細を見る →
              </Link>
            </div>

            {/* L-テアニン */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                L-テアニン
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: A（高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                緑茶に含まれるアミノ酸。リラックス効果を持ちながら眠気を引き起こさず、睡眠の質を向上。ストレス軽減にも有効です。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  就寝前に200〜400mg（日中のストレス軽減には100〜200mg）
                </p>
              </div>
              <Link
                href="/ingredients/l-theanine"
                className="text-primary hover:underline text-sm font-semibold"
              >
                L-テアニンの詳細を見る →
              </Link>
            </div>

            {/* グリシン */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                グリシン
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: A（高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                抑制性神経伝達物質。体温を下げて深部睡眠を促進し、睡眠の質と翌朝の疲労感改善に効果が確認されています。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  就寝前に3g（粉末を水に溶かして摂取）
                </p>
              </div>
              <Link
                href="/ingredients/glycine"
                className="text-primary hover:underline text-sm font-semibold"
              >
                グリシンの詳細を見る →
              </Link>
            </div>

            {/* GABA */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                GABA（γ-アミノ酪酸）
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: B（中）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                主要な抑制性神経伝達物質。リラックス効果と抗不安作用があり、入眠をスムーズにします。経口摂取での脳への到達は限定的との指摘もあります。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  就寝前に100〜300mg（ストレス軽減には50〜100mg）
                </p>
              </div>
              <Link
                href="/ingredients/gaba"
                className="text-primary hover:underline text-sm font-semibold"
              >
                GABAの詳細を見る →
              </Link>
            </div>

            {/* バレリアン */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                バレリアン（セイヨウカノコソウ）
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: B（中）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                伝統的な睡眠ハーブ。GABA濃度を高める作用があり、入眠時間の短縮と睡眠の質向上に効果。ただし個人差が大きい。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  就寝1〜2時間前に300〜600mg（抽出物として）
                </p>
              </div>
              <Link
                href="/ingredients/valerian"
                className="text-primary hover:underline text-sm font-semibold"
              >
                バレリアンの詳細を見る →
              </Link>
            </div>
          </div>
        </section>

        {/* 組み合わせのススメ */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary-900 mb-6">
            相乗効果のある組み合わせ
          </h2>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-indigo-900 mb-4">
              🌙 ベストコンビネーション
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-bold text-primary-900 mb-2">
                  メラトニン + マグネシウム
                </h4>
                <p className="text-sm text-primary-700">
                  入眠促進と深い眠りの両方をサポート。メラトニンが睡眠リズムを整え、マグネシウムが神経をリラックスさせます。
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-bold text-primary-900 mb-2">
                  L-テアニン + グリシン
                </h4>
                <p className="text-sm text-primary-700">
                  リラックス効果と深部睡眠促進のダブルアプローチ。ストレス軽減と睡眠の質向上に最適。
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-bold text-primary-900 mb-2">
                  マグネシウム + ビタミンB6
                </h4>
                <p className="text-sm text-primary-700">
                  マグネシウムの吸収を高め、神経伝達物質の合成をサポート。相乗効果で睡眠の質を向上。
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
                    睡眠衛生も重要
                  </h3>
                  <p className="text-sm text-amber-800">
                    サプリメントは補助です。規則正しい就寝時間、適度な運動、就寝前のブルーライト制限などの睡眠衛生も並行して改善しましょう。
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 mb-1">
                    メラトニンは低用量から
                  </h3>
                  <p className="text-sm text-amber-800">
                    メラトニンは0.5mgでも効果があります。高用量（5mg以上）は翌朝の眠気や頭痛を引き起こす可能性があります。
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 mb-1">
                    睡眠薬との併用は医師に相談
                  </h3>
                  <p className="text-sm text-amber-800">
                    処方睡眠薬や抗不安薬と併用する場合は、必ず医師に相談してください。相互作用により過度の鎮静作用が起こる可能性があります。
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
