# Compliance Checker

薬機法・景品表示法コンプライアンスチェッカー

## 概要

**compliance-checker** は、Suptiaプロジェクトの記事、UI文言、商品説明が薬機法（医薬品医療機器等法）および景品表示法に準拠しているかを自動的にチェックするツールです。

## 主な機能

- ✅ **薬機法チェック**: 治療効果、予防効果、疾病治療などの禁止表現を検出
- ✅ **景品表示法チェック**: 最上級表現、誇大広告、根拠のない断定表現を検出
- ✅ **マルチファイル対応**: TSX、TS、JSON、Markdownファイルをサポート
- ✅ **修正提案**: 各違反に対して法令準拠の代替表現を提案
- ✅ **複数出力フォーマット**: コンソール、JSON、Markdownでレポート生成
- ✅ **Glob対応**: ワイルドカードで複数ファイルを一括チェック

## インストール

```bash
# プロジェクトルートで依存関係をインストール
npm install
```

## 使用方法

### 基本的な使い方

```bash
# TSXファイルをチェック
npx tsx .claude/skills/compliance-checker/index.ts --target "apps/web/src/**/*.tsx"

# JSON記事ファイルをチェック
npx tsx .claude/skills/compliance-checker/index.ts --target "*-article.json"

# 特定のディレクトリをチェック
npx tsx .claude/skills/compliance-checker/index.ts --target "apps/web/src/app/(marketing)/ingredients"
```

### オプション

| オプション     | 短縮形 | 説明                                               | デフォルト       |
| -------------- | ------ | -------------------------------------------------- | ---------------- |
| `--target`     | `-t`   | チェック対象のファイル/ディレクトリ（必須）        | -                |
| `--file-types` | `-f`   | チェック対象のファイルタイプ（カンマ区切り）       | `tsx,ts,json,md` |
| `--severity`   | `-s`   | 表示する違反の重要度（`critical`/`warning`/`all`） | `all`            |
| `--format`     | -      | 出力フォーマット（`console`/`json`/`markdown`）    | `console`        |
| `--save`       | `-o`   | レポートをファイルに保存                           | -                |
| `--exclude`    | `-e`   | 除外パターン（カンマ区切り）                       | -                |
| `--help`       | `-h`   | ヘルプを表示                                       | -                |

### 使用例

#### 1. Criticalな違反のみチェック

```bash
npx tsx .claude/skills/compliance-checker/index.ts \
  --target "apps/web/src/**/*.tsx" \
  --severity critical
```

#### 2. Markdownレポートを生成

```bash
npx tsx .claude/skills/compliance-checker/index.ts \
  --target "apps/web/src" \
  --format markdown \
  --save compliance-report.md
```

#### 3. 特定のディレクトリを除外

```bash
npx tsx .claude/skills/compliance-checker/index.ts \
  --target "**/*.tsx" \
  --exclude "**/__tests__/**,**/stories/**"
```

#### 4. JSON形式で出力（CI/CD連携）

```bash
npx tsx .claude/skills/compliance-checker/index.ts \
  --target "*-article.json" \
  --format json \
  --save compliance-result.json
```

## 検出される違反

### Critical（重大違反）

| カテゴリ   | 例                                       | 法令       |
| ---------- | ---------------------------------------- | ---------- |
| 治療表現   | 治る、治す、治療、治癒、完治             | 薬機法     |
| 予防表現   | 予防する、防ぐ、防止する                 | 薬機法     |
| 疾病治療   | がんに効く、糖尿病を治す、高血圧を下げる | 薬機法     |
| 最上級表現 | 最高級、業界No.1、日本一、世界一         | 景品表示法 |
| 断定表現   | 絶対に、100%効果、必ず効く               | 景品表示法 |

### Warning（警告）

| カテゴリ | 例                                     | 法令       |
| -------- | -------------------------------------- | ---------- |
| 効果断定 | 効く、効果がある、改善する             | 薬機法     |
| 身体増強 | 若返る、回復する、再生する、強化される | 薬機法     |
| 誇大表現 | 驚異的な、圧倒的な、奇跡の、即効性     | 景品表示法 |

### OK表現（推奨）

- 〜をサポート
- 〜に役立つ可能性
- 研究では
- 〜と言われています
- 健康維持に
- 栄養補給として
- 〜が報告されています

## 出力例

### コンソール出力

```
┌─────────────────────────────────────────────────────────┐
│         Compliance Checker Report                       │
├─────────────────────────────────────────────────────────┤
│ Scanned Files: 12                                       │
│ Total Violations: 3                                     │
│   - Critical: 1                                         │
│   - Warning: 2                                          │
│ Status: FAIL ❌                                         │
└─────────────────────────────────────────────────────────┘

📋 Violations:

🚨 Critical (1件)

[1] vitamin-c-article.json:45:12
   ❌ "がんを予防する"
   法令: 薬機法 | カテゴリ: 予防表現
   💡 修正提案: 健康維持に役立つ可能性があります
   文脈: ...ビタミンCはがんを予防する効果が...

⚠️  Warning (2件)

[1] apps/web/src/components/ProductCard.tsx:23:15
   ⚠️  "効果がある"
   法令: 薬機法 | カテゴリ: 効果断定
   💡 修正提案: 研究で報告されています
   文脈: ...このサプリは効果があると...
```

## CI/CD連携

### GitHub Actions

```yaml
name: Compliance Check

on: [push, pull_request]

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm install
      - name: Run Compliance Checker
        run: |
          npx tsx .claude/skills/compliance-checker/index.ts \
            --target "apps/web/src/**/*.tsx" \
            --severity critical \
            --format json \
            --save compliance-report.json
      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: compliance-report
          path: compliance-report.json
```

## カスタマイズ

### NGワードの追加

[`.claude/skills/compliance-checker/rules/ng-words.ts`](./rules/ng-words.ts)を編集してNGワードを追加できます。

```typescript
{
  word: 'カスタムNGワード',
  severity: 'critical',
  score: -10,
  category: 'カスタムカテゴリ',
  law: '薬機法',
  context: '違反理由の説明'
}
```

### 修正提案のカスタマイズ

`generateSuggestion`関数でNGワードごとの修正提案をカスタマイズできます。

```typescript
const suggestions: Record<string, string> = {
  カスタムNGワード: "推奨される代替表現",
  // ...
};
```

## トラブルシューティング

### Q: glob パターンが動作しない

A: シェルによってはglobパターンを展開してしまうため、クォートで囲んでください。

```bash
# ❌ NG
npx tsx .claude/skills/compliance-checker/index.ts --target apps/web/src/**/*.tsx

# ✅ OK
npx tsx .claude/skills/compliance-checker/index.ts --target "apps/web/src/**/*.tsx"
```

### Q: node_modulesがスキャンされてしまう

A: デフォルトで除外されていますが、明示的に除外することもできます。

```bash
npx tsx .claude/skills/compliance-checker/index.ts \
  --target "**/*.tsx" \
  --exclude "**/node_modules/**,**/.next/**"
```

## ライセンス

MIT License

## 作成者

Ryota - Suptia Project
