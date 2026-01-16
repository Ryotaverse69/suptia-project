"use client";

/**
 * 認証Context
 *
 * Supabase Authを使用したユーザー認証状態の管理
 * Google、Apple、LINE、メール認証をサポート
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  User,
  Session,
  AuthError,
  AuthChangeEvent,
} from "@supabase/supabase-js";
import { needsMFAVerification, verifyMFALogin } from "@/lib/supabase/mfa";

/**
 * 認証プロバイダーの種類
 */
export type AuthProvider = "google" | "email";

/**
 * MFA検証状態
 */
interface MFAState {
  required: boolean;
  factorId: string | null;
}

/**
 * 認証状態
 */
interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | null;
  mfa: MFAState;
}

/**
 * 認証Context値
 */
interface AuthContextValue extends AuthState {
  signInWithOAuth: (provider: AuthProvider) => Promise<void>;
  sendOtp: (email: string) => Promise<boolean>;
  verifyOtp: (email: string, token: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
  verifyMFA: (code: string) => Promise<boolean>;
  cancelMFA: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * 認証プロバイダー
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    error: null,
    mfa: { required: false, factorId: null },
  });
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  // Supabaseクライアントを安全に作成
  const supabase = React.useMemo(() => {
    try {
      return createClient();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Supabase接続エラー";
      console.error("[AuthContext] Supabase client error:", message);
      setSupabaseError(message);
      return null;
    }
  }, []);

  // 初期化時にセッションを取得
  useEffect(() => {
    if (!supabase) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("[AuthContext] getSession error:", error);
          setState((prev) => ({ ...prev, error, isLoading: false }));
          return;
        }

        setState((prev) => ({
          ...prev,
          user: session?.user ?? null,
          session,
          isLoading: false,
          error: null,
        }));
      } catch (err) {
        console.error("[AuthContext] Unexpected error:", err);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    getInitialSession();

    // MFA検証が必要かチェック
    const checkMFARequirement = async () => {
      try {
        const mfaCheck = await needsMFAVerification();
        if (mfaCheck.required && mfaCheck.factorId) {
          setState((prev) => ({
            ...prev,
            mfa: { required: true, factorId: mfaCheck.factorId || null },
          }));
        }
      } catch (err) {
        console.error("[AuthContext] MFA check error:", err);
      }
    };

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        setState((prev) => ({
          ...prev,
          user: session?.user ?? null,
          session,
          isLoading: false,
          error: null,
        }));

        // ログイン成功時にMFA検証が必要かチェック
        if (session?.user && _event === "SIGNED_IN") {
          await checkMFARequirement();
        }
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  /**
   * OAuth認証（Google、Apple）
   */
  const signInWithOAuth = useCallback(
    async (provider: AuthProvider) => {
      if (provider === "email") return;
      if (!supabase) {
        console.error("[AuthContext] Supabase not available");
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          setState((prev) => ({ ...prev, error, isLoading: false }));
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error as AuthError,
          isLoading: false,
        }));
      }
    },
    [supabase],
  );

  /**
   * OTPコードを送信（メールに6桁コードを送信）
   */
  const sendOtp = useCallback(
    async (email: string): Promise<boolean> => {
      if (!supabase) {
        console.error("[AuthContext] Supabase not available");
        return false;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // shouldCreateUserをtrueにして新規ユーザーも自動作成
          shouldCreateUser: true,
        },
      });

      if (error) {
        setState((prev) => ({ ...prev, error, isLoading: false }));
        return false;
      }

      setState((prev) => ({ ...prev, isLoading: false }));
      return true;
    },
    [supabase],
  );

  /**
   * OTPコードを検証してログイン
   */
  const verifyOtp = useCallback(
    async (email: string, token: string): Promise<boolean> => {
      if (!supabase) {
        console.error("[AuthContext] Supabase not available");
        return false;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });

      if (error) {
        setState((prev) => ({ ...prev, error, isLoading: false }));
        return false;
      }

      setState((prev) => ({ ...prev, isLoading: false }));
      return true;
    },
    [supabase],
  );

  /**
   * サインアウト
   */
  const signOut = useCallback(async () => {
    if (!supabase) {
      console.error("[AuthContext] Supabase not available for signOut");
      // Supabaseがなくてもローカルステートはリセット
      setState((prev) => ({
        ...prev,
        user: null,
        session: null,
        isLoading: false,
        error: null,
      }));
      window.location.href = "/";
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) {
      console.error("[AuthContext] SignOut error:", error);
      setState((prev) => ({ ...prev, error, isLoading: false }));
    } else {
      // ログアウト成功時、ステートをリセット
      setState((prev) => ({
        ...prev,
        user: null,
        session: null,
        isLoading: false,
        error: null,
      }));
      // ページをリロードしてキャッシュをクリア
      window.location.href = "/";
    }
  }, [supabase]);

  /**
   * エラーをクリア
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  /**
   * MFA検証
   */
  const verifyMFA = useCallback(
    async (code: string): Promise<boolean> => {
      if (!state.mfa.factorId) {
        console.error("[AuthContext] No MFA factor ID available");
        return false;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await verifyMFALogin(state.mfa.factorId, code);

      if (result.success) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          mfa: { required: false, factorId: null },
        }));
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: {
            message: result.error || "MFA検証に失敗しました",
          } as AuthError,
        }));
        return false;
      }
    },
    [state.mfa.factorId],
  );

  /**
   * MFA検証をキャンセル（ログアウト）
   */
  const cancelMFA = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      mfa: { required: false, factorId: null },
    }));
    await signOut();
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signInWithOAuth,
        sendOtp,
        verifyOtp,
        signOut,
        clearError,
        verifyMFA,
        cancelMFA,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 認証Contextを使用するフック
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
