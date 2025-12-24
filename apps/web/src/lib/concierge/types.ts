/**
 * AIコンシェルジュ 型定義
 *
 * v2.1.0 - 信頼される判断補助エンジン
 */

import type { UserPlan } from "@/contexts/UserProfileContext";

// ============================================
// キャラクター関連
// ============================================

export type CharacterId = "navi" | "mint" | "doc" | "haru";

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
  avatar: string;
  personality: string;
  tone: string;
  greeting: string;
  recommendationStyle: RecommendationStyle;
  recommendationStyleLabel: string;
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
}

export const PLAN_CONFIGS: Record<UserPlan, PlanConfig> = {
  free: {
    plan: "free",
    chatLimit: 10,
    followupLimit: 0,
    historyRetentionDays: 3,
    maxSessions: 5,
    contextMessages: 4,
    availableCharacters: ["navi"],
    characterChangeLimit: null,
    canUseCustomName: false,
    canViewWeights: false,
  },
  pro: {
    plan: "pro",
    chatLimit: 50,
    followupLimit: 3,
    historyRetentionDays: 30,
    maxSessions: 50,
    contextMessages: 10,
    availableCharacters: ["navi", "mint", "doc", "haru"],
    characterChangeLimit: 3,
    canUseCustomName: false,
    canViewWeights: true,
  },
  pro_safety: {
    plan: "pro_safety",
    chatLimit: Infinity,
    followupLimit: Infinity,
    historyRetentionDays: null,
    maxSessions: null,
    contextMessages: 20,
    availableCharacters: ["navi", "mint", "doc", "haru"],
    characterChangeLimit: null,
    canUseCustomName: true,
    canViewWeights: true,
  },
  admin: {
    plan: "admin",
    chatLimit: Infinity,
    followupLimit: Infinity,
    historyRetentionDays: null,
    maxSessions: null,
    contextMessages: 20,
    availableCharacters: ["navi", "mint", "doc", "haru"],
    characterChangeLimit: null,
    canUseCustomName: true,
    canViewWeights: true,
  },
};

// ============================================
// ゲスト設定
// ============================================

export const GUEST_CONFIG = {
  chatLimit: 3,
  followupLimit: 0,
  contextMessages: 2,
  availableCharacters: ["navi"] as CharacterId[],
};
