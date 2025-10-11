import { readFileSync } from 'fs';

const token = readFileSync('apps/web/.env.local', 'utf8')
  .match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();

// Transaction ID: pRlcpvz6Xc5z2Mc0MreLnI で既に実行済み
// このスクリプトは記録用です

console.log('✅ Benefits format fix already applied.');
console.log('Transaction ID: pRlcpvz6Xc5z2Mc0MreLnI');
