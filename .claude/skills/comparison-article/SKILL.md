---
name: comparison-article
description: |
  SEO最適化されたサプリメント比較記事の作成スキル。Apple HIG準拠のデザインシステムを使用した顧客目線の包括的な比較コンテンツを生成。
  使用タイミング: (1) 新しい成分の比較記事を作成する時、(2) 既存の比較記事をリライト・改善する時、(3) SEO記事の構成を確認したい時、(4) 「比較記事を作成」「〇〇サプリの比較記事」などのリクエスト時
---

# 比較記事作成スキル

サプティアのSEO最適化された比較記事を作成するためのガイド。

## クイックスタート

1. 対象成分のslugと日本語名を確定
2. Sanityから商品データを取得するクエリを作成
3. 記事データ構造を定義
4. 各セクションを実装
5. Schema.org構造化データを追加
6. OGP画像を生成

## ファイル構成

```
apps/web/src/app/articles/[slug]/page.tsx
```

## 記事構造

### メタデータ・OGP

```tsx
export const metadata: Metadata = {
  title: "【2025年最新】〇〇サプリおすすめ比較｜コスパ・品質で徹底分析",
  description: "〇〇サプリメントを価格・成分量・コスパ・安全性で徹底比較...",
  keywords: [...],
  openGraph: { type: "article", publishedTime: "...", ... },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "https://suptia.com/articles/xxx" },
};
```

### 必須セクション（順序）

| #   | セクション           | 目的                           |
| --- | -------------------- | ------------------------------ |
| 1   | ヘッダー             | タイトル・更新日・アイキャッチ |
| 2   | この記事でわかること | 読者の期待値設定               |
| 3   | 結論ファースト       | 迷った人への即答               |
| 4   | 種類と選び方         | 成分タイプの比較               |
| 5   | 目的別おすすめ       | ペルソナ別推薦                 |
| 6   | コスパランキング     | mg単価TOP3                     |
| 7   | 購入前チェックリスト | 意思決定支援                   |
| 8   | 摂取量ガイド         | 目的別用量                     |
| 9   | 注意点・副作用       | リスク情報                     |
| 10  | その他の商品         | 追加選択肢                     |
| 11  | FAQ                  | Schema.org対応                 |
| 12  | 関連成分             | 内部リンク                     |
| 13  | CTA                  | 商品一覧・ツールへ誘導         |

### データ構造

詳細は [references/data-structures.md](references/data-structures.md) 参照。

## デザインシステム（Apple HIG）

### インポート

```tsx
import {
  appleWebColors,
  systemColors,
  fontStack,
  liquidGlassClasses,
  typography,
} from "@/lib/design-system";
```

### タイポグラフィ

| 要素 | クラス                                        |
| ---- | --------------------------------------------- |
| h1   | `typography.title1` / `typography.largeTitle` |
| h2   | `typography.title2`                           |
| h3   | `typography.title3`                           |
| 本文 | `typography.body`                             |

### カード

```tsx
className={`${liquidGlassClasses.light} rounded-[20px] p-6 border`}
style={{ borderColor: appleWebColors.borderSubtle }}
```

## Schema.org

```tsx
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};
```

## OGP画像

```tsx
import { getArticleOGImage } from "@/lib/og-image";
import { ArticleEyecatch } from "@/components/articles/ArticleEyecatch";

const ogImageUrl = getArticleOGImage("article-slug");
<ArticleEyecatch src={ogImageUrl} alt="..." />;
```

管理画面 `/admin/og-images` から生成可能。

## 記事一覧への追加

`apps/web/src/app/articles/page.tsx` の `articles` 配列に追加。

## チェックリスト

- [ ] 成分名・slugを確定
- [ ] Sanityクエリで商品データ取得
- [ ] 6つのデータ構造を定義
- [ ] 13セクションを実装
- [ ] Schema.org構造化データ追加
- [ ] OGP画像生成
- [ ] 記事一覧に追加
- [ ] TypeCheck・ビルド通過
