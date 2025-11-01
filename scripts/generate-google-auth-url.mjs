#!/usr/bin/env node

/**
 * Google OAuth 2.0認証URLを生成し、リフレッシュトークンを取得するヘルパースクリプト
 *
 * 使い方:
 * 1. Google Cloud Consoleで OAuth 2.0 クライアントIDを作成
 * 2. このスクリプトを実行
 * 3. 表示されたURLをブラウザで開き、Googleアカウントで認証
 * 4. 認証コードをコピーして、プロンプトに入力
 * 5. リフレッシュトークンが表示される
 */

import { createInterface } from 'readline';
import { URL } from 'url';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('🔐 Google OAuth 2.0 認証ヘルパー\n');

// ステップ1: クライアント情報を入力
const clientId = await question('📝 Client ID を入力してください: ');
const clientSecret = await question('📝 Client Secret を入力してください: ');

// OAuth認証URL生成
const redirectUri = 'urn:ietf:wg:oauth:2.0:oob';
const scope = 'https://www.googleapis.com/auth/webmasters.readonly';

const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.append('client_id', clientId.trim());
authUrl.searchParams.append('redirect_uri', redirectUri);
authUrl.searchParams.append('response_type', 'code');
authUrl.searchParams.append('scope', scope);
authUrl.searchParams.append('access_type', 'offline');
authUrl.searchParams.append('prompt', 'consent');

console.log('\n✅ 認証URLを生成しました:\n');
console.log('─'.repeat(80));
console.log(authUrl.toString());
console.log('─'.repeat(80));
console.log('\n📌 次のステップ:');
console.log('1. 上記のURLをブラウザで開く');
console.log('2. Googleアカウントでログイン');
console.log('3. Search Consoleへのアクセスを許可');
console.log('4. 表示された認証コードをコピー\n');

const authCode = await question('📝 認証コード (Authorization Code) を入力してください: ');

// トークン取得
console.log('\n🔄 リフレッシュトークンを取得中...\n');

const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    code: authCode.trim(),
    client_id: clientId.trim(),
    client_secret: clientSecret.trim(),
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  }),
});

if (!tokenResponse.ok) {
  const error = await tokenResponse.text();
  console.error('❌ エラー:', error);
  process.exit(1);
}

const tokens = await tokenResponse.json();

console.log('✅ 成功！以下の情報をClaude Desktop設定に追加してください:\n');
console.log('─'.repeat(80));
console.log('{');
console.log('  "mcpServers": {');
console.log('    "google-search-console": {');
console.log('      "command": "npx",');
console.log('      "args": ["-y", "@modelcontextprotocol/server-google-search-console"],');
console.log('      "env": {');
console.log(`        "GOOGLE_CLIENT_ID": "${clientId.trim()}",`);
console.log(`        "GOOGLE_CLIENT_SECRET": "${clientSecret.trim()}",`);
console.log(`        "GOOGLE_REFRESH_TOKEN": "${tokens.refresh_token}"`);
console.log('      }');
console.log('    }');
console.log('  }');
console.log('}');
console.log('─'.repeat(80));

console.log('\n📝 apps/web/.env.local にも追加してください:\n');
console.log(`GOOGLE_CLIENT_ID=${clientId.trim()}`);
console.log(`GOOGLE_CLIENT_SECRET=${clientSecret.trim()}`);
console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);

console.log('\n✅ セットアップ完了！Claude Desktopを再起動してください。\n');

rl.close();
