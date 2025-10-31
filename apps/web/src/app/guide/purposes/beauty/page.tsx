import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, CheckCircle, AlertCircle, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title:
    "美肌・美容サプリガイド｜科学的根拠に基づく美容サプリの選び方 - サプティア",
  description:
    "肌のハリ・ツヤ、アンチエイジング、美白に効果的なサプリメントを科学的根拠に基づいて解説。コラーゲン、ビタミンC、ビタミンE、アスタキサンチンなど、本当に効果のある美容サプリの選び方。",
  keywords: [
    "美肌",
    "美容サプリ",
    "コラーゲン",
    "ビタミンC",
    "アンチエイジング",
    "美白",
  ],
};

export default function BeautyGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ヒーローセクション */}
      <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
        <div className="mx-auto px-6 lg:px-12 xl:px-16 py-16 max-w-[1200px]">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-white/10 rounded-xl">
              <Sparkles size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              美肌・美容サプリガイド
            </h1>
          </div>
          <p className="text-xl text-pink-100 max-w-3xl">
            科学的根拠に基づいて、本当に効果のある美容サプリメントを選びましょう。
            <br />
            内側からの美容ケアで、ハリ・ツヤのある健康的な肌を手に入れる。
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
                  美容サプリの基礎知識
                </h2>
                <p className="text-blue-800">
                  美肌を目指すには、外側からのスキンケアだけでなく、内側からの栄養補給も重要です。
                  肌は体の最も外側にある臓器であり、栄養が届くのは最後になりがちです。
                  <strong className="block mt-2">
                    サプリメントで適切な栄養を補給することで、肌のハリ、ツヤ、透明感をサポートできます。
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 美容に効果的な成分 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary-900 mb-6">
            美容に効果的な主要成分
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* コラーゲン */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                コラーゲン
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: A（高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                肌のハリと弾力を保つタンパク質。経口摂取で肌の水分量とハリが改善されることが複数の研究で確認されています。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  1日 2.5〜10g（ペプチドタイプが吸収されやすい）
                </p>
              </div>
              <Link
                href="/ingredients/collagen"
                className="text-primary hover:underline text-sm font-semibold"
              >
                コラーゲンの詳細を見る →
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
                コラーゲン生成に不可欠な栄養素。抗酸化作用で紫外線ダメージから肌を守り、メラニン生成を抑制して美白効果も期待できます。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  1日 100〜1000mg（美容目的は500〜1000mg）
                </p>
              </div>
              <Link
                href="/ingredients/vitamin-c"
                className="text-primary hover:underline text-sm font-semibold"
              >
                ビタミンCの詳細を見る →
              </Link>
            </div>

            {/* ビタミンE */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                ビタミンE
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: A（高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                強力な抗酸化作用で老化を防ぎ、肌のバリア機能を強化。ビタミンCと一緒に摂ると相乗効果があります。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  1日 100〜400mg（上限800mg）
                </p>
              </div>
              <Link
                href="/ingredients/vitamin-e"
                className="text-primary hover:underline text-sm font-semibold"
              >
                ビタミンEの詳細を見る →
              </Link>
            </div>

            {/* アスタキサンチン */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                アスタキサンチン
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: A（高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                ビタミンCの6000倍の抗酸化力。肌の水分量増加、シワ改善、紫外線ダメージ軽減効果が研究で確認されています。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  1日 4〜12mg（美容目的は6〜12mg）
                </p>
              </div>
              <Link
                href="/ingredients/astaxanthin"
                className="text-primary hover:underline text-sm font-semibold"
              >
                アスタキサンチンの詳細を見る →
              </Link>
            </div>

            {/* ビオチン */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                ビオチン（ビタミンB7）
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: A（高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                「美容ビタミン」として知られ、肌・髪・爪の健康維持に重要。細胞の成長と分裂を促進し、肌のターンオーバーをサポートします。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  1日 50〜300μg（美容目的は100〜300μg）
                </p>
              </div>
              <Link
                href="/ingredients/biotin"
                className="text-primary hover:underline text-sm font-semibold"
              >
                ビオチンの詳細を見る →
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
                肌の修復・再生に必要なミネラル。コラーゲン合成、抗炎症作用、皮脂コントロールに関与し、ニキビケアにも効果的です。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  1日 8〜15mg（上限40mg）
                </p>
              </div>
              <Link
                href="/ingredients/zinc"
                className="text-primary hover:underline text-sm font-semibold"
              >
                亜鉛の詳細を見る →
              </Link>
            </div>
          </div>
        </section>

        {/* 組み合わせのススメ */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary-900 mb-6">
            相乗効果のある組み合わせ
          </h2>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-purple-900 mb-4">
              💎 ゴールデンコンビネーション
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-bold text-primary-900 mb-2">
                  コラーゲン + ビタミンC
                </h4>
                <p className="text-sm text-primary-700">
                  ビタミンCはコラーゲンの合成に必須。一緒に摂ることでコラーゲンの効果が最大化されます。
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-bold text-primary-900 mb-2">
                  ビタミンC + ビタミンE
                </h4>
                <p className="text-sm text-primary-700">
                  ビタミンEの抗酸化作用をビタミンCが再生。相乗効果で強力なアンチエイジング効果。
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-bold text-primary-900 mb-2">
                  アスタキサンチン + ビタミンC
                </h4>
                <p className="text-sm text-primary-700">
                  紫外線ダメージから肌を守る最強の組み合わせ。日焼け対策としても有効。
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
                    即効性は期待しない
                  </h3>
                  <p className="text-sm text-amber-800">
                    肌のターンオーバーは約28日周期。最低でも2〜3ヶ月は継続しましょう。
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 mb-1">
                    過剰摂取に注意
                  </h3>
                  <p className="text-sm text-amber-800">
                    ビタミンA、ビタミンE、亜鉛などは上限量があります。必ず推奨量を守りましょう。
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 mb-1">
                    妊娠中・授乳中は医師に相談
                  </h3>
                  <p className="text-sm text-amber-800">
                    特にビタミンAは催奇形性があるため、妊娠中は摂取を避けてください。
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
