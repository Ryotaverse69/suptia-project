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

// 参考文献のURL追加
const referencesData = {
  'omega-3': [
    {
      title: '厚生労働省「日本人の食事摂取基準（2020年版）」',
      url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html'
    },
    {
      title: 'GISSI-Prevenzione Trial - Lancet 1999',
      url: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(99)07072-5/fulltext'
    },
    {
      title: 'REDUCE-IT Trial - N Engl J Med 2019',
      url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1812792'
    },
    {
      title: 'Omega-3 Fatty Acids and Depression - Harvard Health',
      url: 'https://www.health.harvard.edu/blog/omega-3-fatty-acids-for-mood-disorders-2018080314414'
    },
    {
      title: '国立健康・栄養研究所「健康食品」の安全性・有効性情報',
      url: 'https://hfnet.nibiohn.go.jp/'
    },
    {
      title: '日本脂質栄養学会 - オメガ3脂肪酸の科学的根拠',
      url: 'http://jsln.umin.jp/'
    }
  ],
  'magnesium': [
    {
      title: '厚生労働省「日本人の食事摂取基準（2020年版）」',
      url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html'
    },
    {
      title: 'Magnesium and cardiovascular disease - Journal of the American Heart Association 2013',
      url: 'https://www.ahajournals.org/doi/10.1161/JAHA.113.000404'
    },
    {
      title: 'The effect of magnesium supplementation on primary insomnia - Journal of Research in Medical Sciences 2012',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23853635/'
    },
    {
      title: '国立健康・栄養研究所「健康食品」の安全性・有効性情報',
      url: 'https://hfnet.nibiohn.go.jp/'
    },
    {
      title: 'Magnesium and the inflammatory response - Molecular Aspects of Medicine 2003',
      url: 'https://pubmed.ncbi.nlm.nih.gov/12537987/'
    },
    {
      title: 'NIH Office of Dietary Supplements - Magnesium',
      url: 'https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/'
    }
  ],
  'zinc': [
    {
      title: '厚生労働省「日本人の食事摂取基準（2020年版）」',
      url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html'
    },
    {
      title: 'Zinc for the common cold - Cochrane Database Syst Rev 2013',
      url: 'https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD001364.pub4/full'
    },
    {
      title: 'Zinc and immune function - Annual Review of Nutrition 2007',
      url: 'https://pubmed.ncbi.nlm.nih.gov/17506664/'
    },
    {
      title: '国立健康・栄養研究所「健康食品」の安全性・有効性情報',
      url: 'https://hfnet.nibiohn.go.jp/'
    },
    {
      title: 'Zinc and male fertility - Human Reproduction Update 2018',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29481661/'
    },
    {
      title: 'NIH Office of Dietary Supplements - Zinc',
      url: 'https://ods.od.nih.gov/factsheets/Zinc-HealthProfessional/'
    }
  ],
  'vitamin-a': [
    {
      title: '厚生労働省「日本人の食事摂取基準（2020年版）」',
      url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html'
    },
    {
      title: 'WHO - Vitamin A supplementation in infants and children',
      url: 'https://www.who.int/health-topics/vitamin-a'
    },
    {
      title: 'Vitamin A and immune function - Journal of Clinical Medicine 2018',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30200565/'
    },
    {
      title: 'CARET Study - Beta-Carotene and Retinol Efficacy Trial',
      url: 'https://pubmed.ncbi.nlm.nih.gov/8618270/'
    },
    {
      title: '国立健康・栄養研究所「健康食品」の安全性・有効性情報',
      url: 'https://hfnet.nibiohn.go.jp/'
    },
    {
      title: 'NIH Office of Dietary Supplements - Vitamin A',
      url: 'https://ods.od.nih.gov/factsheets/VitaminA-HealthProfessional/'
    }
  ],
  'vitamin-k': [
    {
      title: '厚生労働省「日本人の食事摂取基準（2020年版）」',
      url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html'
    },
    {
      title: 'Vitamin K and bone health - Nutrients 2013',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23201840/'
    },
    {
      title: 'Vitamin K2 in bone metabolism - Journal of Bone and Mineral Metabolism 2015',
      url: 'https://pubmed.ncbi.nlm.nih.gov/25472532/'
    },
    {
      title: '国立健康・栄養研究所「健康食品」の安全性・有効性情報',
      url: 'https://hfnet.nibiohn.go.jp/'
    },
    {
      title: '日本骨代謝学会 - ビタミンK2と骨粗しょう症',
      url: 'http://www.jsbmr.umin.jp/'
    },
    {
      title: 'NIH Office of Dietary Supplements - Vitamin K',
      url: 'https://ods.od.nih.gov/factsheets/VitaminK-HealthProfessional/'
    }
  ],
  'vitamin-b12': [
    {
      title: '厚生労働省「日本人の食事摂取基準（2020年版）」',
      url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html'
    },
    {
      title: 'Vitamin B12 deficiency - New England Journal of Medicine 2013',
      url: 'https://www.nejm.org/doi/full/10.1056/NEJMcp1113996'
    },
    {
      title: 'Vitamin B12 and cognitive function - American Journal of Clinical Nutrition 2009',
      url: 'https://pubmed.ncbi.nlm.nih.gov/19369383/'
    },
    {
      title: '国立健康・栄養研究所「健康食品」の安全性・有効性情報',
      url: 'https://hfnet.nibiohn.go.jp/'
    },
    {
      title: 'American Diabetes Association - Standards of Medical Care in Diabetes',
      url: 'https://diabetesjournals.org/care/issue/47/Supplement_1'
    },
    {
      title: 'NIH Office of Dietary Supplements - Vitamin B12',
      url: 'https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/'
    }
  ]
};

// 残りの16記事の参考文献（文字列配列を変換）
const stringReferencesToConvert = {
  'bcaa': {
    id: 'ingredient-bcaa',
    references: [
      {
        title: 'Shimomura, Y., et al. (2006). Exercise promotes BCAA catabolism: effects of BCAA supplementation on skeletal muscle during exercise',
        url: 'https://pubmed.ncbi.nlm.nih.gov/16424131/'
      },
      {
        title: 'Blomstrand, E., et al. (2006). Branched-chain amino acids activate key enzymes in protein synthesis after physical exercise',
        url: 'https://pubmed.ncbi.nlm.nih.gov/16365096/'
      },
      {
        title: 'Jackman, S. R., et al. (2017). Branched-Chain Amino Acid Ingestion Stimulates Muscle Myofibrillar Protein Synthesis',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28638350/'
      },
      {
        title: 'Fouré, A., & Bendahan, D. (2017). Is Branched-Chain Amino Acids Supplementation an Efficient Nutritional Strategy',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28954802/'
      },
      {
        title: 'Wolfe, R. R. (2017). Branched-chain amino acids and muscle protein synthesis in humans',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28852372/'
      }
    ]
  },
  'nac': {
    id: 'ingredient-nac',
    references: [
      {
        title: 'N-Acetylcysteine for psychiatric disorders: meta-analysis - Journal of Clinical Psychiatry 2018',
        url: 'https://pubmed.ncbi.nlm.nih.gov/30256552/'
      },
      {
        title: 'N-Acetylcysteine and antioxidant status - Nutrients 2013',
        url: 'https://pubmed.ncbi.nlm.nih.gov/23803882/'
      },
      {
        title: 'NAC for COPD exacerbations - Cochrane Database Syst Rev 2019',
        url: 'https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD001287.pub6/full'
      },
      {
        title: 'N-Acetylcysteine in acetaminophen overdose - Clinical Toxicology 2017',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28812389/'
      },
      {
        title: 'NAC and PCOS: meta-analysis - Obstetrics & Gynecology 2015',
        url: 'https://pubmed.ncbi.nlm.nih.gov/26098236/'
      }
    ]
  },
  'protein': {
    id: 'ingredient-protein',
    references: [
      {
        title: 'International Society of Sports Nutrition position stand: protein and exercise',
        url: 'https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8'
      },
      {
        title: 'Protein intake and muscle mass in older adults - Nutrients 2018',
        url: 'https://pubmed.ncbi.nlm.nih.gov/30154366/'
      },
      {
        title: 'Dietary protein and bone health - American Journal of Clinical Nutrition 2008',
        url: 'https://pubmed.ncbi.nlm.nih.gov/18400726/'
      },
      {
        title: 'Protein timing and muscle adaptations - Journal of the International Society of Sports Nutrition 2013',
        url: 'https://pubmed.ncbi.nlm.nih.gov/23360586/'
      },
      {
        title: 'NIH Office of Dietary Supplements - Dietary Supplements for Exercise and Athletic Performance',
        url: 'https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/'
      }
    ]
  },
  'probiotics': {
    id: 'ingredient-probiotics',
    references: [
      {
        title: 'Probiotics and gut health: WHO/FAO definition',
        url: 'https://www.who.int/foodsafety/fs_management/en/probiotic_guidelines.pdf'
      },
      {
        title: 'Probiotics for antibiotic-associated diarrhea - Cochrane Database Syst Rev 2013',
        url: 'https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD004827.pub4/full'
      },
      {
        title: 'Probiotics and IBS: meta-analysis - American Journal of Gastroenterology 2018',
        url: 'https://pubmed.ncbi.nlm.nih.gov/30036339/'
      },
      {
        title: 'Gut microbiota and brain function - Nature Reviews Neuroscience 2012',
        url: 'https://pubmed.ncbi.nlm.nih.gov/22968153/'
      },
      {
        title: 'Clinical Guide to Probiotic Products - Canadian Family Physician 2017',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5597070/'
      }
    ]
  },
  'vitamin-b-complex': {
    id: 'ingredient-vitamin-b-complex',
    references: [
      {
        title: '厚生労働省「日本人の食事摂取基準（2020年版）」',
        url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html'
      },
      {
        title: 'B vitamins and brain function - Nutrients 2016',
        url: 'https://pubmed.ncbi.nlm.nih.gov/27338459/'
      },
      {
        title: 'Homocysteine and cardiovascular disease - JAMA 2002',
        url: 'https://pubmed.ncbi.nlm.nih.gov/11966386/'
      },
      {
        title: 'B vitamins and energy metabolism - Journal of Nutrition 2016',
        url: 'https://pubmed.ncbi.nlm.nih.gov/27511933/'
      },
      {
        title: 'NIH Office of Dietary Supplements - B Vitamins',
        url: 'https://ods.od.nih.gov/factsheets/list-VitaminsMinerals/'
      }
    ]
  },
  'folic-acid': {
    id: 'ingredient-folic-acid',
    references: [
      {
        title: '厚生労働省「日本人の食事摂取基準（2020年版）」',
        url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html'
      },
      {
        title: 'Folic acid for neural tube defect prevention - New England Journal of Medicine 1992',
        url: 'https://www.nejm.org/doi/full/10.1056/NEJM199212243272602'
      },
      {
        title: 'Folate and cardiovascular disease - Circulation 2002',
        url: 'https://pubmed.ncbi.nlm.nih.gov/11940537/'
      },
      {
        title: 'Folic acid fortification policies - WHO Guidelines',
        url: 'https://www.who.int/publications/i/item/9789241550178'
      },
      {
        title: 'NIH Office of Dietary Supplements - Folate',
        url: 'https://ods.od.nih.gov/factsheets/Folate-HealthProfessional/'
      }
    ]
  },
  'coenzyme-q10': {
    id: 'ingredient-coenzyme-q10',
    references: [
      {
        title: 'Coenzyme Q10 and heart failure - JACC: Heart Failure 2014',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25282031/'
      },
      {
        title: 'CoQ10 and statin-related myopathy - American Journal of Cardiology 2007',
        url: 'https://pubmed.ncbi.nlm.nih.gov/17950785/'
      },
      {
        title: 'CoQ10 and mitochondrial function - Biofactors 2008',
        url: 'https://pubmed.ncbi.nlm.nih.gov/19096100/'
      },
      {
        title: 'Coenzyme Q10 and migraine prevention - Neurology 2005',
        url: 'https://pubmed.ncbi.nlm.nih.gov/15728281/'
      },
      {
        title: 'NIH - Coenzyme Q10 Information',
        url: 'https://www.nccih.nih.gov/health/coenzyme-q10'
      }
    ]
  },
  'collagen': {
    id: 'ingredient-collagen',
    references: [
      {
        title: 'Collagen supplementation and skin health - Nutrients 2019',
        url: 'https://pubmed.ncbi.nlm.nih.gov/31627309/'
      },
      {
        title: 'Collagen peptides and bone density - Nutrients 2018',
        url: 'https://pubmed.ncbi.nlm.nih.gov/30042381/'
      },
      {
        title: 'Collagen hydrolysate for joint pain - Current Medical Research and Opinion 2006',
        url: 'https://pubmed.ncbi.nlm.nih.gov/17022849/'
      },
      {
        title: 'Oral collagen supplementation: systematic review - Journal of Drugs in Dermatology 2019',
        url: 'https://pubmed.ncbi.nlm.nih.gov/30681787/'
      },
      {
        title: 'Collagen structure and function - Cold Spring Harbor Perspectives in Biology 2011',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3003457/'
      }
    ]
  },
  'glucosamine': {
    id: 'P1Z7m8fgwpF7BuhejyHKwp',
    references: [
      {
        title: 'Glucosamine for osteoarthritis - Cochrane Database Syst Rev 2005',
        url: 'https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD002946.pub2/full'
      },
      {
        title: 'Glucosamine and chondroitin for osteoarthritis - New England Journal of Medicine 2006',
        url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa052771'
      },
      {
        title: 'Long-term effects of glucosamine - Annals of the Rheumatic Diseases 2008',
        url: 'https://pubmed.ncbi.nlm.nih.gov/18375537/'
      },
      {
        title: 'Glucosamine safety profile - Drug Safety 2007',
        url: 'https://pubmed.ncbi.nlm.nih.gov/17960728/'
      },
      {
        title: 'NIH - Glucosamine and Chondroitin for Osteoarthritis',
        url: 'https://www.nccih.nih.gov/health/glucosamine-and-chondroitin-for-osteoarthritis'
      }
    ]
  },
  'lutein': {
    id: 'P1Z7m8fgwpF7BuhejyHKyQ',
    references: [
      {
        title: 'Lutein and zeaxanthin for age-related macular degeneration - JAMA Ophthalmology 2013',
        url: 'https://pubmed.ncbi.nlm.nih.gov/23644932/'
      },
      {
        title: 'Dietary carotenoids and eye health - Nutrients 2013',
        url: 'https://pubmed.ncbi.nlm.nih.gov/23201840/'
      },
      {
        title: 'Lutein and cognitive function - Journal of the International Neuropsychological Society 2017',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28758612/'
      },
      {
        title: 'AREDS2 Study - JAMA 2013',
        url: 'https://pubmed.ncbi.nlm.nih.gov/23644932/'
      },
      {
        title: 'NIH - Lutein and Zeaxanthin',
        url: 'https://ods.od.nih.gov/factsheets/list-VitaminsMinerals/'
      }
    ]
  },
  'ashwagandha': {
    id: 'ingredient-ashwagandha',
    references: [
      {
        title: 'Ashwagandha for stress and anxiety - Journal of Alternative and Complementary Medicine 2014',
        url: 'https://pubmed.ncbi.nlm.nih.gov/23439798/'
      },
      {
        title: 'Ashwagandha and cortisol levels - Journal of Ethnopharmacology 2019',
        url: 'https://pubmed.ncbi.nlm.nih.gov/31419478/'
      },
      {
        title: 'Ashwagandha for athletic performance - Journal of the International Society of Sports Nutrition 2015',
        url: 'https://pubmed.ncbi.nlm.nih.gov/26609282/'
      },
      {
        title: 'Withania somnifera: review - African Journal of Traditional Medicine 2011',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3252722/'
      },
      {
        title: 'NIH - Ashwagandha Information',
        url: 'https://www.nccih.nih.gov/health/ashwagandha'
      }
    ]
  },
  'magnesium-glycinate': {
    id: 'ingredient-magnesium-glycinate',
    references: [
      {
        title: 'Magnesium supplementation forms - Nutrients 2017',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28894332/'
      },
      {
        title: 'Bioavailability of magnesium compounds - Journal of the American College of Nutrition 2001',
        url: 'https://pubmed.ncbi.nlm.nih.gov/11838888/'
      },
      {
        title: 'Magnesium and sleep quality - Journal of Research in Medical Sciences 2012',
        url: 'https://pubmed.ncbi.nlm.nih.gov/23853635/'
      },
      {
        title: 'Magnesium deficiency - Subcellular Biochemistry 2007',
        url: 'https://pubmed.ncbi.nlm.nih.gov/17612052/'
      },
      {
        title: 'NIH Office of Dietary Supplements - Magnesium',
        url: 'https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/'
      }
    ]
  },
  'chromium': {
    id: '5v8OuqFn5O4X8PYE5dNIcu',
    references: [
      {
        title: 'Chromium picolinate for diabetes - Diabetes Technology & Therapeutics 2008',
        url: 'https://pubmed.ncbi.nlm.nih.gov/18715199/'
      },
      {
        title: 'Chromium and insulin resistance - Diabetes 1999',
        url: 'https://pubmed.ncbi.nlm.nih.gov/10568960/'
      },
      {
        title: 'Chromium supplementation: review - Journal of Nutrition 2008',
        url: 'https://pubmed.ncbi.nlm.nih.gov/18492845/'
      },
      {
        title: 'Chromium and weight loss - Obesity Reviews 2013',
        url: 'https://pubmed.ncbi.nlm.nih.gov/23167434/'
      },
      {
        title: 'NIH Office of Dietary Supplements - Chromium',
        url: 'https://ods.od.nih.gov/factsheets/Chromium-HealthProfessional/'
      }
    ]
  },
  'iodine': {
    id: '5v8OuqFn5O4X8PYE5dNHii',
    references: [
      {
        title: '厚生労働省「日本人の食事摂取基準（2020年版）」',
        url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html'
      },
      {
        title: 'WHO - Iodine deficiency disorders',
        url: 'https://www.who.int/health-topics/iodine-deficiency'
      },
      {
        title: 'Iodine and thyroid function - Endocrinology and Metabolism Clinics 2007',
        url: 'https://pubmed.ncbi.nlm.nih.gov/17673124/'
      },
      {
        title: 'Iodine nutrition in Japan - Journal of Nutritional Science and Vitaminology 2011',
        url: 'https://pubmed.ncbi.nlm.nih.gov/21697639/'
      },
      {
        title: 'NIH Office of Dietary Supplements - Iodine',
        url: 'https://ods.od.nih.gov/factsheets/Iodine-HealthProfessional/'
      }
    ]
  },
  'selenium': {
    id: 'pRlcpvz6Xc5z2Mc0MDNC2G',
    references: [
      {
        title: 'Selenium and thyroid function - Thyroid 2010',
        url: 'https://pubmed.ncbi.nlm.nih.gov/20100046/'
      },
      {
        title: 'Selenium and cancer prevention - Lancet 1996',
        url: 'https://pubmed.ncbi.nlm.nih.gov/8778868/'
      },
      {
        title: 'Selenium and immune function - American Journal of Clinical Nutrition 2007',
        url: 'https://pubmed.ncbi.nlm.nih.gov/17684227/'
      },
      {
        title: 'Selenium deficiency - Nutrients 2015',
        url: 'https://pubmed.ncbi.nlm.nih.gov/26114563/'
      },
      {
        title: 'NIH Office of Dietary Supplements - Selenium',
        url: 'https://ods.od.nih.gov/factsheets/Selenium-HealthProfessional/'
      }
    ]
  },
  'potassium': {
    id: '5v8OuqFn5O4X8PYE5dNHcE',
    references: [
      {
        title: '厚生労働省「日本人の食事摂取基準（2020年版）」',
        url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html'
      },
      {
        title: 'Potassium and blood pressure - Hypertension 2013',
        url: 'https://pubmed.ncbi.nlm.nih.gov/23608661/'
      },
      {
        title: 'Dietary potassium and stroke - Stroke 2011',
        url: 'https://pubmed.ncbi.nlm.nih.gov/21940972/'
      },
      {
        title: 'Potassium and cardiovascular health - BMJ 2013',
        url: 'https://pubmed.ncbi.nlm.nih.gov/23558163/'
      },
      {
        title: 'NIH Office of Dietary Supplements - Potassium',
        url: 'https://ods.od.nih.gov/factsheets/Potassium-HealthProfessional/'
      }
    ]
  }
};

// 全ての参考文献を結合
const allReferences = { ...referencesData, ...Object.fromEntries(
  Object.entries(stringReferencesToConvert).map(([slug, data]) => [slug, data.references])
)};

// IDマッピング（実際のSanityドキュメントIDを使用）
const idMapping = {
  'omega-3': 'ingredient-omega-3',
  'magnesium': 'ingredient-magnesium',
  'zinc': 'ingredient-zinc',
  'vitamin-a': 'pRlcpvz6Xc5z2Mc0MBzKZo',
  'vitamin-k': '7MAYpyO4GR94MtR0V9EtGp',
  'vitamin-b12': '7MAYpyO4GR94MtR0V9EtND',
  'vitamin-c': 'ingredient-vitamin-c',
  'vitamin-d': 'ingredient-vitamin-d',
  'vitamin-e': 'ingredient-vitamin-e',
  'niacin': 'pRlcpvz6Xc5z2Mc0MBzKvk',
  'calcium': 'ingredient-calcium',
  'iron': 'ingredient-iron',
  'bcaa': 'ingredient-bcaa',
  'nac': 'ingredient-nac',
  'protein': 'ingredient-protein',
  'probiotics': 'ingredient-probiotics',
  'vitamin-b-complex': 'ingredient-vitamin-b-complex',
  'folic-acid': 'ingredient-folic-acid',
  'coenzyme-q10': 'ingredient-coenzyme-q10',
  'collagen': 'ingredient-collagen',
  'glucosamine': 'P1Z7m8fgwpF7BuhejyHKwp',
  'lutein': 'P1Z7m8fgwpF7BuhejyHKyQ',
  'ashwagandha': 'ingredient.ashwagandha',
  'magnesium-glycinate': 'ingredient.magnesium-glycinate',
  'chromium': '5v8OuqFn5O4X8PYE5dNIcu',
  'iodine': '5v8OuqFn5O4X8PYE5dNHii',
  'selenium': 'pRlcpvz6Xc5z2Mc0MDNC2G',
  'potassium': '5v8OuqFn5O4X8PYE5dNHcE'
};

const mutations = [];

for (const [slug, references] of Object.entries(allReferences)) {
  const id = idMapping[slug];

  mutations.push({
    patch: {
      id,
      set: { references }
    }
  });

  console.log(`✓ Prepared: ${slug} (${references.length} references)`);
}

console.log(`\n✓ Created mutations for ${mutations.length} ingredients`);
console.log('Sending to Sanity...\n');

try {
  const response = await fetch('https://fny3jdcg.api.sanity.io/v2023-05-03/data/mutate/production', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mutations }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('Error response:', JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log('✅ Success! Updated', result.results?.length || 0, 'documents');
  console.log('\nTransaction ID:', result.transactionId);

} catch (error) {
  console.error('Error executing mutations:', error.message);
  process.exit(1);
}
