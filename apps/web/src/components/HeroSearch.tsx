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
    <div className="relative bg-gradient-to-br from-primary-300 via-primary-400 to-primary py-20 px-6 lg:px-12 xl:px-16 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>

      {/* Floating orbs for depth */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-accent-mint/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent-purple/20 rounded-full blur-3xl"></div>

      <div className="relative mx-auto max-w-[1200px]">
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-light text-white mb-6 tracking-wide">
            あなたに最適なサプリを見つけよう
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light tracking-wide">
            科学的根拠に基づいた、信頼できるサプリメント比較サイト
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center glass rounded-2xl shadow-glass-hover overflow-hidden backdrop-blur-glass border border-white/30">
            <div className="pl-6 pr-4">
              <Search className="text-primary-600" size={26} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="サプリメント名、成分名で検索..."
              className="flex-1 py-6 px-2 text-lg font-light bg-transparent outline-none placeholder:text-primary-400"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-accent-purple to-accent-purple/90 hover:shadow-glow-purple text-white font-light px-10 py-6 transition-all duration-300"
            >
              検索
            </button>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap gap-3 justify-center items-center">
          <span className="text-white/90 text-sm font-light tracking-wide">
            人気の検索:
          </span>
          {["ビタミンD", "オメガ3", "マグネシウム", "プロテイン"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-5 py-2 glass-blue hover:shadow-glow-blue text-white rounded-full text-sm font-light transition-all duration-300 backdrop-blur-glass border border-white/20"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
