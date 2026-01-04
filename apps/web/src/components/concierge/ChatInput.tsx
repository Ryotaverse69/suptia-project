/**
 * AIコンシェルジュ 入力コンポーネント
 *
 * v2.3.0 - Apple Intelligence風デザイン
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  systemColors,
  appleWebColors,
  liquidGlassClasses,
} from "@/lib/design-system";

interface ChatInputProps {
  onSend: (message: string) => Promise<void | boolean>;
  onStop?: () => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  isGenerating?: boolean;
  initialValue?: string;
}

export function ChatInput({
  onSend,
  onStop,
  disabled = false,
  placeholder = "サプリメントについて質問してください...",
  maxLength = 2000,
  isGenerating = false,
  initialValue = "",
}: ChatInputProps) {
  const [message, setMessage] = useState(initialValue);
  const [isComposing, setIsComposing] = useState(false); // IME変換中フラグ
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // テキストエリアの高さを自動調整
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled || isGenerating) return;

    try {
      await onSend(trimmedMessage);
      setMessage("");
      // 高さをリセット
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Send error:", error);
    }
  };

  const handleStop = () => {
    if (onStop) {
      onStop();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // IME変換中はEnterで送信しない
    // 複数の方法でIME変換中を検出:
    // 1. isComposingステート
    // 2. nativeEvent.isComposing
    // 3. keyCode === 229 (IME入力中のキーコード)
    if (isComposing || e.nativeEvent.isComposing || e.keyCode === 229) {
      return;
    }

    // Enterで送信（Shift+Enterで改行）
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const remainingChars = maxLength - message.length;
  const isNearLimit = remainingChars < 200;
  const isOverLimit = remainingChars < 0;
  const canSend =
    !disabled && !isGenerating && !isOverLimit && message.trim().length > 0;
  const showStopButton = isGenerating;

  return (
    <div
      className="sticky bottom-0 backdrop-blur-xl border-t"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        borderColor: appleWebColors.borderSubtle,
      }}
    >
      <form onSubmit={handleSubmit} className="px-4 py-3">
        {/* Apple Intelligence風 虹色ボーダーラッパー */}
        <div
          className={cn(
            "relative rounded-2xl rainbow-wrapper",
            isFocused ? "rainbow-active" : "",
          )}
        >
          {/* 内側のコンテナ */}
          <div
            className={cn(
              "flex items-end gap-3 p-3 rounded-2xl",
              liquidGlassClasses.light,
              "inner-container",
              isFocused ? "inner-focused" : "",
            )}
          >
            {/* テキストエリア */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                disabled={disabled || showStopButton}
                rows={1}
                className={cn(
                  "w-full resize-none bg-transparent px-1 py-1",
                  "focus:outline-none",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "text-[15px] leading-relaxed",
                )}
                style={{
                  color: appleWebColors.textPrimary,
                  maxHeight: "200px",
                }}
              />

              {/* 文字数カウンター */}
              {isNearLimit && !showStopButton && (
                <div
                  className="absolute right-1 bottom-1 text-[11px] font-medium"
                  style={{
                    color: isOverLimit
                      ? systemColors.red
                      : appleWebColors.textTertiary,
                  }}
                >
                  {remainingChars}
                </div>
              )}
            </div>

            {/* 送信/中止ボタン */}
            {showStopButton ? (
              <button
                type="button"
                onClick={handleStop}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0",
                  "hover:scale-105 active:scale-95",
                )}
                style={{
                  backgroundColor: systemColors.red,
                }}
                title="生成を中止"
              >
                <Square size={14} className="text-white" fill="white" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canSend}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0",
                  canSend
                    ? "hover:scale-105 active:scale-95"
                    : "opacity-40 cursor-not-allowed",
                )}
                style={{
                  background: canSend
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : systemColors.gray[3],
                }}
              >
                <Send size={16} className="text-white" />
              </button>
            )}
          </div>
        </div>

        {/* 注意書き */}
        <p
          className="mt-2 text-[11px] text-center"
          style={{ color: appleWebColors.textTertiary }}
        >
          {showStopButton
            ? "生成中... タップで中止"
            : "Enterで送信 · Shift+Enterで改行"}
        </p>
      </form>

      {/* Apple Intelligence風 虹色ボーダーCSS */}
      <style jsx>{`
        .inner-container {
          background-color: ${appleWebColors.sectionBackground};
          border: 1px solid ${appleWebColors.borderSubtle};
          border-radius: 16px;
          transition:
            background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
            border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
            border-radius 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .inner-container.inner-focused {
          background-color: rgba(255, 255, 255, 0.98);
          border-color: transparent;
          border-radius: 14px;
        }

        .rainbow-wrapper {
          position: relative;
          padding: 0;
          transition: padding 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .rainbow-wrapper::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: linear-gradient(
            90deg,
            #bc82f3,
            #f5b9ea,
            #8d9fff,
            #ff6778,
            #ffba71,
            #c686ff,
            #bc82f3
          );
          background-size: 300% 100%;
          opacity: 0;
          transform: scale(0.98);
          transition:
            opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
            transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: -1;
        }

        .rainbow-wrapper.rainbow-active {
          padding: 3px;
        }

        .rainbow-wrapper.rainbow-active::before {
          opacity: 1;
          transform: scale(1);
          animation:
            rainbow-shift 4s ease infinite,
            glow-pulse 2s ease-in-out infinite;
          box-shadow:
            0 0 15px rgba(188, 130, 243, 0.4),
            0 0 30px rgba(141, 159, 255, 0.3),
            0 0 45px rgba(198, 134, 255, 0.2);
        }

        @keyframes rainbow-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes glow-pulse {
          0%,
          100% {
            box-shadow:
              0 0 15px rgba(188, 130, 243, 0.4),
              0 0 30px rgba(141, 159, 255, 0.3),
              0 0 45px rgba(198, 134, 255, 0.2);
          }
          50% {
            box-shadow:
              0 0 20px rgba(245, 185, 234, 0.5),
              0 0 40px rgba(255, 103, 120, 0.4),
              0 0 60px rgba(255, 186, 113, 0.3);
          }
        }
      `}</style>
    </div>
  );
}
