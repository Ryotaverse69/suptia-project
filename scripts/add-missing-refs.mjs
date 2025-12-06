import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN
});

// 16件すべての参考文献
const allReferences = {
  'ingredient-alpha-lipoic-acid': [
    { title: "Shay KP, Moreau RF, Smith EJ, et al. Alpha-lipoic acid as a dietary supplement: molecular mechanisms and therapeutic potential. Biochim Biophys Acta. 2009;1790(10):1149-1160.", url: "https://pubmed.ncbi.nlm.nih.gov/19664690/" },
    { title: "Ziegler D, Nowak H, Kempler P, et al. Treatment of symptomatic diabetic polyneuropathy with the antioxidant alpha-lipoic acid: a meta-analysis. Diabet Med. 2004;21(2):114-121.", url: "https://pubmed.ncbi.nlm.nih.gov/14984445/" },
    { title: "Koh EH, Lee WJ, Lee SA, et al. Effects of alpha-lipoic acid on body weight in obese subjects. Am J Med. 2011;124(1):85.e1-8.", url: "https://pubmed.ncbi.nlm.nih.gov/21187189/" },
    { title: "Rochette L, Ghibu S, Richard C, et al. Direct and indirect antioxidant properties of α-lipoic acid and therapeutic potential. Mol Nutr Food Res. 2013;57(1):114-125.", url: "https://pubmed.ncbi.nlm.nih.gov/23293044/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'ingredient-chitosan': [
    { title: "Jull AB, Ni Mhurchu C, Bennett DA, et al. Chitosan for overweight or obesity. Cochrane Database Syst Rev. 2008;(3):CD003892.", url: "https://pubmed.ncbi.nlm.nih.gov/18646097/" },
    { title: "Rinaudo M. Chitin and chitosan: Properties and applications. Prog Polym Sci. 2006;31(7):603-632.", url: "https://www.sciencedirect.com/science/article/pii/S0079670006000530" },
    { title: "Kean T, Thanou M. Biodegradation, biodistribution and toxicity of chitosan. Adv Drug Deliv Rev. 2010;62(1):3-11.", url: "https://pubmed.ncbi.nlm.nih.gov/19800377/" },
    { title: "Ylitalo R, Lehtinen S, Wuolijoki E, et al. Cholesterol-lowering properties and safety of chitosan. Arzneimittelforschung. 2002;52(1):1-7.", url: "https://pubmed.ncbi.nlm.nih.gov/11838268/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'ingredient-gymnema': [
    { title: "Pothuraju R, Sharma RK, Chagalamarri J, et al. A systematic review of Gymnema sylvestre in obesity and diabetes management. J Sci Food Agric. 2014;94(5):834-840.", url: "https://pubmed.ncbi.nlm.nih.gov/24166097/" },
    { title: "Khan F, Sarker MMR, Ming LC, et al. Comprehensive Review on Phytochemicals, Pharmacological and Clinical Potentials of Gymnema sylvestre. Front Pharmacol. 2019;10:1223.", url: "https://pubmed.ncbi.nlm.nih.gov/31736731/" },
    { title: "Baskaran K, Kizar Ahamath B, Radha Shanmugasundaram K, et al. Antidiabetic effect of a leaf extract from Gymnema sylvestre in non-insulin-dependent diabetes mellitus patients. J Ethnopharmacol. 1990;30(3):295-300.", url: "https://pubmed.ncbi.nlm.nih.gov/2259216/" },
    { title: "Shanmugasundaram ER, Rajeswari G, Baskaran K, et al. Use of Gymnema sylvestre leaf extract in the control of blood glucose in insulin-dependent diabetes mellitus. J Ethnopharmacol. 1990;30(3):281-294.", url: "https://pubmed.ncbi.nlm.nih.gov/2259215/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'ingredient-salacia': [
    { title: "Matsuda H, Murakami T, Yashiro K, et al. Antidiabetic principles of natural medicines. IV. Aldose reductase and alpha-glucosidase inhibitors from the roots of Salacia oblonga. Chem Pharm Bull (Tokyo). 1999;47(12):1725-1729.", url: "https://pubmed.ncbi.nlm.nih.gov/10748716/" },
    { title: "Williams JA, Choe YS, Noss MJ, et al. Extract of Salacia oblonga lowers acute glycemia in patients with type 2 diabetes. Am J Clin Nutr. 2007;86(1):124-130.", url: "https://pubmed.ncbi.nlm.nih.gov/17616771/" },
    { title: "Stohs SJ, Ray S. Anti-diabetic and Anti-hyperlipidemic Effects and Safety of Salacia reticulata and Related Species. Phytother Res. 2015;29(7):986-995.", url: "https://pubmed.ncbi.nlm.nih.gov/25919998/" },
    { title: "Kishino E, Ito T, Fujita K, et al. A mixture of the Salacia reticulata (Kotala himbutu) aqueous extract and cyclodextrin reduces the accumulation of visceral fat mass in mice and rats with high-fat diet-induced obesity. J Nutr. 2006;136(2):433-439.", url: "https://pubmed.ncbi.nlm.nih.gov/16424124/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'ingredient-hatomugi': [
    { title: "Kuo CC, Shih MC, Kuo YH, et al. Antagonism of free-radical-induced damage of adlay seed and its antiproliferative effect in human histolytic lymphoma U937 monocytic cells. J Agric Food Chem. 2001;49(3):1564-1570.", url: "https://pubmed.ncbi.nlm.nih.gov/11312897/" },
    { title: "Chung CP, Hsu CY, Lin JH, et al. Antiproliferative lactams and spiroenone from adlay bran in human breast cancer cell lines. J Agric Food Chem. 2011;59(4):1185-1194.", url: "https://pubmed.ncbi.nlm.nih.gov/21250700/" },
    { title: "Chen HJ, Lo YC, Chiang W. Inhibitory effects of adlay bran (Coix lachryma-jobi L. var. ma-yuen Stapf) on chemical mediator release and cytokine production in rat basophilic leukemia cells. J Ethnopharmacol. 2012;141(1):119-127.", url: "https://pubmed.ncbi.nlm.nih.gov/22374081/" },
    { title: "Huang DW, Kuo YH, Lin FY, et al. Effect of Adlay (Coix lachryma-jobi L. var. ma-yuen Stapf) Testa and its phenolic components on Cu2+-treated low-density lipoprotein (LDL) oxidation and lipopolysaccharide (LPS)-induced inflammation in RAW 264.7 macrophages. J Agric Food Chem. 2009;57(6):2259-2266.", url: "https://pubmed.ncbi.nlm.nih.gov/19226140/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'ingredient-pantothenic-acid': [
    { title: "Tahiliani AG, Beinlich CJ. Pantothenic acid in health and disease. Vitam Horm. 1991;46:165-228.", url: "https://pubmed.ncbi.nlm.nih.gov/1746161/" },
    { title: "Kelly GS. Pantothenic acid. Altern Med Rev. 2011;16(3):263-274.", url: "https://pubmed.ncbi.nlm.nih.gov/21951027/" },
    { title: "Leung LH. Pantothenic acid deficiency as the pathogenesis of acne vulgaris. Med Hypotheses. 1995;44(6):490-492.", url: "https://pubmed.ncbi.nlm.nih.gov/7476595/" },
    { title: "Institute of Medicine. Dietary Reference Intakes for Thiamin, Riboflavin, Niacin, Vitamin B6, Folate, Vitamin B12, Pantothenic Acid, Biotin, and Choline. National Academies Press; 1998.", url: "https://www.ncbi.nlm.nih.gov/books/NBK114311/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'ingredient-vitamin-b1': [
    { title: "Lonsdale D. A review of the biochemistry, metabolism and clinical benefits of thiamin(e) and its derivatives. Evid Based Complement Alternat Med. 2006;3(1):49-59.", url: "https://pubmed.ncbi.nlm.nih.gov/16550223/" },
    { title: "Smithline HA, Donnino M, Greenblatt DJ. Pharmacokinetics of high-dose oral thiamine hydrochloride in healthy subjects. BMC Clin Pharmacol. 2012;12:4.", url: "https://pubmed.ncbi.nlm.nih.gov/22305197/" },
    { title: "Wiley KD, Gupta M. Vitamin B1 (Thiamine) Deficiency. StatPearls. 2023.", url: "https://www.ncbi.nlm.nih.gov/books/NBK537204/" },
    { title: "Institute of Medicine. Dietary Reference Intakes for Thiamin, Riboflavin, Niacin, Vitamin B6, Folate, Vitamin B12, Pantothenic Acid, Biotin, and Choline. National Academies Press; 1998.", url: "https://www.ncbi.nlm.nih.gov/books/NBK114331/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'ingredient-vitamin-b2': [
    { title: "Powers HJ. Riboflavin (vitamin B-2) and health. Am J Clin Nutr. 2003;77(6):1352-1360.", url: "https://pubmed.ncbi.nlm.nih.gov/12791609/" },
    { title: "Marashly ET, Bohlega SA. Riboflavin Has Neuroprotective Potential: Focus on Parkinson's Disease and Migraine. Front Neurol. 2017;8:333.", url: "https://pubmed.ncbi.nlm.nih.gov/28775706/" },
    { title: "Thakur K, Tomar SK, Singh AK, et al. Riboflavin and health: A review of recent human research. Crit Rev Food Sci Nutr. 2017;57(17):3650-3660.", url: "https://pubmed.ncbi.nlm.nih.gov/27029320/" },
    { title: "Institute of Medicine. Dietary Reference Intakes for Thiamin, Riboflavin, Niacin, Vitamin B6, Folate, Vitamin B12, Pantothenic Acid, Biotin, and Choline. National Academies Press; 1998.", url: "https://www.ncbi.nlm.nih.gov/books/NBK114322/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'ingredient-hesperidin': [
    { title: "Roohbakhsh A, Parhiz H, Soltani F, et al. Neuropharmacological properties and pharmacokinetics of the citrus flavonoids hesperidin and hesperetin--a mini-review. Life Sci. 2014;113(1-2):1-6.", url: "https://pubmed.ncbi.nlm.nih.gov/25064826/" },
    { title: "Parhiz H, Roohbakhsh A, Soltani F, et al. Antioxidant and anti-inflammatory properties of the citrus flavonoids hesperidin and hesperetin: an updated review of their molecular mechanisms and experimental models. Phytother Res. 2015;29(3):323-331.", url: "https://pubmed.ncbi.nlm.nih.gov/25394264/" },
    { title: "Galati EM, Monforte MT, Kirjavainen S, et al. Biological effects of hesperidin, a citrus flavonoid. (Note I): antiinflammatory and analgesic activity. Farmaco. 1994;40(11):709-712.", url: "https://pubmed.ncbi.nlm.nih.gov/7832973/" },
    { title: "Morand C, Dubray C, Milenkovic D, et al. Hesperidin contributes to the vascular protective effects of orange juice: a randomized crossover study in healthy volunteers. Am J Clin Nutr. 2011;93(1):73-80.", url: "https://pubmed.ncbi.nlm.nih.gov/21068346/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'ingredient-placenta': [
    { title: "Togashi S, Takahashi N, Iwama M, et al. Antioxidative collagen-derived peptides in human-placenta extract. Placenta. 2002;23(10):746-753.", url: "https://pubmed.ncbi.nlm.nih.gov/12398815/" },
    { title: "Pan SY, Chan MK, Wong MB, et al. Placental therapy: An insight to their biological and therapeutic properties. J Med Life. 2017;10(3):182-187.", url: "https://pubmed.ncbi.nlm.nih.gov/29075349/" },
    { title: "Koike K, Yamamoto Y, Suzuki N, et al. Efficacy of porcine placental extract on climacteric symptoms in peri- and postmenopausal women. Climacteric. 2013;16(1):28-35.", url: "https://pubmed.ncbi.nlm.nih.gov/22530612/" },
    { title: "Yamasaki M, Hasegawa S, Takahama A, et al. Anti-fatigue effects of porcine placenta in mice. Biosci Biotechnol Biochem. 2014;78(6):1003-1008.", url: "https://pubmed.ncbi.nlm.nih.gov/25036127/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'ingredient-hem-iron': [
    { title: "Young I, Parker HM, Rangan A, et al. Association between Haem and Non-Haem Iron Intake and Serum Ferritin in Healthy Young Women. Nutrients. 2018;10(1):81.", url: "https://pubmed.ncbi.nlm.nih.gov/29337893/" },
    { title: "Hurrell R, Egli I. Iron bioavailability and dietary reference values. Am J Clin Nutr. 2010;91(5):1461S-1467S.", url: "https://pubmed.ncbi.nlm.nih.gov/20200263/" },
    { title: "West AR, Oates PS. Mechanisms of heme iron absorption: current questions and controversies. World J Gastroenterol. 2008;14(26):4101-4110.", url: "https://pubmed.ncbi.nlm.nih.gov/18636652/" },
    { title: "Pizarro F, Olivares M, Hertrampf E, et al. Heme-iron absorption is saturable by heme-iron dose in women. J Nutr. 2003;133(7):2214-2217.", url: "https://pubmed.ncbi.nlm.nih.gov/12840180/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'ingredient-manganese': [
    { title: "Aschner JL, Aschner M. Nutritional aspects of manganese homeostasis. Mol Aspects Med. 2005;26(4-5):353-362.", url: "https://pubmed.ncbi.nlm.nih.gov/16099026/" },
    { title: "Keen CL, Ensunsa JL, Watson MH, et al. Nutritional aspects of manganese from experimental studies. Neurotoxicology. 1999;20(2-3):213-223.", url: "https://pubmed.ncbi.nlm.nih.gov/10385885/" },
    { title: "Li L, Yang X. The Essential Element Manganese, Oxidative Stress, and Metabolic Diseases: Links and Interactions. Oxid Med Cell Longev. 2018;2018:7580707.", url: "https://pubmed.ncbi.nlm.nih.gov/29849912/" },
    { title: "Institute of Medicine. Dietary Reference Intakes for Vitamin A, Vitamin K, Arsenic, Boron, Chromium, Copper, Iodine, Iron, Manganese, Molybdenum, Nickel, Silicon, Vanadium, and Zinc. National Academies Press; 2001.", url: "https://www.ncbi.nlm.nih.gov/books/NBK222332/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'ingredient-molybdenum': [
    { title: "Novotny JA, Peterson CA. Molybdenum. Adv Nutr. 2018;9(3):272-273.", url: "https://pubmed.ncbi.nlm.nih.gov/29767700/" },
    { title: "Schwarz G, Mendel RR, Ribbe MW. Molybdenum cofactors, enzymes and pathways. Nature. 2009;460(7257):839-847.", url: "https://pubmed.ncbi.nlm.nih.gov/19675644/" },
    { title: "Turnlund JR. Molybdenum metabolism and requirements in humans. Met Ions Biol Syst. 2002;39:727-739.", url: "https://pubmed.ncbi.nlm.nih.gov/11913143/" },
    { title: "Institute of Medicine. Dietary Reference Intakes for Vitamin A, Vitamin K, Arsenic, Boron, Chromium, Copper, Iodine, Iron, Manganese, Molybdenum, Nickel, Silicon, Vanadium, and Zinc. National Academies Press; 2001.", url: "https://www.ncbi.nlm.nih.gov/books/NBK222301/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'ingredient-kombucha-extract': [
    { title: "Jayabalan R, Malbaša RV, Lončar ES, et al. A Review on Kombucha Tea-Microbiology, Composition, Fermentation, Beneficial Effects, Toxicity, and Tea Fungus. Compr Rev Food Sci Food Saf. 2014;13(4):538-550.", url: "https://pubmed.ncbi.nlm.nih.gov/33412713/" },
    { title: "Kapp JM, Sumner W. Kombucha: a systematic review of the empirical evidence of human health benefit. Ann Epidemiol. 2019;30:66-70.", url: "https://pubmed.ncbi.nlm.nih.gov/30527803/" },
    { title: "Villarreal-Soto SA, Beaufort S, Bouajila J, et al. Understanding Kombucha Tea Fermentation: A Review. J Food Sci. 2018;83(3):580-588.", url: "https://pubmed.ncbi.nlm.nih.gov/29508944/" },
    { title: "Dufresne C, Farnworth E. Tea, Kombucha, and health: a review. Food Res Int. 2000;33(6):409-421.", url: "https://www.sciencedirect.com/science/article/pii/S0963996900000673" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'ingredient-copper': [
    { title: "Olivares M, Uauy R. Copper as an essential nutrient. Am J Clin Nutr. 1996;63(5):791S-796S.", url: "https://pubmed.ncbi.nlm.nih.gov/8615366/" },
    { title: "Turnlund JR. Human whole-body copper metabolism. Am J Clin Nutr. 1998;67(5 Suppl):960S-964S.", url: "https://pubmed.ncbi.nlm.nih.gov/9587136/" },
    { title: "Bost M, Houdart S, Oberli M, et al. Dietary copper and human health: Current evidence and unresolved issues. J Trace Elem Med Biol. 2016;35:107-115.", url: "https://pubmed.ncbi.nlm.nih.gov/27049134/" },
    { title: "Institute of Medicine. Dietary Reference Intakes for Vitamin A, Vitamin K, Arsenic, Boron, Chromium, Copper, Iodine, Iron, Manganese, Molybdenum, Nickel, Silicon, Vanadium, and Zinc. National Academies Press; 2001.", url: "https://www.ncbi.nlm.nih.gov/books/NBK222312/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ],
  'ingredient-korean-ginseng': [
    { title: "Kim HG, Cho JH, Yoo SR, et al. Antifatigue effects of Panax ginseng C.A. Meyer: a randomised, double-blind, placebo-controlled trial. PLoS One. 2013;8(4):e61271.", url: "https://pubmed.ncbi.nlm.nih.gov/23613825/" },
    { title: "Lee S, Rhee DK. Effects of ginseng on stress-related depression, anxiety, and the hypothalamic-pituitary-adrenal axis. J Ginseng Res. 2017;41(4):589-594.", url: "https://pubmed.ncbi.nlm.nih.gov/29021708/" },
    { title: "Reay JL, Kennedy DO, Scholey AB. Single doses of Panax ginseng (G115) reduce blood glucose levels and improve cognitive performance during sustained mental activity. J Psychopharmacol. 2005;19(4):357-365.", url: "https://pubmed.ncbi.nlm.nih.gov/15982990/" },
    { title: "Shergis JL, Zhang AL, Zhou W, et al. Panax ginseng in Randomised Controlled Trials: A Systematic Review. Phytother Res. 2013;27(7):949-965.", url: "https://pubmed.ncbi.nlm.nih.gov/22969004/" },
    { title: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html" },
    { title: "国立健康・栄養研究所「健康食品」の安全性・有効性情報", url: "https://hfnet.nibiohn.go.jp/" }
  ]
};

console.log('=== 16件の参考文献追加開始 ===\n');

let success = 0;
let failed = 0;

for (const [docId, refs] of Object.entries(allReferences)) {
  try {
    // ドキュメントが存在するか確認
    const doc = await client.fetch('*[_id == $docId][0]{ _id, name }', { docId });
    
    if (!doc) {
      console.log('❌ ' + docId + ': ドキュメントなし');
      failed++;
      continue;
    }
    
    await client.patch(docId).set({ references: refs }).commit();
    console.log('✅ ' + doc.name + ': ' + refs.length + '件の参考文献を追加');
    success++;
  } catch (err) {
    console.log('❌ ' + docId + ': ' + err.message);
    failed++;
  }
}

console.log('\n=== 完了: ' + success + '件成功, ' + failed + '件失敗 ===');
