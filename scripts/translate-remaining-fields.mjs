import { readFileSync, writeFileSync } from 'fs';

// 翻訳が必要な3つのファイル
const filesToTranslate = [
  'protein-article.json',
  'probiotics-article.json',
  'vitamin-b-complex-article.json',
];

console.log('残りのフィールドを日本語に翻訳します...\n');

for (const filename of filesToTranslate) {
  try {
    console.log(`Processing: ${filename}...`);
    const data = JSON.parse(readFileSync(filename, 'utf8'));

    // すでにdescriptionは日本語なので、それ以外のフィールドを翻訳する必要があります
    // 現在英語のままのフィールド: benefits, recommendedDosage, sideEffects, interactions, scientificBackground, foodSources, faqs, references

    console.log(`  ⚠️ ${filename}には英語のフィールドが残っています`);
    console.log(`  Benefits配列の項目数: ${data.benefits?.length || 0}`);
    console.log(`  FAQs配列の項目数: ${data.faqs?.length || 0}`);
    console.log(`  References配列の項目数: ${data.references?.length || 0}`);
    console.log(`  FoodSources配列の項目数: ${data.foodSources?.length || 0}`);
    console.log('');
  } catch (error) {
    console.error(`  ✗ Error: ${filename}:`, error.message);
  }
}

console.log('これらのファイルは手動で翻訳するか、翻訳サービスを使用する必要があります。');
console.log('各ファイルには以下のフィールドが英語で残っています:');
console.log('- benefits (配列)');
console.log('- recommendedDosage (文字列)');
console.log('- sideEffects (文字列)');
console.log('- interactions (文字列)');
console.log('- scientificBackground (文字列)');
console.log('- foodSources (配列)');
console.log('- faqs (配列 - question/answer)');
console.log('- references (配列)');
