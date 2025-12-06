import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN
});

// 各成分の参考文献とURL
const updates = {
  'potassium': [
    { title: "Aburto NJ, Hanson S, Gutierrez H, et al. Effect of increased potassium intake on cardiovascular risk factors and disease. BMJ. 2013;346:f1378.", url: "https://pubmed.ncbi.nlm.nih.gov/23558164/" },
    { title: "Appel LJ, Moore TJ, Obarzanek E, et al. A clinical trial of the effects of dietary patterns on blood pressure. N Engl J Med. 1997;336(16):1117-1124.", url: "https://pubmed.ncbi.nlm.nih.gov/9099655/" },
    { title: "Weaver CM. Potassium and health. Adv Nutr. 2013;4(3):368S-377S.", url: "https://pubmed.ncbi.nlm.nih.gov/23674806/" },
    { title: "Stone MS, Martyn L, Weaver CM. Potassium intake, bioavailability, hypertension, and glucose control. Nutrients. 2016;8(7):444.", url: "https://pubmed.ncbi.nlm.nih.gov/27455317/" },
    { title: "Institute of Medicine. Dietary Reference Intakes for Water, Potassium, Sodium, Chloride, and Sulfate. National Academies Press; 2005.", url: "https://www.ncbi.nlm.nih.gov/books/NBK545428/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'glucosamine': [
    { title: "Clegg DO, et al. Glucosamine, chondroitin sulfate, and the two in combination for painful knee osteoarthritis. New England Journal of Medicine. 2006;354(8):795-808.", url: "https://pubmed.ncbi.nlm.nih.gov/16495392/" },
    { title: "Reginster JY, et al. Long-term effects of glucosamine sulphate on osteoarthritis progression: a randomised, placebo-controlled clinical trial. Lancet. 2001;357(9252):251-256.", url: "https://pubmed.ncbi.nlm.nih.gov/11214126/" },
    { title: "Runhaar J, et al. A systematic review on the role of glucosamine in the treatment of osteoarthritis. Rheumatology International. 2018;38(10):1753-1766.", url: "https://pubmed.ncbi.nlm.nih.gov/29949447/" },
    { title: "Simental-Mendía M, et al. Effect of glucosamine and chondroitin sulfate in symptomatic knee osteoarthritis: a systematic review and meta-analysis of randomized placebo-controlled trials. Rheumatology International. 2018;38(8):1413-1428.", url: "https://pubmed.ncbi.nlm.nih.gov/29947926/" },
    { title: "Ogata T, et al. Safety and efficacy of glucosamine, chondroitin, and their combination for painful knee osteoarthritis. Osteoarthritis and Cartilage. 2018;26(6):729-738.", url: "https://pubmed.ncbi.nlm.nih.gov/29501452/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'collagen': [
    { title: "Proksch E, Segger D, Degwert J, et al. Oral supplementation of specific collagen peptides has beneficial effects on human skin physiology: a double-blind, placebo-controlled study. Skin Pharmacol Physiol. 2014;27(1):47-55.", url: "https://pubmed.ncbi.nlm.nih.gov/24401291/" },
    { title: "Zdzieblik D, Oesser S, Baumstark MW, Gollhofer A, König D. Collagen peptide supplementation in combination with resistance training improves body composition and increases muscle strength in elderly sarcopenic men: a randomised controlled trial. Br J Nutr. 2015;114(8):1237-1245.", url: "https://pubmed.ncbi.nlm.nih.gov/26353786/" },
    { title: "García-Coronado JM, Martínez-Olvera L, Elizondo-Omaña RE, et al. Effect of collagen supplementation on osteoarthritis symptoms: a meta-analysis of randomized placebo-controlled trials. Int Orthop. 2019;43(3):531-538.", url: "https://pubmed.ncbi.nlm.nih.gov/30368550/" },
    { title: "Kirmse M, Oertzen-Hagemann V, de Marées M, et al. Prolonged Collagen Peptide Supplementation and Resistance Exercise Training Affects Body Composition in Recreationally Active Men. Nutrients. 2019;11(5):1154.", url: "https://pubmed.ncbi.nlm.nih.gov/31121843/" },
    { title: "Lugo JP, Saiyed ZM, Lane NE. Efficacy and tolerability of an undenatured type II collagen supplement in modulating knee osteoarthritis symptoms. Nutr J. 2016;15:14.", url: "https://pubmed.ncbi.nlm.nih.gov/26822714/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'probiotics': [
    { title: "Hill C, et al. Expert consensus document: The International Scientific Association for Probiotics and Prebiotics consensus statement on the scope and appropriate use of the term probiotic. Nature Reviews Gastroenterology & Hepatology. 2014;11(8):506-514.", url: "https://pubmed.ncbi.nlm.nih.gov/24912386/" },
    { title: "Suez J, et al. Post-Antibiotic Gut Mucosal Microbiome Reconstitution Is Impaired by Probiotics and Improved by Autologous FMT. Cell. 2019;174(6):1406-1423.", url: "https://pubmed.ncbi.nlm.nih.gov/30193113/" },
    { title: "Ford AC, et al. Systematic review with meta-analysis: the efficacy of prebiotics, probiotics, synbiotics and antibiotics in irritable bowel syndrome. Alimentary Pharmacology & Therapeutics. 2018;48(10):1044-1060.", url: "https://pubmed.ncbi.nlm.nih.gov/30259539/" },
    { title: "Messaoudi M, et al. Assessment of psychotropic-like properties of a probiotic formulation in rats and human subjects. British Journal of Nutrition. 2011;105(5):755-764.", url: "https://pubmed.ncbi.nlm.nih.gov/20974015/" },
    { title: "Marco ML, et al. Health benefits of fermented foods: microbiota and beyond. Current Opinion in Biotechnology. 2017;44:94-102.", url: "https://pubmed.ncbi.nlm.nih.gov/27998788/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'magnesium-glycinate': [
    { title: "Abbasi B, et al. The effect of magnesium supplementation on primary insomnia in elderly: A double-blind placebo-controlled clinical trial. Journal of Research in Medical Sciences. 2012;17(12):1161-1169.", url: "https://pubmed.ncbi.nlm.nih.gov/23853635/" },
    { title: "Guerrera MP, et al. Therapeutic uses of magnesium. American Family Physician. 2009;80(2):157-162.", url: "https://pubmed.ncbi.nlm.nih.gov/19621856/" },
    { title: "Nielsen FH. Magnesium deficiency and increased inflammation: current perspectives. Journal of Inflammation Research. 2018;11:25-34.", url: "https://pubmed.ncbi.nlm.nih.gov/29403302/" },
    { title: "Rosanoff A, et al. Suboptimal magnesium status in the United States: are the health consequences underestimated? Nutrition Reviews. 2012;70(3):153-164.", url: "https://pubmed.ncbi.nlm.nih.gov/22364157/" },
    { title: "Schwalfenberg GK, Genuis SJ. The importance of magnesium in clinical healthcare. Scientifica. 2017;2017:4179326.", url: "https://pubmed.ncbi.nlm.nih.gov/28286495/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'iodine': [
    { title: "Zimmermann MB. Iodine deficiency. Endocr Rev. 2009;30(4):376-408.", url: "https://pubmed.ncbi.nlm.nih.gov/19389994/" },
    { title: "Bath SC, Steer CD, Golding J, Emmett P, Rayman MP. Effect of inadequate iodine status in UK pregnant women on cognitive outcomes in their children. Lancet. 2013;382(9889):331-337.", url: "https://pubmed.ncbi.nlm.nih.gov/23706508/" },
    { title: "Leung AM, Braverman LE. Consequences of excess iodine. Nat Rev Endocrinol. 2014;10(3):136-142.", url: "https://pubmed.ncbi.nlm.nih.gov/24342882/" },
    { title: "World Health Organization. Assessment of iodine deficiency disorders and monitoring their elimination. 3rd ed. Geneva: WHO; 2007.", url: "https://www.who.int/publications/i/item/9789241595827" },
    { title: "Institute of Medicine. Dietary Reference Intakes for Vitamin A, Vitamin K, Arsenic, Boron, Chromium, Copper, Iodine, Iron, Manganese, Molybdenum, Nickel, Silicon, Vanadium, and Zinc. National Academies Press; 2001.", url: "https://www.ncbi.nlm.nih.gov/books/NBK222310/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'lutein': [
    { title: "Age-Related Eye Disease Study 2 Research Group. Lutein + zeaxanthin and omega-3 fatty acids for age-related macular degeneration: the Age-Related Eye Disease Study 2 randomized clinical trial. JAMA. 2013;309(19):2005-2015.", url: "https://pubmed.ncbi.nlm.nih.gov/23644932/" },
    { title: "Ma L, Lin XM. Effects of lutein and zeaxanthin on aspects of eye health. Journal of the Science of Food and Agriculture. 2010;90(1):2-12.", url: "https://pubmed.ncbi.nlm.nih.gov/19904820/" },
    { title: "Stringham JM, et al. Macular pigment and visual performance under glare conditions. Optometry and Vision Science. 2008;85(2):82-88.", url: "https://pubmed.ncbi.nlm.nih.gov/18223436/" },
    { title: "Johnson EJ. Role of lutein and zeaxanthin in visual and cognitive function throughout the lifespan. Nutrition Reviews. 2014;72(9):605-612.", url: "https://pubmed.ncbi.nlm.nih.gov/25109868/" },
    { title: "Bernstein PS, et al. Lutein, zeaxanthin, and meso-zeaxanthin: The basic and clinical science underlying carotenoid-based nutritional interventions against ocular disease. Progress in Retinal and Eye Research. 2016;50:34-66.", url: "https://pubmed.ncbi.nlm.nih.gov/26541886/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'folic-acid': [
    { title: "Greenberg JA, Bell SJ, Guan Y, Yu YH. Folic Acid Supplementation and Pregnancy: More Than Just Neural Tube Defect Prevention. Rev Obstet Gynecol. 2011;4(2):52-59.", url: "https://pubmed.ncbi.nlm.nih.gov/22102928/" },
    { title: "Bailey RL, Pac SG, Fulgoni VL, et al. Estimation of Total Usual Dietary Intakes of Pregnant Women in the United States. JAMA Netw Open. 2019;2(6):e195967.", url: "https://pubmed.ncbi.nlm.nih.gov/31251383/" },
    { title: "Crider KS, Yang TP, Berry RJ, Bailey LB. Folate and DNA Methylation: A Review of Molecular Mechanisms and the Evidence for Folate's Role. Adv Nutr. 2012;3(1):21-38.", url: "https://pubmed.ncbi.nlm.nih.gov/22332098/" },
    { title: "Scaglione F, Panzavolta G. Folate, folic acid and 5-methyltetrahydrofolate are not the same thing. Xenobiotica. 2014;44(5):480-488.", url: "https://pubmed.ncbi.nlm.nih.gov/24494987/" },
    { title: "Rosenberg IH. Folic Acid and Neural Tube Defects—Time for Action? N Engl J Med. 1992;327(26):1875-1877.", url: "https://pubmed.ncbi.nlm.nih.gov/1453116/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ]
};

console.log('=== 参考文献URL追加開始 ===\n');

for (const [slug, refs] of Object.entries(updates)) {
  try {
    const doc = await client.fetch(
      `*[_type == 'ingredient' && slug.current == $slug][0]{ _id, name }`,
      { slug }
    );
    
    if (!doc) {
      console.log(`❌ ${slug}: ドキュメントなし`);
      continue;
    }
    
    await client.patch(doc._id).set({ references: refs }).commit();
    console.log(`✅ ${doc.name} (${slug}): ${refs.length}件の参考文献を更新`);
  } catch (err) {
    console.log(`❌ ${slug}: ${err.message}`);
  }
}

console.log('\n=== 完了 ===');
