/**
 * AIコンシェルジュ メインチャットUI
 *
 * v2.2.0 - Apple HIG準拠デザイン
 *
 * 設計原則:
 * 1. 断定しない - AIは判断者ではなく翻訳者
 * 2. 理由を説明する - 推薦には必ず根拠を提示
 * 3. 重み付けを見せる - ユーザーが選んでいる感覚を作る
 */

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  History,
  X,
  AlertCircle,
  ChevronLeft,
  MessageCircle,
  Sparkles,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  systemColors,
  appleWebColors,
  liquidGlassClasses,
} from "@/lib/design-system";
import { useConcierge } from "@/contexts/ConciergeContext";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { CharacterSelector } from "./CharacterSelector";
import { UsageBadge } from "./UsageBadge";
import { CHARACTERS } from "@/lib/concierge/characters";
import { useCharacterAvatars } from "@/lib/concierge/useCharacterAvatars";

interface ChatUIProps {
  className?: string;
}

export function ChatUI({ className }: ChatUIProps) {
  const {
    currentSession,
    sessions,
    isLoadingSessions,
    messages,
    isLoading,
    error,
    usage,
    userPlan,
    characterId,
    sendMessage,
    setCharacterId,
    submitFeedback,
    clearError,
    stopGeneration,
    createSession,
    loadSession,
    deleteSession,
  } = useConcierge();

  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);
  const { getAvatarUrl } = useCharacterAvatars();
  const avatarUrl = getAvatarUrl(characterId);

  // 新しいメッセージが追加されたらスクロール
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    const prevCount = prevMessageCountRef.current;
    prevMessageCountRef.current = messages.length;

    // メッセージが増えていない場合は何もしない
    if (messages.length <= prevCount) return;

    // ユーザーメッセージの場合は末尾にスクロール
    if (lastMessage.role === "user") {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    } else if (lastMessage.role === "assistant") {
      // AIの回答が来た場合：AIの回答（コンシェルジュ名）が先頭に見える位置にスクロール
      setTimeout(() => {
        const messageElements = container.querySelectorAll(
          '[data-message-role="assistant"]',
        );
        if (messageElements.length >= 1) {
          const assistantElement = messageElements[
            messageElements.length - 1
          ] as HTMLElement;
          if (assistantElement) {
            // 親コンテナからの相対位置を計算
            const containerRect = container.getBoundingClientRect();
            const elementRect = assistantElement.getBoundingClientRect();
            // コンシェルジュ名が見えるよう上部に余白を確保
            const topPadding = 16;
            const scrollTop =
              container.scrollTop +
              (elementRect.top - containerRect.top) -
              topPadding;

            container.scrollTo({
              top: Math.max(0, scrollTop),
              behavior: "smooth",
            });
          }
        }
      }, 200);
    }
  }, [messages]);

  const character = CHARACTERS[characterId];

  return (
    <div
      className={cn("h-screen flex flex-col overflow-hidden", className)}
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif',
      }}
    >
      {/* ヘッダー - すりガラス効果 */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl border-b"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.72)",
          borderColor: appleWebColors.borderSubtle,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 左: 戻るボタン + タイトル + キャラクター選択 */}
            <div className="flex items-center gap-2">
              <Link
                href="/mypage"
                className="flex items-center justify-center w-9 h-9 rounded-full transition-colors hover:bg-black/5"
              >
                <ChevronLeft size={22} style={{ color: systemColors.blue }} />
              </Link>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
                }}
              >
                <MessageCircle size={18} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1
                  className="text-[15px] font-semibold leading-tight"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  AIコンシェルジュ
                </h1>
              </div>
              {/* キャラクター選択チップ */}
              <CharacterSelector
                selectedCharacterId={characterId}
                onSelect={setCharacterId}
                userPlan={userPlan}
                disabled={isLoading}
                compact
              />
            </div>

            {/* 右: 利用状況 + 履歴ボタン */}
            <div className="flex items-center gap-2">
              <UsageBadge
                remaining={usage?.remaining ?? null}
                limit={usage?.limit ?? null}
                plan={userPlan}
              />
              <button
                onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                  showHistoryPanel ? "bg-black/10" : "hover:bg-black/5",
                )}
                title="履歴"
              >
                <History size={20} style={{ color: systemColors.blue }} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full min-h-0 overflow-hidden">
        {/* エラー表示 */}
        {error && (
          <div className="mx-4 mt-4">
            <div
              className={`p-4 rounded-2xl ${liquidGlassClasses.light}`}
              style={{
                backgroundColor: `${systemColors.red}10`,
                border: `1px solid ${systemColors.red}30`,
              }}
            >
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={20}
                  style={{ color: systemColors.red }}
                  className="flex-shrink-0 mt-0.5"
                />
                <div className="flex-1">
                  <p
                    className="text-[14px]"
                    style={{ color: systemColors.red }}
                  >
                    {error}
                  </p>
                </div>
                <button
                  onClick={clearError}
                  className="p-1 rounded-full hover:bg-black/5 transition-colors"
                >
                  <X size={16} style={{ color: systemColors.red }} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* メッセージエリア */}
        <div
          ref={messagesContainerRef}
          className="flex-1 min-h-0 overflow-y-auto"
        >
          {messages.length === 0 ? (
            <WelcomeScreen
              character={character}
              onQuestionClick={sendMessage}
            />
          ) : (
            <div className="py-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} data-message-role={message.role}>
                  <ChatMessage
                    message={message}
                    onFeedback={submitFeedback}
                    showFeedback={message.role === "assistant"}
                    characterName={character.name}
                    characterId={characterId}
                  />
                </div>
              ))}

              {/* ローディング表示 */}
              {isLoading && (
                <div className="px-4">
                  <div
                    className={`p-4 rounded-2xl ${liquidGlassClasses.light}`}
                    style={{
                      backgroundColor: appleWebColors.sectionBackground,
                      maxWidth: "85%",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden"
                        style={{
                          background: avatarUrl
                            ? undefined
                            : `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
                        }}
                      >
                        {avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt={character.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-[12px] font-semibold">
                            {character.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1.5">
                        <div
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{
                            backgroundColor: systemColors.gray[4],
                          }}
                        />
                        <div
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{
                            backgroundColor: systemColors.gray[4],
                            animationDelay: "0.15s",
                          }}
                        />
                        <div
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{
                            backgroundColor: systemColors.gray[4],
                            animationDelay: "0.3s",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 入力エリア */}
        <ChatInput
          onSend={sendMessage}
          onStop={stopGeneration}
          disabled={usage?.remaining === 0}
          isGenerating={isLoading}
          placeholder={
            usage?.remaining === 0
              ? "本日の質問回数上限に達しました"
              : `${character.name}に質問してみましょう...`
          }
        />
      </main>

      {/* 免責事項フッター */}
      <footer className="py-4 px-4">
        <div
          className="max-w-4xl mx-auto text-center space-y-1"
          style={{ color: appleWebColors.textTertiary }}
        >
          <p className="text-[11px]">
            AIの回答は参考情報であり、医療・健康上のアドバイスではありません。
          </p>
          <p className="text-[11px]">
            持病がある方、妊娠中・授乳中の方は、サプリメント摂取前に医師・薬剤師にご相談ください。
          </p>
          <p className="text-[11px] mt-2">© 2024 Suptia</p>
        </div>
      </footer>

      {/* 履歴パネル（右からスライドイン） */}
      <HistoryPanel
        isOpen={showHistoryPanel}
        onClose={() => setShowHistoryPanel(false)}
        sessions={sessions}
        currentSessionId={currentSession?.id}
        isLoading={isLoadingSessions}
        onSelectSession={async (sessionId) => {
          await loadSession(sessionId);
          setShowHistoryPanel(false);
        }}
        onDeleteSession={deleteSession}
        onNewSession={async () => {
          await createSession();
          setShowHistoryPanel(false);
        }}
        userPlan={userPlan}
      />
    </div>
  );
}

/**
 * ウェルカムスクリーン
 */
function WelcomeScreen({
  character,
  onQuestionClick,
}: {
  character: (typeof CHARACTERS)[keyof typeof CHARACTERS];
  onQuestionClick: (message: string) => Promise<boolean>;
}) {
  const handleQuestionClick = async (question: string) => {
    await onQuestionClick(question);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      {/* キャラクターアバター */}
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
        }}
      >
        <Sparkles size={40} className="text-white" />
      </div>

      <h2
        className="text-[22px] font-bold mb-2"
        style={{ color: appleWebColors.textPrimary }}
      >
        {character.greeting}
      </h2>

      <p
        className="text-[15px] max-w-md mb-8"
        style={{ color: appleWebColors.textSecondary }}
      >
        {character.recommendationStyleLabel}
      </p>

      {/* 質問例 */}
      <div className="w-full max-w-md space-y-3">
        <p
          className="text-[13px] mb-3"
          style={{ color: appleWebColors.textTertiary }}
        >
          質問例をタップして始めましょう
        </p>
        {EXAMPLE_QUESTIONS.map((question, index) => (
          <button
            key={index}
            onClick={() => handleQuestionClick(question)}
            className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-200 ${liquidGlassClasses.light} hover:scale-[1.02] active:scale-[0.98]`}
            style={{
              backgroundColor: appleWebColors.sectionBackground,
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <span
              className="text-[15px]"
              style={{ color: appleWebColors.textPrimary }}
            >
              {question}
            </span>
          </button>
        ))}
      </div>

      {/* 注意書き */}
      <p
        className="mt-10 text-[12px] max-w-md leading-relaxed"
        style={{ color: appleWebColors.textTertiary }}
      >
        AIの回答は参考情報です。サプリメントの効果には個人差があります。
        重要な判断は専門家にご相談ください。
      </p>
    </div>
  );
}

const EXAMPLE_QUESTIONS = [
  "ビタミンDのサプリでコスパが良いのはどれ？",
  "マルチビタミンを選ぶときのポイントは？",
  "オメガ3とフィッシュオイルの違いは？",
];

/**
 * 履歴パネル（右からスライドイン）
 */
interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: {
    id: string;
    title: string | null;
    characterId: string;
    messageCount: number;
    updatedAt: string;
  }[];
  currentSessionId?: string;
  isLoading: boolean;
  onSelectSession: (sessionId: string) => Promise<void>;
  onDeleteSession: (sessionId: string) => Promise<boolean>;
  onNewSession: () => Promise<void>;
  userPlan: string;
}

function HistoryPanel({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  isLoading,
  onSelectSession,
  onDeleteSession,
  onNewSession,
  userPlan,
}: HistoryPanelProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setDeletingId(sessionId);
    await onDeleteSession(sessionId);
    setDeletingId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "今日";
    } else if (diffDays === 1) {
      return "昨日";
    } else if (diffDays < 7) {
      return `${diffDays}日前`;
    } else {
      return date.toLocaleDateString("ja-JP", {
        month: "short",
        day: "numeric",
      });
    }
  };

  // ゲストは履歴なし
  if (userPlan === "guest") {
    return (
      <>
        {/* オーバーレイ */}
        <div
          className={cn(
            "fixed inset-0 bg-black/30 z-50 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
          onClick={onClose}
        />

        {/* パネル */}
        <div
          className={cn(
            "fixed top-0 right-0 bottom-0 w-80 max-w-full z-50 transition-transform duration-300 ease-out",
            isOpen ? "translate-x-0" : "translate-x-full",
          )}
          style={{
            backgroundColor: appleWebColors.pageBackground,
          }}
        >
          <div className="h-full flex flex-col">
            {/* ヘッダー */}
            <div
              className="px-4 py-4 border-b flex items-center justify-between"
              style={{ borderColor: appleWebColors.borderSubtle }}
            >
              <h2
                className="text-[17px] font-semibold"
                style={{ color: appleWebColors.textPrimary }}
              >
                会話履歴
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
              >
                <X size={18} style={{ color: appleWebColors.textSecondary }} />
              </button>
            </div>

            {/* ログイン促進 */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <History
                size={48}
                style={{ color: appleWebColors.textTertiary }}
                className="mb-4"
              />
              <p
                className="text-[15px] font-medium mb-2"
                style={{ color: appleWebColors.textPrimary }}
              >
                ログインで履歴を保存
              </p>
              <p
                className="text-[13px] mb-6"
                style={{ color: appleWebColors.textSecondary }}
              >
                過去の会話を振り返ったり、
                <br />
                続きから再開できます
              </p>
              <Link
                href="/auth/login"
                className="px-6 py-2.5 rounded-full text-[15px] font-medium text-white transition-transform active:scale-95"
                style={{ backgroundColor: systemColors.blue }}
              >
                ログイン
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* オーバーレイ */}
      <div
        className={cn(
          "fixed inset-0 bg-black/30 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* パネル */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 w-80 max-w-full z-50 transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        style={{
          backgroundColor: appleWebColors.pageBackground,
        }}
      >
        <div className="h-full flex flex-col">
          {/* ヘッダー */}
          <div
            className="px-4 py-4 border-b flex items-center justify-between"
            style={{ borderColor: appleWebColors.borderSubtle }}
          >
            <h2
              className="text-[17px] font-semibold"
              style={{ color: appleWebColors.textPrimary }}
            >
              会話履歴
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
            >
              <X size={18} style={{ color: appleWebColors.textSecondary }} />
            </button>
          </div>

          {/* 新規会話ボタン */}
          <div className="px-4 py-3">
            <button
              onClick={onNewSession}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[15px] font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: systemColors.blue }}
            >
              <Plus size={18} />
              新しい会話
            </button>
          </div>

          {/* セッション一覧 */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div
                  className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: `${systemColors.blue} transparent` }}
                />
              </div>
            ) : sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <MessageCircle
                  size={40}
                  style={{ color: appleWebColors.textTertiary }}
                  className="mb-3"
                />
                <p
                  className="text-[14px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  まだ会話履歴がありません
                </p>
              </div>
            ) : (
              <div className="px-2 py-2 space-y-1">
                {sessions.map((session) => {
                  const isActive = session.id === currentSessionId;
                  const characterName =
                    CHARACTERS[session.characterId as keyof typeof CHARACTERS]
                      ?.name || "ナビ";

                  return (
                    <button
                      key={session.id}
                      onClick={() => onSelectSession(session.id)}
                      disabled={deletingId === session.id}
                      className={cn(
                        "w-full text-left px-3 py-3 rounded-xl transition-all",
                        "hover:bg-black/5 active:scale-[0.98]",
                        isActive && "bg-black/5",
                        deletingId === session.id && "opacity-50",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-[14px] font-medium truncate"
                            style={{ color: appleWebColors.textPrimary }}
                          >
                            {session.title || "新しい会話"}
                          </p>
                          <p
                            className="text-[12px] mt-0.5"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            {characterName} · {formatDate(session.updatedAt)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDelete(e, session.id)}
                          disabled={deletingId === session.id}
                          className="p-1.5 rounded-lg hover:bg-black/10 transition-colors opacity-0 group-hover:opacity-100"
                          style={{ opacity: isActive ? 1 : undefined }}
                        >
                          <Trash2
                            size={14}
                            style={{ color: systemColors.red }}
                          />
                        </button>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* プラン情報 */}
          <div
            className="px-4 py-3 border-t"
            style={{ borderColor: appleWebColors.borderSubtle }}
          >
            <p
              className="text-[11px] text-center"
              style={{ color: appleWebColors.textTertiary }}
            >
              {userPlan === "free"
                ? "無料プラン: 3日間保存"
                : userPlan === "pro"
                  ? "Proプラン: 30日間保存"
                  : "Pro+Safety: 無制限保存"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
