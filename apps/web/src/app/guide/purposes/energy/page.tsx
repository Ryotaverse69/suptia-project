import { Metadata } from "next";
import Link from "next/link";
import { Zap, CheckCircle, AlertCircle, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title:
    "疲労回復・エナジーサプリガイド｜科学的根拠に基づくエネルギー向上サプリの選び方 - サプティア",
  description:
    "疲労回復、エネルギー増強、スタミナ向上に効果的なサプリメントを科学的根拠に基づいて解説。CoQ10、ビタミンB群、鉄、マグネシウムなど、本当に効果のあるエナジーサプリの選び方。",
  keywords: [
    "疲労回復",
    "エナジーサプリ",
    "CoQ10",
    "ビタミンB",
    "鉄分",
    "アシュワガンダ",
    "エネルギー",
  ],
};

export default function EnergyGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ヒーローセクション */}
      <div className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white">
        <div className="mx-auto px-6 lg:px-12 xl:px-16 py-16 max-w-[1200px]">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-white/10 rounded-xl">
              <Zap size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              疲労回復・エナジーサプリガイド
            </h1>
          </div>
          <p className="text-xl text-amber-100 max-w-3xl">
            科学的根拠に基づいて、本当に効果のあるエナジーサプリメントを選びましょう。
            <br />
            慢性疲労から解放され、毎日を活力あふれる状態で過ごす。
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
                  エナジーサプリの基礎知識
                </h2>
                <p className="text-blue-800">
                  慢性的な疲労やエネルギー不足は、現代人に非常に多い悩みです。
                  原因は栄養不足、睡眠不足、ストレス、運動不足など多岐にわたりますが、適切なサプリメントでエネルギー代謝を最適化し、疲労回復を促進できます。
                  <strong className="block mt-2">
                    科学的に効果が実証された成分を選ぶことで、持続的なエネルギーと活力を取り戻すことができます。
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 疲労回復に効果的な成分 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary-900 mb-6">
            疲労回復に効果的な主要成分
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* CoQ10 */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                CoQ10（コエンザイムQ10）
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: A（高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                細胞のエネルギー工場であるミトコンドリアで働く補酵素。慢性疲労症候群の症状を改善し、運動後の疲労回復を促進します。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  1日 100〜300mg（食事と一緒に、ユビキノール型が吸収良好）
                </p>
              </div>
              <Link
                href="/ingredients/coq10"
                className="text-primary hover:underline text-sm font-semibold"
              >
                CoQ10の詳細を見る →
              </Link>
            </div>

            {/* ビタミンB群 */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                ビタミンB群（B1, B2, B6, B12）
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: S（最高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                エネルギー代謝に不可欠な補酵素。特にビタミンB12は神経機能と赤血球生成に重要で、不足すると慢性疲労の原因になります。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  B12: 500〜1000μg / B複合体: 50〜100mg（活性型推奨）
                </p>
              </div>
              <Link
                href="/ingredients/vitamin-b-complex"
                className="text-primary hover:underline text-sm font-semibold"
              >
                ビタミンB群の詳細を見る →
              </Link>
            </div>

            {/* 鉄 */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                鉄（ヘム鉄）
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: S（最高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                酸素を全身に運ぶヘモグロビンの主成分。鉄欠乏性貧血は疲労の最も一般的な原因の一つ。特に女性は不足しやすい。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  男性: 8〜15mg / 女性: 18〜30mg（ヘム鉄が吸収良好）
                </p>
              </div>
              <Link
                href="/ingredients/iron"
                className="text-primary hover:underline text-sm font-semibold"
              >
                鉄の詳細を見る →
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
                300以上の酵素反応に関与し、ATP（エネルギー通貨）の生成に必須。不足すると疲労感、筋肉痛、睡眠障害を引き起こします。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  1日 300〜500mg（クエン酸塩またはグリシン酸塩）
                </p>
              </div>
              <Link
                href="/ingredients/magnesium"
                className="text-primary hover:underline text-sm font-semibold"
              >
                マグネシウムの詳細を見る →
              </Link>
            </div>

            {/* アシュワガンダ */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                アシュワガンダ
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: A（高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                アダプトゲンハーブの王様。ストレスホルモン（コルチゾール）を正常化し、慢性疲労とストレスによるエネルギー低下を改善します。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  1日 300〜600mg（KSM-66またはSensoril抽出物、朝食後推奨）
                </p>
              </div>
              <Link
                href="/ingredients/ashwagandha"
                className="text-primary hover:underline text-sm font-semibold"
              >
                アシュワガンダの詳細を見る →
              </Link>
            </div>

            {/* ロディオラ */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                ロディオラ・ロゼア
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: A（高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                ストレス適応性ハーブ。精神的・肉体的疲労を軽減し、集中力と持久力を向上。特に急性ストレス下でのパフォーマンス改善に効果的です。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  1日 200〜600mg（ロザビンとサリドロサイド3%標準化、朝摂取）
                </p>
              </div>
              <Link
                href="/ingredients/rhodiola"
                className="text-primary hover:underline text-sm font-semibold"
              >
                ロディオラの詳細を見る →
              </Link>
            </div>
          </div>
        </section>

        {/* 組み合わせのススメ */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary-900 mb-6">
            相乗効果のある組み合わせ
          </h2>

          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-amber-900 mb-4">
              ⚡ エネルギー最大化コンビネーション
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-bold text-primary-900 mb-2">
                  CoQ10 + ビタミンB群
                </h4>
                <p className="text-sm text-primary-700">
                  細胞レベルでのエネルギー生成を最大化。CoQ10がミトコンドリアの効率を高め、ビタミンBがエネルギー代謝を促進します。
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-bold text-primary-900 mb-2">
                  鉄 + ビタミンC
                </h4>
                <p className="text-sm text-primary-700">
                  鉄の吸収をビタミンCが3〜4倍向上。貧血予防と改善に最適な組み合わせ。
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-bold text-primary-900 mb-2">
                  アシュワガンダ + マグネシウム
                </h4>
                <p className="text-sm text-primary-700">
                  ストレス軽減と深い眠りのダブル効果。日中のストレス対応力を高め、夜の睡眠の質を向上させます。
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
                    原因を特定することが重要
                  </h3>
                  <p className="text-sm text-amber-800">
                    慢性疲労の原因は多様です。甲状腺機能低下症、慢性疲労症候群、睡眠時無呼吸症候群などの可能性があれば、医師の診断を受けましょう。
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 mb-1">
                    鉄は過剰摂取に注意
                  </h3>
                  <p className="text-sm text-amber-800">
                    鉄の過剰摂取は酸化ストレスを引き起こし、臓器に蓄積する可能性があります。血液検査でフェリチン値を確認してから摂取しましょう。
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 mb-1">
                    カフェインに依存しない
                  </h3>
                  <p className="text-sm text-amber-800">
                    カフェインは一時的なエネルギーブーストを提供しますが、長期的には疲労を悪化させます。根本的なエネルギー代謝の改善を目指しましょう。
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
