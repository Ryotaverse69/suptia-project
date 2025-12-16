# セキュリティチェックリスト

## 目次

1. [XSS (Cross-Site Scripting)](#1-xss-cross-site-scripting)
2. [インジェクション攻撃](#2-インジェクション攻撃)
3. [認証・認可](#3-認証認可)
4. [シークレット管理](#4-シークレット管理)
5. [依存関係](#5-依存関係)
6. [セキュリティヘッダー](#6-セキュリティヘッダー)
7. [データ検証](#7-データ検証)
8. [Next.js固有](#8-nextjs固有)
9. [Supabase固有](#9-supabase固有)

---

## 1. XSS (Cross-Site Scripting)

### Critical パターン

```
# dangerouslySetInnerHTML の使用
dangerouslySetInnerHTML

# innerHTML の直接設定
\.innerHTML\s*=

# eval() の使用
\beval\s*\(

# Function コンストラクタ
new\s+Function\s*\(
```

### 確認ポイント

- ユーザー入力がHTMLとしてレンダリングされていないか
- URLパラメータが直接DOMに挿入されていないか
- サードパーティスクリプトの動的読み込み

---

## 2. インジェクション攻撃

### SQL インジェクション

```
# 文字列結合によるクエリ構築
\$\{.*\}.*(?:SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)
`.*(?:SELECT|INSERT|UPDATE|DELETE).*\$\{

# 危険なクエリパターン
\.query\s*\(\s*`
\.raw\s*\(\s*`
```

### コマンドインジェクション

```
# 危険な関数
child_process
\bexec\s*\(
\bexecSync\s*\(
\bspawn\s*\(
\bspawnSync\s*\(
```

### パストラバーサル

```
# ユーザー入力を含むファイルパス
path\.join\(.*req\.
fs\.(read|write).*\$\{
```

---

## 3. 認証・認可

### 確認すべきファイル

- `middleware.ts` / `middleware.js`
- `app/api/**/route.ts`
- 認証関連: `auth`, `login`, `session`

### 危険パターン

```
# 認証チェックのスキップ
// @ts-ignore
// eslint-disable

# ハードコードされたユーザーID
userId\s*[:=]\s*["'][^"']+["']

# セッション検証の欠如（APIルート内）
export\s+(async\s+)?function\s+(GET|POST|PUT|DELETE|PATCH)
```

### チェックポイント

- [ ] 全APIルートで認証チェックが実装されているか
- [ ] 管理者専用エンドポイントの権限チェック
- [ ] セッショントークンの適切な検証
- [ ] CSRF対策の実装

---

## 4. シークレット管理

### 漏洩パターン

```
# APIキー
(api[_-]?key|apikey)\s*[:=]\s*["']?[a-zA-Z0-9_-]{20,}

# シークレット・パスワード
(secret|password|passwd|pwd)\s*[:=]\s*["'][^"']{8,}["']

# トークン
(token|bearer|jwt)\s*[:=]\s*["'][^"']{20,}["']

# AWS認証情報
AKIA[0-9A-Z]{16}
aws_secret_access_key

# データベースURL
(postgres|mysql|mongodb)://[^"\s]+

# Supabase
(supabase|SUPABASE).*["'][a-zA-Z0-9._-]{30,}["']
```

### 確認ポイント

- [ ] `.env`ファイルが`.gitignore`に含まれているか
- [ ] クライアントサイドコードにシークレットが露出していないか
- [ ] `NEXT_PUBLIC_`プレフィックスの適切な使用

---

## 5. 依存関係

### チェックコマンド

```bash
# npm audit
npm audit --json

# 古いパッケージの確認
npm outdated
```

### 確認ポイント

- [ ] 既知の脆弱性を持つパッケージがないか
- [ ] 不要な依存関係が含まれていないか
- [ ] `package-lock.json`がコミットされているか

---

## 6. セキュリティヘッダー

### 推奨ヘッダー

```javascript
// next.config.js での設定例
headers: [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; ...",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];
```

### 確認ファイル

- `next.config.js` / `next.config.mjs`
- `middleware.ts`
- `vercel.json`

---

## 7. データ検証

### サーバーサイド検証パターン

```
# Zodスキーマの使用確認
z\.object\(
z\.string\(
\.parse\(
\.safeParse\(
```

### 確認ポイント

- [ ] 全APIエンドポイントで入力検証が実装されているか
- [ ] クライアント検証だけでなくサーバー検証があるか
- [ ] ファイルアップロードのMIMEタイプ・サイズ検証

---

## 8. Next.js 固有

### App Router セキュリティ

```
# Server Actions の確認
"use server"

# クライアントコンポーネント
"use client"
```

### 確認ポイント

- [ ] Server Actionsでの認証チェック
- [ ] Server Componentsでの機密データ取り扱い
- [ ] APIルートの適切なエラーハンドリング
- [ ] `revalidatePath`/`revalidateTag`の適切な使用

### 危険パターン

```
# 環境変数のクライアント露出
process\.env\.(?!NEXT_PUBLIC_)[A-Z_]+
```

---

## 9. Supabase 固有

### RLS (Row Level Security)

確認すべきSQL:

```sql
-- RLSが有効か
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- ポリシーの存在
CREATE POLICY
```

### 確認ポイント

- [ ] 全テーブルでRLSが有効か
- [ ] `service_role`キーがクライアントに露出していないか
- [ ] `anon`キーの権限が最小限か
- [ ] Edge Functionsでの認証チェック

### 危険パターン

```
# service_role キーの使用箇所
supabaseAdmin
createClient.*service_role
SUPABASE_SERVICE_ROLE
```

---

## Grepコマンド例

```bash
# XSS関連
grep -rn "dangerouslySetInnerHTML\|innerHTML\|eval(" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx"

# シークレット
grep -rn "api[_-]\?key\|secret\|password\|token" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | grep -v node_modules | grep -v ".env.example"

# 認証なしAPIルート
grep -rn "export.*function.*\(GET\|POST\|PUT\|DELETE\)" --include="route.ts" --include="route.js"
```
