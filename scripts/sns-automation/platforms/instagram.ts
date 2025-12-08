// Instagram Graph API 投稿モジュール
import type { PostResult } from '../types';

const INSTAGRAM_API_BASE = 'https://graph.facebook.com/v21.0';

// Instagram Graph API で画像投稿を作成
export async function postToInstagram(
  caption: string,
  imageUrl: string
): Promise<PostResult> {
  const userId = process.env.INSTAGRAM_USER_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!userId || !accessToken) {
    return {
      success: false,
      platform: 'instagram',
      error: 'Instagram credentials not configured',
    };
  }

  try {
    // Step 1: メディアコンテナを作成
    console.log('📸 メディアコンテナを作成中...');
    const containerResponse = await fetch(
      `${INSTAGRAM_API_BASE}/${userId}/media`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: caption,
          access_token: accessToken,
        }),
      }
    );

    if (!containerResponse.ok) {
      const errorData = await containerResponse.json();
      throw new Error(
        `Container creation failed: ${JSON.stringify(errorData)}`
      );
    }

    const containerData = await containerResponse.json();
    const containerId = containerData.id;

    if (!containerId) {
      throw new Error('Failed to get container ID');
    }

    console.log('✅ メディアコンテナ作成完了:', containerId);

    // Step 2: コンテナのステータスを確認（処理完了を待つ）
    let status = 'IN_PROGRESS';
    let attempts = 0;
    const maxAttempts = 10;

    while (status === 'IN_PROGRESS' && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2秒待機

      const statusResponse = await fetch(
        `${INSTAGRAM_API_BASE}/${containerId}?fields=status_code&access_token=${accessToken}`
      );

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        status = statusData.status_code || 'FINISHED';
      }

      attempts++;
    }

    if (status === 'ERROR') {
      throw new Error('Media container processing failed');
    }

    // Step 3: メディアを公開
    console.log('📤 メディアを公開中...');
    const publishResponse = await fetch(
      `${INSTAGRAM_API_BASE}/${userId}/media_publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: accessToken,
        }),
      }
    );

    if (!publishResponse.ok) {
      const errorData = await publishResponse.json();
      throw new Error(`Publish failed: ${JSON.stringify(errorData)}`);
    }

    const publishData = await publishResponse.json();

    return {
      success: true,
      platform: 'instagram',
      postId: publishData.id,
    };
  } catch (error) {
    console.error('Instagram posting error:', error);
    return {
      success: false,
      platform: 'instagram',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 認証情報チェック
export function checkInstagramCredentials(): boolean {
  return !!(
    process.env.INSTAGRAM_USER_ID && process.env.INSTAGRAM_ACCESS_TOKEN
  );
}
