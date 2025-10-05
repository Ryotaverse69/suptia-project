import {createClient} from '@sanity/client';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env.local manually
const envPath = join(__dirname, '../apps/web/.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2];
  }
});

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: env.SANITY_API_TOKEN,
  useCdn: false,
});

const slugsToFix = [
  'collagen', 'protein', 'vitamin-b-complex', 'iron', 'probiotics',
  'coenzyme-q10', 'glucosamine', 'lutein', 'calcium', 'folic-acid'
];

async function deleteAndRecreate() {
  console.log('Fetching existing documents...');
  
  const existingDocs = await client.fetch(
    '*[_type == "ingredient" && slug.current in $slugs]{_id, name, slug}',
    { slugs: slugsToFix }
  );
  
  console.log('Found', existingDocs.length, 'documents to delete');
  
  if (existingDocs.length > 0) {
    console.log('Deleting documents...');
    const transaction = client.transaction();
    
    existingDocs.forEach(doc => {
      console.log('  - Deleting:', doc.name);
      transaction.delete(doc._id);
    });
    
    await transaction.commit();
    console.log('Deleted', existingDocs.length, 'documents');
  }
  
  console.log('\\nCreating new documents...');
  
  const correctData = fs.readFileSync('scripts/popular-ingredients.ndjson', 'utf-8')
    .trim()
    .split('\n')
    .filter(line => line.trim())
    .map(line => JSON.parse(line));
  
  const createTransaction = client.transaction();
  
  correctData.forEach(doc => {
    console.log('  + Creating:', doc.name);
    createTransaction.create({ ...doc, _type: 'ingredient' });
  });
  
  await createTransaction.commit();
  console.log('\\nCreated', correctData.length, 'new documents');
  console.log('Done!');
}

deleteAndRecreate().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
