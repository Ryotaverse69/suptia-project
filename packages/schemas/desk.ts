import { StructureBuilder } from "sanity/desk";

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .id("root")
    .title("コンテンツ管理")
    .items([
      // 成分管理
      S.listItem()
        .id("ingredient")
        .title("成分ガイド")
        .icon(() => "🧪")
        .child(
          S.list()
            .id("ingredient-list")
            .title("成分管理")
            .items([
              S.listItem()
                .id("all-ingredients")
                .title("全ての成分")
                .child(S.documentTypeList("ingredient").title("全ての成分")),
              S.listItem()
                .id("ingredient-by-category")
                .title("カテゴリー別")
                .child(
                  S.list()
                    .id("ingredient-category-list")
                    .title("カテゴリー別成分")
                    .items([
                      S.listItem()
                        .id("vitamin-category")
                        .title("ビタミン")
                        .child(
                          S.documentTypeList("ingredient")
                            .title("ビタミン")
                            .filter(
                              '_type == "ingredient" && category == "ビタミン"',
                            ),
                        ),
                      S.listItem()
                        .id("mineral-category")
                        .title("ミネラル")
                        .child(
                          S.documentTypeList("ingredient")
                            .title("ミネラル")
                            .filter(
                              '_type == "ingredient" && category == "ミネラル"',
                            ),
                        ),
                      S.listItem()
                        .id("fatty-acid-category")
                        .title("脂肪酸")
                        .child(
                          S.documentTypeList("ingredient")
                            .title("脂肪酸")
                            .filter(
                              '_type == "ingredient" && category == "脂肪酸"',
                            ),
                        ),
                      S.listItem()
                        .id("amino-acid-category")
                        .title("アミノ酸")
                        .child(
                          S.documentTypeList("ingredient")
                            .title("アミノ酸")
                            .filter(
                              '_type == "ingredient" && category == "アミノ酸"',
                            ),
                        ),
                      S.listItem()
                        .id("probiotic-category")
                        .title("プロバイオティクス")
                        .child(
                          S.documentTypeList("ingredient")
                            .title("プロバイオティクス")
                            .filter(
                              '_type == "ingredient" && category == "プロバイオティクス"',
                            ),
                        ),
                      S.listItem()
                        .id("herb-category")
                        .title("ハーブ")
                        .child(
                          S.documentTypeList("ingredient")
                            .title("ハーブ")
                            .filter(
                              '_type == "ingredient" && category == "ハーブ"',
                            ),
                        ),
                      S.listItem()
                        .id("other-category")
                        .title("その他")
                        .child(
                          S.documentTypeList("ingredient")
                            .title("その他")
                            .filter(
                              '_type == "ingredient" && category == "その他"',
                            ),
                        ),
                    ]),
                ),
              S.listItem()
                .id("ingredient-by-evidence")
                .title("エビデンスレベル別")
                .child(
                  S.list()
                    .id("ingredient-evidence-list")
                    .title("エビデンスレベル別")
                    .items([
                      S.listItem()
                        .id("evidence-high")
                        .title("高（科学的根拠が十分）")
                        .child(
                          S.documentTypeList("ingredient")
                            .title("エビデンスレベル：高")
                            .filter(
                              '_type == "ingredient" && evidenceLevel == "高"',
                            ),
                        ),
                      S.listItem()
                        .id("evidence-medium")
                        .title("中（科学的根拠が中程度）")
                        .child(
                          S.documentTypeList("ingredient")
                            .title("エビデンスレベル：中")
                            .filter(
                              '_type == "ingredient" && evidenceLevel == "中"',
                            ),
                        ),
                      S.listItem()
                        .id("evidence-low")
                        .title("低（科学的根拠が限定的）")
                        .child(
                          S.documentTypeList("ingredient")
                            .title("エビデンスレベル：低")
                            .filter(
                              '_type == "ingredient" && evidenceLevel == "低"',
                            ),
                        ),
                    ]),
                ),
            ]),
        ),

      // 商品管理
      S.listItem()
        .id("product")
        .title("商品")
        .icon(() => "📦")
        .child(
          S.list()
            .id("product-list")
            .title("商品管理")
            .items([
              S.listItem()
                .id("all-products")
                .title("全ての商品")
                .child(S.documentTypeList("product").title("全ての商品")),
              S.listItem()
                .id("product-by-price")
                .title("価格帯別")
                .child(
                  S.list()
                    .id("product-price-list")
                    .title("価格帯別商品")
                    .items([
                      S.listItem()
                        .id("price-low")
                        .title("〜2,000円")
                        .child(
                          S.documentTypeList("product")
                            .title("〜2,000円")
                            .filter('_type == "product" && priceJPY <= 2000'),
                        ),
                      S.listItem()
                        .id("price-medium")
                        .title("2,001円〜5,000円")
                        .child(
                          S.documentTypeList("product")
                            .title("2,001円〜5,000円")
                            .filter(
                              '_type == "product" && priceJPY > 2000 && priceJPY <= 5000',
                            ),
                        ),
                      S.listItem()
                        .id("price-high")
                        .title("5,001円〜")
                        .child(
                          S.documentTypeList("product")
                            .title("5,001円〜")
                            .filter('_type == "product" && priceJPY > 5000'),
                        ),
                    ]),
                ),
              S.listItem()
                .id("third-party-tested")
                .title("第三者機関検査済み")
                .child(
                  S.documentTypeList("product")
                    .title("第三者機関検査済み商品")
                    .filter('_type == "product" && thirdPartyTested == true'),
                ),
            ]),
        ),

      // エビデンス管理
      S.listItem()
        .id("evidence")
        .title("エビデンス")
        .icon(() => "📊")
        .child(
          S.list()
            .id("evidence-list")
            .title("エビデンス管理")
            .items([
              S.listItem()
                .id("all-evidence")
                .title("全てのエビデンス")
                .child(
                  S.documentTypeList("evidence").title("全てのエビデンス"),
                ),
              S.listItem()
                .id("evidence-by-type")
                .title("研究タイプ別")
                .child(
                  S.list()
                    .id("evidence-type-list")
                    .title("研究タイプ別")
                    .items([
                      S.listItem()
                        .id("study-rct")
                        .title("RCT")
                        .child(
                          S.documentTypeList("evidence")
                            .title("ランダム化比較試験")
                            .filter(
                              '_type == "evidence" && studyType == "RCT"',
                            ),
                        ),
                      S.listItem()
                        .id("study-meta")
                        .title("メタ分析")
                        .child(
                          S.documentTypeList("evidence")
                            .title("メタ分析")
                            .filter(
                              '_type == "evidence" && studyType == "meta-analysis"',
                            ),
                        ),
                      S.listItem()
                        .id("study-systematic")
                        .title("システマティックレビュー")
                        .child(
                          S.documentTypeList("evidence")
                            .title("システマティックレビュー")
                            .filter(
                              '_type == "evidence" && studyType == "systematic-review"',
                            ),
                        ),
                    ]),
                ),
              S.listItem()
                .id("evidence-by-grade")
                .title("グレード別")
                .child(
                  S.list()
                    .id("evidence-grade-list")
                    .title("エビデンスグレード別")
                    .items([
                      S.listItem()
                        .id("grade-a")
                        .title("Aグレード")
                        .child(
                          S.documentTypeList("evidence")
                            .title("Aグレード")
                            .filter('_type == "evidence" && grade == "A"'),
                        ),
                      S.listItem()
                        .id("grade-b")
                        .title("Bグレード")
                        .child(
                          S.documentTypeList("evidence")
                            .title("Bグレード")
                            .filter('_type == "evidence" && grade == "B"'),
                        ),
                      S.listItem()
                        .id("grade-c")
                        .title("Cグレード")
                        .child(
                          S.documentTypeList("evidence")
                            .title("Cグレード")
                            .filter('_type == "evidence" && grade == "C"'),
                        ),
                    ]),
                ),
            ]),
        ),

      // ペルソナ管理
      S.listItem()
        .id("persona")
        .title("ペルソナ")
        .icon(() => "👥")
        .child(
          S.list()
            .id("persona-list")
            .title("ペルソナ管理")
            .items([
              S.listItem()
                .id("all-personas")
                .title("全てのペルソナ")
                .child(S.documentTypeList("persona").title("全てのペルソナ")),
              S.listItem()
                .id("persona-by-tag")
                .title("タグ別")
                .child(
                  S.list()
                    .id("persona-tag-list")
                    .title("タグ別ペルソナ")
                    .items([
                      S.listItem()
                        .id("tag-pregnancy")
                        .title("妊娠・授乳中")
                        .child(
                          S.documentTypeList("persona")
                            .title("妊娠・授乳中")
                            .filter(
                              '_type == "persona" && ("pregnancy" in tags || "lactation" in tags)',
                            ),
                        ),
                      S.listItem()
                        .id("tag-condition")
                        .title("疾患・服薬中")
                        .child(
                          S.documentTypeList("persona")
                            .title("疾患・服薬中")
                            .filter(
                              '_type == "persona" && ("condition" in tags || "meds" in tags)',
                            ),
                        ),
                      S.listItem()
                        .id("tag-stimulant")
                        .title("刺激物敏感")
                        .child(
                          S.documentTypeList("persona")
                            .title("刺激物敏感")
                            .filter(
                              '_type == "persona" && "stimulantSensitivity" in tags',
                            ),
                        ),
                    ]),
                ),
            ]),
        ),

      // ルール管理
      S.listItem()
        .id("rule")
        .title("コンプライアンスルール")
        .icon(() => "⚠️")
        .child(
          S.list()
            .id("rule-list")
            .title("ルール管理")
            .items([
              S.listItem()
                .id("all-rules")
                .title("全てのルール")
                .child(S.documentTypeList("rule").title("全てのルール")),
              S.listItem()
                .id("rule-by-severity")
                .title("重要度別")
                .child(
                  S.list()
                    .id("rule-severity-list")
                    .title("重要度別ルール")
                    .items([
                      S.listItem()
                        .id("severity-high")
                        .title("高（禁忌）")
                        .child(
                          S.documentTypeList("rule")
                            .title("高重要度ルール")
                            .filter('_type == "rule" && severity == "high"'),
                        ),
                      S.listItem()
                        .id("severity-medium")
                        .title("中（要注意）")
                        .child(
                          S.documentTypeList("rule")
                            .title("中重要度ルール")
                            .filter('_type == "rule" && severity == "medium"'),
                        ),
                      S.listItem()
                        .id("severity-low")
                        .title("低（注意喚起）")
                        .child(
                          S.documentTypeList("rule")
                            .title("低重要度ルール")
                            .filter('_type == "rule" && severity == "low"'),
                        ),
                    ]),
                ),
              S.listItem()
                .id("active-rules")
                .title("アクティブなルール")
                .child(
                  S.documentTypeList("rule")
                    .title("アクティブなルール")
                    .filter('_type == "rule" && isActive == true'),
                ),
            ]),
        ),
    ]);
