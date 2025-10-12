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

## 🗓 フェーズ別ロードマップ

### フェーズ1：データ基盤の完成（10月〜11月）

**目的**: SanityとNext.jsを接続し、すべてのUIが動的データで動く状態に。

**主要タスク**:

- Sanityスキーマ最終確定（Product / Ingredient / Brand / Evidence / Rule / Persona）
- `ingredient_ref`をProductに紐付け
- 成分ページから関連商品を表示
- 検索・フィルター（価格・成分・目的・ブランド）実装
- ダミーデータ100件生成

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

- **リポジトリ**: [GitHub - suptia-project](https://github.com/Ryotaverse69/suptia-kiro)
- **ドキュメント**: `./docs/` ディレクトリ
- **Issue報告**: GitHubのIssuesセクション

---

---

**最終更新日**: 2025-10-12
**バージョン**: 1.2.0
**変更内容**: ECサイト連携・API統合戦略を追加（Amazon PA-API、楽天API、iHerb対応計画）
