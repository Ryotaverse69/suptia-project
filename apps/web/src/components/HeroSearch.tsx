"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoleculeBackground } from "./MoleculeBackground";

interface PopularSearch {
  name: string;
}

interface HeroSearchProps {
  popularSearches?: PopularSearch[];
}

export function HeroSearch({ popularSearches = [] }: HeroSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      // 検索ページへリダイレクト
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="relative min-h-[50vh] sm:min-h-[55vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 xl:px-16 overflow-hidden">
      {/* Molecule background animation - Keep it but ensure it works on light bg */}
      <div className="opacity-60">
        <MoleculeBackground />
      </div>

      <div className="relative mx-auto max-w-[900px] w-full z-10 px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white mb-3 sm:mb-5 md:mb-6 tracking-wide drop-shadow-lg leading-tight">
            あなたに最適な
            <br className="block sm:hidden" />
            サプリを見つけよう
          </h1>
        </div>

        {/* 3D search box with focus effects */}
        <form
          onSubmit={handleSearch}
          className="relative mb-5 sm:mb-7 md:mb-8 group"
        >
          {/* Gathering Mist Effect Layer - Concentrates on hover */}
          <div
            className={`absolute -inset-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
              isFocused ? "opacity-100" : ""
            }`}
          >
            {/* The gathering mist */}
            <div className="absolute inset-0 bg-blue-500/20 blur-[40px] rounded-full animate-mist-gather" />
          </div>

          <div
            className={`relative flex items-center rounded-lg sm:rounded-xl overflow-hidden backdrop-blur-2xl border transition-all duration-500 ${
              isFocused
                ? "border-white scale-[1.02] shadow-2xl"
                : "border-white/40 hover:border-white/60"
            }`}
            style={{
              background: isFocused
                ? "rgba(255, 255, 255, 0.95)"
                : "rgba(255, 255, 255, 0.08)",
              boxShadow: isFocused
                ? "0 0 50px rgba(255, 255, 255, 0.5), 0 0 20px rgba(59, 102, 224, 0.3)"
                : "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
            }}
          >
            <label htmlFor="hero-search" className="sr-only">
              サプリメントや成分を検索
            </label>
            <div className="pl-3 sm:pl-4 md:pl-6 pr-2 sm:pr-3">
              <Search
                className={`transition-all duration-300 ${
                  isFocused ? "text-blue-600 scale-110" : "text-white/80"
                }`}
                size={18}
                aria-hidden="true"
              />
            </div>
            <input
              id="hero-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="サプリ名、成分名で検索..."
              className={`flex-1 py-2.5 sm:py-4 md:py-5 px-1 sm:px-2 text-sm sm:text-base font-light bg-transparent outline-none transition-colors duration-300 ${
                isFocused
                  ? "text-slate-800 placeholder:text-slate-400"
                  : "text-white placeholder:text-white/50"
              }`}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-accent-purple to-accent-purple/90 hover:from-accent-purple/90 hover:to-accent-purple text-white font-medium px-4 sm:px-7 md:px-10 py-3 sm:py-4 md:py-5 transition-all duration-300 text-xs sm:text-sm hover:shadow-glow-purple whitespace-nowrap relative z-10"
              style={{
                boxShadow:
                  "0 4px 15px 0 rgba(86, 71, 166, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
              }}
            >
              検索
            </button>
          </div>
        </form>

        {/* Popular Searches */}
        {popularSearches.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center items-center mb-6 sm:mb-7 md:mb-8">
            <span className="text-white/90 text-[10px] sm:text-xs font-light tracking-wide drop-shadow">
              人気の検索:
            </span>
            {popularSearches.slice(0, 4).map((search) => (
              <button
                key={search.name}
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(search.name)}`);
                }}
                className="relative px-2 sm:px-3 py-0.5 sm:py-1 text-white rounded-full text-[10px] sm:text-xs font-light transition-all duration-300 backdrop-blur-xl border border-white/30 hover:border-white/50 hover:bg-white/10 group overflow-hidden"
                style={{
                  boxShadow:
                    "0 4px 12px 0 rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                }}
              >
                {/* Gathering Mist for Tags */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <span className="absolute inset-0 bg-blue-500/30 blur-md animate-mist-gather" />
                </span>
                <span className="relative z-10">{search.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Diagnosis CTA Button */}
        <div className="flex justify-center">
          <Link
            href="/diagnosis"
            className="group relative inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-xl border border-white/20 overflow-visible"
          >
            {/* Gathering Mist for Button */}
            <div className="absolute -inset-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 bg-blue-500/30 blur-[30px] rounded-full animate-mist-gather" />
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:scale-110 transition-transform hidden sm:block relative z-10"
            >
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <span className="text-sm sm:text-base relative z-10">
              あなたに最適なサプリを診断する
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-1 transition-transform sm:w-5 sm:h-5 relative z-10"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
