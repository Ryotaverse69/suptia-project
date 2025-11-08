"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Heart,
  Zap,
  Sparkles,
  Shield,
  DollarSign,
  CheckCircle2,
  ChevronRight,
  Target,
  AlertCircle,
} from "lucide-react";

const HEALTH_GOALS = [
  {
    id: "immune-boost",
    label: "免疫力強化",
    icon: Shield,
    gradient: "from-green-400 to-emerald-600",
    description: "風邪や病気に負けない体づくり",
  },
  {
    id: "energy-recovery",
    label: "疲労回復",
    icon: Zap,
    gradient: "from-yellow-400 to-orange-600",
    description: "エネルギーを取り戻す",
  },
  {
    id: "skin-health",
    label: "美肌・肌の健康",
    icon: Sparkles,
    gradient: "from-pink-400 to-rose-600",
    description: "美しく健康的な肌へ",
  },
  {
    id: "bone-health",
    label: "骨の健康",
    icon: Target,
    gradient: "from-blue-400 to-cyan-600",
    description: "丈夫な骨を維持",
  },
  {
    id: "heart-health",
    label: "心臓の健康",
    icon: Heart,
    gradient: "from-red-400 to-pink-600",
    description: "心血管の健康をサポート",
  },
  {
    id: "brain-function",
    label: "脳機能・集中力",
    icon: Sparkles,
    gradient: "from-purple-400 to-indigo-600",
    description: "クリアな思考と集中力",
  },
];

const HEALTH_CONDITIONS = [
  { id: "pregnant", label: "妊娠中", color: "pink" },
  { id: "breastfeeding", label: "授乳中", color: "blue" },
  { id: "allergy-prone", label: "アレルギー体質", color: "orange" },
  { id: "liver-disease", label: "肝臓疾患", color: "yellow" },
  { id: "kidney-disease", label: "腎臓疾患", color: "purple" },
  { id: "diabetes", label: "糖尿病", color: "red" },
  { id: "heart-disease", label: "心臓疾患", color: "red" },
  { id: "hypertension", label: "高血圧", color: "orange" },
  { id: "hypotension", label: "低血圧", color: "blue" },
  { id: "thyroid-disorder", label: "甲状腺疾患", color: "purple" },
  { id: "autoimmune-disease", label: "自己免疫疾患", color: "red" },
  { id: "digestive-disorder", label: "消化器疾患", color: "yellow" },
  { id: "mental-disorder", label: "精神疾患", color: "indigo" },
  { id: "none", label: "該当なし", color: "green" },
];

const PRIORITIES = [
  {
    id: "balanced",
    label: "バランス重視",
    description: "総合的にバランスよく選ぶ",
    icon: Target,
    color: "blue",
  },
  {
    id: "cost",
    label: "コスト重視",
    description: "なるべく安く抑えたい",
    icon: DollarSign,
    color: "green",
  },
  {
    id: "safety",
    label: "安全性重視",
    description: "安全性を最優先したい",
    icon: Shield,
    color: "emerald",
  },
  {
    id: "evidence",
    label: "エビデンス重視",
    description: "科学的根拠を重視したい",
    icon: CheckCircle2,
    color: "purple",
  },
  {
    id: "effectiveness",
    label: "効果重視",
    description: "効果の高さを重視したい",
    icon: Zap,
    color: "orange",
  },
];

const STEPS = [
  { id: 1, title: "健康目標", icon: Target },
  { id: 2, title: "予算設定", icon: DollarSign },
  { id: 3, title: "健康状態", icon: AlertCircle },
  { id: 4, title: "優先事項", icon: CheckCircle2 },
];

export function DiagnosisForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
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
      if (conditionId === "none") {
        return prev.includes("none") ? [] : ["none"];
      }
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

    const conditions = healthConditions.filter((c) => c !== "none");
    if (conditions.length > 0) {
      searchParams.append("conditions", conditions.join(","));
    }

    router.push("/diagnosis/results?" + searchParams.toString());
  };

  const canProceed = (step: number) => {
    if (step === 1) return selectedGoals.length > 0;
    if (step === 2) return true;
    if (step === 3) return true;
    if (step === 4) return true;
    return false;
  };

  const nextStep = () => {
    if (canProceed(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="space-y-8">
      {/* ステップインジケーター */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex-1 relative">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center
                      transition-all duration-300 transform
                      ${isActive ? "scale-110 shadow-2xl" : "scale-100"}
                      ${
                        isCompleted
                          ? "bg-gradient-to-br from-green-400 to-emerald-600 text-white"
                          : isActive
                            ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                            : "bg-gray-200 text-gray-400"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={24} className="animate-bounce" />
                    ) : (
                      <StepIcon size={24} />
                    )}
                  </div>
                  <div
                    className={`
                      mt-2 text-xs sm:text-sm font-semibold text-center
                      ${isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-400"}
                    `}
                  >
                    {step.title}
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`
                      absolute top-6 sm:top-8 left-1/2 w-full h-1
                      transition-all duration-500
                      ${isCompleted ? "bg-gradient-to-r from-green-400 to-emerald-600" : "bg-gray-200"}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ステップコンテンツ */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 min-h-[500px]">
        <form onSubmit={handleSubmit}>
          {/* ステップ1: 健康目標 */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  健康目標を選択してください
                </h2>
                <p className="text-gray-600">
                  複数選択可能です。あなたの目標に合ったサプリメントを推薦します。
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {HEALTH_GOALS.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoals.includes(goal.id);

                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => toggleGoal(goal.id)}
                      className={`
                        relative p-6 rounded-xl border-4 transition-all duration-300 transform
                        hover:scale-105 hover:shadow-2xl
                        ${
                          isSelected
                            ? "border-blue-500 shadow-2xl scale-105 ring-4 ring-blue-200"
                            : "border-gray-200 hover:border-blue-300"
                        }
                        ${isSelected ? `bg-gradient-to-br ${goal.gradient}` : "bg-white"}
                      `}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2
                            size={24}
                            className="text-white animate-bounce"
                          />
                        </div>
                      )}

                      <div className="text-center">
                        <div
                          className={`
                            w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
                            transition-all duration-300
                            ${isSelected ? "bg-white/20" : "bg-gradient-to-br " + goal.gradient}
                          `}
                        >
                          <Icon
                            size={32}
                            className={isSelected ? "text-white" : "text-white"}
                          />
                        </div>

                        <h3
                          className={`
                            text-lg font-bold mb-2
                            ${isSelected ? "text-white" : "text-gray-900"}
                          `}
                        >
                          {goal.label}
                        </h3>
                        <p
                          className={`
                            text-sm
                            ${isSelected ? "text-white/90" : "text-gray-600"}
                          `}
                        >
                          {goal.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedGoals.length === 0 && (
                <p className="text-center text-sm text-red-500 mt-4">
                  少なくとも1つの健康目標を選択してください
                </p>
              )}
            </div>
          )}

          {/* ステップ2: 予算設定 */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  1日あたりの予算を設定
                </h2>
                <p className="text-gray-600">
                  スライダーを動かして予算を設定してください
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 sm:p-12">
                  <div className="text-center mb-8">
                    <div className="text-6xl sm:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-pulse">
                      ¥{budgetPerDay.toLocaleString()}
                    </div>
                    <div className="text-lg text-gray-600">1日あたり</div>
                  </div>

                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={budgetPerDay}
                    onChange={(e) => setBudgetPerDay(Number(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-purple-600 transition-all"
                  />

                  <div className="flex justify-between mt-4 text-sm text-gray-500">
                    <span>¥100</span>
                    <span>¥5,000</span>
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-3">
                    {[300, 500, 1000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setBudgetPerDay(amount)}
                        className={`
                          py-3 rounded-lg font-semibold transition-all duration-200
                          ${budgetPerDay === amount ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105" : "bg-white text-gray-700 hover:bg-gray-50"}
                        `}
                      >
                        ¥{amount}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ステップ3: 健康状態 */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  健康状態・懸念事項
                </h2>
                <p className="text-gray-600">
                  該当するものをすべて選択してください（任意）
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {HEALTH_CONDITIONS.map((condition) => {
                  const isSelected = healthConditions.includes(condition.id);

                  return (
                    <button
                      key={condition.id}
                      type="button"
                      onClick={() => toggleHealthCondition(condition.id)}
                      className={`
                        p-4 rounded-lg border-3 text-sm font-semibold transition-all duration-200
                        hover:scale-105 hover:shadow-lg
                        ${
                          isSelected
                            ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 text-purple-700 shadow-lg ring-2 ring-purple-200"
                            : "border-gray-200 text-gray-700 hover:border-gray-300 bg-white"
                        }
                      `}
                    >
                      {isSelected && (
                        <CheckCircle2
                          size={16}
                          className="inline mr-1 text-purple-600"
                        />
                      )}
                      {condition.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ステップ4: 優先事項 */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  優先事項を選択
                </h2>
                <p className="text-gray-600">
                  サプリメントを選ぶ際、何を最も重視しますか？
                </p>
              </div>

              <div className="space-y-4">
                {PRIORITIES.map((priorityOption) => {
                  const Icon = priorityOption.icon;
                  const isSelected = priority === priorityOption.id;

                  return (
                    <button
                      key={priorityOption.id}
                      type="button"
                      onClick={() => setPriority(priorityOption.id)}
                      className={`
                        w-full p-6 rounded-xl border-4 flex items-center gap-4 transition-all duration-300
                        hover:scale-[1.02] hover:shadow-xl
                        ${
                          isSelected
                            ? "border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-2xl scale-[1.02] ring-4 ring-blue-200"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }
                      `}
                    >
                      <div
                        className={`
                          w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0
                          ${isSelected ? "bg-blue-500" : "bg-gray-200"}
                        `}
                      >
                        <Icon
                          size={28}
                          className={
                            isSelected ? "text-white" : "text-gray-500"
                          }
                        />
                      </div>

                      <div className="flex-1 text-left">
                        <h3 className="text-lg font-bold text-gray-900">
                          {priorityOption.label}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {priorityOption.description}
                        </p>
                      </div>

                      {isSelected && (
                        <CheckCircle2 size={28} className="text-blue-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ナビゲーションボタン */}
          <div className="flex gap-4 mt-10 pt-8 border-t-2 border-gray-100">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                戻る
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceed(currentStep)}
                className={`
                  flex-1 py-4 rounded-xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-2
                  ${canProceed(currentStep) ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl" : "bg-gray-300 cursor-not-allowed"}
                `}
              >
                次へ進む
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={selectedGoals.length === 0}
                className={`
                  flex-1 py-4 rounded-xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-2
                  ${selectedGoals.length > 0 ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl animate-pulse" : "bg-gray-300 cursor-not-allowed"}
                `}
              >
                <Sparkles size={20} />
                診断結果を見る
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
