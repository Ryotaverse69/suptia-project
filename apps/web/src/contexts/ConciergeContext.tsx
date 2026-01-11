"use client";

/**
 * AIコンシェルジュ Context
 *
 * v2.1.0 - 「信頼される判断補助エンジン」
 *
 * 設計3原則:
 * 1. 断定しない - AIは判断者ではなく翻訳者
 * 2. 理由を説明する - 推薦には必ず根拠を提示
 * 3. 重み付けを見せる - ユーザーが選んでいる感覚を作る
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile, type UserPlan } from "@/contexts/UserProfileContext";
import {
  type CharacterId,
  type ChatSession,
  type ChatMessage,
  type UsageStats,
  type PlanConfig,
  type Character,
  PLAN_CONFIGS,
  GUEST_CONFIG,
} from "@/lib/concierge/types";
import {
  getCharacter,
  getAvailableCharacters,
  isCharacterAvailable,
} from "@/lib/concierge/characters";

// ============================================
// コンテキスト型定義
// ============================================

interface ConciergeState {
  // セッション
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isLoadingSessions: boolean;

  // メッセージ
  messages: ChatMessage[];
  isLoadingMessages: boolean;
  isSending: boolean;
  isLoading: boolean; // 総合ローディング状態

  // キャラクター
  currentCharacter: Character;
  availableCharacters: Character[];
  characterId: CharacterId;

  // 利用状況
  usage: UsageStats | null;
  userPlan: UserPlan;
  isGuest: boolean;

  // 設定
  planConfig: PlanConfig;

  // エラー
  error: string | null;
}

interface ConciergeActions {
  // セッション操作
  createSession: () => Promise<ChatSession | null>;
  loadSession: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<boolean>;
  refreshSessions: () => Promise<void>;

  // メッセージ操作
  sendMessage: (content: string, context?: MessageContext) => Promise<boolean>;
  sendFeedback: (
    messageId: string,
    feedback: "helpful" | "not_helpful",
  ) => Promise<boolean>;
  submitFeedback: (
    messageId: string,
    feedback: "helpful" | "not_helpful",
  ) => Promise<boolean>; // alias for sendFeedback

  // キャラクター操作
  changeCharacter: (characterId: CharacterId) => Promise<boolean>;
  setCharacterId: (characterId: CharacterId) => void; // sync version

  // ユーティリティ
  clearError: () => void;
  refreshUsage: () => Promise<void>;
  stopGeneration: () => void;
}

interface MessageContext {
  productId?: string;
  ingredientSlug?: string;
}

type ConciergeContextType = ConciergeState & ConciergeActions;

const ConciergeContext = createContext<ConciergeContextType | undefined>(
  undefined,
);

// ============================================
// Provider実装
// ============================================

export function ConciergeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { profile } = useUserProfile();

  // Supabaseクライアント
  const supabase = useMemo(() => {
    try {
      return createClient();
    } catch {
      console.error("[ConciergeContext] Supabase client error");
      return null;
    }
  }, []);

  // 状態
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(
    null,
  );
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [characterId, setCharacterId] = useState<CharacterId>("core");
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 中止用AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  // プラン設定
  const userPlan: UserPlan = profile?.plan ?? "free";
  const planConfig = PLAN_CONFIGS[userPlan] ?? PLAN_CONFIGS.free;
  const isGuest = !user;

  // キャラクター（ゲストはcoreのみ）
  const currentCharacter = getCharacter(characterId);
  const availableCharacters = isGuest
    ? [getCharacter("core")]
    : getAvailableCharacters(userPlan);

  // ============================================
  // セッション操作
  // ============================================

  /**
   * セッション一覧を取得
   */
  const refreshSessions = useCallback(async () => {
    if (!user || !supabase) {
      setSessions([]);
      return;
    }

    setIsLoadingSessions(true);
    try {
      const { data, error: fetchError } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .order("updated_at", { ascending: false })
        .limit(planConfig.maxSessions ?? 100);

      if (fetchError) {
        console.error("[ConciergeContext] Fetch sessions error:", fetchError);
        setError("セッションの取得に失敗しました");
        return;
      }

      setSessions(
        (data ?? []).map(
          (row: {
            id: string;
            user_id: string;
            character_id: string;
            title: string | null;
            summary: string | null;
            message_count: number;
            expires_at: string | null;
            created_at: string;
            updated_at: string;
          }) => ({
            id: row.id,
            userId: row.user_id,
            characterId: row.character_id as CharacterId,
            title: row.title,
            summary: row.summary,
            messageCount: row.message_count,
            expiresAt: row.expires_at,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          }),
        ),
      );
    } finally {
      setIsLoadingSessions(false);
    }
  }, [user, supabase, planConfig.maxSessions]);

  /**
   * 新規セッションを作成
   */
  const createSession = useCallback(async (): Promise<ChatSession | null> => {
    if (!user || !supabase) {
      // ゲスト用のローカルセッション
      const guestSession: ChatSession = {
        id: `guest-${Date.now()}`,
        userId: "guest",
        characterId: "core",
        title: null,
        summary: null,
        messageCount: 0,
        expiresAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCurrentSession(guestSession);
      setMessages([]);
      return guestSession;
    }

    try {
      const { data, error: insertError } = await supabase
        .from("chat_sessions")
        .insert({
          user_id: user.id,
          character_id: characterId,
        })
        .select()
        .single();

      if (insertError) {
        console.error("[ConciergeContext] Create session error:", insertError);
        setError("セッションの作成に失敗しました");
        return null;
      }

      const newSession: ChatSession = {
        id: data.id,
        userId: data.user_id,
        characterId: data.character_id as CharacterId,
        title: data.title,
        summary: data.summary,
        messageCount: data.message_count,
        expiresAt: data.expires_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setCurrentSession(newSession);
      setMessages([]);
      setSessions((prev) => [newSession, ...prev]);

      return newSession;
    } catch (err) {
      console.error("[ConciergeContext] Create session error:", err);
      setError("セッションの作成に失敗しました");
      return null;
    }
  }, [user, supabase, characterId]);

  /**
   * セッションを読み込み
   */
  const loadSession = useCallback(
    async (sessionId: string) => {
      if (!user || !supabase) return;

      setIsLoadingMessages(true);
      try {
        // セッション取得
        const { data: sessionData, error: sessionError } = await supabase
          .from("chat_sessions")
          .select("*")
          .eq("id", sessionId)
          .eq("user_id", user.id)
          .single();

        if (sessionError || !sessionData) {
          console.error("[ConciergeContext] Load session error:", sessionError);
          setError("セッションが見つかりません");
          return;
        }

        setCurrentSession({
          id: sessionData.id,
          userId: sessionData.user_id,
          characterId: sessionData.character_id as CharacterId,
          title: sessionData.title,
          summary: sessionData.summary,
          messageCount: sessionData.message_count,
          expiresAt: sessionData.expires_at,
          createdAt: sessionData.created_at,
          updatedAt: sessionData.updated_at,
        });

        // キャラクター同期
        if (sessionData.character_id) {
          setCharacterId(sessionData.character_id as CharacterId);
        }

        // メッセージ取得
        const { data: messagesData, error: messagesError } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("session_id", sessionId)
          .order("created_at", { ascending: true });

        if (messagesError) {
          console.error(
            "[ConciergeContext] Load messages error:",
            messagesError,
          );
        }

        setMessages(
          (messagesData ?? []).map(
            (row: {
              id: string;
              session_id: string;
              role: string;
              content: string;
              metadata: Record<string, unknown> | null;
              created_at: string;
            }) => ({
              id: row.id,
              sessionId: row.session_id,
              role: row.role as ChatMessage["role"],
              content: row.content,
              metadata: (row.metadata ?? {}) as ChatMessage["metadata"],
              createdAt: row.created_at,
            }),
          ),
        );
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [user, supabase],
  );

  /**
   * セッションを削除（論理削除）
   */
  const deleteSession = useCallback(
    async (sessionId: string): Promise<boolean> => {
      if (!user || !supabase) return false;

      try {
        const { error: deleteError } = await supabase
          .from("chat_sessions")
          .update({ deleted_at: new Date().toISOString() })
          .eq("id", sessionId)
          .eq("user_id", user.id);

        if (deleteError) {
          console.error(
            "[ConciergeContext] Delete session error:",
            deleteError,
          );
          setError("セッションの削除に失敗しました");
          return false;
        }

        setSessions((prev) => prev.filter((s) => s.id !== sessionId));

        if (currentSession?.id === sessionId) {
          setCurrentSession(null);
          setMessages([]);
        }

        return true;
      } catch (err) {
        console.error("[ConciergeContext] Delete session error:", err);
        setError("セッションの削除に失敗しました");
        return false;
      }
    },
    [user, supabase, currentSession],
  );

  // ============================================
  // メッセージ操作
  // ============================================

  /**
   * メッセージを送信
   */
  const sendMessage = useCallback(
    async (content: string, context?: MessageContext): Promise<boolean> => {
      if (!content.trim()) return false;

      // レート制限チェック
      const limit = isGuest ? GUEST_CONFIG.chatLimit : planConfig.chatLimit;
      if (usage && usage.remaining <= 0 && limit !== Infinity) {
        setError(
          `本日の質問回数上限（${limit}回）に達しました。${isGuest ? "ログインすると回数が増えます。" : ""}`,
        );
        return false;
      }

      setIsSending(true);
      setError(null);

      // AbortControllerを作成
      abortControllerRef.current = new AbortController();

      try {
        // セッションがない場合は作成
        let session = currentSession;
        if (!session) {
          session = await createSession();
          if (!session) {
            setIsSending(false);
            abortControllerRef.current = null;
            return false;
          }
        }

        // 楽観的にユーザーメッセージを追加
        const userMessage: ChatMessage = {
          id: `temp-${Date.now()}`,
          sessionId: session.id,
          role: "user",
          content,
          metadata: {},
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMessage]);

        // API呼び出し（AbortSignal付き）
        const response = await fetch("/api/concierge/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            sessionId: session.id,
            characterId,
            context,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "メッセージの送信に失敗しました");
        }

        const data = await response.json();

        // メッセージを更新（実際のIDに置き換え）
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== userMessage.id);
          return [
            ...filtered,
            {
              ...userMessage,
              id: data.userMessageId || userMessage.id,
            },
            {
              id: data.message.id,
              sessionId: session!.id,
              role: "assistant" as const,
              content: data.message.content,
              metadata: data.message.metadata,
              createdAt: new Date().toISOString(),
            },
          ];
        });

        // 利用状況を更新
        if (data.usage) {
          setUsage(data.usage);
        }

        // セッションタイトルを更新
        if (data.session?.title && currentSession) {
          setCurrentSession((prev) =>
            prev ? { ...prev, title: data.session.title } : prev,
          );
          setSessions((prev) =>
            prev.map((s) =>
              s.id === session!.id ? { ...s, title: data.session.title } : s,
            ),
          );
        }

        return true;
      } catch (err) {
        // 中止された場合はエラーを表示しない
        if (err instanceof Error && err.name === "AbortError") {
          console.log("[ConciergeContext] Request aborted by user");
          // 楽観的更新を取り消し
          setMessages((prev) => prev.filter((m) => !m.id.startsWith("temp-")));
          return false;
        }

        console.error("[ConciergeContext] Send message error:", err);
        setError(
          err instanceof Error ? err.message : "メッセージの送信に失敗しました",
        );
        // 楽観的更新を取り消し
        setMessages((prev) => prev.filter((m) => !m.id.startsWith("temp-")));
        return false;
      } finally {
        setIsSending(false);
        abortControllerRef.current = null;
      }
    },
    [
      currentSession,
      characterId,
      isGuest,
      planConfig.chatLimit,
      usage,
      createSession,
    ],
  );

  /**
   * フィードバックを送信
   */
  const sendFeedback = useCallback(
    async (
      messageId: string,
      feedback: "helpful" | "not_helpful",
    ): Promise<boolean> => {
      try {
        const response = await fetch("/api/concierge/chat/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messageId, feedback }),
        });

        if (!response.ok) {
          throw new Error("フィードバックの送信に失敗しました");
        }

        // ローカル状態を更新
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? { ...m, metadata: { ...m.metadata, userFeedback: feedback } }
              : m,
          ),
        );

        return true;
      } catch (err) {
        console.error("[ConciergeContext] Send feedback error:", err);
        return false;
      }
    },
    [],
  );

  /**
   * 生成を中止
   */
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // ============================================
  // キャラクター操作
  // ============================================

  /**
   * キャラクターを変更
   */
  const changeCharacter = useCallback(
    async (newCharacterId: CharacterId): Promise<boolean> => {
      // 利用可否チェック
      if (!isCharacterAvailable(newCharacterId, userPlan)) {
        setError("このキャラクターはご利用いただけません");
        return false;
      }

      setCharacterId(newCharacterId);

      // ログインユーザーの場合はDBに保存
      if (user && supabase) {
        try {
          await supabase.from("user_characters").upsert(
            {
              user_id: user.id,
              character_id: newCharacterId,
              last_changed_at: new Date().toISOString(),
            },
            { onConflict: "user_id" },
          );
        } catch (err) {
          console.error("[ConciergeContext] Save character error:", err);
        }
      }

      return true;
    },
    [user, supabase, userPlan],
  );

  // ============================================
  // 利用状況
  // ============================================

  /**
   * 利用状況を取得
   */
  const refreshUsage = useCallback(async () => {
    try {
      const response = await fetch("/api/concierge/usage");
      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      }
    } catch (err) {
      console.error("[ConciergeContext] Refresh usage error:", err);
    }
  }, []);

  // ============================================
  // エラー管理
  // ============================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================
  // 初期化
  // ============================================

  // ユーザー変更時にセッション・キャラクターを読み込み
  useEffect(() => {
    if (user) {
      refreshSessions();
      refreshUsage();

      // ユーザーのキャラクター設定を取得
      if (supabase) {
        supabase
          .from("user_characters")
          .select("character_id")
          .eq("user_id", user.id)
          .single()
          .then(({ data }: { data: { character_id: string } | null }) => {
            if (data?.character_id) {
              setCharacterId(data.character_id as CharacterId);
            }
          });
      }
    } else {
      // ゲスト時はリセット
      setSessions([]);
      setCurrentSession(null);
      setMessages([]);
      setCharacterId("core");
      setUsage(null);
    }
  }, [user, supabase, refreshSessions, refreshUsage]);

  // ============================================
  // コンテキスト値
  // ============================================

  // 総合ローディング状態
  const isLoading = isSending || isLoadingMessages;

  const contextValue: ConciergeContextType = {
    // 状態
    currentSession,
    sessions,
    isLoadingSessions,
    messages,
    isLoadingMessages,
    isSending,
    isLoading,
    currentCharacter,
    availableCharacters,
    characterId,
    usage,
    userPlan,
    isGuest,
    planConfig,
    error,

    // アクション
    createSession,
    loadSession,
    deleteSession,
    refreshSessions,
    sendMessage,
    sendFeedback,
    submitFeedback: sendFeedback, // alias
    changeCharacter,
    setCharacterId, // sync version
    clearError,
    refreshUsage,
    stopGeneration,
  };

  return (
    <ConciergeContext.Provider value={contextValue}>
      {children}
    </ConciergeContext.Provider>
  );
}

// ============================================
// フック
// ============================================

export function useConcierge() {
  const context = useContext(ConciergeContext);
  if (context === undefined) {
    throw new Error("useConcierge must be used within a ConciergeProvider");
  }
  return context;
}

/**
 * キャラクター情報のみを取得するフック
 */
export function useConciergeCharacter() {
  const { currentCharacter, availableCharacters, changeCharacter, planConfig } =
    useConcierge();

  return {
    currentCharacter,
    availableCharacters,
    changeCharacter,
    canViewWeights: planConfig.canViewWeights,
    canUseCustomName: planConfig.canUseCustomName,
  };
}

/**
 * セッション情報のみを取得するフック
 */
export function useConciergeSessions() {
  const {
    currentSession,
    sessions,
    isLoadingSessions,
    createSession,
    loadSession,
    deleteSession,
    refreshSessions,
  } = useConcierge();

  return {
    currentSession,
    sessions,
    isLoadingSessions,
    createSession,
    loadSession,
    deleteSession,
    refreshSessions,
  };
}

/**
 * メッセージ送信用フック
 */
export function useConciergeChat() {
  const {
    messages,
    isLoadingMessages,
    isSending,
    sendMessage,
    sendFeedback,
    usage,
    error,
    clearError,
  } = useConcierge();

  return {
    messages,
    isLoadingMessages,
    isSending,
    sendMessage,
    sendFeedback,
    usage,
    error,
    clearError,
  };
}
