"use client";

/**
 * 管理者ページ専用 MFAガード
 *
 * 管理者がMFAを有効にしている場合、
 * MFA検証が完了するまで管理者ページへのアクセスをブロック
 */

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { needsMFAVerification } from "@/lib/supabase/mfa";
import { MFAVerifyModal } from "./MFAVerifyModal";
import { Loader2, ShieldAlert } from "lucide-react";
import { systemColors, appleWebColors } from "@/lib/design-system";

interface AdminMFAGuardProps {
  children: React.ReactNode;
}

export function AdminMFAGuard({ children }: AdminMFAGuardProps) {
  const { user, signOut } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [factorId, setFactorId] = useState<string | null>(null);

  useEffect(() => {
    const checkMFA = async () => {
      if (!user) {
        setIsChecking(false);
        return;
      }

      try {
        const result = await needsMFAVerification();
        if (result.required && result.factorId) {
          setMfaRequired(true);
          setFactorId(result.factorId);
        }
      } catch (error) {
        console.error("[AdminMFAGuard] MFA check error:", error);
      }
      setIsChecking(false);
    };

    checkMFA();
  }, [user]);

  // ローディング中
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={32}
            className="animate-spin mx-auto mb-4"
            style={{ color: systemColors.green }}
          />
          <p style={{ color: appleWebColors.textSecondary }}>
            セキュリティを確認中...
          </p>
        </div>
      </div>
    );
  }

  // MFA検証が必要
  if (mfaRequired && factorId) {
    return (
      <>
        {/* 背景にブロック画面を表示 */}
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${systemColors.green}20 0%, ${systemColors.teal}20 100%)`,
              }}
            >
              <ShieldAlert size={40} style={{ color: systemColors.green }} />
            </div>
            <h1
              className="text-2xl font-bold mb-3"
              style={{ color: appleWebColors.textPrimary }}
            >
              2段階認証が必要です
            </h1>
            <p
              className="text-[15px] mb-6"
              style={{ color: appleWebColors.textSecondary }}
            >
              管理者ページにアクセスするには、
              <br />
              2段階認証の検証が必要です。
            </p>
          </div>
        </div>

        {/* MFA検証モーダル */}
        <MFAVerifyModal
          factorId={factorId}
          onSuccess={() => {
            setMfaRequired(false);
            setFactorId(null);
          }}
          onCancel={signOut}
        />
      </>
    );
  }

  // MFA検証済み or MFA未設定 → 通常表示
  return <>{children}</>;
}
