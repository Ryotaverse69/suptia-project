# Content SEO Scorer

コンテンツSEOスコアラー - 記事のSEO品質を総合評価

## 概要

**content-seo-scorer** は、Suptiaプロジェクトの記事（成分ガイド、商品比較など）のSEO品質を自動評価し、改善推奨事項を提示するツールです。

## 主な機能（実装予定）

- ✅ 文字数、見出し構造、キーワード密度チェック
- ✅ 内部リンク・外部リンク分析
- ✅ メタタグ（title、description）最適化提案
- ✅ 読みやすさスコア（日本語対応）
- ✅ 競合分析（上位サイトとの比較）
- ✅ JSON-LD構造化データのチェック（structured-data-validatorと統合）

## 評価基準（100点満点）

| 項目           | 配点 | 目標値                                    |
| -------------- | ---- | ----------------------------------------- |
| 文字数         | 20点 | 3,000文字以上                             |
| 見出し構造     | 15点 | H1(1) → H2(3-5) → H3(適宜)                |
| キーワード密度 | 15点 | 1-3%                                      |
| 内部リンク     | 10点 | 5個以上                                   |
| 外部リンク     | 10点 | 信頼できるソース3個以上                   |
| メタタグ       | 15点 | title 60文字以内、description 160文字以内 |
| 読みやすさ     | 10点 | 日本語の文章難易度70点以上                |
| 構造化データ   | 15点 | JSON-LD準拠                               |

## 使用方法（実装予定）

```bash
# 単一記事のSEOスコアを算出
npx tsx .claude/skills/content-seo-scorer/index.ts \
  --target "apps/web/src/app/(marketing)/ingredients/[slug]/page.tsx"

# バッチモード（全記事を評価）
npx tsx .claude/skills/content-seo-scorer/index.ts \
  --target "apps/web/src/app/(marketing)/ingredients/**/*.tsx" \
  --mode batch \
  --save seo-report.md

# 競合分析を含める
npx tsx .claude/skills/content-seo-scorer/index.ts \
  --target "apps/web/src/app/(marketing)/ingredients/vitamin-c/page.tsx" \
  --include-competitor-analysis
```

## 出力例（実装予定）

```
┌─────────────────────────────────────────────────────────┐
│         Content SEO Scorer Report                       │
├─────────────────────────────────────────────────────────┤
│ Target: vitamin-c/page.tsx                              │
│ Total Score: 82/100                                     │
│ Grade: B                                                │
└─────────────────────────────────────────────────────────┘

📊 Score Breakdown:
  Word Count:        18/20 ✅ (3,200文字)
  Heading Structure: 15/15 ✅
  Keyword Density:   12/15 ⚠️ (2.8%)
  Internal Links:    10/10 ✅ (7個)
  External Links:    8/10 ⚠️ (2個)
  Meta Tags:         15/15 ✅
  Readability:       9/10 ✅ (75点)
  Structured Data:   15/15 ✅

💡 Recommendations:
  1. 外部リンクを1件追加してください（信頼できるソース）
  2. キーワード密度を3%に調整してください
```

## ステータス

⏳ **スケルトン実装済み** - フェーズ3（SEO強化）で完全実装予定

## ライセンス

MIT License
