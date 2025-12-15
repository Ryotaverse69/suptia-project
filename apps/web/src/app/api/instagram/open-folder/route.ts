import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import { createClient } from "@/lib/supabase/server";

/**
 * 管理者認証を検証
 */
async function verifyAdminAuth(): Promise<{
  isAdmin: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { isAdmin: false, error: "認証が必要です" };
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("is_admin")
      .eq("user_id", user.id)
      .single();

    if (!profile?.is_admin) {
      return { isAdmin: false, error: "管理者権限が必要です" };
    }

    return { isAdmin: true };
  } catch {
    return { isAdmin: false, error: "認証エラーが発生しました" };
  }
}

export async function POST(): Promise<Response> {
  // 開発環境のみで動作
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { success: false, error: "本番環境では使用できません" },
      { status: 403 },
    );
  }

  // 管理者認証チェック
  const { isAdmin, error: authError } = await verifyAdminAuth();
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: authError || "認証エラー" },
      { status: 401 },
    );
  }

  const folderPath = path.join(process.cwd(), "public", "instagram");

  return new Promise<Response>((resolve) => {
    // macOSの場合は `open`、Windowsは `explorer`、Linuxは `xdg-open`
    const platform = process.platform;
    let command: string;

    if (platform === "darwin") {
      command = `open "${folderPath}"`;
    } else if (platform === "win32") {
      command = `explorer "${folderPath}"`;
    } else {
      command = `xdg-open "${folderPath}"`;
    }

    exec(command, (error) => {
      if (error) {
        console.error("Failed to open folder:", error);
        resolve(
          NextResponse.json(
            {
              success: false,
              error: "フォルダを開けませんでした",
              path: folderPath,
            },
            { status: 500 },
          ),
        );
      } else {
        resolve(NextResponse.json({ success: true, path: folderPath }));
      }
    });
  });
}
