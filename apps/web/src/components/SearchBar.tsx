"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { liquidGlassClasses } from "@/lib/design-system";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-[900px] mx-auto">
      <div
        className={`flex items-center overflow-hidden ${liquidGlassClasses.light} transition-all duration-500 hover:border-white/60`}
        style={{
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
  );
}
