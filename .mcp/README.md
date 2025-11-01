# Suptia MCP統合ガイド

このディレクトリには、SuptiaプロジェクトでModel Context Protocol (MCP)を活用するための設定ファイルが含まれています。

## 📚 目次

- [概要](#概要)
- [Supabase MCP](#supabase-mcp)
- [Google Search Console MCP](#google-search-console-mcp)
- [セットアップ手順](#セットアップ手順)
- [活用例](#活用例)
- [トラブルシューティング](#トラブルシューティング)

---

## 概要

MCPは、Claudeが外部サービスと連携するためのプロトコルです。Suptiaでは以下の2つのMCPを活用します：

1. **Supabase MCP** - データベース、認証、リアルタイム機能
2. **Google Search Console MCP** - SEO分析、検索パフォーマンス監視

---

## 🗄️ Supabase MCP

### 機能

- PostgreSQLデータベースの操作（SELECT, INSERT, UPDATE, DELETE）
- テーブルスキーマの確認
- リアルタイムデータの取得

### Suptiaでの活用シナリオ

#### 1. ユーザー認証・プロファイル管理

```sql
-- ユーザープロファイルテーブル
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  allergies TEXT[], -- アレルギー情報
  health_goals TEXT[], -- 健康目標（美肌、睡眠改善など）
  concerns TEXT[], -- 懸念事項（妊娠中、薬併用など）
  created_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);
```

**Claude Code での使用例：**

```
「アレルギー情報が『大豆』のユーザーをSupabaseから取得して」
→ SELECT * FROM user_profiles WHERE 'soy' = ANY(allergies);
```

#### 2. 価格アラート機能

```sql
-- 価格アラートテーブル
CREATE TABLE price_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  product_id TEXT NOT NULL, -- Sanity商品ID
  target_price DECIMAL(10, 2) NOT NULL, -- 目標価格
  current_price DECIMAL(10, 2), -- 現在価格
  is_active BOOLEAN DEFAULT TRUE,
  notified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_price_alerts_user ON price_alerts(user_id);
CREATE INDEX idx_price_alerts_active ON price_alerts(is_active) WHERE is_active = TRUE;
```

**Claude Code での使用例：**

```
「DHC ビタミンCの価格が¥300以下になったらアラートを設定して」
→ INSERT INTO price_alerts (user_id, product_id, target_price)
   VALUES (auth.uid(), 'product-rakuten-tsuruha-10020349', 300);
```

#### 3. お気に入り商品

```sql
-- お気に入りテーブル
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  product_id TEXT NOT NULL,
  product_name TEXT,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
```

**Claude Code での使用例：**

```
「このユーザーのお気に入り商品を全て表示して」
→ SELECT * FROM favorites WHERE user_id = 'xxx' ORDER BY added_at DESC;
```

#### 4. 価格履歴トラッキング

```sql
-- 価格履歴テーブル（Sanityの補完）
CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL,
  source TEXT NOT NULL, -- rakuten, yahoo, amazon, iherb
  store_name TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10, 2),
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- パーティショニング（月別）
CREATE INDEX idx_price_history_product_time ON price_history(product_id, recorded_at DESC);
CREATE INDEX idx_price_history_source ON price_history(source);
```

**Claude Code での使用例：**

```
「DHC ビタミンCの過去30日間の価格推移をグラフ化して」
→ SELECT recorded_at, AVG(unit_price) as avg_price
   FROM price_history
   WHERE product_id = 'xxx' AND recorded_at > NOW() - INTERVAL '30 days'
   GROUP BY DATE_TRUNC('day', recorded_at)
   ORDER BY recorded_at;
```

#### 5. 診断結果の保存

```sql
-- 診断結果テーブル
CREATE TABLE diagnosis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  goals TEXT[], -- 目的
  concerns TEXT[], -- 懸念
  recommended_products JSONB, -- 推薦商品リスト
  scores JSONB, -- 各商品のスコア
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Claude Code での使用例：**

```
「このユーザーの過去の診断結果を分析して、トレンドを教えて」
→ SELECT goals, COUNT(*) as frequency
   FROM diagnosis_results
   WHERE user_id = 'xxx'
   GROUP BY goals;
```

---

## 📊 Google Search Console MCP

### 機能

- 検索パフォーマンスデータの取得（クエリ、クリック数、表示回数、CTR、順位）
- ページ別パフォーマンス分析
- インデックスカバレッジ確認
- サイトマップ状況確認

### Suptiaでの活用シナリオ

#### 1. SEOキーワード分析

**Claude Code での使用例：**

```
「過去30日間で表示回数が多いけどCTRが低いページを教えて」
→ GSCからデータ取得 → CTR < 2%かつ表示回数 > 1000のページをリスト化
→ タイトル・ディスクリプション改善案を提案
```

**出力例：**

```
低CTRページ:
1. /ingredients/magnesium
   - クエリ: "マグネシウム サプリ"
   - 表示: 5,200回, クリック: 78回, CTR: 1.5%, 順位: 8.2位
   - 改善案: タイトルに「おすすめ」「比較」を追加

2. /products/vitamin-d-1000
   - クエリ: "ビタミンD 最安値"
   - 表示: 3,800回, クリック: 57回, CTR: 1.5%, 順位: 6.1位
   - 改善案: ディスクリプションに具体的価格を記載
```

#### 2. 新規コンテンツ発見

**Claude Code での使用例：**

```
「検索クエリから、まだ記事を書いていない成分を特定して」
→ GSCで「サプリ」「成分」を含むクエリ取得
→ Sanityの既存成分記事と照合
→ 未カバーの成分をリスト化
```

**出力例：**

```
記事未作成の需要ある成分:
1. "NAC サプリ" - 1,200回/月
2. "CoQ10 効果" - 850回/月
3. "アスタキサンチン 疲労" - 620回/月

優先度: NAC（N-アセチルシステイン）の記事を作成
理由: 検索ボリューム最大、競合少ない
```

#### 3. インデックス監視

**Claude Code での使用例：**

```
「昨日公開した新商品ページがインデックスされているか確認して」
→ GSCでURL検査
→ インデックス状況、カバレッジエラーを確認
```

#### 4. Core Web Vitals分析

**Claude Code での使用例：**

```
「モバイルでのCore Web Vitalsが悪いページを特定して」
→ GSCからCWVデータ取得
→ LCP > 2.5s, FID > 100ms, CLS > 0.1のページをリスト
→ 改善優先順位を提案
```

#### 5. 競合分析

**Claude Code での使用例：**

```
「『ビタミンC サプリ おすすめ』で上位10位以内にランクインしている自社ページは？」
→ GSCで該当クエリの順位確認
→ 競合ページの分析・改善提案
```

---

## 🛠️ セットアップ手順

### 前提条件

- Claude Desktop またはClaude Code（VSCode拡張）がインストール済み
- Node.js v18以降
- Supabaseプロジェクト（無料プランでOK）
- Google Search Consoleプロパティ

---

### 1. Supabase MCPのセットアップ

#### ステップ1: Supabaseプロジェクト作成

1. [Supabase](https://supabase.com/)にサインアップ
2. 新規プロジェクトを作成
   - プロジェクト名: `suptia-production`
   - データベースパスワードを設定（保存しておく）
   - リージョン: `Northeast Asia (Tokyo)` 推奨

#### ステップ2: 認証情報取得

1. Supabaseダッシュボード → Settings → API
2. 以下をコピー：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Service Role Key**: `eyJhbGciOi...（長い文字列）`

⚠️ **重要**: Service Role Keyは**絶対に**公開リポジトリにコミットしないこと！

#### ステップ3: 環境変数設定

`apps/web/.env.local`に追加：

```bash
# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
```

#### ステップ4: Claude Desktop設定

Claude Desktopの設定ファイルを編集：

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

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

#### ステップ5: Claude Desktopを再起動

MCP設定を反映するため、Claude Desktopを完全に終了して再起動。

#### ステップ6: 動作確認

Claude Desktopで以下を試す：

```
「Supabaseに接続して、データベースのテーブル一覧を表示して」
```

成功すれば、`auth.users`, `storage.buckets`などのシステムテーブルが表示されます。

---

### 2. Google Search Console MCPのセットアップ

#### ステップ1: Google Cloud Projectセットアップ

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新規プロジェクト作成: `suptia-search-console`
3. APIとサービス → ライブラリ → **Google Search Console API**を有効化

#### ステップ2: OAuth 2.0認証情報作成

1. APIとサービス → 認証情報
2. 「認証情報を作成」→「OAuthクライアントID」
3. アプリケーションの種類: **デスクトップアプリ**
4. 名前: `Suptia Claude MCP`
5. 作成後、以下をコピー：
   - **クライアントID**: `xxxxx.apps.googleusercontent.com`
   - **クライアントシークレット**: `GOCSPX-xxxxx`

#### ステップ3: リフレッシュトークン取得

以下のスクリプトを実行してリフレッシュトークンを取得：

```bash
# OAuth認証URLを生成
node scripts/generate-google-auth-url.mjs
```

（スクリプトは後で作成します）

ブラウザで表示されたURLにアクセスし、Googleアカウントで認証。
認証コードをコピーして、スクリプトに貼り付け。
リフレッシュトークンが出力されます。

#### ステップ4: Claude Desktop設定

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

#### ステップ5: Claude Desktopを再起動

#### ステップ6: 動作確認

```
「Google Search Consoleから、Suptiaサイトの過去7日間の検索パフォーマンスを取得して」
```

---

## 💡 活用例

### 例1: 価格アラート設定

```
あなた: 「DHC ビタミンCの価格が¥350以下になったらアラートを設定して」

Claude: 「Supabaseのprice_alertsテーブルにアラートを追加しました：
- 商品: DHC ビタミンC ハードカプセル 60日分
- 目標価格: ¥350
- 現在価格: ¥388
- ステータス: 有効

価格が目標以下になったら通知します。」
```

### 例2: SEO改善提案

```
あなた: 「成分ページのSEOパフォーマンスを分析して、改善提案をして」

Claude: 「Google Search Consoleのデータを分析しました：

📊 トップパフォーマンス:
1. /ingredients/vitamin-c - CTR 8.2%, 順位 3.1位 ✅
2. /ingredients/omega-3 - CTR 6.5%, 順位 4.2位 ✅

⚠️ 改善が必要:
1. /ingredients/magnesium
   - 表示: 5,200回, CTR: 1.5%, 順位: 8.2位
   - 問題: タイトルが一般的すぎる
   - 提案: 『マグネシウムサプリの選び方｜睡眠・筋肉に効く理由を解説』に変更

2. /ingredients/vitamin-d
   - 表示: 3,800回, CTR: 1.8%, 順位: 7.5位
   - 問題: ディスクリプションに具体性が欠ける
   - 提案: 『1日の摂取量、効果、おすすめサプリを比較』を追加

📝 次のアクション:
1. マグネシウムページのタイトル変更
2. ビタミンDページのメタディスクリプション更新
3. 2週間後にCTR改善を確認」
```

### 例3: ユーザープロファイルベースの推薦

```
あなた: 「user_id=xxx のユーザーにおすすめの商品を提案して」

Claude: 「Supabaseからユーザープロファイルを取得しました：

👤 ユーザー情報:
- アレルギー: 大豆、乳製品
- 健康目標: 睡眠改善、疲労回復
- 懸念: なし

🎯 おすすめ商品（アレルギー除外済み）:
1. Now Foods マグネシウム 400mg
   - 理由: 睡眠改善に効果的、大豆・乳不使用
   - 価格: ¥1,850 (¥31/日)
   - 安全性: 95点

2. Doctor's Best L-テアニン 200mg
   - 理由: リラックス効果、疲労回復
   - 価格: ¥2,100 (¥35/日)
   - 安全性: 92点

❌ 除外した商品:
- DHC リラックス - 大豆由来成分含有」
```

---

## 🐛 トラブルシューティング

### Supabase MCP

**エラー: "Connection refused"**

- 原因: SUPABASE_URLが間違っている
- 解決: ダッシュボードでProject URLを再確認

**エラー: "Authentication failed"**

- 原因: Service Role Keyが間違っているか期限切れ
- 解決: 新しいService Role Keyを発行

**テーブルが表示されない**

- 原因: Row Level Security (RLS)が有効
- 解決: Service Role Keyは RLS をバイパスするので問題ないはず。RLSポリシーを確認

### Google Search Console MCP

**エラー: "Invalid refresh token"**

- 原因: リフレッシュトークンが期限切れ
- 解決: OAuth認証を再実行してトークン再取得

**エラー: "Property not found"**

- 原因: Search ConsoleにサイトURLが登録されていない
- 解決: Search Consoleでプロパティを追加

**データが取得できない**

- 原因: APIが有効化されていない
- 解決: Google Cloud ConsoleでSearch Console APIを有効化

---

## 📖 参考リンク

- [Supabase公式ドキュメント](https://supabase.com/docs)
- [Google Search Console API](https://developers.google.com/webmaster-tools/search-console-api-original)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP Servers GitHub](https://github.com/modelcontextprotocol/servers)

---

**最終更新**: 2025-11-01
**バージョン**: 1.0.0
