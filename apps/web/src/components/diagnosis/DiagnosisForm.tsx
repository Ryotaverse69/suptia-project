"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Heart,
  Zap,
  Shield,
  DollarSign,
  CheckCircle2,
  ChevronRight,
  Target,
  AlertCircle,
  Check,
  Activity,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

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
    icon: Heart,
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
    icon: Activity,
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
  const [priority, setPriority] = useState<string>(""); // デフォルト値を空に変更

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

  // 診断結果ページへ遷移する関数
  const navigateToResults = (selectedPriority: string) => {
    if (selectedGoals.length === 0) {
      alert("少なくとも1つの健康目標を選択してください");
      return;
    }

    const searchParams = new URLSearchParams();
    searchParams.append("goals", selectedGoals.join(","));
    searchParams.append("budget", String(budgetPerDay));
    searchParams.append("priority", selectedPriority);
    searchParams.append("type", "simple"); // 診断タイプを追加

    const conditions = healthConditions.filter((c) => c !== "none");
    if (conditions.length > 0) {
      searchParams.append("conditions", conditions.join(","));
    }

    router.push("/diagnosis/results?" + searchParams.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    navigateToResults(priority);
  };

  // 優先事項を選択したら自動的に結果画面へ遷移
  const handlePrioritySelect = (priorityId: string) => {
    setPriority(priorityId);
    // 少し遅延させてから遷移（選択の視覚的フィードバックのため）
    setTimeout(() => {
      navigateToResults(priorityId);
    }, 300);
  };

  const canProceed = (step: number) => {
    if (step === 1) return selectedGoals.length > 0;
    if (step === 2) return true;
    if (step === 3) return true;
    if (step === 4) return priority !== ""; // 優先事項が選択されているかチェック
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
    <div className="space-y-6" style={{ fontFamily: fontStack }}>
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
                    className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300"
                    style={{
                      background: isCompleted
                        ? `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`
                        : isActive
                          ? `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.indigo} 100%)`
                          : appleWebColors.sectionBackground,
                      color:
                        isCompleted || isActive
                          ? "white"
                          : appleWebColors.textTertiary,
                      transform: isActive ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    {isCompleted ? (
                      <Check size={22} strokeWidth={3} />
                    ) : (
                      <StepIcon size={22} />
                    )}
                  </div>
                  <div
                    className="mt-2 text-[11px] sm:text-[13px] font-semibold text-center"
                    style={{
                      color: isActive
                        ? systemColors.blue
                        : isCompleted
                          ? systemColors.green
                          : appleWebColors.textTertiary,
                    }}
                  >
                    {step.title}
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className="absolute top-5 sm:top-7 left-1/2 w-full h-[3px] rounded-full transition-all duration-500"
                    style={{
                      background: isCompleted
                        ? `linear-gradient(90deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`
                        : appleWebColors.sectionBackground,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ステップコンテンツ */}
      <div className={`${liquidGlassClasses.light} p-6 sm:p-8 min-h-[480px]`}>
        <form onSubmit={handleSubmit}>
          {/* ステップ1: 健康目標 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2
                  className="text-[20px] sm:text-[24px] font-bold mb-3"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  健康目標を選択してください
                </h2>
                <p
                  className="text-[14px] sm:text-[15px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  複数選択可能です。あなたの目標に合ったサプリメントを推薦します。
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {HEALTH_GOALS.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoals.includes(goal.id);
                  const gradientMap: Record<string, string> = {
                    "from-green-400 to-emerald-600": `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
                    "from-yellow-400 to-orange-600": `linear-gradient(135deg, ${systemColors.yellow} 0%, ${systemColors.orange} 100%)`,
                    "from-pink-400 to-rose-600": `linear-gradient(135deg, ${systemColors.pink} 0%, ${systemColors.red} 100%)`,
                    "from-blue-400 to-cyan-600": `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.teal} 100%)`,
                    "from-red-400 to-pink-600": `linear-gradient(135deg, ${systemColors.red} 0%, ${systemColors.pink} 100%)`,
                    "from-purple-400 to-indigo-600": `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.indigo} 100%)`,
                  };
                  const gradient =
                    gradientMap[goal.gradient] ||
                    `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.indigo} 100%)`;

                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => toggleGoal(goal.id)}
                      className="relative p-5 rounded-[16px] transition-all duration-300 border-2 min-h-[140px]"
                      style={{
                        background: isSelected ? gradient : "white",
                        borderColor: isSelected
                          ? "transparent"
                          : appleWebColors.borderSubtle,
                        boxShadow: isSelected
                          ? "0 8px 24px rgba(0, 0, 0, 0.12)"
                          : "none",
                      }}
                    >
                      {isSelected && (
                        <div
                          className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <Check
                            size={14}
                            className="text-white"
                            strokeWidth={3}
                          />
                        </div>
                      )}

                      <div className="text-center">
                        <div
                          className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                          style={{
                            background: isSelected
                              ? "rgba(255, 255, 255, 0.2)"
                              : gradient,
                          }}
                        >
                          <Icon size={24} className="text-white" />
                        </div>

                        <h3
                          className="text-[15px] font-bold mb-1.5"
                          style={{
                            color: isSelected
                              ? "white"
                              : appleWebColors.textPrimary,
                          }}
                        >
                          {goal.label}
                        </h3>
                        <p
                          className="text-[12px] leading-relaxed"
                          style={{
                            color: isSelected
                              ? "rgba(255, 255, 255, 0.85)"
                              : appleWebColors.textSecondary,
                          }}
                        >
                          {goal.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedGoals.length === 0 && (
                <p
                  className="text-center text-[13px] mt-4"
                  style={{ color: systemColors.red }}
                >
                  少なくとも1つの健康目標を選択してください
                </p>
              )}
            </div>
          )}

          {/* ステップ2: 予算設定 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2
                  className="text-[20px] sm:text-[24px] font-bold mb-3"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  1日あたりの予算を設定
                </h2>
                <p
                  className="text-[14px] sm:text-[15px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  スライダーを動かして予算を設定してください
                </p>
              </div>

              <div className="max-w-lg mx-auto">
                <div
                  className="rounded-[20px] p-8 sm:p-10"
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                >
                  <div className="text-center mb-8">
                    <div
                      className="text-[48px] sm:text-[56px] font-bold mb-1"
                      style={{
                        color: systemColors.blue,
                      }}
                    >
                      ¥{budgetPerDay.toLocaleString()}
                    </div>
                    <div
                      className="text-[15px]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      1日あたり
                    </div>
                  </div>

                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={budgetPerDay}
                    onChange={(e) => setBudgetPerDay(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${systemColors.blue} 0%, ${systemColors.indigo} ${((budgetPerDay - 100) / (5000 - 100)) * 100}%, ${appleWebColors.borderSubtle} ${((budgetPerDay - 100) / (5000 - 100)) * 100}%, ${appleWebColors.borderSubtle} 100%)`,
                    }}
                  />

                  <div
                    className="flex justify-between mt-3 text-[13px]"
                    style={{ color: appleWebColors.textTertiary }}
                  >
                    <span>¥100</span>
                    <span>¥5,000</span>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {[300, 500, 1000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setBudgetPerDay(amount)}
                        className="py-3 rounded-xl text-[15px] font-semibold transition-all duration-200 min-h-[48px]"
                        style={{
                          background:
                            budgetPerDay === amount
                              ? `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.indigo} 100%)`
                              : "white",
                          color:
                            budgetPerDay === amount
                              ? "white"
                              : appleWebColors.textPrimary,
                          boxShadow:
                            budgetPerDay === amount
                              ? "0 4px 12px rgba(0, 0, 0, 0.1)"
                              : "none",
                        }}
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
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2
                  className="text-[20px] sm:text-[24px] font-bold mb-3"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  健康状態・懸念事項
                </h2>
                <p
                  className="text-[14px] sm:text-[15px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
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
                      className="p-3.5 rounded-xl text-[13px] font-semibold transition-all duration-200 border-2 min-h-[48px]"
                      style={{
                        backgroundColor: isSelected
                          ? `${systemColors.purple}10`
                          : "white",
                        borderColor: isSelected
                          ? systemColors.purple
                          : appleWebColors.borderSubtle,
                        color: isSelected
                          ? systemColors.purple
                          : appleWebColors.textPrimary,
                      }}
                    >
                      {isSelected && (
                        <Check
                          size={14}
                          className="inline mr-1"
                          style={{ color: systemColors.purple }}
                          strokeWidth={3}
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
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2
                  className="text-[20px] sm:text-[24px] font-bold mb-3"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  優先事項を選択
                </h2>
                <p
                  className="text-[14px] sm:text-[15px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  サプリメントを選ぶ際、何を最も重視しますか？
                </p>
              </div>

              <div className="space-y-3">
                {PRIORITIES.map((priorityOption) => {
                  const Icon = priorityOption.icon;
                  const isSelected = priority === priorityOption.id;
                  const colorMap: Record<string, string> = {
                    blue: systemColors.blue,
                    green: systemColors.green,
                    emerald: systemColors.teal,
                    purple: systemColors.purple,
                    orange: systemColors.orange,
                  };
                  const color =
                    colorMap[priorityOption.color] || systemColors.blue;

                  return (
                    <button
                      key={priorityOption.id}
                      type="button"
                      onClick={() => handlePrioritySelect(priorityOption.id)}
                      className="w-full p-5 rounded-[16px] flex items-center gap-4 transition-all duration-300 border-2 min-h-[80px]"
                      style={{
                        backgroundColor: isSelected ? `${color}10` : "white",
                        borderColor: isSelected
                          ? color
                          : appleWebColors.borderSubtle,
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: isSelected
                            ? color
                            : appleWebColors.sectionBackground,
                        }}
                      >
                        <Icon
                          size={22}
                          style={{
                            color: isSelected
                              ? "white"
                              : appleWebColors.textTertiary,
                          }}
                        />
                      </div>

                      <div className="flex-1 text-left">
                        <h3
                          className="text-[15px] font-bold"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          {priorityOption.label}
                        </h3>
                        <p
                          className="text-[13px]"
                          style={{ color: appleWebColors.textSecondary }}
                        >
                          {priorityOption.description}
                        </p>
                      </div>

                      {isSelected && (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: color }}
                        >
                          <Check
                            size={14}
                            className="text-white"
                            strokeWidth={3}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ナビゲーションボタン */}
          <div
            className="flex gap-4 mt-8 pt-6 border-t"
            style={{ borderColor: appleWebColors.borderSubtle }}
          >
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 py-3.5 rounded-xl text-[15px] font-semibold transition-all duration-200 border min-h-[52px]"
                style={{
                  backgroundColor: "white",
                  borderColor: appleWebColors.borderSubtle,
                  color: appleWebColors.textPrimary,
                }}
              >
                戻る
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceed(currentStep)}
                className="flex-1 py-3.5 rounded-xl text-[15px] font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 min-h-[52px]"
                style={{
                  background: canProceed(currentStep)
                    ? `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.indigo} 100%)`
                    : appleWebColors.sectionBackground,
                  color: canProceed(currentStep)
                    ? "white"
                    : appleWebColors.textTertiary,
                  cursor: canProceed(currentStep) ? "pointer" : "not-allowed",
                }}
              >
                次へ進む
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canProceed(currentStep)}
                className="flex-1 py-3.5 rounded-xl text-[15px] font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 min-h-[52px]"
                style={{
                  background: canProceed(currentStep)
                    ? `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`
                    : appleWebColors.sectionBackground,
                  color: canProceed(currentStep)
                    ? "white"
                    : appleWebColors.textTertiary,
                  cursor: canProceed(currentStep) ? "pointer" : "not-allowed",
                }}
              >
                <CheckCircle2 size={18} />
                診断結果を見る
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
