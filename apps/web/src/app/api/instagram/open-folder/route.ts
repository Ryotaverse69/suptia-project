import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import { verifyAdminToken } from "@/lib/supabase/admin-auth";

export async function POST(request: NextRequest): Promise<Response> {
  // 開発環境のみで動作
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { success: false, error: "本番環境では使用できません" },
      { status: 403 },
    );
  }

  // 管理者認証チェック（トークンベース）
  const authHeader = request.headers.get("authorization");
  const { isAdmin, error: authError } = await verifyAdminToken(authHeader);
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
