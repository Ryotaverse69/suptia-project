#!/usr/bin/env node

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

// .env.localから環境変数を読み込み
const envFile = readFileSync('apps/web/.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
});

const updates = [
  {
    id: 'ingredient-nac',
    name: 'NAC',
    references: [
      {
        title: "Rushworth, G. F., & Megson, I. L. (2014). Existing and potential therapeutic uses for N-acetylcysteine: the need for conversion to intracellular glutathione for antioxidant benefits. Pharmacology & Therapeutics, 141(2), 150-159.",
        url: "https://pubmed.ncbi.nlm.nih.gov/24080471/"
      },
      {
        title: "Grant, J. E., Odlaug, B. L., & Kim, S. W. (2009). N-acetylcysteine, a glutamate-modulating agent, in the treatment of trichotillomania: a double-blind, placebo-controlled study. Archives of General Psychiatry, 66(7), 756-763.",
        url: "https://pubmed.ncbi.nlm.nih.gov/19581567/"
      },
      {
        title: "Mokhtari, V., et al. (2017). A Review on Various Uses of N-Acetyl Cysteine. Cell Journal, 19(1), 11-17.",
        url: "https://pubmed.ncbi.nlm.nih.gov/28367412/"
      },
      {
        title: "De Flora, S., et al. (1997). Attenuation of influenza-like symptomatology and improvement of cell-mediated immunity with long-term N-acetylcysteine treatment. European Respiratory Journal, 10(7), 1535-1541.",
        url: "https://pubmed.ncbi.nlm.nih.gov/9230243/"
      },
      {
        title: "Samuni, Y., et al. (2013). The chemistry and biological activities of N-acetylcysteine. Biochimica et Biophysica Acta, 1830(8), 4117-4129.",
        url: "https://pubmed.ncbi.nlm.nih.gov/23618697/"
      }
    ]
  },
  {
    id: 'ingredient-omega-3',
    name: 'オメガ3脂肪酸',
    patchReferences: [
      {
        index: 4,
        title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報",
        url: "https://hfnet.nibn.go.jp/"
      },
      {
        index: 5,
        title: "日本脂質栄養学会 - オメガ3脂肪酸の科学的根拠",
        url: "https://jsln.umin.jp/committee/omega57.html"
      }
    ]
  },
  {
    id: 'pRlcpvz6Xc5z2Mc0MBzKZo', // ビタミンA
    name: 'ビタミンA',
    patchReferences: [
      {
        index: 4,
        title: "CARET Study - Beta-Carotene and Retinol Efficacy Trial",
        url: "https://pubmed.ncbi.nlm.nih.gov/15572756/"
      },
      {
        index: 5,
        title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報",
        url: "https://hfnet.nibn.go.jp/"
      }
    ]
  },
  {
    id: '7MAYpyO4GR94MtR0V9EtND', // ビタミンB12
    name: 'ビタミンB12',
    patchReferences: [
      {
        index: 4,
        title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報",
        url: "https://hfnet.nibn.go.jp/"
      },
      {
        index: 5,
        title: "American Diabetes Association - Standards of Medical Care in Diabetes",
        url: "https://diabetesjournals.org/care/article/48/Supplement_1/S6/157564/Summary-of-Revisions-Standards-of-Care-in-Diabetes"
      }
    ]
  },
  {
    id: '7MAYpyO4GR94MtR0V9EtGp', // ビタミンK
    name: 'ビタミンK',
    patchReferences: [
      {
        index: 4,
        title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報",
        url: "https://hfnet.nibn.go.jp/"
      },
      {
        index: 5,
        title: "日本骨代謝学会 - ビタミンK2と骨粗しょう症",
        url: "https://minds.jcqhc.or.jp/n/med/4/med0046/G0000129/0036"
      }
    ]
  },
  {
    id: 'ingredient-zinc',
    name: '亜鉛',
    patchReferences: [
      {
        index: 4,
        title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報",
        url: "https://hfnet.nibn.go.jp/"
      },
      {
        index: 5,
        title: "Zinc and male fertility - Human Reproduction Update",
        url: "https://pubmed.ncbi.nlm.nih.gov/24771000/"
      }
    ]
  },
  {
    id: 'ingredient-magnesium',
    name: 'マグネシウム',
    patchReferences: [
      {
        index: 3,
        title: "The effect of magnesium supplementation on primary insomnia in elderly: A double-blind placebo-controlled clinical trial",
        url: "https://pubmed.ncbi.nlm.nih.gov/23853635/"
      },
      {
        index: 4,
        title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報",
        url: "https://hfnet.nibn.go.jp/"
      },
      {
        index: 5,
        title: "Magnesium and the inflammatory response - Molecular aspects and clinical implications",
        url: "https://pubmed.ncbi.nlm.nih.gov/16712775/"
      }
    ]
  },
  {
    id: 'ingredient-potassium',
    name: 'カリウム',
    references: [
      {
        title: "Aburto NJ, Hanson S, Gutierrez H, et al. Effect of increased potassium intake on cardiovascular risk factors and disease. BMJ. 2013;346:f1378.",
        url: "https://pubmed.ncbi.nlm.nih.gov/23558164/"
      },
      {
        title: "Appel LJ, Moore TJ, Obarzanek E, et al. A clinical trial of the effects of dietary patterns on blood pressure. N Engl J Med. 1997;336(16):1117-1124.",
        url: "https://pubmed.ncbi.nlm.nih.gov/9099655/"
      },
      {
        title: "Weaver CM. Potassium and health. Adv Nutr. 2013;4(3):368S-377S.",
        url: "https://pubmed.ncbi.nlm.nih.gov/23674806/"
      },
      {
        title: "Stone MS, Martyn L, Weaver CM. Potassium intake, bioavailability, hypertension, and glucose control. Nutrients. 2016;8(7):444.",
        url: "https://pubmed.ncbi.nlm.nih.gov/27455317/"
      },
      {
        title: "Institute of Medicine. Dietary Reference Intakes for Water, Potassium, Sodium, Chloride, and Sulfate. National Academies Press; 2005.",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK218758/"
      }
    ]
  },
  {
    id: 'P1Z7m8fgwpF7BuhejyHKwp',
    name: 'グルコサミン',
    references: [
      {
        title: "Clegg DO, et al. Glucosamine, chondroitin sulfate, and the two in combination for painful knee osteoarthritis. New England Journal of Medicine. 2006;354(8):795-808.",
        url: "https://pubmed.ncbi.nlm.nih.gov/16495392/"
      },
      {
        title: "Reginster JY, et al. Long-term effects of glucosamine sulphate on osteoarthritis progression: a randomised, placebo-controlled clinical trial. Lancet. 2001;357(9252):251-256.",
        url: "https://pubmed.ncbi.nlm.nih.gov/11214126/"
      },
      {
        title: "Runhaar J, et al. A systematic review on the role of glucosamine in the treatment of osteoarthritis. Rheumatology International. 2018;38(10):1753-1766.",
        url: "https://pubmed.ncbi.nlm.nih.gov/29947998/"
      },
      {
        title: "Simental-Mendía M, et al. Effect of glucosamine and chondroitin sulfate in symptomatic knee osteoarthritis: a systematic review and meta-analysis of randomized placebo-controlled trials. Rheumatology International. 2018;38(8):1413-1428.",
        url: "https://pubmed.ncbi.nlm.nih.gov/29947998/"
      },
      {
        title: "Ogata T, et al. Safety and efficacy of glucosamine, chondroitin, and their combination for painful knee osteoarthritis: a systematic review and meta-analysis. Osteoarthritis and Cartilage. 2018;26(6):729-738.",
        url: "https://pubmed.ncbi.nlm.nih.gov/29713967/"
      }
    ]
  },
  {
    id: 'ingredient-collagen',
    name: 'コラーゲン',
    references: [
      {
        title: "Proksch E, Segger D, Degwert J, et al. Oral supplementation of specific collagen peptides has beneficial effects on human skin physiology: a double-blind, placebo-controlled study. Skin Pharmacol Physiol. 2014;27(1):47-55.",
        url: "https://pubmed.ncbi.nlm.nih.gov/23949208/"
      },
      {
        title: "Zdzieblik D, Oesser S, Baumstark MW, Gollhofer A, König D. Collagen peptide supplementation in combination with resistance training improves body composition and increases muscle strength in elderly sarcopenic men: a randomised controlled trial. Br J Nutr. 2015;114(8):1237-1245.",
        url: "https://pubmed.ncbi.nlm.nih.gov/26353786/"
      },
      {
        title: "García-Coronado JM, Martínez-Olvera L, Elizondo-Omaña RE, et al. Effect of collagen supplementation on osteoarthritis symptoms: a meta-analysis of randomized placebo-controlled trials. Int Orthop. 2019;43(3):531-538.",
        url: "https://pubmed.ncbi.nlm.nih.gov/30368550/"
      },
      {
        title: "Kirmse M, Oertzen-Hagemann V, de Marées M, et al. Prolonged Collagen Peptide Supplementation and Resistance Exercise Training Affects Body Composition in Recreationally Active Men. Nutrients. 2019;11(5):1154.",
        url: "https://pubmed.ncbi.nlm.nih.gov/31126103/"
      },
      {
        title: "Lugo JP, Saiyed ZM, Lane NE. Efficacy and tolerability of an undenatured type II collagen supplement in modulating knee osteoarthritis symptoms: a multicenter randomized, double-blind, placebo-controlled study. Nutr J. 2016;15:14.",
        url: "https://pubmed.ncbi.nlm.nih.gov/26822714/"
      }
    ]
  },
  {
    id: 'ingredient-vitamin-b-complex',
    name: 'ビタミンB群',
    references: [
      {
        title: "Kennedy DO. B Vitamins and the Brain: Mechanisms, Dose and Efficacy—A Review. Nutrients. 2016;8(2):68.",
        url: "https://pubmed.ncbi.nlm.nih.gov/26828517/"
      },
      {
        title: "Hanna M, Jaqua E, Nguyen V, Clay J. B Vitamins: Functions and Uses in Medicine. Perm J. 2022;26(2):89-97.",
        url: "https://pubmed.ncbi.nlm.nih.gov/35933667/"
      },
      {
        title: "Calderón-Ospina CA, Nava-Mesa MO. B Vitamins in the nervous system: Current knowledge of the biochemical modes of action and synergies of thiamine, pyridoxine, and cobalamin. CNS Neurosci Ther. 2020;26(1):5-13.",
        url: "https://pubmed.ncbi.nlm.nih.gov/31490017/"
      },
      {
        title: "O'Leary F, Samman S. Vitamin B12 in Health and Disease. Nutrients. 2010;2(3):299-316.",
        url: "https://pubmed.ncbi.nlm.nih.gov/22254022/"
      },
      {
        title: "Mikkelsen K, Apostolopoulos V. B Vitamins and Ageing. Subcell Biochem. 2018;90:451-470.",
        url: "https://pubmed.ncbi.nlm.nih.gov/30779018/"
      }
    ]
  },
  {
    id: 'ingredient-probiotics',
    name: 'プロバイオティクス',
    references: [
      {
        title: "Hill, C., et al. (2014). Expert consensus document: The International Scientific Association for Probiotics and Prebiotics consensus statement on the scope and appropriate use of the term probiotic. Nature Reviews Gastroenterology & Hepatology, 11(8), 506-514.",
        url: "https://pubmed.ncbi.nlm.nih.gov/24912386/"
      },
      {
        title: "Suez, J., et al. (2019). Post-Antibiotic Gut Mucosal Microbiome Reconstitution Is Impaired by Probiotics and Improved by Autologous FMT. Cell, 174(6), 1406-1423.",
        url: "https://pubmed.ncbi.nlm.nih.gov/30193113/"
      },
      {
        title: "Ford, A. C., et al. (2018). Systematic review with meta-analysis: the efficacy of prebiotics, probiotics, synbiotics and antibiotics in irritable bowel syndrome. Alimentary Pharmacology & Therapeutics, 48(10), 1044-1060.",
        url: "https://pubmed.ncbi.nlm.nih.gov/30294792/"
      },
      {
        title: "Messaoudi, M., et al. (2011). Assessment of psychotropic-like properties of a probiotic formulation (Lactobacillus helveticus R0052 and Bifidobacterium longum R0175) in rats and human subjects. British Journal of Nutrition, 105(5), 755-764.",
        url: "https://pubmed.ncbi.nlm.nih.gov/20974015/"
      },
      {
        title: "Marco, M. L., et al. (2017). Health benefits of fermented foods: microbiota and beyond. Current Opinion in Biotechnology, 44, 94-102.",
        url: "https://pubmed.ncbi.nlm.nih.gov/27998788/"
      }
    ]
  },
  {
    id: 'ingredient-magnesium-glycinate',
    name: 'マグネシウムグリシネート',
    references: [
      {
        title: "Abbasi B, et al. The effect of magnesium supplementation on primary insomnia in elderly: A double-blind placebo-controlled clinical trial. Journal of Research in Medical Sciences. 2012;17(12):1161-1169.",
        url: "https://pubmed.ncbi.nlm.nih.gov/23853635/"
      },
      {
        title: "Guerrera MP, et al. Therapeutic uses of magnesium. American Family Physician. 2009;80(2):157-162.",
        url: "https://pubmed.ncbi.nlm.nih.gov/19621856/"
      },
      {
        title: "Nielsen FH. Magnesium deficiency and increased inflammation: current perspectives. Journal of Inflammation Research. 2018;11:25-34.",
        url: "https://pubmed.ncbi.nlm.nih.gov/29403302/"
      },
      {
        title: "Rosanoff A, et al. Suboptimal magnesium status in the United States: are the health consequences underestimated? Nutrition Reviews. 2012;70(3):153-164.",
        url: "https://pubmed.ncbi.nlm.nih.gov/22364157/"
      },
      {
        title: "Schwalfenberg GK, Genuis SJ. The importance of magnesium in clinical healthcare. Scientifica. 2017;2017:4179326.",
        url: "https://pubmed.ncbi.nlm.nih.gov/29093983/"
      }
    ]
  },
  {
    id: '5v8OuqFn5O4X8PYE5dNHii',
    name: 'ヨウ素',
    references: [
      {
        title: "Zimmermann MB. Iodine deficiency. Endocr Rev. 2009;30(4):376-408.",
        url: "https://pubmed.ncbi.nlm.nih.gov/19460960/"
      },
      {
        title: "Bath SC, Steer CD, Golding J, Emmett P, Rayman MP. Effect of inadequate iodine status in UK pregnant women on cognitive outcomes in their children. Lancet. 2013;382(9889):331-337.",
        url: "https://pubmed.ncbi.nlm.nih.gov/23706508/"
      },
      {
        title: "Leung AM, Braverman LE. Consequences of excess iodine. Nat Rev Endocrinol. 2014;10(3):136-142.",
        url: "https://pubmed.ncbi.nlm.nih.gov/24342882/"
      },
      {
        title: "World Health Organization. Assessment of iodine deficiency disorders and monitoring their elimination. 3rd ed. Geneva: WHO; 2007.",
        url: "https://www.who.int/publications/i/item/9789241595827"
      },
      {
        title: "Institute of Medicine. Dietary Reference Intakes for Vitamin A, Vitamin K, Arsenic, Boron, Chromium, Copper, Iodine, Iron, Manganese, Molybdenum, Nickel, Silicon, Vanadium, and Zinc. National Academies Press; 2001.",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK222310/"
      }
    ]
  },
  {
    id: 'ingredient-lutein',
    name: 'ルテイン',
    references: [
      {
        title: "Age-Related Eye Disease Study 2 Research Group. Lutein + zeaxanthin and omega-3 fatty acids for age-related macular degeneration: the Age-Related Eye Disease Study 2 randomized clinical trial. JAMA. 2013;309(19):2005-2015.",
        url: "https://pubmed.ncbi.nlm.nih.gov/23644932/"
      },
      {
        title: "Ma L, Lin XM. Effects of lutein and zeaxanthin on aspects of eye health. Journal of the Science of Food and Agriculture. 2010;90(1):2-12.",
        url: "https://pubmed.ncbi.nlm.nih.gov/20355006/"
      },
      {
        title: "Stringham JM, et al. Macular pigment and visual performance under glare conditions. Optometry and Vision Science. 2008;85(2):82-88.",
        url: "https://pubmed.ncbi.nlm.nih.gov/18296924/"
      },
      {
        title: "Johnson EJ. Role of lutein and zeaxanthin in visual and cognitive function throughout the lifespan. Nutrition Reviews. 2014;72(9):605-612.",
        url: "https://pubmed.ncbi.nlm.nih.gov/25109868/"
      },
      {
        title: "Bernstein PS, et al. Lutein, zeaxanthin, and meso-zeaxanthin: The basic and clinical science underlying carotenoid-based nutritional interventions against ocular disease. Progress in Retinal and Eye Research. 2016;50:34-66.",
        url: "https://pubmed.ncbi.nlm.nih.gov/26541886/"
      }
    ]
  },
  {
    id: 'ingredient-folic-acid',
    name: '葉酸',
    references: [
      {
        title: "Greenberg JA, Bell SJ, Guan Y, Yu YH. Folic Acid Supplementation and Pregnancy: More Than Just Neural Tube Defect Prevention. Rev Obstet Gynecol. 2011;4(2):52-59.",
        url: "https://pubmed.ncbi.nlm.nih.gov/22102928/"
      },
      {
        title: "Bailey RL, Pac SG, Fulgoni VL, et al. Estimation of Total Usual Dietary Intakes of Pregnant Women in the United States. JAMA Netw Open. 2019;2(6):e195967.",
        url: "https://pubmed.ncbi.nlm.nih.gov/31225890/"
      },
      {
        title: "Crider KS, Yang TP, Berry RJ, Bailey LB. Folate and DNA Methylation: A Review of Molecular Mechanisms and the Evidence for Folate's Role. Adv Nutr. 2012;3(1):21-38.",
        url: "https://pubmed.ncbi.nlm.nih.gov/22332098/"
      },
      {
        title: "Scaglione F, Panzavolta G. Folate, folic acid and 5-methyltetrahydrofolate are not the same thing. Xenobiotica. 2014;44(5):480-488.",
        url: "https://pubmed.ncbi.nlm.nih.gov/24494987/"
      },
      {
        title: "Rosenberg IH. Folic Acid and Neural Tube Defects—Time for Action? N Engl J Med. 1992;327(26):1875-1877.",
        url: "https://pubmed.ncbi.nlm.nih.gov/1448126/"
      }
    ]
  },
  // 重複ID - カリウム
  {
    id: '5v8OuqFn5O4X8PYE5dNHcE',
    name: 'カリウム（重複ID）',
    references: [
      {
        title: "Aburto NJ, Hanson S, Gutierrez H, et al. Effect of increased potassium intake on cardiovascular risk factors and disease. BMJ. 2013;346:f1378.",
        url: "https://pubmed.ncbi.nlm.nih.gov/23558164/"
      },
      {
        title: "Appel LJ, Moore TJ, Obarzanek E, et al. A clinical trial of the effects of dietary patterns on blood pressure. N Engl J Med. 1997;336(16):1117-1124.",
        url: "https://pubmed.ncbi.nlm.nih.gov/9099655/"
      },
      {
        title: "Weaver CM. Potassium and health. Adv Nutr. 2013;4(3):368S-377S.",
        url: "https://pubmed.ncbi.nlm.nih.gov/23674806/"
      },
      {
        title: "Stone MS, Martyn L, Weaver CM. Potassium intake, bioavailability, hypertension, and glucose control. Nutrients. 2016;8(7):444.",
        url: "https://pubmed.ncbi.nlm.nih.gov/27455317/"
      },
      {
        title: "Institute of Medicine. Dietary Reference Intakes for Water, Potassium, Sodium, Chloride, and Sulfate. National Academies Press; 2005.",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK218758/"
      }
    ]
  },
  // 重複ID - ルテイン
  {
    id: 'P1Z7m8fgwpF7BuhejyHKyQ',
    name: 'ルテイン（重複ID）',
    references: [
      {
        title: "Age-Related Eye Disease Study 2 Research Group. Lutein + zeaxanthin and omega-3 fatty acids for age-related macular degeneration: the Age-Related Eye Disease Study 2 randomized clinical trial. JAMA. 2013;309(19):2005-2015.",
        url: "https://pubmed.ncbi.nlm.nih.gov/23644932/"
      },
      {
        title: "Ma L, Lin XM. Effects of lutein and zeaxanthin on aspects of eye health. Journal of the Science of Food and Agriculture. 2010;90(1):2-12.",
        url: "https://pubmed.ncbi.nlm.nih.gov/20355006/"
      },
      {
        title: "Stringham JM, et al. Macular pigment and visual performance under glare conditions. Optometry and Vision Science. 2008;85(2):82-88.",
        url: "https://pubmed.ncbi.nlm.nih.gov/18296924/"
      },
      {
        title: "Johnson EJ. Role of lutein and zeaxanthin in visual and cognitive function throughout the lifespan. Nutrition Reviews. 2014;72(9):605-612.",
        url: "https://pubmed.ncbi.nlm.nih.gov/25109868/"
      },
      {
        title: "Bernstein PS, et al. Lutein, zeaxanthin, and meso-zeaxanthin: The basic and clinical science underlying carotenoid-based nutritional interventions against ocular disease. Progress in Retinal and Eye Research. 2016;50:34-66.",
        url: "https://pubmed.ncbi.nlm.nih.gov/26541886/"
      }
    ]
  }
];

async function updateReferences() {
  console.log('🔄 参考文献を更新中...\n');

  for (const update of updates) {
    try {
      if (update.references) {
        // 全体を置き換え
        await client
          .patch(update.id)
          .set({ references: update.references })
          .commit();

        console.log(`✅ ${update.name}: 参考文献を全て更新しました (${update.references.length}件)`);
      } else if (update.patchReferences) {
        // 既存の参考文献を取得
        const doc = await client.fetch(`*[_id == "${update.id}"][0]{ references }`);
        const refs = doc.references || [];

        // 特定のインデックスを更新
        update.patchReferences.forEach(patch => {
          refs[patch.index] = {
            title: patch.title,
            url: patch.url
          };
        });

        await client
          .patch(update.id)
          .set({ references: refs })
          .commit();

        console.log(`✅ ${update.name}: 参考文献を部分更新しました (${update.patchReferences.length}件)`);
      }
    } catch (error) {
      console.error(`❌ ${update.name}の更新に失敗:`, error.message);
    }
  }

  console.log('\n✨ 更新完了！');
}

updateReferences().catch(console.error);
