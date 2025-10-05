import { Metadata } from "next";
import { Building2, Mail, MapPin, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "運営会社について - サプティア",
  description: "サプティアの運営会社情報をご紹介します。",
};

export default function CompanyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">運営会社について</h1>

      <div className="prose prose-slate max-w-none">
        {/* 会社概要 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">会社概要</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="bg-primary-50 font-semibold p-4 w-48">
                    会社名
                  </td>
                  <td className="p-4">[会社名]</td>
                </tr>
                <tr className="border-b">
                  <td className="bg-primary-50 font-semibold p-4">代表者名</td>
                  <td className="p-4">[代表者名]</td>
                </tr>
                <tr className="border-b">
                  <td className="bg-primary-50 font-semibold p-4">所在地</td>
                  <td className="p-4">
                    <div className="flex items-start gap-2">
                      <MapPin size={18} className="mt-1 text-primary" />
                      <div>
                        <div>[郵便番号]</div>
                        <div>[都道府県市区町村]</div>
                        <div>[番地・建物名]</div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="bg-primary-50 font-semibold p-4">設立</td>
                  <td className="p-4">[設立年月日]</td>
                </tr>
                <tr className="border-b">
                  <td className="bg-primary-50 font-semibold p-4">資本金</td>
                  <td className="p-4">[資本金]</td>
                </tr>
                <tr className="border-b">
                  <td className="bg-primary-50 font-semibold p-4">事業内容</td>
                  <td className="p-4">
                    <ul className="list-disc list-inside space-y-1">
                      <li>サプリメント比較・検索プラットフォームの運営</li>
                      <li>健康・ウェルネス関連情報の提供</li>
                      <li>Webメディアの企画・運営</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="bg-primary-50 font-semibold p-4">
                    お問い合わせ
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Mail size={18} className="text-primary" />
                      <a
                        href="/contact"
                        className="text-primary hover:underline"
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
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">私たちのミッション</h2>
          <div className="bg-gradient-to-br from-primary-50 to-accent-mint/10 rounded-lg p-8">
            <p className="text-lg font-semibold text-primary-900 mb-4">
              科学的根拠に基づいた情報で、すべての人の健康的な生活をサポートする
            </p>
            <p className="text-primary-700">
              サプリメント市場には膨大な製品が存在し、消費者は何を選べば良いのか分からない状況にあります。
              私たちは科学的根拠に基づいた中立的な情報を提供することで、一人ひとりが自分に最適なサプリメントを選択できる環境を作ることを目指しています。
            </p>
          </div>
        </section>

        {/* ビジョン */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">ビジョン</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary">
                  <Users size={20} />
                </div>
                <h3 className="text-xl font-bold text-primary-900">透明性</h3>
              </div>
              <p className="text-primary-700">
                すべての評価基準、データソース、アフィリエイト関係を公開し、透明性を保ちます。
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-mint/20 text-accent-mint">
                  <Building2 size={20} />
                </div>
                <h3 className="text-xl font-bold text-primary-900">中立性</h3>
              </div>
              <p className="text-primary-700">
                特定メーカーとの利害関係を持たず、科学的根拠のみに基づいた評価を行います。
              </p>
            </div>
          </div>
        </section>

        {/* バリュー */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">私たちの価値観</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-bold text-primary-900 mb-2">
                科学的根拠を最優先
              </h3>
              <p className="text-primary-700">
                すべての情報は査読済み論文など信頼できるソースに基づいています。
              </p>
            </div>

            <div className="border-l-4 border-accent-mint pl-4">
              <h3 className="font-bold text-primary-900 mb-2">
                ユーザーファースト
              </h3>
              <p className="text-primary-700">
                広告主ではなく、ユーザーの健康と利益を最優先に考えます。
              </p>
            </div>

            <div className="border-l-4 border-accent-purple pl-4">
              <h3 className="font-bold text-primary-900 mb-2">継続的改善</h3>
              <p className="text-primary-700">
                最新の研究結果を反映し、常にサービスの質を向上させ続けます。
              </p>
            </div>
          </div>
        </section>

        {/* 注意書き */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mt-8">
          <p className="text-sm">
            <span className="font-semibold">⚠️ 注意事項:</span>
            本ページの [ ]
            内の情報は、実際の会社情報に置き換える必要があります。
          </p>
        </div>
      </div>
    </div>
  );
}
