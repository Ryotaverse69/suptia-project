/**
 * OAuth認証コールバックルート
 *
 * OAuth認証後のリダイレクトを処理し、セッションを確立
 */

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  console.log("[Auth Callback] code:", code ? "exists" : "missing");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    console.log("[Auth Callback] exchangeCodeForSession error:", error);

    if (!error) {
      // 認証成功 - 元のページまたはホームにリダイレクト
      console.log(
        "[Auth Callback] Success, redirecting to:",
        `${origin}${next}`,
      );
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 認証失敗 - エラーページにリダイレクト
  console.log("[Auth Callback] Failed, redirecting to error page");
  return NextResponse.redirect(`${origin}/auth/error`);
}
