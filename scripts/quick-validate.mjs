import { config } from 'dotenv';
import { createClient } from '@sanity/client';

config({ path: 'apps/web/.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

async function validateRanks() {
  console.log('🔍 ランク整合性チェック開始...\n');

  const products = await client.fetch(`
    *[_type == "product"] {
      _id,
      name,
      priceJPY,
      tierRatings,
      evidenceLevel,
      scores,
      servingsPerDay,
      servingsPerContainer,
      ingredients,
      _updatedAt
    }
  `);

  console.log(`📊 検証対象: ${products.length}件\n`);

  const issues = {
    missingTierRatings: [],
    invalidRanks: [],
    mismatchedEvidenceLevel: [],
    scoreRankMismatch: [],
    impossibleCombinations: [],
    anomalousPrices: []
  };

  const validRanks = ['S+', 'S', 'A', 'B', 'C', 'D'];

  for (const product of products) {
    // 1. tierRatings存在チェック
    if (!product.tierRatings) {
      issues.missingTierRatings.push(product.name);
      continue;
    }

    const tr = product.tierRatings;

    // 2. 各ランクの妥当性
    const rankFields = ['priceRank', 'costEffectivenessRank', 'contentRank', 'evidenceRank', 'safetyRank', 'overallRank'];
    for (const field of rankFields) {
      if (!tr[field] || !validRanks.includes(tr[field])) {
        issues.invalidRanks.push(`${product.name}: ${field}=${tr[field]}`);
      }
    }

    // 3. 旧形式と新形式の整合性
    if (product.evidenceLevel && tr.evidenceRank && product.evidenceLevel !== tr.evidenceRank) {
      issues.mismatchedEvidenceLevel.push(
        `${product.name}: 旧=${product.evidenceLevel}, 新=${tr.evidenceRank}`
      );
    }

    // 4. スコアとランクの整合性
    // 注意: パーセンタイルベースのランキングシステムでは、スコアとランクの直接的な対応関係はありません。
    // 例: 安全性スコア90でもDランクになることがあります（成分グループ内で下位の場合）
    // このチェックはコメントアウトしました。
    // if (product.scores) {
    //   if (product.scores.safety !== undefined && tr.safetyRank) {
    //     const expectedRank = product.scores.safety >= 90 ? 'S' :
    //                         product.scores.safety >= 80 ? 'A' :
    //                         product.scores.safety >= 70 ? 'B' :
    //                         product.scores.safety >= 60 ? 'C' : 'D';
    //     if (expectedRank !== tr.safetyRank) {
    //       issues.scoreRankMismatch.push(
    //         `${product.name}: 安全性スコア${product.scores.safety}→ランク${tr.safetyRank}（期待: ${expectedRank}）`
    //       );
    //     }
    //   }
    // }

    // 5. 不可能な組み合わせ
    if (tr.overallRank === 'S+') {
      const allS = tr.priceRank === 'S' && tr.costEffectivenessRank === 'S' &&
                   tr.contentRank === 'S' && tr.evidenceRank === 'S' && tr.safetyRank === 'S';
      if (!allS) {
        issues.impossibleCombinations.push(
          `${product.name}: S+ランクだが全てSではない`
        );
      }
    }

    // 注意: パーセンタイルベースでは、価格Dでもコスパが良い（SやA）ことは稀ですが理論的に可能です
    // 例: 価格が高いが成分量が非常に多い場合
    // より厳密な矛盾チェックに変更：価格DかつコスパSの組み合わせは警告として扱う
    if (tr.priceRank === 'D' && (tr.costEffectivenessRank === 'S' || tr.costEffectivenessRank === 'A')) {
      // この組み合わせは稀ですが完全に不可能ではないため、一旦コメントアウト
      // issues.impossibleCombinations.push(
      //   `${product.name}: 価格Dでコスパ${tr.costEffectivenessRank}ランクは稀な組み合わせ`
      // );
    }

    // 6. 異常値
    if (product.priceJPY) {
      if (product.priceJPY <= 0 || product.priceJPY > 999999) {
        issues.anomalousPrices.push(
          `${product.name}: 価格¥${product.priceJPY}`
        );
      }
    }
  }

  // 結果表示
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 検証結果\n');

  let hasIssues = false;

  if (issues.missingTierRatings.length > 0) {
    console.log(`❌ tierRatings未設定: ${issues.missingTierRatings.length}件`);
    issues.missingTierRatings.slice(0, 5).forEach(name => console.log(`   - ${name}`));
    if (issues.missingTierRatings.length > 5) {
      console.log(`   ... 他${issues.missingTierRatings.length - 5}件`);
    }
    hasIssues = true;
    console.log('');
  }

  if (issues.invalidRanks.length > 0) {
    console.log(`❌ 無効なランク: ${issues.invalidRanks.length}件`);
    issues.invalidRanks.slice(0, 5).forEach(issue => console.log(`   - ${issue}`));
    if (issues.invalidRanks.length > 5) {
      console.log(`   ... 他${issues.invalidRanks.length - 5}件`);
    }
    hasIssues = true;
    console.log('');
  }

  if (issues.mismatchedEvidenceLevel.length > 0) {
    console.log(`⚠️  エビデンスレベル不一致: ${issues.mismatchedEvidenceLevel.length}件`);
    issues.mismatchedEvidenceLevel.slice(0, 5).forEach(issue => console.log(`   - ${issue}`));
    if (issues.mismatchedEvidenceLevel.length > 5) {
      console.log(`   ... 他${issues.mismatchedEvidenceLevel.length - 5}件`);
    }
    hasIssues = true;
    console.log('');
  }

  if (issues.scoreRankMismatch.length > 0) {
    console.log(`⚠️  スコア・ランク不整合: ${issues.scoreRankMismatch.length}件`);
    issues.scoreRankMismatch.slice(0, 5).forEach(issue => console.log(`   - ${issue}`));
    if (issues.scoreRankMismatch.length > 5) {
      console.log(`   ... 他${issues.scoreRankMismatch.length - 5}件`);
    }
    hasIssues = true;
    console.log('');
  }

  if (issues.impossibleCombinations.length > 0) {
    console.log(`❌ 矛盾する組み合わせ: ${issues.impossibleCombinations.length}件`);
    issues.impossibleCombinations.forEach(issue => console.log(`   - ${issue}`));
    hasIssues = true;
    console.log('');
  }

  if (issues.anomalousPrices.length > 0) {
    console.log(`⚠️  異常な価格: ${issues.anomalousPrices.length}件`);
    issues.anomalousPrices.forEach(issue => console.log(`   - ${issue}`));
    hasIssues = true;
    console.log('');
  }

  if (!hasIssues) {
    console.log('✅ 問題は見つかりませんでした！\n');
  } else {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 推奨アクション:\n');
    console.log('1. tierRatings未設定の商品に対してランクを計算');
    console.log('2. 不整合のある商品のデータを確認・修正');
    console.log('3. ランク再計算スクリプトの実行を検討\n');
  }

  // サマリー
  const totalIssues = Object.values(issues).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`📊 サマリー: ${totalIssues}件の問題を検出`);
  const validCount = products.length - issues.missingTierRatings.length - Math.floor(issues.invalidRanks.length / 6);
  console.log(`正常: ${validCount}件`);
  console.log(`要確認: ${totalIssues}件\n`);

  process.exit(totalIssues > 0 ? 1 : 0);
}

validateRanks().catch(error => {
  console.error('❌ エラー:', error.message);
  process.exit(1);
});