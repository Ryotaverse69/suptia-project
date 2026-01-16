"use client";

/**
 * MFA検証モーダル
 *
 * ログイン時に2段階認証が必要な場合に表示される
 */

import { useState } from "react";
import { ShieldCheck, Loader2, X } from "lucide-react";
import { verifyMFALogin } from "@/lib/supabase/mfa";
import { systemColors, appleWebColors } from "@/lib/design-system";

interface MFAVerifyModalProps {
  factorId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MFAVerifyModal({
  factorId,
  onSuccess,
  onCancel,
}: MFAVerifyModalProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) return;

    setIsVerifying(true);
    setError(null);

    const result = await verifyMFALogin(factorId, code);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || "認証に失敗しました");
      setCode("");
    }

    setIsVerifying(false);
  };

  // Enter キーで送信
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && code.length === 6 && !isVerifying) {
      handleVerify();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-sm rounded-[20px] overflow-hidden shadow-2xl"
        style={{ backgroundColor: appleWebColors.pageBackground }}
      >
        {/* Header */}
        <div
          className="p-5 border-b flex items-center justify-between"
          style={{
            borderColor: appleWebColors.borderSubtle,
            background: `linear-gradient(135deg, ${systemColors.green}10 0%, ${systemColors.teal}10 100%)`,
          }}
        >
          <h2
            className="text-[17px] font-bold flex items-center gap-2"
            style={{ color: appleWebColors.textPrimary }}
          >
            <ShieldCheck size={20} style={{ color: systemColors.green }} />
            2段階認証
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
            aria-label="閉じる"
          >
            <X size={20} style={{ color: appleWebColors.textSecondary }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            {/* Icon */}
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${systemColors.green}20 0%, ${systemColors.teal}20 100%)`,
              }}
            >
              <ShieldCheck size={32} style={{ color: systemColors.green }} />
            </div>

            <p
              className="text-[14px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              認証アプリに表示されている
              <br />
              6桁のコードを入力してください
            </p>
          </div>

          {/* Code Input */}
          <div className="mb-6">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setCode(value);
                setError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="000000"
              className="w-full text-center text-[28px] font-mono tracking-[0.5em] py-3 rounded-xl border-2 outline-none transition-colors"
              style={{
                borderColor: error
                  ? systemColors.red
                  : code.length === 6
                    ? systemColors.green
                    : appleWebColors.borderSubtle,
                color: appleWebColors.textPrimary,
              }}
              autoFocus
              autoComplete="one-time-code"
            />

            {error && (
              <p
                className="mt-3 text-[13px] text-center"
                style={{ color: systemColors.red }}
              >
                {error}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl text-[15px] font-medium border min-h-[48px]"
              style={{
                borderColor: appleWebColors.borderSubtle,
                color: appleWebColors.textSecondary,
              }}
            >
              キャンセル
            </button>
            <button
              onClick={handleVerify}
              disabled={code.length !== 6 || isVerifying}
              className="flex-1 py-3 rounded-xl text-[15px] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px]"
              style={{
                background: `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
              }}
            >
              {isVerifying ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  確認中...
                </>
              ) : (
                "確認"
              )}
            </button>
          </div>

          {/* Help Text */}
          <p
            className="mt-4 text-[11px] text-center"
            style={{ color: appleWebColors.textTertiary }}
          >
            コードは30秒ごとに更新されます
          </p>
        </div>
      </div>
    </div>
  );
}
