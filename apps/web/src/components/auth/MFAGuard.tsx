"use client";

/**
 * MFAガード
 *
 * MFA検証が必要な場合に検証モーダルを表示する
 * AuthProviderの子コンポーネントとして使用
 */

import { useAuth } from "@/contexts/AuthContext";
import { MFAVerifyModal } from "./MFAVerifyModal";

interface MFAGuardProps {
  children: React.ReactNode;
}

export function MFAGuard({ children }: MFAGuardProps) {
  const { mfa, verifyMFA, cancelMFA, isLoading } = useAuth();

  // MFA検証が必要な場合
  if (mfa.required && mfa.factorId) {
    return (
      <>
        {children}
        <MFAVerifyModal
          factorId={mfa.factorId}
          onSuccess={() => {
            // verifyMFA は AuthContext 内で状態を更新するので、
            // ここでは何もしなくてOK
          }}
          onCancel={cancelMFA}
        />
      </>
    );
  }

  return <>{children}</>;
}
