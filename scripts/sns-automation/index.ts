#!/usr/bin/env npx tsx
// SNS自動投稿 メインエントリ（曜日別テーマ対応版）
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// .env.local を明示的に読み込み（apps/web/.env.localに統一）
const result = dotenv.config({ path: resolve(process.cwd(), 'apps/web/.env.local') });
if (result.error) {
  console.error('Failed to load apps/web/.env.local:', result.error);
}

import { getContentByTheme } from './sanity-client';
import { generatePostByTheme } from './post-generator';
import { selectRandomTheme, getThemeList } from './themes';
import { postToX, checkXCredentials } from './platforms/x';
import { postToInstagram, checkInstagramCredentials } from './platforms/instagram';
import { postToThreads, checkThreadsCredentials } from './platforms/threads';
import { generateImage, checkGoogleAICredentials } from './image-generator';
import { uploadImageToCloudinary, checkCloudinaryCredentials } from './cloudinary-upload';
import type { IngredientData, ProductData, PostResult, ThemeContent } from './types';

// コンテンツの表示名を取得
function getContentDisplayName(content: ThemeContent): string {
  switch (content.type) {
    case 'ingredient':
      return `成分: ${content.data.name}`;
    case 'product':
    case 'cospa':
      return `商品: ${content.data.name}`;
    case 'versus':
      return `比較: ${content.data.ingredient1.name} vs ${content.data.ingredient2.name}`;
    case 'ranking':
      return `ランキング: ${content.data.category}（${content.data.products.length}件）`;
    case 'caution':
      return `注意喚起: ${content.data.ingredient.name}`;
  }
}

// 画像生成用のデータを取得（ThemeContentを画像生成APIが扱えるタイプに変換）
function getImageGenerationData(content: ThemeContent): {
  data: IngredientData | ProductData;
  type: 'ingredient' | 'product';
  slug: string;
} {
  switch (content.type) {
    case 'ingredient':
      return {
        data: content.data,
        type: 'ingredient',
        slug: content.data.slug?.current || content.data.name,
      };
    case 'product':
    case 'cospa':
      return {
        data: content.data,
        type: 'product',
        slug: content.data.slug?.current || content.data.name,
      };
    case 'versus':
      // 比較の場合は最初の成分を使用
      return {
        data: content.data.ingredient1,
        type: 'ingredient',
        slug: `${content.data.ingredient1.name}-vs-${content.data.ingredient2.name}`,
      };
    case 'ranking':
      // ランキングの場合は最初の商品を使用
      return {
        data: content.data.products[0],
        type: 'product',
        slug: `ranking-${content.data.category}`,
      };
    case 'caution':
      return {
        data: content.data.ingredient,
        type: 'ingredient',
        slug: `caution-${content.data.ingredient.name}`,
      };
  }
}

async function main() {
  console.log('🚀 SNS自動投稿を開始...\n');

  // 重み付きランダムでテーマを選択
  const theme = selectRandomTheme();
  console.log('🎲 今日のテーマ（ランダム選択）:');
  console.log(`  ${theme.emoji} ${theme.label}（${theme.description}）\n`);

  // テーマの出現確率を表示
  console.log('📊 テーマ出現確率:');
  console.log(getThemeList().split('\n').map(line => `  ${line}`).join('\n'));
  console.log('');

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

  // テーマに応じたコンテンツ取得
  console.log(`📥 テーマ「${theme.label}」のコンテンツを取得中...`);
  const content = await getContentByTheme(theme.type);

  if (!content) {
    console.error('❌ コンテンツの取得に失敗しました');
    process.exit(1);
  }

  // コンテンツタイプに応じた表示
  const contentName = getContentDisplayName(content);
  console.log(`✅ コンテンツ取得: ${contentName}\n`);

  // 投稿文生成
  console.log('✍️ 投稿文を生成中...');
  const posts = await generatePostByTheme(content, theme);

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

    // 画像生成用のデータを準備
    const imageData = getImageGenerationData(content);

    // 画像を生成
    console.log('🎨 画像を生成中...');
    const imageResult = await generateImage(imageData.data, imageData.type);

    if (imageResult.success && imageResult.imageBase64) {
      // Cloudinaryにアップロード
      const fileName = `${content.type}-${imageData.slug || 'post'}-${Date.now()}`;
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
