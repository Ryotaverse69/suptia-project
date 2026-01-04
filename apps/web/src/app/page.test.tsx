import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "./page";
import { sanity } from "@/lib/sanity.client";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Mock Next.js headers
vi.mock("next/headers", () => ({
  headers: vi.fn(() => ({
    get: vi.fn(() => null),
  })),
}));

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: vi.fn(() => "/"),
}));

// Mock Sanity client
vi.mock("@/lib/sanity.client", () => ({
  sanity: {
    fetch: vi.fn(),
  },
}));

// Mock Supabase client
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi
        .fn()
        .mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        })),
      })),
    })),
  })),
}));

// モックデータと環境変数のセットアップ
beforeEach(() => {
  // 環境変数の設定
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "test-project";
  process.env.NEXT_PUBLIC_SANITY_DATASET = "test";
  process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";

  // モックされたsanity.fetchを取得
  const mockFetch = vi.mocked(sanity.fetch);

  // モックのリセット
  mockFetch.mockReset();

  // 新しいページ構造に合わせたモック (page.tsx の呼び出し順):
  // 1回目: getProducts() - 商品一覧
  mockFetch.mockResolvedValueOnce([
    {
      _id: "test-1",
      name: "Test Product",
      priceJPY: 1000,
      servingsPerContainer: 30,
      servingsPerDay: 1,
      slug: { current: "test-product" },
      ingredients: [
        {
          amountMgPerServing: 100,
          ingredient: {
            name: "ビタミンC",
            nameEn: "Vitamin C",
            category: "ビタミン",
          },
        },
      ],
      tierRatings: { overallRank: "A" },
      badges: [],
    },
  ] as any);

  // 2回目: getFeaturedProducts() - おすすめ商品
  mockFetch.mockResolvedValueOnce([
    {
      _id: "featured-1",
      name: "Test Product",
      priceJPY: 1500,
      servingsPerContainer: 60,
      servingsPerDay: 2,
      slug: { current: "featured-product" },
      ingredients: [],
      tierRatings: { overallRank: "S" },
      badges: [],
    },
  ] as any);

  // 3回目: getPopularIngredientsWithStats() - 人気成分
  mockFetch.mockResolvedValueOnce([
    {
      name: "ビタミンC",
      nameEn: "Vitamin C",
      category: "ビタミン",
      description: "テスト説明",
      slug: { current: "vitamin-c" },
      productCount: 10,
      minPrice: 500,
    },
  ] as any);

  // 4回目: getTotalProductCount() - 商品数
  mockFetch.mockResolvedValueOnce(100 as any);

  // 5回目以降
  mockFetch.mockResolvedValue([] as any);
});

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <FavoritesProvider>{children}</FavoritesProvider>
  </AuthProvider>
);

describe("Home Page", () => {
  it("renders the main heading", async () => {
    const HomeComponent = await Home();
    render(<TestWrapper>{HomeComponent}</TestWrapper>);
    const heading = screen.getByRole("heading", { level: 1 });
    // Phase Aで変更されたヒーローのメインコピー
    expect(heading).toHaveTextContent(/選ぶ理由が、見える/);
  });

  it("renders the recommended products section", async () => {
    const HomeComponent = await Home();
    render(<TestWrapper>{HomeComponent}</TestWrapper>);
    const heading = screen.getByRole("heading", {
      name: "おすすめのサプリメント",
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders product cards when products are available", async () => {
    const HomeComponent = await Home();
    render(<TestWrapper>{HomeComponent}</TestWrapper>);

    await waitFor(() => {
      expect(screen.getAllByText("Test Product")).not.toHaveLength(0);
    });
  });
});
