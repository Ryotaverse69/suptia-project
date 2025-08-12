import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "./page";

describe("Home Page", () => {
  it("renders the main heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("サプティア");
  });

  it("renders the description", () => {
    render(<Home />);
    const description = screen.getByText(
      "安全 × 価格 × 説明可能性のサプリ意思決定エンジン",
    );
    expect(description).toBeInTheDocument();
  });

  it("renders the compare link", () => {
    render(<Home />);
    const compareLink = screen.getByRole("link", { name: "商品比較" });
    expect(compareLink).toHaveAttribute("href", "/compare");
  });
});
