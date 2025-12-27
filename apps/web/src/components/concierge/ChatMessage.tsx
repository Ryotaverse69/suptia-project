/**
 * AIコンシェルジュ メッセージコンポーネント
 *
 * v2.2.0 - Apple HIG準拠デザイン
 *
 * 設計原則:
 * - 断定しない表現の視覚化
 * - 推薦理由の可視化
 * - フィードバック機能
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ThumbsUp,
  ThumbsDown,
  Loader2,
  Check,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Beaker,
  Zap,
  FlaskConical,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  systemColors,
  appleWebColors,
  liquidGlassClasses,
} from "@/lib/design-system";
import type {
  ChatMessage as ChatMessageType,
  PillarsData,
  CharacterId,
} from "@/lib/concierge/types";
import { useCharacterAvatars } from "@/lib/concierge/useCharacterAvatars";

interface ChatMessageProps {
  message: ChatMessageType;
  onFeedback?: (
    messageId: string,
    feedback: "helpful" | "not_helpful",
  ) => Promise<void | boolean>;
  showFeedback?: boolean;
  characterName?: string;
  characterId?: CharacterId;
}

export function ChatMessage({
  message,
  onFeedback,
  showFeedback = true,
  characterName = "AI",
  characterId = "navi",
}: ChatMessageProps) {
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<
    "helpful" | "not_helpful" | null
  >(message.metadata?.userFeedback || null);
  const [showPillars, setShowPillars] = useState(false);
  const { getAvatarUrl } = useCharacterAvatars();
  const avatarUrl = getAvatarUrl(characterId);

  // 推薦理由の5つの柱データ（メタデータから取得）
  const pillarsData = message.metadata?.pillars as PillarsData | undefined;
  const hasPillars = pillarsData && Object.keys(pillarsData).length > 0;

  const isUser = message.role === "user";

  const handleFeedback = async (feedback: "helpful" | "not_helpful") => {
    if (!onFeedback || feedbackGiven) return;

    setFeedbackLoading(true);
    try {
      await onFeedback(message.id, feedback);
      setFeedbackGiven(feedback);
    } catch (error) {
      console.error("Feedback error:", error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <div
      className={cn("px-4", isUser ? "flex justify-end" : "flex justify-start")}
    >
      {isUser ? (
        // ユーザーメッセージ
        <div className="max-w-[85%]">
          <div
            className="rounded-2xl px-4 py-3"
            style={{
              backgroundColor: systemColors.blue,
            }}
          >
            <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-white">
              {message.content}
            </div>
          </div>
          {/* タイムスタンプ */}
          <div className="mt-1 px-1 text-right">
            <span
              className="text-[11px]"
              style={{ color: appleWebColors.textTertiary }}
            >
              {new Date(message.createdAt).toLocaleTimeString("ja-JP", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      ) : (
        // アシスタントメッセージ（アバターを左外側に配置）
        <div className="flex gap-3 max-w-[85%]">
          {/* 大きなアバター（左側固定） */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden shadow-md flex-shrink-0"
            style={{
              background: avatarUrl
                ? undefined
                : `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
            }}
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={characterName}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-lg font-semibold">
                {characterName.charAt(0)}
              </span>
            )}
          </div>

          {/* メッセージコンテンツ */}
          <div className="flex-1 min-w-0 space-y-1">
            {/* キャラクター名 */}
            <span
              className="text-[13px] font-medium px-1"
              style={{ color: appleWebColors.textSecondary }}
            >
              {characterName}
            </span>

            {/* メッセージ本文 */}
            <div
              className={`rounded-2xl px-4 py-3 ${liquidGlassClasses.light}`}
              style={{
                backgroundColor: appleWebColors.sectionBackground,
                border: `1px solid ${appleWebColors.borderSubtle}`,
              }}
            >
              <div
                className="whitespace-pre-wrap text-[15px] leading-relaxed"
                style={{ color: appleWebColors.textPrimary }}
              >
                {message.content}
              </div>

              {/* 5つの柱の推薦理由（折りたたみ可能） */}
              {hasPillars && (
                <div
                  className="mt-4 pt-4 border-t"
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <button
                    onClick={() => setShowPillars(!showPillars)}
                    className="flex items-center gap-2 w-full text-left group"
                  >
                    <span
                      className="text-[13px] font-medium"
                      style={{ color: systemColors.blue }}
                    >
                      推薦理由を見る
                    </span>
                    {showPillars ? (
                      <ChevronUp
                        size={14}
                        style={{ color: systemColors.blue }}
                      />
                    ) : (
                      <ChevronDown
                        size={14}
                        style={{ color: systemColors.blue }}
                      />
                    )}
                  </button>

                  {showPillars && (
                    <div className="mt-3 space-y-2.5">
                      <PillarBar
                        icon={<DollarSign size={14} />}
                        label="価格"
                        score={pillarsData.price?.score ?? 0}
                        description={pillarsData.price?.label ?? ""}
                        color={systemColors.green}
                      />
                      <PillarBar
                        icon={<Beaker size={14} />}
                        label="成分量"
                        score={pillarsData.amount?.score ?? 0}
                        description={pillarsData.amount?.label ?? ""}
                        color={systemColors.cyan}
                      />
                      <PillarBar
                        icon={<Zap size={14} />}
                        label="コスパ"
                        score={pillarsData.costPerformance?.score ?? 0}
                        description={pillarsData.costPerformance?.label ?? ""}
                        color={systemColors.yellow}
                      />
                      <PillarBar
                        icon={<FlaskConical size={14} />}
                        label="エビデンス"
                        score={pillarsData.evidence?.score ?? 0}
                        description={pillarsData.evidence?.label ?? ""}
                        color={systemColors.blue}
                      />
                      <PillarBar
                        icon={<Shield size={14} />}
                        label="安全性"
                        score={pillarsData.safety?.score ?? 0}
                        description={pillarsData.safety?.label ?? ""}
                        color={systemColors.purple}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* フィードバックボタン */}
            {showFeedback && onFeedback && (
              <div className="flex items-center gap-1 px-1">
                {feedbackLoading ? (
                  <div className="flex items-center gap-2 py-1">
                    <Loader2
                      size={14}
                      className="animate-spin"
                      style={{ color: appleWebColors.textTertiary }}
                    />
                  </div>
                ) : feedbackGiven ? (
                  <div
                    className="flex items-center gap-1.5 py-1"
                    style={{ color: systemColors.green }}
                  >
                    <Check size={14} />
                    <span className="text-[12px] font-medium">
                      {feedbackGiven === "helpful"
                        ? "ありがとうございます"
                        : "改善に役立てます"}
                    </span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleFeedback("helpful")}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all",
                        "hover:bg-black/5 active:scale-95",
                      )}
                      title="役に立った"
                    >
                      <ThumbsUp
                        size={14}
                        style={{ color: appleWebColors.textTertiary }}
                      />
                      <span
                        className="text-[12px]"
                        style={{ color: appleWebColors.textTertiary }}
                      >
                        役立った
                      </span>
                    </button>
                    <button
                      onClick={() => handleFeedback("not_helpful")}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all",
                        "hover:bg-black/5 active:scale-95",
                      )}
                      title="改善が必要"
                    >
                      <ThumbsDown
                        size={14}
                        style={{ color: appleWebColors.textTertiary }}
                      />
                      <span
                        className="text-[12px]"
                        style={{ color: appleWebColors.textTertiary }}
                      >
                        改善希望
                      </span>
                    </button>
                  </>
                )}
              </div>
            )}

            {/* タイムスタンプ */}
            <div className="mt-1 px-1 text-left">
              <span
                className="text-[11px]"
                style={{ color: appleWebColors.textTertiary }}
              >
                {new Date(message.createdAt).toLocaleTimeString("ja-JP", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 5つの柱のスコアバー
 */
function PillarBar({
  icon,
  label,
  score,
  description,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  score: number; // 0-100
  description: string;
  color: string;
}) {
  // スコアをランク（S/A/B/C/D）に変換
  const getRank = (s: number): string => {
    if (s >= 90) return "S";
    if (s >= 75) return "A";
    if (s >= 60) return "B";
    if (s >= 40) return "C";
    return "D";
  };

  const rank = getRank(score);

  return (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span
            className="text-[12px] font-medium"
            style={{ color: appleWebColors.textPrimary }}
          >
            {label}
          </span>
          <span
            className="text-[11px] font-semibold px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: `${color}15`,
              color,
            }}
          >
            {rank}
          </span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: `${color}20` }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${score}%`,
              backgroundColor: color,
            }}
          />
        </div>
        {description && (
          <p
            className="text-[11px] mt-1 truncate"
            style={{ color: appleWebColors.textTertiary }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
