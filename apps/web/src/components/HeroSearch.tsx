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

      <div className="relative mx-auto max-w-[900px] w-full z-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6 tracking-wide drop-shadow-lg">
            あなたに最適なサプリを見つけよう
          </h1>
        </div>

        {/* 3D search box with floating animation */}
        <form onSubmit={handleSearch} className="relative mb-8 animate-float">
          <div
            className="flex items-center rounded-xl overflow-hidden backdrop-blur-2xl border border-white/40 transition-all duration-500 hover:border-white/60"
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              boxShadow:
                "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 20px 60px -10px rgba(59, 102, 224, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="pl-6 pr-3">
              <Search className="text-white/80" size={22} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="サプリメント名、成分名で検索..."
              className="flex-1 py-5 px-2 text-base font-light bg-transparent outline-none placeholder:text-white/50 text-white"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-accent-purple to-accent-purple/90 hover:from-accent-purple/90 hover:to-accent-purple text-white font-medium px-10 py-5 transition-all duration-300 text-sm hover:shadow-glow-purple"
              style={{
                boxShadow:
                  "0 4px 15px 0 rgba(86, 71, 166, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
              }}
            >
              検索
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 justify-center items-center">
          <span className="text-white/90 text-xs font-light tracking-wide drop-shadow">
            人気の検索:
          </span>
          {["ビタミンD", "オメガ3", "マグネシウム", "プロテイン"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-5 py-2 text-white rounded-full text-xs font-light transition-all duration-300 backdrop-blur-xl border border-white/30 hover:border-white/50 hover:bg-white/10"
              style={{
                boxShadow:
                  "0 4px 12px 0 rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
