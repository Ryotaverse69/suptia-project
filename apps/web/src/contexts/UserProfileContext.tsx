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

/**
 * ユーザープラン
 */
export type UserPlan = "free" | "pro" | "pro_safety";

/**
 * ユーザープロフィール
 */
export interface UserProfile {
  id: string;
  userId: string;
  displayName: string | null;
  ageRange: string | null;
  gender: string | null;
  healthGoals: string[];
  allergies: string[];
  conditions: string[]; // 既往歴（Safety用）
  medications: string[]; // 服用中の薬（Safety用）
  concerns: string[];
  plan: UserPlan;
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
    healthGoals: (row.health_goals as string[]) || [],
    allergies: (row.allergies as string[]) || [],
    conditions: (row.conditions as string[]) || [],
    medications: (row.medications as string[]) || [],
    concerns: (row.concerns as string[]) || [],
    plan: ((row.plan as string) || "free") as UserPlan,
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

  const { user, isLoading: authLoading } = useAuth();
  const supabase = createClient();

  const isLoggedIn = !!user;

  /**
   * プロフィールを取得（存在しない場合は作成）
   */
  const fetchOrCreateProfile = useCallback(async () => {
    if (authLoading) return;

    if (!user) {
      setProfile(null);
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
        console.error("[UserProfileContext] Fetch error:", fetchError);
        setError("プロフィールの取得に失敗しました");
        setProfile(null);
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
  }, [user, authLoading, supabase]);

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
