/**
 * AIコンシェルジュ 型定義
 *
 * v2.1.0 - 信頼される判断補助エンジン
 */

import type { UserPlan } from "@/contexts/UserProfileContext";

// ============================================
// キャラクター関連
// ============================================

export type CharacterId = "core" | "mint" | "repha" | "haku";

export type RecommendationStyle = "balanced" | "evidence" | "cost" | "safety";

export interface RecommendationWeights {
  price: number;
  amount: number;
  costPerformance: number;
  evidence: number;
  safety: number;
}

export interface Character {
  id: CharacterId;
  name: string;
  nameEn: string;
  avatar: string;
  personality: string;
  tone: string;
  greeting: string;
  recommendationStyle: RecommendationStyle;
  recommendationStyleLabel: string;
  /** こんな人向け - ユーザーが一瞬で選べるための説明 */
  targetAudience: string;
  /** 判断軸（内部コンセプト）- 例: "バランス｜価格・成分・安全・根拠・続けやすさ" */
  focusAxis: string;
  weights: RecommendationWeights;
  availablePlans: UserPlan[];
}

// ============================================
// メッセージ関連
// ============================================

export type MessageRole = "user" | "assistant" | "system";

export interface Source {
  name: string;
  url?: string;
  layer?: SourceLayer;
}

export interface ProductSummary {
  id: string;
  name: string;
  imageUrl?: string;
  price?: number;
  source?: string;
  scores?: {
    price: number;
    amount: number;
    costPerformance: number;
    evidence: number;
    safety: number;
    total: number;
  };
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  metadata: MessageMetadata;
  createdAt: string;
}

// 5つの柱のスコアデータ
export interface PillarScore {
  score: number; // 0-100
  label: string;
}

export interface PillarsData {
  price?: PillarScore;
  amount?: PillarScore;
  costPerformance?: PillarScore;
  evidence?: PillarScore;
  safety?: PillarScore;
}

export interface MessageMetadata {
  characterId?: CharacterId;
  characterName?: string;
  recommendationStyle?: RecommendationStyle;
  recommendedProducts?: ProductSummary[];
  sources?: Source[];
  advisories?: Advisory[];
  model?: AIModel;
  tokensUsed?: number;
  cacheHit?: boolean;
  userFeedback?: "helpful" | "not_helpful";
  pillars?: PillarsData; // 推薦理由の5つの柱
}

// ============================================
// セッション関連
// ============================================

export interface ChatSession {
  id: string;
  userId: string;
  characterId: CharacterId;
  title: string | null;
  summary: string | null;
  messageCount: number;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Advisory関連（v2.1: 注意喚起）
// ============================================

export type AdvisoryLevel = "low" | "medium" | "high";

export type AdvisoryType =
  | "guideline_warning"
  | "documented_interaction"
  | "general_caution";

export type SourceLayer = "layer1" | "layer2" | "layer3";

export interface Advisory {
  level: AdvisoryLevel;
  type: AdvisoryType;
  message: string;
  sourceLayer: SourceLayer;
  sourceName: string;
  sourceUrl?: string;
  originalText?: string;
  substances?: string[];
}

// ============================================
// AIモデル関連
// ============================================

export type AIModel = "haiku" | "sonnet" | "opus";

export interface SafetyContext {
  requiresHighAccuracy: boolean;
  hasAdvisories: boolean;
  healthProfileInvolved: boolean;
}

// ============================================
// 利用状況関連
// ============================================

export interface UsageStats {
  remaining: number;
  limit: number;
  resetAt: string;
  followupRemaining?: number;
  followupLimit?: number;
}

// ============================================
// プラン別設定
// ============================================

export interface PlanConfig {
  plan: UserPlan;
  chatLimit: number;
  followupLimit: number;
  historyRetentionDays: number | null;
  maxSessions: number | null;
  contextMessages: number;
  availableCharacters: CharacterId[];
  characterChangeLimit: number | null;
  canUseCustomName: boolean;
  canViewWeights: boolean;
  /** 価格履歴アクセス期間（日数）。nullは無制限 */
  priceHistoryDays: number | null;
}

export const PLAN_CONFIGS: Record<UserPlan, PlanConfig> = {
  free: {
    plan: "free",
    chatLimit: 3, // 週3回（転換率向上のため5→3に削減）
    followupLimit: 0,
    historyRetentionDays: 1, // 1日（3→1に短縮）
    maxSessions: 5,
    contextMessages: 4,
    availableCharacters: ["core", "mint", "repha", "haku"],
    characterChangeLimit: null,
    canUseCustomName: false,
    canViewWeights: false,
    priceHistoryDays: 30, // 仕様書: 30日
  },
  pro: {
    plan: "pro",
    chatLimit: 25, // 仕様書: 25回/週
    followupLimit: 3,
    historyRetentionDays: 30,
    maxSessions: 50,
    contextMessages: 10,
    availableCharacters: ["core", "mint", "repha", "haku"],
    characterChangeLimit: 3,
    canUseCustomName: false,
    canViewWeights: true,
    priceHistoryDays: 365, // 仕様書: 1年
  },
  pro_safety: {
    plan: "pro_safety",
    chatLimit: 50, // 週50回（コストリスク排除のためInfinity→50）
    followupLimit: 5, // 1会話5回（Infinity→5）
    historyRetentionDays: null,
    maxSessions: null,
    contextMessages: 20,
    availableCharacters: ["core", "mint", "repha", "haku"],
    characterChangeLimit: null,
    canUseCustomName: true,
    canViewWeights: true,
    priceHistoryDays: null, // 仕様書: 全期間（無制限）
  },
  admin: {
    plan: "admin",
    chatLimit: Infinity,
    followupLimit: Infinity,
    historyRetentionDays: null,
    maxSessions: null,
    contextMessages: 20,
    availableCharacters: ["core", "mint", "repha", "haku"],
    characterChangeLimit: null,
    canUseCustomName: true,
    canViewWeights: true,
    priceHistoryDays: null, // 無制限
  },
};

// ============================================
// ゲスト設定
// ============================================

export const GUEST_CONFIG = {
  chatLimit: 2, // 仕様書: 2回/日
  followupLimit: 0,
  contextMessages: 2,
  availableCharacters: ["core"] as CharacterId[],
  priceHistoryDays: 7, // 仕様書: 7日
};
