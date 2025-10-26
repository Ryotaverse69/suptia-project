# Suptia プロジェクト - Claude Code ガイド

## プロジェクト概要

**Suptia（サプティア）** は、「安全 × コスト × エビデンス」を軸にしたサプリメント意思決定エンジンです。最終目標は、ユーザーが"理由を理解して選べる"AIサプリ比較体験を提供することです。

### 🎯 3層構造での進化

Suptiaは段階的に以下の3層構造で進化します：

#### 1. UI／データ層（現フェーズ）

- 成分ガイド・商品比較・診断UIの構築
- Next.js + Sanity CMSによる動的コンテンツ管理
- 科学的エビデンスに基づいた成分評価システム

#### 2. メタサーチエンジン層（2025年後半〜）

- 複数ECサイトの価格・在庫データを統合
- リアルタイム価格比較・価格アラート機能
- 正規化コスト計算（成分量あたりの実効価格）

#### 3. GPT意思決定層（2026年〜）

- 対話型AIによる個別推薦システム
- 成分・価格・安全性データを参照した"根拠を説明できる推薦"
- 自然言語での相談→最適なサプリメントの提案

### 🗣️ コミュニケーション方針

**重要: Claude Codeとのやり取りは全て日本語で行ってください。**

- **会話**: 日本語のみ使用
- **質問・回答**: 日本語で対応
- **エラーメッセージの説明**: 日本語で説明
- **コミット時の確認**: 日本語で確認
- **コード内のコメント**: 日本語推奨（ただし変数名・関数名は英語）
- **ドキュメント**: 日本語（README、ガイドなど）

唯一の例外は、コード内の識別子（変数名、関数名、ファイル名など）のみ英語を使用します。

### 主要機能

- 🔬 科学的エビデンスに基づく成分評価
- 💰 正確な価格比較（成分量正規化）
- ⚖️ 薬機法コンプライアンスチェック
- 🛡️ 安全性警告システム
- 📊 4要素スコア評価システム

### 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **CMS**: Sanity v3
- **テスト**: Vitest + Testing Library
- **デプロイ**: Vercel

---

## 🛤️ ユーザージャーニー / ユースケース

### ケース1: 成分名から最安値サプリを購入する典型的フロー

Suptiaの核となる価値提供フローです。ユーザーが成分名で検索してから、最適な商品を選び、最安値で購入するまでの一連の体験を設計します。

#### ステップバイステップ

1. **ユーザーがサプティアに訪問**
   - 「ビタミンCのサプリが欲しい」という明確なニーズを持っている

2. **検索窓で「ビタミンC」と入力**
   - トップページまたは検索ページの検索バーを使用
   - 成分名（日本語・英語）での検索に対応

3. **ビタミンCを含むサプリメントの一覧が表示される**
   - トリバゴ風のリスト表示
   - 各商品の基本情報：商品名、画像、評価スコア、1日あたりのコスト
   - フィルター機能：「コスパが良い順」「価格が安い順」「評価が高い順」

4. **コスパの良いサプリを選択（例: DHCのビタミンC）**
   - 商品カードをクリック
   - 商品詳細ページへ遷移

5. **📍 重要: 商品詳細ページで複数ECサイトの価格比較が表示される**
   - 同一商品の各ECサイトでの販売価格を一覧表示
   - 例:

     ```
     DHC ビタミンC 60日分

     ECサイト別価格比較（最安値順）
     ┌────────────────────────────────────────┐
     │ 🏆 最安値                                │
     │ 楽天市場    ¥398  →  料金を表示ボタン    │
     │ Yahoo!      ¥420  →  料金を表示ボタン    │
     │ Amazon      ¥450  →  料金を表示ボタン    │
     │ iHerb       ¥480  →  料金を表示ボタン    │
     └────────────────────────────────────────┘
     ```

6. **顧客は最安値のリンクをクリックして購入へ**
   - アフィリエイトリンクを経由してECサイトに遷移
   - Suptiaはアフィリエイト収益を獲得

#### 技術実装の要点

**商品詳細ページ (`/products/[slug]`) の要件**:

- 複数の`prices`配列を持つ商品データ構造
- 各priceオブジェクトには以下の情報を含む:
  - `source`: ECサイト名（"rakuten", "yahoo", "amazon", "iherb"）
  - `amount`: 価格（円）
  - `url`: アフィリエイトリンクURL
  - `fetched_at`: 価格取得日時
  - `in_stock`: 在庫状況
  - `shipping_fee`: 送料（オプション）

**データ構造例**:

```typescript
interface ProductPrice {
  source: "rakuten" | "yahoo" | "amazon" | "iherb";
  amount: number;
  currency: "JPY";
  url: string; // アフィリエイトリンク
  fetched_at: string; // ISO 8601
  in_stock: boolean;
  shipping_fee?: number;
  affiliate_tag?: string;
}

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  prices: ProductPrice[]; // 複数のECサイトの価格
  // ... その他のフィールド
}
```

**UIコンポーネント要件**:

- `ProductPriceComparison.tsx`: 価格比較テーブルコンポーネント
  - 最安値を強調表示（🏆マーク）
  - 価格順でソート
  - 各ECサイトへのCTAボタン
  - 価格取得日時の表示
  - 在庫切れの場合はグレーアウト

**現在の実装状況**:

- ✅ 検索機能（成分名で検索）
- ✅ フィルター機能（コスパ順、価格順）
- ✅ 商品一覧のリスト表示（トリバゴ風）
- ✅ **商品詳細ページでの複数ECサイト価格比較**（PriceComparisonコンポーネント）
  - 最安値の強調表示
  - 価格順ソート
  - 各ECサイトへのアフィリエイトリンク
  - 価格取得日時の表示
  - 最安値との差額表示

**次の優先実装タスク**:

- 🔄 Sanityに実際の商品データと複数ECサイトの価格データを登録
- 🔄 楽天市場APIとの連携（価格データの自動取得）
- 🔄 Amazon PA-APIとの連携

---

## 🗓 フェーズ別ロードマップ

### フェーズ1：データ基盤の完成（10月〜11月）

**目的**: SanityとNext.jsを接続し、すべてのUIが動的データで動く状態に。

**主要タスク**:

- Sanityスキーマ最終確定（Product / Ingredient / Brand / Evidence / Rule / Persona）
- `ingredient_ref`をProductに紐付け
- 成分ページから関連商品を表示
- 検索・フィルター（価格・成分・目的・ブランド）実装
- テストデータによる動作確認

**✅ ゴール**: UIがSanity経由で駆動し、比較・検索が動作する

---

### フェーズ2：意思決定エンジン化（11月〜12月）

**目的**: 検索サイトから「推薦を説明できるエンジン」に進化。

**主要タスク**:

- 実効コスト/日（mg換算価格）導入
- 禁忌タグ別「危険成分アラート」実装
- 診断エンジンβ（目的・懸念に応じた4スコア推薦）
- 商品比較ビューUI（同等量換算）

**✅ ゴール**: Suptiaが「なぜそれを薦めるか」を説明できる

---

### フェーズ2.5：ECサイトAPI連携（11月〜12月）

**目的**: 実際のECサイトから商品・価格データを取得し、リアルタイム比較を実現。

**主要タスク**:

- 楽天市場APIアダプター実装 ✅
- 商品同期スクリプト作成（`scripts/sync-rakuten-products.mjs`） ✅
- Claude Code Skills（ec-sync）実装 ✅
- Sanity商品スキーマへのマッピング ✅
- 価格データ自動更新システム（バッチ処理）
- Yahoo!ショッピングAPIアダプター実装
- Amazon PA-API対応（売上達成後）
- 複数ECサイトの価格比較UI

**アーキテクチャ**:

```
ECサイトAPI → ECAdapter → 同期スクリプト → Sanity CMS → Next.js → ユーザー
```

**実装済み**:

- ✅ 共通ECAdapterインターフェース（`lib/ec-adapters/base.ts`）
- ✅ 楽天アダプター（`lib/ec-adapters/rakuten.ts`）
- ✅ Yahoo!アダプター（`lib/ec-adapters/yahoo.ts`）
- ✅ 商品同期スクリプト（本番環境・CI/CD対応）
  - `scripts/sync-rakuten-products.mjs`
  - `scripts/sync-yahoo-products.mjs`
- ✅ 価格比較スクリプト（`scripts/compare-prices.mjs`）
- ✅ 価格履歴トラッキング機能
- ✅ Claude Code Skills（開発環境・対話的実行）
- ✅ GitHub Actions自動同期（`.github/workflows/sync-products.yml`）
- ✅ ブランド自動作成・管理

**稼働状況**:

- 📊 商品データ: 69件（楽天30件 + Yahoo! 20件 + テスト19件）
- 🏢 ブランド: 18件（自動作成済み）
- 🔄 自動同期: 毎日深夜3時（JST）実行可能
- 📈 価格履歴: 有効（既存商品更新時に自動記録）

**次のステップ**:

- ⏳ 在庫状況監視・通知
- ⏳ JANコードによる高精度マッチング
- ⏳ **Amazon PA-API & CJ Affiliate統合（2026年1月〜）** ← 同時実施予定

**iHerb統合戦略** （2025年10月25日決定）:

iHerbには公式APIが存在しないため、以下の方法でデータ取得：

**📌 決定事項**: **Amazon PA-API統合とCJ Affiliate統合を同時実施**

**理由**:

- Amazon PA-APIは売上要件（過去30日以内に3件以上）をクリアする必要がある
- CJ Affiliateも実績があった方が承認されやすい
- 同時統合で実装コストを最適化
- Amazon + iHerb両方揃って初めて真の価格比較が完成

**統合方法**:

1. **CJ Affiliate API経由**（推奨・無料）
   - iHerbと提携しているアフィリエイトネットワーク
   - Product Feed APIで商品データ取得
   - Deep Link APIでアフィリエイトリンク生成
   - 完全に合法、アフィリエイト報酬も獲得可能（5-10%）

2. **その他のネットワーク**（将来的に追加検討）
   - Rakuten Advertising（旧LinkShare）
   - Impact（旧Impact Radius）

3. **Bright Data**（フェーズ3以降、有料）
   - リアルタイム価格・在庫情報
   - 費用: $500/月〜

**実装済みファイル**（統合準備完了）:

```
apps/web/src/lib/integrations/
├── cj-affiliate.ts           # CJ Affiliate API実装
├── rakuten-advertising.ts    # Rakuten Advertising API実装
├── impact-radius.ts          # Impact API実装
└── affiliate-manager.ts      # 統合マネージャー（3つのAPIを統一）

docs/
├── AFFILIATE_API_GUIDE.md                 # 詳細実装ガイド
├── IHERB_INTEGRATION_SUMMARY.md          # 統合方法まとめ
├── CJ_AFFILIATE_APPLICATION_COPY_PASTE.md # 申請フォーム用テンプレート
└── ROADMAP_EC_INTEGRATION.md             # EC統合ロードマップ
```

**統合タイムライン**:

- **現在（フェーズ1）**: 楽天市場APIで運用中
- **2025年12月末**: Amazon初回売上達成目標
- **2026年1月**: Amazon PA-API & CJ Affiliate同時統合開始
- **2026年3月**: 価格比較機能完成（楽天 vs Amazon vs iHerb）

**✅ ゴール**: 実際のEC商品データでSuptiaが動作し、リアルタイム価格比較が可能に ← **達成！**

---

### フェーズ3：信頼性とSEO基盤（1月〜2月）

**目的**: Googleとユーザー双方に"信頼される専門サイト"として認識される。

**主要タスク**:

- 薬機法OK/NG辞書をCMSに統合
- JSON-LD構造化データ（Product, ItemList, BreadcrumbList）
- GA4 + Search Consoleで行動分析
- 成分ガイド間の内部リンク最適化

**✅ ゴール**: SEO強化と法令準拠を両立

---

### フェーズ4：マネタイズ & 継続利用機能（3月〜4月）

**目的**: ユーザーが「使い続けたくなる」設計にする。

**主要タスク**:

- 価格アラート機能（通知）
- マイページβ（お気に入り・診断履歴）
- 有料会員特典（広告非表示、価格履歴グラフ、AI推薦）
- アフィリエイトトラッキング統合

**✅ ゴール**: Suptiaを"毎日開く健康プラットフォーム"へ

---

### フェーズ5：GPT連携・AIパートナー化（2025年後半〜2026年）

**目的**: Suptiaを自然対話で利用できる「AIサプリ相談体験」へ。

**主要タスク**:

- RAGベースのGPT連携（成分・研究・価格データを参照）
- 自然言語クエリ → 検索フィルター変換
  - 例：「肌に良くて刺激の少ないビタミンを探して」
- AI診断履歴の学習（安全タグ・価格許容範囲を記憶）
- 推薦根拠を明示（Explainable Recommendation）

**✅ ゴール**: Suptia GPT＝「根拠を語るヘルスアドバイザー」

---

### 🌐 長期的ビジョン

**検索する場所 → 比較する場所 → 理解できる場所 → 対話で決められる場所**

Suptiaは「**Trivago × PubMed × GPT**」を統合した、次世代型サプリ意思決定プラットフォームを目指します。

---

## ⚙️ 行動規範（Behavioral Rules）

1. **公式API優先**
   - Amazon PA-APIや楽天Ichiba APIを使用。
   - 非公式APIや明確に禁止されているスクレイピングは禁止。
   - ToS（利用規約）・robots.txtを遵守。

2. **無料範囲での開発優先**
   - 有料サービス（Bright Data等）はMVP以降に検討。

3. **透明性と説明性の保持**
   - 推薦理由・出典（研究・価格・成分）を常に明示。

4. **法令遵守と倫理**
   - 薬機法に抵触する表記を禁止。
   - 個人情報は暗号化し、削除リクエストに即対応。

5. **再現性とテスト優先**
   - すべての推薦ロジック・API呼び出しはテスト可能な形に。
   - ブラックボックス化を避け、説明可能な構造で設計。

---

## 📊 データソース構成

| サイト       | 種別     | 取得手段                           | 更新頻度          | 信頼度 | 備考             |
| ------------ | -------- | ---------------------------------- | ----------------- | ------ | ---------------- |
| **Amazon**   | 公式API  | Product Advertising API            | Daily / On-demand | High   | ASIN / JANで同定 |
| **楽天市場** | 公式API  | Ichiba Item Search API             | Daily             | High   | JAN対応          |
| **iHerb**    | 非公開   | スクレイピングAPI（Bright Data等） | Weekly            | Medium | 後期対応予定     |
| **その他EC** | 将来対応 | 個別                               | TBD               | Low    | 公式API優先      |

---

## 🧩 データスキーマ仕様

### Productドキュメント

```json
{
  "id": "suptia:product:001",
  "title": "Vitamin C 1000mg",
  "brand": "Now Foods",
  "ingredients": [
    { "ref": "ingredient:vitamin-c", "amount": 1000, "unit": "mg" }
  ],
  "prices": [
    {
      "amount": 1980,
      "currency": "JPY",
      "source": "amazon.jp",
      "fetched_at": "2025-10-16T12:00:00Z",
      "confidence": 0.95,
      "url": "https://amazon.co.jp/dp/B000...",
      "affiliate_tag": "suptia-22"
    },
    {
      "amount": 1880,
      "currency": "JPY",
      "source": "rakuten.jp",
      "fetched_at": "2025-10-16T11:30:00Z",
      "confidence": 0.92,
      "url": "https://item.rakuten.co.jp/..."
    }
  ],
  "normalized_unit_price": {
    "per_mg": 1.88,
    "currency": "JPY"
  },
  "confidence_score": 0.93,
  "last_updated": "2025-10-16T12:10:00Z"
}
```

### Ingredientドキュメント

```json
{
  "id": "ingredient:vitamin-c",
  "name": "ビタミンC",
  "aliases": ["アスコルビン酸"],
  "category": "抗酸化ビタミン",
  "recommended_dose_mg": 500,
  "toxicity_upper_mg": 2000,
  "evidence_level": "A",
  "sources": [{ "url": "https://pubmed.ncbi.nlm.nih.gov/..." }]
}
```

---

## 🔍 商品同定ロジック

1. **JAN一致 → 即同一と判定**
2. **ASIN一致 → 同一商品とみなす**
3. **タイトル正規化（ブランド・容量除去）→ 類似度計算（cosine > 0.92）→ 同一候補**
4. **閾値未満（0.92未満）は pending リストで手動レビュー**

結果は `product_linkage` に記録し、毎日再評価。

---

## 🧱 エラーハンドリング

| 状況                       | 対応                                     |
| -------------------------- | ---------------------------------------- |
| HTTP 429 / RateLimit       | Exponential backoff（1s→4s→9s、最大3回） |
| 5xx / Network Error        | キャッシュ返却または再試行               |
| 価格異常値（前回比±80%超） | 一時無効化（監察フラグ）                 |
| 重大エラー                 | Datadog / Sanity監察テーブルに30日保存   |

---

## 📡 監視とアラート基準（SLO）

| メトリクス             | 目標値 | アラート条件 | 通知先        |
| ---------------------- | ------ | ------------ | ------------- |
| price_sync_error_rate  | < 1%   | > 5%         | Slack #infra  |
| cache_hit_rate         | > 90%  | < 80%        | Slack #dev    |
| unmatched_product_rate | < 5%   | > 10%        | Slack #data   |
| API latency            | < 1.5s | > 3s         | MonitoringBot |

---

## ⚖️ 法令・倫理ポリシー

### 薬機法遵守

- 「治る」「改善」などの医療表現は禁止。
- 成分効果は「一般的知見」として説明。

### データライセンス

- 公式APIレスポンスの再配布は禁止。
- キャッシュ保存のみ許可。

### プライバシー

- 個人データはAES暗号化、削除リクエスト即応。

### スクレイピング倫理

- robots.txt禁止領域はアクセス不可。
- Bright Data等の合法サービスのみ使用。

---

## 🧠 GPT / AI連携（将来フェーズ）

- GPTまたはClaude APIとRAG接続。
- 参照データ：成分ガイド、価格履歴、研究要約。
- 出力には必ず出典（source.url / updated_at）を添付。
- Explainable Recommendation（根拠付き推薦）を実現。

---

## 🗺️ フェーズマッピング

| フェーズ | 概要                                     | 状態            |
| -------- | ---------------------------------------- | --------------- |
| 1        | Sanity連携UI構築                         | ✅ 完了         |
| 2        | 意思決定ロジック / コスト算出            | ⏳ 計画中       |
| 2.5      | EC API連携（楽天・Yahoo・Amazon）        | 🔄 進行中       |
| 3        | SEO強化 / 構造化データ / 薬機法対応      | ⏳ 設計中       |
| 4        | 価格アラート / マイページ / 継続利用機能 | ⏳ 計画中       |
| 5        | GPT統合 / 自然言語推薦                   | 🔮 2026以降予定 |

---

## 🚫 禁止事項（DO NOT）

- 非公式APIや明示的に禁止されているスクレイピング
- 医療効能の断定表現（例：「治る」「防ぐ」）
- 個人情報の平文保存
- 出典不明データの使用

---

## 🛒 ECサイト連携・API統合戦略

### 基本方針

Suptiaは段階的にECサイトとの連携を拡大していく方針です。まずは**無料で利用可能な公式API**から開始し、ユーザー数とトラフィックの増加に応じて有料プランや追加のECサイトへと拡張します。

### フェーズ別API統合計画

#### 🎯 **フェーズ1: 公式API（無料範囲）** - 現在

##### 1. **Amazon Product Advertising API (PA-API 5.0)**

**概要**:

- Amazonアソシエイトプログラムへの参加が必須
- 無料で利用可能（売上発生により制限が緩和）
- 1日のリクエスト数: 最大8,640リクエスト（基本アカウント）

**取得可能データ**:

- 商品名、価格、在庫状況
- 商品画像、説明文
- カスタマーレビュー（平均評価、件数）
- ASIN（Amazon商品ID）

**制約**:

- 90日間売上がない場合、API利用が制限される
- リクエストレート: 1リクエスト/秒（基本）
- 売上額に応じてレート制限が緩和

**実装予定**:

- リアルタイム価格取得
- 在庫状況確認
- レビューデータ同期（1日1回）

##### 2. **楽天市場API**

**概要**:

- 楽天アフィリエイトへの登録が必要
- 無料プラン: 月間10,000リクエスト
- 有料プラン: 月額5,000円〜（100,000リクエスト）

**取得可能データ**:

- 商品名、価格、ポイント倍率
- 商品画像、説明文
- レビュー（平均評価、件数）
- 商品URL（アフィリエイトリンク）

**制約**:

- 無料プランは月間10,000リクエストまで
- リクエストレート: 1リクエスト/秒

**実装予定**:

- 価格比較（Amazon vs 楽天）
- ポイント還元率を考慮した実効価格計算
- レビューデータ同期（1日1回）

---

#### 🚀 **フェーズ2: スクレイピングAPI** - 2025年Q2〜

##### 3. **iHerb（Bright Data利用）**

**概要**:

- iHerbには公式APIが存在しない
- Bright DataなどのWebスクレイピングサービスを利用
- 料金: 従量課金制（$500/月〜）

**取得予定データ**:

- 商品名、価格（USD）
- 在庫状況、割引情報
- レビュー（評価、件数）
- 成分情報、栄養成分表示

**制約**:

- スクレイピングは利用規約に抵触する可能性があるため、慎重に運用
- データ取得頻度を制限（1日1回程度）
- Bright Dataのコストが発生

**代替案**:

- iHerbアフィリエイトリンクの手動管理
- ユーザーによる価格報告機能

---

#### 🌐 **フェーズ3: その他ECサイト** - 2025年Q3〜

##### 4. **Yahoo!ショッピング**

- Yahoo!ショッピングWebサービスAPI（無料）
- 月間50,000リクエスト

##### 5. **au PAYマーケット**

- 公式API情報を調査中
- アフィリエイトリンク経由での連携を検討

##### 6. **海外Amazon（Amazon.com）**

- PA-API 5.0で対応可能
- 為替レート換算機能の実装が必要

---

### 技術実装アーキテクチャ

#### データフロー図

```
┌─────────────────────────────────────────────────────────┐
│                     Sanity CMS                          │
│              （商品マスタ・成分データ）                      │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────┐
│             Next.js API Routes                          │
│          （価格同期エンジン・キャッシュ層）                    │
└─────────────────┬───────────────────────────────────────┘
                  │
        ┌─────────┼─────────┬─────────┐
        ↓         ↓         ↓         ↓
   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
   │ Amazon │ │  楽天  │ │ iHerb  │ │ その他 │
   │ PA-API │ │  API   │ │(Bright │ │  API   │
   │        │ │        │ │ Data)  │ │        │
   └────────┘ └────────┘ └────────┘ └────────┘
        ↓         ↓         ↓         ↓
┌─────────────────────────────────────────────────────────┐
│         Redis / Vercel KV Store                         │
│           （価格キャッシュ・在庫状況）                        │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────┐
│              フロントエンド                                │
│    （リアルタイム価格表示・比較UI）                          │
└─────────────────────────────────────────────────────────┘
```

#### APIアダプター層の抽象化

各ECサイトの差異を吸収するため、アダプターパターンを採用します。

```typescript
// 共通インターフェース
interface ProductPriceAdapter {
  fetchPrice(productId: string): Promise<PriceData>;
  fetchStock(productId: string): Promise<StockStatus>;
  fetchReviews(productId: string): Promise<ReviewData>;
}

// Amazon PA-API アダプター
class AmazonAdapter implements ProductPriceAdapter {
  async fetchPrice(asin: string): Promise<PriceData> {
    // Amazon PA-API呼び出し
  }
}

// 楽天API アダプター
class RakutenAdapter implements ProductPriceAdapter {
  async fetchPrice(itemCode: string): Promise<PriceData> {
    // 楽天API呼び出し
  }
}

// iHerb スクレイピングアダプター
class IHerbAdapter implements ProductPriceAdapter {
  async fetchPrice(productId: string): Promise<PriceData> {
    // Bright Data経由でスクレイピング
  }
}
```

---

### コスト最適化戦略

#### 1. **キャッシュ戦略**

- **価格データ**: 6時間キャッシュ（1日4回更新）
- **在庫状況**: 1時間キャッシュ
- **レビューデータ**: 24時間キャッシュ

#### 2. **バッチ処理**

- 深夜（午前3時）に全商品の価格を一括取得
- ユーザーアクセス時はキャッシュから返却
- リアルタイム取得は「価格更新」ボタンを押した場合のみ

#### 3. **段階的スケーリング**

| フェーズ | 月間PV | API呼び出し数 | 月額コスト（概算） |
| -------- | ------ | ------------- | ------------------ |
| MVP      | ~10K   | 20,000        | ¥0（無料範囲）     |
| Growth   | ~100K  | 200,000       | ¥5,000〜¥10,000    |
| Scale    | ~1M    | 2,000,000     | ¥50,000〜¥100,000  |

---

### マネタイズモデル

#### 1. **アフィリエイト収益**

- Amazon アソシエイト: 商品価格の2-10%
- 楽天アフィリエイト: 商品価格の2-8%
- iHerb アフィリエイト: 5-10%

#### 2. **プレミアム機能（将来的）**

- 価格アラート（プッシュ通知）
- 価格履歴グラフ
- AI診断・パーソナライズド推薦
- 広告非表示

---

### 開発優先順位

#### **2025年10月〜11月（現在のフェーズ）**

- [ ] Amazon PA-API 5.0のセットアップ
- [ ] 楽天APIのセットアップ
- [ ] APIアダプター層の実装
- [ ] 価格同期エンジン（バッチ処理）の実装
- [ ] Redisキャッシュ層の構築

#### **2025年12月〜2026年1月**

- [ ] iHerb対応の検討・実装
- [ ] 価格履歴トラッキング機能
- [ ] 価格アラート機能（ベータ版）

#### **2026年2月以降**

- [ ] Yahoo!ショッピング対応
- [ ] 海外Amazon対応
- [ ] プレミアム機能のリリース

---

### 環境変数の追加

以下の環境変数を`.env.local`および Vercel に追加する必要があります：

```bash
# Amazon PA-API 5.0
AMAZON_ACCESS_KEY_ID=your_access_key
AMAZON_SECRET_ACCESS_KEY=your_secret_key
AMAZON_ASSOCIATE_TAG=your_associate_tag
AMAZON_REGION=us-west-2

# 楽天API
RAKUTEN_APPLICATION_ID=your_app_id
RAKUTEN_AFFILIATE_ID=your_affiliate_id

# iHerb (将来的)
IHERB_AFFILIATE_CODE=your_affiliate_code
BRIGHT_DATA_API_KEY=your_api_key

# Redis / Vercel KV
KV_URL=your_kv_url
KV_REST_API_URL=your_rest_api_url
KV_REST_API_TOKEN=your_rest_api_token
```

---

## 記事作成ガイドライン

### 言語とローカライゼーション

**重要: すべての記事は日本語で執筆してください。**

- **UI文字列**: 日本語
- **記事コンテンツ**: 日本語（英語は絶対に使用しないこと）
- **コード/識別子**: 英語（変数名、ファイル名など）
- **メタデータ**: 英語名（`nameEn`）と日本語名（`name`）の両方を提供

### 記事構成と文字数

#### 必須フィールド

すべての成分記事（`ingredient`）には以下のフィールドが必要です：

```typescript
{
  name: string;              // 日本語名: "ビタミンC（アスコルビン酸）"
  nameEn: string;            // 英語名: "Vitamin C (Ascorbic Acid)"
  category: string;          // カテゴリ: "ビタミン"
  description: string;       // 詳細説明（500〜800文字）
  evidenceLevel: string;     // エビデンスレベル: "高", "中", "低"
  benefits: string[];        // 効果・効能（10〜15項目、各100〜200文字）
  recommendedDosage: string; // 推奨摂取量（500〜800文字）
  foodSources: string[];     // 食品源（10〜15項目）
  sideEffects: string;       // 副作用・注意事項（300〜500文字）
  interactions: string[];    // 相互作用（5〜10項目、各100〜150文字）
  faqs: FAQ[];               // よくある質問（5項目）
  references: Reference[];   // 参考文献（5〜10項目）
}
```

#### FAQ構造

各FAQには以下が必要です：

```typescript
{
  question: string; // 質問（50文字以内）
  answer: string; // 回答（500〜1000文字、詳細かつ実用的に）
}
```

#### 最小文字数要件

- **合計文字数**: 3,000文字以上（SEO最適化のため）
- **`description`**: 500〜800文字
- **`benefits`**: 各項目100〜200文字、合計1,500〜2,500文字
- **`recommendedDosage`**: 500〜800文字
- **`sideEffects`**: 300〜500文字
- **各FAQ回答**: 500〜1,000文字

### 記事執筆の原則

#### 1. 科学的正確性

- 必ず信頼できる参考文献を引用（PubMed, Cochrane Review, 厚生労働省など）
- エビデンスレベルを明示（高/中/低）
- 誇大広告を避け、事実ベースの記述

#### 2. 読みやすさ

- 専門用語には説明を加える
- 箇条書きを活用
- 具体的な数値・例を提示（例: 「1日100mg」「吸収率が3〜4倍向上」）

#### 3. 実用性

- 「いつ飲むべきか」「どの形態が良いか」など実践的な情報を提供
- 目的別の推奨量を明記（例: 免疫強化、美肌、運動後回復）
- 食品源を含めた総合的なアドバイス

#### 4. 安全性重視

- 副作用・禁忌を明確に記載
- 相互作用（薬剤、他のサプリメント）を詳細に説明
- 特定の集団への注意喚起（妊婦、授乳婦、病気治療中の方など）

#### 5. 日本語執筆の徹底

- **英語の文章は一切使用しないこと**
- 日本の基準（厚生労働省の推奨量など）を優先的に記載
- 日本人読者にとって分かりやすい表現を使用

### 📱 記事品質改善ガイドライン（2025年10月更新）

**目的**: スマートフォンでの読みやすさを最大化し、ユーザーエクスペリエンスを向上させる

#### 1. 不要な定型文の削除

以下の不要なフレーズは**すべて削除**してください：

```
❌ 削除対象フレーズ：
- "：優れた供給源として知られています"
- "：豊富に含まれています"
- "：良い供給源です"
- "：ビタミンAが豊富です"
- "研究により有効性が確認されており、"（繰り返し出現）
```

**自動処理**: フロントエンドで自動的にクリーニングされますが、元データにも含めないことを推奨

#### 2. 段落と改行の最適化

- **段落の長さ**: 100文字以内で自動改行（スマートフォン対応）
- **接続詞前の改行**: 「また、」「さらに、」「ただし、」の前に自動的に改行挿入
- **箇条書きマーカー**: `•`、`◦`、`・`は自動削除され、リスト形式で表示

#### 3. 妊娠中・授乳中の警告表示

**自動検出キーワード**:

```typescript
["妊婦", "妊娠", "授乳", "胎児", "乳児", "催奇形性", "先天性奇形"];
```

- これらのキーワードが`sideEffects`または`interactions`に含まれる場合、ページ上部に**赤色の警告ボックス**が自動表示されます
- 警告文は自動抽出され、「⚠️ 妊娠中・授乳中の方への注意」として強調表示

**推奨**: 妊娠・授乳への影響がある成分は、必ず`sideEffects`または`interactions`に明記

#### 4. 要約表示（サマリーボックス）

- **自動生成**: `description`の最初の1文（最初の句点まで）が自動的にページ上部の青色ボックスに表示
- **推奨**: `description`の最初の文は、成分の最も重要な特徴を簡潔に記述（50〜80文字）

**良い例**:

```
ビタミンAは脂溶性ビタミンで、視覚、免疫機能、細胞の成長と分化、生殖機能に不可欠な栄養素です。
```

#### 5. 食品源リストの表記

**推奨形式**（シンプルに食品名のみ）:

```json
"foodSources": [
  "レバー（鶏、豚、牛）",
  "うなぎ",
  "にんじん",
  "ほうれん草",
  "かぼちゃ"
]
```

**非推奨**（定型文付き）:

```json
❌ "レバー（鶏、豚、牛）：優れた供給源として知られています"
❌ "にんじん：豊富に含まれています"
```

#### 6. スマートフォン向けスタイリング

**自動適用される改善**:

- 行間: 1.9（読みやすさ向上）
- 段落間マージン: 1.25rem（視覚的な分離）
- 強調テキスト: 青色ハイライト背景
- レスポンシブグリッド: 1列（モバイル）→ 2列（タブレット）

#### 7. データクリーニングチェックリスト

新規記事作成時または既存記事更新時に確認：

- [ ] 不要な定型文（"優れた供給源"など）を削除
- [ ] 二重句読点（。。）を修正
- [ ] 箇条書きマーカー（◦、•）を削除
- [ ] 繰り返しフレーズ（"研究により〜"の重複）を削除
- [ ] 妊娠・授乳への影響を明記（該当する場合）
- [ ] `description`の最初の文が簡潔で分かりやすい
- [ ] `foodSources`がシンプルな食品名のみ

### サンプル記事

参考例: [vitamin-c-article.json](vitamin-c-article.json)

この記事は以下の特徴があります：

- 総文字数: 約5,000文字
- 詳細な`benefits`（12項目）
- 包括的な`recommendedDosage`（800文字以上）
- 実用的なFAQ（5項目、各500〜1,000文字）
- 多様な参考文献（10項目以上）

---

## UIデザイン構成

### デザインシステム

**コンセプト**: トリバゴ風のクリーンで洗練されたUIデザイン

#### カラーパレット

```css
/* プライマリカラー */
--primary: #0066cc; /* メインブルー */
--primary-light: #e6f2ff; /* 淡いブルー背景 */

/* グラデーション */
--gradient-blue: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-mint: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);

/* ニュートラルカラー */
--neutral-50: #f9fafb;
--neutral-100: #f3f4f6;
--neutral-900: #111827;

/* セマンティックカラー */
--success: #10b981;
--warning: #f59e0b;
--danger: #ef4444;
```

#### タイポグラフィ

```css
/* フォントファミリー */
font-family:
  "Inter",
  "Noto Sans JP",
  -apple-system,
  BlinkMacSystemFont,
  sans-serif;

/* フォントウェイト */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;

/* フォントサイズ */
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */
--text-3xl: 1.875rem; /* 30px */
```

#### スペーシング

```css
/* Tailwind標準のスペーシングスケール */
--spacing-1: 0.25rem; /* 4px */
--spacing-2: 0.5rem; /* 8px */
--spacing-4: 1rem; /* 16px */
--spacing-6: 1.5rem; /* 24px */
--spacing-8: 2rem; /* 32px */
```

### レイアウト構成

#### ヘッダー（Header.tsx）

- 高さ: 64px
- 要素: ロゴ、ナビゲーション、検索バー、ログイン/会員登録ボタン
- スタイル: 白背景、軽いボーダー、スティッキー

#### ヒーローセクション（HeroSearch.tsx）

- 背景: グラデーション（`gradient-blue`）
- 中央配置の大きな検索バー
- キャッチコピー: 「科学的エビデンスに基づくサプリ選び」
- 高さ: 約400px

#### 統計バー

- 3つの主要メトリクス:
  - 検証済みサプリ数
  - 平均安全性スコア
  - レビュー総数
- スタイル: ガラスモルフィズム効果（`glass-mint`）

#### 商品カード（ProductCard.tsx）

- レイアウト: グリッド（1列 → 2列 → 3列 → 4列、レスポンシブ）
- カード構成:
  - 商品画像（アスペクト比 4:3）
  - バッジ（ベストバリュー、高安全性）
  - 商品名
  - スター評価 + レビュー数
  - 価格（1日あたりのコスト）
  - CTAボタン
- ホバーエフェクト: `scale-[1.02]`、影の強調

#### フィルタサイドバー（FilterSidebar.tsx）

- 位置: 左サイド（デスクトップ）、モーダル（モバイル）
- フィルタ項目:
  - カテゴリ
  - 価格帯
  - 安全性スコア
  - エビデンスレベル
  - ブランド
- スタイル: アコーディオン形式、チェックボックス/スライダー

#### 成分カルーセル（IngredientCarousel.tsx）

- 人気成分をカードで表示
- スワイプ可能（モバイル）
- 各カードに成分名、カテゴリ、簡単な説明

### コンポーネントライブラリ

#### Badge.tsx

バリアント:

- `bestValue`: 緑系グラデーション、「ベストバリュー」表示
- `success`: 緑系、「高安全性」表示
- `warning`: オレンジ系、警告表示
- `info`: 青系、情報表示

#### StarRating.tsx

- 5段階評価
- サイズ: `sm`, `md`, `lg`
- レビュー数を併記可能

#### Card.tsx

- `Card`: ベースコンテナ（白背景、角丸、軽い影）
- `CardContent`: パディング付きコンテンツエリア
- `CardFooter`: 下部エリア（CTAボタンなど）

### アニメーション

```typescript
// Framer Motion使用
import { motion } from "framer-motion";

// フェードイン
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>

// ホバー
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

### レスポンシブデザイン

#### ブレークポイント

```css
/* Tailwind標準 */
sm: 640px   /* スマートフォン（縦） */
md: 768px   /* タブレット */
lg: 1024px  /* デスクトップ */
xl: 1280px  /* 大型デスクトップ */
2xl: 1536px /* 超大型ディスプレイ */
```

#### グリッドレイアウト

```tsx
// 商品一覧
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

---

## 開発ワークフロー

### 環境セットアップ

```bash
# 依存関係のインストール
npm install

# 環境変数の設定
cp apps/web/.env.local.example apps/web/.env.local
# .env.localを編集してSanityの認証情報を追加

# 開発サーバーの起動
npm run dev
# http://localhost:3000
```

### 利用可能なスクリプト

```bash
# 開発
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run start        # プロダクションサーバー起動

# コード品質
npm run lint         # ESLintチェック
npm run format       # Prettierフォーマット
npm run typecheck    # TypeScript型チェック

# テスト
npm run test         # テスト実行
npm run test:watch   # ウォッチモード

# その他
npm run sitemap      # サイトマップ生成
npm run env:check    # 環境変数同期チェック
```

### Sanityコンテンツ管理

#### Sanityスタジオへのアクセス

```bash
# Sanityスタジオを起動
npx sanity dev
# http://localhost:3333
```

#### 成分記事の追加手順

1. **JSONファイルの作成**
   - ルートディレクトリに `[slug]-article.json` を作成
   - 上記の記事構成に従って内容を記述（日本語で！）

2. **Sanityへのインポート**

```bash
# 単一の記事をインポート
npx sanity dataset import [slug]-article.json production --replace
```

3. **バルク更新**

```bash
# 複数の記事を一括更新
node create-ndjson-for-import.mjs
npx sanity dataset import update-all-ingredients.ndjson production
```

#### データスキーマ

スキーマ定義は `packages/schemas/ingredient.ts` にあります。

主要フィールド:

- `name`: 日本語名（必須）
- `nameEn`: 英語名（必須）
- `slug`: URL識別子（自動生成）
- `category`: カテゴリ（ビタミン、ミネラル、アミノ酸など）
- `description`: 詳細説明（500〜800文字）
- `benefits`: 効果（配列）
- `recommendedDosage`: 推奨摂取量（テキストブロック）
- `sideEffects`: 副作用（テキストブロック）
- `interactions`: 相互作用（配列）
- `faqs`: よくある質問（配列）
- `references`: 参考文献（配列）

### Git ワークフロー

#### コミットメッセージ

```bash
# 形式: <type>: <subject>

# 例:
git commit -m "feat: ビタミンD記事を追加"
git commit -m "fix: 価格計算ロジックを修正"
git commit -m "style: ProductCardのホバーエフェクトを改善"
git commit -m "docs: 記事作成ガイドラインを更新"
```

#### ブランチ戦略

- `master`: 本番環境（保護ブランチ）
- `feature/*`: 新機能開発
- `fix/*`: バグ修正
- `docs/*`: ドキュメント更新

### デプロイ

#### Vercelへの自動デプロイ

- `master`ブランチへのプッシュで自動デプロイ
- プルリクエストごとにプレビュー環境が生成

#### 環境変数（Vercel）

以下の環境変数をVercelプロジェクト設定で追加：

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token
```

---

## セキュリティとコンプライアンス

### 薬機法コンプライアンス

- 疾病の治療・予防効果を標榜しない
- 「改善」「サポート」などの表現を使用
- 医学的アドバイスではないことを明記
- 参考文献を必ず引用

### セキュリティヘッダー

アプリケーションは以下のセキュリティヘッダーを自動配信：

- Content Security Policy (CSP)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy

### 環境変数の管理

- **`NEXT_PUBLIC_*`**: クライアントに露出される公開変数
- **その他**: サーバーのみで利用される秘密変数
- **絶対に** `.env.local` をコミットしないこと

---

## トラブルシューティング

### よくある問題

#### Sanityインポートエラー

```bash
# エラー: "Document validation failed"
# 原因: スキーマとデータの不一致
# 解決: スキーマ定義を確認し、必須フィールドが全て含まれているか確認

# エラー: "SANITY_API_TOKEN is not set"
# 原因: 環境変数が設定されていない
# 解決: .env.localにSANITY_API_TOKENを追加
```

#### ビルドエラー

```bash
# エラー: "Module not found"
# 原因: 依存関係のインストール漏れ
# 解決: npm install を実行

# エラー: "Type error"
# 原因: TypeScriptの型エラー
# 解決: npm run typecheck で詳細を確認
```

#### スタイリングが反映されない

```bash
# 原因: Tailwind CSSのパージ設定
# 解決: tailwind.config.jsのcontent配列にファイルパスが含まれているか確認

# 開発サーバーを再起動
npm run dev
```

### サポートリソース

- **README.md**: プロジェクトの基本情報
- **docs/ONBOARDING.md**: 新規開発者向けオンボーディング
- **docs/DEVELOPMENT_WORKFLOW.md**: 詳細な開発プロセス
- **docs/TROUBLESHOOTING.md**: トラブルシューティングガイド

---

## チェックリスト

### 新規記事作成時

- [ ] すべての必須フィールドを記入（name, nameEn, category, description, etc.）
- [ ] **日本語のみで執筆**（英語の文章は使用しない）
- [ ] 合計文字数が3,000文字以上
- [ ] 信頼できる参考文献を5件以上引用
- [ ] エビデンスレベルを明示
- [ ] 副作用・相互作用を詳細に記載
- [ ] FAQ 5項目（各500〜1,000文字）
- [ ] 薬機法コンプライアンスを確認
- [ ] Sanityへのインポート前にJSONの妥当性を確認

### PRレビュー時

- [ ] `npm run lint` が通る
- [ ] `npm run typecheck` が通る
- [ ] `npm run test` が通る
- [ ] 記事内容の正確性を確認
- [ ] 日本語表現の自然さを確認
- [ ] レスポンシブデザインを確認（モバイル/タブレット/デスクトップ）

---

## 連絡先とサポート

- **リポジトリ**: [GitHub - suptia-project](https://github.com/Ryotaverse69/suptia-project)
- **ドキュメント**: `./docs/` ディレクトリ
- **Issue報告**: GitHubのIssuesセクション

---

## 📝 更新履歴

| 日付       | バージョン | 更新者 | 内容                                                                                     |
| ---------- | ---------- | ------ | ---------------------------------------------------------------------------------------- |
| 2025-10-25 | v1.5.0     | Ryota  | フェーズ2.5追加（EC API連携実装完了）、楽天アダプター・同期スクリプト・Claude Skills実装 |
| 2025-10-16 | v1.3.0     | Ryota  | 行動規範・データスキーマ・エラーハンドリング・SLO・法令ポリシー・AI連携方針を追加        |
| 2025-10-12 | v1.2.0     | Ryota  | ECサイト連携・API統合戦略を追加（Amazon PA-API、楽天API、iHerb対応計画）                 |
| 2025-10-10 | v1.1.0     | Ryota  | UIデザイン構成とコンポーネントライブラリを追加                                           |
| 2025-10-01 | v1.0.0     | Ryota  | 初版作成（Claude Code連携用）                                                            |

---

## 🧩 Claude長期記憶メモ

**Suptia概要**:

- Amazon/Rakuten公式APIを利用した価格・成分・根拠を統合したAIサプリ意思決定エンジン。
- APIがない場合は合法的スクレイピングAPI（Bright Data等）を使用。
- JAN優先の商品同定ロジックとデータ信頼度管理が重要。
- 薬機法遵守・透明性・安全性を最優先とする。
- 段階的にメタサーチエンジンからGPT連携へ進化する。

**重要な制約**:

- 非公式APIや明示的に禁止されているスクレイピングは禁止。
- 医療効能の断定表現は使用不可。
- すべての推薦に出典（研究・価格・成分データ）を明示。
- テスト可能で説明可能な設計を維持。

**現在のフェーズ**:

- フェーズ1（Sanity連携UI構築）✅ 完了
- フェーズ2.5（EC API連携）🔄 進行中
  - 楽天アダプター ✅ 実装済み
  - 商品同期スクリプト ✅ 実装済み
  - Claude Code Skills ✅ 実装済み
  - Yahoo!・Amazon対応 ⏳ 予定

---

---

## 🛠️ Claude Code Skills

SuptiaプロジェクトではClaude Code用のカスタムSkillsを実装しています。これらのSkillsは開発効率を大幅に向上させます。

### 利用可能なSkills

#### 1. **sanity-ingredient-validator** - 成分記事品質チェック

**目的**: Sanityインポート前に成分記事JSONを自動検証

**機能**:

- ✅ 構造チェック（必須フィールド・配列要素数）
- ✅ 薬機法NGワードチェック（治る・治療・予防など）
- ✅ 文字数チェック（日本語文字数を正確にカウント）
- ✅ 参考文献チェック（URL有効性・信頼度評価）
- ✅ エビデンスレベルチェック（S/A/B/C/D）
- ✅ 言語チェック（英語文章の混入検出）

**スコアリングシステム**:

```
総合100点満点
- 構造: 25点
- 薬機法コンプライアンス: 30点（最重要）
- 文字数: 20点
- 参考文献: 15点
- エビデンスレベル: 5点
- 言語: 5点

グレード判定:
- S (90+): 優秀 - インポート推奨
- A (80+): 良好 - 軽微な修正推奨
- B (70+): 合格 - 修正後にインポート
- C (60+): 要修正 - 複数の問題あり
- D (<60): 不合格 - 大幅な修正が必要
```

**使用方法**:

```bash
# 単一ファイルの検証
npx tsx .claude/skills/sanity-ingredient-validator/index.ts vitamin-c-article.json

# バッチモード（複数ファイル）
npx tsx .claude/skills/sanity-ingredient-validator/index.ts --batch "*-article.json"

# エラーのみ表示
npx tsx .claude/skills/sanity-ingredient-validator/index.ts --batch "*-article.json" --errors-only

# レポートを指定ファイルに保存
npx tsx .claude/skills/sanity-ingredient-validator/index.ts vitamin-c-article.json -o report.json
```

**出力例**:

```
┌─────────────────────────────────────────────────────────┐
│         Sanity Ingredient Validator Report              │
├─────────────────────────────────────────────────────────┤
│ File: vitamin-c-article.json                             │
│ Score: 85/100 (Grade: A)                                 │
│ Status: 良好 - 軽微な修正推奨                                   │
└─────────────────────────────────────────────────────────┘

📊 Detailed Scores:
  Structure:   25/25 ✅
  Compliance:  28/30 ✅
  Word Count:  18/20 ⚠️
  References:  12/15 ⚠️
  Evidence:    5/5 ✅
  Language:    5/5 ✅

💡 Recommendations:
  1. descriptionを50文字以上追加してください
  2. 参考文献を1件追加してください
```

**ディレクトリ構造**:

```
.claude/skills/sanity-ingredient-validator/
├── skill.json              # メタデータ
├── index.ts               # エントリーポイント
├── validator.ts           # メインロジック
├── checkers/              # チェッカー
│   ├── structure.ts
│   ├── compliance.ts
│   ├── wordCount.ts
│   ├── references.ts
│   ├── evidence.ts
│   └── language.ts
├── rules/                 # ルール定義
│   ├── ng-words.ts
│   ├── evidence-levels.ts
│   └── trusted-sources.ts
├── scoring.ts             # スコアリング
└── reporter.ts            # レポート生成
```

**薬機法NGワード例**:

```typescript
// Critical（重大違反）
("治る", "治す", "治療", "治癒");
("予防する", "防ぐ", "防止");
("がんに効く", "糖尿病を治す", "高血圧を下げる");

// Warning（警告）
("効く", "効果がある", "改善する");
("若返る", "回復する", "再生する");

// OK表現
("〜をサポート", "〜に役立つ可能性");
("一般的に", "研究では", "〜と言われています");
("健康維持に", "栄養補給として");
```

**エビデンスレベル定義（Suptia独自基準）**:

```
S: 大規模RCTやメタ解析による高い信頼性
   例: ビタミンDと骨密度改善

A: 良質な研究で効果が確認
   例: EPA/DHAと中性脂肪低下

B: 限定的研究・条件付きの効果
   例: マグネシウムと睡眠改善

C: 動物実験・小規模試験レベル
   例: アスタキサンチンと疲労改善

D: 理論・未検証レベル
   例: 未確認ハーブ抽出物
```

**信頼できる参考文献ソース**:

```
Tier 1（最高信頼度）:
- pubmed.ncbi.nlm.nih.gov
- cochrane.org
- mhlw.go.jp（厚生労働省）
- nih.gov

Tier 2（高信頼度）:
- who.int
- scholar.google.com
- sciencedirect.com
- nature.com

Tier 3（中信頼度）:
- researchgate.net
- arxiv.org
```

---

### 今後追加予定のSkills

#### 2. **sanity-bulk-import** - 一括インポートツール

**機能**:

- ✅ 複数JSONファイルの一括インポート
- ✅ validator統合（検証合格ファイルのみインポート）
- ✅ 差分検出・既存データとの比較
- ✅ バックアップ・ロールバック機能
- ✅ エラーハンドリング・リトライ
- ✅ 進捗表示・詳細ログ

**ステータス**: 設計完了、実装予定（フェーズ1後半）

---

**最終更新日**: 2025-10-25
**バージョン**: 1.5.0
**変更内容**: フェーズ2.5追加（EC API連携実装完了）、楽天アダプター・同期スクリプト・EC Sync Skills実装
