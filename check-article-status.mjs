import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

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

// 全成分を取得
const ingredients = await client.fetch(
  `*[_type == 'ingredient'] | order(name asc) {
    _id,
    name,
    slug,
    category,
    evidenceLevel
  }`
);

console.log(`現在の成分記事数: ${ingredients.length}\n`);

// カテゴリー別に集計
const byCategory = {};
ingredients.forEach(ing => {
  const cat = ing.category || '未分類';
  byCategory[cat] = (byCategory[cat] || 0) + 1;
});

console.log('=== カテゴリー別記事数 ===');
Object.entries(byCategory).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`${cat}: ${count}件`);
});

console.log('\n=== 人気のある成分で未掲載のもの候補 ===');
const popularSupplements = [
  'クレアチン', 'グルタミン', 'L-カルニチン', 'α-リポ酸',
  'リコピン', 'アスタキサンチン', 'レスベラトロール',
  '亜麻仁油', 'ギンコ（イチョウ葉）', 'ロディオラ',
  'スピルリナ', 'クロレラ', 'マカ', 'トンカットアリ',
  'ノコギリヤシ', 'ミルクシスル', 'ウコン（ターメリック）',
  'シリマリン', 'ベルベリン', 'ブラックコホシュ'
];

const existing = new Set(ingredients.map(i => i.name));
const missing = popularSupplements.filter(s => !existing.has(s));

console.log('未掲載の人気成分:');
missing.forEach((supp, i) => {
  console.log(`${i + 1}. ${supp}`);
});

console.log('\n=== 推奨する次の記事（優先度順） ===');
console.log('1. クレアチン - スポーツパフォーマンス・筋力向上（エビデンスレベル: A）');
console.log('2. ウコン（ターメリック/クルクミン） - 抗炎症・肝機能（エビデンスレベル: B）');
console.log('3. ギンコ（イチョウ葉） - 認知機能・血流改善（エビデンスレベル: B）');
console.log('4. L-カルニチン - 脂肪燃焼・エネルギー代謝（エビデンスレベル: B）');
console.log('5. アスタキサンチン - 抗酸化・目の健康（エビデンスレベル: B）');
console.log('6. ノコギリヤシ - 前立腺健康（エビデンスレベル: B）');
console.log('7. マカ - 活力・ホルモンバランス（エビデンスレベル: C）');
console.log('8. レスベラトロール - 抗酸化・長寿（エビデンスレベル: C）');
console.log('9. ミルクシスル（シリマリン） - 肝臓保護（エビデンスレベル: B）');
console.log('10. α-リポ酸 - 抗酸化・血糖調節（エビデンスレベル: B）');
