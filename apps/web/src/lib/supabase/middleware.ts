/**
 * Supabase Middleware ヘルパー
 *
 * セッション更新とリダイレクト処理
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 環境変数が設定されていない場合はスキップ
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[Supabase Middleware] Environment variables not configured");
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // セッションを更新（重要：getUser()を使用）
  try {
    await supabase.auth.getUser();
  } catch (err) {
    console.error("[Supabase Middleware] getUser error:", err);
  }

  return supabaseResponse;
}
