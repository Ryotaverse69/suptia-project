# Google Analytics 4 & Search Console セットアップガイド

このガイドでは、SuptiaプロジェクトにGoogle Analytics 4（GA4）とGoogle Search Consoleを設定する手順を説明します。

---

## 📊 Google Analytics 4（GA4）の設定

### 1. Google Analyticsアカウントの作成

1. **Google Analyticsにアクセス**
   - https://analytics.google.com/ にアクセス
   - Googleアカウントでログイン

2. **アカウントを作成**
   - 左下の「管理」（歯車アイコン）をクリック
   - 「アカウントを作成」をクリック
   - アカウント名を入力（例：「Suptia」）
   - データ共有設定を確認して「次へ」

3. **プロパティを作成**
   - プロパティ名を入力（例：「Suptia Website」）
   - タイムゾーン：「日本」を選択
   - 通貨：「日本円（JPY）」を選択
   - 「次へ」をクリック

4. **ビジネス情報を入力**
   - 業種：「健康とフィットネス」または「その他」
   - ビジネスの規模：該当するものを選択
   - Analyticsの利用目的：適切なものを選択
   - 「作成」をクリック

5. **利用規約に同意**
   - 利用規約を確認して「同意する」

---

### 2. データストリームの設定

1. **ウェブストリームを作成**
   - 「ウェブ」を選択
   - ウェブサイトのURL：\`https://suptia.com\`
   - ストリーム名：「Suptia Web」
   - 「ストリームを作成」をクリック

2. **測定IDをコピー**
   - データストリーム詳細ページが表示されます
   - **測定ID**（\`G-XXXXXXXXXX\`形式）をコピー
   - このIDを\`.env.local\`に追加します

---

### 3. 環境変数の設定

プロジェクトの\`.env.local\`ファイルに測定IDを追加します：

\`\`\`bash

# apps/web/.env.local に追加

# Google Analytics 4

NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX # ← ここに測定IDを貼り付け
\`\`\`

**⚠️ 重要**:

- \`NEXT*PUBLIC*\` プレフィックスがあるため、この変数はクライアント側に公開されます
- 測定IDは公開情報なので、Gitにコミットしても問題ありません

---

### 4. 動作確認

1. **開発サーバーを起動**
   \`\`\`bash
   npm run dev
   \`\`\`

2. **ブラウザでサイトを開く**
   - http://localhost:3000 にアクセス

3. **リアルタイムレポートで確認**
   - Google Analyticsダッシュボードを開く
   - 左メニューから「レポート」→「リアルタイム」を選択
   - 自分のアクセスが表示されれば成功！

---

## 🔍 Google Search Console の設定

### 1. Search Console にアクセス

1. **Search Console を開く**
   - https://search.google.com/search-console にアクセス
   - Googleアカウントでログイン

2. **プロパティを追加**
   - 「プロパティを追加」をクリック
   - **URLプレフィックス**を選択
   - URL: \`https://suptia.com\` を入力
   - 「続行」をクリック

---

### 2. 所有権の確認（HTMLタグ方式・推奨）

1. **確認コードを取得**
   - 「その他の確認方法」→「HTMLタグ」を選択
   - \`<meta name="google-site-verification" content="XXXXXXXXXXXX" />\`
   - \`content\`の値（\`XXXXXXXXXXXX\`）をコピー

2. **環境変数に追加**
   \`\`\`bash

   # apps/web/.env.local に追加

   GOOGLE_SEARCH_CONSOLE_VERIFICATION=XXXXXXXXXXXX # ← ここにコードを貼り付け
   \`\`\`

3. **Vercel に環境変数を追加**
   - Vercelダッシュボードを開く
   - プロジェクト → Settings → Environment Variables
   - 新しい変数を追加:
     - Name: \`GOOGLE_SEARCH_CONSOLE_VERIFICATION\`
     - Value: \`XXXXXXXXXXXX\`
     - Environment: Production, Preview, Development すべて選択
   - 「Save」をクリック

4. **デプロイを確認**
   - Vercelが自動的に再デプロイします
   - デプロイ完了後、本番サイトにアクセスしてソースコードを確認
   - \`<head>\`内に以下のタグがあればOK:
     \`\`\`html
     <meta name="google-site-verification" content="XXXXXXXXXXXX" />
     \`\`\`

5. **Search Console で確認**
   - Search Console に戻る
   - 「確認」ボタンをクリック
   - 「所有権を確認しました」と表示されれば成功！

---

### 3. サイトマップの送信

1. **サイトマップURLを送信**
   - Search Console ダッシュボードを開く
   - 左メニューから「サイトマップ」を選択
   - 新しいサイトマップを追加: \`https://suptia.com/sitemap.xml\`
   - 「送信」をクリック

2. **インデックス登録**
   - URL検査ツールで個別ページのインデックス登録をリクエスト
   - 例: \`https://suptia.com/ingredients/vitamin-c\`

---

## ✅ チェックリスト

### Google Analytics 4

- [ ] GA4 プロパティを作成
- [ ] 測定ID（G-XXXXXXXXXX）を取得
- [ ] \`.env.local\` に \`NEXT_PUBLIC_GA_MEASUREMENT_ID\` を追加
- [ ] Vercel 環境変数に追加
- [ ] リアルタイムレポートで動作確認

### Google Search Console

- [ ] Search Console プロパティを追加
- [ ] 所有権を確認（HTMLタグ方式）
- [ ] \`.env.local\` に \`GOOGLE_SEARCH_CONSOLE_VERIFICATION\` を追加
- [ ] Vercel 環境変数に追加
- [ ] サイトマップ（\`/sitemap.xml\`）を送信
- [ ] URL インデックス登録をリクエスト

---

**最終更新**: 2025-10-24
