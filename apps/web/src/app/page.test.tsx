import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "./page";

// Mock Sanity client
vi.mock("@/lib/sanity.client", () => ({
  sanity: {
    fetch: vi.fn().mockResolvedValue([
      {
        name: "Test Product",
        priceJPY: 1000,
        servingsPerContainer: 30,
        servingsPerDay: 1,
        slug: { current: "test-product" },
      },
    ]),
  },
}));

// Mock environment variables
beforeEach(() => {
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "test-project";
  process.env.NEXT_PUBLIC_SANITY_DATASET = "test";
});

describe("Home Page", () => {
  it("renders the main heading", async () => {
    const HomeComponent = await Home();
    render(HomeComponent);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("サプティア");
  });

  it("renders the description", async () => {
    const HomeComponent = await Home();
    render(HomeComponent);
    const description = screen.getByText(
      "安全 × 価格 × 説明可能性のサプリ意思決定エンジン",
    );
    expect(description).toBeInTheDocument();
  });

  it("renders the compare link", async () => {
    const HomeComponent = await Home();
    render(HomeComponent);
    const compareLink = screen.getByRole("link", { name: "商品比較" });
    expect(compareLink).toHaveAttribute("href", "/compare");
  });

  it("renders product table when products are available", async () => {
    const HomeComponent = await Home();
    render(HomeComponent);

    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });
  });
});
