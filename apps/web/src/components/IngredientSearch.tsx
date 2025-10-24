"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function IngredientSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400"
        size={20}
      />
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="成分名で検索（例：ビタミンC、オメガ3）"
        className="w-full px-12 py-4 rounded-lg text-primary-900 placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-white"
      />
    </form>
  );
}
