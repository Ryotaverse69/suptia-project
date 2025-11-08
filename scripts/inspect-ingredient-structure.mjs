#!/usr/bin/env node

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../apps/web/.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fny3jdcg",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function inspect() {
  // 成分参照がある商品
  const withRef = await client.fetch(
    `*[_type == "product" && slug.current == "8000-1000-off-d-3-1000iu-180-now-foods-vitamin-d-3-1-000-iu-180-softgels"][0]{ ingredients }`
  );

  console.log("成分参照がある商品:");
  console.log(JSON.stringify(withRef, null, 2));
  console.log("\n");

  // 成分参照がない商品
  const withoutRef = await client.fetch(
    `*[_type == "product" && slug.current == "afc-30-3-1-4"][0]{ ingredients }`
  );

  console.log("成分参照がない商品:");
  console.log(JSON.stringify(withoutRef, null, 2));
}

inspect()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
