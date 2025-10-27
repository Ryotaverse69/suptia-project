"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Pill } from "lucide-react";

interface Ingredient {
  name: string;
  nameEn: string;
  category: string;
  description: string;
  slug: {
    current: string;
  };
  coverImage?: {
    asset: {
      url: string;
    };
  };
}

interface IngredientCarouselProps {
  ingredients: Ingredient[];
}

const categoryColors: Record<string, string> = {
  vitamin: "bg-accent-purple/10 text-accent-purple",
  mineral: "bg-accent-mint/10 text-accent-mint",
  protein: "bg-primary/10 text-primary",
  other: "bg-primary-300/10 text-primary-700",
};

const categoryLabels: Record<string, string> = {
  vitamin: "ビタミン",
  mineral: "ミネラル",
  protein: "プロテイン",
  other: "その他",
};

export function IngredientCarousel({ ingredients }: IngredientCarouselProps) {
  const [shuffledIngredients, setShuffledIngredients] = useState<Ingredient[]>(
    [],
  );

  useEffect(() => {
    // Shuffle ingredients on client side
    const shuffled = [...ingredients].sort(() => Math.random() - 0.5);
    setShuffledIngredients(shuffled);
  }, [ingredients]);

  if (shuffledIngredients.length === 0) {
    return null;
  }

  // Duplicate items for seamless loop
  const duplicatedItems = [
    ...shuffledIngredients,
    ...shuffledIngredients,
    ...shuffledIngredients,
  ];

  return (
    <div className="bg-gradient-to-br from-primary-50 via-white to-accent-mint/5 py-16 overflow-hidden">
      <div className="mx-auto px-6 lg:px-12 xl:px-16 max-w-[1440px]">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="text-primary" size={24} />
            <h2 className="text-3xl font-bold text-primary-900">成分ガイド</h2>
            <Sparkles className="text-primary" size={24} />
          </div>
          <p className="text-primary-700 text-lg">
            科学的根拠に基づいた成分の効果を詳しく解説
          </p>
        </div>

        {/* Scrolling Container */}
        <div className="relative">
          <motion.div
            className="flex gap-6"
            animate={{
              x: [0, -100 * shuffledIngredients.length],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: shuffledIngredients.length * 3,
                ease: "linear",
              },
            }}
          >
            {duplicatedItems.map((ingredient, index) => (
              <Link
                key={`${ingredient.slug.current}-${index}`}
                href={`/ingredients/${ingredient.slug.current}`}
                className="flex-shrink-0 w-80 group"
              >
                <div className="bg-white border border-primary-200 rounded-xl overflow-hidden hover:border-primary hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  {/* アイキャッチ画像 */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-50 to-accent-mint/20">
                    {ingredient.coverImage?.asset?.url ? (
                      <Image
                        src={ingredient.coverImage.asset.url}
                        alt={ingredient.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Pill
                          className="text-primary-300/40"
                          size={64}
                          strokeWidth={1}
                        />
                      </div>
                    )}
                    {/* カテゴリバッジ */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                          categoryColors[ingredient.category] ||
                          categoryColors.other
                        }`}
                      >
                        {categoryLabels[ingredient.category] || "その他"}
                      </span>
                    </div>
                  </div>

                  {/* コンテンツ */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-primary-900 group-hover:text-primary transition-colors mb-1">
                        {ingredient.name}
                      </h3>
                      <p className="text-sm text-primary-600">
                        {ingredient.nameEn}
                      </p>
                    </div>
                    <p className="text-primary-700 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                      {ingredient.description}
                    </p>
                    <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                      詳しく見る
                      <ArrowRight
                        size={16}
                        className="ml-1 group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link
            href="/ingredients"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg"
          >
            全ての成分ガイドを見る
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
