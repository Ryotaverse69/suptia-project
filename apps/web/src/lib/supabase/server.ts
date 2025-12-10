/**
 * Supabase クライアント（サーバー用）
 *
 * Server Components、Route Handlers、Server Actionsで使用
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// 環境変数を検証
function validateSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || url.trim() === "" || url === "https://your-project.supabase.co") {
    throw new Error(
      "[Supabase Server] NEXT_PUBLIC_SUPABASE_URL is not configured",
    );
  }

  if (
    !anonKey ||
    anonKey.trim() === "" ||
    anonKey.startsWith("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
  ) {
    throw new Error(
      "[Supabase Server] NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured",
    );
  }

  return { url, anonKey };
}

export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = validateSupabaseEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Componentから呼ばれた場合は無視
        }
      },
    },
  });
}
