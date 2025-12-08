"use client";

/**
 * 診断履歴Context（Supabase連携版）
 *
 * ログインユーザーの診断履歴をSupabaseに保存・取得
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * 診断履歴データの型
 */
export interface DiagnosisHistoryItem {
  id: string;
  diagnosisType: "simple" | "detailed";
  goals: string[];
  secondaryGoals?: string[];
  conditions: string[];
  budget?: number;
  priority: string;
  // 詳細診断の追加フィールド
  ageGroup?: string;
  lifestyle?: string;
  exerciseFrequency?: string;
  stressLevel?: string;
  sleepQuality?: string;
  dietQuality?: string;
  alcoholConsumption?: string;
  mainConcern?: string;
  supplementExperience?: string;
  currentSupplements?: string[];
  // 結果サマリー
  topRecommendations?: Array<{
    productId: string;
    productName: string;
    rank: number;
  }>;
  createdAt: string;
}

interface DiagnosisHistoryContextType {
  history: DiagnosisHistoryItem[];
  isLoading: boolean;
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  saveDiagnosis: (
    data: Omit<DiagnosisHistoryItem, "id" | "createdAt">,
  ) => Promise<void>;
  fetchHistory: () => Promise<void>;
  deleteDiagnosis: (id: string) => Promise<void>;
}

const DiagnosisHistoryContext = createContext<
  DiagnosisHistoryContextType | undefined
>(undefined);

export function DiagnosisHistoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [history, setHistory] = useState<DiagnosisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user, isLoading: authLoading } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const isLoggedIn = !!user;

  /**
   * 診断履歴を取得
   */
  const fetchHistory = useCallback(async () => {
    if (!user) {
      setHistory([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("diagnosis_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error(
          "[DiagnosisHistoryContext] Failed to fetch history:",
          error,
        );
        setHistory([]);
      } else {
        const formattedHistory: DiagnosisHistoryItem[] = (data ?? []).map(
          (item: {
            id: string;
            diagnosis_data: Omit<DiagnosisHistoryItem, "id" | "createdAt">;
            created_at: string;
          }) => ({
            id: item.id,
            ...item.diagnosis_data,
            createdAt: item.created_at,
          }),
        );
        setHistory(formattedHistory);
      }
    } catch (error) {
      console.error("[DiagnosisHistoryContext] Error fetching history:", error);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);

  // ユーザーがログインしたら履歴を取得
  useEffect(() => {
    if (authLoading) return;
    fetchHistory();
  }, [authLoading, fetchHistory]);

  /**
   * 診断結果を保存
   */
  const saveDiagnosis = useCallback(
    async (data: Omit<DiagnosisHistoryItem, "id" | "createdAt">) => {
      if (!user) return;

      try {
        const { data: insertedData, error } = await supabase
          .from("diagnosis_history")
          .insert({
            user_id: user.id,
            diagnosis_data: data,
          })
          .select();

        if (error) {
          console.error(
            "[DiagnosisHistoryContext] Failed to save diagnosis:",
            error,
          );
        } else if (insertedData && insertedData[0]) {
          // 履歴に追加
          setHistory((prev) => [
            {
              id: insertedData[0].id,
              ...data,
              createdAt: insertedData[0].created_at,
            } as DiagnosisHistoryItem,
            ...prev,
          ]);
        }
      } catch (error) {
        console.error(
          "[DiagnosisHistoryContext] Error saving diagnosis:",
          error,
        );
      }
    },
    [user, supabase],
  );

  /**
   * 診断履歴を削除
   */
  const deleteDiagnosis = useCallback(
    async (id: string) => {
      if (!user) return;

      // 楽観的更新
      const previousHistory = history;
      setHistory((prev) => prev.filter((item) => item.id !== id));

      try {
        const { error } = await supabase
          .from("diagnosis_history")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) {
          console.error(
            "[DiagnosisHistoryContext] Failed to delete diagnosis:",
            error,
          );
          setHistory(previousHistory);
        }
      } catch (error) {
        console.error(
          "[DiagnosisHistoryContext] Error deleting diagnosis:",
          error,
        );
        setHistory(previousHistory);
      }
    },
    [user, supabase, history],
  );

  return (
    <DiagnosisHistoryContext.Provider
      value={{
        history,
        isLoading,
        isLoggedIn,
        isAuthLoading: authLoading,
        saveDiagnosis,
        fetchHistory,
        deleteDiagnosis,
      }}
    >
      {children}
    </DiagnosisHistoryContext.Provider>
  );
}

export function useDiagnosisHistory() {
  const context = useContext(DiagnosisHistoryContext);
  if (context === undefined) {
    throw new Error(
      "useDiagnosisHistory must be used within a DiagnosisHistoryProvider",
    );
  }
  return context;
}
