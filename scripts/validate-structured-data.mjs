#!/usr/bin/env node

/**
 * 構造化データ自動検証スクリプト
 *
 * 本番環境のページから構造化データ（JSON-LD）を抽出して検証します。
 *
 * 使用方法:
 *   node scripts/validate-structured-data.mjs
 *   node scripts/validate-structured-data.mjs --url https://suptia.com/products/slug
 *   node scripts/validate-structured-data.mjs --type product
 *   node scripts/validate-structured-data.mjs --verbose
 */

import https from 'https';
import http from 'http';
import { JSDOM } from 'jsdom';

const SITE_URL = 'https://suptia.com';

// テスト対象URL
const TEST_URLS = {
  products: [
    '/products/5-6-diet-1',
    '/products/1-150-diet-1',
    '/products/1-150-magnesium-supplement-diet',
  ],
  ingredients: [
    '/ingredients/beta-alanine',
    '/ingredients/coq10',
    '/ingredients/echinacea',
  ],
  lists: [
    '/products',
    '/ingredients',
  ],
  diagnosis: [
    '/diagnosis',
  ],
};

// コマンドライン引数パース
const args = process.argv.slice(2);
const options = {
  url: args.find(arg => arg.startsWith('--url='))?.split('=')[1],
  type: args.find(arg => arg.startsWith('--type='))?.split('=')[1],
  verbose: args.includes('--verbose') || args.includes('-v'),
};

/**
 * HTTPSリクエストでHTMLを取得
 */
function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${url}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * HTMLからJSON-LD構造化データを抽出
 */
function extractJsonLd(html) {
  const dom = new JSDOM(html);
  const scripts = dom.window.document.querySelectorAll('script[type="application/ld+json"]');

  const jsonLdData = [];
  scripts.forEach(script => {
    try {
      const data = JSON.parse(script.textContent);
      jsonLdData.push(data);
    } catch (e) {
      console.error('⚠️  JSON-LD parse error:', e.message);
    }
  });

  return jsonLdData;
}

/**
 * Product Schemaを検証
 */
function validateProductSchema(data) {
  const errors = [];
  const warnings = [];

  if (data['@type'] !== 'Product') {
    errors.push('@type must be "Product"');
    return { valid: false, errors, warnings };
  }

  // 必須フィールド
  if (!data.name) errors.push('Missing required field: name');
  if (!data.offers) errors.push('Missing required field: offers');

  // offers検証
  if (data.offers) {
    const offerType = data.offers['@type'];

    if (offerType === 'AggregateOffer') {
      if (!data.offers.lowPrice) errors.push('AggregateOffer missing lowPrice');
      if (!data.offers.highPrice) errors.push('AggregateOffer missing highPrice');
      if (!data.offers.offerCount) warnings.push('AggregateOffer missing offerCount');
      if (!data.offers.priceCurrency) errors.push('Missing priceCurrency');

      // 価格の妥当性チェック
      if (data.offers.lowPrice && data.offers.highPrice) {
        if (data.offers.lowPrice > data.offers.highPrice) {
          errors.push('lowPrice cannot be greater than highPrice');
        }
      }
    } else if (offerType === 'Offer') {
      if (!data.offers.price) errors.push('Offer missing price');
      if (!data.offers.priceCurrency) errors.push('Missing priceCurrency');
    } else {
      errors.push(`Unknown offer type: ${offerType}`);
    }

    if (!data.offers.availability) warnings.push('Missing availability');
  }

  // 推奨フィールド
  if (!data.description) warnings.push('Missing recommended field: description');
  if (!data.image) warnings.push('Missing recommended field: image');
  if (!data.brand) warnings.push('Missing recommended field: brand');

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * FAQ Schemaを検証
 */
function validateFaqSchema(data) {
  const errors = [];
  const warnings = [];

  if (data['@type'] !== 'FAQPage') {
    errors.push('@type must be "FAQPage"');
    return { valid: false, errors, warnings };
  }

  if (!data.mainEntity || !Array.isArray(data.mainEntity)) {
    errors.push('Missing mainEntity array');
    return { valid: false, errors, warnings };
  }

  if (data.mainEntity.length === 0) {
    warnings.push('mainEntity is empty');
  }

  // 各質問を検証
  data.mainEntity.forEach((item, index) => {
    if (item['@type'] !== 'Question') {
      errors.push(`mainEntity[${index}]: @type must be "Question"`);
    }
    if (!item.name) {
      errors.push(`mainEntity[${index}]: Missing name (question text)`);
    }
    if (!item.acceptedAnswer) {
      errors.push(`mainEntity[${index}]: Missing acceptedAnswer`);
    } else {
      if (item.acceptedAnswer['@type'] !== 'Answer') {
        errors.push(`mainEntity[${index}]: acceptedAnswer @type must be "Answer"`);
      }
      if (!item.acceptedAnswer.text) {
        errors.push(`mainEntity[${index}]: acceptedAnswer missing text`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Breadcrumb Schemaを検証
 */
function validateBreadcrumbSchema(data) {
  const errors = [];
  const warnings = [];

  if (data['@type'] !== 'BreadcrumbList') {
    errors.push('@type must be "BreadcrumbList"');
    return { valid: false, errors, warnings };
  }

  if (!data.itemListElement || !Array.isArray(data.itemListElement)) {
    errors.push('Missing itemListElement array');
    return { valid: false, errors, warnings };
  }

  if (data.itemListElement.length === 0) {
    errors.push('itemListElement is empty');
  }

  // 各アイテムを検証
  data.itemListElement.forEach((item, index) => {
    if (item['@type'] !== 'ListItem') {
      errors.push(`itemListElement[${index}]: @type must be "ListItem"`);
    }
    if (!item.position) {
      errors.push(`itemListElement[${index}]: Missing position`);
    } else if (item.position !== index + 1) {
      errors.push(`itemListElement[${index}]: position should be ${index + 1}, got ${item.position}`);
    }
    if (!item.name) {
      errors.push(`itemListElement[${index}]: Missing name`);
    }
    if (!item.item) {
      warnings.push(`itemListElement[${index}]: Missing item URL`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Article Schemaを検証
 */
function validateArticleSchema(data) {
  const errors = [];
  const warnings = [];

  if (data['@type'] !== 'Article') {
    errors.push('@type must be "Article"');
    return { valid: false, errors, warnings };
  }

  // 必須フィールド
  if (!data.headline) errors.push('Missing required field: headline');
  if (!data.datePublished) warnings.push('Missing recommended field: datePublished');
  if (!data.author) warnings.push('Missing recommended field: author');

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 構造化データを検証
 */
function validateStructuredData(jsonLdArray, expectedTypes) {
  const results = [];

  jsonLdArray.forEach((data, index) => {
    const type = data['@type'];
    let validation;

    switch (type) {
      case 'Product':
        validation = validateProductSchema(data);
        break;
      case 'FAQPage':
        validation = validateFaqSchema(data);
        break;
      case 'BreadcrumbList':
        validation = validateBreadcrumbSchema(data);
        break;
      case 'Article':
        validation = validateArticleSchema(data);
        break;
      default:
        validation = {
          valid: true,
          errors: [],
          warnings: [`Unknown schema type: ${type}`],
        };
    }

    results.push({
      type,
      index,
      ...validation,
    });
  });

  return results;
}

/**
 * URLを検証
 */
async function validateUrl(url, verbose = false) {
  console.log(`\n🔍 Testing: ${url}`);
  console.log('━'.repeat(80));

  try {
    const html = await fetchHtml(url);
    const jsonLdArray = extractJsonLd(html);

    if (jsonLdArray.length === 0) {
      console.log('❌ No JSON-LD structured data found');
      return { success: false, url };
    }

    console.log(`✅ Found ${jsonLdArray.length} JSON-LD script(s)`);

    const validations = validateStructuredData(jsonLdArray);

    let hasErrors = false;

    validations.forEach(({ type, index, valid, errors, warnings }) => {
      console.log(`\n📄 Schema #${index + 1}: ${type}`);

      if (valid) {
        console.log('   ✅ Valid');
      } else {
        console.log('   ❌ Invalid');
        hasErrors = true;
      }

      if (errors.length > 0) {
        console.log('   \n   🚨 Errors:');
        errors.forEach(err => console.log(`      - ${err}`));
      }

      if (warnings.length > 0) {
        console.log('   \n   ⚠️  Warnings:');
        warnings.forEach(warn => console.log(`      - ${warn}`));
      }

      if (verbose) {
        console.log('\n   📋 Data:');
        console.log(JSON.stringify(jsonLdArray[index], null, 2).split('\n').map(line => `      ${line}`).join('\n'));
      }
    });

    return { success: !hasErrors, url };

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return { success: false, url, error: error.message };
  }
}

/**
 * メイン処理
 */
async function main() {
  console.log('\n🚀 Structured Data Validation Tool');
  console.log('━'.repeat(80));

  let urlsToTest = [];

  // URLが直接指定された場合
  if (options.url) {
    urlsToTest = [options.url];
  }
  // タイプが指定された場合
  else if (options.type) {
    const type = options.type.toLowerCase();
    if (TEST_URLS[type]) {
      urlsToTest = TEST_URLS[type].map(path => SITE_URL + path);
    } else {
      console.error(`❌ Unknown type: ${options.type}`);
      console.log(`Available types: ${Object.keys(TEST_URLS).join(', ')}`);
      process.exit(1);
    }
  }
  // デフォルト: 全てテスト
  else {
    urlsToTest = Object.values(TEST_URLS)
      .flat()
      .map(path => SITE_URL + path);
  }

  console.log(`\nTesting ${urlsToTest.length} URL(s)...\n`);

  const results = [];

  for (const url of urlsToTest) {
    const result = await validateUrl(url, options.verbose);
    results.push(result);

    // レート制限対策（500ms待機）
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // サマリー
  console.log('\n\n📊 Summary');
  console.log('━'.repeat(80));

  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  console.log(`✅ Passed: ${successCount}/${results.length}`);
  console.log(`❌ Failed: ${failCount}/${results.length}`);

  if (failCount > 0) {
    console.log('\n🚨 Failed URLs:');
    results
      .filter(r => !r.success)
      .forEach(r => console.log(`   - ${r.url}`));
  }

  console.log('\n');

  // 終了コード
  process.exit(failCount > 0 ? 1 : 0);
}

main();
