# Suptia - サプリ意思決定エンジン MVP

安全性、価格、説明可能性を重視したサプリメント意思決定エンジンです。

## セットアップ

### 1. 依存関係のインストール

```bash
# ルートディレクトリで実行
npm install

# apps/webディレクトリで実行
cd apps/web
npm install
```

### 2. 環境変数の設定

```bash
# apps/webディレクトリで実行
cp .env.local.example .env.local
```

`.env.local`ファイルを編集して、SanityプロジェクトIDを設定してください。

### 3. 開発サーバーの起動

```bash
# ルートディレクトリから実行
npm run dev

# または apps/webディレクトリから実行
cd apps/web
npm run dev
```

アプリケーションは http://localhost:3000 で起動します。

## 利用可能なスクリプト

### ルートディレクトリから実行

- `npm run dev` - 開発サーバーを起動
- `npm run build` - プロダクションビルドを作成
- `npm run start` - プロダクションサーバーを起動
- `npm run test` - テストを実行
- `npm run test:watch` - ウォッチモードでテストを実行
- `npm run lint` - ESLintでコードをチェック
- `npm run format` - Prettierでコードをフォーマット
- `npm run type-check` - TypeScriptの型チェックを実行

### apps/webディレクトリから実行

同じスクリプトが利用可能です：

```bash
cd apps/web
npm run dev
npm run test
npm run lint
npm run format
```

## プロジェクト構造

```
├── apps/
│   └── web/                 # Next.js アプリケーション
│       ├── src/
│       │   ├── app/         # Next.js App Router
│       │   ├── components/  # Reactコンポーネント
│       │   ├── lib/         # ユーティリティ関数
│       │   └── types/       # TypeScript型定義
│       └── package.json
├── packages/
│   └── schemas/             # Sanityスキーマ定義
└── package.json
```

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **CMS**: Sanity v3
- **テスト**: Vitest + Testing Library
- **リンティング**: ESLint + Prettier

## 主要機能

- 🔬 科学的エビデンスに基づく成分評価
- 💰 正確な価格比較（成分量正規化）
- ⚖️ 薬機法コンプライアンスチェック
- 🛡️ 安全性警告システム
- 📊 4要素スコア評価システム

## 開発ガイド

### テストの実行

```bash
# 全テストを実行
npm run test

# ウォッチモードで実行
npm run test:watch
```

### コード品質チェック

```bash
# リンティング
npm run lint

# フォーマット
npm run format

# 型チェック
npm run type-check
```

### ビルドとデプロイ

```bash
# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm run start
```

## ライセンス

MIT License