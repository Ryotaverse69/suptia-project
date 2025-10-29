#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createNDJSON() {
  try {
    // 全ての記事JSONファイルを取得
    const files = await fs.readdir(__dirname);
    const articleFiles = files.filter(f => f.endsWith('-article.json'));

    console.log(`📚 ${articleFiles.length}件の記事ファイルを検出しました`);

    const documents = [];

    for (const file of articleFiles) {
      const filePath = path.join(__dirname, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const article = JSON.parse(content);

      // Sanityドキュメント形式に変換
      const doc = {
        _id: `ingredient-${article.slug?.current || article.slug}`,
        _type: 'ingredient',
        name: article.name,
        nameEn: article.nameEn,
        slug: {
          _type: 'slug',
          current: article.slug?.current || article.slug
        },
        category: article.category,
        evidenceLevel: article.evidenceLevel,
        safetyLevel: article.safetyLevel,
        riskLevel: article.riskLevel,
        description: article.description,
        benefits: article.benefits,
        foodSources: article.foodSources,
        recommendedDosage: article.recommendedDosage,
        sideEffects: article.sideEffects,
        interactions: article.interactions,
        overdoseRisks: article.overdoseRisks,
        specialWarnings: article.specialWarnings?.map((warning, index) => ({
          _key: `warning-${index}`,
          _type: 'specialWarning',
          severity: warning.severity,
          message: warning.message,
          affectedGroups: warning.affectedGroups
        })),
        contraindications: article.contraindications,
        faqs: article.faqs?.map((faq, index) => ({
          _key: `faq-${index}`,
          _type: 'faq',
          question: faq.question,
          answer: faq.answer
        })),
        references: article.references?.map((ref, index) => ({
          _key: `ref-${index}`,
          _type: 'reference',
          title: ref.title,
          url: ref.url,
          year: ref.year
        })),
        relatedIngredients: article.relatedIngredients,
        scientificBackground: article.scientificBackground,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        seoKeywords: article.seoKeywords
      };

      documents.push(doc);
      console.log(`✅ ${article.name} (${article.slug})`);
    }

    // NDJSON形式で出力（各行に1つのJSONオブジェクト）
    const ndjson = documents.map(doc => JSON.stringify(doc)).join('\n');

    const outputFile = path.join(__dirname, 'update-all-ingredients.ndjson');
    await fs.writeFile(outputFile, ndjson);

    console.log(`\n✨ NDJSONファイルを作成しました: ${outputFile}`);
    console.log(`\n📤 Sanityへインポートするには以下のコマンドを実行してください:`);
    console.log(`\n   npx sanity dataset import update-all-ingredients.ndjson production --replace\n`);

    // ファイルサイズと行数の情報を表示
    const stats = await fs.stat(outputFile);
    const fileSize = (stats.size / 1024).toFixed(2);
    console.log(`📊 ファイル情報:`);
    console.log(`   - ドキュメント数: ${documents.length}`);
    console.log(`   - ファイルサイズ: ${fileSize} KB`);

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

// 実行
createNDJSON().catch(console.error);