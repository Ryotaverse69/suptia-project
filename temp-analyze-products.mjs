import { sanity } from "./apps/web/src/lib/sanity.client.ts";

async function analyzeProductIssues() {
    console.log("📊 Analyzing product data issues...\n");

    // Get all products
    const query = `*[_type == "product"] {
    _id,
    name,
    priceJPY,
    janCode,
    "priceDataCount": count(priceData),
    slug
  }`;

    const products = await sanity.fetch(query);
    console.log(`Total products: ${products.length}\n`);

    // Find products without priceData
    const noPriceData = products.filter(p => p.priceDataCount === 0 || p.priceDataCount === null);
    console.log(`🔴 Products without priceData (${noPriceData.length}):`);
    noPriceData.slice(0, 10).forEach(p => {
        console.log(`  - ${p.name} (${p.slug?.current})`);
    });
    if (noPriceData.length > 10) {
        console.log(`  ... and ${noPriceData.length - 10} more\n`);
    } else {
        console.log();
    }

    // Find duplicate products by name
    const nameGroups = products.reduce((acc, p) => {
        const key = p.name.toLowerCase().trim();
        if (!acc[key]) acc[key] = [];
        acc[key].push(p);
        return acc;
    }, {});

    const duplicatesByName = Object.entries(nameGroups).filter(([_, products]) => products.length > 1);
    console.log(`🔴 Duplicate product names (${duplicatesByName.length}):`);
    duplicatesByName.slice(0, 5).forEach(([name, products]) => {
        console.log(`  - "${name}" (${products.length} duplicates):`);
        products.forEach(p => console.log(`    * ${p._id} - ${p.slug?.current}`));
    });
    if (duplicatesByName.length > 5) {
        console.log(`  ... and ${duplicatesByName.length - 5} more duplicate groups\n`);
    } else {
        console.log();
    }

    // Find duplicate products by JAN code
    const janGroups = products.filter(p => p.janCode).reduce((acc, p) => {
        const key = p.janCode;
        if (!acc[key]) acc[key] = [];
        acc[key].push(p);
        return acc;
    }, {});

    const duplicatesByJAN = Object.entries(janGroups).filter(([_, products]) => products.length > 1);
    console.log(`🔴 Duplicate JAN codes (${duplicatesByJAN.length}):`);
    duplicatesByJAN.slice(0, 5).forEach(([jan, products]) => {
        console.log(`  - JAN: ${jan} (${products.length} duplicates):`);
        products.forEach(p => console.log(`    * ${p.name} (${p.slug?.current})`));
    });
    if (duplicatesByJAN.length > 5) {
        console.log(`  ... and ${duplicatesByJAN.length - 5} more duplicate groups\n`);
    } else {
        console.log();
    }

    // Summary
    console.log("\n📋 SUMMARY:");
    console.log(`  Total products: ${products.length}`);
    console.log(`  Products without priceData: ${noPriceData.length}`);
    console.log(`  Duplicate names: ${duplicatesByName.length} groups`);
    console.log(`  Duplicate JAN codes: ${duplicatesByJAN.length} groups`);
}

analyzeProductIssues().catch(console.error);
