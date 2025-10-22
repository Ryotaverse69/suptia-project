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
    expect(heading).toHaveTextContent("あなたに最適なサプリを見つけよう");
  });

  it("renders the recommended products section", async () => {
    const HomeComponent = await Home();
    render(HomeComponent);
    const heading = screen.getByRole("heading", {
      name: "おすすめのサプリメント",
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders product cards when products are available", async () => {
    const HomeComponent = await Home();
    render(HomeComponent);

    await waitFor(() => {
      expect(screen.getAllByText("Test Product")).not.toHaveLength(0);
    });
  });
});
