import { readFileSync } from 'fs';

// Read token directly from .env.local
const envFile = readFileSync('apps/web/.env.local', 'utf8');
const tokenMatch = envFile.match(/SANITY_API_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : null;

if (!token) {
  console.error('Error: SANITY_API_TOKEN not found');
  process.exit(1);
}

console.log('Token found, length:', token.length);

const mutations = JSON.parse(readFileSync('update-all-ingredients.json', 'utf8'));

console.log(`Sending ${mutations.mutations.length} mutations to Sanity API...`);

try {
  const response = await fetch('https://fny3jdcg.api.sanity.io/v2023-05-03/data/mutate/production', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mutations),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('Error response:', JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log('\n✓ Success! Updated', result.results?.length || 0, 'documents');
  console.log('\nDetails:');
  console.log(JSON.stringify(result, null, 2));

} catch (error) {
  console.error('Error executing mutations:', error.message);
  process.exit(1);
}
