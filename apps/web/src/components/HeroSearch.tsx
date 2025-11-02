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
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      // 検索ページへリダイレクト
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 lg:px-12 xl:px-16 overflow-hidden">
      {/* Animated gradient base */}
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={{
          background:
            "linear-gradient(135deg, #7a98ec 0%, #5a7fe6 25%, #3b66e0 50%, #2d4fb8 75%, #243d94 100%)",
          backgroundSize: "200% 200%",
        }}
      ></div>

      {/* 6 animated orb layers for rich depth */}
      <div
        className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full blur-3xl animate-depth-orb-1"
        style={{
          background:
            "radial-gradient(circle, rgba(122, 152, 236, 0.6) 0%, rgba(122, 152, 236, 0.3) 40%, transparent 70%)",
        }}
      ></div>
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full blur-3xl animate-depth-orb-2"
        style={{
          background:
            "radial-gradient(circle, rgba(90, 127, 230, 0.5) 0%, rgba(90, 127, 230, 0.25) 40%, transparent 70%)",
        }}
      ></div>
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full blur-3xl animate-depth-orb-3"
        style={{
          background:
            "radial-gradient(circle, rgba(59, 102, 224, 0.7) 0%, rgba(59, 102, 224, 0.4) 40%, transparent 70%)",
        }}
      ></div>
      <div
        className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl animate-depth-orb-4"
        style={{
          background:
            "radial-gradient(circle, rgba(45, 79, 184, 0.5) 0%, rgba(45, 79, 184, 0.3) 40%, transparent 70%)",
        }}
      ></div>
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 w-[750px] h-[750px] rounded-full blur-3xl animate-depth-orb-5"
        style={{
          background:
            "radial-gradient(circle, rgba(36, 61, 148, 0.4) 0%, rgba(36, 61, 148, 0.2) 40%, transparent 70%)",
        }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full blur-3xl animate-depth-orb-6"
        style={{
          background:
            "radial-gradient(circle, rgba(100, 229, 179, 0.15) 0%, rgba(100, 229, 179, 0.08) 40%, transparent 70%)",
        }}
      ></div>

      {/* Molecule background animation */}
      <MoleculeBackground />

      <div className="relative mx-auto max-w-[900px] w-full z-10 px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4 sm:mb-5 md:mb-6 tracking-wide drop-shadow-lg">
            あなたに最適なサプリを見つけよう
          </h1>
        </div>

        {/* 3D search box */}
        <form onSubmit={handleSearch} className="relative mb-6 sm:mb-7 md:mb-8">
          <div
            className="flex items-center rounded-lg sm:rounded-xl overflow-hidden backdrop-blur-2xl border border-white/40 transition-all duration-500 hover:border-white/60"
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              boxShadow:
                "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 20px 60px -10px rgba(59, 102, 224, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="pl-3 sm:pl-4 md:pl-6 pr-2 sm:pr-3">
              <Search className="text-white/80" size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="サプリメント名、成分名で検索..."
              className="flex-1 py-3 sm:py-4 md:py-5 px-1 sm:px-2 text-sm sm:text-base font-light bg-transparent outline-none placeholder:text-white/50 text-white"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-accent-purple to-accent-purple/90 hover:from-accent-purple/90 hover:to-accent-purple text-white font-medium px-5 sm:px-7 md:px-10 py-3 sm:py-4 md:py-5 transition-all duration-300 text-xs sm:text-sm hover:shadow-glow-purple whitespace-nowrap"
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
                className="px-2 sm:px-3 py-0.5 sm:py-1 text-white rounded-full text-[10px] sm:text-xs font-light transition-all duration-300 backdrop-blur-xl border border-white/30 hover:border-white/50 hover:bg-white/10"
                style={{
                  boxShadow:
                    "0 4px 12px 0 rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                }}
              >
                {search.name}
              </button>
            ))}
          </div>
        )}

        {/* Diagnosis CTA Button */}
        <div className="flex justify-center">
          <Link
            href="/diagnosis"
            className="group relative inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-xl border border-white/20"
          >
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
              className="group-hover:scale-110 transition-transform hidden sm:block"
            >
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <span className="text-sm sm:text-base">
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
              className="group-hover:translate-x-1 transition-transform sm:w-5 sm:h-5"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
