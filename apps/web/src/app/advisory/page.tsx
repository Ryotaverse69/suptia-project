import { Metadata } from "next";
import { GraduationCap, Award, BookOpen, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "研究・監修者情報 - サプティア",
  description: "サプティアの科学的根拠、監修者、データソースについて。",
};

export default function AdvisoryPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">研究・監修者情報</h1>
        <p className="text-xl text-muted-foreground">
          科学的根拠に基づく信頼性の高い情報提供のために
        </p>
      </div>

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
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">専門家監修</h3>
            <p className="text-sm text-muted-foreground">
              栄養学、薬学、医学の専門家による内容監修
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">継続的更新</h3>
            <p className="text-sm text-muted-foreground">
              最新の研究結果を反映し、定期的に情報を更新
            </p>
          </div>
        </div>
      </section>

      {/* 監修者（プレースホルダー） */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">監修者・アドバイザー</h2>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <p className="text-sm">
            <strong>📢 募集中:</strong>
            現在、栄養学、薬学、医学、バイオケミストリー分野の専門家を監修者として募集しています。
            ご興味のある方は
            <a href="/contact" className="text-primary hover:underline">
              お問い合わせフォーム
            </a>
            よりご連絡ください。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* プレースホルダー監修者カード */}
          <div className="border rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold">
                TBD
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">[監修者名]</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  [専門分野] | [所属機関]
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  [経歴・専門性の説明]
                </p>
                <div className="text-xs text-muted-foreground">
                  <strong>専門領域:</strong> [栄養学、薬学、医学など]
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold">
                TBD
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">[監修者名]</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  [専門分野] | [所属機関]
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  [経歴・専門性の説明]
                </p>
                <div className="text-xs text-muted-foreground">
                  <strong>専門領域:</strong> [栄養学、薬学、医学など]
                </div>
              </div>
            </div>
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
                <ExternalLink className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">PubMed / MEDLINE</p>
                  <p className="text-sm text-muted-foreground">
                    米国国立医学図書館の生物医学文献データベース
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ExternalLink className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Google Scholar</p>
                  <p className="text-sm text-muted-foreground">
                    学術文献検索エンジン
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ExternalLink className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Cochrane Library</p>
                  <p className="text-sm text-muted-foreground">
                    システマティックレビューのデータベース
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ExternalLink className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
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
                <ExternalLink className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">FDA (米国食品医薬品局)</p>
                  <p className="text-sm text-muted-foreground">
                    サプリメントの安全性情報
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ExternalLink className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">厚生労働省</p>
                  <p className="text-sm text-muted-foreground">
                    日本の健康食品に関する情報
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ExternalLink className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">EFSA (欧州食品安全機関)</p>
                  <p className="text-sm text-muted-foreground">
                    ヨーロッパの食品安全評価
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ExternalLink className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
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
                <Award className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">NSF International</p>
                  <p className="text-sm text-muted-foreground">
                    製品品質・安全性認証
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Award className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">USP (米国薬局方)</p>
                  <p className="text-sm text-muted-foreground">品質基準認証</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Award className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">ConsumerLab</p>
                  <p className="text-sm text-muted-foreground">
                    独立した製品試験
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Award className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
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

          {/* 専門機関・学会 */}
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">専門機関・学会</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Examine.com</p>
                  <p className="text-sm text-muted-foreground">
                    栄養補助食品の独立研究データベース
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">日本栄養・食糧学会</p>
                  <p className="text-sm text-muted-foreground">
                    栄養学の専門学会
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
                レベルA:
              </span>
              <span className="font-semibold">強力なエビデンス</span>
            </div>
            <p className="text-sm text-muted-foreground">
              複数のランダム化比較試験（RCT）またはメタアナリシスによる一貫した結果
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
              限られた数のRCTまたは質の高い観察研究による結果
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
              小規模研究、動物実験、または矛盾する研究結果
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
              専門家の意見、理論的根拠、または予備的研究のみ
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
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">更新頻度</h3>
            <p className="text-sm text-muted-foreground">
              新しい重要な研究結果が発表された場合、または年1回の定期レビューにより、情報を更新します。
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">参考文献の表示</h3>
            <p className="text-sm text-muted-foreground">
              各製品ページおよび成分ページには、根拠となる研究論文のリストを掲載し、PubMedへのリンクを提供します。
            </p>
          </div>
        </div>
      </section>

      {/* お問い合わせ */}
      <section>
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">監修者・専門家の募集</h2>
          <p className="text-muted-foreground mb-6">
            栄養学、薬学、医学分野の専門家の方で、監修者としてご協力いただける方を募集しています。
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
