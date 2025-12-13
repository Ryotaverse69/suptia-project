"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  User,
  Check,
  Shield,
  Zap,
  Heart,
  Activity,
  Brain,
  DollarSign,
  Target,
  Award,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

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
        icon: Heart,
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
    id: "dietQuality",
    type: "single",
    text: "食生活のバランスはどうですか？",
    options: [
      {
        value: "excellent",
        label: "非常に良い",
        icon: Activity,
        gradient: "from-green-400 to-green-600",
      },
      {
        value: "good",
        label: "まあまあ良い",
        icon: Activity,
        gradient: "from-blue-400 to-blue-600",
      },
      {
        value: "fair",
        label: "普通",
        icon: Activity,
        gradient: "from-yellow-400 to-yellow-600",
      },
      {
        value: "poor",
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
  {
    id: "lifestyle",
    type: "single",
    text: "あなたの生活リズムについて教えてください。",
    options: [
      {
        value: "morning",
        label: "朝型（早寝早起き）",
        icon: Activity,
        gradient: "from-yellow-400 to-orange-600",
      },
      {
        value: "evening",
        label: "夜型（遅寝遅起き）",
        icon: Activity,
        gradient: "from-purple-400 to-indigo-600",
      },
      {
        value: "irregular",
        label: "不規則",
        icon: AlertCircle,
        gradient: "from-gray-400 to-gray-600",
      },
    ],
  },
  {
    id: "alcoholConsumption",
    type: "single",
    text: "飲酒習慣について教えてください。",
    options: [
      {
        value: "none",
        label: "飲まない",
        icon: Shield,
        gradient: "from-green-400 to-emerald-600",
      },
      {
        value: "occasional",
        label: "たまに飲む（週1〜2回）",
        icon: Activity,
        gradient: "from-blue-400 to-cyan-600",
      },
      {
        value: "moderate",
        label: "適度に飲む（週3〜5回）",
        icon: Activity,
        gradient: "from-yellow-400 to-orange-600",
      },
      {
        value: "frequent",
        label: "ほぼ毎日飲む",
        icon: AlertCircle,
        gradient: "from-red-400 to-pink-600",
      },
    ],
  },
  {
    id: "mainConcern",
    type: "single",
    text: "現在、最も気になっていることは何ですか？",
    options: [
      {
        value: "fatigue",
        label: "疲れやすい・だるさ",
        icon: Zap,
        gradient: "from-orange-400 to-red-600",
      },
      {
        value: "sleep",
        label: "睡眠の質が悪い",
        icon: Activity,
        gradient: "from-purple-400 to-indigo-600",
      },
      {
        value: "immunity",
        label: "風邪をひきやすい",
        icon: Shield,
        gradient: "from-green-400 to-emerald-600",
      },
      {
        value: "appearance",
        label: "肌荒れ・美容面",
        icon: Heart,
        gradient: "from-pink-400 to-rose-600",
      },
      {
        value: "weight",
        label: "体重管理",
        icon: Target,
        gradient: "from-blue-400 to-cyan-600",
      },
      {
        value: "concentration",
        label: "集中力・記憶力の低下",
        icon: Brain,
        gradient: "from-purple-400 to-pink-600",
      },
    ],
  },
  {
    id: "currentSupplements",
    type: "multiple",
    text: "現在使用しているサプリメントはありますか？（複数選択可）",
    options: [
      { value: "multivitamin", label: "マルチビタミン", icon: Award },
      { value: "vitamin-c", label: "ビタミンC", icon: Activity },
      { value: "vitamin-d", label: "ビタミンD", icon: Activity },
      { value: "omega-3", label: "オメガ3（DHA/EPA）", icon: Heart },
      { value: "protein", label: "プロテイン", icon: Zap },
      { value: "probiotics", label: "プロバイオティクス", icon: Shield },
      { value: "other", label: "その他", icon: Target },
      { value: "none", label: "使用していない", icon: Check },
    ],
  },
  {
    id: "secondaryGoals",
    type: "multiple",
    text: "主な目標以外に、興味のある健康目標はありますか？（複数選択可）",
    options: [
      {
        value: "immune-boost",
        label: "免疫力強化",
        icon: Shield,
        gradient: "from-green-400 to-emerald-600",
      },
      {
        value: "energy-recovery",
        label: "疲労回復",
        icon: Zap,
        gradient: "from-yellow-400 to-orange-600",
      },
      {
        value: "skin-health",
        label: "美肌・肌の健康",
        icon: Heart,
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
        label: "心臓の健康",
        icon: Heart,
        gradient: "from-red-400 to-pink-600",
      },
      {
        value: "brain-function",
        label: "脳機能・集中力",
        icon: Brain,
        gradient: "from-purple-400 to-indigo-600",
      },
      { value: "none", label: "特になし", icon: Check },
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
    // 日本語対応：文字列を配列に変換してサロゲートペアや結合文字を正しく処理
    const chars = [...text];

    const interval = setInterval(() => {
      if (index < chars.length) {
        index++;
        // prevを使わず、直接slice+joinで文字列を構築
        setDisplayedText(chars.slice(0, index).join(""));
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
  const isLatestBot =
    message.role === "bot" && index === totalMessages - 1 && message.isTyping;
  const { displayedText } = useTypingEffect(
    message.content,
    isLatestBot ? 30 : 0,
  );

  return (
    <div
      className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
    >
      {/* アバター */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
        style={{
          background:
            message.role === "bot"
              ? `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`
              : `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.teal} 100%)`,
        }}
      >
        {message.role === "bot" ? (
          <Bot size={20} className="text-white" />
        ) : (
          <User size={20} className="text-white" />
        )}
      </div>

      {/* メッセージ */}
      <div
        className={`flex-1 max-w-[80%] ${
          message.role === "user" ? "text-right" : ""
        }`}
      >
        <div
          className="inline-block px-4 py-3 rounded-[16px]"
          style={{
            backgroundColor:
              message.role === "bot"
                ? appleWebColors.sectionBackground
                : systemColors.blue,
            color:
              message.role === "bot" ? appleWebColors.textPrimary : "white",
          }}
        >
          <p className="text-[14px] sm:text-[15px] leading-relaxed">
            {isLatestBot ? displayedText : message.content}
            {isLatestBot && (
              <span
                className="inline-block w-0.5 h-4 ml-1 animate-pulse"
                style={{ backgroundColor: systemColors.purple }}
              />
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

        // 診断タイプ
        params.append("type", "detailed");

        // 主な健康目標
        const goal = newAnswers.welcome;
        if (goal) {
          params.append("goals", goal);
        }

        // 副次的な健康目標
        const secondaryGoals = newAnswers.secondaryGoals || [];
        const filteredSecondaryGoals = Array.isArray(secondaryGoals)
          ? secondaryGoals.filter((g: string) => g !== "none")
          : [];
        if (filteredSecondaryGoals.length > 0) {
          params.append("secondaryGoals", filteredSecondaryGoals.join(","));
        }

        // 年齢層
        if (newAnswers.ageGroup) {
          params.append("ageGroup", newAnswers.ageGroup);
        }

        // 生活リズム
        if (newAnswers.lifestyle) {
          params.append("lifestyle", newAnswers.lifestyle);
        }

        // 運動習慣
        if (newAnswers.exerciseFrequency) {
          params.append("exerciseFrequency", newAnswers.exerciseFrequency);
        }

        // ストレスレベル
        if (newAnswers.stressLevel) {
          params.append("stressLevel", newAnswers.stressLevel);
        }

        // 睡眠の質
        if (newAnswers.sleepQuality) {
          params.append("sleepQuality", newAnswers.sleepQuality);
        }

        // 食事の質
        if (newAnswers.dietQuality) {
          params.append("dietQuality", newAnswers.dietQuality);
        }

        // 飲酒習慣
        if (newAnswers.alcoholConsumption) {
          params.append("alcoholConsumption", newAnswers.alcoholConsumption);
        }

        // 主な悩み
        if (newAnswers.mainConcern) {
          params.append("mainConcern", newAnswers.mainConcern);
        }

        // サプリ使用経験
        if (newAnswers.supplementExperience) {
          params.append(
            "supplementExperience",
            newAnswers.supplementExperience,
          );
        }

        // 現在使用中のサプリ
        const currentSupplements = newAnswers.currentSupplements || [];
        const filteredCurrentSupplements = Array.isArray(currentSupplements)
          ? currentSupplements.filter((s: string) => s !== "none")
          : [];
        if (filteredCurrentSupplements.length > 0) {
          params.append(
            "currentSupplements",
            filteredCurrentSupplements.join(","),
          );
        }

        // 健康状態
        const conditions = newAnswers.healthConditions || [];
        const filteredConditions = Array.isArray(conditions)
          ? conditions.filter((c: string) => c !== "none")
          : [];
        if (filteredConditions.length > 0) {
          params.append("conditions", filteredConditions.join(","));
        }

        // 優先度
        const priority = newAnswers.priority || "balanced";
        params.append("priority", priority);

        // 予算
        const budget = newAnswers.budget || 500;
        params.append("budget", String(budget));

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
    <div className="max-w-4xl mx-auto" style={{ fontFamily: fontStack }}>
      {/* チャット全体コンテナ */}
      <div
        className={`${liquidGlassClasses.light} flex flex-col`}
        style={{
          height: "calc(100dvh - 200px)",
          minHeight: "500px",
          maxHeight: "780px",
        }}
      >
        {/* メッセージ表示エリア（スクロール可能） */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
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

        {/* 回答エリア（固定位置・スクロール可能） */}
        {!answers[currentQuestion.id] && (
          <div
            className="border-t border-white/80 p-4 max-h-[50vh] overflow-y-auto"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <div className="space-y-3">
              {currentQuestion.type === "single" && (
                <div className="space-y-2">
                  {currentQuestion.options?.map((option) => {
                    const Icon = option.icon;
                    const gradientMap: Record<string, string> = {
                      "from-green-400 to-emerald-600": `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
                      "from-yellow-400 to-orange-600": `linear-gradient(135deg, ${systemColors.yellow} 0%, ${systemColors.orange} 100%)`,
                      "from-pink-400 to-rose-600": `linear-gradient(135deg, ${systemColors.pink} 0%, ${systemColors.red} 100%)`,
                      "from-blue-400 to-cyan-600": `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.teal} 100%)`,
                      "from-blue-400 to-blue-600": `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.indigo} 100%)`,
                      "from-cyan-400 to-cyan-600": `linear-gradient(135deg, ${systemColors.teal} 0%, ${systemColors.blue} 100%)`,
                      "from-teal-400 to-teal-600": `linear-gradient(135deg, ${systemColors.teal} 0%, ${systemColors.green} 100%)`,
                      "from-emerald-400 to-emerald-600": `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
                      "from-green-400 to-green-600": `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
                      "from-red-400 to-pink-600": `linear-gradient(135deg, ${systemColors.red} 0%, ${systemColors.pink} 100%)`,
                      "from-purple-400 to-indigo-600": `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.indigo} 100%)`,
                      "from-purple-400 to-purple-600": `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.indigo} 100%)`,
                      "from-orange-400 to-red-600": `linear-gradient(135deg, ${systemColors.orange} 0%, ${systemColors.red} 100%)`,
                      "from-purple-400 to-pink-600": `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
                      "from-blue-500 to-blue-700": `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.indigo} 100%)`,
                      "from-green-500 to-green-700": `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
                      "from-yellow-500 to-yellow-700": `linear-gradient(135deg, ${systemColors.yellow} 0%, ${systemColors.orange} 100%)`,
                      "from-purple-500 to-purple-700": `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.indigo} 100%)`,
                      "from-indigo-500 to-indigo-700": `linear-gradient(135deg, ${systemColors.indigo} 0%, ${systemColors.purple} 100%)`,
                      "from-gray-400 to-gray-600": `linear-gradient(135deg, ${systemColors.gray[2]} 0%, ${systemColors.gray[3]} 100%)`,
                    };
                    const gradient = option.gradient
                      ? gradientMap[option.gradient] ||
                        `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.indigo} 100%)`
                      : `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`;

                    return (
                      <button
                        key={option.value}
                        onClick={() => handleSingleSelect(option.value)}
                        className="group w-full p-3 rounded-xl border text-left transition-all duration-200 flex items-center gap-3 min-h-[52px]"
                        style={{
                          borderColor: appleWebColors.borderSubtle,
                          backgroundColor: "white",
                        }}
                      >
                        {Icon && (
                          <div
                            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: gradient }}
                          >
                            <Icon className="text-white" size={18} />
                          </div>
                        )}

                        <span
                          className="flex-1 text-[14px] font-medium"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          {option.label}
                        </span>

                        <Check
                          size={16}
                          style={{ color: appleWebColors.textTertiary }}
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
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
                          className="w-full p-3 rounded-xl border text-left transition-all duration-200 flex items-center gap-3 min-h-[48px]"
                          style={{
                            borderColor: isSelected
                              ? systemColors.purple
                              : appleWebColors.borderSubtle,
                            backgroundColor: isSelected
                              ? `${systemColors.purple}10`
                              : "white",
                          }}
                        >
                          {Icon && (
                            <div
                              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{
                                backgroundColor: isSelected
                                  ? systemColors.purple
                                  : appleWebColors.sectionBackground,
                              }}
                            >
                              <Icon
                                size={16}
                                style={{
                                  color: isSelected
                                    ? "white"
                                    : appleWebColors.textTertiary,
                                }}
                              />
                            </div>
                          )}

                          <span
                            className="flex-1 text-[13px] sm:text-[14px]"
                            style={{
                              color: isSelected
                                ? systemColors.purple
                                : appleWebColors.textPrimary,
                              fontWeight: isSelected ? 600 : 500,
                            }}
                          >
                            {option.label}
                          </span>

                          <div
                            className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center border-2"
                            style={{
                              borderColor: isSelected
                                ? systemColors.purple
                                : appleWebColors.borderSubtle,
                              backgroundColor: isSelected
                                ? systemColors.purple
                                : "transparent",
                            }}
                          >
                            {isSelected && (
                              <Check
                                size={12}
                                className="text-white"
                                strokeWidth={3}
                              />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleMultipleSubmit}
                    disabled={selectedOptions.length === 0}
                    className="w-full py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 min-h-[48px]"
                    style={{
                      background:
                        selectedOptions.length === 0
                          ? appleWebColors.sectionBackground
                          : `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
                      color:
                        selectedOptions.length === 0
                          ? appleWebColors.textTertiary
                          : "white",
                      cursor:
                        selectedOptions.length === 0
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {selectedOptions.length > 0
                      ? `${selectedOptions.length}件選択 - 決定`
                      : "選択してください"}
                  </button>
                </div>
              )}

              {currentQuestion.type === "slider" && (
                <div className="space-y-4">
                  <div
                    className="text-center rounded-[16px] p-5"
                    style={{
                      background: `linear-gradient(135deg, ${systemColors.purple}15 0%, ${systemColors.pink}15 100%)`,
                    }}
                  >
                    <DollarSign
                      className="mx-auto mb-2"
                      size={28}
                      strokeWidth={2.5}
                      style={{ color: systemColors.purple }}
                    />
                    <div
                      className="text-[34px] sm:text-[40px] font-bold mb-1"
                      style={{
                        color: systemColors.purple,
                      }}
                    >
                      ¥{sliderValue.toLocaleString()}
                    </div>
                    <div
                      className="text-[12px] font-medium"
                      style={{ color: appleWebColors.textSecondary }}
                    >
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
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${systemColors.purple} 0%, ${systemColors.pink} ${((sliderValue - (currentQuestion.min || 0)) / ((currentQuestion.max || 2000) - (currentQuestion.min || 0))) * 100}%, ${appleWebColors.sectionBackground} ${((sliderValue - (currentQuestion.min || 0)) / ((currentQuestion.max || 2000) - (currentQuestion.min || 0))) * 100}%, ${appleWebColors.sectionBackground} 100%)`,
                      }}
                    />
                    <div
                      className="flex justify-between text-[11px] mt-1"
                      style={{ color: appleWebColors.textTertiary }}
                    >
                      <span>¥{currentQuestion.min?.toLocaleString()}</span>
                      <span>¥{currentQuestion.max?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[500, 1000, 1500, 2000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setSliderValue(amount)}
                        className="py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 min-h-[36px]"
                        style={{
                          background:
                            sliderValue === amount
                              ? `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`
                              : "white",
                          color:
                            sliderValue === amount
                              ? "white"
                              : appleWebColors.textSecondary,
                          border:
                            sliderValue === amount
                              ? "none"
                              : `1px solid ${appleWebColors.borderSubtle}`,
                          boxShadow:
                            sliderValue === amount
                              ? "0 4px 12px rgba(0, 0, 0, 0.15)"
                              : "none",
                        }}
                      >
                        ¥{amount.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleSliderSubmit}
                    className="w-full py-3 rounded-xl text-[15px] font-semibold transition-all duration-200 min-h-[48px]"
                    style={{
                      background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
                      color: "white",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    決定する
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* プログレスバー - チャット下部に固定 */}
        <div
          className="rounded-b-[24px] p-3 sm:p-4 border-t border-white/80"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            className="flex items-center justify-between text-[12px] mb-1.5"
            style={{ color: appleWebColors.textSecondary }}
          >
            <span className="flex items-center gap-1.5">
              <Activity size={14} style={{ color: systemColors.purple }} />
              進捗
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
              style={{
                backgroundColor: `${systemColors.purple}15`,
                color: systemColors.purple,
              }}
            >
              {Object.keys(answers).length}/{QUESTIONS.length}
            </span>
          </div>
          <div
            className="w-full rounded-full h-2 overflow-hidden"
            style={{ backgroundColor: appleWebColors.sectionBackground }}
          >
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${(Object.keys(answers).length / QUESTIONS.length) * 100}%`,
                background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
