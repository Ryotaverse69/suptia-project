/**
 * MFA（多要素認証）ユーティリティ
 *
 * Supabase Auth の TOTP（Time-based One-Time Password）を使用した
 * 2段階認証の登録・検証・管理機能を提供
 */

import { createClient } from "./client";
import type {
  AuthMFAEnrollResponse,
  AuthMFAVerifyResponse,
  Factor,
} from "@supabase/supabase-js";

/**
 * MFA の状態
 */
export type MFAStatus = "disabled" | "pending" | "enabled";

/**
 * MFA Factor 情報
 */
export interface MFAFactor {
  id: string;
  type: "totp";
  friendlyName?: string;
  status: "verified" | "unverified";
  createdAt: string;
  updatedAt: string;
}

/**
 * MFA 登録レスポンス
 */
export interface MFAEnrollResult {
  success: boolean;
  factorId?: string;
  qrCode?: string;
  secret?: string;
  error?: string;
}

/**
 * MFA 検証レスポンス
 */
export interface MFAVerifyResult {
  success: boolean;
  error?: string;
}

/**
 * 現在のユーザーのMFA状態を取得
 */
export async function getMFAStatus(): Promise<{
  status: MFAStatus;
  factors: MFAFactor[];
}> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.mfa.listFactors();

  if (error) {
    console.error("[MFA] Failed to get MFA status:", error);
    return { status: "disabled", factors: [] };
  }

  const totpFactors: Factor[] = data.totp || [];

  // 検証済みのTOTP factorがあるかチェック
  const verifiedFactor = totpFactors.find(
    (f: Factor) => f.status === "verified",
  );
  const unverifiedFactor = totpFactors.find(
    (f: Factor) => f.status === "unverified",
  );

  let status: MFAStatus = "disabled";
  if (verifiedFactor) {
    status = "enabled";
  } else if (unverifiedFactor) {
    status = "pending";
  }

  const factors: MFAFactor[] = totpFactors.map((f: Factor) => ({
    id: f.id,
    type: "totp" as const,
    friendlyName: f.friendly_name || undefined,
    status: f.status as "verified" | "unverified",
    createdAt: f.created_at,
    updatedAt: f.updated_at,
  }));

  return { status, factors };
}

/**
 * MFA（TOTP）を登録開始
 * QRコードとシークレットキーを返す
 */
export async function enrollMFA(
  friendlyName: string = "サプティア認証アプリ",
): Promise<MFAEnrollResult> {
  const supabase = createClient();

  // 既存の未検証factorがあれば削除
  const { factors } = await getMFAStatus();
  const unverifiedFactor = factors.find((f) => f.status === "unverified");
  if (unverifiedFactor) {
    await supabase.auth.mfa.unenroll({ factorId: unverifiedFactor.id });
  }

  const { data, error }: AuthMFAEnrollResponse = await supabase.auth.mfa.enroll(
    {
      factorType: "totp",
      friendlyName,
    },
  );

  if (error) {
    console.error("[MFA] Enrollment failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }

  // TOTP型のみサポート
  if (data.type !== "totp" || !("totp" in data)) {
    return {
      success: false,
      error: "サポートされていない認証方式です",
    };
  }

  return {
    success: true,
    factorId: data.id,
    qrCode: data.totp.qr_code,
    secret: data.totp.secret,
  };
}

/**
 * MFA登録を完了（検証コードで確認）
 */
export async function verifyMFAEnrollment(
  factorId: string,
  code: string,
): Promise<MFAVerifyResult> {
  const supabase = createClient();

  // チャレンジを作成
  const { data: challengeData, error: challengeError } =
    await supabase.auth.mfa.challenge({ factorId });

  if (challengeError) {
    console.error("[MFA] Challenge failed:", challengeError);
    return {
      success: false,
      error: "認証チャレンジの作成に失敗しました",
    };
  }

  // 検証
  const { error: verifyError }: AuthMFAVerifyResponse =
    await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code,
    });

  if (verifyError) {
    console.error("[MFA] Verification failed:", verifyError);
    return {
      success: false,
      error: "認証コードが正しくありません",
    };
  }

  return { success: true };
}

/**
 * ログイン時のMFA検証
 */
export async function verifyMFALogin(
  factorId: string,
  code: string,
): Promise<MFAVerifyResult> {
  const supabase = createClient();

  // チャレンジを作成
  const { data: challengeData, error: challengeError } =
    await supabase.auth.mfa.challenge({ factorId });

  if (challengeError) {
    console.error("[MFA] Login challenge failed:", challengeError);
    return {
      success: false,
      error: "認証チャレンジの作成に失敗しました",
    };
  }

  // 検証
  const { error: verifyError }: AuthMFAVerifyResponse =
    await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code,
    });

  if (verifyError) {
    console.error("[MFA] Login verification failed:", verifyError);
    return {
      success: false,
      error: "認証コードが正しくありません",
    };
  }

  return { success: true };
}

/**
 * MFAを無効化（登録解除）
 */
export async function unenrollMFA(factorId: string): Promise<MFAVerifyResult> {
  const supabase = createClient();

  const { error } = await supabase.auth.mfa.unenroll({ factorId });

  if (error) {
    console.error("[MFA] Unenroll failed:", error);
    return {
      success: false,
      error: "2段階認証の解除に失敗しました",
    };
  }

  return { success: true };
}

/**
 * 現在のセッションがMFA検証済みかチェック
 */
export async function isMFAVerified(): Promise<boolean> {
  const supabase = createClient();

  const { data, error } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (error) {
    console.error("[MFA] Failed to get AAL:", error);
    return false;
  }

  // aal2 = MFA検証済み
  return data.currentLevel === "aal2";
}

/**
 * MFA検証が必要かどうかをチェック
 * ログイン後、MFAが有効なのに未検証の場合 true
 */
export async function needsMFAVerification(): Promise<{
  required: boolean;
  factorId?: string;
}> {
  const supabase = createClient();

  // タイムアウト付きでAALレベルを取得（5秒）
  const aalPromise = supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error("MFA AAL check timed out after 5s")),
      5000,
    ),
  );

  let data;
  try {
    const result = await Promise.race([aalPromise, timeoutPromise]);
    if ("error" in result && result.error) {
      console.error("[MFA] Failed to check MFA requirement:", result.error);
      return { required: false };
    }
    data = (result as { data: { currentLevel: string; nextLevel: string } })
      .data;
  } catch (err) {
    console.error("[MFA] AAL check failed or timed out:", err);
    return { required: false };
  }

  // nextLevel が aal2 で currentLevel が aal1 の場合、MFA検証が必要
  if (data.nextLevel === "aal2" && data.currentLevel === "aal1") {
    // 検証済みの factor を取得（タイムアウト付き）
    try {
      const factorsPromise = getMFAStatus();
      const factorsTimeout = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("MFA listFactors timed out after 5s")),
          5000,
        ),
      );
      const { factors } = await Promise.race([factorsPromise, factorsTimeout]);
      const verifiedFactor = factors.find((f) => f.status === "verified");

      return {
        required: true,
        factorId: verifiedFactor?.id,
      };
    } catch (err) {
      console.error("[MFA] Factor list failed or timed out:", err);
      return { required: false };
    }
  }

  return { required: false };
}
