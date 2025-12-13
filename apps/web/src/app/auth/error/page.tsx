/**
 * 認証エラーページ
 */

import Link from "next/link";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

export default function AuthErrorPage() {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center px-4"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      <div className="text-center max-w-md">
        {/* Error Card */}
        <div
          className={`rounded-[20px] p-8 mb-6 ${liquidGlassClasses.light}`}
          style={{
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: appleWebColors.borderSubtle,
          }}
        >
          {/* Error Icon */}
          <div
            className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: `${systemColors.red}15`,
            }}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: systemColors.red }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Title */}
          <h1
            className="text-[22px] font-bold leading-[28px] tracking-[0.35px] mb-4"
            style={{ color: appleWebColors.textPrimary }}
          >
            認証エラー
          </h1>

          {/* Description */}
          <p
            className="text-[15px] leading-[20px] tracking-[-0.24px] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            認証処理中にエラーが発生しました。
            <br />
            もう一度お試しください。
          </p>

          {/* Back to Home Button */}
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 min-h-[48px] rounded-[16px] font-medium text-[17px] leading-[22px] tracking-[-0.43px] text-white transition-all hover:opacity-90"
            style={{
              backgroundColor: systemColors.blue,
            }}
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
