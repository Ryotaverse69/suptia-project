/**
 * Supabase クライアント（ブラウザ用）
 *
 * クライアントサイドでの認証操作に使用
 * シングルトンパターンで同じインスタンスを返す
 */

import { createBrowserClient } from "@supabase/ssr";

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  return supabaseClient;
}
