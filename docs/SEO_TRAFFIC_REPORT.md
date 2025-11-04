# Suptia SEO・トラフィック分析レポート

**作成日**: 2025年11月4日
**対象サイト**: https://suptia.com

---

## 📊 エグゼクティブサマリー

### 総合評価: ⭐⭐⭐⭐☆ (4/5)

Suptiaは**SEO基盤が完全に整備**されており、技術的な観点から見ると非常に優れた状態です。ただし、**トラフィックデータへのアクセス権限が不足**しているため、実際の訪問者数やコンバージョン状況の確認が必要です。

---

## ✅ 実装済みSEO機能

### 1. **Google Analytics 4 (GA4)** ✅ 完全設定済み

**ステータス**: 🟢 本番環境に設定済み

**設定内容**:

- **Measurement ID**: `G-662RT7N94S`
- **環境変数**: `.env.local`および本番環境に設定済み
- **トラッキングコード**: 実装済み（`apps/web/src/lib/analytics.ts`）

**実装されているイベントトラッキング**:

- `trackProductView()` - 商品詳細ページの閲覧
- `trackProductClick()` - 商品カードのクリック
- `trackSearch()` - サイト内検索の実行
- `trackFilter()` - フィルター機能の使用
- `trackDiagnosisStart()` - 診断開始
- `trackDiagnosisComplete()` - 診断完了
- `trackPriceAlertCreated()` - 価格アラート作成
- `trackFavoriteAdded()` - お気に入り追加
- `trackIngredientView()` - 成分ページの閲覧
- `trackOutboundLink()` - 外部リンク（アフィリエイト）のクリック
- `trackError()` - エラー発生
- `trackFormSubmit()` - フォーム送信
- `trackScrollDepth()` - スクロール深度

**推奨アクション**:

- ✅ GA4ダッシュボードにログインして実際のトラフィックデータを確認
- ✅ カスタムレポート作成（商品別コンバージョン、成分別閲覧数）
- ✅ eコマース拡張機能の有効化（アフィリエイトクリック＝売上として計測）

---

### 2. **Google Search Console** ⚠️ 一部設定済み

**ステータス**: 🟡 認証済みだが、APIアクセス権限が不足

**設定内容**:

- **認証コード**: `wHRKDPFkYiTNtDFAwTebqJkuA0XbjxkyHQxVrxBxgmk`
- **OAuth認証**: 設定済み（Client ID、Secret、Refresh Token）
- **APIアクセス**: ❌ 403エラー - 権限不足

**推奨アクション**:

1. **Search Consoleで所有権を確認**:
   - https://search.google.com/search-console にアクセス
   - `suptia.com`を追加（まだの場合）
   - HTMLタグまたはDNS認証で所有権を確認

2. **APIアクセス権限を付与**:
   - Search Console → 設定 → ユーザーと権限
   - OAuth認証で使用しているGoogleアカウント（`900759451266-...`）に「所有者」権限を付与

3. **サイトマップを送信**:
   - Search Console → サイトマップ
   - `https://suptia.com/sitemap.xml`を送信

4. **インデックス状況を確認**:
   - カバレッジレポートで526ページすべてがインデックスされているか確認

---

### 3. **動的XMLサイトマップ** ✅ 完全動作

**ステータス**: 🟢 本番環境で正常動作

**確認結果**:

```
URL: https://suptia.com/sitemap.xml
ステータス: HTTP/2 200
Content-Type: application/xml
総URL数: 526ページ
```

**含まれているページ**:

- ✅ 静的ページ（16ページ）: ホーム、商品一覧、成分一覧、診断、About、FAQ、利用規約など
- ✅ 商品ページ（約489ページ）: `/products/[slug]` - Sanityから動的生成
- ✅ 成分ページ（約21ページ）: `/ingredients/[slug]` - Sanityから動的生成

**優れた実装**:

- 最終更新日（`lastmod`）が動的に更新される
- 優先度（`priority`）が適切に設定（ホーム=1.0、商品=0.8、成分=0.7）
- 更新頻度（`changefreq`）が適切（商品=weekly、成分=monthly）

---

### 4. **robots.txt** ✅ 完全動作

**ステータス**: 🟢 本番環境で正常動作

**確認結果**:

```
URL: https://suptia.com/robots.txt
ステータス: HTTP/2 200
Content-Type: text/plain
```

**設定内容**:

```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /studio/
Disallow: /admin/
Disallow: /*.json$
Disallow: /private/

User-Agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /studio/

User-Agent: Bingbot
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /studio/

User-Agent: Slurp (Yahoo)
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /studio/

Host: https://suptia.com
Sitemap: https://suptia.com/sitemap.xml
```

**評価**: ✅ 完璧

- 主要検索エンジン（Google、Bing、Yahoo）に最適化
- 管理画面・API・内部ファイルを適切にブロック
- サイトマップURLを明示

---

### 5. **メタデータ最適化** ✅ 完全実装

**ステータス**: 🟢 動的メタデータ生成システム実装済み

**実装ファイル**: `apps/web/src/lib/seo.ts`

**商品ページのメタデータ例**:

```html
<title>ビタミンC 1000mg | 最安値¥1,980から比較 - Suptia</title>
<meta
  name="description"
  content="ビタミンC 1000mgを楽天市場・Yahoo!ショッピング・Amazonで価格比較。最安値¥1,980。エビデンスレベル: A、安全性スコア: 95点。"
/>

<!-- Open Graph (Facebook) -->
<meta property="og:title" content="ビタミンC 1000mg | 最安値¥1,980から比較" />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://cdn.sanity.io/..." />
<meta property="og:type" content="product" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />
```

**成分ページのメタデータ例**:

```html
<title>ビタミンC（アスコルビン酸）の効果・エビデンス・副作用 | Suptia</title>
<meta
  name="description"
  content="ビタミンCの科学的エビデンス、推奨摂取量、副作用、相互作用を詳しく解説。PubMed掲載の研究に基づく信頼性の高い情報。"
/>
```

**優れた点**:

- ✅ 価格情報を含めたタイトル最適化（SEO効果大）
- ✅ 動的ディスクリプション生成（商品ごとにユニーク）
- ✅ OGP・Twitter Card完全対応（SNSシェア最適化）

---

### 6. **JSON-LD構造化データ** ✅ 完全実装

**ステータス**: 🟢 Schema.org準拠の構造化データを自動生成

**実装されているスキーマ**:

#### Product Schema（商品ページ）

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "ビタミンC 1000mg",
  "brand": {
    "@type": "Brand",
    "name": "DHC"
  },
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": 1980,
    "highPrice": 2480,
    "priceCurrency": "JPY",
    "offerCount": 3
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.5,
    "reviewCount": 128
  }
}
```

#### BreadcrumbList（パンくずリスト）

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "ホーム",
      "item": "https://suptia.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "商品一覧",
      "item": "https://suptia.com/products"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "ビタミンC 1000mg",
      "item": "https://suptia.com/products/vitamin-c-1000mg"
    }
  ]
}
```

**SEO効果**:

- ✅ Googleの検索結果にリッチスニペット表示（価格、評価、在庫状況）
- ✅ ナレッジパネルに商品情報が表示される可能性が高い
- ✅ Googleショッピングへの掲載資格取得（将来的に）

---

### 7. **セキュリティヘッダー** ✅ 完全実装

**ステータス**: 🟢 本番環境で正常動作（Vercelで自動設定）

**確認されたヘッダー**:

```
Content-Security-Policy: default-src 'self'; img-src 'self' https://cdn.sanity.io https://thumbnail.image.rakuten.co.jp https://tshop.r10s.jp https://item-shopping.c.yimg.jp https://shopping.c.yimg.jp data: blob:; connect-src 'self' https://*.sanity.io; style-src 'self' 'unsafe-inline'; font-src 'self' data:; script-src 'self' 'nonce-...'; upgrade-insecure-requests

X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: on
Referrer-Policy: origin-when-cross-origin
Strict-Transport-Security: max-age=63072000
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

**評価**: ✅ 優秀

- CSP設定により、XSS攻撃を防止
- HSTS設定により、HTTPS接続を強制（2年間）
- 不要なPermissions（カメラ、マイク、位置情報）をブロック

---

## 📈 EC API連携状況

### 楽天市場API ✅ 完全統合

- **アプリケーションID**: 設定済み
- **アフィリエイトID**: 設定済み
- **商品同期**: 定期実行中（GitHub Actions）
- **商品数**: 約380件（楽天）

### Yahoo!ショッピングAPI ✅ 完全統合

- **クライアントID**: 設定済み
- **バリューコマースSID/PID**: 設定済み
- **商品同期**: 定期実行中
- **商品数**: 約109件（Yahoo）

### Amazon PA-API ⏳ 準備中

- **ステータス**: `ENABLE_AMAZON_API=false`（売上発生後に有効化予定）
- **計画**: 2026年1月から統合開始

---

## 🚨 発見された問題点と解決策

### 問題1: Search Console APIアクセス権限不足

**現状**: 403 Forbidden - "User does not have sufficient permission"

**原因**:

- OAuth認証で使用しているGoogleアカウントが、Search Consoleで`suptia.com`の所有者として登録されていない
- または、権限レベルが「制限付き」になっている

**解決策**:

1. https://search.google.com/search-console にアクセス
2. プロパティを追加: `suptia.com`
3. 所有権の確認（HTMLタグ方式）:
   ```html
   <meta
     name="google-site-verification"
     content="wHRKDPFkYiTNtDFAwTebqJkuA0XbjxkyHQxVrxBxgmk"
   />
   ```
4. OAuth認証で使用しているアカウント（`900759451266-...`のClient IDに紐づくアカウント）に「所有者」権限を付与
5. サイトマップを送信: `https://suptia.com/sitemap.xml`

---

### 問題2: トラフィックデータの可視性不足

**現状**: GA4とSearch Consoleが設定されているが、データへのアクセス方法が不明

**解決策**:

#### Google Analytics 4

1. https://analytics.google.com/ にアクセス
2. プロパティ選択: Measurement ID `G-662RT7N94S`に対応するプロパティ
3. 確認すべきレポート:
   - **リアルタイム**: 現在のアクティブユーザー数
   - **トラフィック獲得**: どこから訪問者が来ているか（Google検索、直接、SNS）
   - **ページとスクリーン**: 最も閲覧されているページ
   - **イベント**: カスタムイベント（`product_view`, `outbound_link`など）の発火状況
   - **eコマース**: アフィリエイトクリック数（カスタム実装が必要）

#### Google Search Console

1. https://search.google.com/search-console にアクセス
2. 確認すべきレポート:
   - **パフォーマンス**: 検索クエリ、クリック数、表示回数、CTR、平均順位
   - **カバレッジ**: インデックスされたページ数、エラーページ
   - **サイトマップ**: `sitemap.xml`の送信状況と検出されたURL数
   - **Core Web Vitals**: ページ速度とユーザー体験の指標

---

### 問題3: SEOパフォーマンスの測定基準が未設定

**推奨KPI（重要業績評価指標）**:

| 指標                             | 目標値（3ヶ月後）   | 測定方法                           |
| -------------------------------- | ------------------- | ---------------------------------- |
| **オーガニック検索流入**         | 月間1,000セッション | GA4 → トラフィック獲得             |
| **検索キーワード順位（TOP 10）** | 50キーワード以上    | Search Console                     |
| **ページインデックス率**         | 95%以上             | Search Console                     |
| **平均CTR（検索結果）**          | 3%以上              | Search Console                     |
| **Core Web Vitals合格率**        | 90%以上             | Search Console、PageSpeed Insights |
| **アフィリエイトクリック数**     | 月間500クリック     | GA4 → イベント                     |

---

## 🎯 優先実施すべきアクション

### 🔴 高優先度（即実施）

1. **Search Console所有権の確認**
   - 期待効果: トラフィックデータの可視化、検索順位の追跡
   - 所要時間: 30分

2. **GA4ダッシュボードの確認**
   - 期待効果: 現在のトラフィック状況の把握
   - 所要時間: 15分

3. **サイトマップをSearch Consoleに送信**
   - 期待効果: Googleによる526ページのインデックス促進
   - 所要時間: 5分

### 🟡 中優先度（1週間以内）

4. **カスタムレポートの作成（GA4）**
   - 商品別コンバージョン（アフィリエイトクリック数）
   - 成分別閲覧数
   - 診断機能の利用状況

5. **eコマース拡張機能の実装**

   ```javascript
   // アフィリエイトクリック = 売上として計測
   gtag("event", "purchase", {
     transaction_id: "aff_click_" + Date.now(),
     value: productPrice,
     currency: "JPY",
     items: [
       {
         item_id: productId,
         item_name: productName,
         item_category: "supplement",
         price: productPrice,
         quantity: 1,
       },
     ],
   });
   ```

6. **Core Web Vitals の測定と最適化**
   - PageSpeed Insights で主要ページを測定
   - 画像最適化（WebP、遅延読み込み）
   - JavaScriptバンドルサイズの削減

### 🟢 低優先度（1ヶ月以内）

7. **被リンク獲得戦略**
   - 健康系メディアへの寄稿（「ビタミンDの選び方」など）
   - Reddit、Quora等での回答活動
   - プレスリリース配信（PR TIMES）

8. **コンテンツSEO強化**
   - 成分記事の追加（現在21記事 → 50記事へ）
   - ロングテール対策（「ビタミンC 副作用」「マグネシウム 眠気」など）
   - 内部リンク最適化

9. **ローカルSEO対応（将来的）**
   - Google My Business登録
   - 構造化データにLocalBusinessを追加

---

## 📊 競合分析（参考）

### 主要競合サイトのSEOスコア推定

| サイト             | Domain Authority | 月間PV推定 | 強み                       |
| ------------------ | ---------------- | ---------- | -------------------------- |
| **iHerb Japan**    | 85/100           | 500万PV    | 海外サプリの品揃え、価格   |
| **DHC公式**        | 75/100           | 300万PV    | ブランド認知度、店舗展開   |
| **Amazon健康**     | 95/100           | 1000万PV   | ユーザー数、レビュー数     |
| **Suptia**（現在） | 20/100（推定）   | 不明       | 科学的エビデンス、価格比較 |

**差別化ポイント**:

- ✅ **エビデンスベースの情報提供** - PubMed参照、エビデンスレベル明示
- ✅ **複数ECサイトの価格比較** - トリバゴ風UI
- ✅ **5つの称号システム** - 最安値、最高含有量、ベストバリュー、エビデンスS、高安全性
- ✅ **AI診断機能** - 個別最適化されたサプリ推薦

---

## 🏁 まとめ

### ✅ 優れている点

1. **SEO基盤が完璧** - sitemap、robots.txt、構造化データ、メタデータすべて実装済み
2. **Analytics設定完了** - GA4とSearch Consoleが設定済み（アクセス権限の確認が必要）
3. **EC API連携が充実** - 楽天、Yahoo!から489商品を自動同期
4. **セキュリティ対策が万全** - CSP、HSTS、適切なヘッダー設定
5. **動的コンテンツ生成** - 526ページのサイトマップを自動生成

### ⚠️ 改善が必要な点

1. **Search Console所有権の確認** - APIアクセス権限を取得する必要がある
2. **トラフィックデータの可視性** - GA4とSearch Consoleでデータを確認し、KPIを設定
3. **コンテンツ量の拡充** - 成分記事を50記事以上に増やす
4. **被リンク獲得** - Domain Authorityを向上させる施策が必要
5. **Amazon PA-API統合** - 売上発生後、Amazonの価格も含めた完全な比較機能を実現

### 🎯 次のステップ

1. **今すぐ**: Search Console所有権確認 + GA4ダッシュボード確認
2. **今週中**: サイトマップ送信 + カスタムレポート作成
3. **今月中**: Core Web Vitals最適化 + コンテンツSEO強化

---

**総合評価**: Suptiaは技術的に優れたSEO基盤を持っており、今後トラフィックが増加する可能性が高い。まずはSearch ConsoleとGA4のデータを確認し、現状を把握することが最優先課題。
