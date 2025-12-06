// X (Twitter) API v2 投稿モジュール
import crypto from 'crypto';
import type { PostResult, OAuthParams } from '../types';

const X_API_URL = 'https://api.twitter.com/2/tweets';

// 環境変数から認証情報を取得
function getCredentials() {
  const apiKey = process.env.X_API_KEY;
  const apiKeySecret = process.env.X_API_KEY_SECRET;
  const accessToken = process.env.X_ACCESS_TOKEN;
  const accessTokenSecret = process.env.X_ACCESS_TOKEN_SECRET;

  if (!apiKey || !apiKeySecret || !accessToken || !accessTokenSecret) {
    throw new Error('X API credentials are not configured');
  }

  return { apiKey, apiKeySecret, accessToken, accessTokenSecret };
}

// OAuth 1.0a 署名生成
function generateOAuthSignature(
  method: string,
  url: string,
  params: OAuthParams,
  consumerSecret: string,
  tokenSecret: string
): string {
  // パラメータをソートしてエンコード
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key as keyof OAuthParams] || '')}`)
    .join('&');

  // 署名ベース文字列を作成
  const signatureBase = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(sortedParams),
  ].join('&');

  // 署名キーを作成
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;

  // HMAC-SHA1で署名を生成
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(signatureBase)
    .digest('base64');

  return signature;
}

// OAuth 1.0a ヘッダー生成
function generateOAuthHeader(method: string, url: string): string {
  const { apiKey, apiKeySecret, accessToken, accessTokenSecret } = getCredentials();

  const oauthParams: OAuthParams = {
    oauth_consumer_key: apiKey,
    oauth_token: accessToken,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_version: '1.0',
  };

  // 署名を生成
  const signature = generateOAuthSignature(
    method,
    url,
    oauthParams,
    apiKeySecret,
    accessTokenSecret
  );

  oauthParams.oauth_signature = signature;

  // Authorizationヘッダー形式に変換
  const headerParts = Object.keys(oauthParams)
    .sort()
    .map((key) => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key as keyof OAuthParams] || '')}"`)
    .join(', ');

  return `OAuth ${headerParts}`;
}

// Xに投稿
export async function postToX(text: string): Promise<PostResult> {
  try {
    const authHeader = generateOAuthHeader('POST', X_API_URL);

    const response = await fetch(X_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('X API Error:', data);
      return {
        platform: 'x',
        success: false,
        error: data.detail || data.title || 'Unknown error',
      };
    }

    console.log('✅ X投稿成功:', data.data?.id);
    return {
      platform: 'x',
      success: true,
      postId: data.data?.id,
    };
  } catch (error) {
    console.error('X投稿エラー:', error);
    return {
      platform: 'x',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 文字数チェック（X: 280文字制限）
export function validateXPostLength(text: string): boolean {
  // 日本語は1文字=2としてカウントされる場合があるが、
  // Twitter APIは実際のUnicode文字数でカウント
  return text.length <= 280;
}

// テスト用: 認証情報の確認
export function checkXCredentials(): boolean {
  try {
    getCredentials();
    return true;
  } catch {
    return false;
  }
}
