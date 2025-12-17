/**
 * 成分名自動リンクコンポーネント
 * テキスト内の成分名を自動検出して内部リンクに変換
 */

import Link from "next/link";
import { Fragment } from "react";

// 成分名とslugのマッピング（主要成分）
const INGREDIENT_LINKS: Record<string, string> = {
  // ビタミン
  ビタミンC: "vitamin-c",
  ビタミンD: "vitamin-d",
  ビタミンD3: "vitamin-d",
  ビタミンE: "vitamin-e",
  ビタミンA: "vitamin-a",
  ビタミンK: "vitamin-k",
  ビタミンK2: "vitamin-k2",
  ビタミンB1: "vitamin-b1",
  ビタミンB2: "vitamin-b2",
  ビタミンB3: "vitamin-b3",
  ビタミンB5: "vitamin-b5",
  ビタミンB6: "vitamin-b6",
  ビタミンB7: "vitamin-b7",
  ビタミンB12: "vitamin-b12",
  ビタミンB群: "vitamin-b-complex",
  葉酸: "folic-acid",
  ナイアシン: "vitamin-b3",
  ビオチン: "biotin",
  パントテン酸: "vitamin-b5",
  // ミネラル
  カルシウム: "calcium",
  マグネシウム: "magnesium",
  鉄: "iron",
  鉄分: "iron",
  亜鉛: "zinc",
  セレン: "selenium",
  クロム: "chromium",
  // 機能性成分
  オメガ3: "omega-3",
  オメガ3脂肪酸: "omega-3",
  DHA: "omega-3",
  EPA: "omega-3",
  コエンザイムQ10: "coenzyme-q10",
  CoQ10: "coenzyme-q10",
  ルテイン: "lutein",
  コラーゲン: "collagen",
  ヒアルロン酸: "hyaluronic-acid",
  プロバイオティクス: "probiotics",
  乳酸菌: "probiotics",
  グルコサミン: "glucosamine",
  コンドロイチン: "chondroitin",
  // アミノ酸
  BCAA: "bcaa",
  グルタミン: "glutamine",
  アルギニン: "arginine",
  グリシン: "glycine",
  // その他
  マルチビタミン: "multivitamin",
  食物繊維: "fiber",
};

// 相乗効果の説明を追加
const SYNERGY_NOTES: Record<string, Record<string, string>> = {
  "vitamin-d": {
    calcium: "カルシウムの吸収を促進します",
    "vitamin-k2": "カルシウムを骨に定着させます",
    magnesium: "ビタミンDの活性化に必要です",
  },
  "vitamin-c": {
    iron: "鉄の吸収率を約3倍に向上させます",
    "vitamin-e": "抗酸化作用を相互に高めます",
  },
  calcium: {
    "vitamin-d": "吸収に必須のビタミンです",
    magnesium: "骨代謝のバランスを維持します",
  },
  iron: {
    "vitamin-c": "吸収率が大幅に向上します",
  },
};

interface IngredientAutoLinkProps {
  children: string;
  className?: string;
  showSynergyNote?: boolean;
  currentIngredientSlug?: string;
}

export function IngredientAutoLink({
  children,
  className = "",
  showSynergyNote = false,
  currentIngredientSlug,
}: IngredientAutoLinkProps) {
  if (!children || typeof children !== "string") {
    return <>{children}</>;
  }

  // 成分名でソート（長い名前を先にマッチさせる）
  const sortedIngredients = Object.keys(INGREDIENT_LINKS).sort(
    (a, b) => b.length - a.length,
  );

  // 正規表現パターンを作成
  const pattern = new RegExp(`(${sortedIngredients.join("|")})`, "g");

  // テキストを分割してリンク化
  const parts = children.split(pattern);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const slug = INGREDIENT_LINKS[part];
        if (slug && slug !== currentIngredientSlug) {
          const synergyNote =
            showSynergyNote && currentIngredientSlug
              ? SYNERGY_NOTES[currentIngredientSlug]?.[slug]
              : null;

          return (
            <Fragment key={index}>
              <Link
                href={`/ingredients/${slug}`}
                className="text-primary hover:text-primary-dark underline underline-offset-2 decoration-primary/30 hover:decoration-primary transition-colors"
                title={synergyNote || `${part}について詳しく見る`}
              >
                {part}
              </Link>
              {synergyNote && (
                <span className="text-xs text-gray-500 ml-1">
                  ({synergyNote})
                </span>
              )}
            </Fragment>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </span>
  );
}

/**
 * 関連成分セクションコンポーネント
 * 相乗効果のある成分を表示
 */
interface SynergyIngredientsProps {
  currentSlug: string;
  className?: string;
}

export function SynergyIngredients({
  currentSlug,
  className = "",
}: SynergyIngredientsProps) {
  const synergies = SYNERGY_NOTES[currentSlug];

  if (!synergies) {
    return null;
  }

  // slugから成分名を逆引き
  const slugToName = Object.entries(INGREDIENT_LINKS).reduce(
    (acc, [name, slug]) => {
      if (!acc[slug]) acc[slug] = name;
      return acc;
    },
    {} as Record<string, string>,
  );

  return (
    <div
      className={`bg-gradient-to-br from-primary/5 to-accent-mint/5 border border-primary/20 rounded-xl p-6 ${className}`}
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-xl">🤝</span>
        一緒に摂りたい成分
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        相乗効果で吸収率や効果が高まる組み合わせです
      </p>
      <ul className="space-y-3">
        {Object.entries(synergies).map(([slug, note]) => (
          <li key={slug} className="flex items-start gap-3">
            <span className="text-primary font-bold">+</span>
            <div>
              <Link
                href={`/ingredients/${slug}`}
                className="font-semibold text-primary hover:underline"
              >
                {slugToName[slug] || slug}
              </Link>
              <p className="text-sm text-gray-600 mt-0.5">{note}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * 同カテゴリ成分リンクコンポーネント
 */
interface CategoryIngredientsProps {
  category: string;
  currentSlug: string;
  className?: string;
}

const CATEGORY_INGREDIENTS: Record<string, string[]> = {
  水溶性ビタミン: [
    "vitamin-c",
    "vitamin-b1",
    "vitamin-b2",
    "vitamin-b3",
    "vitamin-b5",
    "vitamin-b6",
    "vitamin-b7",
    "vitamin-b12",
    "folic-acid",
  ],
  脂溶性ビタミン: ["vitamin-a", "vitamin-d", "vitamin-e", "vitamin-k"],
  ミネラル: ["calcium", "magnesium", "iron", "zinc", "selenium", "chromium"],
  アミノ酸: ["bcaa", "glutamine", "arginine", "glycine"],
};

export function CategoryIngredients({
  category,
  currentSlug,
  className = "",
}: CategoryIngredientsProps) {
  const categoryIngredients = CATEGORY_INGREDIENTS[category];

  if (!categoryIngredients) {
    return null;
  }

  const slugToName = Object.entries(INGREDIENT_LINKS).reduce(
    (acc, [name, slug]) => {
      if (!acc[slug]) acc[slug] = name;
      return acc;
    },
    {} as Record<string, string>,
  );

  const otherIngredients = categoryIngredients.filter(
    (slug) => slug !== currentSlug,
  );

  if (otherIngredients.length === 0) {
    return null;
  }

  return (
    <div
      className={`bg-gray-50 border border-gray-200 rounded-xl p-6 ${className}`}
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-xl">📚</span>
        {category}の成分一覧
      </h3>
      <div className="flex flex-wrap gap-2">
        {otherIngredients.map((slug) => (
          <Link
            key={slug}
            href={`/ingredients/${slug}`}
            className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-primary hover:text-primary transition-colors"
          >
            {slugToName[slug] || slug}
          </Link>
        ))}
      </div>
    </div>
  );
}
