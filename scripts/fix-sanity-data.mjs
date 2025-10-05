import { createClient } from '@sanity/client';
import fs from 'fs';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function fixIngredients() {
  // Get all ingredient documents
  const ingredients = await client.fetch('*[_type == "ingredient"]');
  
  console.log(`Found ${ingredients.length} ingredient documents`);
  
  // Read the correct data
  const correctData = fs.readFileSync('scripts/popular-ingredients.ndjson', 'utf-8')
    .trim()
    .split('\n')
    .map(line => JSON.parse(line));
  
  console.log(`Loaded ${correctData.length} correct ingredient records`);
  
  // Create a map of correct data by slug
  const correctDataMap = new Map();
  correctData.forEach(item => {
    correctDataMap.set(item.slug.current, item);
  });
  
  // Find existing docs that need updating
  for (const ingredient of ingredients) {
    const correctItem = correctDataMap.get(ingredient.slug.current);
    
    if (correctItem) {
      // Check if sideEffects or interactions are strings
      const needsUpdate = 
        typeof ingredient.sideEffects === 'string' ||
        typeof ingredient.interactions === 'string';
      
      if (needsUpdate) {
        console.log(`Updating ${ingredient.name}...`);
        
        await client
          .patch(ingredient._id)
          .set({
            sideEffects: Array.isArray(correctItem.sideEffects) 
              ? correctItem.sideEffects 
              : [correctItem.sideEffects],
            interactions: Array.isArray(correctItem.interactions)
              ? correctItem.interactions
              : [correctItem.interactions],
          })
          .commit();
        
        console.log(`✓ Updated ${ingredient.name}`);
      } else {
        console.log(`✓ ${ingredient.name} already correct`);
      }
    }
  }
  
  console.log('\nDone!');
}

fixIngredients().catch(console.error);
