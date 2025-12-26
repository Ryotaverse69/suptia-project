---
name: comparison-article
description: |
  SEO最適化されたサプリメント比較記事の作成スキル。Apple HIG準拠のデザインシステムを使用した顧客目線の包括的な比較コンテンツを生成。
  使用タイミング: (1) 新しい成分の比較記事を作成する時、(2) 既存の比較記事をリライト・改善する時、(3) SEO記事の構成を確認したい時、(4) 「比較記事を作成」「〇〇サプリの比較記事」などのリクエスト時
---

# 比較記事作成スキル

サプティアのSEO最適化された比較記事を作成するためのガイド。Apple HIG準拠のクリーンなデザインで、ユーザーファーストな情報設計を実現。

## デザイン原則（Apple HIG準拠）

### 3つのコア原則

1. **Clarity（明確性）** - 一目で理解できるUI。不要な複雑さを排除
2. **Deference（謙虚さ）** - コンテンツを主役に。UIは控えめに
3. **Depth（深さ）** - 視覚的階層で文脈と理解を提供

### 避けるべきデザイン

| ❌ 避ける                  | ✅ 代わりに                       |
| -------------------------- | --------------------------------- |
| パーティクルアニメーション | スタガードフェードアップ          |
| グラデーションテキスト     | ソリッドカラー（黒 + Apple Blue） |
| 派手な背景色               | 白/オフホワイト + 微細グラデ      |
| Sparklesアイコン           | Shield、Target等の具体的アイコン  |
| 過剰な絵文字               | 控えめに1-2個/セクション          |

## クイックスタート

1. 対象成分のslugと日本語名を確定
2. 既存記事を参考にデータ構造を定義（下記テンプレート参照）
3. 15セクションを順序通りに実装
4. Schema.org構造化データを追加（Article + FAQPage）
5. OGP画像を生成（`/admin/og-images`）
6. 記事一覧に追加

## ファイル構成

```
apps/web/src/app/articles/[ingredient]-comparison/page.tsx
```

## 統一セクション構成（15セクション）

```
1. [sticky] パンくずナビ ← 常に現在位置がわかる
2. ヒーローセクション（タイトル + アイキャッチ）
3. 目次 ← 長い記事のナビゲーション
4. この記事でわかること ← 読者の期待値設定
5. 結論ファースト（迷ったらこれ）← SEO効果 + 忙しいユーザー向け
6. 種類と特徴
7. 目的別おすすめ
8. おすすめ商品ランキング
9. 選び方チェックリスト
10. 摂取量・タイミング
11. 注意点・副作用
12. よくある質問（FAQ）← Schema.org対応
13. 関連成分 ← サイト内回遊促進
14. CTA
15. [hidden] 構造化データ（JSON-LD）← body末尾に配置
```

### セクション詳細

| #   | セクション           | 目的                           | 必須 |
| --- | -------------------- | ------------------------------ | ---- |
| 1   | Stickyパンくず       | ナビゲーション・現在位置表示   | ✅   |
| 2   | ヒーロー             | タイトル・更新日・アイキャッチ | ✅   |
| 3   | 目次                 | 長い記事のジャンプリンク       | ✅   |
| 4   | この記事でわかること | 読者の期待値設定・価値訴求     | ✅   |
| 5   | 結論ファースト       | 迷った人への即答               | ✅   |
| 6   | 種類と選び方         | 成分タイプの比較               | ✅   |
| 7   | 目的別おすすめ       | ペルソナ別推薦                 | ✅   |
| 8   | 商品ランキング       | コスパTOP10                    | ✅   |
| 9   | 選び方チェックリスト | 意思決定支援                   | ✅   |
| 10  | 摂取量ガイド         | 目的別用量テーブル             | ✅   |
| 11  | 注意点・副作用       | リスク情報                     | ✅   |
| 12  | FAQ                  | Schema.org対応                 | ✅   |
| 13  | 関連成分             | 内部リンク・回遊促進           | ✅   |
| 14  | CTA                  | 商品一覧・成分ガイドへ誘導     | ✅   |
| 15  | 構造化データ         | Article + FAQPage              | ✅   |

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

### カラーパレット

```tsx
// テキスト
appleWebColors.textPrimary; // #1d1d1f - メインテキスト
appleWebColors.textSecondary; // #86868b - 説明文
appleWebColors.textTertiary; // #aeaeb2 - 補足

// 背景
appleWebColors.pageBackground; // #f5f5f7 - ページ背景
appleWebColors.sectionBackground; // rgba(0,0,0,0.03)

// アクセント（成分ごとに選択）
systemColors.blue; // #007AFF - デフォルト
systemColors.green; // #34C759 - 安全性・エコ
systemColors.orange; // #FF9500 - 警告
systemColors.purple; // #AF52DE - プレミアム
systemColors.cyan; // #32ADE6 - 健康・ミネラル
systemColors.red; // #FF3B30 - エラー・重要警告
```

### タイポグラフィ

| 要素         | クラス                | 使用箇所           |
| ------------ | --------------------- | ------------------ |
| ページH1     | `typography.title1`   | ヒーローセクション |
| セクションH2 | `typography.title2`   | 各セクション見出し |
| カードH3     | `typography.title3`   | カード・目次見出し |
| 本文         | `typography.body`     | 説明文             |
| 補足         | `typography.footnote` | 日付・読了時間     |

### カード

```tsx
// 標準カード（Liquid Glass Light）
className={`${liquidGlassClasses.light} rounded-[20px] p-6 border`}
style={{ borderColor: appleWebColors.borderSubtle }}

// ハイライトカード（結論ファースト等）
style={{
  background: `linear-gradient(135deg, ${systemColors.cyan}15, ${systemColors.blue}15)`,
}}

// 警告カード
className={`rounded-[16px] p-5 border-l-4`}
style={{
  borderLeftColor: systemColors.orange,
  backgroundColor: systemColors.orange + "08",
}}
```

### Stickyパンくず

```tsx
<div
  className={`sticky top-0 z-10 border-b ${liquidGlassClasses.light}`}
  style={{ borderColor: appleWebColors.borderSubtle }}
>
  <div className="mx-auto px-4 sm:px-6 py-3 max-w-4xl">
    <nav className="flex items-center gap-2 text-[13px]">
      <Link href="/" style={{ color: systemColors.blue }}>
        ホーム
      </Link>
      <span style={{ color: appleWebColors.textSecondary }}>/</span>
      <Link href="/articles" style={{ color: systemColors.blue }}>
        記事一覧
      </Link>
      <span style={{ color: appleWebColors.textSecondary }}>/</span>
      <span style={{ color: appleWebColors.textSecondary }}>〇〇比較</span>
    </nav>
  </div>
</div>
```

### 目次

```tsx
const SECTIONS = [
  { id: "types", label: "種類と特徴" },
  { id: "purpose", label: "目的別おすすめ" },
  { id: "products", label: "おすすめ商品ランキング" },
  { id: "checklist", label: "選び方チェックリスト" },
  { id: "dosage", label: "摂取量・タイミング" },
  { id: "cautions", label: "注意点・副作用" },
  { id: "faq", label: "よくある質問" },
];

<nav className={`${liquidGlassClasses.light} rounded-[20px] p-6 mb-12 border`}>
  <h2 className={`${typography.title3} mb-4`}>目次</h2>
  <ol className="space-y-2 text-[15px]" style={{ color: systemColors.blue }}>
    {SECTIONS.map((section, i) => (
      <li key={section.id}>
        <a href={`#${section.id}`} className="hover:opacity-70">
          {i + 1}. {section.label}
        </a>
      </li>
    ))}
  </ol>
</nav>;
```

## データ構造

詳細は [references/data-structures.md](references/data-structures.md) 参照。

### 必須データ（8種類）

1. `ARTICLE_DATA` - 記事メタデータ
2. `LEARNING_POINTS` - この記事でわかること（5項目）
3. `QUICK_RECOMMENDATIONS` - 結論ファースト（3-5項目）
4. `INGREDIENT_TYPES` - 種類と特徴（5-6種類）
5. `PURPOSE_RECOMMENDATIONS` - 目的別おすすめ（4-5パターン）
6. `SELECTION_CHECKLIST` - 選び方チェックリスト（4カテゴリ）
7. `DOSAGE_GUIDE` - 摂取量ガイド（テーブル形式）
8. `CAUTIONS` - 注意点・副作用（4-5項目）
9. `FAQS` - よくある質問（5-7問）
10. `RELATED_INGREDIENTS` - 関連成分（4種類）

## Schema.org構造化データ

### body末尾に配置

```tsx
{
  /* Article構造化データ */
}
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: ARTICLE_DATA.title,
      description: ARTICLE_DATA.description,
      datePublished: ARTICLE_DATA.publishedAt,
      dateModified: ARTICLE_DATA.updatedAt,
      author: {
        "@type": "Organization",
        name: "サプティア編集部",
        url: "https://suptia.com",
      },
      publisher: {
        "@type": "Organization",
        name: "サプティア",
        logo: { "@type": "ImageObject", url: "https://suptia.com/logo.png" },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://suptia.com/articles/${ARTICLE_DATA.ingredientSlug}-comparison`,
      },
    }),
  }}
/>;

{
  /* FAQ構造化データ */
}
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    }),
  }}
/>;
```

## OGP画像

```tsx
import { getArticleOGImage, generateOGImageMeta } from "@/lib/og-image";
import { ArticleEyecatch } from "@/components/articles/ArticleEyecatch";

const ogImageUrl = getArticleOGImage("ingredient-comparison");
const ogImage = generateOGImageMeta(ogImageUrl, "〇〇比較 - Suptia");

// metadata内で使用
openGraph: {
  images: [ogImage],
}

// ヒーローセクション内で使用
<ArticleEyecatch src={ogImageUrl} alt={ARTICLE_DATA.title} size="large" />
```

管理画面 `/admin/og-images` から生成可能。

## 記事一覧への追加

`apps/web/src/app/articles/page.tsx` の `articles` 配列に追加。

```tsx
{
  title: "〇〇サプリ比較",
  description: "〇〇サプリを徹底比較...",
  slug: "ingredient-comparison",
  category: "ミネラル", // ビタミン / ミネラル / アミノ酸 / その他
  publishedAt: "2025-01-XX",
}
```

## チェックリスト

### 作成前

- [ ] 成分名・slugを確定
- [ ] 既存の類似記事を2-3件確認
- [ ] Sanityに対象成分の商品データがあるか確認

### 実装

- [ ] 10個のデータ構造を定義
- [ ] 15セクションを順序通りに実装
- [ ] Stickyパンくずを実装
- [ ] 目次を実装（アンカーリンク動作確認）
- [ ] 「この記事でわかること」を実装
- [ ] 「結論ファースト」を実装
- [ ] 関連成分セクションを実装

### 品質

- [ ] Apple HIG準拠デザイン（Sparkles禁止、控えめな絵文字）
- [ ] Schema.org構造化データ（Article + FAQPage）
- [ ] OGP画像生成
- [ ] 記事一覧に追加
- [ ] TypeCheck通過 (`npm run typecheck`)
- [ ] ビルド通過 (`npm run build`)

## 参考記事（良い例）

- [zinc-comparison](../../apps/web/src/app/articles/zinc-comparison/page.tsx) - 最新構成
- [magnesium-comparison](../../apps/web/src/app/articles/magnesium-comparison/page.tsx) - 目次あり
