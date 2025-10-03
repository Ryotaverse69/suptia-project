"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export function HeroSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-16 px-6 lg:px-12 xl:px-16">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>

      <div className="relative mx-auto max-w-[1200px]">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            あなたに最適なサプリを見つけよう
          </h1>
          <p className="text-lg md:text-xl text-blue-100">
            科学的根拠に基づいた、信頼できるサプリメント比較サイト
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="pl-6 pr-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="サプリメント名、成分名で検索..."
              className="flex-1 py-5 px-2 text-lg outline-none"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-5 transition-colors"
            >
              検索
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <span className="text-blue-100 text-sm">人気の検索:</span>
          {["ビタミンD", "オメガ3", "マグネシウム", "プロテイン"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-colors backdrop-blur-sm"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
