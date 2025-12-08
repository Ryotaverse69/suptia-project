// Cloudinary 画像アップロードモジュール
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

// Cloudinary設定
function configureCloudinary(): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('Cloudinary credentials not fully configured');
    return false;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  return true;
}

// Base64画像をCloudinaryにアップロード
export async function uploadImageToCloudinary(
  imageBase64: string,
  mimeType: string,
  fileName: string
): Promise<UploadResult> {
  if (!configureCloudinary()) {
    return {
      success: false,
      error: 'Cloudinary not configured',
    };
  }

  try {
    // Data URI形式に変換
    const dataUri = `data:${mimeType};base64,${imageBase64}`;

    // アップロード
    const result: UploadApiResponse = await cloudinary.uploader.upload(dataUri, {
      folder: 'suptia-sns',
      public_id: fileName,
      resource_type: 'image',
      overwrite: true,
      // 最適化オプション
      transformation: [
        { width: 1080, height: 1080, crop: 'fill' }, // Instagram推奨サイズ
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });

    console.log('✅ Cloudinaryアップロード成功:', result.secure_url);

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 古い画像を削除（オプション：ストレージ節約用）
export async function deleteOldImages(daysOld: number = 30): Promise<void> {
  if (!configureCloudinary()) {
    return;
  }

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // suptia-snsフォルダの古い画像を検索して削除
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'suptia-sns/',
      max_results: 100,
    });

    const oldImages = result.resources.filter((resource: { created_at: string }) => {
      const createdAt = new Date(resource.created_at);
      return createdAt < cutoffDate;
    });

    if (oldImages.length > 0) {
      const publicIds = oldImages.map((img: { public_id: string }) => img.public_id);
      await cloudinary.api.delete_resources(publicIds);
      console.log(`🗑️ ${publicIds.length}件の古い画像を削除しました`);
    }
  } catch (error) {
    console.error('Failed to delete old images:', error);
  }
}

// 認証情報チェック
export function checkCloudinaryCredentials(): boolean {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}
