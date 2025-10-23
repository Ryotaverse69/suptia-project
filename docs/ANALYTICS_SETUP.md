# Analytics & SEO セットアップガイド

このガイドでは、Google Analytics 4（GA4）、Google Search Console、Vercel Analyticsのセットアップ手順を説明します。

## 目次

1. [Google Analytics 4 セットアップ](#google-analytics-4-セットアップ)
2. [Google Search Console セットアップ](#google-search-console-セットアップ)
3. [Vercel Analytics セットアップ](#vercel-analytics-セットアップ)
4. [動作確認](#動作確認)
5. [トラブルシューティング](#トラブルシューティング)

---

## Google Analytics 4 セットアップ

### 1. GA4プロパティの作成

1. [Google Analytics](https://analytics.google.com/)にアクセスしてログイン
2. 左下の「管理」（歯車アイコン）をクリック
3. 「アカウント」列で「+ アカウントを作成」をクリック
   - アカウント名: `Suptia`
   - データ共有設定: デフォルトのまま
4. 「次へ」をクリック
5. プロパティ名: `Suptia Website`
6. タイムゾーン: `日本`
7. 通貨: `日本円（JPY）`
8. 「次へ」をクリック
9. ビジネスの詳細を入力
   - 業種: `ヘルス＆フィットネス`
   - ビジネスの規模: `小規模（従業員1〜10人）`
10. 「作成」をクリック

### 2. データストリームの作成

1. プロパティ設定画面で「データストリーム」をクリック
2. 「ストリームを追加」→「ウェブ」を選択
3. ウェブサイトの情報を入力:
   - ウェブサイトのURL: `https://suptia.com`
   - ストリーム名: `Suptia Web`
4. 「ストリームを作成」をクリック
5. **測定ID（G-XXXXXXXXXX）をコピー**

### 3. 環境変数の設定

測定IDを環境変数に設定します。

#### ローカル開発環境

`.env.local` ファイルを作成・編集:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### Vercel本番環境

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. プロジェクト（suptia-project）を選択
3. 「Settings」→「Environment Variables」
4. 新しい変数を追加:
   - Key: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - Value: `G-XXXXXXXXXX`（コピーした測定ID）
   - Environment: `Production`, `Preview`, `Development` 全てにチェック
5. 「Save」をクリック
6. 再デプロイ（Deploymentsタブ→最新デプロイの右側メニュー→「Redeploy」）

### 4. 拡張測定機能の有効化（推奨）

GA4では以下のイベントを自動で計測できます:

1. データストリーム詳細画面で「拡張計測機能」をクリック
2. 以下の項目を有効化:
   - ✅ ページビュー（デフォルトで有効）
   - ✅ スクロール数
   - ✅ 離脱クリック（外部リンク）
   - ✅ サイト内検索
   - ✅ 動画エンゲージメント
   - ✅ ファイルのダウンロード
3. 「保存」をクリック

### 5. トラッキング対象イベント

Suptiaアプリで自動的にトラッキングされるイベント:

#### ページビュー

- 自動計測（全ページ）
- ルート変更時に自動送信

#### カスタムイベント

- `view_item`: 商品詳細ページ閲覧
- `select_item`: 商品リンククリック（外部ECサイトへ）
- `search`: サイト内検索
- `filter_used`: フィルター使用
- `diagnosis_start`: 診断開始
- `diagnosis_complete`: 診断完了
- `price_alert_created`: 価格アラート登録
- `favorite_added`: お気に入り追加
- `ingredient_view`: 成分ガイド閲覧
- `form_submit`: フォーム送信
- `click`: アウトバウンドリンククリック

---

## Google Search Console セットアップ

### 1. プロパティの追加

1. [Google Search Console](https://search.google.com/search-console)にアクセス
2. 「プロパティを追加」をクリック
3. 「URLプレフィックス」を選択
4. URL: `https://suptia.com` を入力
5. 「続行」をクリック

### 2. 所有権の確認

複数の確認方法があります。おすすめは「HTMLタグ」または「Googleアナリティクス」です。

#### 方法1: HTMLタグ（推奨）

1. 確認方法で「HTMLタグ」を選択
2. メタタグをコピー:
   ```html
   <meta name="google-site-verification" content="xxxxxxxxxxxxxxxxxxxxxx" />
   ```
3. `apps/web/src/app/layout.tsx` の `<head>` 内に追加（Next.jsの場合はmetadataで追加）:
   ```typescript
   export const metadata: Metadata = {
     // ... 既存の設定
     verification: {
       google: "xxxxxxxxxxxxxxxxxxxxxx", // contentの値のみ
     },
   };
   ```
4. デプロイ後、「確認」ボタンをクリック

#### 方法2: Googleアナリティクス（最も簡単）

1. 確認方法で「Googleアナリティクス」を選択
2. GA4がすでに設定されている場合、自動的に確認されます
3. 「確認」ボタンをクリック

#### 方法3: HTMLファイル

1. 確認方法で「HTMLファイル」を選択
2. 確認ファイル（例: `googleXXXXXXXXXXXXXXXX.html`）をダウンロード
3. `apps/web/public/` ディレクトリに配置
4. デプロイ後、ブラウザで `https://suptia.com/googleXXXXXXXXXXXXXXXX.html` にアクセスして確認
5. Search Consoleで「確認」ボタンをクリック

### 3. サイトマップの送信

1. Search Consoleの左メニューで「サイトマップ」を選択
2. 「新しいサイトマップの追加」に以下を入力:
   ```
   https://suptia.com/sitemap.xml
   ```
3. 「送信」をクリック
4. ステータスが「成功しました」になるまで待つ（数時間〜数日かかる場合があります）

### 4. URL検査ツールの活用

新しいページを公開したら、URL検査ツールで即座にインデックスをリクエストできます:

1. 左メニューで「URL検査」を選択
2. 検査したいURLを入力（例: `https://suptia.com/ingredients/vitamin-c`）
3. 「インデックス登録をリクエスト」をクリック

---

## Vercel Analytics セットアップ

Vercel Analyticsは**プライバシーファースト**な分析ツールで、Cookieを使用せず、GDPRに完全準拠しています。

### 1. Vercel Analyticsの有効化

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. プロジェクト（suptia-project）を選択
3. 「Analytics」タブをクリック
4. 「Enable Analytics」をクリック
5. プランを選択:
   - **Hobby（無料）**: 2,500イベント/月
   - **Pro（$20/月）**: 100,000イベント/月

### 2. Web Vitalsの有効化

Web Vitals（Core Web Vitals）は、Googleの検索ランキング要因です。

1. 「Analytics」タブで「Enable Web Analytics」をクリック
2. 以下のメトリクスが自動計測されます:
   - **LCP（Largest Contentful Paint）**: 最大コンテンツの描画時間
   - **FID（First Input Delay）**: 初回入力遅延
   - **CLS（Cumulative Layout Shift）**: レイアウトシフト累積
   - **FCP（First Contentful Paint）**: 初回コンテンツの描画時間
   - **TTFB（Time to First Byte）**: 最初のバイトまでの時間

### 3. Speed Insightsの有効化

1. 「Speed Insights」タブで「Enable Speed Insights」をクリック
2. リアルユーザーのパフォーマンスデータが収集されます

### 4. ダッシュボードの確認

Vercel Analyticsダッシュボードでは以下を確認できます:

- **ページビュー**: ページごとのトラフィック
- **トップパス**: 人気のページ
- **リファラー**: 訪問元サイト
- **デバイス**: デスクトップ/モバイル比率
- **ブラウザ**: Chrome/Safari/Firefox等の分布
- **地理情報**: 国・地域別のトラフィック
- **Web Vitals**: Core Web Vitalsスコア

---

## 動作確認

### GA4の動作確認

#### 1. リアルタイムレポート

1. [Google Analytics](https://analytics.google.com/)にアクセス
2. 左メニューで「レポート」→「リアルタイム」を選択
3. 別のブラウザで `https://suptia.com` を開く
4. リアルタイムレポートにアクティブユーザーが表示されることを確認

#### 2. デバッグモード（開発環境）

ブラウザのDevToolsコンソールで以下を確認:

```javascript
// gtagが正しく読み込まれているか確認
console.log(typeof window.gtag); // "function" と表示されればOK

// dataLayerを確認
console.log(window.dataLayer); // 配列が表示されればOK
```

#### 3. GA Debugger拡張機能

1. [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) をインストール
2. 拡張機能を有効化
3. サイトを開いてDevToolsコンソールを確認
4. GAイベントの詳細ログが表示されます

### Search Consoleの動作確認

1. Search Consoleで「カバレッジ」レポートを確認
2. インデックス登録されたページ数を確認（数日後）
3. 「検索パフォーマンス」でクリック数・表示回数を確認（1週間後）

### Vercel Analyticsの動作確認

1. Vercelダッシュボードの「Analytics」タブを開く
2. ページビューが記録されていることを確認（数分後）
3. Web Vitalsスコアを確認（数時間後）

---

## トラブルシューティング

### GA4でデータが表示されない

**原因1: 測定IDが間違っている**

- `.env.local` とVercel環境変数を確認
- `G-` で始まる正しい形式か確認

**原因2: 広告ブロッカーが有効**

- 広告ブロッカー（uBlock Origin, AdBlock等）を無効化
- またはシークレットモードで確認

**原因3: デプロイが完了していない**

- Vercelダッシュボードで最新デプロイが成功しているか確認
- 環境変数追加後は再デプロイが必要

**原因4: スクリプトの読み込みエラー**

- ブラウザのDevToolsコンソールでエラーを確認
- Content Security Policy (CSP) エラーの場合は、`next.config.js` を確認

### Search Consoleで「所有権を確認できませんでした」

**原因1: 確認タグが正しく設置されていない**

- ページのHTMLソースを表示して、metaタグが存在するか確認
- Next.jsの場合、metadataで正しく設定されているか確認

**原因2: サイトがまだデプロイされていない**

- 本番環境（https://suptia.com）で確認タグが表示されるか確認
- Vercelでデプロイが完了しているか確認

**原因3: robots.txtでGooglebotがブロックされている**

- `https://suptia.com/robots.txt` を確認
- `Disallow: /` がないことを確認

### Vercel Analyticsでデータが表示されない

**原因1: Analyticsが有効化されていない**

- Vercelダッシュボードで「Enable Analytics」をクリックしたか確認

**原因2: トラフィックが少ない**

- Vercel Analyticsはサンプリングを使用するため、トラフィックが少ないと表示されない場合があります
- 数回ページを読み込んで、数分待ってから確認

**原因3: プランの制限**

- Hobbyプランは2,500イベント/月まで
- 制限を超えた場合は、Proプランへのアップグレードを検討

---

## 参考リンク

- [Google Analytics 4 ヘルプ](https://support.google.com/analytics/answer/9304153)
- [Google Search Console ヘルプ](https://support.google.com/webmasters/answer/9128668)
- [Vercel Analytics ドキュメント](https://vercel.com/docs/analytics)
- [Next.js Analytics ドキュメント](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [Web Vitals について](https://web.dev/vitals/)

---

**最終更新日**: 2025-10-23
**担当者**: Claude Code
