# AIコンシェルジュ 実装計画書

作成日: 2025年12月20日
ステータス: 計画中
バージョン: 2.1.0
参照: [AI_CONCIERGE_SPEC.md](./AI_CONCIERGE_SPEC.md)

---

## 目次

1. [設計思想](#1-設計思想)
2. [プロジェクト概要](#2-プロジェクト概要)
3. [技術アーキテクチャ](#3-技術アーキテクチャ)
4. [データベース設計](#4-データベース設計)
5. [Safety機能の責任境界](#5-safety機能の責任境界)
6. [相互作用データソース設計](#6-相互作用データソース設計)
7. [会話履歴管理](#7-会話履歴管理)
8. [パートナーキャラクター機能](#8-パートナーキャラクター機能)
9. [API設計](#9-api設計)
10. [実装フェーズ](#10-実装フェーズ)
11. [プロンプト設計](#11-プロンプト設計)
12. [AIモデル選択戦略](#12-aiモデル選択戦略)
13. [コスト管理](#13-コスト管理)
14. [セキュリティ・コンプライアンス](#14-セキュリティコンプライアンス)
15. [テスト計画](#15-テスト計画)
16. [リスクと対策](#16-リスクと対策)
17. [マイルストーン](#17-マイルストーン)

---

## 1. 設計思想

### 1.1 Suptiaの立ち位置

```
❌ 避けたい方向性: 「AIが最適解を出す」
✅ Suptiaの立ち位置: 「人間が納得して選べる状態を作る」
```

Suptiaは「賢いAI」ではなく、**「信頼される判断補助エンジン」** である。

### 1.2 一貫して守る原則

| 原則                         | 説明                                                 |
| ---------------------------- | ---------------------------------------------------- |
| **推薦理由の可視化**         | なぜこの商品なのかを5つの柱で説明                    |
| **重み付けの説明**           | ユーザーの優先事項に基づく順位の理由を開示           |
| **Safety情報は翻訳的に提示** | AIは「判断」ではなく「注意喚起・情報の翻訳」に徹する |
| **出典の明示**               | 根拠となるガイドライン・研究を常に提示               |

### 1.3 設計全体で守る3原則（v2.1最終固定）

```
1. 断定しない - AIは判断者ではなく翻訳者
2. 理由を説明する - 推薦には必ず根拠を提示
3. 重み付けを見せる - ユーザーが選んでいる感覚を作る
```

### 1.4 AIの役割定義

```typescript
const AI_ROLE = {
  // ✅ AIがやること
  permitted: [
    "公的ガイドラインの情報を分かりやすく翻訳",
    "複数の情報源を統合して提示",
    "推薦理由を5つの柱で可視化",
    "注意喚起レベルの提示（判断ではない）",
    "医師・薬剤師への相談推奨",
    "重み付けを可視化してユーザーの選択を支援", // v2.1追加
  ],

  // ❌ AIがやらないこと
  prohibited: [
    "医療判断の代替",
    "「避けるべき」「飲むべき」の断定",
    "安全性の保証",
    "数値スコアによるリスク判定",
    "ガイドラインにない推測的警告",
    "ユーザーを特定の選択に誘導する表現", // v2.1追加
  ],
};
```

---

## 2. プロジェクト概要

### 2.1 目的

Suptia AIコンシェルジュは、サプリメント選びを対話形式でサポートするAI機能。
既存の5つの柱（価格・成分量・コスパ・エビデンス・安全性）を活用し、
**「なぜこの商品なのか」を美しく説明する体験** を提供する。

### 2.2 コアバリュー

```
「AIが答えを出す時代。Suptiaはその根拠を示す。」
「AIは一般論。Suptiaはあなた専用。」
```

### 2.3 成功指標（KPI）

#### 事業指標

| 指標                   | Phase 1 目標 | Phase 4 目標 |
| ---------------------- | ------------ | ------------ |
| DAU（チャット利用者）  | 100人/日     | 500人/日     |
| Pro転換率              | 3%           | 8%           |
| Safety転換率           | 1%           | 5%           |
| 平均会話数/ユーザー    | 3回          | 8回          |
| キャラクター継続利用率 | -            | 60%          |
| AIコスト/収益比        | <60%         | <40%         |

#### 品質指標（v2.0追加）

| 指標                         | Phase 1 目標 | Phase 4 目標 | 計測方法                       |
| ---------------------------- | ------------ | ------------ | ------------------------------ |
| **回答納得度**               | 70%          | 85%          | 回答後の「参考になった」ボタン |
| **再質問率（同一トピック）** | <30%         | <15%         | 同セッション内の再質問を計測   |
| **推薦理由の閲覧率**         | 40%          | 60%          | 「詳細を見る」クリック率       |

#### 信頼性指標（v2.1追加）

| 指標                           | Phase 1 目標 | Phase 4 目標 | 計測方法                       | 意図                               |
| ------------------------------ | ------------ | ------------ | ------------------------------ | ---------------------------------- |
| **Advisory表示後の購入回避率** | 計測開始     | 計測継続     | 警告表示後の行動追跡           | AIが過度に誘導していないことの証明 |
| **代替案提示後の再選択率**     | 計測開始     | 30%以上      | Medium/High時の代替案クリック  | ユーザーが選び直せている           |
| **「理由が分かった」評価**     | 50%          | 70%          | 推薦理由表示後のアンケート     | 納得感の定量化                     |
| **重み調整後の満足度**         | -            | 80%          | キャラ変更後のセッション継続率 | 自分で選んでいる体験               |

> 信頼性指標は「Suptiaがユーザーを無理に誘導していない」ことを数値で証明する。
> 将来の医師連携、B2B API、海外展開時の信用指標となる。

---

## 3. 技術アーキテクチャ

### 3.1 システム構成図

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│  ChatUI Component                                               │
│  ├── ChatWindow (メッセージ表示)                                │
│  ├── ChatInput (入力フォーム)                                   │
│  ├── ChatSidebar (履歴一覧)                                    │
│  ├── CharacterSelector (パートナー選択)                         │
│  ├── AdvisoryBanner (注意喚起バナー)    ← RiskScore廃止        │
│  └── UpgradePrompt (アップセル)                                 │
├─────────────────────────────────────────────────────────────────┤
│  ConciergeContext (状態管理)                                    │
│  ├── messages[] (会話履歴)                                      │
│  ├── plan (ユーザープラン)                                      │
│  ├── usage (利用回数)                                           │
│  ├── character (選択中キャラクター)                             │
│  ├── recommendationStyle (キャラ別推薦スタイル)                 │
│  └── personalization (パーソナライズレベル)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js API Routes)             │
├─────────────────────────────────────────────────────────────────┤
│  /api/concierge/chat                                            │
│  ├── 認証・プラン確認                                           │
│  ├── キャラクター設定取得                                       │
│  ├── Safety強制フラグ判定 ← v2.0追加                            │
│  ├── レート制限チェック                                         │
│  ├── キャッシュ検索                                             │
│  ├── AI呼び出し（モデル選択）                                   │
│  └── レスポンス整形                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI Service Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  ConciergeService                                               │
│  ├── PromptBuilder (プラン別・キャラ別プロンプト構築)           │
│  ├── ModelSelector (Haiku/Sonnet/Opus + Safety強制)             │
│  ├── ResponseFormatter (回答整形)                               │
│  └── ComplianceChecker (薬機法チェック)                         │
├─────────────────────────────────────────────────────────────────┤
│  RecommendationService                                          │
│  ├── 既存: recommendation-engine.ts                             │
│  ├── 既存: detailed-recommendation-engine.ts                    │
│  ├── CharacterWeightAdjuster ← v2.0追加                         │
│  └── 既存: goal-ingredient-mapping.ts                           │
├─────────────────────────────────────────────────────────────────┤
│  AdvisoryService (旧SafetyService)                              │
│  ├── AdvisoryChecker (注意喚起レベル判定)                       │
│  ├── IngredientAdvisor (成分情報翻訳)                           │
│  └── GuidelineTranslator (ガイドライン翻訳)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                 │
├─────────────────────────────────────────────────────────────────┤
│  Supabase                           │  外部データソース         │
│  ├── users (プラン情報)             │  ├── Layer1: 公的DB       │
│  ├── user_profiles (健康情報)       │  ├── Layer2: 二次情報     │
│  ├── user_characters (キャラ設定)   │  └── Layer3: 一般注意     │
│  ├── chat_sessions (会話履歴)       │                           │
│  ├── chat_messages (メッセージ)     │  Sanity                   │
│  ├── usage_logs (利用ログ)          │  ├── products             │
│  └── advisories (注意喚起ログ)      │  ├── ingredients          │
│                                     │  └── evidences            │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 既存資産の活用

| カテゴリ         | 既存ファイル                      | 活用方法               |
| ---------------- | --------------------------------- | ---------------------- |
| 認証             | `contexts/AuthContext.tsx`        | ユーザー認証状態の取得 |
| プロフィール     | `contexts/UserProfileContext.tsx` | 健康目標・既往歴の取得 |
| 推薦エンジン     | `lib/recommendation-engine.ts`    | 商品推薦ロジック       |
| 安全性チェック   | `lib/safety-checker.ts`           | 成分安全性評価         |
| コンプライアンス | `lib/compliance/`                 | 薬機法NGワードチェック |
| バッジ           | `lib/badges-v2.ts`                | 商品評価・ランキング   |
| 価格管理         | `lib/price-manager.ts`            | 価格履歴取得           |

---

## 4. データベース設計

### 4.1 新規テーブル（Supabase）

```sql
-- ユーザープラン管理
CREATE TABLE user_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'pro_safety')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ユーザーキャラクター設定（推薦スタイル含む）
CREATE TABLE user_characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id TEXT NOT NULL DEFAULT 'navi',
  custom_name TEXT,
  -- v2.0: キャラクター別推薦スタイル
  recommendation_style TEXT DEFAULT 'balanced'
    CHECK (recommendation_style IN ('balanced', 'evidence', 'cost', 'safety')),
  last_changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- チャットセッション
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id TEXT NOT NULL DEFAULT 'navi',
  title TEXT,
  summary TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- チャットメッセージ
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 利用ログ（レート制限・コスト分析・品質指標用）
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  model TEXT,
  tokens_input INTEGER,
  tokens_output INTEGER,
  cost_usd DECIMAL(10, 6),
  cache_hit BOOLEAN DEFAULT FALSE,
  -- v2.0: 品質指標用
  user_feedback TEXT CHECK (user_feedback IN ('helpful', 'not_helpful', NULL)),
  is_followup_question BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- v2.0: 注意喚起ログ（RiskScoreからAdvisoryLevelへ変更）
CREATE TABLE advisory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
  advisory_level TEXT NOT NULL CHECK (advisory_level IN ('low', 'medium', 'high')),
  advisory_type TEXT NOT NULL, -- 'guideline_warning', 'documented_interaction', 'general_caution'
  substance_names TEXT[],
  source_layer TEXT NOT NULL CHECK (source_layer IN ('layer1', 'layer2', 'layer3')),
  source_name TEXT NOT NULL,
  source_url TEXT,
  user_action TEXT, -- 'proceeded', 'avoided', 'consulted_pro', NULL
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_user_plans_user_id ON user_plans(user_id);
CREATE INDEX idx_user_characters_user_id ON user_characters(user_id);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_expires_at ON chat_sessions(expires_at);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_usage_logs_user_id_created_at ON usage_logs(user_id, created_at);
CREATE INDEX idx_advisory_logs_user_id ON advisory_logs(user_id);
```

### 4.2 RLS（Row Level Security）ポリシー

```sql
-- user_characters
ALTER TABLE user_characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own character" ON user_characters
  FOR ALL USING (auth.uid() = user_id);

-- chat_sessions
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sessions" ON chat_sessions
  FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);
CREATE POLICY "Users can create own sessions" ON chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON chat_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages in own sessions" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
      AND chat_sessions.deleted_at IS NULL
    )
  );
CREATE POLICY "Users can create messages in own sessions" ON chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

-- advisory_logs
ALTER TABLE advisory_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own advisory logs" ON advisory_logs
  FOR SELECT USING (auth.uid() = user_id);
```

---

## 5. Safety機能の責任境界

### 5.1 設計原則（最重要）

```
RiskScore（数値判定） → AdvisoryLevel（注意喚起レベル）

AIは「判断」ではなく「注意喚起・情報の翻訳」に徹する。
```

### 5.2 AdvisoryLevel定義

```typescript
/**
 * RiskScoreは廃止。数値による判定は医療判断に近づきすぎる。
 * AdvisoryLevelは「注意喚起の度合い」であり、「危険度」ではない。
 */
type AdvisoryLevel = "low" | "medium" | "high";

interface Advisory {
  level: AdvisoryLevel;
  type: AdvisoryType;
  message: string; // ユーザー向けメッセージ
  sourceLayer: SourceLayer; // データソースの信頼性レイヤー
  sourceName: string; // 出典名
  sourceUrl?: string; // 出典URL
  originalText?: string; // 元の記載（翻訳前）
}

type AdvisoryType =
  | "guideline_warning" // 公的ガイドラインに記載あり
  | "documented_interaction" // 文献で報告された相互作用
  | "general_caution"; // 一般的な注意事項
```

### 5.3 表現ガイドライン

**❌ 禁止表現（判断・断定）**

```
- 「この成分は避けるべきです」
- 「危険度スコア: 75点」
- 「服用しないでください」
- 「リスクが高いです」
```

**✅ 許可表現（注意喚起・翻訳）**

```
- 「厚生労働省のガイドラインでは、○○との併用について注意が示されています」
- 「Natural Medicines Databaseによると、△△との相互作用が報告されています」
- 「この点については、医師・薬剤師にご相談されることをお勧めします」
- 「注意レベル: Medium（確認推奨）」
```

### 5.4 AdvisoryLevel判定ロジック

```typescript
const determineAdvisoryLevel = (
  advisoryType: AdvisoryType,
  sourceLayer: SourceLayer,
): AdvisoryLevel => {
  // Layer1（公的DB）の警告 → High
  if (sourceLayer === "layer1" && advisoryType === "guideline_warning") {
    return "high";
  }

  // Layer1/2の文献報告 → Medium
  if (
    (sourceLayer === "layer1" || sourceLayer === "layer2") &&
    advisoryType === "documented_interaction"
  ) {
    return "medium";
  }

  // その他 → Low
  return "low";
};
```

### 5.5 UI文言ガイドライン（v2.1追加）

**目的**: Safetyを「怖い機能」ではなく「後悔を減らす保険」として認識させる

| 内部用語           | UI表示文言                         | 意図             |
| ------------------ | ---------------------------------- | ---------------- |
| 禁忌スクリーニング | 事前に知っておきたい注意点チェック | 不安を煽らない   |
| 相互作用アラート   | 一緒に使うと注意が必要な組み合わせ | 怖さを軽減       |
| リスク検出         | 確認しておきたいポイント           | 中立的な表現     |
| 危険な組み合わせ   | 専門家に相談したい組み合わせ       | 誘導ではなく提案 |
| 服用禁止           | （使用しない - 断定表現のため）    | -                |

### 5.6 AdvisoryLevel別の行動導線UI（v2.1追加）

**目的**: AIが止めた印象を与えず、ユーザー自身が選び直した体験を作る

```typescript
interface AdvisoryUIConfig {
  level: AdvisoryLevel;
  banner: BannerConfig;
  actions: ActionButton[];
  purchaseCTA: CTAConfig;
}

const ADVISORY_UI_CONFIG: Record<AdvisoryLevel, AdvisoryUIConfig> = {
  low: {
    level: "low",
    banner: {
      icon: "ℹ️",
      title: "参考情報",
      color: "gray",
    },
    actions: [{ label: "詳細を見る", style: "text" }],
    purchaseCTA: {
      style: "normal",
      label: "購入サイトへ",
    },
  },

  medium: {
    level: "medium",
    banner: {
      icon: "💡",
      title: "確認をお勧めします",
      color: "yellow",
    },
    actions: [
      { label: "別の選択肢も見る", style: "primary", highlight: true },
      { label: "詳細を見る", style: "text" },
    ],
    purchaseCTA: {
      style: "normal",
      label: "購入サイトへ",
    },
  },

  high: {
    level: "high",
    banner: {
      icon: "🔍",
      title: "重要な情報があります",
      color: "orange",
    },
    actions: [
      {
        label: "より安全な代替案を見る",
        style: "primary",
        highlight: true,
        autoShow: true,
      },
      { label: "専門家に相談する情報を保存", style: "secondary" },
      { label: "詳細を見る", style: "text" },
    ],
    purchaseCTA: {
      style: "subtle", // 控えめに表示
      label: "このまま購入サイトへ",
    },
  },
};
```

### 5.7 UI表現例

**Low（参考情報）**

```
┌─────────────────────────────────────────────────────────────┐
│  ℹ️ 参考情報                                                │
│  一般的に、高用量の摂取は控えめにすることが推奨されています │
│  [詳細を見る]                                               │
│                                                             │
│  [購入サイトへ]                                             │
└─────────────────────────────────────────────────────────────┘
```

**Medium（確認推奨）**

```
┌─────────────────────────────────────────────────────────────┐
│  💡 確認をお勧めします                                      │
│                                                             │
│  厚生労働省のガイドラインでは、○○との併用について          │
│  注意が示されています。                                     │
│                                                             │
│  📚 出典: 厚生労働省 健康食品の安全性情報                   │
│                                                             │
│  [⭐ 別の選択肢も見る]  [詳細を見る]                        │
│                                                             │
│  [購入サイトへ]                                             │
└─────────────────────────────────────────────────────────────┘
```

**High（重要情報）**

```
┌─────────────────────────────────────────────────────────────┐
│  🔍 重要な情報があります                                    │
│                                                             │
│  PMDAの添付文書によると、この成分と現在服用中のお薬には     │
│  確認が推奨される組み合わせがあります。                     │
│                                                             │
│  📚 出典: 医薬品添付文書データベース（PMDA）                │
│  🔗 https://www.pmda.go.jp/...                               │
│                                                             │
│  ※この情報は注意喚起であり、医療判断ではありません。        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  🌿 より安全な代替案                                │    │
│  │  以下の商品は同じ効果が期待でき、注意点が少ないです │    │
│  │  ・商品A（ビタミンD3 1000IU）                       │    │
│  │  ・商品B（ビタミンD3 2000IU）                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  [⭐ 代替案を詳しく見る]  [専門家に相談する情報を保存]       │
│                                                             │
│  [このまま購入サイトへ]  ← 控えめなスタイル                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. 相互作用データソース設計

### 6.1 設計原則

```
相互作用DBを網羅的に自前構築しない。
データソースを3レイヤーに分離し、責任範囲を明確化する。
```

### 6.2 3レイヤー構造

```typescript
type SourceLayer = "layer1" | "layer2" | "layer3";

const DATA_SOURCES: Record<SourceLayer, DataSourceConfig> = {
  // Layer 1: 公的／準公的データ（最優先・最高信頼性）
  layer1: {
    priority: 1,
    reliability: "highest",
    sources: [
      {
        name: "厚生労働省",
        type: "government",
        url: "https://www.mhlw.go.jp/",
        dataTypes: ["guideline_warning"],
      },
      {
        name: "医薬品添付文書（PMDA）",
        type: "government",
        url: "https://www.pmda.go.jp/",
        dataTypes: ["guideline_warning", "documented_interaction"],
      },
      {
        name: "FDA",
        type: "government",
        url: "https://www.fda.gov/",
        dataTypes: ["guideline_warning"],
      },
      {
        name: "EFSA",
        type: "government",
        url: "https://www.efsa.europa.eu/",
        dataTypes: ["guideline_warning"],
      },
    ],
  },

  // Layer 2: 信頼性の高い二次情報（参照）
  layer2: {
    priority: 2,
    reliability: "high",
    sources: [
      {
        name: "Natural Medicines Database",
        type: "subscription",
        url: "https://naturalmedicines.therapeuticresearch.com/",
        dataTypes: ["documented_interaction"],
      },
      {
        name: "Examine.com",
        type: "reference",
        url: "https://examine.com/",
        dataTypes: ["documented_interaction"],
      },
      {
        name: "DrugBank",
        type: "reference",
        url: "https://go.drugbank.com/",
        dataTypes: ["documented_interaction"],
      },
      {
        name: "PubMed (RCT/SR)",
        type: "literature",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        dataTypes: ["documented_interaction"],
      },
    ],
  },

  // Layer 3: Suptia独自の一般的注意整理（最小限・断定禁止）
  layer3: {
    priority: 3,
    reliability: "moderate",
    sources: [
      {
        name: "Suptia 一般注意事項",
        type: "internal",
        dataTypes: ["general_caution"],
        note: "断定表現禁止。「一般的に〜と言われています」形式のみ",
      },
    ],
  },
};
```

### 6.3 データ構造

```typescript
interface AdvisoryData {
  id: string;
  sourceLayer: SourceLayer;
  sourceName: string;
  sourceUrl?: string;
  advisoryType: AdvisoryType;

  // 対象物質
  substances: {
    name: string;
    nameEn?: string;
    type: "ingredient" | "drug" | "condition";
  }[];

  // 注意喚起内容
  advisory: {
    level: AdvisoryLevel;
    originalText: string; // 元の記載
    translatedText: string; // 平易な日本語
    recommendation: string; // 推奨アクション（相談推奨など）
  };

  // メタデータ
  lastVerified: string; // 最終確認日
  expiresAt?: string; // 有効期限（定期的な再確認用）
}
```

### 6.4 データ取得優先順位

```typescript
const getAdvisories = async (substances: string[]): Promise<Advisory[]> => {
  const advisories: Advisory[] = [];

  // Layer 1を優先的に検索
  const layer1Results = await searchLayer1(substances);
  advisories.push(...layer1Results);

  // Layer 1で見つからない場合のみLayer 2を検索
  const uncoveredSubstances = substances.filter(
    (s) => !layer1Results.some((r) => r.substances.includes(s)),
  );
  if (uncoveredSubstances.length > 0) {
    const layer2Results = await searchLayer2(uncoveredSubstances);
    advisories.push(...layer2Results);
  }

  // Layer 3は補足情報としてのみ使用
  const layer3Results = await searchLayer3(substances);
  advisories.push(
    ...layer3Results.filter((r) => r.advisoryType === "general_caution"),
  );

  return advisories;
};
```

---

## 7. 会話履歴管理

### 7.1 プラン別の保存ポリシー

| プラン         | 保存期間 | セッション数 | コンテキスト     | 用途                   |
| -------------- | -------- | ------------ | ---------------- | ---------------------- |
| **未ログイン** | 保存なし | -            | 現セッションのみ | ブラウザセッション限定 |
| **無料**       | 3日間    | 最新5件      | 直近2往復        | 短期的な継続会話       |
| **Pro**        | 30日間   | 最新50件     | 直近5往復        | 過去の相談を振り返り   |
| **Pro+Safety** | 無制限   | 無制限       | 直近10往復       | 長期的な健康管理記録   |

### 7.2 データ構造

```typescript
interface ChatSession {
  id: string;
  userId: string;
  characterId: string;
  title: string;
  summary?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  metadata: {
    recommendedProducts?: string[];
    sources?: Source[];
    advisories?: Advisory[]; // v2.0: RiskScore → Advisory
    model?: string;
    tokensUsed?: number;
    cacheHit?: boolean;
    userFeedback?: "helpful" | "not_helpful"; // v2.0: 品質指標
  };
  createdAt: Date;
}

const HISTORY_CONFIG: Record<UserPlan, HistoryConfig> = {
  guest: { retentionDays: 0, maxSessions: 0, contextMessages: 2 },
  free: { retentionDays: 3, maxSessions: 5, contextMessages: 4 },
  pro: { retentionDays: 30, maxSessions: 50, contextMessages: 10 },
  pro_safety: { retentionDays: null, maxSessions: null, contextMessages: 20 },
};
```

### 7.3 自動クリーンアップ（Vercel Cron）

```typescript
// /api/cron/cleanup-sessions
// 毎日 4:00 JST に実行

export async function GET() {
  const supabase = createAdminClient();

  // 1. 期限切れセッションのメッセージを削除
  await supabase
    .from("chat_messages")
    .delete()
    .in(
      "session_id",
      supabase
        .from("chat_sessions")
        .select("id")
        .lt("expires_at", new Date().toISOString()),
    );

  // 2. 期限切れセッションを削除
  await supabase
    .from("chat_sessions")
    .delete()
    .lt("expires_at", new Date().toISOString());

  // 3. Pro+Safety: 30日以上前のセッションを要約化
  const oldSessions = await supabase
    .from("chat_sessions")
    .select("id, user_id")
    .is("summary", null)
    .lt("created_at", subDays(new Date(), 30).toISOString());

  for (const session of oldSessions.data || []) {
    await summarizeAndCompressSession(session.id);
  }

  return Response.json({ success: true });
}
```

---

## 8. パートナーキャラクター機能

### 8.1 概要

ユーザーがAIコンシェルジュの性格・口調・推薦スタイルを選択できる機能。
**v2.0では推薦ロジックの重み付けもキャラクターごとに異なる。**

### 8.2 キャラクター一覧

| ID     | 名前   | 性格           | 口調        | 推薦スタイル   | 対象     |
| ------ | ------ | -------------- | ----------- | -------------- | -------- |
| `navi` | ナビ   | 丁寧・信頼感   | です/ます調 | バランス型     | 全プラン |
| `mint` | ミント | フレンドリー   | 〜だよ/〜ね | コスパ重視     | Pro以上  |
| `doc`  | ドク   | 論理的・知的   | である調    | エビデンス重視 | Pro以上  |
| `haru` | ハル   | 優しい・励まし | 柔らか敬語  | 安全性重視     | Pro以上  |

### 8.3 キャラクター別推薦ロジック（v2.0追加）

```typescript
/**
 * キャラクターごとに5つの柱の重み付けが異なる。
 * 同じ質問でも順位が変わることで「人格を持つAI体験」を実現。
 */
interface RecommendationWeights {
  price: number; // 💰 価格
  amount: number; // 📊 成分量
  costPerformance: number; // 💡 コスパ
  evidence: number; // 🔬 エビデンス
  safety: number; // 🛡️ 安全性
}

const CHARACTER_WEIGHTS: Record<string, RecommendationWeights> = {
  navi: {
    // バランス型: すべて均等
    price: 1.0,
    amount: 1.0,
    costPerformance: 1.0,
    evidence: 1.0,
    safety: 1.0,
  },

  mint: {
    // コスパ重視: 価格とコスパを重視
    price: 1.3,
    amount: 0.9,
    costPerformance: 1.4,
    evidence: 0.8,
    safety: 0.9,
  },

  doc: {
    // エビデンス重視: 科学的根拠を最重視
    price: 0.7,
    amount: 1.0,
    costPerformance: 0.8,
    evidence: 1.5,
    safety: 1.0,
  },

  haru: {
    // 安全性重視: 安全性を最重視
    price: 0.8,
    amount: 0.9,
    costPerformance: 0.8,
    evidence: 1.0,
    safety: 1.5,
  },
};

const calculateScore = (product: Product, characterId: string): number => {
  const weights = CHARACTER_WEIGHTS[characterId];

  return (
    product.priceScore * weights.price +
    product.amountScore * weights.amount +
    product.costPerformanceScore * weights.costPerformance +
    product.evidenceScore * weights.evidence +
    product.safetyScore * weights.safety
  );
};
```

### 8.4 重み付け可視化UI（v2.1追加）

**目的**: 「AIを信じる」ではなく「自分で重みを選んでいる」体験を提供する

**対象**: Pro以上のプラン

```typescript
/**
 * 重み付けをパーセンテージで可視化
 */
const calculateWeightPercentages = (
  characterId: string,
): Record<string, number> => {
  const weights = CHARACTER_WEIGHTS[characterId];
  const total = Object.values(weights).reduce((sum, w) => sum + w, 0);

  return {
    price: Math.round((weights.price / total) * 100),
    amount: Math.round((weights.amount / total) * 100),
    costPerformance: Math.round((weights.costPerformance / total) * 100),
    evidence: Math.round((weights.evidence / total) * 100),
    safety: Math.round((weights.safety / total) * 100),
  };
};

// 表示例
// ナビ: 価格20% / 成分量20% / コスパ20% / エビデンス20% / 安全性20%
// ミント: 価格25% / 成分量17% / コスパ27% / エビデンス15% / 安全性17%
// ドク: 価格14% / 成分量20% / コスパ16% / エビデンス30% / 安全性20%
// ハル: 価格16% / 成分量17% / コスパ16% / エビデンス20% / 安全性30%
```

**UI表示例（推薦結果の上部）**

```
┌─────────────────────────────────────────────────────────────┐
│  🔬 ドクの推薦スタイル                                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ エビデンス ████████████████████████████████ 30%     │    │
│  │ 安全性     ████████████████████             20%     │    │
│  │ 成分量     ████████████████████             20%     │    │
│  │ コスパ     ████████████                     16%     │    │
│  │ 価格       ██████████                       14%     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  「科学的根拠を最重視し、エビデンスレベルの高い商品を       │
│    優先している」                                           │
│                                                             │
│  [他のスタイルで見る]                                       │
└─────────────────────────────────────────────────────────────┘
```

**キャラクター選択画面での表示**

```
┌─────────────────────────────────────────────────────────────┐
│  パートナーを選ぶ                                           │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   🧭 ナビ    │  │   🌿 ミント   │  │   🔬 ドク    │       │
│  │  バランス型  │  │  コスパ重視  │  │ エビデンス重視│       │
│  │              │  │              │  │              │       │
│  │ 全て20%均等  │  │ コスパ27%    │  │ エビデンス30%│       │
│  │              │  │ 価格25%      │  │ 安全性20%    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                             │
│  ┌──────────────┐                                           │
│  │   🌸 ハル    │  ← Pro+Safety限定                        │
│  │  安全性重視  │                                           │
│  │              │                                           │
│  │ 安全性30%    │                                           │
│  │ エビデンス20%│                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

### 8.5 キャラクター定義

```typescript
interface Character {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  tone: string;
  greeting: string;
  recommendationStyle: string; // v2.0: 推薦スタイルの説明
  availablePlans: UserPlan[];
}

const CHARACTERS: Record<string, Character> = {
  navi: {
    id: "navi",
    name: "ナビ",
    avatar: "/avatars/navi.png",
    personality: "丁寧で信頼感のある専門家",
    tone: `
      - です/ます調で丁寧に話す
      - 専門用語は分かりやすく説明
      - 「ご質問ありがとうございます」など礼儀正しい
    `,
    greeting: "こんにちは。サプリメント選びのお手伝いをさせていただきます。",
    recommendationStyle: "バランスよく5つの柱を考慮してご提案します",
    availablePlans: ["free", "pro", "pro_safety"],
  },

  mint: {
    id: "mint",
    name: "ミント",
    avatar: "/avatars/mint.png",
    personality: "フレンドリーで親しみやすい友達のような存在",
    tone: `
      - 〜だよ/〜ね と親しみやすく話す
      - 絵文字を適度に使う（🌿✨💪など）
      - 「一緒に見てみよう！」など共感的
    `,
    greeting: "やっほー！サプリのこと、なんでも聞いてね 🌿",
    recommendationStyle: "コスパ重視でお財布に優しい選択肢を探すよ！",
    availablePlans: ["pro", "pro_safety"],
  },

  doc: {
    id: "doc",
    name: "ドク",
    avatar: "/avatars/doc.png",
    personality: "論理的で知識豊富な研究者タイプ",
    tone: `
      - である調で知的に話す
      - データや研究結果を重視して引用
      - 「エビデンスによると〜」など根拠を明示
    `,
    greeting:
      "サプリメントに関する質問を受け付ける。エビデンスに基づいた情報を提供しよう。",
    recommendationStyle:
      "科学的根拠を最重視し、エビデンスレベルの高い商品を優先する",
    availablePlans: ["pro", "pro_safety"],
  },

  haru: {
    id: "haru",
    name: "ハル",
    avatar: "/avatars/haru.png",
    personality: "優しく励ましてくれる伴走者",
    tone: `
      - 柔らかい敬語で話す
      - 「頑張ってますね」など励ましの言葉
      - 不安に寄り添う姿勢
    `,
    greeting: "こんにちは。健康のこと、一緒に考えていきましょうね。",
    recommendationStyle:
      "安全性を最優先に、安心して続けられる商品をご提案します",
    availablePlans: ["pro", "pro_safety"],
  },
};
```

### 8.5 プラン別の制限

| 機能             | 無料     | Pro      | Pro+Safety |
| ---------------- | -------- | -------- | ---------- |
| キャラクター選択 | ナビのみ | 全キャラ | 全キャラ   |
| キャラ変更回数   | -        | 月3回    | 無制限     |
| カスタム名前     | -        | -        | ✅         |
| 推薦スタイル確認 | -        | ✅       | ✅         |

---

## 9. API設計

### 9.1 エンドポイント一覧

| Method | Endpoint                              | 説明                       | 認証 |
| ------ | ------------------------------------- | -------------------------- | ---- |
| POST   | `/api/concierge/chat`                 | メッセージ送信             | 任意 |
| POST   | `/api/concierge/chat/feedback`        | 回答へのフィードバック     | 任意 |
| GET    | `/api/concierge/sessions`             | セッション一覧取得         | 必須 |
| GET    | `/api/concierge/sessions/[id]`        | セッション詳細取得         | 必須 |
| DELETE | `/api/concierge/sessions/[id]`        | セッション削除             | 必須 |
| GET    | `/api/concierge/usage`                | 利用状況取得               | 任意 |
| GET    | `/api/concierge/character`            | キャラクター設定取得       | 必須 |
| PUT    | `/api/concierge/character`            | キャラクター変更           | 必須 |
| POST   | `/api/concierge/sessions/[id]/export` | 会話エクスポート           | 必須 |
| POST   | `/api/concierge/advisory/action`      | Advisory後のアクション記録 | 必須 |

### 9.2 チャットAPI詳細

```typescript
// POST /api/concierge/chat
interface ChatRequest {
  message: string;
  sessionId?: string;
  characterId?: string;
  context?: {
    currentProductId?: string;
    ingredientSlug?: string;
  };
}

interface ChatResponse {
  message: {
    id: string;
    role: "assistant";
    content: string;
    metadata: {
      characterId: string;
      characterName: string;
      recommendationStyle: string; // v2.0
      recommendedProducts?: ProductSummary[];
      sources?: Source[];
      advisories?: Advisory[]; // v2.0: RiskScore → Advisory
      disclaimer?: string;
    };
  };
  session: {
    id: string;
    title: string;
    characterId: string;
  };
  usage: {
    remaining: number;
    limit: number;
    resetAt: string;
  };
  upgradePrompt?: UpgradePrompt;
}

// POST /api/concierge/chat/feedback (v2.0追加)
interface FeedbackRequest {
  messageId: string;
  feedback: "helpful" | "not_helpful";
}
```

### 9.3 レート制限

| プラン     | 1日の上限 | フォローアップ/会話 | レスポンス待機 |
| ---------- | --------- | ------------------- | -------------- |
| 未ログイン | 3回       | 0回                 | 5秒            |
| 無料       | 10回      | 0回                 | 3秒            |
| Pro        | 50回      | 3回                 | 1秒            |
| Pro+Safety | 無制限    | 無制限              | なし           |

---

## 10. 実装フェーズ

### Phase 1: 基盤構築（2026年1月）

**フォーカス**: 「なぜこの商品なのか」を美しく説明する体験

#### 10.1.1 タスク一覧

| #    | タスク                           | 優先度 | 依存 | 見積 |
| ---- | -------------------------------- | ------ | ---- | ---- |
| 1.1  | Supabaseテーブル作成             | 高     | -    | S    |
| 1.2  | ConciergeContext作成             | 高     | 1.1  | M    |
| 1.3  | ChatUIコンポーネント作成         | 高     | 1.2  | L    |
| 1.4  | /api/concierge/chat API作成      | 高     | 1.2  | L    |
| 1.5  | プラン別レート制限実装           | 高     | 1.4  | M    |
| 1.6  | Haiku/Sonnetモデル切り替え       | 中     | 1.4  | S    |
| 1.7  | 基本キャッシュ機構（Upstash）    | 中     | 1.4  | M    |
| 1.8  | 薬機法チェック統合               | 高     | 1.4  | S    |
| 1.9  | チャットページ作成               | 高     | 1.3  | M    |
| 1.10 | キャラクター基盤実装（ナビのみ） | 中     | 1.4  | M    |
| 1.11 | **推薦理由可視化UI**             | 高     | 1.4  | L    |
| 1.12 | **回答フィードバック機能**       | 中     | 1.4  | S    |
| 1.13 | E2Eテスト作成                    | 中     | 1.9  | M    |

#### 10.1.2 Phase 1 完了条件

- [ ] 未ログインユーザーが3回/日の質問ができる
- [ ] ログインユーザーが10回/日の質問ができる
- [ ] 回答に推薦商品が含まれる
- [ ] **推薦理由が5つの柱で可視化される**
- [ ] 薬機法NGワードがフィルタリングされる
- [ ] 基本的なディスクレーマーが表示される
- [ ] ナビキャラクターで会話できる
- [ ] **回答への「参考になった」フィードバックが送れる**

---

### Phase 2: Pro機能 + キャラクター（2026年2月）

#### 10.2.1 タスク一覧

| #    | タスク                         | 優先度 | 依存   | 見積 |
| ---- | ------------------------------ | ------ | ------ | ---- |
| 2.1  | 価格履歴API統合                | 高     | Phase1 | M    |
| 2.2  | 会話履歴保存・表示（プラン別） | 高     | Phase1 | L    |
| 2.3  | セッション要約機能             | 中     | 2.2    | M    |
| 2.4  | フォローアップ機能             | 中     | 2.2    | M    |
| 2.5  | 予算考慮ロジック               | 中     | Phase1 | M    |
| 2.6  | 全キャラクター実装             | 高     | Phase1 | L    |
| 2.7  | **キャラクター別推薦ロジック** | 高     | 2.6    | M    |
| 2.8  | キャラクター選択UI             | 高     | 2.6    | M    |
| 2.9  | アップセル導線（無料→Pro）     | 高     | 2.6    | S    |
| 2.10 | Stripe連携（Pro課金）          | 高     | -      | L    |
| 2.11 | **再質問率の計測実装**         | 中     | Phase1 | S    |

#### 10.2.2 Phase 2 完了条件

- [ ] Proユーザーが90日間の価格履歴を確認できる
- [ ] 30日間の会話履歴が保存・閲覧できる
- [ ] 4種類のキャラクターから選択できる
- [ ] **キャラクターごとに推薦順位が変わる**
- [ ] **推薦スタイルの違いが説明される**
- [ ] Stripe経由でPro課金ができる

---

### Phase 3: Safety機能（2026年3月）

**重要**: Safety機能は「判断」ではなく「注意喚起」に徹する

#### 10.3.1 タスク一覧

| #    | タスク                         | 優先度 | 依存    | 見積 |
| ---- | ------------------------------ | ------ | ------- | ---- |
| 3.1  | 既往歴・服薬登録UI             | 高     | Phase2  | L    |
| 3.2  | **Layer1データソース統合**     | 高     | -       | L    |
| 3.3  | **Layer2データソース統合**     | 中     | 3.2     | M    |
| 3.4  | **AdvisoryChecker実装**        | 高     | 3.2     | L    |
| 3.5  | **AdvisoryBanner UI**          | 高     | 3.4     | M    |
| 3.6  | 成分情報翻訳機能               | 中     | 3.4     | M    |
| 3.7  | Safety専用ダッシュボード       | 中     | 3.1-3.5 | L    |
| 3.8  | **Opusモデル強制フラグ**       | 高     | Phase2  | S    |
| 3.9  | カスタムキャラクター名         | 低     | Phase2  | S    |
| 3.10 | アップセル導線（Pro→Safety）   | 高     | 3.5     | S    |
| 3.11 | Stripe連携（Safety課金）       | 高     | Phase2  | M    |
| 3.12 | **Advisory後のアクション記録** | 中     | 3.5     | S    |

#### 10.3.2 Phase 3 完了条件

- [ ] 既往歴・服薬・アレルギーが登録できる
- [ ] **注意喚起が「判断」ではなく「翻訳」として表示される**
- [ ] **出典（Layer1/2）が明示される**
- [ ] Advisory後のユーザーアクションが記録される
- [ ] Safety専用ダッシュボードが利用できる

---

### Phase 4: 最適化（2026年4月）

#### 10.4.1 タスク一覧

| #   | タスク                     | 優先度 | 依存   | 見積 |
| --- | -------------------------- | ------ | ------ | ---- |
| 4.1 | キャッシュ強化             | 高     | Phase3 | M    |
| 4.2 | SafetyレポートPDF出力      | 中     | Phase3 | M    |
| 4.3 | 会話履歴エクスポート       | 中     | Phase2 | M    |
| 4.4 | **品質指標ダッシュボード** | 中     | Phase3 | M    |
| 4.5 | アップセルA/Bテスト基盤    | 中     | Phase3 | M    |
| 4.6 | 専門家相談リンク連携       | 低     | Phase3 | S    |
| 4.7 | パフォーマンス最適化       | 高     | Phase3 | M    |

---

## 11. プロンプト設計

### 11.1 システムプロンプト（共通部分）

```typescript
const SYSTEM_PROMPT_BASE = `
あなたはSuptia（サプティア）のAIコンシェルジュです。
サプリメント選びを「安全 × コスト × エビデンス」の観点からサポートします。

【Suptiaの立ち位置】
「AIが最適解を出す」のではなく、「人間が納得して選べる状態を作る」

【絶対に守るルール】
1. 医療効果を断定しない（「治る」「予防」「改善」は禁止）
2. 「〜をサポート」「〜に役立つ可能性」「研究では〜」という表現を使う
3. 重要な判断は必ず「医師・薬剤師にご相談ください」と添える
4. 価格について「買い時」「値下がりします」と断定しない
5. 出典がない情報を事実として提示しない
6. 【v2.0】Safety情報は「判断」ではなく「注意喚起・情報の翻訳」として提示

【5つの柱で説明】
推薦理由は必ず以下の柱で可視化する：
- 💰 価格比較: 複数ECサイトでの価格を比較
- 📊 成分量比較: 1日あたりの有効成分量を比較
- 💡 コスパ比較: 成分量あたりの価格（¥/mg）を算出
- 🔬 エビデンス: S/A/B/C/Dの5段階で科学的根拠を評価
- 🛡️ 安全性: 添加物・成分の安全性を評価

【回答スタイル】
- 簡潔で分かりやすい日本語
- 専門用語は必ず説明を添える
- 推薦商品には「なぜこの商品なのか」を具体的に説明
`;
```

### 11.2 キャラクター別プロンプト

```typescript
const buildCharacterPrompt = (character: Character): string => `
【あなたのキャラクター: ${character.name}】
${character.personality}

【話し方のルール】
${character.tone}

【推薦スタイル】
${character.recommendationStyle}

【重要】
キャラクターの口調・推薦スタイルを維持しつつも：
- 医療効果を断定しない
- ディスクレーマーは必ず付ける
- 出典を明示する
- キャラクターの個性は口調や重み付けで表現し、情報の正確性は犠牲にしない
`;
```

### 11.3 Safety専用プロンプト（v2.0改訂）

```typescript
const buildSafetyPrompt = (
  healthProfile: HealthProfile,
  advisories: Advisory[],
): string => `
【Safety Add-on有効 - 注意喚起モード】

【ユーザー健康プロフィール】
登録済みの既往歴: ${healthProfile.conditions.join(", ") || "なし"}
服用中の薬: ${healthProfile.medications.join(", ") || "なし"}
アレルギー: ${healthProfile.allergies.join(", ") || "なし"}

【関連する注意喚起情報】
${advisories
  .map(
    (a) => `
- [${a.level.toUpperCase()}] ${a.sourceName}によると:
  「${a.originalText}」
  → ${a.translatedText}
`,
  )
  .join("\n")}

【回答ルール - 最重要】
1. 上記の注意喚起情報を「翻訳」として提示する（判断ではない）
2. 「避けるべき」「危険」などの断定表現は禁止
3. 「○○ガイドラインでは注意が示されています」形式で伝える
4. 必ず出典を明記する
5. 「医師・薬剤師にご相談ください」を添える
6. 注意喚起レベル（Low/Medium/High）は判定ではなく情報の重要度として提示
`;
```

---

## 12. AIモデル選択戦略

### 12.1 プラン × クエリタイプ別モデル

| プラン     | 通常クエリ | 複雑なクエリ | Safety関連 | キャッシュヒット |
| ---------- | ---------- | ------------ | ---------- | ---------------- |
| 未ログイン | Haiku      | Haiku        | -          | Haiku            |
| 無料       | Haiku      | Haiku        | -          | Haiku            |
| Pro        | Haiku      | Sonnet       | -          | Haiku            |
| Pro+Safety | Sonnet     | Sonnet       | **Opus**   | Haiku            |

### 12.2 安全優先ルール（v2.1明文化）

**原則**: コスト最適化よりも安全性を優先する

```
┌────────────────────────────────────────────────────────────┐
│  モデル選択の優先順位（v2.1）                               │
│                                                            │
│  1. Safety Add-on有効 → 上位モデルを強制使用               │
│  2. 相互作用・注意喚起を含む応答 → 上位モデルを強制使用    │
│  3. 健康プロフィールが登録されている → Sonnet以上          │
│  4. 上記以外 → 通常のプラン別選択                          │
│                                                            │
│  ※コスト削減のために安全性を犠牲にしない                   │
└────────────────────────────────────────────────────────────┘
```

### 12.3 Safety強制フラグ実装

```typescript
/**
 * v2.0: 健康リスクが絡む場合は、コストより安全性を優先
 * v2.1: 安全優先ルールを明文化
 */
const selectModel = (
  plan: UserPlan,
  queryType: QueryType,
  cacheHit: boolean,
  safetyContext: SafetyContext,
): AIModel => {
  // 1. キャッシュヒット → Haiku
  if (cacheHit) return "haiku";

  // 2. Safety強制フラグ: 健康リスクが絡む場合はOpus
  if (safetyContext.requiresHighAccuracy) {
    return "opus";
  }

  // 3. Safety Add-on有効時の相互作用チェック → Opus
  if (plan === "pro_safety" && safetyContext.hasAdvisories) {
    return "opus";
  }

  // 4. 通常のプラン別選択
  switch (plan) {
    case "guest":
    case "free":
      return "haiku";
    case "pro":
      return queryType === "complex" ? "sonnet" : "haiku";
    case "pro_safety":
      return "sonnet";
    default:
      return "haiku";
  }
};

interface SafetyContext {
  // 高精度が必要なケース
  requiresHighAccuracy: boolean;
  // Advisory情報が含まれる
  hasAdvisories: boolean;
  // 既往歴・服薬に関連
  healthProfileInvolved: boolean;
}

const buildSafetyContext = (
  message: string,
  userProfile?: HealthProfile,
): SafetyContext => {
  const healthKeywords =
    /相互作用|副作用|禁忌|既往|服用中|アレルギー|妊娠|授乳/;

  return {
    requiresHighAccuracy: healthKeywords.test(message) && !!userProfile,
    hasAdvisories: false, // API呼び出し後に更新
    healthProfileInvolved:
      !!userProfile?.conditions?.length || !!userProfile?.medications?.length,
  };
};
```

---

## 13. コスト管理

### 13.1 モデル別コスト（2025年12月時点）

| モデル          | Input (/1M tokens) | Output (/1M tokens) | 想定用途     |
| --------------- | ------------------ | ------------------- | ------------ |
| Claude 3 Haiku  | $0.25              | $1.25               | ゲスト/無料  |
| Claude 3 Sonnet | $3.00              | $15.00              | Pro          |
| Claude 3 Opus   | $15.00             | $75.00              | Safety強制時 |

### 13.2 コスト最適化戦略

```typescript
const COST_OPTIMIZATION = {
  cache: {
    ingredientInfo: "24h",
    commonQuestions: "6h",
    productRecommendations: "1h",
    // v2.0: Layer1/2データはより長くキャッシュ
    layer1Advisories: "7d",
    layer2Advisories: "3d",
  },

  prompt: {
    maxContextTokens: 4000,
    maxResponseTokens: 1000,
    trimConversationHistory: {
      guest: 2,
      free: 4,
      pro: 10,
      pro_safety: 20,
    },
  },

  characterOverhead: 150,
};
```

### 13.3 月間コスト試算（v2.0更新）

```
【想定ユーザー構成】
- ゲスト: 5,000人/月 × 2回 = 10,000回
- 無料会員: 1,000人/月 × 8回 = 8,000回
- Pro: 100人/月 × 40回 = 4,000回
- Pro+Safety: 50人/月 × 60回 = 3,000回
  - うちSafety強制(Opus): 30% = 900回

【コスト計算】
ゲスト: 10,000 × 0.3 × $0.001 = $3
無料: 8,000 × 0.3 × $0.001 = $2.4
Pro: 4,000 × 0.5 × $0.015 = $30
Safety (Sonnet): 2,100 × 0.6 × $0.03 = $37.8
Safety (Opus): 900 × 0.6 × $0.08 = $43.2

合計: $116.4/月（Opus使用により増加）

【収益】
Pro: 100人 × ¥980 = ¥98,000
Safety: 50人 × ¥1,980 = ¥99,000
合計: ¥197,000 ≈ $1,300

【利益率】
($650 - $116.4) / $650 = 82.1% ✅

※Safety強制でOpus使用が増えても十分な利益率を維持
```

---

## 14. セキュリティ・コンプライアンス

### 14.1 セキュリティ対策

| 対策                       | 実装方法                          |
| -------------------------- | --------------------------------- |
| 認証                       | Supabase Auth + JWT               |
| 認可                       | RLSポリシー                       |
| レート制限                 | Upstash Redis                     |
| 入力サニタイズ             | 既存 `sanitize.ts` 活用           |
| XSS対策                    | React自動エスケープ               |
| プロンプトインジェクション | 入力検証 + システムプロンプト強化 |

### 14.2 コンプライアンス

| 項目     | 対応                                   |
| -------- | -------------------------------------- |
| 薬機法   | `compliance/checker.ts` でNGワード検出 |
| 個人情報 | 健康情報は暗号化保存                   |
| 免責事項 | 全回答にディスクレーマー付与           |
| 出典明示 | 推薦理由・Advisory情報に根拠を明記     |

### 14.3 Safety機能の法務対応（v2.0追加）

| リスク               | 対策                                         |
| -------------------- | -------------------------------------------- |
| 医療判断と誤解される | 「判断」ではなく「注意喚起」用語を徹底       |
| 情報の網羅性不足     | 「全てを網羅していない」ディスクレーマー必須 |
| 断定表現             | AI出力の後処理でNGワードをフィルタ           |
| 出典不明             | Layer1/2/3の出典を必ず明記                   |

---

## 15. テスト計画

### 15.1 ユニットテスト

```typescript
// lib/concierge/__tests__/advisory-checker.test.ts
describe("AdvisoryChecker", () => {
  it("Layer1情報はHighレベルで返す", () => {});
  it("Layer2情報はMediumレベルで返す", () => {});
  it("Layer3情報はLowレベルで返す", () => {});
  it("断定表現が含まれていないことを確認", () => {});
  it("出典情報が必ず含まれる", () => {});
});

// lib/concierge/__tests__/character-weights.test.ts
describe("CharacterWeights", () => {
  it("ナビはバランス型の重み付け", () => {});
  it("ミントはコスパ重視の重み付け", () => {});
  it("ドクはエビデンス重視の重み付け", () => {});
  it("ハルは安全性重視の重み付け", () => {});
  it("同じ商品でもキャラによって順位が変わる", () => {});
});

// lib/concierge/__tests__/model-selector.test.ts
describe("ModelSelector", () => {
  it("Safety強制フラグでOpusを選択", () => {});
  it("健康プロフィール関連クエリでOpus", () => {});
  it("通常クエリはプラン別モデル", () => {});
});
```

### 15.2 統合テスト

```typescript
describe("POST /api/concierge/chat", () => {
  it("回答に推薦理由が5つの柱で含まれる", () => {});
  it("Advisory情報に出典が含まれる", () => {});
  it("断定表現がフィルタリングされる", () => {});
  it("キャラクターごとに推薦順位が変わる", () => {});
});
```

### 15.3 E2Eテスト

```typescript
describe("AIコンシェルジュ", () => {
  it("推薦理由の「詳細を見る」で5つの柱が表示される", () => {});
  it("Advisory表示に出典リンクが含まれる", () => {});
  it("「参考になった」ボタンが機能する", () => {});
  it("キャラクター変更後に推薦スタイルが変わる", () => {});
});
```

---

## 16. リスクと対策

| リスク                   | 影響度 | 発生確率 | 対策                                     |
| ------------------------ | ------ | -------- | ---------------------------------------- |
| AIコスト超過             | 高     | 中       | キャッシュ強化、レート制限厳格化         |
| 薬機法違反               | 高     | 低       | コンプライアンスチェッカー必須化         |
| AIハルシネーション       | 高     | 中       | 回答検証、出典必須化                     |
| **Safety判断と誤解**     | 高     | 中       | 用語統一、UI明確化、ディスクレーマー強化 |
| **データソース更新遅延** | 中     | 中       | expiresAt設定、定期確認Cron              |
| キャラ口調の不一致       | 低     | 中       | プロンプト強化、品質チェック             |
| 会話履歴の肥大化         | 中     | 中       | 自動要約、期限切れ削除Cron               |
| Anthropic API障害        | 中     | 低       | フォールバック表示                       |

---

## 17. マイルストーン

```
2026年1月 - Phase 1: 基盤構築
├── Week 1: DB設計・API基盤
├── Week 2: ChatUI・推薦理由可視化
├── Week 3: レート制限・キャッシュ・ナビキャラ
└── Week 4: フィードバック機能・テスト

2026年2月 - Phase 2: Pro機能 + キャラクター
├── Week 1: 価格履歴・全キャラ実装
├── Week 2: キャラクター別推薦ロジック
├── Week 3: 会話履歴・Stripe連携（Pro）
└── Week 4: 品質指標計測・テスト

2026年3月 - Phase 3: Safety機能
├── Week 1: 健康プロフィール・Layer1統合
├── Week 2: Layer2統合・AdvisoryChecker
├── Week 3: AdvisoryUI・Opus強制フラグ
└── Week 4: Stripe連携（Safety）・テスト

2026年4月 - Phase 4: 最適化
├── Week 1: キャッシュ最適化
├── Week 2: PDFレポート・履歴エクスポート
├── Week 3: 品質指標ダッシュボード
└── Week 4: 最終テスト・正式リリース
```

---

## 付録A: キャラクターアバター仕様

| キャラ | スタイル   | カラー         | 表情           | 推薦スタイル   |
| ------ | ---------- | -------------- | -------------- | -------------- |
| ナビ   | ビジネス風 | ネイビー       | 穏やか・信頼   | バランス型     |
| ミント | カジュアル | ミントグリーン | 笑顔・元気     | コスパ重視     |
| ドク   | 研究者風   | パープル       | 知的・クール   | エビデンス重視 |
| ハル   | ナチュラル | ピンク         | 優しい・温かい | 安全性重視     |

---

## 付録B: AdvisoryLevel表現ガイド

| Level  | 表示                 | 色       | 推奨アクション     |
| ------ | -------------------- | -------- | ------------------ |
| Low    | 参考情報             | グレー   | 確認推奨           |
| Medium | 確認をお勧めします   | イエロー | 専門家への相談推奨 |
| High   | 重要な情報があります | オレンジ | 購入前に必ず相談   |

> 「危険」「禁止」などの断定表現は使用しない

---

## 承認

| 役割                 | 氏名 | 承認日 | 署名 |
| -------------------- | ---- | ------ | ---- |
| プロジェクトオーナー |      |        |      |
| 技術リード           |      |        |      |
| 法務担当             |      |        |      |

---

**作成者**: Claude Code
**最終更新**: 2025-12-21
**バージョン**: 2.1.0

---

## 更新履歴

| 日付       | Ver   | 内容                                                                                                                               |
| ---------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 2025-12-21 | 2.1.0 | 最終調整: UI文言ガイドライン、AdvisoryLevel別行動導線、重み付け可視化UI、安全優先ルール明文化、信頼性指標追加、設計3原則の最終固定 |
| 2025-12-21 | 2.0.0 | 設計レビュー反映: Safety責任境界明確化、AdvisoryLevel導入、3レイヤーデータソース、キャラクター別推薦ロジック、品質KPI追加          |
| 2025-12-20 | 1.1.0 | キャラクター機能、会話履歴詳細設計追加                                                                                             |
| 2025-12-20 | 1.0.0 | 初版作成                                                                                                                           |
