import { describe, it, expect } from "vitest";
import {
  generateInternalLinks,
  generateInternalLinksInMarkdown,
  suggestRelatedIngredients,
  countLinks,
  calculateLinkDensity,
  type LinkableIngredient,
} from "../internal-links";

describe("internal-links", () => {
  const mockIngredients: LinkableIngredient[] = [
    {
      name: "ビタミンC",
      nameEn: "Vitamin C",
      slug: "vitamin-c",
      aliases: ["アスコルビン酸"],
    },
    {
      name: "ビタミンD",
      nameEn: "Vitamin D",
      slug: "vitamin-d",
      aliases: ["カルシフェロール"],
    },
    {
      name: "オメガ3脂肪酸",
      nameEn: "Omega-3",
      slug: "omega-3",
      aliases: ["EPA", "DHA"],
    },
    {
      name: "マグネシウム",
      nameEn: "Magnesium",
      slug: "magnesium",
    },
  ];

  describe("generateInternalLinks", () => {
    it("テキスト内の成分名を検出してリンクに変換できる", () => {
      const text = "ビタミンCは免疫力強化に効果的です。";
      const result = generateInternalLinks(text, mockIngredients);

      expect(result).toContain('<a href="/ingredients/vitamin-c"');
      expect(result).toContain(">ビタミンC</a>");
    });

    it("複数の成分名を検出できる", () => {
      const text = "ビタミンCとビタミンDを一緒に摂取すると相乗効果があります。";
      const result = generateInternalLinks(text, mockIngredients);

      expect(result).toContain("vitamin-c");
      expect(result).toContain("vitamin-d");
    });

    it("同一成分への最大リンク数を制限できる", () => {
      const text = "ビタミンCはビタミンCの中でもビタミンCが特に重要です。";
      const result = generateInternalLinks(text, mockIngredients, {
        maxLinksPerIngredient: 2,
      });

      // リンクは2個まで
      const linkMatches = result.match(/vitamin-c/g);
      expect(linkMatches).toBeTruthy();
      expect(linkMatches?.length).toBe(2);
    });

    it("除外成分をスキップできる", () => {
      const text = "ビタミンCとビタミンDの相互作用について。";
      const result = generateInternalLinks(text, mockIngredients, {
        excludeIngredients: ["ビタミンC"],
      });

      expect(result).not.toContain("vitamin-c");
      expect(result).toContain("vitamin-d");
    });

    it("別名・同義語でもリンクを生成できる", () => {
      const text = "アスコルビン酸は水溶性ビタミンです。";
      const result = generateInternalLinks(text, mockIngredients);

      expect(result).toContain("vitamin-c");
      expect(result).toContain(">アスコルビン酸</a>");
    });

    it("英名でもリンクを生成できる", () => {
      const text = "Vitamin C is essential for health.";
      const result = generateInternalLinks(text, mockIngredients);

      expect(result).toContain("vitamin-c");
      expect(result).toContain(">Vitamin C</a>");
    });

    it("CSSクラスを指定できる", () => {
      const text = "ビタミンCについて。";
      const result = generateInternalLinks(text, mockIngredients, {
        linkClassName: "custom-link",
      });

      expect(result).toContain('class="custom-link"');
    });

    it("新しいタブで開く設定ができる", () => {
      const text = "ビタミンDの効果。";
      const result = generateInternalLinks(text, mockIngredients, {
        openInNewTab: true,
      });

      expect(result).toContain('target="_blank"');
      expect(result).toContain('rel="noopener noreferrer"');
    });

    it("ベースURLをカスタマイズできる", () => {
      const text = "マグネシウムについて。";
      const result = generateInternalLinks(text, mockIngredients, {
        baseUrl: "/guides/ingredients",
      });

      expect(result).toContain("/guides/ingredients/magnesium");
    });

    it("すでにリンク内にある成分名は二重リンクしない", () => {
      const text = '<a href="/other">ビタミンC</a>について';
      const result = generateInternalLinks(text, mockIngredients);

      // 既存のリンクはそのまま（二重リンクしない）
      expect(result).toContain('<a href="/other">ビタミンC</a>');

      // "について"部分にはリンクがない
      const linkCount = (result.match(/vitamin-c/g) || []).length;
      expect(linkCount).toBe(0); // 既存のリンクは含まない
    });

    it("長い成分名を優先してマッチする", () => {
      const ingredients: LinkableIngredient[] = [
        { name: "ビタミン", slug: "vitamin" },
        { name: "ビタミンC", slug: "vitamin-c" },
      ];

      const text = "ビタミンCは重要です。";
      const result = generateInternalLinks(text, ingredients);

      // "ビタミンC"全体がマッチ（"ビタミン"だけではない）
      expect(result).toContain("vitamin-c");
      expect(result).not.toContain(">ビタミン</a>C");
    });
  });

  describe("generateInternalLinksInMarkdown", () => {
    it("Markdown内の成分名をリンクに変換できる", () => {
      const markdown = "**ビタミンC**は免疫力強化に効果的です。";
      const result = generateInternalLinksInMarkdown(markdown, mockIngredients);

      expect(result).toContain("[ビタミンC](/ingredients/vitamin-c)");
    });

    it("コードブロック内はリンク化しない", () => {
      const markdown = "```\nビタミンC\n```";
      const result = generateInternalLinksInMarkdown(markdown, mockIngredients);

      expect(result).toBe(markdown); // 変更なし
    });

    it("インラインコード内はリンク化しない", () => {
      const markdown = "`ビタミンC`というコード";
      const result = generateInternalLinksInMarkdown(markdown, mockIngredients);

      expect(result).toBe(markdown); // 変更なし
    });

    it("既存のMarkdownリンク内はリンク化しない", () => {
      const markdown = "[ビタミンC](https://example.com)について";
      const result = generateInternalLinksInMarkdown(markdown, mockIngredients);

      expect(result).toBe(markdown); // 既存リンクはそのまま
    });

    it("通常のテキスト部分のみリンク化する", () => {
      const markdown = `
## ビタミンCの効果

ビタミンCは\`code内のビタミンC\`と違います。

\`\`\`
コードブロック内のビタミンC
\`\`\`

[既存リンクのビタミンC](https://example.com)

通常のビタミンCはリンク化されます。
      `;

      const result = generateInternalLinksInMarkdown(markdown, mockIngredients);

      // 通常のテキスト部分のみリンク化
      expect(result).toContain("[ビタミンC](/ingredients/vitamin-c)");

      // コードブロック、インラインコード、既存リンクはそのまま
      expect(result).toContain("`code内のビタミンC`");
      expect(result).toContain("コードブロック内のビタミンC");
      expect(result).toContain("[既存リンクのビタミンC](https://example.com)");
    });
  });

  describe("suggestRelatedIngredients", () => {
    it("テキスト内に出現する成分を提案できる", () => {
      const text = "ビタミンCとオメガ3脂肪酸を併用すると効果的です。";
      const suggestions = suggestRelatedIngredients(text, mockIngredients);

      expect(suggestions).toHaveLength(2);
      expect(suggestions.some((i) => i.slug === "vitamin-c")).toBe(true);
      expect(suggestions.some((i) => i.slug === "omega-3")).toBe(true);
    });

    it("現在の成分は除外できる", () => {
      const text = "ビタミンCはビタミンDと相性が良い。";
      const suggestions = suggestRelatedIngredients(
        text,
        mockIngredients,
        "ビタミンC",
      );

      expect(suggestions).toHaveLength(1);
      expect(suggestions[0].slug).toBe("vitamin-d");
    });

    it("別名でも検出できる", () => {
      const text = "EPAとDHAは健康に良い。";
      const suggestions = suggestRelatedIngredients(text, mockIngredients);

      expect(suggestions).toHaveLength(1);
      expect(suggestions[0].slug).toBe("omega-3");
    });

    it("成分が出現しない場合は空配列を返す", () => {
      const text = "健康的な食事について。";
      const suggestions = suggestRelatedIngredients(text, mockIngredients);

      expect(suggestions).toEqual([]);
    });
  });

  describe("countLinks", () => {
    it("HTMLリンクをカウントできる", () => {
      const text = '<a href="/foo">Link1</a> and <a href="/bar">Link2</a>';
      const count = countLinks(text);

      expect(count).toBe(2);
    });

    it("Markdownリンクをカウントできる", () => {
      const text = "[Link1](/foo) and [Link2](/bar)";
      const count = countLinks(text);

      expect(count).toBe(2);
    });

    it("HTMLとMarkdownリンクを合計できる", () => {
      const text = '<a href="/foo">Link1</a> and [Link2](/bar)';
      const count = countLinks(text);

      expect(count).toBe(2);
    });

    it("リンクがない場合は0を返す", () => {
      const text = "No links here.";
      const count = countLinks(text);

      expect(count).toBe(0);
    });
  });

  describe("calculateLinkDensity", () => {
    it("リンク密度を正しく計算できる", () => {
      const text = "This is [link1](/foo) and [link2](/bar) text.";
      // 単語数: 6 (Markdownリンクも1単語とカウント), リンク数: 2
      const density = calculateLinkDensity(text);

      expect(density).toBeCloseTo(2 / 6, 2);
    });

    it("リンクがない場合は0を返す", () => {
      const text = "No links here at all.";
      const density = calculateLinkDensity(text);

      expect(density).toBe(0);
    });

    it("テキストが空の場合は0を返す", () => {
      const text = "";
      const density = calculateLinkDensity(text);

      expect(density).toBe(0);
    });
  });

  describe("Real-world Scenarios", () => {
    it("成分ガイドページの本文にリンクを自動挿入できる", () => {
      const content = `
ビタミンCは水溶性ビタミンの一種で、強力な抗酸化作用を持ちます。
ビタミンDやマグネシウムと併用すると相乗効果が期待できます。

研究によれば、ビタミンCは免疫細胞の働きをサポートし、
風邪の予防に役立つ可能性があります。
      `;

      const result = generateInternalLinks(content, mockIngredients, {
        maxLinksPerIngredient: 2,
      });

      // ビタミンC: 最大2回
      const vitCMatches = result.match(/vitamin-c/g);
      expect(vitCMatches).toBeTruthy();
      expect(vitCMatches?.length).toBeLessThanOrEqual(2);

      // ビタミンD: 1回
      expect(result).toContain("vitamin-d");

      // マグネシウム: 1回
      expect(result).toContain("magnesium");
    });

    it("Markdown記事にリンクを挿入できる（コード部分は除外）", () => {
      const markdown = `
# ビタミンCガイド

ビタミンCは\`code\`です。

\`\`\`typescript
const vitaminC = "test";
\`\`\`

通常のビタミンCはリンク化されます。
      `;

      const result = generateInternalLinksInMarkdown(markdown, mockIngredients);

      // 見出しのビタミンC
      expect(result).toContain("# [ビタミンC](/ingredients/vitamin-c)");

      // コードブロック内はそのまま
      expect(result).toContain('const vitaminC = "test";');

      // 通常テキストのビタミンC（最大2つまでリンク化されるため、3つ目はリンク化されない）
      const linkCount = (
        result.match(/\[ビタミンC\]\(\/ingredients\/vitamin-c\)/g) || []
      ).length;
      expect(linkCount).toBeLessThanOrEqual(2);
    });

    it("関連成分を提案して「関連記事」セクションを生成できる", () => {
      const content = `
ビタミンCは美肌効果が期待できます。
オメガ3脂肪酸と併用すると、炎症を抑える効果が高まります。
      `;

      const related = suggestRelatedIngredients(
        content,
        mockIngredients,
        "ビタミンC",
      );

      expect(related).toHaveLength(1);
      expect(related[0].name).toBe("オメガ3脂肪酸");

      // これを元に「関連記事」リンクを生成
      const relatedLinks = related.map(
        (ing) => `- [${ing.name}](/ingredients/${ing.slug})`,
      );

      expect(relatedLinks[0]).toBe("- [オメガ3脂肪酸](/ingredients/omega-3)");
    });
  });
});
