"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  User,
  Check,
  Shield,
  Zap,
  Sparkles,
  Heart,
  Activity,
  Brain,
  DollarSign,
  Target,
  Award,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

// 質問の型定義
type QuestionType = "single" | "multiple" | "slider" | "text";

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  // description?: string; // 削除: 未使用フィールド
}

// チャットメッセージの型
interface ChatMessage {
  role: "bot" | "user";
  content: string;
  questionId?: string;
  isTyping?: boolean;
}

interface OptionWithIcon {
  value: string;
  label: string;
  icon?: any;
  gradient?: string;
}

interface QuestionWithIcon extends Question {
  options?: OptionWithIcon[];
}

const QUESTIONS: QuestionWithIcon[] = [
  {
    id: "welcome",
    type: "single",
    text: "こんにちは！詳細診断を始めます。まず、主な健康目標を1つ教えてください。",
    options: [
      {
        value: "immune-boost",
        label: "免疫力強化",
        icon: Shield,
        gradient: "from-green-400 to-emerald-600",
      },
      {
        value: "energy-recovery",
        label: "疲労回復・エネルギー",
        icon: Zap,
        gradient: "from-yellow-400 to-orange-600",
      },
      {
        value: "skin-health",
        label: "美肌・肌の健康",
        icon: Sparkles,
        gradient: "from-pink-400 to-rose-600",
      },
      {
        value: "bone-health",
        label: "骨の健康",
        icon: Activity,
        gradient: "from-blue-400 to-cyan-600",
      },
      {
        value: "heart-health",
        label: "心臓・循環器の健康",
        icon: Heart,
        gradient: "from-red-400 to-pink-600",
      },
      {
        value: "brain-function",
        label: "脳機能・集中力",
        icon: Brain,
        gradient: "from-purple-400 to-indigo-600",
      },
    ],
  },
  {
    id: "ageGroup",
    type: "single",
    text: "年齢層を教えてください。",
    options: [
      {
        value: "20s",
        label: "20代",
        icon: User,
        gradient: "from-blue-400 to-blue-600",
      },
      {
        value: "30s",
        label: "30代",
        icon: User,
        gradient: "from-cyan-400 to-cyan-600",
      },
      {
        value: "40s",
        label: "40代",
        icon: User,
        gradient: "from-teal-400 to-teal-600",
      },
      {
        value: "50s",
        label: "50代",
        icon: User,
        gradient: "from-emerald-400 to-emerald-600",
      },
      {
        value: "60plus",
        label: "60代以上",
        icon: User,
        gradient: "from-green-400 to-green-600",
      },
    ],
  },
  {
    id: "exerciseFrequency",
    type: "single",
    text: "運動習慣について教えてください。",
    options: [
      {
        value: "daily",
        label: "ほぼ毎日",
        icon: Activity,
        gradient: "from-green-400 to-green-600",
      },
      {
        value: "weekly",
        label: "週3〜4回",
        icon: Activity,
        gradient: "from-blue-400 to-blue-600",
      },
      {
        value: "occasionally",
        label: "週1〜2回",
        icon: Activity,
        gradient: "from-yellow-400 to-yellow-600",
      },
      {
        value: "rarely",
        label: "ほとんどしない",
        icon: Activity,
        gradient: "from-orange-400 to-orange-600",
      },
    ],
  },
  {
    id: "stressLevel",
    type: "single",
    text: "日常的なストレスレベルはどのくらいですか？",
    options: [
      {
        value: "low",
        label: "低い",
        icon: Heart,
        gradient: "from-green-400 to-green-600",
      },
      {
        value: "moderate",
        label: "普通",
        icon: Heart,
        gradient: "from-yellow-400 to-yellow-600",
      },
      {
        value: "high",
        label: "高い",
        icon: AlertCircle,
        gradient: "from-orange-400 to-red-600",
      },
    ],
  },
  {
    id: "sleepQuality",
    type: "single",
    text: "睡眠の質について教えてください。",
    options: [
      {
        value: "good",
        label: "良好",
        icon: Heart,
        gradient: "from-green-400 to-green-600",
      },
      {
        value: "fair",
        label: "普通",
        icon: Heart,
        gradient: "from-yellow-400 to-yellow-600",
      },
      {
        value: "poor",
        label: "不良",
        icon: AlertCircle,
        gradient: "from-orange-400 to-red-600",
      },
    ],
  },
  {
    id: "dietBalance",
    type: "single",
    text: "食生活のバランスはどうですか？",
    options: [
      {
        value: "balanced",
        label: "バランスが良い",
        icon: Sparkles,
        gradient: "from-green-400 to-green-600",
      },
      {
        value: "sometimes",
        label: "時々偏る",
        icon: Activity,
        gradient: "from-yellow-400 to-yellow-600",
      },
      {
        value: "unbalanced",
        label: "偏りがち",
        icon: AlertCircle,
        gradient: "from-orange-400 to-red-600",
      },
    ],
  },
  {
    id: "priority",
    type: "single",
    text: "サプリメントを選ぶ際、何を最も重視しますか？",
    options: [
      {
        value: "effectiveness",
        label: "効果の高さ",
        icon: Target,
        gradient: "from-blue-500 to-blue-700",
      },
      {
        value: "safety",
        label: "安全性",
        icon: Shield,
        gradient: "from-green-500 to-green-700",
      },
      {
        value: "cost",
        label: "コストパフォーマンス",
        icon: DollarSign,
        gradient: "from-yellow-500 to-yellow-700",
      },
      {
        value: "evidence",
        label: "科学的根拠",
        icon: Award,
        gradient: "from-purple-500 to-purple-700",
      },
      {
        value: "balanced",
        label: "バランス重視",
        icon: TrendingUp,
        gradient: "from-indigo-500 to-indigo-700",
      },
    ],
  },
  {
    id: "budget",
    type: "slider",
    text: "1日あたりの予算はいくらですか？",
    min: 100,
    max: 2000,
    step: 100,
  },
  {
    id: "supplementExperience",
    type: "single",
    text: "サプリメントの使用経験はありますか？",
    options: [
      {
        value: "beginner",
        label: "初めて",
        icon: User,
        gradient: "from-blue-400 to-blue-600",
      },
      {
        value: "intermediate",
        label: "少し経験あり",
        icon: Activity,
        gradient: "from-purple-400 to-purple-600",
      },
      {
        value: "experienced",
        label: "よく使う",
        icon: Award,
        gradient: "from-green-400 to-green-600",
      },
    ],
  },
  {
    id: "healthConditions",
    type: "multiple",
    text: "現在の健康状態で該当するものをすべて選択してください。",
    options: [
      { value: "pregnant", label: "妊娠中", icon: AlertCircle },
      { value: "breastfeeding", label: "授乳中", icon: Heart },
      { value: "diabetes", label: "糖尿病", icon: Activity },
      { value: "hypertension", label: "高血圧", icon: TrendingUp },
      { value: "hypotension", label: "低血圧", icon: Activity },
      { value: "liver-disease", label: "肝臓疾患", icon: AlertCircle },
      { value: "kidney-disease", label: "腎臓疾患", icon: AlertCircle },
      { value: "heart-disease", label: "心臓疾患", icon: Heart },
      { value: "allergy-prone", label: "アレルギー体質", icon: Shield },
      { value: "none", label: "該当なし", icon: Check },
    ],
  },
];

// タイピングアニメーションフック
function useTypingEffect(text: string, speed: number = 30) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text[index]);
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayedText, isTyping };
}

// メッセージ用タイピングコンポーネント
function MessageWithTyping({
  message,
  index,
  totalMessages,
}: {
  message: ChatMessage;
  index: number;
  totalMessages: number;
}) {
  // デバッグ: メッセージ内容を詳細に確認
  console.log("🎯 MessageWithTyping render:", {
    index,
    role: message.role,
    content: message.content,
    contentLength: message.content?.length,
    contentType: typeof message.content,
    contentJSON: JSON.stringify(message.content),
  });

  const isLatestBot =
    message.role === "bot" && index === totalMessages - 1 && message.isTyping;
  const { displayedText } = useTypingEffect(
    message.content,
    isLatestBot ? 30 : 0,
  );

  // デバッグ: 表示されるテキストを確認
  if (message.role === "bot" && index === 0) {
    console.log("📝 displayedText for first bot message:", {
      displayedText,
      isLatestBot,
      willDisplay: isLatestBot ? displayedText : message.content,
    });
  }

  return (
    <div
      className={`flex gap-3 animate-fade-in ${message.role === "user" ? "flex-row-reverse" : ""}`}
    >
      {/* アバター */}
      <div
        className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
          message.role === "bot"
            ? "bg-gradient-to-br from-purple-500 to-pink-500"
            : "bg-gradient-to-br from-blue-500 to-cyan-500"
        }`}
      >
        {message.role === "bot" ? (
          <Bot size={24} className="text-white" />
        ) : (
          <User size={24} className="text-white" />
        )}
      </div>

      {/* メッセージ */}
      <div
        className={`flex-1 max-w-[80%] ${
          message.role === "user" ? "text-right" : ""
        }`}
      >
        <div
          className={`inline-block px-5 py-3 sm:px-6 sm:py-4 rounded-2xl shadow-md transition-all hover:shadow-lg ${
            message.role === "bot"
              ? "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900"
              : "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
          }`}
        >
          <p className="text-sm sm:text-base leading-relaxed">
            {isLatestBot ? displayedText : message.content}
            {isLatestBot && (
              <span className="inline-block w-1 h-4 ml-1 bg-purple-500 animate-pulse" />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ChatDiagnosisForm() {
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // デバッグ: 最初の質問内容を確認
  console.log("🔍 QUESTIONS[0]:", QUESTIONS[0]);
  console.log("🔍 QUESTIONS[0].text:", QUESTIONS[0].text);
  console.log("🔍 QUESTIONS[0] keys:", Object.keys(QUESTIONS[0]));

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      content: QUESTIONS[0].text || "",
      questionId: QUESTIONS[0].id,
      isTyping: true,
    },
  ]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [sliderValue, setSliderValue] = useState<number>(500);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;

  // 自動スクロール - ボットメッセージが追加されたときのみ実行
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    // 最後のメッセージがボットからのもので、タイピング中の場合のみスクロール
    if (lastMessage?.role === "bot" && lastMessage?.isTyping) {
      // 少し遅延させてからスクロール（タイピングアニメーション開始後）
      const timer = setTimeout(() => {
        chatEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleAnswer = (value: string | number | string[]) => {
    // 回答を保存
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    // ユーザーメッセージを追加
    let userMessage = "";
    if (currentQuestion.type === "single") {
      const option = currentQuestion.options?.find((o) => o.value === value);
      userMessage = option?.label || String(value);
    } else if (currentQuestion.type === "multiple") {
      const selectedLabels = (value as string[])
        .map((v) => currentQuestion.options?.find((o) => o.value === v)?.label)
        .filter(Boolean);
      userMessage = selectedLabels.join(", ");
    } else if (currentQuestion.type === "slider") {
      userMessage = `¥${value.toLocaleString()}/日`;
    }

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    // リセット
    setSelectedOptions([]);
    setSliderValue(500);

    // 次の質問へ
    if (!isLastQuestion) {
      setTimeout(() => {
        const nextQuestion = QUESTIONS[currentQuestionIndex + 1];
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: nextQuestion.text || "",
            questionId: nextQuestion.id,
            isTyping: true,
          },
        ]);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 800);
    } else {
      // 診断完了 - 結果ページへ
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: "診断結果を計算しています...",
            isTyping: true,
          },
        ]);
      }, 500);

      setTimeout(() => {
        const params = new URLSearchParams();

        // ウェルカム質問から健康目標を取得
        const goal = newAnswers.welcome;
        if (goal) {
          params.append("goals", goal);
        }

        // 予算
        const budget = newAnswers.budget || 500;
        params.append("budget", String(budget));

        // 優先度
        const priority = newAnswers.priority || "balanced";
        params.append("priority", priority);

        // 健康状態
        const conditions = newAnswers.healthConditions || [];
        const filteredConditions = Array.isArray(conditions)
          ? conditions.filter((c: string) => c !== "none")
          : [];
        if (filteredConditions.length > 0) {
          params.append("conditions", filteredConditions.join(","));
        }

        router.push("/diagnosis/results?" + params.toString());
      }, 2000);
    }
  };

  const handleSingleSelect = (value: string) => {
    handleAnswer(value);
  };

  const handleMultipleSelect = (value: string) => {
    if (value === "none") {
      setSelectedOptions(["none"]);
      return;
    }

    const newSelected = selectedOptions.includes(value)
      ? selectedOptions.filter((v) => v !== value && v !== "none")
      : [...selectedOptions.filter((v) => v !== "none"), value];

    setSelectedOptions(newSelected);
  };

  const handleMultipleSubmit = () => {
    if (selectedOptions.length === 0) {
      alert("少なくとも1つ選択してください");
      return;
    }
    handleAnswer(selectedOptions);
  };

  const handleSliderSubmit = () => {
    handleAnswer(sliderValue);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* チャット全体コンテナ */}
      <div
        className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-2xl border border-purple-100 flex flex-col"
        style={{ height: "calc(85vh)" }}
      >
        {/* メッセージ表示エリア（スクロール可能） */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {messages.map((message, index) => (
            <MessageWithTyping
              key={index}
              message={message}
              index={index}
              totalMessages={messages.length}
            />
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* 回答エリア（固定位置） */}
        {!answers[currentQuestion.id] && (
          <div className="border-t border-purple-200 bg-white/90 backdrop-blur-sm p-4 sm:p-6">
            <div className="space-y-4">
              {currentQuestion.type === "single" && (
                <div className="space-y-2">
                  {currentQuestion.options?.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleSingleSelect(option.value)}
                        className="group relative overflow-hidden w-full p-4 rounded-xl border-2 border-gray-200 hover:border-transparent text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg bg-white flex items-center gap-3"
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${option.gradient || "from-purple-400 to-pink-600"} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                        />

                        <div className="relative z-10 flex items-center gap-3 w-full">
                          {Icon && (
                            <div
                              className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${option.gradient || "from-purple-400 to-pink-600"} flex items-center justify-center group-hover:bg-white/20 transition-all`}
                            >
                              <Icon
                                className="text-white"
                                size={20}
                                strokeWidth={2.5}
                              />
                            </div>
                          )}

                          <span className="flex-1 font-medium text-gray-900 group-hover:text-white transition-colors">
                            {option.label}
                          </span>

                          <Check
                            className="flex-shrink-0 text-transparent group-hover:text-white transition-colors"
                            size={20}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === "multiple" && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    {currentQuestion.options?.map((option) => {
                      const Icon = option.icon;
                      const isSelected = selectedOptions.includes(option.value);
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleMultipleSelect(option.value)}
                          className={`w-full p-3 rounded-xl border-2 text-left font-medium transition-all duration-300 flex items-center gap-3 ${
                            isSelected
                              ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md"
                              : "border-gray-200 hover:border-purple-300 bg-white"
                          }`}
                        >
                          {Icon && (
                            <div
                              className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                                isSelected
                                  ? "bg-gradient-to-br from-purple-500 to-pink-500"
                                  : "bg-gray-100"
                              }`}
                            >
                              <Icon
                                className={`${isSelected ? "text-white" : "text-gray-600"}`}
                                size={18}
                              />
                            </div>
                          )}

                          <span
                            className={`flex-1 text-sm ${isSelected ? "text-purple-700 font-semibold" : "text-gray-700"}`}
                          >
                            {option.label}
                          </span>

                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? "border-purple-500 bg-purple-500"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <Check size={12} className="text-white" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleMultipleSubmit}
                    disabled={selectedOptions.length === 0}
                    className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 ${
                      selectedOptions.length === 0
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg"
                    }`}
                  >
                    {selectedOptions.length > 0
                      ? `${selectedOptions.length}件選択 - 決定`
                      : "選択してください"}
                  </button>
                </div>
              )}

              {currentQuestion.type === "slider" && (
                <div className="space-y-4">
                  <div className="text-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5">
                    <DollarSign
                      className="mx-auto mb-2 text-purple-600"
                      size={28}
                      strokeWidth={2.5}
                    />
                    <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                      ¥{sliderValue.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      1日あたり
                    </div>
                  </div>

                  <div>
                    <input
                      type="range"
                      min={currentQuestion.min}
                      max={currentQuestion.max}
                      step={currentQuestion.step}
                      value={sliderValue}
                      onChange={(e) => setSliderValue(Number(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, rgb(147 51 234) 0%, rgb(219 39 119) ${((sliderValue - (currentQuestion.min || 0)) / ((currentQuestion.max || 2000) - (currentQuestion.min || 0))) * 100}%, rgb(229 231 235) ${((sliderValue - (currentQuestion.min || 0)) / ((currentQuestion.max || 2000) - (currentQuestion.min || 0))) * 100}%, rgb(229 231 235) 100%)`,
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>¥{currentQuestion.min?.toLocaleString()}</span>
                      <span>¥{currentQuestion.max?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[500, 1000, 1500, 2000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setSliderValue(amount)}
                        className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                          sliderValue === amount
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                            : "bg-white border border-gray-200 text-gray-700"
                        }`}
                      >
                        ¥{amount.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleSliderSubmit}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    決定する
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* プログレスバー - チャット下部に固定 */}
        <div className="border-t border-purple-200 bg-white/95 backdrop-blur-sm rounded-b-2xl p-3 sm:p-4">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span className="flex items-center gap-1">
              <Activity size={14} className="text-purple-600" />
              進捗
            </span>
            <span className="bg-purple-100 px-2 py-0.5 rounded-full text-purple-700 font-semibold text-xs">
              {Object.keys(answers).length}/{QUESTIONS.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${(Object.keys(answers).length / QUESTIONS.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
