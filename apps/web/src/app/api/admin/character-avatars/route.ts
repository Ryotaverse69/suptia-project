/**
 * キャラクターアバター取得 API
 *
 * GET /api/admin/character-avatars
 * - 全ユーザーがアクセス可能（公開データ）
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: avatars, error } = await supabase
      .from("character_avatars")
      .select("character_id, image_url, updated_at")
      .order("character_id");

    if (error) {
      console.error("[Character Avatars] Fetch error:", error);
      return NextResponse.json({ avatars: [] });
    }

    // character_id をキーとしたオブジェクトに変換
    const avatarMap: Record<string, string> = {};
    for (const avatar of avatars || []) {
      avatarMap[avatar.character_id] = avatar.image_url;
    }

    return NextResponse.json({
      success: true,
      avatars: avatarMap,
      updatedAt: avatars?.[0]?.updated_at || null,
    });
  } catch (error) {
    console.error("[Character Avatars] Error:", error);
    return NextResponse.json({ avatars: {} });
  }
}
