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

const slugs = [
  'omega-3', 'magnesium', 'zinc', 'vitamin-a', 'vitamin-k', 'vitamin-b12',
  'vitamin-c', 'vitamin-d', 'vitamin-e', 'niacin', 'calcium', 'iron',
  'bcaa', 'nac', 'protein', 'probiotics', 'vitamin-b-complex', 'folic-acid',
  'coenzyme-q10', 'collagen', 'glucosamine', 'lutein', 'ashwagandha',
  'magnesium-glycinate', 'chromium', 'iodine', 'selenium', 'potassium'
];

// Check if text has substantial English (5+ common English words)
function hasEnglish(text) {
  if (!text) return false;
  if (typeof text === 'string') {
    const commonEnglishWords = /\b(the|is|are|was|were|been|being|have|has|had|do|does|did|will|would|should|could|may|might|can|must|of|in|on|at|to|for|with|from|by|about|through|during|before|after|above|below|between|among|under|over|into|onto|upon|within|without|against|towards|toward|throughout)\b/gi;
    const matches = text.match(commonEnglishWords);
    return matches && matches.length >= 5;
  }
  return false;
}

async function checkFAQs() {
  console.log('Checking FAQs for English content...\n');

  const results = [];

  for (const slug of slugs) {
    const ingredient = await client.fetch(
      `*[_type == "ingredient" && slug.current == $slug][0]{
        name,
        slug,
        faqs
      }`,
      { slug }
    );

    if (!ingredient || !ingredient.faqs) {
      continue;
    }

    const englishFAQs = [];

    ingredient.faqs.forEach((faq, index) => {
      if (hasEnglish(faq.question) || hasEnglish(faq.answer)) {
        englishFAQs.push({
          index,
          question: faq.question.substring(0, 100),
          hasEnglishQuestion: hasEnglish(faq.question),
          hasEnglishAnswer: hasEnglish(faq.answer)
        });
      }
    });

    if (englishFAQs.length > 0) {
      console.log(`🔴 ${ingredient.name} (${slug}): ${englishFAQs.length} FAQs with English`);
      englishFAQs.forEach(faq => {
        const issues = [];
        if (faq.hasEnglishQuestion) issues.push('question');
        if (faq.hasEnglishAnswer) issues.push('answer');
        console.log(`   FAQ ${faq.index + 1}: ${issues.join(', ')} - "${faq.question}..."`);
      });
      results.push({ slug, name: ingredient.name, count: englishFAQs.length });
    } else {
      console.log(`✅ ${ingredient.name} (${slug}): All Japanese`);
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Total ingredients checked: ${slugs.length}`);
  console.log(`Ingredients with English FAQs: ${results.length}`);

  if (results.length > 0) {
    console.log('\nIngredients needing translation:');
    results.forEach(r => {
      console.log(`  - ${r.name} (${r.slug}): ${r.count} FAQs`);
    });
  }

  return results;
}

checkFAQs().catch(console.error);
