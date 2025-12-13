import { Metadata } from "next";
import {
  Database,
  BookOpen,
  RefreshCw,
  Shield,
  Bot,
  User,
  ShieldCheck,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

export const metadata: Metadata = {
  title: "情報ソースと方針 - サプティア",
  description:
    "サプティアの運営体制、データソース、エビデンス評価基準、情報更新方針について。",
};

export default function AdvisoryPage() {
  return (
    <div
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
      className="min-h-screen"
    >
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="max-w-4xl mx-auto mb-12">
          <h1
            style={{ color: appleWebColors.textPrimary }}
            className="text-[34px] font-bold mb-4 leading-tight"
          >
            情報ソースと方針
          </h1>
          <p
            style={{ color: appleWebColors.textSecondary }}
            className="text-[17px] leading-[1.4]"
          >
            サプティアの運営体制と科学的根拠に基づく情報提供について
          </p>
        </div>

        {/* 運営体制 */}
        <section className="mb-16">
          <h2
            style={{ color: appleWebColors.textPrimary }}
            className="text-[28px] font-bold mb-8"
          >
            運営体制
          </h2>
          <div
            style={{
              backgroundColor: `${systemColors.blue}15`,
              borderColor: `${systemColors.blue}40`,
            }}
            className="border rounded-[16px] p-6 mb-6"
          >
            <p
              style={{ color: appleWebColors.textPrimary }}
              className="text-[15px] leading-[1.5]"
            >
              <strong>透明性へのコミットメント:</strong>{" "}
              サプティアは個人運営者とAI技術を活用したサプリメント比較・検索プラットフォームです。
              専門家による直接的な監修は行っておりませんが、査読済み論文や公的機関の信頼できる情報源のみを参照し、
              科学的根拠に基づいた情報提供を心がけています。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div
              className={`border rounded-[16px] p-6 shadow-sm hover:-translate-y-1 transition-all ${liquidGlassClasses.light}`}
              style={{
                borderColor: appleWebColors.borderSubtle,
              }}
            >
              <div
                style={{ backgroundColor: `${systemColors.blue}15` }}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
              >
                <User
                  style={{ color: systemColors.blue }}
                  className="w-6 h-6"
                />
              </div>
              <h3
                style={{ color: appleWebColors.textPrimary }}
                className="font-semibold text-[17px] mb-2"
              >
                個人運営
              </h3>
              <p
                style={{ color: appleWebColors.textSecondary }}
                className="text-[15px] leading-[1.5]"
              >
                サプティアは個人が運営するプラットフォームです。
                情報の収集、整理、サイト構築をすべて個人で行い、中立的な視点でのサプリメント比較を提供しています。
              </p>
            </div>
            <div
              className={`border rounded-[16px] p-6 shadow-sm hover:-translate-y-1 transition-all ${liquidGlassClasses.light}`}
              style={{
                borderColor: appleWebColors.borderSubtle,
              }}
            >
              <div
                style={{ backgroundColor: `${systemColors.purple}15` }}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
              >
                <Bot
                  style={{ color: systemColors.purple }}
                  className="w-6 h-6"
                />
              </div>
              <h3
                style={{ color: appleWebColors.textPrimary }}
                className="font-semibold text-[17px] mb-2"
              >
                AI技術の活用
              </h3>
              <p
                style={{ color: appleWebColors.textSecondary }}
                className="text-[15px] leading-[1.5]"
              >
                データ収集、分析、コンテンツ生成にAI技術を活用しています。
                ただし、すべての情報は信頼できる学術論文や公的機関のデータに基づいており、AIが独自に判断した内容は含まれていません。
              </p>
            </div>
          </div>
        </section>

        {/* 科学的アプローチ */}
        <section className="mb-16">
          <h2
            style={{ color: appleWebColors.textPrimary }}
            className="text-[28px] font-bold mb-8"
          >
            科学的アプローチ
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div
              className={`border rounded-[16px] p-6 shadow-sm hover:-translate-y-1 transition-all ${liquidGlassClasses.light}`}
              style={{
                borderColor: appleWebColors.borderSubtle,
              }}
            >
              <div
                style={{ backgroundColor: `${systemColors.green}15` }}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
              >
                <BookOpen
                  style={{ color: systemColors.green }}
                  className="w-6 h-6"
                />
              </div>
              <h3
                style={{ color: appleWebColors.textPrimary }}
                className="font-semibold text-[17px] mb-2"
              >
                エビデンスベース
              </h3>
              <p
                style={{ color: appleWebColors.textSecondary }}
                className="text-[15px] leading-[1.5]"
              >
                査読済み科学論文、臨床試験データに基づく情報のみを掲載
              </p>
            </div>
            <div
              className={`border rounded-[16px] p-6 shadow-sm hover:-translate-y-1 transition-all ${liquidGlassClasses.light}`}
              style={{
                borderColor: appleWebColors.borderSubtle,
              }}
            >
              <div
                style={{ backgroundColor: `${systemColors.blue}15` }}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
              >
                <Database
                  style={{ color: systemColors.blue }}
                  className="w-6 h-6"
                />
              </div>
              <h3
                style={{ color: appleWebColors.textPrimary }}
                className="font-semibold text-[17px] mb-2"
              >
                信頼できる情報源
              </h3>
              <p
                style={{ color: appleWebColors.textSecondary }}
                className="text-[15px] leading-[1.5]"
              >
                PubMed、Cochrane、厚生労働省など公的機関のデータを参照
              </p>
            </div>
            <div
              className={`border rounded-[16px] p-6 shadow-sm hover:-translate-y-1 transition-all ${liquidGlassClasses.light}`}
              style={{
                borderColor: appleWebColors.borderSubtle,
              }}
            >
              <div
                style={{ backgroundColor: `${systemColors.cyan}15` }}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
              >
                <RefreshCw
                  style={{ color: systemColors.cyan }}
                  className="w-6 h-6"
                />
              </div>
              <h3
                style={{ color: appleWebColors.textPrimary }}
                className="font-semibold text-[17px] mb-2"
              >
                継続的更新
              </h3>
              <p
                style={{ color: appleWebColors.textSecondary }}
                className="text-[15px] leading-[1.5]"
              >
                最新の研究結果を反映し、定期的に情報を更新
              </p>
            </div>
          </div>
        </section>

        {/* データソース */}
        <section className="mb-16">
          <h2
            style={{ color: appleWebColors.textPrimary }}
            className="text-[28px] font-bold mb-8"
          >
            データソース
          </h2>
          <p
            style={{ color: appleWebColors.textSecondary }}
            className="text-[17px] leading-[1.5] mb-6"
          >
            サプティアは、以下の信頼できるデータソースから情報を収集しています：
          </p>

          <div className="space-y-6">
            {/* 学術データベース */}
            <div
              className={`border rounded-[16px] p-6 shadow-sm hover:-translate-y-1 transition-all ${liquidGlassClasses.light}`}
              style={{
                borderColor: appleWebColors.borderSubtle,
              }}
            >
              <h3
                style={{ color: appleWebColors.textPrimary }}
                className="font-semibold text-[17px] mb-4"
              >
                学術データベース
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div
                    style={{ backgroundColor: systemColors.blue }}
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  ></div>
                  <div>
                    <p
                      style={{ color: appleWebColors.textPrimary }}
                      className="font-semibold text-[15px]"
                    >
                      PubMed / MEDLINE
                    </p>
                    <p
                      style={{ color: appleWebColors.textSecondary }}
                      className="text-[13px] leading-[1.4]"
                    >
                      米国国立医学図書館の生物医学文献データベース
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div
                    style={{ backgroundColor: systemColors.blue }}
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  ></div>
                  <div>
                    <p
                      style={{ color: appleWebColors.textPrimary }}
                      className="font-semibold text-[15px]"
                    >
                      Google Scholar
                    </p>
                    <p
                      style={{ color: appleWebColors.textSecondary }}
                      className="text-[13px] leading-[1.4]"
                    >
                      学術文献検索エンジン
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div
                    style={{ backgroundColor: systemColors.blue }}
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  ></div>
                  <div>
                    <p
                      style={{ color: appleWebColors.textPrimary }}
                      className="font-semibold text-[15px]"
                    >
                      Cochrane Library
                    </p>
                    <p
                      style={{ color: appleWebColors.textSecondary }}
                      className="text-[13px] leading-[1.4]"
                    >
                      システマティックレビューのデータベース
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div
                    style={{ backgroundColor: systemColors.blue }}
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  ></div>
                  <div>
                    <p
                      style={{ color: appleWebColors.textPrimary }}
                      className="font-semibold text-[15px]"
                    >
                      ClinicalTrials.gov
                    </p>
                    <p
                      style={{ color: appleWebColors.textSecondary }}
                      className="text-[13px] leading-[1.4]"
                    >
                      臨床試験登録データベース
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 公的機関 */}
            <div
              className={`border rounded-[16px] p-6 shadow-sm hover:-translate-y-1 transition-all ${liquidGlassClasses.light}`}
              style={{
                borderColor: appleWebColors.borderSubtle,
              }}
            >
              <h3
                style={{ color: appleWebColors.textPrimary }}
                className="font-semibold text-[17px] mb-4"
              >
                公的機関・規制当局
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div
                    style={{ backgroundColor: systemColors.green }}
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  ></div>
                  <div>
                    <p
                      style={{ color: appleWebColors.textPrimary }}
                      className="font-semibold text-[15px]"
                    >
                      FDA (米国食品医薬品局)
                    </p>
                    <p
                      style={{ color: appleWebColors.textSecondary }}
                      className="text-[13px] leading-[1.4]"
                    >
                      サプリメントの安全性情報
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div
                    style={{ backgroundColor: systemColors.green }}
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  ></div>
                  <div>
                    <p
                      style={{ color: appleWebColors.textPrimary }}
                      className="font-semibold text-[15px]"
                    >
                      厚生労働省
                    </p>
                    <p
                      style={{ color: appleWebColors.textSecondary }}
                      className="text-[13px] leading-[1.4]"
                    >
                      日本の健康食品に関する情報
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div
                    style={{ backgroundColor: systemColors.green }}
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  ></div>
                  <div>
                    <p
                      style={{ color: appleWebColors.textPrimary }}
                      className="font-semibold text-[15px]"
                    >
                      EFSA (欧州食品安全機関)
                    </p>
                    <p
                      style={{ color: appleWebColors.textSecondary }}
                      className="text-[13px] leading-[1.4]"
                    >
                      ヨーロッパの食品安全評価
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div
                    style={{ backgroundColor: systemColors.green }}
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  ></div>
                  <div>
                    <p
                      style={{ color: appleWebColors.textPrimary }}
                      className="font-semibold text-[15px]"
                    >
                      NIH (米国国立衛生研究所)
                    </p>
                    <p
                      style={{ color: appleWebColors.textSecondary }}
                      className="text-[13px] leading-[1.4]"
                    >
                      栄養補助食品に関する研究情報
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 第三者認証機関 */}
            <div
              className={`border rounded-[16px] p-6 shadow-sm hover:-translate-y-1 transition-all ${liquidGlassClasses.light}`}
              style={{
                borderColor: appleWebColors.borderSubtle,
              }}
            >
              <h3
                style={{ color: appleWebColors.textPrimary }}
                className="font-semibold text-[17px] mb-4"
              >
                第三者認証機関
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div
                    style={{ backgroundColor: systemColors.purple }}
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  ></div>
                  <div>
                    <p
                      style={{ color: appleWebColors.textPrimary }}
                      className="font-semibold text-[15px]"
                    >
                      NSF International
                    </p>
                    <p
                      style={{ color: appleWebColors.textSecondary }}
                      className="text-[13px] leading-[1.4]"
                    >
                      製品品質・安全性認証
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div
                    style={{ backgroundColor: systemColors.purple }}
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  ></div>
                  <div>
                    <p
                      style={{ color: appleWebColors.textPrimary }}
                      className="font-semibold text-[15px]"
                    >
                      USP (米国薬局方)
                    </p>
                    <p
                      style={{ color: appleWebColors.textSecondary }}
                      className="text-[13px] leading-[1.4]"
                    >
                      品質基準認証
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div
                    style={{ backgroundColor: systemColors.purple }}
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  ></div>
                  <div>
                    <p
                      style={{ color: appleWebColors.textPrimary }}
                      className="font-semibold text-[15px]"
                    >
                      ConsumerLab
                    </p>
                    <p
                      style={{ color: appleWebColors.textSecondary }}
                      className="text-[13px] leading-[1.4]"
                    >
                      独立した製品試験
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div
                    style={{ backgroundColor: systemColors.purple }}
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  ></div>
                  <div>
                    <p
                      style={{ color: appleWebColors.textPrimary }}
                      className="font-semibold text-[15px]"
                    >
                      Informed Choice / Informed Sport
                    </p>
                    <p
                      style={{ color: appleWebColors.textSecondary }}
                      className="text-[13px] leading-[1.4]"
                    >
                      禁止物質検査認証
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 専門機関・研究データベース */}
            <div
              className={`border rounded-[16px] p-6 shadow-sm hover:-translate-y-1 transition-all ${liquidGlassClasses.light}`}
              style={{
                borderColor: appleWebColors.borderSubtle,
              }}
            >
              <h3
                style={{ color: appleWebColors.textPrimary }}
                className="font-semibold text-[17px] mb-4"
              >
                専門機関・研究データベース
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div
                    style={{ backgroundColor: systemColors.cyan }}
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  ></div>
                  <div>
                    <p
                      style={{ color: appleWebColors.textPrimary }}
                      className="font-semibold text-[15px]"
                    >
                      Examine.com
                    </p>
                    <p
                      style={{ color: appleWebColors.textSecondary }}
                      className="text-[13px] leading-[1.4]"
                    >
                      栄養補助食品の独立研究データベース
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div
                    style={{ backgroundColor: systemColors.cyan }}
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  ></div>
                  <div>
                    <p
                      style={{ color: appleWebColors.textPrimary }}
                      className="font-semibold text-[15px]"
                    >
                      日本栄養・食糧学会
                    </p>
                    <p
                      style={{ color: appleWebColors.textSecondary }}
                      className="text-[13px] leading-[1.4]"
                    >
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
          <h2
            style={{ color: appleWebColors.textPrimary }}
            className="text-[28px] font-bold mb-8"
          >
            エビデンスレベルの評価基準
          </h2>
          <p
            style={{ color: appleWebColors.textSecondary }}
            className="text-[17px] leading-[1.5] mb-6"
          >
            サプティアでは、以下の基準で科学的エビデンスのレベルを評価しています：
          </p>

          <div className="space-y-4">
            <div
              style={{
                backgroundColor: `${systemColors.green}10`,
                borderLeftColor: systemColors.green,
              }}
              className="border-l-4 p-4 rounded-[12px]"
            >
              <div className="flex items-center space-x-2 mb-2">
                <span
                  style={{ color: systemColors.green }}
                  className="font-bold text-[17px]"
                >
                  レベルS / A:
                </span>
                <span
                  style={{ color: appleWebColors.textPrimary }}
                  className="font-semibold text-[17px]"
                >
                  強力なエビデンス
                </span>
              </div>
              <p
                style={{ color: appleWebColors.textSecondary }}
                className="text-[15px] leading-[1.5]"
              >
                複数のランダム化比較試験（RCT）またはメタアナリシスによる一貫した結果。
                大規模なコホート研究による裏付けがある。
              </p>
            </div>

            <div
              style={{
                backgroundColor: `${systemColors.blue}10`,
                borderLeftColor: systemColors.blue,
              }}
              className="border-l-4 p-4 rounded-[12px]"
            >
              <div className="flex items-center space-x-2 mb-2">
                <span
                  style={{ color: systemColors.blue }}
                  className="font-bold text-[17px]"
                >
                  レベルB:
                </span>
                <span
                  style={{ color: appleWebColors.textPrimary }}
                  className="font-semibold text-[17px]"
                >
                  中程度のエビデンス
                </span>
              </div>
              <p
                style={{ color: appleWebColors.textSecondary }}
                className="text-[15px] leading-[1.5]"
              >
                限られた数のRCTまたは質の高い観察研究による結果。
                一定の科学的合意がある。
              </p>
            </div>

            <div
              style={{
                backgroundColor: `${systemColors.orange}10`,
                borderLeftColor: systemColors.orange,
              }}
              className="border-l-4 p-4 rounded-[12px]"
            >
              <div className="flex items-center space-x-2 mb-2">
                <span
                  style={{ color: systemColors.orange }}
                  className="font-bold text-[17px]"
                >
                  レベルC:
                </span>
                <span
                  style={{ color: appleWebColors.textPrimary }}
                  className="font-semibold text-[17px]"
                >
                  限定的なエビデンス
                </span>
              </div>
              <p
                style={{ color: appleWebColors.textSecondary }}
                className="text-[15px] leading-[1.5]"
              >
                小規模研究、動物実験、または矛盾する研究結果。
                更なる研究が必要とされる段階。
              </p>
            </div>

            <div
              style={{
                backgroundColor: `${systemColors.gray[1]}10`,
                borderLeftColor: systemColors.gray[1],
              }}
              className="border-l-4 p-4 rounded-[12px]"
            >
              <div className="flex items-center space-x-2 mb-2">
                <span
                  style={{ color: systemColors.gray[1] }}
                  className="font-bold text-[17px]"
                >
                  レベルD:
                </span>
                <span
                  style={{ color: appleWebColors.textPrimary }}
                  className="font-semibold text-[17px]"
                >
                  エビデンス不足
                </span>
              </div>
              <p
                style={{ color: appleWebColors.textSecondary }}
                className="text-[15px] leading-[1.5]"
              >
                理論的根拠、予備的研究、または in vitro 研究のみ。
                ヒトでの効果は未確認。
              </p>
            </div>
          </div>
        </section>

        {/* 参考文献ポリシー */}
        <section className="mb-16">
          <h2
            style={{ color: appleWebColors.textPrimary }}
            className="text-[28px] font-bold mb-8"
          >
            参考文献ポリシー
          </h2>
          <div
            className={`border rounded-[16px] p-6 space-y-4 shadow-sm ${liquidGlassClasses.light}`}
            style={{
              borderColor: appleWebColors.borderSubtle,
            }}
          >
            <div>
              <h3
                style={{ color: appleWebColors.textPrimary }}
                className="font-semibold text-[17px] mb-2"
              >
                引用基準
              </h3>
              <ul
                style={{ color: appleWebColors.textSecondary }}
                className="list-disc list-inside space-y-2 text-[15px] leading-[1.5]"
              >
                <li>査読済み（peer-reviewed）の学術論文を優先</li>
                <li>発表年が新しい研究を重視（ただし古典的研究も考慮）</li>
                <li>研究デザイン、サンプルサイズ、バイアスリスクを評価</li>
                <li>利益相反の可能性を明示</li>
                <li>公的機関や規制当局の公式情報を重視</li>
              </ul>
            </div>
            <div>
              <h3
                style={{ color: appleWebColors.textPrimary }}
                className="font-semibold text-[17px] mb-2"
              >
                更新頻度
              </h3>
              <p
                style={{ color: appleWebColors.textSecondary }}
                className="text-[15px] leading-[1.5]"
              >
                新しい重要な研究結果が発表された場合、または年1回の定期レビューにより、情報を更新します。
                最終更新日は各ページに表示されます。
              </p>
            </div>
            <div>
              <h3
                style={{ color: appleWebColors.textPrimary }}
                className="font-semibold text-[17px] mb-2"
              >
                参考文献の表示
              </h3>
              <p
                style={{ color: appleWebColors.textSecondary }}
                className="text-[15px] leading-[1.5]"
              >
                各製品ページおよび成分ページには、根拠となる研究論文のリストを掲載し、
                PubMedやDOIへのリンクを提供します。すべての情報源を確認できるようにしています。
              </p>
            </div>
          </div>
        </section>

        {/* 法令遵守（薬機法準拠） */}
        <section className="mb-16">
          <h2
            style={{ color: appleWebColors.textPrimary }}
            className="text-[28px] font-bold mb-8"
          >
            法令遵守（薬機法準拠）
          </h2>
          <div
            style={{
              backgroundColor: `${systemColors.green}15`,
              borderColor: systemColors.green,
            }}
            className="border-2 rounded-[20px] p-6 mb-8"
          >
            <div className="flex items-start space-x-4">
              <div
                style={{ backgroundColor: `${systemColors.green}25` }}
                className="p-3 rounded-[16px]"
              >
                <ShieldCheck
                  style={{ color: systemColors.green }}
                  className="w-8 h-8"
                />
              </div>
              <div>
                <p
                  style={{ color: appleWebColors.textPrimary }}
                  className="font-bold text-[20px] mb-2"
                >
                  薬機法に準拠したコンテンツ
                </p>
                <p
                  style={{ color: appleWebColors.textSecondary }}
                  className="text-[17px] leading-[1.5]"
                >
                  サプティアのすべてのコンテンツは、日本の薬機法（医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律）に準拠して作成されています。
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div
              className={`border-2 rounded-[20px] p-6 shadow-sm ${liquidGlassClasses.light}`}
              style={{
                borderColor: appleWebColors.borderSubtle,
              }}
            >
              <h3
                style={{ color: appleWebColors.textPrimary }}
                className="font-bold text-[20px] mb-6"
              >
                コンテンツ作成ガイドライン
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                  className="flex items-start space-x-4 p-4 rounded-[12px]"
                >
                  <div
                    style={{ backgroundColor: `${systemColors.green}20` }}
                    className="p-2 rounded-full"
                  >
                    <div
                      style={{ backgroundColor: systemColors.green }}
                      className="w-3 h-3 rounded-full"
                    ></div>
                  </div>
                  <div>
                    <p
                      style={{ color: appleWebColors.textPrimary }}
                      className="font-semibold text-[15px] mb-1"
                    >
                      効能効果の表現
                    </p>
                    <p
                      style={{ color: appleWebColors.textSecondary }}
                      className="text-[13px] leading-[1.4]"
                    >
                      医薬品的な効能効果を標榜せず、適切な表現を使用
                    </p>
                  </div>
                </div>
                <div
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                  className="flex items-start space-x-4 p-4 rounded-[12px]"
                >
                  <div
                    style={{ backgroundColor: `${systemColors.green}20` }}
                    className="p-2 rounded-full"
                  >
                    <div
                      style={{ backgroundColor: systemColors.green }}
                      className="w-3 h-3 rounded-full"
                    ></div>
                  </div>
                  <div>
                    <p
                      style={{ color: appleWebColors.textPrimary }}
                      className="font-semibold text-[15px] mb-1"
                    >
                      疾病治療の言及
                    </p>
                    <p
                      style={{ color: appleWebColors.textSecondary }}
                      className="text-[13px] leading-[1.4]"
                    >
                      特定の疾病の治療・予防を目的とした表現を回避
                    </p>
                  </div>
                </div>
                <div
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                  className="flex items-start space-x-4 p-4 rounded-[12px]"
                >
                  <div
                    style={{ backgroundColor: `${systemColors.green}20` }}
                    className="p-2 rounded-full"
                  >
                    <div
                      style={{ backgroundColor: systemColors.green }}
                      className="w-3 h-3 rounded-full"
                    ></div>
                  </div>
                  <div>
                    <p
                      style={{ color: appleWebColors.textPrimary }}
                      className="font-semibold text-[15px] mb-1"
                    >
                      科学的根拠の明示
                    </p>
                    <p
                      style={{ color: appleWebColors.textSecondary }}
                      className="text-[13px] leading-[1.4]"
                    >
                      研究データは出典を明記し、誇大な解釈を避ける
                    </p>
                  </div>
                </div>
                <div
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                  className="flex items-start space-x-4 p-4 rounded-[12px]"
                >
                  <div
                    style={{ backgroundColor: `${systemColors.green}20` }}
                    className="p-2 rounded-full"
                  >
                    <div
                      style={{ backgroundColor: systemColors.green }}
                      className="w-3 h-3 rounded-full"
                    ></div>
                  </div>
                  <div>
                    <p
                      style={{ color: appleWebColors.textPrimary }}
                      className="font-semibold text-[15px] mb-1"
                    >
                      表現の適正化
                    </p>
                    <p
                      style={{ color: appleWebColors.textSecondary }}
                      className="text-[13px] leading-[1.4]"
                    >
                      「〜をサポート」「〜に役立つ可能性」など適切な表現
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`border-2 rounded-[20px] p-6 shadow-sm ${liquidGlassClasses.light}`}
              style={{
                borderColor: appleWebColors.borderSubtle,
              }}
            >
              <h3
                style={{ color: appleWebColors.textPrimary }}
                className="font-bold text-[20px] mb-4"
              >
                自動コンプライアンスチェック
              </h3>
              <p
                style={{ color: appleWebColors.textPrimary }}
                className="text-[17px] leading-[1.5] mb-6"
              >
                サプティアでは、
                <span
                  style={{ color: systemColors.green }}
                  className="font-bold"
                >
                  150以上のルール
                </span>
                に基づく自動コンプライアンスチェックシステムを導入しています。
                これにより、薬機法に抵触する可能性のある表現を事前に検出し、適切な表現への修正を行っています。
              </p>
              <div
                style={{ backgroundColor: appleWebColors.sectionBackground }}
                className="rounded-[16px] p-5"
              >
                <p
                  style={{ color: appleWebColors.textPrimary }}
                  className="font-semibold text-[17px] mb-3"
                >
                  チェック対象カテゴリ
                </p>
                <div className="flex flex-wrap gap-2">
                  <span
                    style={{
                      backgroundColor: `${systemColors.green}15`,
                      color: systemColors.green,
                      borderColor: systemColors.green,
                    }}
                    className="px-3 py-1.5 rounded-full text-[13px] font-medium border"
                  >
                    医薬品的効能効果
                  </span>
                  <span
                    style={{
                      backgroundColor: `${systemColors.green}15`,
                      color: systemColors.green,
                      borderColor: systemColors.green,
                    }}
                    className="px-3 py-1.5 rounded-full text-[13px] font-medium border"
                  >
                    疾病治療・予防
                  </span>
                  <span
                    style={{
                      backgroundColor: `${systemColors.green}15`,
                      color: systemColors.green,
                      borderColor: systemColors.green,
                    }}
                    className="px-3 py-1.5 rounded-full text-[13px] font-medium border"
                  >
                    誇大広告
                  </span>
                  <span
                    style={{
                      backgroundColor: `${systemColors.green}15`,
                      color: systemColors.green,
                      borderColor: systemColors.green,
                    }}
                    className="px-3 py-1.5 rounded-full text-[13px] font-medium border"
                  >
                    身体機能への影響
                  </span>
                  <span
                    style={{
                      backgroundColor: `${systemColors.green}15`,
                      color: systemColors.green,
                      borderColor: systemColors.green,
                    }}
                    className="px-3 py-1.5 rounded-full text-[13px] font-medium border"
                  >
                    体験談・証言
                  </span>
                  <span
                    style={{
                      backgroundColor: `${systemColors.green}15`,
                      color: systemColors.green,
                      borderColor: systemColors.green,
                    }}
                    className="px-3 py-1.5 rounded-full text-[13px] font-medium border"
                  >
                    比較広告
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 免責事項 */}
        <section className="mb-16">
          <h2
            style={{ color: appleWebColors.textPrimary }}
            className="text-[28px] font-bold mb-8"
          >
            重要な免責事項
          </h2>
          <div
            style={{
              backgroundColor: `${systemColors.orange}10`,
              borderColor: `${systemColors.orange}40`,
            }}
            className="border rounded-[16px] p-6"
          >
            <div className="flex items-start space-x-3">
              <Shield
                style={{ color: systemColors.orange }}
                className="w-6 h-6 mt-0.5 flex-shrink-0"
              />
              <div className="space-y-3 text-[15px] leading-[1.5]">
                <p style={{ color: appleWebColors.textPrimary }}>
                  <strong>医療アドバイスではありません:</strong>{" "}
                  <span style={{ color: appleWebColors.textSecondary }}>
                    サプティアの情報は、医療専門家による診断、治療、助言の代わりとなるものではありません。
                    サプリメントの使用前には、必ず医師または薬剤師にご相談ください。
                  </span>
                </p>
                <p style={{ color: appleWebColors.textPrimary }}>
                  <strong>個人運営による限界:</strong>{" "}
                  <span style={{ color: appleWebColors.textSecondary }}>
                    専門家による直接的な監修は行っておりません。
                    情報の正確性には最大限注意を払っていますが、医学的判断が必要な場合は必ず医療機関を受診してください。
                  </span>
                </p>
                <p style={{ color: appleWebColors.textPrimary }}>
                  <strong>情報の変更:</strong>{" "}
                  <span style={{ color: appleWebColors.textSecondary }}>
                    科学的知見は日々更新されます。新しい研究結果により、
                    過去の情報が変更される可能性があることをご理解ください。
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* お問い合わせ */}
        <section>
          <div
            className={`border rounded-[20px] p-8 text-center shadow-sm ${liquidGlassClasses.light}`}
            style={{
              borderColor: appleWebColors.borderSubtle,
            }}
          >
            <h2
              style={{ color: appleWebColors.textPrimary }}
              className="text-[22px] font-bold mb-4"
            >
              ご質問・ご意見
            </h2>
            <p
              style={{ color: appleWebColors.textSecondary }}
              className="text-[17px] leading-[1.5] mb-6"
            >
              情報の正確性に関するご指摘や、ご質問がありましたらお気軽にお問い合わせください。
            </p>
            <a
              href="/contact"
              style={{
                backgroundColor: systemColors.blue,
                color: "#FFFFFF",
              }}
              className="inline-block px-8 py-3 rounded-[12px] hover:opacity-90 transition-opacity font-semibold text-[17px]"
            >
              お問い合わせ
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
