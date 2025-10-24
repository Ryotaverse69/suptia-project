# 🛠️ Suptia Claude Code Skills

Suptiaプロジェクト専用のClaude Code Skillsコレクション。開発効率を大幅に向上させる自動化ツール群です。

## 📋 利用可能なSkills

### 1. **article-optimizer** - 記事統合最適化

成分記事の品質を包括的に最適化（薬機法準拠、SEO強化、文字数拡充）

```bash
npm run skill:optimize vitamin-c-article.json --mode full
```

### 2. **sanity-ingredient-validator** - 成分記事検証

Sanityインポート前の品質チェック（構造、文字数、薬機法、エビデンス）

```bash
npm run skill:validate vitamin-c-article.json
```

### 3. **sanity-bulk-import** - 一括インポート

安全な一括インポート（バックアップ、差分検出、リトライ）

```bash
npm run skill:import --dry-run
npm run skill:import --dry-run false  # 本番実行
```

### 4. **price-calculator** - 価格分析

mg単価計算、コスパ評価、価格比較レポート

```bash
npm run skill:price products.json --mode report
```

### 5. **sanity-dev-helper** - 開発環境管理

統合開発環境の管理（サーバー起動、環境変数、デプロイチェック）

```bash
npm run skill:dev start        # 開発サーバー起動
npm run skill:dev env:check    # 環境変数チェック
npm run skill:dev build        # ビルド
npm run skill:dev deploy:check # デプロイ前チェック
```

### 6. **compliance-checker** - 薬機法チェック

記事・UI文言の薬機法コンプライアンスチェック

```bash
npm run skill:compliance check article.json
```

### 7. **skill-pipeline** - パイプライン実行

複数Skillsの連携実行

```bash
npm run skill:pipeline article-complete vitamin-c-article.json
npm run skill:list  # 利用可能なパイプライン一覧
```

## 🚀 クイックスタート

### 1. 依存関係のインストール

```bash
# プロジェクトルートで
npm install

# Skills専用の依存関係
npm run skills:install
```

### 2. 環境変数の設定

`.env.local`ファイルに以下を設定:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
```

### 3. Skills実行

```bash
# ヘルプ表示
npm run skills:help

# 個別Skill実行
npm run skill:validate article.json
npm run skill:optimize article.json --mode full
npm run skill:import --dry-run

# パイプライン実行
npm run skill:pipeline article-complete article.json
```

## 📊 事前定義パイプライン

### **article-complete** - 記事完全最適化

```
検証 → 最適化 → Sanityインポート
```

```bash
npm run skill:pipeline article-complete vitamin-c-article.json
```

### **price-analysis** - 価格分析フルレポート

```
API同期 → 価格計算 → レポート生成
```

```bash
npm run skill:pipeline price-analysis
```

### **deploy-preparation** - デプロイ準備

```
テスト → ビルド → デプロイチェック
```

```bash
npm run skill:pipeline deploy-preparation
```

### **seo-content** - SEO最適化コンテンツ作成

```
コンテンツ生成 → SEO最適化 → 薬機法チェック
```

```bash
npm run skill:pipeline seo-content topic.json
```

## 📁 ディレクトリ構造

```
.claude/skills/
├── common/                      # 共通ライブラリ
│   ├── compliance-rules.ts      # 薬機法ルール
│   ├── sanity-client.ts        # Sanity接続
│   ├── logger.ts               # ログシステム
│   └── skill-orchestrator.ts   # パイプライン実行
├── article-optimizer/           # 記事最適化
├── sanity-ingredient-validator/ # 記事検証
├── sanity-bulk-import/         # 一括インポート
├── compliance-checker/          # 薬機法チェック
├── price-calculator/           # 価格分析
├── sanity-dev-helper/          # 開発環境管理
├── api-sync-manager/           # EC API同期
├── seo-content-writer/         # SEOコンテンツ生成
├── test-generator/             # テスト生成
├── run-pipeline.ts            # パイプラインCLI
├── package.json               # Skills依存関係
└── tsconfig.json             # TypeScript設定
```

## 🔧 カスタムパイプライン作成

`skill-orchestrator.ts`でカスタムパイプラインを定義:

```typescript
// .claude/skills/custom-pipeline.ts
import { SkillOrchestrator, SkillPipeline } from "./common/skill-orchestrator";

const customPipeline: SkillPipeline = {
  name: "カスタム処理",
  description: "独自のワークフロー",
  skills: [
    {
      skillName: "sanity-ingredient-validator",
      input: "file",
    },
    {
      skillName: "article-optimizer",
      args: ["--mode", "enhance"],
      input: "previous",
      condition: (prev) => prev.score >= 70,
    },
  ],
  config: {
    stopOnError: true,
    saveIntermediateResults: true,
  },
};

const orchestrator = new SkillOrchestrator();
await orchestrator.executeCustomPipeline(customPipeline, inputData);
```

## 💡 Tips & トラブルシューティング

### Skills実行時のエラー

```bash
# 権限エラーの場合
chmod +x .claude/skills/*/index.ts

# モジュールが見つからない場合
cd .claude/skills && npm install
```

### 環境変数の確認

```bash
npm run skill:dev env:check --fix
```

### ログの確認

ログは `.claude/skills/logs/` に保存されます:

```bash
ls -la .claude/skills/logs/
```

### バッチ処理のデバッグ

```bash
# Dry Runモードで確認
npm run skill:import --dry-run

# 詳細ログ表示
VERBOSE=true npm run skill:import
```

## 📈 パフォーマンス最適化

### 並列処理

複数ファイルを並列処理:

```bash
npm run skill:optimize --batch "*.json" --parallel
```

### キャッシュ活用

```bash
# キャッシュクリア
npm run skill:dev clean
```

### メモリ使用量の監視

```bash
# Node.jsのメモリ上限を増やす
NODE_OPTIONS="--max-old-space-size=4096" npm run skill:import
```

## 🔒 セキュリティ

- APIトークンは環境変数で管理
- バックアップは自動暗号化（オプション）
- 薬機法コンプライアンスを自動チェック
- 依存関係の脆弱性を定期チェック

```bash
# セキュリティ監査
npm audit
npm run skill:dev deploy:check
```

## 📚 詳細ドキュメント

- [薬機法ガイドライン](./docs/compliance-guide.md)
- [API連携仕様](./docs/api-integration.md)
- [Skills開発ガイド](./docs/skill-development.md)

## 🆘 サポート

問題が発生した場合:

1. エラーログを確認: `.claude/skills/logs/`
2. 環境変数をチェック: `npm run skill:dev env:check`
3. GitHubでIssueを作成

## 📄 ライセンス

MIT

---

**最終更新**: 2025年1月
**バージョン**: 1.0.0
