/**
 * Supabase クライアント（ブラウザ用）
 *
 * クライアントサイドでの認証操作に使用
 * シングルトンパターンで同じインスタンスを返す
 */

import { createBrowserClient } from "@supabase/ssr";

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

// 環境変数を検証
function validateSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || url.trim() === "" || url === "https://your-project.supabase.co") {
    console.error(
      "[Supabase] NEXT_PUBLIC_SUPABASE_URL is not configured. " +
        "Please set it in your environment variables.",
    );
    throw new Error("Supabase URL is not configured");
  }

  if (!anonKey || anonKey.trim() === "" || anonKey.startsWith("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")) {
    console.error(
      "[Supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured. " +
        "Please set it in your environment variables.",
    );
    throw new Error("Supabase Anon Key is not configured");
  }

  return { url, anonKey };
}

export function createClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const { url, anonKey } = validateSupabaseEnv();

  supabaseClient = createBrowserClient(url, anonKey);

  return supabaseClient;
}
