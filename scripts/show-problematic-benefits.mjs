#!/usr/bin/env node

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, '../apps/web/.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const client = createClient({
  projectId: envVars.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: envVars.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: envVars.SANITY_API_TOKEN,
  useCdn: false,
});

async function showProblematicBenefits() {
  const slugs = ['vitamin-c', 'glucosamine', 'zinc'];

  for (const slug of slugs) {
    const ingredient = await client.fetch(
      `*[_type == "ingredient" && slug.current == "${slug}"][0] { name, benefits }`
    );

    console.log(`\n${'='.repeat(80)}`);
    console.log(`記事: ${ingredient.name}`);
    console.log('='.repeat(80));

    ingredient.benefits.forEach((benefit, index) => {
      if (benefit.includes('健康的な状態の維持')) {
        console.log(`\n効果 ${index + 1}:`);
        console.log(benefit);
      }
    });
  }
}

showProblematicBenefits().catch(console.error);
