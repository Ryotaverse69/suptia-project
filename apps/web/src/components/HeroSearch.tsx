"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { MoleculeBackground } from "./MoleculeBackground";

export function HeroSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 lg:px-12 xl:px-16 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-300 via-primary-400 to-primary animate-gradient-shift bg-[length:200%_200%]"></div>

      {/* Molecule background animation */}
      <MoleculeBackground />

      {/* Floating orbs for depth */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-accent-mint/20 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-20 w-80 h-80 bg-accent-purple/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative mx-auto max-w-[900px] w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6 tracking-wide">
            あなたに最適なサプリを見つけよう
          </h1>
        </div>

        <form onSubmit={handleSearch} className="relative mb-8">
          <div className="flex items-center glass rounded-xl shadow-glass-hover overflow-hidden backdrop-blur-glass border border-white/30">
            <div className="pl-5 pr-3">
              <Search className="text-primary-600" size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="サプリメント名、成分名で検索..."
              className="flex-1 py-4 px-2 text-base font-light bg-transparent outline-none placeholder:text-primary-400"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-accent-purple to-accent-purple/90 hover:shadow-glow-purple text-white font-light px-8 py-4 transition-all duration-300 text-sm"
            >
              検索
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 justify-center items-center">
          <span className="text-white/90 text-xs font-light tracking-wide">
            人気の検索:
          </span>
          {["ビタミンD", "オメガ3", "マグネシウム", "プロテイン"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-4 py-1.5 glass-blue hover:shadow-glow-blue text-white rounded-full text-xs font-light transition-all duration-300 backdrop-blur-glass border border-white/20"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
