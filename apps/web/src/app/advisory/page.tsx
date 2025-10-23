import { Metadata } from "next";
import { Database, BookOpen, RefreshCw, Shield, Bot, User } from "lucide-react";

export const metadata: Metadata = {
  title: "情報ソースと方針 - サプティア",
  description:
    "サプティアの運営体制、データソース、エビデンス評価基準、情報更新方針について。",
};

export default function AdvisoryPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">情報ソースと方針</h1>
        <p className="text-xl text-muted-foreground">
          サプティアの運営体制と科学的根拠に基づく情報提供について
        </p>
      </div>

      {/* 運営体制 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">運営体制</h2>
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
          <p className="text-sm">
            <strong>透明性へのコミットメント:</strong>{" "}
            サプティアは個人運営者とAI技術を活用したサプリメント比較・検索プラットフォームです。
            専門家による直接的な監修は行っておりませんが、査読済み論文や公的機関の信頼できる情報源のみを参照し、
            科学的根拠に基づいた情報提供を心がけています。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <User className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">個人運営</h3>
            <p className="text-sm text-muted-foreground">
              サプティアは個人が運営するプラットフォームです。
              情報の収集、整理、サイト構築をすべて個人で行い、中立的な視点でのサプリメント比較を提供しています。
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">AI技術の活用</h3>
            <p className="text-sm text-muted-foreground">
              データ収集、分析、コンテンツ生成にAI技術を活用しています。
              ただし、すべての情報は信頼できる学術論文や公的機関のデータに基づいており、AIが独自に判断した内容は含まれていません。
            </p>
          </div>
        </div>
      </section>

      {/* 科学的アプローチ */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">科学的アプローチ</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">エビデンスベース</h3>
            <p className="text-sm text-muted-foreground">
              査読済み科学論文、臨床試験データに基づく情報のみを掲載
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">信頼できる情報源</h3>
            <p className="text-sm text-muted-foreground">
              PubMed、Cochrane、厚生労働省など公的機関のデータを参照
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <RefreshCw className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">継続的更新</h3>
            <p className="text-sm text-muted-foreground">
              最新の研究結果を反映し、定期的に情報を更新
            </p>
          </div>
        </div>
      </section>

      {/* データソース */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">データソース</h2>
        <p className="text-muted-foreground mb-6">
          サプティアは、以下の信頼できるデータソースから情報を収集しています：
        </p>

        <div className="space-y-6">
          {/* 学術データベース */}
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">学術データベース</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">PubMed / MEDLINE</p>
                  <p className="text-sm text-muted-foreground">
                    米国国立医学図書館の生物医学文献データベース
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">Google Scholar</p>
                  <p className="text-sm text-muted-foreground">
                    学術文献検索エンジン
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">Cochrane Library</p>
                  <p className="text-sm text-muted-foreground">
                    システマティックレビューのデータベース
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">ClinicalTrials.gov</p>
                  <p className="text-sm text-muted-foreground">
                    臨床試験登録データベース
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 公的機関 */}
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">公的機関・規制当局</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">FDA (米国食品医薬品局)</p>
                  <p className="text-sm text-muted-foreground">
                    サプリメントの安全性情報
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">厚生労働省</p>
                  <p className="text-sm text-muted-foreground">
                    日本の健康食品に関する情報
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">EFSA (欧州食品安全機関)</p>
                  <p className="text-sm text-muted-foreground">
                    ヨーロッパの食品安全評価
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">NIH (米国国立衛生研究所)</p>
                  <p className="text-sm text-muted-foreground">
                    栄養補助食品に関する研究情報
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 第三者認証機関 */}
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">第三者認証機関</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">NSF International</p>
                  <p className="text-sm text-muted-foreground">
                    製品品質・安全性認証
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">USP (米国薬局方)</p>
                  <p className="text-sm text-muted-foreground">品質基準認証</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">ConsumerLab</p>
                  <p className="text-sm text-muted-foreground">
                    独立した製品試験
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">
                    Informed Choice / Informed Sport
                  </p>
                  <p className="text-sm text-muted-foreground">
                    禁止物質検査認証
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 専門機関・研究データベース */}
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">
              専門機関・研究データベース
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">Examine.com</p>
                  <p className="text-sm text-muted-foreground">
                    栄養補助食品の独立研究データベース
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">日本栄養・食糧学会</p>
                  <p className="text-sm text-muted-foreground">
                    栄養学の学術情報
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* エビデンスレベル */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">エビデンスレベルの評価基準</h2>
        <p className="text-muted-foreground mb-6">
          サプティアでは、以下の基準で科学的エビデンスのレベルを評価しています：
        </p>

        <div className="space-y-4">
          <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 p-4 rounded">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-bold text-green-700 dark:text-green-400">
                レベルS / A:
              </span>
              <span className="font-semibold">強力なエビデンス</span>
            </div>
            <p className="text-sm text-muted-foreground">
              複数のランダム化比較試験（RCT）またはメタアナリシスによる一貫した結果。
              大規模なコホート研究による裏付けがある。
            </p>
          </div>

          <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-4 rounded">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-bold text-blue-700 dark:text-blue-400">
                レベルB:
              </span>
              <span className="font-semibold">中程度のエビデンス</span>
            </div>
            <p className="text-sm text-muted-foreground">
              限られた数のRCTまたは質の高い観察研究による結果。
              一定の科学的合意がある。
            </p>
          </div>

          <div className="border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-4 rounded">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-bold text-amber-700 dark:text-amber-400">
                レベルC:
              </span>
              <span className="font-semibold">限定的なエビデンス</span>
            </div>
            <p className="text-sm text-muted-foreground">
              小規模研究、動物実験、または矛盾する研究結果。
              更なる研究が必要とされる段階。
            </p>
          </div>

          <div className="border-l-4 border-gray-500 bg-gray-50 dark:bg-gray-950/20 p-4 rounded">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-bold text-gray-700 dark:text-gray-400">
                レベルD:
              </span>
              <span className="font-semibold">エビデンス不足</span>
            </div>
            <p className="text-sm text-muted-foreground">
              理論的根拠、予備的研究、または in vitro 研究のみ。
              ヒトでの効果は未確認。
            </p>
          </div>
        </div>
      </section>

      {/* 参考文献ポリシー */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">参考文献ポリシー</h2>
        <div className="border rounded-lg p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">引用基準</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>査読済み（peer-reviewed）の学術論文を優先</li>
              <li>発表年が新しい研究を重視（ただし古典的研究も考慮）</li>
              <li>研究デザイン、サンプルサイズ、バイアスリスクを評価</li>
              <li>利益相反の可能性を明示</li>
              <li>公的機関や規制当局の公式情報を重視</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">更新頻度</h3>
            <p className="text-sm text-muted-foreground">
              新しい重要な研究結果が発表された場合、または年1回の定期レビューにより、情報を更新します。
              最終更新日は各ページに表示されます。
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">参考文献の表示</h3>
            <p className="text-sm text-muted-foreground">
              各製品ページおよび成分ページには、根拠となる研究論文のリストを掲載し、
              PubMedやDOIへのリンクを提供します。すべての情報源を確認できるようにしています。
            </p>
          </div>
        </div>
      </section>

      {/* 免責事項 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">重要な免責事項</h2>
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-3 text-sm">
              <p>
                <strong>医療アドバイスではありません:</strong>{" "}
                サプティアの情報は、医療専門家による診断、治療、助言の代わりとなるものではありません。
                サプリメントの使用前には、必ず医師または薬剤師にご相談ください。
              </p>
              <p>
                <strong>個人運営による限界:</strong>{" "}
                専門家による直接的な監修は行っておりません。
                情報の正確性には最大限注意を払っていますが、医学的判断が必要な場合は必ず医療機関を受診してください。
              </p>
              <p>
                <strong>情報の変更:</strong>{" "}
                科学的知見は日々更新されます。新しい研究結果により、
                過去の情報が変更される可能性があることをご理解ください。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* お問い合わせ */}
      <section>
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">ご質問・ご意見</h2>
          <p className="text-muted-foreground mb-6">
            情報の正確性に関するご指摘や、ご質問がありましたらお気軽にお問い合わせください。
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            お問い合わせ
          </a>
        </div>
      </section>
    </div>
  );
}
