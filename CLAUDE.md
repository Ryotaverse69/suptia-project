# Suptia プロジェクト - Claude Code ガイド

## 🎯 プロジェクト概要

**Suptia（サプティア）** は、「安全 × コスト × エビデンス」を軸にしたサプリメント意思決定エンジン。ユーザーが"理由を理解して選べる"AIサプリ比較体験を提供。

### 3層構造での進化

1. **UI／データ層**（現在）- Next.js + Sanity CMS
2. **メタサーチエンジン層**（2025年後半〜）- 複数EC価格統合
3. **GPT意思決定層**（2026年〜）- 対話型AI推薦

### 🗣️ コミュニケーション方針

**重要: 全てのやり取りは日本語で行う。**

- 会話・質問・回答・ドキュメント: 日本語
- コード識別子（変数名、関数名、ファイル名）: 英語

---

## 🏛️ コアコンセプト：5つの柱

すべての商品に以下5つの情報を表示：

| 柱                | 内容                            | 称号バッジ   |
| ----------------- | ------------------------------- | ------------ |
| 💰 **価格比較**   | 複数ECサイトでの価格比較        | 最適価格     |
| 📊 **成分量比較** | 1日あたり有効成分量（mg正規化） | 高含有リード |
| 💡 **コスパ比較** | 成分量あたりの価格（¥/mg）      | 高効率モデル |
| 🔬 **エビデンス** | S/A/B/C/Dの5段階評価            | 高エビデンス |
| 🛡️ **安全性**     | 0-100点、副作用・相互作用警告   | 高安全性     |

**🌟 5つ星認定**: 5つすべての称号を獲得した商品

---

## ⚙️ 技術スタック

| カテゴリ       | 技術                     |
| -------------- | ------------------------ |
| フレームワーク | Next.js 14 (App Router)  |
| 言語           | TypeScript               |
| スタイリング   | Tailwind CSS             |
| CMS            | Sanity v3                |
| データベース   | Supabase                 |
| テスト         | Vitest + Testing Library |
| デプロイ       | Vercel                   |

---

## 📊 現在の状況（2025年12月）

### 完了済みフェーズ

| フェーズ | 内容                                | ステータス |
| -------- | ----------------------------------- | ---------- |
| 1        | Sanity連携UI構築                    | ✅ 完了    |
| 1.5      | 5つの称号システム                   | ✅ 完了    |
| 2        | 意思決定エンジン化                  | ✅ 完了    |
| 2.5      | EC API連携（楽天326件/Yahoo!146件） | ✅ 完了    |
| 2.7      | マルチビタミン対応コスパ計算        | ✅ 完了    |
| 3        | 信頼性とSEO基盤                     | ✅ 完了    |

### 進行中・計画中

| フェーズ | 内容                                                  | ステータス     |
| -------- | ----------------------------------------------------- | -------------- |
| 4        | マネタイズ（有料プラン：Free/Pro¥490/Pro+Safety¥980） | ⏳ 計画中      |
| 5        | GPT連携・AIコンシェルジュ                             | ⏳ 2026年1月〜 |

### 商品データ

- **総商品数**: 476件（楽天326 + Yahoo!146 + Amazon3 + その他1）
- **ブランド**: 18件以上
- **自動同期**: GitHub Actions（毎日深夜3時JST）

---

## 🚫 禁止事項

1. **非公式API・禁止スクレイピング** - 公式API（Amazon PA-API、楽天Ichiba API）のみ使用
2. **医療効能の断定表現** - 「治る」「防ぐ」「改善」は禁止
3. **個人情報の平文保存** - AES暗号化必須
4. **出典不明データの使用** - 必ず参考文献を明示

---

## ⚖️ 行動規範

1. **公式API優先** - ToS・robots.txt遵守
2. **無料範囲での開発優先** - 有料サービスはMVP以降
3. **透明性と説明性** - 推薦理由・出典を常に明示
4. **法令遵守** - 薬機法準拠、個人情報保護
5. **テスト優先** - 説明可能な構造で設計

---

## 📁 主要ディレクトリ構造

```
apps/web/src/
├── app/                    # Next.js App Router
├── components/             # UIコンポーネント
├── lib/
│   ├── ec-adapters/        # EC API アダプター
│   ├── compliance/         # 薬機法チェッカー
│   ├── cost-calculator.ts  # コスパ計算
│   └── badges.ts           # 称号判定ロジック
└── sanity/                 # Sanity設定

packages/schemas/           # Sanityスキーマ定義
scripts/                    # 同期スクリプト
.mcp/                       # MCP設定
docs/                       # 詳細ドキュメント
```

---

## 🔧 開発コマンド

```bash
# 開発
npm run dev              # 開発サーバー (http://localhost:3000)
npm run build            # ビルド
npx sanity dev           # Sanityスタジオ (http://localhost:3333)

# 品質チェック
npm run lint             # ESLint
npm run typecheck        # TypeScript型チェック
npm run test             # テスト実行

# 商品同期
node scripts/sync-rakuten-products.mjs
node scripts/sync-yahoo-products.mjs
```

---

## 🔑 環境変数

必要な環境変数（`.env.local`に設定）:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=

# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# EC API
RAKUTEN_APPLICATION_ID=
RAKUTEN_AFFILIATE_ID=
AMAZON_ASSOCIATE_TAG=suptia69-22

# Analytics
NEXT_PUBLIC_GA_ID=
```

---

## 📝 記事作成の要点

### 必須フィールド（成分記事）

- `name` / `nameEn`: 日本語名・英語名
- `description`: 500〜800文字
- `benefits`: 10〜15項目
- `recommendedDosage`: 500〜800文字
- `sideEffects`: 300〜500文字
- `faqs`: 5項目（各500〜1000文字）
- `references`: 5〜10項目（PubMed, 厚生労働省等）

### 薬機法NGワード

- ❌ 「治る」「治療」「予防」「防ぐ」「効く」
- ⭕ 「〜をサポート」「〜に役立つ可能性」「研究では」

**詳細**: [docs/ARTICLE_GUIDELINES.md](docs/) 参照

---

## 📊 データスキーマ（概要）

### Product

```typescript
{
  name: string;
  slug: { current: string };
  brand: Reference;
  ingredients: { ingredient: Reference; amountMgPerServing: number; }[];
  prices: { source: string; amount: number; url: string; }[];
  tierRanks: { costEffectiveness: string; evidenceLevel: string; ... };
}
```

### Ingredient

```typescript
{
  name: string;
  nameEn: string;
  category: string;
  evidenceLevel: "S" | "A" | "B" | "C" | "D";
  recommendedDoseMg: number;
  toxicityUpperMg: number;
}
```

**詳細**: [packages/schemas/](packages/schemas/) 参照

---

## 🔌 MCP統合

### 利用可能なMCPサーバー

1. **Supabase MCP** - ユーザーデータ管理、価格履歴
2. **Google Search Console MCP** - SEO分析

**詳細**: [.mcp/README.md](.mcp/README.md) 参照

---

## 📚 詳細ドキュメント参照

| トピック                 | ファイル                                                                           |
| ------------------------ | ---------------------------------------------------------------------------------- |
| マルチビタミンコスパ計算 | [docs/MULTIVITAMIN_COST_LOGIC.md](docs/MULTIVITAMIN_COST_LOGIC.md)                 |
| EC統合ロードマップ       | [docs/ROADMAP_EC_INTEGRATION.md](docs/ROADMAP_EC_INTEGRATION.md)                   |
| AI検索共存戦略           | [docs/AI_SEARCH_COEXISTENCE_STRATEGY.txt](docs/AI_SEARCH_COEXISTENCE_STRATEGY.txt) |
| アフィリエイトAPI        | [docs/AFFILIATE_API_GUIDE.md](docs/AFFILIATE_API_GUIDE.md)                         |
| iHerb統合                | [docs/IHERB_INTEGRATION_SUMMARY.md](docs/IHERB_INTEGRATION_SUMMARY.md)             |

---

## 🎯 ロードマップ（2025年12月〜2026年）

```
2025年12月（現在）
├─ iHerb承認待ち
├─ 価格アラートUI着手
└─ llms.txt・サイトマップ最適化

2026年1月
├─ 診断履歴UI
├─ AIコンシェルジュ（軽量版）
└─ 有料会員機能開始

2026年2月
├─ スマート価格アラート（ML版）
├─ Amazon PA-API統合
└─ 多言語対応準備

2026年3月〜
├─ 相互作用チェッカー
├─ GPT連携Phase 2
└─ 英語版リリース
```

---

## 🌍 グローバル展開戦略

### ビジョン

「サプリの意思決定エンジン」を日本から世界へ。AIエージェント時代に「信頼されるデータソース」となる。

### グローバルロードマップ

| フェーズ | 時期      | 目標                                              |
| -------- | --------- | ------------------------------------------------- |
| 1        | 2025-2026 | 日本で勝ちパターン確立（月10万PV、月収30万円）    |
| 2        | 2026-2027 | 英語圏進出準備（i18n基盤、iHerb連携）             |
| 3        | 2027-2028 | AIエージェント対応（API提供、構造化データ強化）   |
| 4        | 2028-2030 | グローバル展開（パートナーシップ/ホワイトラベル） |

### 競合との差別化

| 競合        | 彼らの強み     | Suptiaの攻め方        |
| ----------- | -------------- | --------------------- |
| Examine.com | 学術エビデンス | 価格比較→購入まで導く |
| Labdoor     | 品質テスト     | 無料で基本情報提供    |
| ConsumerLab | 製品レビュー   | 透明性と無料アクセス  |

### 優先課題と対策

| 優先度 | 課題               | 対策                            | 着手時期  |
| ------ | ------------------ | ------------------------------- | --------- |
| **A**  | 価格データ安定性   | API制限整理、フォールバック設計 | 今すぐ    |
| **A**  | 構造化データ不足   | JSON-LD実装、AI可読性テスト     | 今すぐ    |
| **B**  | AI時代の責任範囲   | 免責事項整備、危険アラート基準  | 3-6ヶ月   |
| **B**  | B2B/API設計不足    | API仕様書、料金モデル           | 3-6ヶ月   |
| **C**  | 規制対応           | 主要国の健康表示規制調査        | 6ヶ月-1年 |
| **C**  | 英語圏での信頼獲得 | 専門家監修、ソース透明性        | 6ヶ月-1年 |

### AIの進化とSuptiaの対応

| 時期      | AIの役割         | Suptiaがやるべきこと             |
| --------- | ---------------- | -------------------------------- |
| 2025-2027 | 情報をまとめる   | 良質なデータソースになる         |
| 2027-2029 | 行動を代行する   | AIに引用される側になる           |
| 2029-2030 | 予測・最適化する | 健康データプラットフォームと統合 |

### 成功の鍵（3つ）

1. **「比較」ではなく「意思決定」を売る** — 決められることが価値
2. **AIに選ばれるデータソースになる** — 構造化・正確・更新
3. **日本で証明し、世界に広げる** — スモールスタート、グローバルシンキング

---

## 🧩 Claude Code Skills

### sanity-ingredient-validator

成分記事JSONの自動検証（薬機法チェック、文字数、参考文献）

```bash
npx tsx .claude/skills/sanity-ingredient-validator/index.ts [file].json
```

**詳細**: [.claude/skills/](/.claude/skills/) 参照

---

**最終更新日**: 2025-12-03
**バージョン**: 2.1.0（グローバル展開戦略追加）
