"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Layers,
  Pill,
  Leaf,
  Droplets,
  Dumbbell,
  Shield,
  Heart,
  Moon,
  MoreHorizontal,
} from "lucide-react";
import { liquidGlassClasses } from "@/lib/design-system";

interface CategoryNavProps {
  categories: { name: string; count: number }[];
}

// カテゴリーごとのアイコンと色
const categoryStyles: Record<
  string,
  { icon: typeof Pill; color: string; bgColor: string }
> = {
  ビタミン: {
    icon: Pill,
    color: "text-orange-600",
    bgColor: "bg-orange-100 hover:bg-orange-200 border-orange-200",
  },
  ミネラル: {
    icon: Droplets,
    color: "text-blue-600",
    bgColor: "bg-blue-100 hover:bg-blue-200 border-blue-200",
  },
  "アミノ酸・タンパク質": {
    icon: Dumbbell,
    color: "text-red-600",
    bgColor: "bg-red-100 hover:bg-red-200 border-red-200",
  },
  脂肪酸: {
    icon: Droplets,
    color: "text-amber-600",
    bgColor: "bg-amber-100 hover:bg-amber-200 border-amber-200",
  },
  "ハーブ・植物エキス": {
    icon: Leaf,
    color: "text-green-600",
    bgColor: "bg-green-100 hover:bg-green-200 border-green-200",
  },
  抗酸化物質: {
    icon: Shield,
    color: "text-purple-600",
    bgColor: "bg-purple-100 hover:bg-purple-200 border-purple-200",
  },
  "プロバイオティクス・消化サポート": {
    icon: Heart,
    color: "text-pink-600",
    bgColor: "bg-pink-100 hover:bg-pink-200 border-pink-200",
  },
  "ホルモン・睡眠": {
    icon: Moon,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100 hover:bg-indigo-200 border-indigo-200",
  },
  その他: {
    icon: MoreHorizontal,
    color: "text-gray-600",
    bgColor: "bg-gray-100 hover:bg-gray-200 border-gray-200",
  },
};

export function CategoryNav({ categories }: CategoryNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="sticky top-0 z-30 bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
      <div className="mx-auto px-6 lg:px-12 xl:px-16 py-4 max-w-[1200px]">
        {/* ヘッダー（クリックで開閉） */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-2 bg-white/20 rounded-lg shrink-0">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div className="text-left min-w-0">
              <div className="text-white font-bold text-base sm:text-lg truncate">
                カテゴリーから探す
              </div>
              <div className="text-white/70 text-xs sm:text-sm">
                {categories.length}カテゴリー・{totalCount}成分
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 sm:px-4 py-2 rounded-full transition-colors shrink-0">
            <span className="text-white text-xs sm:text-sm font-medium whitespace-nowrap">
              {isOpen ? "閉じる" : "一覧を表示"}
            </span>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-white" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white" />
            )}
          </div>
        </button>

        {/* 展開時のカテゴリー一覧 */}
        {isOpen && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((category) => {
                const style = categoryStyles[category.name] || {
                  icon: Pill,
                  color: "text-gray-600",
                  bgColor: "bg-gray-100 hover:bg-gray-200 border-gray-200",
                };
                const Icon = style.icon;

                return (
                  <a
                    key={category.name}
                    href={`#category-${category.name}`}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-[24px] border-2 transition-all transform hover:scale-[1.02] ${style.bgColor}`}
                  >
                    <div
                      className={`p-2 rounded-lg bg-white/60 backdrop-blur-[20px] backdrop-saturate-[180%] ${style.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 truncate">
                        {category.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {category.count}件の成分
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 rotate-[-90deg]" />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
