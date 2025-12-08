"use client";

/**
 * 診断結果を自動保存するコンポーネント
 *
 * 診断結果ページに配置し、ログインユーザーの診断履歴を自動保存
 */

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useDiagnosisHistory } from "@/contexts/DiagnosisHistoryContext";

interface TopRecommendation {
  productId: string;
  productName: string;
  rank: number;
}

interface DiagnosisHistorySaverProps {
  topRecommendations?: TopRecommendation[];
}

export function DiagnosisHistorySaver({
  topRecommendations,
}: DiagnosisHistorySaverProps) {
  const searchParams = useSearchParams();
  const { saveDiagnosis, isLoggedIn, isAuthLoading } = useDiagnosisHistory();
  const savedRef = useRef(false);

  useEffect(() => {
    const goalsParam = searchParams.get("goals");

    // 既に保存済みの場合はスキップ
    if (savedRef.current) return;

    // 認証状態のロード中は待機
    if (isAuthLoading) return;

    // ログインしていない場合はスキップ
    if (!isLoggedIn) return;

    // URLパラメータから診断情報を取得
    const diagnosisType = searchParams.get("type") as
      | "simple"
      | "detailed"
      | null;
    const conditionsParam = searchParams.get("conditions");
    const budgetStr = searchParams.get("budget");
    const priorityParam = searchParams.get("priority");

    // 必須パラメータがない場合はスキップ
    if (!goalsParam) return;

    const goals = goalsParam.split(",").filter(Boolean);
    const conditions = conditionsParam?.split(",").filter(Boolean) || [];
    const budget = budgetStr ? parseFloat(budgetStr) : undefined;
    const priority = priorityParam || "balanced";

    // 詳細診断の追加パラメータ
    const secondaryGoalsParam = searchParams.get("secondaryGoals");
    const secondaryGoals =
      secondaryGoalsParam?.split(",").filter(Boolean) || [];

    const diagnosisData = {
      diagnosisType: diagnosisType || "simple",
      goals,
      secondaryGoals: secondaryGoals.length > 0 ? secondaryGoals : undefined,
      conditions,
      budget,
      priority,
      // 詳細診断の追加フィールド
      ageGroup: searchParams.get("ageGroup") || undefined,
      lifestyle: searchParams.get("lifestyle") || undefined,
      exerciseFrequency: searchParams.get("exerciseFrequency") || undefined,
      stressLevel: searchParams.get("stressLevel") || undefined,
      sleepQuality: searchParams.get("sleepQuality") || undefined,
      dietQuality: searchParams.get("dietQuality") || undefined,
      alcoholConsumption: searchParams.get("alcoholConsumption") || undefined,
      mainConcern: searchParams.get("mainConcern") || undefined,
      supplementExperience:
        searchParams.get("supplementExperience") || undefined,
      currentSupplements: searchParams
        .get("currentSupplements")
        ?.split(",")
        .filter(Boolean),
      // 結果サマリー
      topRecommendations,
    };

    // 保存
    savedRef.current = true;
    saveDiagnosis(diagnosisData as any);
  }, [
    searchParams,
    isLoggedIn,
    isAuthLoading,
    saveDiagnosis,
    topRecommendations,
  ]);

  // このコンポーネントは何もレンダリングしない
  return null;
}
