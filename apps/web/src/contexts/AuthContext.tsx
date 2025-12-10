"use client";

/**
 * 認証Context
 *
 * Supabase Authを使用したユーザー認証状態の管理
 * Google、Apple、LINE、メール認証をサポート
 */

import {
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

  const supabase = createClient();

  // 初期化時にセッションを取得
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          setState((prev) => ({ ...prev, error, isLoading: false }));
          return;
        }

        setState({
          user: session?.user ?? null,
          session,
          isLoading: false,
          error: null,
        });
      } catch {
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
  }, [supabase.auth]);

  /**
   * OAuth認証（Google、Apple）
   */
  const signInWithOAuth = useCallback(
    async (provider: AuthProvider) => {
      if (provider === "email") return;

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
    [supabase.auth],
  );

  /**
   * OTPコードを送信（メールに6桁コードを送信）
   */
  const sendOtp = useCallback(
    async (email: string): Promise<boolean> => {
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
    [supabase.auth],
  );

  /**
   * OTPコードを検証してログイン
   */
  const verifyOtp = useCallback(
    async (email: string, token: string): Promise<boolean> => {
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
    [supabase.auth],
  );

  /**
   * サインアウト
   */
  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const { error } = await supabase.auth.signOut();

    if (error) {
      setState((prev) => ({ ...prev, error, isLoading: false }));
    } else {
      // ログアウト成功時、ステートをリセット
      setState({
        user: null,
        session: null,
        isLoading: false,
        error: null,
      });
    }
  }, [supabase.auth]);

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
