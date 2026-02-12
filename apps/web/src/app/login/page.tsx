import { Metadata } from "next";
import Link from "next/link";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

export const metadata: Metadata = {
  title: "ログイン | サプティア",
  description:
    "サプティアにログインして、パーソナライズされたサプリメント推奨を受け取りましょう。",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function LoginPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div
            className={`rounded-[20px] p-8 border ${liquidGlassClasses.light}`}
            style={{
              borderColor: appleWebColors.borderSubtle,
            }}
          >
            <h1
              className="text-[28px] font-bold text-center mb-8 leading-[34px] tracking-[0.36px]"
              style={{ color: appleWebColors.textPrimary }}
            >
              ログイン
            </h1>

            <div className="space-y-6">
              <div
                className="text-center py-12 text-[15px] leading-[20px] tracking-[-0.24px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                <p className="mb-4">ログイン機能は現在開発中です。</p>
                <p className="text-[13px] leading-[18px] tracking-[-0.08px]">
                  近日中にご利用いただけるようになります。
                </p>
              </div>

              <div
                className="border-t pt-6"
                style={{ borderColor: appleWebColors.separator }}
              >
                <Link
                  href="/"
                  className="block w-full text-center px-4 min-h-[48px] rounded-[16px] transition-all duration-150 font-semibold text-[17px] leading-[22px] tracking-[-0.41px] flex items-center justify-center hover:bg-[#0077ED] hover:scale-[1.02]"
                  style={{
                    backgroundColor: systemColors.blue,
                    color: "#FFFFFF",
                  }}
                >
                  ホームに戻る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
