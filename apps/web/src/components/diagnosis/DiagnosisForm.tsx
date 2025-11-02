"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const HEALTH_GOALS = [
  { id: "immune-boost", label: "免疫力強化" },
  { id: "energy-recovery", label: "疲労回復・エネルギー" },
  { id: "skin-health", label: "美肌・肌の健康" },
  { id: "bone-health", label: "骨の健康" },
  { id: "heart-health", label: "心臓・循環器の健康" },
  { id: "brain-function", label: "脳機能・集中力" },
];

const HEALTH_CONDITIONS = [
  { id: "pregnant", label: "妊娠中" },
  { id: "breastfeeding", label: "授乳中" },
  { id: "allergy-prone", label: "アレルギー体質" },
  { id: "liver-disease", label: "肝臓疾患" },
  { id: "kidney-disease", label: "腎臓疾患" },
  { id: "diabetes", label: "糖尿病" },
  { id: "heart-disease", label: "心臓疾患" },
  { id: "hypertension", label: "高血圧" },
  { id: "hypotension", label: "低血圧" },
  { id: "thyroid-disorder", label: "甲状腺疾患" },
  { id: "autoimmune-disease", label: "自己免疫疾患" },
  { id: "digestive-disorder", label: "消化器疾患" },
  { id: "mental-disorder", label: "精神疾患" },
  { id: "none", label: "該当なし" },
];

const PRIORITIES = [
  {
    id: "balanced",
    label: "バランス重視",
    description: "総合的にバランスよく選ぶ",
  },
  {
    id: "cost",
    label: "コスト重視",
    description: "なるべく安く抑えたい",
  },
  {
    id: "safety",
    label: "安全性重視",
    description: "安全性を最優先したい",
  },
  {
    id: "evidence",
    label: "エビデンス重視",
    description: "科学的根拠を重視したい",
  },
  {
    id: "effectiveness",
    label: "効果重視",
    description: "効果の高さを重視したい",
  },
];

export function DiagnosisForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [budgetPerDay, setBudgetPerDay] = useState<number>(500);
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [priority, setPriority] = useState<string>("balanced");

  // URLパラメータから初期値を読み込む
  useEffect(() => {
    const goalsParam = searchParams.get("goals");
    const budgetParam = searchParams.get("budget");
    const conditionsParam = searchParams.get("conditions");
    const priorityParam = searchParams.get("priority");

    if (goalsParam) {
      setSelectedGoals(goalsParam.split(",").filter(Boolean));
    }
    if (budgetParam) {
      setBudgetPerDay(Number(budgetParam));
    }
    if (conditionsParam) {
      setHealthConditions(conditionsParam.split(",").filter(Boolean));
    }
    if (priorityParam) {
      setPriority(priorityParam);
    }
  }, [searchParams]);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((g) => g !== goalId)
        : [...prev, goalId],
    );
  };

  const toggleHealthCondition = (conditionId: string) => {
    setHealthConditions((prev) => {
      // 「該当なし」を選択した場合、他の選択を解除
      if (conditionId === "none") {
        return prev.includes("none") ? [] : ["none"];
      }

      // 他の項目を選択した場合、「該当なし」を解除
      const filtered = prev.filter((c) => c !== "none");
      return filtered.includes(conditionId)
        ? filtered.filter((c) => c !== conditionId)
        : [...filtered, conditionId];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedGoals.length === 0) {
      alert("少なくとも1つの健康目標を選択してください");
      return;
    }

    const searchParams = new URLSearchParams();
    searchParams.append("goals", selectedGoals.join(","));
    searchParams.append("budget", String(budgetPerDay));
    searchParams.append("priority", priority);

    // 健康状態（「該当なし」以外）
    const conditions = healthConditions.filter((c) => c !== "none");
    if (conditions.length > 0) {
      searchParams.append("conditions", conditions.join(","));
    }

    router.push("/diagnosis/results?" + searchParams.toString());
  };

  // プログレス計算（完了したステップ数）
  const completedSteps = [
    selectedGoals.length > 0, // ステップ1
    true, // ステップ2（予算は常に設定済み）
    true, // ステップ3（任意なので常に完了扱い）
    true, // ステップ4（デフォルト値があるので常に完了扱い）
  ].filter(Boolean).length;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
      {/* 所要時間とプログレスバー */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>約1分で完了</span>
          </div>
          <span className="text-sm text-gray-500">
            ステップ {completedSteps}/4
          </span>
        </div>

        {/* プログレスバー */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 rounded-full transition-all ${
                step === 1 && selectedGoals.length > 0
                  ? "bg-blue-500"
                  : step === 2 || step === 3 || step === 4
                    ? "bg-blue-500"
                    : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          ステップ1: 健康目標を選択してください
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {HEALTH_GOALS.map((goal) => (
            <button
              key={goal.id}
              type="button"
              onClick={() => toggleGoal(goal.id)}
              className={
                selectedGoals.includes(goal.id)
                  ? "p-4 rounded-lg border-2 border-blue-500 bg-blue-50 text-blue-700 font-semibold transition-all"
                  : "p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 text-gray-700 transition-all"
              }
            >
              {goal.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-3 text-gray-800">
          ステップ2: 1日あたりの予算を設定
        </h3>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={budgetPerDay}
            onChange={(e) => setBudgetPerDay(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg"
          />
          <span className="text-2xl font-bold text-blue-600 min-w-[120px] text-right">
            ¥{budgetPerDay.toLocaleString()}/day
          </span>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          ステップ3: 健康状態・懸念事項（任意）
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          該当する項目があれば選択してください。安全性チェックに使用されます。
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {HEALTH_CONDITIONS.map((condition) => (
            <button
              key={condition.id}
              type="button"
              onClick={() => toggleHealthCondition(condition.id)}
              className={
                healthConditions.includes(condition.id)
                  ? condition.id === "none"
                    ? "p-3 rounded-lg border-2 border-green-500 bg-green-50 text-green-700 font-semibold transition-all text-sm"
                    : "p-3 rounded-lg border-2 border-orange-500 bg-orange-50 text-orange-700 font-semibold transition-all text-sm"
                  : "p-3 rounded-lg border-2 border-gray-200 hover:border-orange-300 text-gray-700 transition-all text-sm"
              }
            >
              {condition.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          ステップ4: 優先事項を選択
        </h3>
        <div className="space-y-3">
          {PRIORITIES.map((priorityOption) => (
            <label
              key={priorityOption.id}
              className={
                priority === priorityOption.id
                  ? "flex items-start p-4 rounded-lg border-2 border-purple-500 bg-purple-50 cursor-pointer transition-all"
                  : "flex items-start p-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 cursor-pointer transition-all"
              }
            >
              <input
                type="radio"
                name="priority"
                value={priorityOption.id}
                checked={priority === priorityOption.id}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-1 mr-3 h-4 w-4 text-purple-600"
              />
              <div className="flex-1">
                <div
                  className={
                    priority === priorityOption.id
                      ? "font-semibold text-purple-700"
                      : "font-semibold text-gray-800"
                  }
                >
                  {priorityOption.label}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {priorityOption.description}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={selectedGoals.length === 0}
        className={
          selectedGoals.length === 0
            ? "w-full py-4 rounded-lg text-white font-bold text-lg bg-gray-300 cursor-not-allowed transition-all"
            : "w-full py-4 rounded-lg text-white font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
        }
      >
        おすすめを診断する
      </button>

      {selectedGoals.length === 0 && (
        <p className="text-center text-sm text-red-500 mt-3">
          少なくとも1つの健康目標を選択してください
        </p>
      )}
    </form>
  );
}
