/**
 * 管理者認証ヘルパー（API Route用）
 *
 * クライアントからAuthorizationヘッダーで渡されたトークンを検証
 * 本番環境でも確実に動作するトークンベース認証
 */

import { createClient } from "@supabase/supabase-js";

/**
 * 管理者認証を検証（トークンベース）
 *
 * @param authHeader - Authorization ヘッダーの値 (Bearer <token>)
 * @returns 認証結果
 */
export async function verifyAdminToken(authHeader: string | null): Promise<{
  isAdmin: boolean;
  userId?: string;
  error?: string;
}> {
  // Authorization ヘッダーがない
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { isAdmin: false, error: "認証トークンが必要です" };
  }

  const token = authHeader.replace("Bearer ", "");

  // Supabase環境変数チェック
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[Admin Auth] Supabase environment variables not configured");
    return { isAdmin: false, error: "サーバー設定エラー" };
  }

  try {
    // トークンを使用してSupabaseクライアントを作成
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // ユーザー情報を取得
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(
        "[Admin Auth] User verification failed:",
        userError?.message,
      );
      return { isAdmin: false, error: "認証が必要です" };
    }

    // 管理者権限をチェック
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("is_admin")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      console.error("[Admin Auth] Profile fetch failed:", profileError.message);
      return { isAdmin: false, error: "プロフィール取得エラー" };
    }

    if (!profile?.is_admin) {
      return { isAdmin: false, error: "管理者権限が必要です" };
    }

    return { isAdmin: true, userId: user.id };
  } catch (error) {
    console.error("[Admin Auth] Unexpected error:", error);
    return { isAdmin: false, error: "認証エラーが発生しました" };
  }
}
