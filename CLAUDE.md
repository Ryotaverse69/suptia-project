# Suptia プロジェクト - Claude Code ガイド

## プロジェクト概要

**Suptia（サプティア）** は「安全 × コスト × エビデンス」を軸にしたサプリメント意思決定エンジン。

**コミュニケーション**: 全てのやり取りは日本語。コード識別子は英語。

---

## コアコンセプト：5つの柱

| 柱            | 内容                            | 称号バッジ   |
| ------------- | ------------------------------- | ------------ |
| 💰 価格比較   | 複数ECサイトでの価格比較        | 最適価格     |
| 📊 成分量比較 | 1日あたり有効成分量（mg正規化） | 高含有リード |
| 💡 コスパ比較 | 成分量あたりの価格（¥/mg）      | 高効率モデル |
| 🔬 エビデンス | S/A/B/C/Dの5段階評価            | 高エビデンス |
| 🛡️ 安全性     | 0-100点、副作用・相互作用警告   | 高安全性     |

**🌟 Five Crown（S+）**: 5つすべてがSランクの商品

---

## 技術スタック

| カテゴリ       | 技術                    |
| -------------- | ----------------------- |
| フレームワーク | Next.js 14 (App Router) |
| 言語           | TypeScript              |
| スタイリング   | Tailwind CSS            |
| CMS            | Sanity v3               |
| データベース   | Supabase                |
| デプロイ       | Vercel                  |

---

## 現在の状況（2025年12月）

- **商品数**: 476件（楽天326 + Yahoo!146 + Amazon3）
- **自動同期**: GitHub Actions（毎日3時JST）
- **次フェーズ**: AIコンシェルジュ（2026年1月〜）

---

## 禁止事項

1. 非公式API・禁止スクレイピング
2. 医療効能の断定表現（「治る」「防ぐ」「改善」）
3. 個人情報の平文保存
4. 出典不明データの使用

---

## ブランド表記ルール

**基本はカタカナ「サプティア」を使用**

| 表記                 | 用途                                                     |
| -------------------- | -------------------------------------------------------- |
| サプティア           | 基本表記（本文、説明文、ページタイトルなど）             |
| サプティア（Suptia） | 初出・正式表記                                           |
| Suptia               | ロゴ、プラン名、Powered by、スタイリッシュさが必要な場面 |

**英語「Suptia」を使う場面：**

- ヘッダーロゴ
- プラン名（Suptia Pro、Suptia Pro+Safety）
- Powered by Suptia
- 英語圏向け・デザイン重視の場面

**コード識別子は英語のまま：**

- 変数名、関数名、型名（`WhySuptiaClient`, `SuptiaProduct`など）
- 構造化データの`alternateName`

---

## 行動規範

1. 公式API優先（ToS・robots.txt遵守）
2. 透明性と説明性（推薦理由・出典を常に明示）
3. 法令遵守（薬機法準拠）

---

## ディレクトリ構造

```
apps/web/src/
├── app/                    # Next.js App Router
├── components/             # UIコンポーネント
├── lib/
│   ├── ec-adapters/        # EC API アダプター
│   ├── compliance/         # 薬機法チェッカー
│   └── badges.ts           # 称号判定ロジック
└── contexts/               # React Context

packages/schemas/           # Sanityスキーマ定義
scripts/                    # 同期スクリプト
docs/                       # 詳細ドキュメント
```

---

## 開発コマンド

```bash
# 開発
npm run dev              # 開発サーバー (localhost:3000)
npm run build            # ビルド
npx sanity dev           # Sanityスタジオ (localhost:3333)

# 品質チェック
npm run lint && npm run typecheck && npm run test

# 商品同期
node scripts/sync-rakuten-products.mjs
node scripts/sync-yahoo-products.mjs
```

---

## ブラウザ自動化（agent-browser）

AIエージェント向けヘッドレスブラウザCLI。以下の場面で活用する:

| 場面               | コマンド例                                                              |
| ------------------ | ----------------------------------------------------------------------- |
| UI修正後の確認     | `agent-browser open http://localhost:3000 && agent-browser snapshot -i` |
| スクリーンショット | `agent-browser screenshot --full page.png`                              |
| フォーム動作テスト | `agent-browser fill @e3 "test" && agent-browser click @e5`              |
| レスポンシブ確認   | `agent-browser set viewport 375 812`                                    |

**使用判断**: 複数ページの確認、動作テスト、エビデンス取得時に使用。単純な目視確認には使わない。

---

## 環境変数（主要）

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
SANITY_API_TOKEN=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# EC API
RAKUTEN_APPLICATION_ID=
RAKUTEN_AFFILIATE_ID=
AMAZON_ASSOCIATE_TAG=suptia6902-22
```

詳細: [apps/web/.env.local.example](apps/web/.env.local.example)

---

## 薬機法NGワード

- ❌ 「治る」「治療」「予防」「防ぐ」「効く」
- ⭕ 「〜をサポート」「〜に役立つ可能性」「研究では」

---

## 詳細ドキュメント

| トピック               | ファイル                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------ |
| ヒーロー×AI設計        | [docs/HERO_AI_DESIGN.md](docs/HERO_AI_DESIGN.md)                                     |
| AIコンシェルジュ仕様   | [docs/AI_CONCIERGE_SPEC.md](docs/AI_CONCIERGE_SPEC.md)                               |
| AI検索共存戦略         | [docs/AI_SEARCH_COEXISTENCE_STRATEGY.txt](docs/AI_SEARCH_COEXISTENCE_STRATEGY.txt)   |
| EC統合ロードマップ     | [docs/ROADMAP_EC_INTEGRATION.md](docs/ROADMAP_EC_INTEGRATION.md)                     |
| マルチビタミンコスパ   | [docs/MULTIVITAMIN_COST_LOGIC.md](docs/MULTIVITAMIN_COST_LOGIC.md)                   |
| アフィリエイトAPI      | [docs/AFFILIATE_API_GUIDE.md](docs/AFFILIATE_API_GUIDE.md)                           |
| iHerb統合              | [docs/IHERB_INTEGRATION_SUMMARY.md](docs/IHERB_INTEGRATION_SUMMARY.md)               |
| 記事作成ガイド         | [docs/ARTICLE_GUIDELINES.md](docs/ARTICLE_GUIDELINES.md)                             |
| マルチエージェント監修 | [docs/MULTI_AGENT_SUPERVISION.md](docs/MULTI_AGENT_SUPERVISION.md)                   |
| 新機能6本柱計画        | [.claude/plans/squishy-inventing-cloud.md](.claude/plans/squishy-inventing-cloud.md) |
| MCP設定                | [.mcp/README.md](.mcp/README.md)                                                     |

---

## ロードマップ

### 2025年12月（完了）

- ✅ 価格アラートUI（Vercel Cron連携）
- ✅ Tierランキングシステム（S+〜D）
- ✅ 診断履歴UI（Supabase連携）
- ✅ Instagram投稿管理ページ
- ✅ llms.txt v2.2.0
- ✅ マイページ機能（プロフィール・健康情報・プラン別UI）

### 2026年1月

- AIコンシェルジュ Phase 1（チャットUI、プラン別制限）
- 有料会員機能（Free / Pro ¥980 / Pro+Safety ¥1,980）
- **GPT Actions準備**（公開API設計、OpenAPI仕様書作成、llms.txt v3.0強化）

### 2026年2月

- AIコンシェルジュ Phase 2（価格履歴統合、推薦ロジック可視化）
- Amazon PA-API統合
- **GPT Actions公開**（GPT Store登録、ChatGPT Health対応）
- **形状フィルター**（商品一覧に剤形フィルター追加）

### 2026年3月

- AIコンシェルジュ Phase 3（相互作用チェッカー、Safety機能）
- iHerb CJ再申請
- **AIマルチエージェント監修 Phase 1**（薬剤師AI + 法令AI基盤 + レビューモデレーション + 商品情報チェック）
- **口コミ・レビュー Phase 1**（投稿・表示・基本評価）

### 2026年4月

- **相互作用チェッカー Phase 1**（サプリ-サプリ相互作用DB + 専用UI）
- 英語版リリース準備
- GPT Actions改善（利用データ分析、機能拡充）

### 2026年5月

- **マイノート Phase 1**（服用記録・カレンダー・効果追跡）
- **口コミ・レビュー Phase 2**（5軸サブ評価・AIモデレーション統合）

### 2026年6月

- **AIマルチエージェント監修 Phase 2**（全5エージェント + 成分ガイド・比較記事全チェック + バッジUI + `/about/ai-supervision` 解説ページ公開）

### 2026年7月

- **相互作用チェッカー Phase 2**（マトリクスビジュアル・マイノート連携）
- **PHRデータ連携 Phase 1**（手動入力・ダッシュボード）

### 2026年8-9月

- **マイノート Phase 2**（コンシェルジュ統合・エクスポート）
- **PHRデータ連携 Phase 2**（Google Fit連携）
- **AIマルチエージェント監修 Phase 3**（コンシェルジュQA + 診断結果チェック + note記事公開 + バッチ再監修Cron）

---

## AIマルチエージェント監修システム

サプティア独自の信頼性基盤。5つのAI専門家がすべてのコンテンツを多角的に監修。

### 5エージェント

| エージェント    | 専門領域                            | モデル       |
| --------------- | ----------------------------------- | ------------ |
| 💊 薬剤師AI     | 薬物相互作用・用量安全性・禁忌      | Sonnet       |
| 🥗 管理栄養士AI | 栄養学的正確性・食品-サプリ相互作用 | Haiku        |
| 🔬 臨床研究者AI | エビデンス評価・研究結果の信頼性    | Sonnet       |
| ⚖️ 薬機法AI     | 4法令コンプライアンス               | Haiku+ルール |
| 🛡️ 消費者保護AI | 価格適正性・公正な表現              | Haiku        |

### 適用対象（7領域）

1. 成分ガイド記事 — `/ingredients/[slug]`
2. 比較記事 — `/articles/[comparison]`
3. 商品情報ページ — `/products/[slug]`
4. ユーザーレビュー — 投稿時自動モデレーション
5. AIコンシェルジュ応答 — 回答品質QA
6. 診断結果 — 推薦の妥当性チェック
7. 安全性情報 — 相互作用チェッカー結果

### 詳細ドキュメント

| トピック           | ファイル                                                           |
| ------------------ | ------------------------------------------------------------------ |
| 実装計画           | [docs/MULTI_AGENT_SUPERVISION.md](docs/MULTI_AGENT_SUPERVISION.md) |
| AI監修プロセス解説 | `/about/ai-supervision` ページ                                     |

---

## キャッチフレーズ

```
「AIが答えを出す時代。Suptiaはその根拠を示す。」
「AIは一般論。Suptiaはあなた専用。」
```

---

**最終更新**: 2026-01-15 | **バージョン**: 3.4.0
