import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

// Read token directly from .env.local
const envFile = readFileSync('apps/web/.env.local', 'utf8');
const tokenMatch = envFile.match(/SANITY_API_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : null;

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token,
  useCdn: false,
});

const doc = await client.fetch('*[_type == "ingredient" && slug.current == "omega-3"][0]{_id, _updatedAt, name, benefits[0..2], recommendedDosage}');

console.log('Document ID:', doc._id);
console.log('Updated At:', doc._updatedAt);
console.log('Name:', doc.name);
console.log('\nBenefits (first 3):');
doc.benefits.forEach((b, i) => console.log(`  ${i+1}. ${b.substring(0, 100)}...`));
console.log('\nRecommendedDosage (first 200 chars):');
console.log(doc.recommendedDosage.substring(0, 200) + '...');
