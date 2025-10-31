import { Metadata } from "next";
import Link from "next/link";
import { Dumbbell, CheckCircle, AlertCircle, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title:
    "筋肉増強・筋トレサプリガイド｜科学的根拠に基づくスポーツサプリの選び方 - サプティア",
  description:
    "筋力アップ、筋肥大、運動パフォーマンス向上に効果的なサプリメントを科学的根拠に基づいて解説。プロテイン、クレアチン、BCAA、HMBなど、本当に効果のある筋トレサプリの選び方。",
  keywords: [
    "筋トレ",
    "筋肉増強",
    "プロテイン",
    "クレアチン",
    "BCAA",
    "HMB",
    "筋力アップ",
  ],
};

export default function MuscleGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ヒーローセクション */}
      <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white">
        <div className="mx-auto px-6 lg:px-12 xl:px-16 py-16 max-w-[1200px]">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-white/10 rounded-xl">
              <Dumbbell size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              筋肉増強・筋トレサプリガイド
            </h1>
          </div>
          <p className="text-xl text-red-100 max-w-3xl">
            科学的根拠に基づいて、本当に効果のある筋トレサプリメントを選びましょう。
            <br />
            筋力アップ、筋肥大、運動パフォーマンスの向上を最大化する。
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
                  筋トレサプリの基礎知識
                </h2>
                <p className="text-blue-800">
                  筋肉を効率的に増やすには、適切なトレーニングに加えて、タンパク質や特定の栄養素を十分に摂取することが不可欠です。
                  食事だけでは不足しがちな栄養素をサプリメントで補うことで、筋肥大や筋力向上、回復速度の改善が期待できます。
                  <strong className="block mt-2">
                    科学的に効果が実証されたサプリメントを選ぶことが、トレーニング効果を最大化する鍵です。
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 筋肉増強に効果的な成分 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary-900 mb-6">
            筋肉増強に効果的な主要成分
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* プロテイン（ホエイ） */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                ホエイプロテイン
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: S（最高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                筋肉の材料となる必須アミノ酸を豊富に含み、吸収速度が速い。運動後の筋タンパク合成を最大化し、筋肥大効果が最も確実な成分。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  運動後30分以内に20〜25g（体重×0.3g程度）
                </p>
              </div>
              <Link
                href="/ingredients/whey-protein"
                className="text-primary hover:underline text-sm font-semibold"
              >
                ホエイプロテインの詳細を見る →
              </Link>
            </div>

            {/* クレアチン */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                クレアチン
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: S（最高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                筋力と瞬発力を向上させる最も研究されているサプリメント。筋肉内のATP再合成を促進し、高強度トレーニングのパフォーマンスを向上。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  1日 3〜5g（ローディング期は20g×5日間も可）
                </p>
              </div>
              <Link
                href="/ingredients/creatine"
                className="text-primary hover:underline text-sm font-semibold"
              >
                クレアチンの詳細を見る →
              </Link>
            </div>

            {/* BCAA */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                BCAA（分岐鎖アミノ酸）
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: A（高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                ロイシン、イソロイシン、バリンの3つの必須アミノ酸。筋タンパク分解を抑制し、運動中の疲労を軽減する効果があります。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  運動前・中に5〜10g（ロイシン比率2:1:1が理想）
                </p>
              </div>
              <Link
                href="/ingredients/bcaa"
                className="text-primary hover:underline text-sm font-semibold"
              >
                BCAAの詳細を見る →
              </Link>
            </div>

            {/* HMB */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                HMB（β-ヒドロキシ-β-メチル酪酸）
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: A（高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                ロイシンの代謝物質。筋タンパク分解を抑制し、筋損傷からの回復を促進。特にトレーニング初心者や減量期に効果的です。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  1日 3g（1gずつ3回に分けて摂取）
                </p>
              </div>
              <Link
                href="/ingredients/hmb"
                className="text-primary hover:underline text-sm font-semibold"
              >
                HMBの詳細を見る →
              </Link>
            </div>

            {/* ベータアラニン */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                ベータアラニン
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: A（高）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                筋肉内のカルノシン濃度を高め、乳酸の蓄積を遅らせる。60〜240秒の高強度運動のパフォーマンスを向上させます。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  1日 4〜6g（2〜4週間の継続で効果発現）
                </p>
              </div>
              <Link
                href="/ingredients/beta-alanine"
                className="text-primary hover:underline text-sm font-semibold"
              >
                ベータアラニンの詳細を見る →
              </Link>
            </div>

            {/* グルタミン */}
            <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                グルタミン
              </h3>
              <p className="text-primary-700 mb-4">
                <strong>エビデンスレベル: B（中）</strong>
              </p>
              <p className="text-primary-700 mb-4">
                体内で最も豊富なアミノ酸。激しいトレーニング後の免疫機能維持と筋肉回復をサポートし、オーバートレーニング予防に役立ちます。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-sm text-primary-900 mb-2">
                  推奨摂取量
                </h4>
                <p className="text-sm text-primary-700">
                  運動後に5〜10g（特にハードトレーニング時）
                </p>
              </div>
              <Link
                href="/ingredients/glutamine"
                className="text-primary hover:underline text-sm font-semibold"
              >
                グルタミンの詳細を見る →
              </Link>
            </div>
          </div>
        </section>

        {/* 組み合わせのススメ */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary-900 mb-6">
            相乗効果のある組み合わせ
          </h2>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-orange-900 mb-4">
              💪 ベストコンビネーション
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-bold text-primary-900 mb-2">
                  プロテイン + クレアチン
                </h4>
                <p className="text-sm text-primary-700">
                  筋肥大と筋力向上の両方を最大化する黄金の組み合わせ。プロテイン後にクレアチンを摂ることでクレアチンの吸収が向上します。
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-bold text-primary-900 mb-2">
                  BCAA + ベータアラニン
                </h4>
                <p className="text-sm text-primary-700">
                  運動中のエネルギー供給と疲労軽減を同時にサポート。高強度トレーニングのパフォーマンス向上に最適。
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-bold text-primary-900 mb-2">
                  プロテイン + HMB
                </h4>
                <p className="text-sm text-primary-700">
                  筋タンパク合成促進と筋タンパク分解抑制の両面からアプローチ。特に減量期やトレーニング初心者に効果的。
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
                    トレーニングが最優先
                  </h3>
                  <p className="text-sm text-amber-800">
                    サプリメントはトレーニングと適切な食事の補助です。サプリだけで筋肉は増えません。
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 mb-1">
                    クレアチンは水分補給を忘れずに
                  </h3>
                  <p className="text-sm text-amber-800">
                    クレアチンは筋肉に水分を引き込むため、十分な水分補給（1日3L以上）が必要です。
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 mb-1">
                    腎機能に問題がある方は医師に相談
                  </h3>
                  <p className="text-sm text-amber-800">
                    高タンパク食やクレアチンは腎臓に負担をかける可能性があります。腎疾患のある方は必ず医師に相談してください。
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
