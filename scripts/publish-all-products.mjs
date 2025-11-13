#!/usr/bin/env node

/**
 * すべての商品をSanityで公開する
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, "../apps/web/.env.local");
const envContent = readFileSync(envPath, "utf8");

const SANITY_PROJECT_ID = envContent.match(/NEXT_PUBLIC_SANITY_PROJECT_ID=(.+)/)?.[1]?.trim();
const SANITY_DATASET = envContent.match(/NEXT_PUBLIC_SANITY_DATASET=(.+)/)?.[1]?.trim();
const SANITY_API_TOKEN = envContent.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: SANITY_API_TOKEN,
});

async function publishAllProducts() {
  console.log("🚀 すべての商品を公開します\n");

  try {
    // すべての商品を取得（ドラフト含む）
    const query = `*[_type == "product"]{_id, name}`;
    const products = await client.fetch(query);

    console.log(`✅ ${products.length}件の商品を取得しました\n`);

    let published = 0;
    let errors = 0;

    for (const product of products) {
      try {
        // ドラフトIDの場合
        if (product._id.startsWith("drafts.")) {
          const publishedId = product._id.replace("drafts.", "");

          // ドラフトのコンテンツを取得
          const draft = await client.getDocument(product._id);

          // 公開バージョンとして保存
          await client.createOrReplace({
            ...draft,
            _id: publishedId,
          });

          // ドラフトを削除
          await client.delete(product._id);

          console.log(`✅ 公開: ${product.name.substring(0, 60)}...`);
          published++;
        } else {
          console.log(`⏭️  既に公開済み: ${product.name.substring(0, 60)}...`);
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`❌ エラー: ${product.name.substring(0, 60)}... - ${error.message}`);
        errors++;
      }
    }

    console.log(`\n\n📊 結果:`);
    console.log(`  ✅ 公開: ${published}件`);
    console.log(`  ❌ エラー: ${errors}件`);
    console.log(`\n✅ 完了しました！`);

  } catch (error) {
    console.error("❌ エラー:", error);
    process.exit(1);
  }
}

publishAllProducts();
