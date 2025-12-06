# Suptia SNS自動投稿システム 設計仕様書

## 概要

Suptiaプラットフォームの成分・商品データを活用し、X (Twitter)、Instagram、Threadsへ毎日自動投稿するシステム。

## 要件

### 基本要件

- **投稿頻度**: 1日1投稿（各プラットフォーム）
- **予算**: 月$10以下
- **自動化レベル**: 完全自動（GitHub Actions）
- **コンテンツソース**: Sanity CMSの成分・商品データ

### 対象プラットフォーム

| プラットフォーム | API           | 無料枠     | 状態                  |
| ---------------- | ------------- | ---------- | --------------------- |
| X (Twitter)      | X API v2 Free | 月500投稿  | 🔄 アカウント作成待ち |
| Instagram        | Graph API     | 制限緩め   | 🔄 アカウント作成待ち |
| Threads          | Threads API   | 1日250投稿 | 🔄 アカウント作成待ち |

## 費用見積もり

| 項目                   | 月額費用             |
| ---------------------- | -------------------- |
| X API                  | 無料                 |
| Instagram API          | 無料                 |
| Threads API            | 無料                 |
| GitHub Actions         | 無料（月2000分以内） |
| Claude API（投稿生成） | 約$2〜3              |
| **合計**               | **約$2〜3/月**       |

---

## アーキテクチャ

### ディレクトリ構造

```
suptia-project/
├── scripts/
│   └── sns-automation/              # 🆕 新規追加
│       ├── index.ts                 # メインエントリ
│       ├── post-generator.ts        # 投稿文生成（Claude API）
│       ├── platforms/
│       │   ├── x.ts                 # X API クライアント
│       │   ├── instagram.ts         # Instagram Graph API クライアント
│       │   └── threads.ts           # Threads API クライアント
│       ├── templates/               # 投稿テンプレート（フォールバック用）
│       │   ├── ingredient-tips.ts
│       │   ├── product-highlight.ts
│       │   └── safety-alert.ts
│       └── types.ts                 # 型定義
├── .github/
│   └── workflows/
│       └── sns-post.yml             # 🆕 毎日実行ワークフロー
└── .env.local                       # 環境変数（追加）
```

### データフロー

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions                           │
│                  （毎日 JST 9:00 実行）                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              1. Sanityからデータ取得                         │
│    - ランダムな成分 or 商品を1件選択                          │
│    - 最近投稿したものは除外（重複防止）                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              2. 投稿コンテンツ生成                            │
│    - Claude API で投稿文を生成                               │
│    - プラットフォームごとに最適化                             │
│      - X: 280文字以内                                       │
│      - Instagram: 2200文字以内 + ハッシュタグ                 │
│      - Threads: 500文字以内                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              3. 各プラットフォームへ投稿                      │
│    - X API v2 (OAuth 1.0a)                                 │
│    - Instagram Graph API                                    │
│    - Threads API                                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              4. ログ記録                                     │
│    - 投稿成功/失敗をログ出力                                  │
│    - Supabaseに投稿履歴を保存（オプション）                   │
└─────────────────────────────────────────────────────────────┘
```

---

## API仕様

### X (Twitter) API v2

**エンドポイント**: `POST https://api.twitter.com/2/tweets`

**認証**: OAuth 1.0a（Read and Write権限必須）

**必要なキー**:

- `X_API_KEY`
- `X_API_KEY_SECRET`
- `X_ACCESS_TOKEN`
- `X_ACCESS_TOKEN_SECRET`

**リクエスト例**:

```typescript
const response = await fetch("https://api.twitter.com/2/tweets", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `OAuth ${generateOAuthHeader()}`,
  },
  body: JSON.stringify({ text: "投稿内容" }),
});
```

**制限**:

- 無料プラン: 月500投稿、100読み取り
- 1日1投稿なら余裕

---

### Threads API

**エンドポイント**: `POST https://graph.threads.net/v1.0/{user_id}/threads`

**認証**: Bearer Token

**必要なキー**:

- `THREADS_USER_ID`
- `THREADS_ACCESS_TOKEN`（長期トークン推奨）

**必要なスコープ**:

- `threads_basic`
- `threads_content_publish`

**リクエスト例**:

```typescript
// Step 1: コンテナ作成
const createResponse = await fetch(
  `https://graph.threads.net/v1.0/${userId}/threads`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      media_type: "TEXT",
      text: "投稿内容",
    }),
  },
);
const { id: containerId } = await createResponse.json();

// Step 2: 公開
const publishResponse = await fetch(
  `https://graph.threads.net/v1.0/${userId}/threads_publish`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      creation_id: containerId,
    }),
  },
);
```

**制限**:

- 1日最大250投稿
- アクセストークンは60日で期限切れ → 長期トークンに交換推奨

---

### Instagram Graph API

**エンドポイント**:

- コンテナ作成: `POST https://graph.facebook.com/v18.0/{ig_user_id}/media`
- 公開: `POST https://graph.facebook.com/v18.0/{ig_user_id}/media_publish`

**認証**: Bearer Token（Facebook Page Token）

**必要なキー**:

- `INSTAGRAM_USER_ID`
- `INSTAGRAM_ACCESS_TOKEN`

**注意**:

- Instagramは画像必須（テキストのみ投稿不可）
- 画像URLは公開アクセス可能である必要あり

**リクエスト例（画像付き投稿）**:

```typescript
// Step 1: コンテナ作成
const createResponse = await fetch(
  `https://graph.facebook.com/v18.0/${igUserId}/media`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_url: "https://example.com/image.jpg",
      caption: "投稿テキスト #ハッシュタグ",
    }),
  },
);
const { id: containerId } = await createResponse.json();

// Step 2: 公開
const publishResponse = await fetch(
  `https://graph.facebook.com/v18.0/${igUserId}/media_publish`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      creation_id: containerId,
    }),
  },
);
```

---

## 環境変数

`.env.local` に追加する変数:

```bash
# X (Twitter) API
X_API_KEY=your_api_key
X_API_KEY_SECRET=your_api_key_secret
X_ACCESS_TOKEN=your_access_token
X_ACCESS_TOKEN_SECRET=your_access_token_secret

# Threads API
THREADS_USER_ID=your_user_id
THREADS_ACCESS_TOKEN=your_long_lived_access_token

# Instagram API
INSTAGRAM_USER_ID=your_ig_user_id
INSTAGRAM_ACCESS_TOKEN=your_access_token

# Claude API（投稿生成用）
ANTHROPIC_API_KEY=your_anthropic_api_key
```

---

## GitHub Actions ワークフロー

`.github/workflows/sns-post.yml`:

```yaml
name: SNS Auto Post

on:
  schedule:
    # 毎日 JST 9:00 (UTC 0:00) に実行
    - cron: "0 0 * * *"
  workflow_dispatch: # 手動実行も可能

jobs:
  post:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run SNS posting script
        env:
          # Sanity
          SANITY_API_TOKEN: ${{ secrets.SANITY_API_TOKEN }}
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_SANITY_PROJECT_ID }}
          NEXT_PUBLIC_SANITY_DATASET: ${{ secrets.NEXT_PUBLIC_SANITY_DATASET }}

          # X (Twitter)
          X_API_KEY: ${{ secrets.X_API_KEY }}
          X_API_KEY_SECRET: ${{ secrets.X_API_KEY_SECRET }}
          X_ACCESS_TOKEN: ${{ secrets.X_ACCESS_TOKEN }}
          X_ACCESS_TOKEN_SECRET: ${{ secrets.X_ACCESS_TOKEN_SECRET }}

          # Threads
          THREADS_USER_ID: ${{ secrets.THREADS_USER_ID }}
          THREADS_ACCESS_TOKEN: ${{ secrets.THREADS_ACCESS_TOKEN }}

          # Instagram
          INSTAGRAM_USER_ID: ${{ secrets.INSTAGRAM_USER_ID }}
          INSTAGRAM_ACCESS_TOKEN: ${{ secrets.INSTAGRAM_ACCESS_TOKEN }}

          # Claude API
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: npx tsx scripts/sns-automation/index.ts
```

---

## 投稿コンテンツ生成

### Claude API プロンプト例

```typescript
const generatePostContent = async (ingredient: Ingredient) => {
  const prompt = `
あなたはサプリメント専門家です。以下の成分情報を元に、SNS投稿を作成してください。

【成分情報】
名前: ${ingredient.name}
効果: ${ingredient.benefits.join(", ")}
推奨摂取量: ${ingredient.recommendedDosage}

【ルール】
- 薬機法を遵守（「治る」「予防する」は禁止）
- 「サポート」「役立つ可能性」などの表現を使用
- 親しみやすいトーンで
- 絵文字を適度に使用

【出力形式】
以下の3つの形式で出力してください：

1. X用（280文字以内）:
2. Instagram用（2200文字以内、ハッシュタグ5個含む）:
3. Threads用（500文字以内）:
`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  return parseResponse(response);
};
```

### 投稿テンプレート（フォールバック）

Claude APIが使えない場合のテンプレート:

```typescript
// templates/ingredient-tips.ts
export const ingredientTipTemplates = [
  "💊 今日のサプリ豆知識\n\n【${name}】\n${benefits[0]}\n\n詳しくはプロフィールのリンクから👆",
  "🔬 ${name}って知ってる？\n\n${benefits[0]}といわれています。\n\n#サプリメント #健康 #${name}",
  // ... more templates
];
```

---

## アカウント作成手順

### 1. X Developer Portal

1. https://developer.x.com にアクセス
2. Suptia用Xアカウントでログイン
3. 「Sign up for Free Account」をクリック
4. 利用目的を入力（250文字以上、英語）:
   ```
   I am building an automated posting system for Suptia,
   a supplement comparison platform. The system will post
   daily educational content about supplements, including
   ingredient information, safety tips, and product comparisons.
   All posts will be original content generated from our database.
   We will not use the API for spam, automated replies,
   or any abusive purposes.
   ```
5. 承認後、プロジェクト＆アプリ作成
6. **Settings → User authentication settings**:
   - OAuth 1.0a を有効化
   - App permissions を「Read and Write」に設定
   - Callback URL: `https://suptia.jp/callback`
7. Keys and Tokens タブから4つのキーを取得

### 2. Meta for Developers（Instagram + Threads）

1. https://developers.facebook.com にアクセス
2. Facebookアカウントでログイン
3. 開発者登録を完了
4. 「アプリを作成」→「その他」→「ビジネス」
5. アプリ名: `Suptia SNS`
6. **Threads API を追加**:
   - 「製品を追加」→「Threads API」
   - スコープ追加: `threads_content_publish`
7. **テストユーザー追加**:
   - 「アプリの役割」→「役割」
   - 自分のThreadsアカウントをテスターとして追加
8. **アクセストークン取得**:
   ```
   https://threads.net/oauth/authorize?client_id=YOUR_APP_ID&redirect_uri=https://oauth.pstmn.io/v1/callback&scope=threads_basic,threads_content_publish&response_type=code
   ```
9. 短期トークン → 長期トークンに交換

---

## 実装優先順位

### Phase 1: 基盤構築

1. [ ] X Developer アカウント作成・キー取得
2. [ ] Meta for Developers アカウント作成・キー取得
3. [ ] 環境変数設定
4. [ ] 基本的なAPI接続テスト

### Phase 2: コア実装

1. [ ] Sanityからのデータ取得モジュール
2. [ ] X投稿モジュール
3. [ ] Threads投稿モジュール
4. [ ] Instagram投稿モジュール（画像生成含む）
5. [ ] Claude API連携（投稿文生成）

### Phase 3: 自動化

1. [ ] GitHub Actions ワークフロー設定
2. [ ] エラーハンドリング・リトライ機構
3. [ ] 投稿履歴管理（重複防止）
4. [ ] Slack/Discord通知（オプション）

### Phase 4: 改善

1. [ ] 投稿パフォーマンス分析
2. [ ] A/Bテスト機能
3. [ ] 画像自動生成（Canva API等）

---

## 注意事項

### 薬機法コンプライアンス

投稿内容は必ず以下のルールに従うこと:

**禁止表現**:

- ❌ 「治る」「治療する」「予防する」
- ❌ 「効果がある」（断定）
- ❌ 医療効果の暗示

**推奨表現**:

- ✅ 「〜をサポート」
- ✅ 「〜に役立つ可能性」
- ✅ 「〜といわれています」
- ✅ 「個人差があります」

### レート制限

| プラットフォーム | 制限        | 対策                 |
| ---------------- | ----------- | -------------------- |
| X                | 月500投稿   | 1日1投稿なら問題なし |
| Threads          | 1日250投稿  | 問題なし             |
| Instagram        | 1時間25投稿 | 問題なし             |

### トークン更新

- **Threads**: 長期トークンも60日で期限切れ → 定期的に更新するワークフロー追加推奨
- **Instagram**: 同様に定期更新が必要

---

## 参考リンク

- [X API v2 ドキュメント](https://developer.twitter.com/en/docs/twitter-api)
- [Threads API ドキュメント](https://developers.facebook.com/docs/threads)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [Claude API](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)

---

**作成日**: 2025-12-06
**ステータス**: アカウント作成待ち
