"use client";

/**
 * MFA（2段階認証）設定コンポーネント
 *
 * マイページで2段階認証の有効化・無効化を行うためのUI
 */

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Shield,
  ShieldCheck,
  ShieldOff,
  Loader2,
  Copy,
  Check,
  AlertTriangle,
  Smartphone,
  Key,
  X,
} from "lucide-react";
import {
  getMFAStatus,
  enrollMFA,
  verifyMFAEnrollment,
  unenrollMFA,
  type MFAStatus,
  type MFAFactor,
} from "@/lib/supabase/mfa";
import {
  systemColors,
  appleWebColors,
  liquidGlassClasses,
} from "@/lib/design-system";

/**
 * MFA設定セクション（マイページ用）
 */
export function MFASetupSection() {
  const [status, setStatus] = useState<MFAStatus>("disabled");
  const [factors, setFactors] = useState<MFAFactor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);

  // MFA状態を取得
  const loadMFAStatus = useCallback(async () => {
    setIsLoading(true);
    const result = await getMFAStatus();
    setStatus(result.status);
    setFactors(result.factors);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadMFAStatus();
  }, [loadMFAStatus]);

  const handleSetupComplete = () => {
    setShowSetupModal(false);
    loadMFAStatus();
  };

  const handleDisableComplete = () => {
    setShowDisableModal(false);
    loadMFAStatus();
  };

  if (isLoading) {
    return (
      <div
        className={`p-6 ${liquidGlassClasses.light}`}
        style={{ borderColor: appleWebColors.borderSubtle }}
      >
        <div className="flex items-center gap-3">
          <Loader2
            size={20}
            className="animate-spin"
            style={{ color: systemColors.blue }}
          />
          <span style={{ color: appleWebColors.textSecondary }}>
            セキュリティ設定を読み込み中...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`overflow-hidden ${liquidGlassClasses.light}`}>
        {/* Header */}
        <div
          className="p-5 sm:p-6 border-b"
          style={{
            borderColor: appleWebColors.borderSubtle,
            background:
              status === "enabled"
                ? `linear-gradient(135deg, ${systemColors.green}10 0%, ${systemColors.teal}10 100%)`
                : `linear-gradient(135deg, ${systemColors.orange}10 0%, ${systemColors.yellow}10 100%)`,
          }}
        >
          <h3
            className="font-bold text-[17px] flex items-center gap-2"
            style={{ color: appleWebColors.textPrimary }}
          >
            {status === "enabled" ? (
              <ShieldCheck size={20} style={{ color: systemColors.green }} />
            ) : (
              <Shield size={20} style={{ color: systemColors.orange }} />
            )}
            2段階認証（MFA）
          </h3>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background:
                  status === "enabled"
                    ? `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`
                    : `linear-gradient(135deg, ${systemColors.orange} 0%, ${systemColors.yellow} 100%)`,
              }}
            >
              {status === "enabled" ? (
                <ShieldCheck size={28} className="text-white" />
              ) : (
                <Smartphone size={28} className="text-white" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-[12px] font-semibold ${
                    status === "enabled" ? "text-white" : ""
                  }`}
                  style={{
                    backgroundColor:
                      status === "enabled"
                        ? systemColors.green
                        : `${systemColors.orange}20`,
                    color: status === "enabled" ? "white" : systemColors.orange,
                  }}
                >
                  {status === "enabled" ? "有効" : "無効"}
                </span>
              </div>

              <p
                className="text-[14px] mb-4"
                style={{ color: appleWebColors.textSecondary }}
              >
                {status === "enabled" ? (
                  <>
                    認証アプリによる2段階認証が有効です。
                    <br />
                    ログイン時に認証コードの入力が必要になります。
                  </>
                ) : (
                  <>
                    Google Authenticator や Authy などの認証アプリを使用して、
                    <br />
                    アカウントのセキュリティを強化できます。
                  </>
                )}
              </p>

              {/* Action Button */}
              {status === "enabled" ? (
                <button
                  onClick={() => setShowDisableModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] font-medium transition-all min-h-[40px] border"
                  style={{
                    borderColor: systemColors.red,
                    color: systemColors.red,
                  }}
                >
                  <ShieldOff size={16} />
                  2段階認証を無効にする
                </button>
              ) : (
                <button
                  onClick={() => setShowSetupModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] font-semibold text-white transition-all min-h-[40px]"
                  style={{
                    background: `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
                  }}
                >
                  <ShieldCheck size={16} />
                  2段階認証を有効にする
                </button>
              )}
            </div>
          </div>

          {/* Security Tips */}
          <div
            className="mt-6 p-4 rounded-xl"
            style={{ backgroundColor: `${systemColors.blue}08` }}
          >
            <h4
              className="text-[13px] font-semibold mb-2 flex items-center gap-2"
              style={{ color: systemColors.blue }}
            >
              <Key size={14} />
              セキュリティのヒント
            </h4>
            <ul
              className="text-[12px] space-y-1"
              style={{ color: appleWebColors.textSecondary }}
            >
              <li>・ 認証アプリは複数デバイスに設定しておくと安心です</li>
              <li>・ バックアップコードは安全な場所に保管してください</li>
              <li>・ 機種変更時は事前に2段階認証を再設定してください</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Setup Modal */}
      {showSetupModal && (
        <MFASetupModal
          onClose={() => setShowSetupModal(false)}
          onComplete={handleSetupComplete}
        />
      )}

      {/* Disable Modal */}
      {showDisableModal && factors[0] && (
        <MFADisableModal
          factorId={factors[0].id}
          onClose={() => setShowDisableModal(false)}
          onComplete={handleDisableComplete}
        />
      )}
    </>
  );
}

/**
 * MFA設定モーダル
 */
function MFASetupModal({
  onClose,
  onComplete,
}: {
  onClose: () => void;
  onComplete: () => void;
}) {
  const [step, setStep] = useState<"qr" | "verify">("qr");
  const [isLoading, setIsLoading] = useState(true);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // MFA登録を開始
  useEffect(() => {
    const startEnrollment = async () => {
      setIsLoading(true);
      const result = await enrollMFA();

      if (result.success && result.qrCode && result.secret && result.factorId) {
        setFactorId(result.factorId);
        setQrCode(result.qrCode);
        setSecret(result.secret);
      } else {
        setError(result.error || "MFAの設定に失敗しました");
      }
      setIsLoading(false);
    };

    startEnrollment();
  }, []);

  // シークレットキーをコピー
  const handleCopySecret = async () => {
    if (secret) {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 認証コードを検証
  const handleVerify = async () => {
    if (!factorId || code.length !== 6) return;

    setIsVerifying(true);
    setError(null);

    const result = await verifyMFAEnrollment(factorId, code);

    if (result.success) {
      onComplete();
    } else {
      setError(result.error || "認証に失敗しました");
    }

    setIsVerifying(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-[20px] overflow-hidden"
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
            2段階認証の設定
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
          >
            <X size={20} style={{ color: appleWebColors.textSecondary }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2
                size={32}
                className="animate-spin mx-auto mb-4"
                style={{ color: systemColors.green }}
              />
              <p style={{ color: appleWebColors.textSecondary }}>
                QRコードを生成中...
              </p>
            </div>
          ) : error && !qrCode ? (
            <div className="text-center py-8">
              <AlertTriangle
                size={48}
                className="mx-auto mb-4"
                style={{ color: systemColors.red }}
              />
              <p
                className="text-[15px] mb-4"
                style={{ color: systemColors.red }}
              >
                {error}
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-[14px] font-medium"
                style={{
                  backgroundColor: appleWebColors.sectionBackground,
                  color: appleWebColors.textPrimary,
                }}
              >
                閉じる
              </button>
            </div>
          ) : step === "qr" ? (
            <>
              {/* Step 1: QR Code */}
              <div className="text-center mb-6">
                <p
                  className="text-[14px] mb-4"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  認証アプリで下のQRコードをスキャンしてください
                </p>

                {/* QR Code */}
                {qrCode && (
                  <div
                    className="inline-block p-4 rounded-xl mb-4"
                    style={{ backgroundColor: "white" }}
                  >
                    <Image
                      src={qrCode}
                      alt="MFA QR Code"
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                  </div>
                )}

                {/* Secret Key */}
                <div
                  className="p-3 rounded-xl mb-4"
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                >
                  <p
                    className="text-[11px] mb-2"
                    style={{ color: appleWebColors.textTertiary }}
                  >
                    QRコードが読み取れない場合は以下のキーを手動入力
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <code
                      className="text-[13px] font-mono tracking-wider"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {secret}
                    </code>
                    <button
                      onClick={handleCopySecret}
                      className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
                    >
                      {copied ? (
                        <Check
                          size={16}
                          style={{ color: systemColors.green }}
                        />
                      ) : (
                        <Copy
                          size={16}
                          style={{ color: appleWebColors.textSecondary }}
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* Supported Apps */}
                <p
                  className="text-[12px]"
                  style={{ color: appleWebColors.textTertiary }}
                >
                  対応アプリ: Google Authenticator, Authy, 1Password など
                </p>
              </div>

              <button
                onClick={() => setStep("verify")}
                className="w-full py-3 rounded-xl text-[15px] font-semibold text-white"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
                }}
              >
                次へ：認証コードを入力
              </button>
            </>
          ) : (
            <>
              {/* Step 2: Verify Code */}
              <div className="text-center mb-6">
                <p
                  className="text-[14px] mb-6"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  認証アプリに表示されている6桁のコードを入力してください
                </p>

                {/* Code Input */}
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
                  placeholder="000000"
                  className="w-48 text-center text-[28px] font-mono tracking-[0.5em] py-3 rounded-xl border-2 outline-none transition-colors"
                  style={{
                    borderColor: error
                      ? systemColors.red
                      : code.length === 6
                        ? systemColors.green
                        : appleWebColors.borderSubtle,
                    color: appleWebColors.textPrimary,
                  }}
                  autoFocus
                />

                {error && (
                  <p
                    className="mt-3 text-[13px]"
                    style={{ color: systemColors.red }}
                  >
                    {error}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("qr")}
                  className="flex-1 py-3 rounded-xl text-[15px] font-medium border"
                  style={{
                    borderColor: appleWebColors.borderSubtle,
                    color: appleWebColors.textSecondary,
                  }}
                >
                  戻る
                </button>
                <button
                  onClick={handleVerify}
                  disabled={code.length !== 6 || isVerifying}
                  className="flex-1 py-3 rounded-xl text-[15px] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                    "有効にする"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * MFA無効化モーダル
 * セキュリティのため、無効化前に認証コードの入力を必須とする
 */
function MFADisableModal({
  factorId,
  onClose,
  onComplete,
}: {
  factorId: string;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDisable = async () => {
    if (code.length !== 6) {
      setError("6桁の認証コードを入力してください");
      return;
    }

    setIsLoading(true);
    setError(null);

    // まずMFA検証を行う
    const verifyResult = await verifyMFAEnrollment(factorId, code);
    if (!verifyResult.success) {
      setError("認証コードが正しくありません");
      setCode("");
      setIsLoading(false);
      return;
    }

    // 検証成功後に無効化
    const result = await unenrollMFA(factorId);

    if (result.success) {
      onComplete();
    } else {
      setError(result.error || "無効化に失敗しました");
    }

    setIsLoading(false);
  };

  // Enterキーで送信
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && code.length === 6 && !isLoading) {
      handleDisable();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-sm rounded-[20px] overflow-hidden"
        style={{ backgroundColor: appleWebColors.pageBackground }}
      >
        {/* Header */}
        <div
          className="p-5 border-b"
          style={{
            borderColor: appleWebColors.borderSubtle,
            background: `linear-gradient(135deg, ${systemColors.red}10 0%, ${systemColors.orange}10 100%)`,
          }}
        >
          <h2
            className="text-[17px] font-bold flex items-center gap-2"
            style={{ color: appleWebColors.textPrimary }}
          >
            <AlertTriangle size={20} style={{ color: systemColors.red }} />
            2段階認証を無効にする
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p
            className="text-[14px] mb-4"
            style={{ color: appleWebColors.textSecondary }}
          >
            2段階認証を無効にすると、アカウントのセキュリティが低下します。
          </p>

          <p
            className="text-[14px] mb-4 font-medium"
            style={{ color: appleWebColors.textPrimary }}
          >
            無効化するには、認証アプリの6桁コードを入力してください。
          </p>

          {/* Code Input */}
          <div className="mb-4">
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
              className="w-full text-center text-[24px] font-mono tracking-[0.4em] py-3 rounded-xl border-2 outline-none transition-colors"
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
          </div>

          {error && (
            <p
              className="mb-4 text-[13px] text-center"
              style={{ color: systemColors.red }}
            >
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-[15px] font-medium border min-h-[48px]"
              style={{
                borderColor: appleWebColors.borderSubtle,
                color: appleWebColors.textSecondary,
              }}
            >
              キャンセル
            </button>
            <button
              onClick={handleDisable}
              disabled={code.length !== 6 || isLoading}
              className="flex-1 py-3 rounded-xl text-[15px] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px]"
              style={{ backgroundColor: systemColors.red }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  処理中...
                </>
              ) : (
                "無効にする"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
