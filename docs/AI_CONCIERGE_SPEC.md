# Suptia AIコンシェルジュ 機能仕様書

作成日: 2025年12月10日
バージョン: 2.0.0
ステータス: 設計完了・実装待ち

---

## 1. 概要

Suptia AIコンシェルジュは、サプリメント選びを対話形式でサポートするAI機能。
「収益性 × UX × 法務 × コスト」のバランスを最適化した設計。

### コアコンセプト

```
「AIが答えを出す時代。Suptiaはその根拠を示す。」
「AIは一般論。Suptiaはあなた専用。」
```

---

## 2. プラン構造

### 4段階モデル

```
┌─────────────────────────────────────────────────────────────┐
│  Guest（未ログイン）  → Cookie識別、お試し体験             │
│  Free（ログイン済み） → 基本機能、ログインへの導線         │
│  Pro（¥980/月）         → 本格利用、推薦ロジック可視化       │
│  Pro+Safety（¥1,980/月）→ 相互作用チェッカー、完全サポート   │
└─────────────────────────────────────────────────────────────┘
```

### プラン一覧

| プラン         | 状態         | 月額   | 識別方法      | AIモデル                       |
| -------------- | ------------ | ------ | ------------- | ------------------------------ |
| **Guest**      | 未ログイン   | ¥0     | Cookie        | 最新Haiku                      |
| **Free**       | ログイン済み | ¥0     | Supabase Auth | 最新Haiku                      |
| **Pro**        | 有料会員     | ¥980   | Supabase Auth | 最新Sonnet                     |
| **Pro+Safety** | 有料会員     | ¥1,980 | Supabase Auth | 最新Sonnet（条件付きOpus昇格） |

### 価値提供の明確化

| プラン     | 核心価値               | ターゲット               |
| ---------- | ---------------------- | ------------------------ |
| Guest      | お試し体験             | 初回訪問者               |
| Free       | 基本的な情報収集       | 情報収集段階のユーザー   |
| Pro        | 透明性と意思決定支援   | 購入を検討中のユーザー   |
| Pro+Safety | パーソナライズド安全性 | 既往歴・服薬中のユーザー |

### アップグレード導線

```
Guest → Free: 「ログインでお気に入り・診断履歴を保存」
Free → Pro:   「週25回のAI質問 + 推薦ロジック可視化」
Pro → Pro+Safety: 「相互作用チェッカーで安心」
```

---

## 3. 機能比較表

| 機能カテゴリ       | 機能                   | Guest           | Free                | Pro ¥980          | Pro+Safety ¥1,980      |
| ------------------ | ---------------------- | --------------- | ------------------- | ----------------- | ---------------------- |
| **基本**           | AI質問回数             | 2回/日          | 3回/週              | 25回/週           | 50回/週                |
|                    | AIモデル               | 最新Haiku       | 最新Haiku           | 最新Sonnet        | 最新Sonnet + Opus昇格  |
|                    | 回答の深さ             | 概要のみ        | 基本回答            | 詳細回答          | 科学論文ベース※1       |
|                    | 会話履歴               | ❌              | 1日間               | 30日間            | 無制限                 |
|                    | フォローアップ         | ❌              | ❌                  | 3回/会話          | 5回/会話               |
| **保存機能**       | お気に入り             | ローカルのみ    | 10件                | 100件             | 無制限                 |
|                    | 価格アラート           | ❌              | 3件                 | 50件              | 無制限                 |
|                    | 診断履歴保存           | ❌              | ✅                  | ✅                | ✅                     |
| **商品推薦**       | 推薦数                 | トップ3         | トップ3+理由概要    | 全商品            | 全商品                 |
|                    | 推薦ロジック可視化     | ❌              | ❌                  | ✅ 5つの柱で表示  | ✅ +パーソナル重み付け |
|                    | エビデンス表示         | なし            | S/A/Bのみ           | 全ランク+出典     | 全ランク+論文リンク    |
| **価格**           | 現在価格               | ✅              | ✅                  | ✅                | ✅                     |
|                    | 価格履歴               | 7日             | 30日                | 1年               | 全期間                 |
|                    | 価格傾向分析※2         | ❌              | ❌                  | ❌                | ✅ 参考情報として      |
| **パーソナライズ** | 健康目標               | ✅ 一般的な提案 | ✅ 目標に応じた提案 | ✅ 詳細な目標分析 | ✅ 目標+体質考慮       |
|                    | 予算考慮               | ❌              | ❌                  | ✅                | ✅                     |
|                    | 既往歴登録             | ❌              | ❌                  | ❌                | ✅                     |
|                    | 服用中の薬登録         | ❌              | ❌                  | ❌                | ✅                     |
|                    | アレルギー登録         | ❌              | ❌                  | ❌                | ✅                     |
| **Safety専用**     | 相互作用アラート※3     | ❌              | ❌                  | ❌                | ✅                     |
|                    | 禁忌スクリーニング     | ❌              | ❌                  | ❌                | ✅                     |
|                    | 避けるべき成分リスト   | ❌              | ❌                  | ❌                | ✅ 自動生成            |
|                    | 危険成分オートブロック | ❌              | ❌                  | ❌                | ✅                     |
|                    | 健康リスクスコア       | ❌              | ❌                  | ❌                | ✅                     |
|                    | Safetyレポート出力     | ❌              | ❌                  | ❌                | ✅ PDF                 |
|                    | 専門家相談リンク       | ❌              | ❌                  | ❌                | ✅                     |

---

## 4. Guest識別方法

### Cookie + レート制限

未ログインユーザー（Guest）はCookieベースで識別し、レート制限を適用。

```typescript
// Cookie識別フロー
const getGuestSession = async (cookies: RequestCookies) => {
  const sessionId = cookies.get("guest_session_id")?.value;

  if (!sessionId) {
    // 新規セッション発行
    const newSessionId = generateUUID();
    // Cookieに保存（7日間有効）
    cookies.set("guest_session_id", newSessionId, {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: true,
    });
    return { sessionId: newSessionId, isNew: true };
  }

  return { sessionId, isNew: false };
};

// レート制限チェック
const checkGuestRateLimit = async (sessionId: string): Promise<boolean> => {
  const key = `guest_ai_usage:${sessionId}:${getTodayJST()}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60 * 60 * 24); // 24時間で失効
  }

  return count <= 2; // 1日2回まで
};
```

### 設計思想

- **目的**: 厳密な乱用防止ではなく、ログインへの自然な導線
- **許容**: Cookie削除による回数リセットは許容
- **UX重視**: 制限到達時に「ログインで週3回使える」と訴求

---

## 5. パーソナライズ分岐ロジック

### 5.1 分岐フロー

```
ユーザー入力
    │
    ├─ Guest（未ログイン）
    │   └─ 一般的な情報のみ（パーソナライズなし）
    │      「ビタミンCは一般的に免疫機能をサポートすると言われています」
    │
    ├─ Free（ログイン済み）
    │   └─ 目標ベースの一般提案
    │      「免疫力強化を目標とされているので、ビタミンCをおすすめします」
    │
    ├─ Pro
    │   └─ 目標・予算に基づく推薦（軽度パーソナライズ）
    │      「免疫力強化を目標とされているので、ビタミンCとの相性が良い
    │       亜鉛を含む商品をおすすめします。予算¥3,000以内では...」
    │
    └─ Pro+Safety
        └─ 既往歴・服薬を考慮（完全パーソナライズ）
           「高血圧の既往歴と降圧剤を登録されていますので、
            甘草（リコリス）を含む商品は避けることをお勧めします。
            代替として...」
```

### 5.2 パーソナライズレベル定義

```typescript
export enum PersonalizationLevel {
  NONE = "none", // Guest: 一般情報のみ
  BASIC = "basic", // Free: 目標ベースの一般提案
  CONTEXTUAL = "contextual", // Pro: 目標+予算+履歴
  FULL = "full", // Pro+Safety: 全データ考慮
}

export const getPersonalizationLevel = (
  user: User | null,
): PersonalizationLevel => {
  if (!user) return PersonalizationLevel.NONE;
  if (user.plan === "pro_safety") return PersonalizationLevel.FULL;
  if (user.plan === "pro") return PersonalizationLevel.CONTEXTUAL;
  return PersonalizationLevel.BASIC;
};
```

---

## 6. AIモデル選択ロジック

### 6.1 基本ルール

| プラン     | 通常モデル | 条件付き昇格 |
| ---------- | ---------- | ------------ |
| Guest      | 最新Haiku  | なし         |
| Free       | 最新Haiku  | なし         |
| Pro        | 最新Sonnet | なし         |
| Pro+Safety | 最新Sonnet | 最新Opus     |

### 6.2 Pro+Safety: 条件付きOpus昇格

Pro+Safetyプランでは、以下の条件を満たす場合のみ最新Opusに昇格:

```typescript
interface SafetyCheckResult {
  interactionCount: number; // 検出された相互作用の系統数
  dangerFlags: string[]; // 危険フラグのリスト
  confidenceScore: number; // Sonnetの確信度（0-1）
}

const shouldEscalateToOpus = (result: SafetyCheckResult): boolean => {
  // 条件1: 相互作用が3系統以上
  if (result.interactionCount >= 3) return true;

  // 条件2: 危険フラグが2つ以上重複
  if (result.dangerFlags.length >= 2) return true;

  // 条件3: Sonnetの確信度が低い（判断不能ケース）
  if (result.confidenceScore < 0.7) return true;

  return false;
};
```

### 6.3 モデル選択実装

```typescript
export const selectModel = (
  plan: UserPlan,
  queryType: QueryType,
  safetyCheck?: SafetyCheckResult,
): AIModel => {
  switch (plan) {
    case "guest":
    case "free":
      return "claude-haiku-4-5";

    case "pro":
      return "claude-sonnet-4-5";

    case "pro_safety":
      // Safety機能使用時のみOpus昇格判定
      if (queryType === "safety_check" && safetyCheck) {
        if (shouldEscalateToOpus(safetyCheck)) {
          return "claude-opus-4-5";
        }
      }
      return "claude-sonnet-4-5";

    default:
      return "claude-haiku-4-5";
  }
};
```

### 6.4 コスト比較（100万トークンあたり）

| モデル     | 入力  | 出力   |
| ---------- | ----- | ------ |
| 最新Haiku  | $1.00 | $5.00  |
| 最新Sonnet | $3.00 | $15.00 |
| 最新Opus   | $5.00 | $25.00 |

### 6.5 コスト試算

**1回のAI質問あたり**（入力2,000トークン + 出力500トークン想定）

| プラン         | モデル     | 1回あたりコスト |
| -------------- | ---------- | --------------- |
| Guest/Free     | 最新Haiku  | 約¥0.6          |
| Pro            | 最新Sonnet | 約¥1.8          |
| Pro+Safety通常 | 最新Sonnet | 約¥1.8          |
| Pro+Safety昇格 | 最新Opus   | 約¥3.0          |

**設計思想**: Safetyユーザーは少数なので、1人あたりコストは高くても全体収益に貢献。信頼最大化が正解。

---

## 7. 価格トレンド分析（法務安全設計）

> **重要**: 「買い時予測」という表現は法務的にグレーゾーン。
> 「価格トレンド分析」に統一することで、安全かつ説得力を維持。

### 7.1 表現ガイドライン

**❌ 禁止表現（予測・断定・購買誘導）**

- 「来週値下がりします」 → AIが価格を予測していると誤解される
- 「今が買い時です」 → 購買判断を断定している
- 「この価格で買うべきです」 → 投資アドバイス類似の表現
- 「お得です」「安いです」 → 主観的判断の押し付け

**✅ 許可表現（過去データ・傾向・参考情報）**

- 「過去90日間の傾向として、この商品は月末にセール価格になることが多いようです」
- 「現在の価格は過去90日間の平均より約15%低い水準です」
- 「過去のデータでは、この時期に価格が下がる傾向が見られました（参考情報）」
- 「価格変動の履歴をご参考までにお知らせします」

### 7.2 実装

```typescript
export const getPriceTrendMessage = (
  currentPrice: number,
  history: PriceHistory[],
): string => {
  const avg = calculateAverage(history);
  const percentDiff = ((currentPrice - avg) / avg) * 100;

  if (percentDiff <= -15) {
    return `現在の価格は過去90日間の平均より約${Math.abs(Math.round(percentDiff))}%低い水準です。（参考情報）`;
  }
  if (percentDiff >= 15) {
    return `現在の価格は過去90日間の平均より約${Math.round(percentDiff)}%高い水準です。価格変動を確認されることをお勧めします。`;
  }
  return "現在の価格は過去90日間の平均的な水準です。";
};
```

### 7.3 必須ディスクレーマー

```
※価格は常に変動します。表示される傾向分析は過去データに基づく
参考情報であり、将来の価格を保証するものではありません。
購入前に各ECサイトで最新価格をご確認ください。
```

---

## 8. Safety プランの特別感強化

### 8.1 価値提案の可視化（CVR向上の鍵）

**コアメッセージ**: 「あなただけの安全を、目に見える形で」

```
┌─────────────────────────────────────────────────────────────┐
│  🛡️ Safety Guardian の 3つの「見える化」                   │
│                                                             │
│  ① 専用スコア  → あなた専用 健康リスクスコア               │
│  ② 専用画面    → 危険成分オートブロック                    │
│  ③ 専用レポート → 相互作用アラート専用画面                 │
│                                                             │
│  "特別扱い" を目に見える形にすることでCVRを最大化           │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Safety専用ダッシュボード

```typescript
export const SafetyDashboard = {
  // パーソナルセーフティプロフィール
  profile: {
    title: "あなたの健康プロフィール",
    sections: [
      { id: "conditions", label: "登録済みの既往歴", icon: "🏥" },
      { id: "medications", label: "服用中の薬", icon: "💊" },
      { id: "allergies", label: "アレルギー", icon: "⚠️" },
      { id: "blocked_ingredients", label: "ブロック済み成分", icon: "🚫" },
    ],
  },

  // 健康リスクスコア（0-100）
  riskScore: {
    title: "あなた専用 健康リスクスコア",
    description: "登録情報に基づく、サプリメント選びの安全度",
    levels: [
      { range: [90, 100], label: "安全", color: "emerald", icon: "✅" },
      { range: [70, 89], label: "注意", color: "yellow", icon: "⚡" },
      { range: [50, 69], label: "要確認", color: "orange", icon: "⚠️" },
      { range: [0, 49], label: "危険", color: "red", icon: "🚨" },
    ],
  },

  // 危険成分オートブロック
  autoBlock: {
    title: "危険成分オートブロック",
    description: "あなたに合わない成分を自動で除外",
    features: [
      "商品検索時に自動フィルタリング",
      "該当商品に警告バッジ表示",
      "ブロック理由の詳細説明",
    ],
  },
};
```

### 8.3 専用UI要素

```typescript
export const SafetyPlanUI = {
  // 専用バッジ
  badge: {
    icon: "🛡️",
    text: "Safety Guardian",
    color: "gradient-to-r from-emerald-500 to-teal-600",
  },

  // 専用機能アイコン（拡張版）
  features: {
    riskScore: { icon: "📊", label: "あなた専用 健康リスクスコア" },
    autoBlock: { icon: "🚫", label: "危険成分オートブロック" },
    interactionAlert: { icon: "⚠️", label: "相互作用アラート専用画面" },
    personalProfile: { icon: "👤", label: "パーソナル健康プロフィール" },
    safetyReport: { icon: "📄", label: "Safetyレポート（PDF）" },
    expertLink: { icon: "👨‍⚕️", label: "専門家相談リンク" },
  },

  // 回答時の専用ヘッダー
  responseHeader: `
    ┌─────────────────────────────────────────────────────────┐
    │ 🛡️ Safety Guardian モードで回答中                       │
    │                                                         │
    │ ✅ あなたの既往歴・服薬情報を考慮                       │
    │ ✅ 危険成分は自動でフィルタリング済み                   │
    │ ✅ 相互作用チェック完了                                 │
    └─────────────────────────────────────────────────────────┘
  `,
};
```

### 8.4 Safety専用機能（詳細）

1. **あなた専用 健康リスクスコア**
   - 登録情報に基づくリアルタイムスコア算出
   - 商品ごとの適合度を0-100で表示
   - スコアの内訳（既往歴・薬・アレルギー）を可視化

2. **危険成分オートブロック**
   - 既往歴・服薬に基づいて危険成分を自動特定
   - 商品検索結果から該当商品を除外/警告
   - ブロック中の成分リストをダッシュボードで管理

3. **相互作用アラート専用画面**
   - 登録した薬・サプリの相互作用マトリクス表示
   - 危険度レベル（高/中/低）の色分け
   - 新規登録時の即座アラート

4. **パーソナル健康プロフィール**
   - 既往歴・服薬・アレルギーの一元管理
   - プロフィール充実度インジケーター
   - 定期的な更新リマインダー

5. **Safetyレポート（PDF出力）**
   - 現在の服用状況
   - 検出された相互作用
   - 避けるべき成分リスト
   - 医療機関への相談用フォーマット

6. **専門家相談リンク**
   - オンライン薬剤師相談サービスへの連携（将来）
   - 近隣薬局検索

### 8.5 Safety専用アップセルメッセージ

```
┌─────────────────────────────────────────────────────────────┐
│  🛡️ Safety Guardian があなたを守ります                     │
│                                                             │
│  「高血圧」を登録されていますね。                          │
│                                                             │
│  Pro+Safety（¥1,980/月）で：                                 │
│  • 📊 あなた専用の健康リスクスコアを表示                   │
│  • 🚫 危険成分（甘草等）を自動でブロック                   │
│  • ⚠️ 服薬との相互作用を常時監視                          │
│                                                             │
│  "AIは一般論。Suptiaはあなた専用。"                        │
│                                                             │
│  [Safety機能を試す] [今はスキップ]                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. 相互作用データ管理

> **重要原則**: AIがhallucinationすると健康被害リスク。
> 相互作用の基礎データは厳格に固定し、AIは**結論を作らず、出典の意味説明のみ**に徹する。

### 9.1 AIの役割定義（最重要）

```typescript
/**
 * 相互作用チェックにおけるAIの役割
 *
 * ❌ AIがやってはいけないこと:
 * - 独自に相互作用の有無を判断する
 * - データソースにない相互作用を推測する
 * - 「安全です」「問題ありません」と断定する
 * - 服用の可否を決定する
 *
 * ✅ AIがやるべきこと:
 * - データソースから該当情報を検索・抽出
 * - 出典情報の意味を分かりやすく説明
 * - 専門用語を一般向けに翻訳
 * - 医師・薬剤師への相談を促す
 */
export const AI_ROLE_IN_SAFETY = {
  permitted: [
    "データソースからの情報検索・抽出",
    "出典内容の平易な説明",
    "専門用語の一般向け翻訳",
    "関連する出典へのリンク提供",
    "医師・薬剤師への相談推奨",
  ],
  prohibited: [
    "独自判断による相互作用の断定",
    "データソース外の推測",
    "安全性の保証",
    "服用可否の決定",
    "医療アドバイスの代替",
  ],
};
```

### 9.2 データソース（厳格に固定）

```typescript
export const INTERACTION_DATA_SOURCES = {
  // 一次ソース（必須・最高信頼性）
  primary: [
    {
      name: "Natural Medicines Comprehensive Database",
      url: "https://naturalmedicines.therapeuticresearch.com/",
      type: "subscription",
      reliability: "highest",
      description: "世界最大のサプリメント相互作用DB",
    },
    {
      name: "医薬品医療機器総合機構 (PMDA)",
      url: "https://www.pmda.go.jp/",
      type: "public",
      reliability: "highest",
      description: "日本の医薬品副作用情報の公式ソース",
    },
    {
      name: "Drugs.com Interaction Checker",
      url: "https://www.drugs.com/drug_interactions.html",
      type: "public",
      reliability: "highest",
      description: "国際的な相互作用DB（FDA承認データベース）",
    },
  ],

  // 二次ソース（補完・高信頼性）
  secondary: [
    {
      name: "NIH Office of Dietary Supplements",
      url: "https://ods.od.nih.gov/",
      type: "public",
      reliability: "high",
      description: "米国国立衛生研究所のサプリメント情報",
    },
    {
      name: "JECFA (FAO/WHO合同食品添加物専門家会議)",
      url: "https://www.who.int/groups/joint-fao-who-expert-committee-on-food-additives-(jecfa)",
      type: "public",
      reliability: "high",
      description: "食品添加物・栄養素の安全性評価",
    },
    {
      name: "EFSA (欧州食品安全機関)",
      url: "https://www.efsa.europa.eu/",
      type: "public",
      reliability: "high",
      description: "EUの食品・サプリメント安全性評価",
    },
    {
      name: "PubMed (RCT/Systematic Review)",
      url: "https://pubmed.ncbi.nlm.nih.gov/",
      type: "public",
      reliability: "high",
      description: "査読済み論文（RCT・システマティックレビュー優先）",
    },
  ],

  // 使用禁止
  prohibited: [
    "Wikipedia",
    "個人ブログ",
    "SNS投稿",
    "AI生成コンテンツ（未検証）",
    "メーカー公式サイトのみの情報",
    "出典不明のまとめサイト",
  ],
};
```

### 9.3 AIレスポンステンプレート

```typescript
/**
 * 相互作用チェック時のAIレスポンス形式
 * AIは結論を作らず、出典の意味説明のみ
 */
export const INTERACTION_RESPONSE_TEMPLATE = {
  // 相互作用が見つかった場合
  found: `
    📋 **相互作用情報が見つかりました**

    【検出された組み合わせ】
    {substanceA} × {substanceB}

    【出典情報】
    {sourceName}によると：
    "{originalText}"

    【この情報の意味】
    {explanation}  ← AIはここで出典の意味を説明

    【危険度レベル】
    {severity} （{sourceName}の分類基準による）

    ⚠️ **重要**: この情報は{sourceName}に基づく参考情報です。
    実際の服用については、必ず医師・薬剤師にご相談ください。

    📚 出典: [{sourceName}]({sourceUrl}) （{accessDate}アクセス）
  `,

  // 相互作用が見つからなかった場合
  notFound: `
    📋 **相互作用情報の検索結果**

    【検索した組み合わせ】
    {substanceA} × {substanceB}

    【結果】
    主要データソース（PMDA、Natural Medicines Database、Drugs.com等）において、
    この組み合わせに関する相互作用情報は見つかりませんでした。

    ⚠️ **重要**: 「情報が見つからない」は「安全」を意味しません。
    - データベースに登録されていない相互作用が存在する可能性があります
    - 個人の体質により影響が異なる場合があります

    実際の服用については、必ず医師・薬剤師にご相談ください。
  `,
};
```

### 9.4 二重ディスクレーマー

**レベル1: 機能説明時**

```
【重要】相互作用チェッカーについて

この機能は、Natural Medicines Comprehensive Database、
PMDA（医薬品医療機器総合機構）等の信頼性の高い医療データベースに
基づいて情報を提供しています。

ただし、以下の点にご注意ください：
• 全ての相互作用を網羅しているわけではありません
• 個人の体質や服用量により影響は異なります
• この情報は医療アドバイスの代替ではありません

実際の服用前には必ず医師・薬剤師にご相談ください。
```

**レベル2: 各回答時**

```
⚠️ 相互作用情報について
本情報はPMDA・Natural Medicines Database等に基づく参考情報です。
服用前に必ず医師・薬剤師にご確認ください。
出典: [具体的なソース名とリンク]
```

### 9.5 相互作用データ構造

```typescript
interface InteractionData {
  id: string;
  substanceA: {
    type: "ingredient" | "drug" | "condition";
    name: string;
    nameEn: string;
  };
  substanceB: {
    type: "ingredient" | "drug" | "condition";
    name: string;
    nameEn: string;
  };
  severity: "high" | "moderate" | "low" | "theoretical";
  mechanism: string;
  clinicalSignificance: string;
  recommendation: string;
  sources: Array<{
    name: string;
    url: string;
    accessDate: string;
    citation: string;
  }>;
  lastVerified: string; // ISO date
  verifiedBy: string; // 検証者（将来は薬剤師監修）
}
```

---

## 10. AIコスト最適化

### 10.1 キャッシュ戦略

```typescript
export const CACHE_CONFIG = {
  // 静的データ（長期キャッシュ）
  ingredientInfo: { ttl: "24h", storage: "redis" },
  interactionData: { ttl: "7d", storage: "redis" },
  evidenceData: { ttl: "7d", storage: "redis" },

  // 動的データ（短期キャッシュ）
  productPrices: { ttl: "1h", storage: "redis" },
  recommendations: { ttl: "6h", storage: "redis", keyBy: "userGoals" },

  // パーソナライズデータ（ユーザー別）
  userSafetyProfile: { ttl: "30d", storage: "supabase" },
  conversationHistory: { ttl: "plan-based", storage: "supabase" },
};
```

### 10.2 月間コスト試算

**想定ユーザー構成**

| プラン     | ユーザー数 | 月間AI使用回数/人    | モデル            |
| ---------- | ---------- | -------------------- | ----------------- |
| Guest      | 1,000人    | 60回（2回/日×30日）  | 最新Haiku         |
| Free       | 500人      | 12回（3回/週×4週）   | 最新Haiku         |
| Pro        | 100人      | 100回（25回/週×4週） | 最新Sonnet        |
| Pro+Safety | 30人       | 150回                | 最新Sonnet + Opus |

**月間コスト試算**

```
Guest:      60回×1,000人×¥0.6×0.5（キャッシュ率）= ¥18,000
Free:       20回×500人×¥0.6×0.5 = ¥3,000
Pro:        100回×100人×¥1.8×0.4 = ¥7,200
Pro+Safety: 150回×30人×¥2.2（平均）×0.4 = ¥3,960

合計: 約¥32,160/月
```

**月間収益試算**

```
Pro:        100人×¥980 = ¥98,000
Pro+Safety: 30人×¥1,980 = ¥59,400

合計: ¥78,400/月
利益: ¥46,240/月 ✅
```

---

## 11. 法務対応

### 11.1 ディスクレーマー体系

```typescript
export const DISCLAIMERS = {
  // 基本（全プラン共通）
  basic: `
    ※本サービスは一般的な情報提供を目的としており、
    医療アドバイスの代替ではありません。
    健康上の判断は必ず医師・薬剤師にご相談ください。
  `,

  // Pro向け
  pro: `
    ※科学論文・公的ガイドラインに基づく情報提供です。
    個人の体質・状況により効果は異なります。
    医療上の判断は必ず医師・薬剤師にご相談ください。
  `,

  // Pro+Safety向け（二重ディスクレーマー）
  safety: {
    header: `
      ※あなたの登録情報（既往歴・服薬）に基づく参考情報です。
      相互作用データはPMDA・Natural Medicines Database等の
      信頼性の高いソースに基づいていますが、
      全てのケースを網羅するものではありません。
    `,
    footer: `
      ⚠️ 重要: 実際の服用前には必ず医師・薬剤師にご確認ください。
      本情報は医療アドバイスの代替ではありません。
    `,
  },

  // 価格関連
  price: `
    ※価格は常に変動します。表示される情報は参考値であり、
    購入前に各ECサイトで最新価格をご確認ください。
  `,
};
```

### 11.2 禁止表現チェッカー

```typescript
export const PROHIBITED_EXPRESSIONS = [
  // 医療効果の断定
  /治(る|す|せる)/,
  /予防(する|できる)/,
  /改善(する|される)/,

  // 価格の断定
  /買い時です/,
  /値下がりします/,
  /今すぐ購入/,

  // 安全性の断定
  /絶対に安全/,
  /副作用はありません/,
  /誰でも飲めます/,
];
```

---

## 12. アップセル導線

### 12.1 トリガーポイント

```typescript
export const UPSELL_TRIGGERS = {
  // Guest → Free
  guestToFree: [
    { trigger: "daily_limit_reached", message: "ログインで週3回使えます" },
    { trigger: "favorite_attempt", message: "ログインでお気に入りを保存" },
    { trigger: "history_view", message: "ログインで履歴を保存" },
  ],

  // Free → Pro
  freeToPro: [
    { trigger: "weekly_limit_reached", message: "Proなら週25回" },
    {
      trigger: "price_history_request",
      message: "価格履歴を見るにはProプランへ",
    },
    { trigger: "recommendation_reason", message: "詳しい理由はProで確認" },
  ],

  // Pro → Pro+Safety
  proToSafety: [
    {
      trigger: "health_condition_mentioned",
      message: "既往歴を考慮した判定はSafetyで",
    },
    {
      trigger: "drug_mentioned",
      message: "服薬との相互作用チェックはSafetyで",
    },
    {
      trigger: "safety_concern",
      message: "あなた専用の安全性チェックはSafetyで",
    },
  ],
};
```

### 12.2 導線メッセージ

```
┌─────────────────────────────────────────────────────────────┐
│ 【Guest → Free】                                            │
│ 「本日の無料回数を使い切りました」                          │
│ 「ログインすると週3回まで質問できます」                     │
│ [ログイン] [今はスキップ]                                   │
├─────────────────────────────────────────────────────────────┤
│ 【Free → Pro】                                              │
│ 「この商品の価格履歴を見てみませんか？」                    │
│ 「Proプラン（¥980/月）で1年間の価格推移が確認できます」    │
│ [詳しく見る] [今はスキップ]                                 │
├─────────────────────────────────────────────────────────────┤
│ 【Pro → Pro+Safety】                                        │
│ 「高血圧とおっしゃっていましたね」                          │
│ 「Pro+Safety（¥1,980/月）で、あなたの体質に合わない          │
│  成分を自動でフィルタリングできます」                       │
│ 「"AIは一般論。Suptiaはあなた専用。"」                     │
│ [Safety機能を試す] [今はスキップ]                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 13. 実装ロードマップ

### Phase 1: 基盤構築（2026年1月）

- [ ] AIコンシェルジュUI（チャット形式）
- [ ] 4段階プラン別回答制限（Guest/Free/Pro/Pro+Safety）
- [ ] Guest識別（Cookie + レート制限）
- [ ] 基本キャッシュ機構
- [ ] Haiku/Sonnetモデル切り替え

### Phase 2: Pro機能（2026年2月）

- [ ] 価格履歴統合（1年間）
- [ ] 推薦ロジック可視化
- [ ] 会話履歴保存（Supabase）
- [ ] フォローアップ機能

### Phase 3: Safety機能（2026年3月）

- [ ] 既往歴・服薬登録UI
- [ ] 相互作用データベース構築
- [ ] 相互作用チェッカー
- [ ] 条件付き最新Opus昇格ロジック
- [ ] 危険成分オートブロック
- [ ] 避けるべき成分リスト自動生成

### Phase 4: 最適化（2026年4月）

- [ ] コスト最適化（キャッシュ強化）
- [ ] Safetyレポート出力（PDF）
- [ ] アップセル導線A/Bテスト
- [ ] 専門家相談リンク連携

---

## 14. 更新履歴

| 日付       | バージョン | 内容                                                                                  |
| ---------- | ---------- | ------------------------------------------------------------------------------------- |
| 2026-01-11 | 2.0.0      | 4段階プラン構成に変更（Guest追加）、AIモデル4.5系に統一、条件付きOpus昇格ロジック追加 |
| 2025-12-10 | 1.1.0      | Safety価値提案強化、価格トレンド分析表現統一、相互作用DB拡充・AI役割明確化            |
| 2025-12-10 | 1.0.0      | 初版作成                                                                              |

---

**作成者**: Suptia開発チーム
**レビュー**: 未完了
**承認**: 未完了
