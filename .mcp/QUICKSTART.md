# MCP クイックスタートガイド

## 🚀 5分でセットアップ

### Supabase MCP

#### 1. Supabaseアカウント作成（1分）

1. https://supabase.com/ にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントでサインアップ

#### 2. プロジェクト作成（1分）

1. 「New Project」をクリック
2. 以下を入力：
   - プロジェクト名: `suptia-production`
   - データベースパスワード: **強力なパスワードを設定（保存しておく）**
   - リージョン: `Northeast Asia (Tokyo)`
3. 「Create new project」をクリック（2-3分待つ）

#### 3. 認証情報取得（30秒）

1. ダッシュボード → **Settings** → **API**
2. 以下をコピー：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Service Role Key**: `eyJhbGci...`（長い文字列）

#### 4. データベーススキーマ作成（1分）

1. ダッシュボード → **SQL Editor**
2. 新規クエリを作成
3. `.mcp/supabase-schema.sql` の内容をコピペ
4. 「Run」をクリック
5. 成功メッセージを確認

#### 5. Claude Desktop設定（1分）

**macOS**:

```bash
open ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Windows**:

```bash
notepad %APPDATA%\Claude\claude_desktop_config.json
```

以下を追加：

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "https://your-project-id.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "your-service-role-key"
      }
    }
  }
}
```

⚠️ `your-project-id` と `your-service-role-key` を実際の値に置き換え！

#### 6. Claude Desktopを再起動

完全に終了して再起動。

#### 7. 動作確認（30秒）

Claude Desktopで以下を試す：

```
Supabaseに接続して、テーブル一覧を表示して
```

成功すれば、`user_profiles`, `price_alerts`, `favorites` などのテーブルが表示されます！

---

### Google Search Console MCP

#### 1. Google Cloud Projectセットアップ（2分）

1. https://console.cloud.google.com/ にアクセス
2. 新規プロジェクト作成: `suptia-search-console`
3. APIとサービス → ライブラリ
4. 「Google Search Console API」を検索して有効化

#### 2. OAuth 2.0認証情報作成（2分）

1. APIとサービス → 認証情報
2. 「認証情報を作成」→「OAuthクライアントID」
3. アプリケーションの種類: **デスクトップアプリ**
4. 名前: `Suptia Claude MCP`
5. 作成後、以下をコピー：
   - **クライアントID**: `xxxxx.apps.googleusercontent.com`
   - **クライアントシークレット**: `GOCSPX-xxxxx`

#### 3. リフレッシュトークン取得（2分）

プロジェクトルートで以下を実行：

```bash
node scripts/generate-google-auth-url.mjs
```

1. クライアントIDとシークレットを入力
2. 表示されたURLをブラウザで開く
3. Googleアカウントで認証
4. 認証コードをコピーしてスクリプトに貼り付け
5. リフレッシュトークンが表示される

#### 4. Claude Desktop設定（1分）

`claude_desktop_config.json` に追加：

```json
{
  "mcpServers": {
    "supabase": { ... },
    "google-search-console": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-google-search-console"],
      "env": {
        "GOOGLE_CLIENT_ID": "xxxxx.apps.googleusercontent.com",
        "GOOGLE_CLIENT_SECRET": "GOCSPX-xxxxx",
        "GOOGLE_REFRESH_TOKEN": "1//xxxxx"
      }
    }
  }
}
```

#### 5. Claude Desktopを再起動

#### 6. 動作確認（30秒）

```
Google Search Consoleから、過去7日間の検索パフォーマンスを取得して
```

成功すれば、クリック数、表示回数、CTR、順位が表示されます！

---

## 💡 最初に試すべきクエリ

### Supabase

```
1. テーブル一覧を表示して

2. user_profilesテーブルに新しいプロファイルを追加して：
   - アレルギー: 大豆、乳製品
   - 健康目標: 睡眠改善、免疫力向上

3. price_alertsテーブルから、アクティブなアラートを全て取得して

4. favoritesテーブルに商品を追加して：
   - 商品ID: product-rakuten-tsuruha-10020349
   - 商品名: DHC ビタミンC
```

### Google Search Console

```
1. 過去7日間の検索パフォーマンスを表示して

2. クリック数が多いクエリトップ10を教えて

3. 表示回数が多いけどCTRが低いページを特定して

4. /ingredients/ 配下のページのパフォーマンスを表示して
```

---

## 🐛 トラブルシューティング

### 「MCP server not found」エラー

**原因**: Claude Desktopを再起動していない

**解決**:

1. Claude Desktopを完全に終了（Cmd+Q / Alt+F4）
2. 再起動

### Supabaseの「Connection refused」エラー

**原因**: SUPABASE_URLが間違っている

**解決**:

1. Supabaseダッシュボード → Settings → API
2. Project URLをコピーし直す
3. `claude_desktop_config.json` を修正
4. Claude Desktopを再起動

### Google Search Consoleの「Invalid refresh token」エラー

**原因**: リフレッシュトークンが期限切れ

**解決**:

1. `node scripts/generate-google-auth-url.mjs` を再実行
2. 新しいリフレッシュトークンを取得
3. `claude_desktop_config.json` を更新
4. Claude Desktopを再起動

---

## 📚 次のステップ

1. [.mcp/README.md](.mcp/README.md) - 詳細ガイド
2. [.mcp/example-queries.md](.mcp/example-queries.md) - 実際に使えるクエリ集
3. [CLAUDE.md](../CLAUDE.md#-model-context-protocol-mcp-統合) - プロジェクト全体のMCP統合

---

**作成日**: 2025-11-01
