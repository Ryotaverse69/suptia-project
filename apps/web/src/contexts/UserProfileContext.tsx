"use client";

/**
 * ユーザープロフィールContext（Supabase連携）
 *
 * user_profilesテーブルとの連携
 * AIコンシェルジュのSafety機能（既往歴・服薬・アレルギー）の準備
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AvatarType } from "@/lib/avatar-presets";

/**
 * ユーザープラン
 */
export type UserPlan = "free" | "pro" | "pro_safety" | "admin";

/**
 * ユーザープロフィール
 */
export interface UserProfile {
  id: string;
  userId: string;
  displayName: string | null;
  ageRange: string | null;
  gender: string | null;
  avatarType: AvatarType;
  avatarIcon: string | null; // プリセットアイコンID
  avatarUrl: string | null; // カスタム画像URL
  healthGoals: string[];
  allergies: string[];
  conditions: string[]; // 既往歴（Safety用）
  medications: string[]; // 服用中の薬（Safety用）
  concerns: string[];
  plan: UserPlan;
  is_admin: boolean; // 管理者フラグ
  createdAt: string;
  updatedAt: string;
}

/**
 * プロフィール更新データ
 */
export interface ProfileUpdateData {
  displayName?: string | null;
  ageRange?: string | null;
  gender?: string | null;
  avatarType?: AvatarType;
  avatarIcon?: string | null;
  avatarUrl?: string | null;
  healthGoals?: string[];
  allergies?: string[];
  conditions?: string[];
  medications?: string[];
  concerns?: string[];
}

interface UserProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  error: string | null;
  updateProfile: (data: ProfileUpdateData) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined,
);

/**
 * DB行データをProfileに変換
 */
function mapDbToProfile(row: Record<string, unknown>): UserProfile {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    displayName: (row.display_name as string) || null,
    ageRange: (row.age_range as string) || null,
    gender: (row.gender as string) || null,
    avatarType: ((row.avatar_type as string) || "initial") as AvatarType,
    avatarIcon: (row.avatar_icon as string) || null,
    avatarUrl: (row.avatar_url as string) || null,
    healthGoals: (row.health_goals as string[]) || [],
    allergies: (row.allergies as string[]) || [],
    conditions: (row.conditions as string[]) || [],
    medications: (row.medications as string[]) || [],
    concerns: (row.concerns as string[]) || [],
    plan: ((row.plan as string) || "free").toLowerCase() as UserPlan,
    is_admin: (row.is_admin as boolean) || false,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function UserProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  const { user, isLoading: authLoading } = useAuth();

  // Supabaseクライアントを安全に作成
  const supabase = React.useMemo(() => {
    try {
      return createClient();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Supabase接続エラー";
      console.error("[UserProfileContext] Supabase client error:", message);
      setSupabaseError(message);
      return null;
    }
  }, []);

  const isLoggedIn = !!user;

  /**
   * プロフィールを取得（存在しない場合は作成）
   */
  const fetchOrCreateProfile = useCallback(async () => {
    // authLoadingがtrueの間は処理を待機
    if (authLoading) {
      // authLoadingの間はisLoadingをtrueのままにする（適切なローディング状態を維持）
      setIsLoading(true);
      return;
    }

    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    // Supabaseクライアントがない場合はエラー
    if (!supabase) {
      setError(supabaseError || "Supabase接続が設定されていません");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // まず既存プロフィールを取得
      const { data, error: fetchError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 = "no rows returned" は新規ユーザーなので無視
        console.error(
          "[UserProfileContext] Fetch error:",
          fetchError.message,
          fetchError.code,
          fetchError.details,
        );
        // エラーでもデフォルトプロフィールを設定（UIが壊れないように）
        setProfile({
          id: "",
          userId: user.id,
          displayName: null,
          ageRange: null,
          gender: null,
          avatarType: "initial",
          avatarIcon: null,
          avatarUrl: null,
          healthGoals: [],
          allergies: [],
          conditions: [],
          medications: [],
          concerns: [],
          plan: "free",
          is_admin: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setError(`プロフィールの取得に失敗: ${fetchError.message}`);
        setIsLoading(false);
        return;
      }

      if (data) {
        setProfile(mapDbToProfile(data));
      } else {
        // プロフィールが存在しない場合は新規作成
        const { data: newData, error: insertError } = await supabase
          .from("user_profiles")
          .insert({
            user_id: user.id,
            avatar_type: "initial",
            avatar_icon: null,
            avatar_url: null,
            health_goals: [],
            allergies: [],
            conditions: [],
            medications: [],
            concerns: [],
            plan: "free",
          })
          .select()
          .single();

        if (insertError) {
          console.error("[UserProfileContext] Insert error:", insertError);
          setError("プロフィールの作成に失敗しました");
          setProfile(null);
        } else if (newData) {
          setProfile(mapDbToProfile(newData));
        }
      }
    } catch (err) {
      console.error("[UserProfileContext] Error:", err);
      setError("予期しないエラーが発生しました");
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [user, authLoading, supabase, supabaseError]);

  // ユーザーがログインしたらプロフィールを取得
  useEffect(() => {
    fetchOrCreateProfile();
  }, [fetchOrCreateProfile]);

  /**
   * プロフィールを更新
   */
  const updateProfile = useCallback(
    async (data: ProfileUpdateData): Promise<boolean> => {
      if (!user || !profile) {
        console.warn("[UserProfileContext] User not logged in or no profile");
        return false;
      }

      if (!supabase) {
        setError("Supabase接続が設定されていません");
        return false;
      }

      // 楽観的更新
      const previousProfile = profile;
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              ...(data.displayName !== undefined && {
                displayName: data.displayName,
              }),
              ...(data.ageRange !== undefined && { ageRange: data.ageRange }),
              ...(data.gender !== undefined && { gender: data.gender }),
              ...(data.avatarType !== undefined && {
                avatarType: data.avatarType,
              }),
              ...(data.avatarIcon !== undefined && {
                avatarIcon: data.avatarIcon,
              }),
              ...(data.avatarUrl !== undefined && {
                avatarUrl: data.avatarUrl,
              }),
              ...(data.healthGoals && { healthGoals: data.healthGoals }),
              ...(data.allergies && { allergies: data.allergies }),
              ...(data.conditions && { conditions: data.conditions }),
              ...(data.medications && { medications: data.medications }),
              ...(data.concerns && { concerns: data.concerns }),
            }
          : null,
      );

      try {
        const updateData: Record<string, unknown> = {};
        if (data.displayName !== undefined)
          updateData.display_name = data.displayName;
        if (data.ageRange !== undefined) updateData.age_range = data.ageRange;
        if (data.gender !== undefined) updateData.gender = data.gender;
        if (data.avatarType !== undefined)
          updateData.avatar_type = data.avatarType;
        if (data.avatarIcon !== undefined)
          updateData.avatar_icon = data.avatarIcon;
        if (data.avatarUrl !== undefined)
          updateData.avatar_url = data.avatarUrl;
        if (data.healthGoals) updateData.health_goals = data.healthGoals;
        if (data.allergies) updateData.allergies = data.allergies;
        if (data.conditions) updateData.conditions = data.conditions;
        if (data.medications) updateData.medications = data.medications;
        if (data.concerns) updateData.concerns = data.concerns;

        const { error: updateError } = await supabase
          .from("user_profiles")
          .update(updateData)
          .eq("user_id", user.id);

        if (updateError) {
          console.error("[UserProfileContext] Update error:", updateError);
          setProfile(previousProfile);
          setError("プロフィールの更新に失敗しました");
          return false;
        }

        setError(null);
        return true;
      } catch (err) {
        console.error("[UserProfileContext] Error:", err);
        setProfile(previousProfile);
        setError("予期しないエラーが発生しました");
        return false;
      }
    },
    [user, profile, supabase],
  );

  /**
   * プロフィールを再取得
   */
  const refreshProfile = useCallback(async () => {
    await fetchOrCreateProfile();
  }, [fetchOrCreateProfile]);

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        isLoading,
        isLoggedIn,
        error,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
}
