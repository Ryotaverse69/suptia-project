import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "./page";
import { sanity } from "@/lib/sanity.client";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

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

describe("Home Page", () => {
  it("renders the main heading", async () => {
    const HomeComponent = await Home();
    render(<FavoritesProvider>{HomeComponent}</FavoritesProvider>);
    const heading = screen.getByRole("heading", { level: 1 });
    // The heading text is split across multiple spans
    expect(heading).toHaveTextContent(/あなたに最適な/);
    expect(heading).toHaveTextContent(/サプリを見つけよう/);
  });

  it("renders the recommended products section", async () => {
    const HomeComponent = await Home();
    render(<FavoritesProvider>{HomeComponent}</FavoritesProvider>);
    const heading = screen.getByRole("heading", {
      name: "おすすめのサプリメント",
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders product cards when products are available", async () => {
    const HomeComponent = await Home();
    render(<FavoritesProvider>{HomeComponent}</FavoritesProvider>);

    await waitFor(() => {
      expect(screen.getAllByText("Test Product")).not.toHaveLength(0);
    });
  });
});
