/**
 * アバター画像アップロードユーティリティ
 *
 * Supabase Storageへの画像アップロード・削除処理
 */

import { createClient } from "@/lib/supabase/client";

const BUCKET_NAME = "avatars";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * 画像ファイルのバリデーション
 */
function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "JPG、PNG、WebP形式のみアップロード可能です";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "ファイルサイズは2MB以下にしてください";
  }
  return null;
}

/**
 * アバター画像をアップロード
 */
export async function uploadAvatar(
  userId: string,
  file: File,
): Promise<UploadResult> {
  // バリデーション
  const validationError = validateFile(file);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const supabase = createClient();

  // ファイル名生成（タイムスタンプ付きで上書き対応）
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${userId}/avatar.${fileExt}`;

  try {
    // 既存のアバターを削除（エラーは無視）
    await deleteExistingAvatars(userId);

    // 新しいアバターをアップロード
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("[avatar-upload] Upload error:", uploadError);
      return {
        success: false,
        error: `アップロードに失敗しました: ${uploadError.message}`,
      };
    }

    // 公開URLを取得
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

    // キャッシュバスティング用のタイムスタンプを追加
    const urlWithTimestamp = `${publicUrl}?t=${Date.now()}`;

    return { success: true, url: urlWithTimestamp };
  } catch (err) {
    console.error("[avatar-upload] Unexpected error:", err);
    return {
      success: false,
      error: "予期しないエラーが発生しました",
    };
  }
}

/**
 * 既存のアバター画像を削除
 */
async function deleteExistingAvatars(userId: string): Promise<void> {
  const supabase = createClient();

  try {
    // ユーザーフォルダ内のファイル一覧を取得
    const { data: files } = await supabase.storage
      .from(BUCKET_NAME)
      .list(userId);

    if (files && files.length > 0) {
      const filePaths = files.map(
        (f: { name: string }) => `${userId}/${f.name}`,
      );
      await supabase.storage.from(BUCKET_NAME).remove(filePaths);
    }
  } catch (err) {
    // 削除エラーは無視（ファイルが存在しない場合など）
    console.warn("[avatar-upload] Delete existing avatars warning:", err);
  }
}

/**
 * アバター画像を削除
 */
export async function deleteAvatar(userId: string): Promise<boolean> {
  const supabase = createClient();

  try {
    const { data: files } = await supabase.storage
      .from(BUCKET_NAME)
      .list(userId);

    if (files && files.length > 0) {
      const filePaths = files.map(
        (f: { name: string }) => `${userId}/${f.name}`,
      );
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove(filePaths);

      if (error) {
        console.error("[avatar-upload] Delete error:", error);
        return false;
      }
    }

    return true;
  } catch (err) {
    console.error("[avatar-upload] Delete unexpected error:", err);
    return false;
  }
}
