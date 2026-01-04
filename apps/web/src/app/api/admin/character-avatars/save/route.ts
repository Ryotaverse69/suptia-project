/**
 * キャラクターアバター保存 API
 *
 * POST /api/admin/character-avatars/save
 * - Admin専用
 * - Base64画像をSupabase Storageに保存
 * - DBにレコードを作成/更新
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    // Admin認証チェック
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("is_admin")
      .eq("user_id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 },
      );
    }

    // リクエストボディを取得
    const body = await request.json();
    const { characterId, base64Image, mimeType, prompt, model } = body;

    if (
      !characterId ||
      !["core", "mint", "repha", "haku"].includes(characterId)
    ) {
      return NextResponse.json(
        { error: "有効なキャラクターIDが必要です" },
        { status: 400 },
      );
    }

    if (!base64Image) {
      return NextResponse.json(
        { error: "画像データが必要です" },
        { status: 400 },
      );
    }

    // Service Role クライアントでStorage操作
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Supabase設定が不完全です" },
        { status: 500 },
      );
    }

    const adminClient = createAdminClient(supabaseUrl, serviceRoleKey);

    // Base64をBufferに変換
    const buffer = Buffer.from(base64Image, "base64");

    // ファイル拡張子を決定
    const extension = mimeType === "image/jpeg" ? "jpg" : "png";
    const fileName = `${characterId}_${Date.now()}.${extension}`;
    const filePath = `avatars/${fileName}`;

    // Storage にアップロード
    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from("character-avatars")
      .upload(filePath, buffer, {
        contentType: mimeType || "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error(
        "[Character Avatar Save] Storage upload error:",
        uploadError,
      );
      return NextResponse.json(
        { error: `ストレージへの保存に失敗しました: ${uploadError.message}` },
        { status: 500 },
      );
    }

    // 公開URLを取得
    const { data: urlData } = adminClient.storage
      .from("character-avatars")
      .getPublicUrl(filePath);

    const imageUrl = urlData.publicUrl;

    // DBに保存（upsert）
    const { data: avatarRecord, error: dbError } = await adminClient
      .from("character_avatars")
      .upsert(
        {
          character_id: characterId,
          image_url: imageUrl,
          prompt: prompt || null,
          model: model || "gemini-2.0-flash-preview-image-generation",
          generated_by: user.id,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "character_id",
        },
      )
      .select()
      .single();

    if (dbError) {
      console.error("[Character Avatar Save] DB error:", dbError);
      return NextResponse.json(
        { error: `データベースへの保存に失敗しました: ${dbError.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      avatar: avatarRecord,
      imageUrl,
    });
  } catch (error) {
    console.error("[Character Avatar Save] Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `保存中にエラーが発生しました: ${errorMessage}` },
      { status: 500 },
    );
  }
}
