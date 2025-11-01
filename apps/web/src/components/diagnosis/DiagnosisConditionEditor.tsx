"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Check } from "lucide-react";
import type { HealthGoal, UserPriority } from "@/lib/recommendation-engine";
import type { ContraindicationTag } from "@/lib/safety-checker";

interface DiagnosisConditionEditorProps {
  initialGoals: HealthGoal[];
  initialBudget?: number;
  initialConditions: ContraindicationTag[];
  initialPriority: UserPriority;
}

const HEALTH_GOAL_OPTIONS: { id: HealthGoal; label: string }[] = [
  { id: "immune-boost", label: "免疫力強化" },
  { id: "energy-recovery", label: "疲労回復・エネルギー" },
  { id: "skin-health", label: "美肌・肌の健康" },
  { id: "bone-health", label: "骨の健康" },
  { id: "heart-health", label: "心臓・循環器の健康" },
  { id: "brain-function", label: "脳機能・集中力" },
];

const CONDITION_OPTIONS: { id: ContraindicationTag; label: string }[] = [
  { id: "pregnant", label: "妊娠中" },
  { id: "breastfeeding", label: "授乳中" },
  { id: "allergy-prone", label: "アレルギー体質" },
  { id: "liver-disease", label: "肝臓疾患" },
  { id: "kidney-disease", label: "腎臓疾患" },
  { id: "diabetes", label: "糖尿病" },
  { id: "heart-disease", label: "心臓疾患" },
];

const PRIORITY_OPTIONS: { id: UserPriority; label: string }[] = [
  { id: "balanced", label: "バランス重視" },
  { id: "cost", label: "コスト重視" },
  { id: "safety", label: "安全性重視" },
  { id: "evidence", label: "エビデンス重視" },
  { id: "effectiveness", label: "効果重視" },
];

export function DiagnosisConditionEditor({
  initialGoals,
  initialBudget = 500,
  initialConditions,
  initialPriority,
}: DiagnosisConditionEditorProps) {
  const router = useRouter();
  const [editingGoals, setEditingGoals] = useState(false);
  const [editingBudget, setEditingBudget] = useState(false);
  const [editingConditions, setEditingConditions] = useState(false);
  const [editingPriority, setEditingPriority] = useState(false);

  const [goals, setGoals] = useState<HealthGoal[]>(initialGoals);
  const [budget, setBudget] = useState(initialBudget);
  const [conditions, setConditions] =
    useState<ContraindicationTag[]>(initialConditions);
  const [priority, setPriority] = useState<UserPriority>(initialPriority);

  const handleApplyChanges = () => {
    // 編集状態を閉じる
    setEditingGoals(false);
    setEditingBudget(false);
    setEditingConditions(false);
    setEditingPriority(false);

    // 新しいURLパラメータを構築
    const searchParams = new URLSearchParams();
    searchParams.append("goals", goals.join(","));
    searchParams.append("budget", String(budget));
    searchParams.append("priority", priority);
    if (conditions.length > 0) {
      searchParams.append("conditions", conditions.join(","));
    }

    // ページを再読み込みして新しい推薦結果を取得
    router.push("/diagnosis/results?" + searchParams.toString());
    router.refresh();
  };

  const toggleGoal = (goal: HealthGoal) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    );
  };

  const toggleCondition = (condition: ContraindicationTag) => {
    setConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition],
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">診断条件</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 健康目標 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">健康目標</div>
            <button
              onClick={() => setEditingGoals(!editingGoals)}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              {editingGoals ? "完了" : "編集"}
            </button>
          </div>
          {editingGoals ? (
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {HEALTH_GOAL_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={goals.includes(option.id)}
                    onChange={() => toggleGoal(option.id)}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          ) : goals.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {goals.map((goal) => {
                const option = HEALTH_GOAL_OPTIONS.find((o) => o.id === goal);
                return (
                  <span
                    key={goal}
                    className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                  >
                    {option?.label}
                  </span>
                );
              })}
            </div>
          ) : (
            <span className="text-sm text-gray-500">未設定</span>
          )}
        </div>

        {/* 健康状態 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">健康状態・懸念</div>
            <button
              onClick={() => setEditingConditions(!editingConditions)}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              {editingConditions ? "完了" : "編集"}
            </button>
          </div>
          {editingConditions ? (
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {CONDITION_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={conditions.includes(option.id)}
                    onChange={() => toggleCondition(option.id)}
                    className="rounded text-amber-600"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          ) : conditions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {conditions.map((condition) => {
                const option = CONDITION_OPTIONS.find(
                  (o) => o.id === condition,
                );
                return (
                  <span
                    key={condition}
                    className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full"
                  >
                    {option?.label || condition}
                  </span>
                );
              })}
            </div>
          ) : (
            <span className="text-sm text-gray-500">該当なし</span>
          )}
        </div>

        {/* 予算 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">1日あたりの予算</div>
            <button
              onClick={() => setEditingBudget(!editingBudget)}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              {editingBudget ? "完了" : "編集"}
            </button>
          </div>
          {editingBudget ? (
            <div className="space-y-2">
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg"
              />
              <div className="text-center text-lg font-semibold text-blue-600">
                ¥{budget}
              </div>
            </div>
          ) : (
            <div className="text-lg font-semibold text-gray-900">¥{budget}</div>
          )}
        </div>

        {/* 優先事項 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">優先事項</div>
            <button
              onClick={() => setEditingPriority(!editingPriority)}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              {editingPriority ? "完了" : "編集"}
            </button>
          </div>
          {editingPriority ? (
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as UserPriority)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-lg font-semibold text-gray-900">
              {PRIORITY_OPTIONS.find((o) => o.id === priority)?.label}
            </div>
          )}
        </div>
      </div>

      {/* 変更を適用ボタン */}
      {(editingGoals ||
        editingBudget ||
        editingConditions ||
        editingPriority) && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleApplyChanges}
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Check size={16} />
            変更を適用
          </button>
        </div>
      )}
    </div>
  );
}
