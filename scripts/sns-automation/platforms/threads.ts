// Threads API 投稿モジュール
import type { PostResult } from '../types';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';

// Threads API でテキスト投稿を作成
export async function postToThreads(text: string): Promise<PostResult> {
  const userId = process.env.THREADS_USER_ID;
  const accessToken = process.env.THREADS_ACCESS_TOKEN;

  if (!userId || !accessToken) {
    return {
      success: false,
      platform: 'threads',
      error: 'Threads credentials not configured',
    };
  }

  try {
    // Step 1: メディアコンテナを作成（テキストのみ）
    console.log('📝 Threadsコンテナを作成中...');
    const containerResponse = await fetch(
      `${THREADS_API_BASE}/${userId}/threads`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          media_type: 'TEXT',
          text: text,
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

    console.log('✅ Threadsコンテナ作成完了:', containerId);

    // Step 2: コンテナのステータスを確認（処理完了を待つ）
    let status = 'IN_PROGRESS';
    let attempts = 0;
    const maxAttempts = 10;

    while (status === 'IN_PROGRESS' && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2秒待機

      const statusResponse = await fetch(
        `${THREADS_API_BASE}/${containerId}?fields=status&access_token=${accessToken}`
      );

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        status = statusData.status || 'FINISHED';
      }

      attempts++;
    }

    if (status === 'ERROR') {
      throw new Error('Threads container processing failed');
    }

    // Step 3: 投稿を公開
    console.log('📤 Threadsに投稿中...');
    const publishResponse = await fetch(
      `${THREADS_API_BASE}/${userId}/threads_publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
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
      platform: 'threads',
      postId: publishData.id,
    };
  } catch (error) {
    console.error('Threads posting error:', error);
    return {
      success: false,
      platform: 'threads',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 認証情報チェック
export function checkThreadsCredentials(): boolean {
  return !!(
    process.env.THREADS_USER_ID && process.env.THREADS_ACCESS_TOKEN
  );
}
