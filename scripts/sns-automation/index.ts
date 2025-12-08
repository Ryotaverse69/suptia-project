#!/usr/bin/env npx tsx
// SNS自動投稿 メインエントリ
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// .env.local を明示的に読み込み（全ての環境変数）
const result = dotenv.config({ path: resolve(process.cwd(), '.env.local') });
if (result.error) {
  console.error('Failed to load .env.local:', result.error);
}

import { getRandomContent } from './sanity-client';
import { generateIngredientPost, generateProductPost } from './post-generator';
import { postToX, checkXCredentials } from './platforms/x';
import { postToInstagram, checkInstagramCredentials } from './platforms/instagram';
import { postToThreads, checkThreadsCredentials } from './platforms/threads';
import { generateImage, checkGoogleAICredentials } from './image-generator';
import { uploadImageToCloudinary, checkCloudinaryCredentials } from './cloudinary-upload';
import type { IngredientData, ProductData, PostResult } from './types';

async function main() {
  console.log('🚀 SNS自動投稿を開始...\n');

  // 認証情報チェック
  const platforms = {
    x: checkXCredentials(),
    instagram: checkInstagramCredentials(),
    threads: checkThreadsCredentials(),
  };

  const imageServices = {
    googleAI: checkGoogleAICredentials(),
    cloudinary: checkCloudinaryCredentials(),
  };

  console.log('📋 プラットフォーム状態:');
  console.log(`  - X (Twitter): ${platforms.x ? '✅ 設定済み' : '❌ 未設定'}`);
  console.log(`  - Instagram: ${platforms.instagram ? '✅ 設定済み' : '❌ 未設定'}`);
  console.log(`  - Threads: ${platforms.threads ? '✅ 設定済み' : '❌ 未設定'}`);
  console.log('');
  console.log('🖼️ 画像サービス状態:');
  console.log(`  - Google AI (Imagen): ${imageServices.googleAI ? '✅ 設定済み' : '❌ 未設定'}`);
  console.log(`  - Cloudinary: ${imageServices.cloudinary ? '✅ 設定済み' : '❌ 未設定'}\n`);

  // コンテンツ取得
  console.log('📥 Sanityからコンテンツを取得中...');
  const content = await getRandomContent();

  if (!content) {
    console.error('❌ コンテンツの取得に失敗しました');
    process.exit(1);
  }

  console.log(`✅ ${content.type === 'ingredient' ? '成分' : '商品'}を取得: ${(content.data as IngredientData | ProductData).name}\n`);

  // 投稿文生成
  console.log('✍️ 投稿文を生成中...');
  let posts;
  if (content.type === 'ingredient') {
    posts = await generateIngredientPost(content.data as IngredientData);
  } else {
    posts = await generateProductPost(content.data as ProductData);
  }

  console.log('\n📝 生成された投稿:');
  console.log('--- X用 ---');
  console.log(posts.x);
  console.log(`(${posts.x.length}文字)\n`);

  // 各プラットフォームに投稿
  const results: PostResult[] = [];

  // X投稿
  if (platforms.x) {
    console.log('📤 Xに投稿中...');
    const xResult = await postToX(posts.x);
    results.push(xResult);

    if (xResult.success) {
      console.log(`✅ X投稿成功 (ID: ${xResult.postId})`);
    } else {
      console.error(`❌ X投稿失敗: ${xResult.error}`);
    }
  }

  // Instagram投稿（画像生成が必要）
  if (platforms.instagram && imageServices.googleAI && imageServices.cloudinary) {
    console.log('\n📸 Instagram投稿を準備中...');

    // 画像を生成
    console.log('🎨 画像を生成中...');
    const imageResult = await generateImage(content.data as IngredientData | ProductData, content.type);

    if (imageResult.success && imageResult.imageBase64) {
      // Cloudinaryにアップロード
      const fileName = `${content.type}-${(content.data as IngredientData | ProductData).slug?.current || 'post'}-${Date.now()}`;
      console.log('☁️ Cloudinaryにアップロード中...');
      const uploadResult = await uploadImageToCloudinary(
        imageResult.imageBase64,
        imageResult.mimeType || 'image/png',
        fileName
      );

      if (uploadResult.success && uploadResult.url) {
        // Instagramに投稿
        console.log('📤 Instagramに投稿中...');
        const igResult = await postToInstagram(posts.instagram, uploadResult.url);
        results.push(igResult);

        if (igResult.success) {
          console.log(`✅ Instagram投稿成功 (ID: ${igResult.postId})`);
        } else {
          console.error(`❌ Instagram投稿失敗: ${igResult.error}`);
        }
      } else {
        console.error('❌ Cloudinaryアップロード失敗:', uploadResult.error);
        results.push({
          success: false,
          platform: 'instagram',
          error: `Cloudinary upload failed: ${uploadResult.error}`,
        });
      }
    } else {
      console.error('❌ 画像生成失敗:', imageResult.error);
      results.push({
        success: false,
        platform: 'instagram',
        error: `Image generation failed: ${imageResult.error}`,
      });
    }
  } else if (platforms.instagram) {
    console.log('⚠️ Instagram: 画像サービスが未設定のためスキップ');
  }

  // Threads投稿
  if (platforms.threads) {
    console.log('\n🧵 Threadsに投稿中...');
    const threadsResult = await postToThreads(posts.threads);
    results.push(threadsResult);

    if (threadsResult.success) {
      console.log(`✅ Threads投稿成功 (ID: ${threadsResult.postId})`);
    } else {
      console.error(`❌ Threads投稿失敗: ${threadsResult.error}`);
    }
  }

  // 結果サマリー
  console.log('\n📊 結果サマリー:');
  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;
  console.log(`  成功: ${successCount}, 失敗: ${failCount}`);

  if (failCount > 0) {
    console.log('\n⚠️ 失敗した投稿:');
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`  - ${r.platform}: ${r.error}`);
      });
    process.exit(1);
  }

  console.log('\n✨ SNS自動投稿が完了しました');
}

main().catch((error) => {
  console.error('❌ エラーが発生しました:', error);
  process.exit(1);
});
