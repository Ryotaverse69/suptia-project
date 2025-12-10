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

/**
 * 認証プロバイダーの種類
 */
export type AuthProvider = "google" | "email";

/**
 * 認証状態
 */
interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | null;
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
  });
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  // Supabaseクライアントを安全に作成
  const supabase = React.useMemo(() => {
    try {
      return createClient();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Supabase接続エラー";
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

        setState({
          user: session?.user ?? null,
          session,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        console.error("[AuthContext] Unexpected error:", err);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    getInitialSession();

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setState({
          user: session?.user ?? null,
          session,
          isLoading: false,
          error: null,
        });
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
      setState({
        user: null,
        session: null,
        isLoading: false,
        error: null,
      });
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
      setState({
        user: null,
        session: null,
        isLoading: false,
        error: null,
      });
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

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signInWithOAuth,
        sendOtp,
        verifyOtp,
        signOut,
        clearError,
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
