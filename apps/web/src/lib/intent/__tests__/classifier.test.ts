/**
 * Intent Classifier Tests
 *
 * 入力パターンごとの分類テスト
 */

import { describe, expect, test } from "vitest";
import { classifyIntent } from "../classifier";
import { normalizeInput } from "../dictionaries";

describe("normalizeInput", () => {
  test("全角英数字を半角に変換", () => {
    expect(normalizeInput("ＡＢＣ１２３")).toBe("abc123");
  });

  test("大文字を小文字に変換", () => {
    expect(normalizeInput("Vitamin D")).toBe("vitamin d");
  });

  test("前後の空白を削除", () => {
    expect(normalizeInput("  ビタミンD  ")).toBe("ビタミンd");
  });

  test("連続スペースを1つに", () => {
    expect(normalizeInput("ビタミン   D")).toBe("ビタミン d");
  });
});

describe("classifyIntent - 成分名", () => {
  test("単純な成分名 → search", () => {
    const result = classifyIntent("ビタミンD");
    expect(result.destination).toBe("search");
    expect(result.intent).toBe("ingredient");
    expect(result.extractedEntities.ingredients).toContain("ビタミン");
  });

  test("英語の成分名 → search", () => {
    const result = classifyIntent("omega-3");
    expect(result.destination).toBe("search");
    expect(result.extractedEntities.ingredients).toContain("omega");
  });

  test("DHA → search", () => {
    const result = classifyIntent("DHA");
    expect(result.destination).toBe("search");
    expect(result.extractedEntities.ingredients).toContain("dha");
  });

  test("マルチビタミン → search", () => {
    const result = classifyIntent("マルチビタミン");
    expect(result.destination).toBe("search");
    expect(result.extractedEntities.ingredients).toContain("マルチビタミン");
  });
});

describe("classifyIntent - 商品名", () => {
  test("ブランド名を含む → search (product)", () => {
    const result = classifyIntent("ネイチャーメイド マルチビタミン");
    expect(result.destination).toBe("search");
    expect(result.intent).toBe("product");
    expect(result.extractedEntities.products).toContain("ネイチャーメイド");
  });

  test("DHC → search (product)", () => {
    const result = classifyIntent("DHC ビタミンC");
    expect(result.destination).toBe("search");
    expect(result.extractedEntities.products).toContain("dhc");
  });
});

describe("classifyIntent - 疑問・質問", () => {
  test("？で終わる → concierge", () => {
    const result = classifyIntent("ビタミンDって飲んでいい？");
    expect(result.destination).toBe("concierge");
    expect(result.intent).toBe("question");
  });

  test("安全性の質問 → concierge", () => {
    const result = classifyIntent("このサプリ安全ですか");
    expect(result.destination).toBe("concierge");
    expect(result.intent).toBe("question");
  });

  test("おすすめ → concierge", () => {
    const result = classifyIntent("おすすめのサプリ");
    expect(result.destination).toBe("concierge");
    expect(result.intent).toBe("question");
  });

  test("選び方 → concierge", () => {
    const result = classifyIntent("マルチビタミンの選び方");
    expect(result.destination).toBe("concierge");
    expect(result.intent).toBe("question");
  });

  test("副作用の質問 → concierge", () => {
    const result = classifyIntent("ビタミンDの副作用");
    expect(result.destination).toBe("concierge");
    expect(result.intent).toBe("question");
  });

  test("飲み合わせ → concierge", () => {
    const result = classifyIntent("カルシウムとマグネシウムの飲み合わせ");
    expect(result.destination).toBe("concierge");
    expect(result.intent).toBe("question");
  });
});

describe("classifyIntent - 条件", () => {
  test("妊娠中 → concierge", () => {
    const result = classifyIntent("妊娠中にビタミンDを飲んでも大丈夫？");
    expect(result.destination).toBe("concierge");
    expect(result.extractedEntities.conditions).toContain("妊娠");
  });

  test("授乳中 → concierge", () => {
    const result = classifyIntent("授乳中のサプリ");
    expect(result.destination).toBe("concierge");
    expect(result.extractedEntities.conditions).toContain("授乳");
  });

  test("子供 → concierge", () => {
    const result = classifyIntent("子供にビタミン");
    expect(result.destination).toBe("concierge");
    expect(result.extractedEntities.conditions).toContain("子供");
  });

  test("服薬中 → concierge", () => {
    const result = classifyIntent("薬を飲んでるけどサプリ大丈夫？");
    expect(result.destination).toBe("concierge");
    expect(result.extractedEntities.conditions).toContain("薬を飲");
  });

  test("条件 + 成分 → 条件優先で concierge", () => {
    // 「妊娠中 ビタミン」のような短文でも、条件が成分より優先される
    const result = classifyIntent("妊娠中 ビタミン");
    expect(result.destination).toBe("concierge");
    expect(result.intent).toBe("condition");
    expect(result.extractedEntities.conditions).toContain("妊娠");
    expect(result.extractedEntities.ingredients).toContain("ビタミン");
  });
});

describe("classifyIntent - 悩み・症状", () => {
  test("疲れやすい → concierge", () => {
    const result = classifyIntent("疲れやすいんだけど何がいい？");
    expect(result.destination).toBe("concierge");
    expect(result.extractedEntities.symptoms).toContain("疲れ");
  });

  test("眠れない → concierge", () => {
    const result = classifyIntent("眠れない時のサプリ");
    expect(result.destination).toBe("concierge");
    expect(result.extractedEntities.symptoms).toContain("眠れない");
  });

  test("ストレス → concierge", () => {
    const result = classifyIntent("ストレスに効くサプリ");
    expect(result.destination).toBe("concierge");
    expect(result.extractedEntities.symptoms).toContain("ストレス");
  });

  test("肌荒れ → concierge", () => {
    const result = classifyIntent("肌荒れが気になる");
    expect(result.destination).toBe("concierge");
    expect(result.extractedEntities.symptoms).toContain("肌荒れ");
  });
});

describe("classifyIntent - 比較", () => {
  test("AとBの違い → concierge (comparison)", () => {
    const result = classifyIntent("DHAとEPAの違い");
    expect(result.destination).toBe("concierge");
    expect(result.intent).toBe("comparison");
  });

  test("vs形式 → concierge (comparison)", () => {
    const result = classifyIntent("ビタミンC vs ビタミンE");
    expect(result.destination).toBe("concierge");
    expect(result.intent).toBe("comparison");
  });
});

describe("classifyIntent - メソッド判定", () => {
  test("パターンマッチで判定 → method: pattern", () => {
    const result = classifyIntent("これ安全？");
    expect(result.method).toBe("pattern");
  });

  test("辞書マッチで判定 → method: dictionary", () => {
    const result = classifyIntent("疲れやすい");
    expect(result.method).toBe("dictionary");
  });

  test("成分名のみ → method: dictionary", () => {
    const result = classifyIntent("ビタミンD");
    expect(result.method).toBe("dictionary");
  });
});

describe("classifyIntent - confidence", () => {
  test("明確なパターン → high confidence", () => {
    const result = classifyIntent("妊娠中にビタミンD飲んでいい？");
    expect(result.confidence).toBe("high");
  });

  test("成分名のみ → medium confidence", () => {
    const result = classifyIntent("カルシウム");
    expect(result.confidence).toBe("medium");
  });
});

describe("classifyIntent - エッジケース", () => {
  test("空文字 → fallback", () => {
    const result = classifyIntent("");
    expect(result.destination).toBe("search");
    expect(result.method).toBe("fallback");
  });

  test("空白のみ → fallback", () => {
    const result = classifyIntent("   ");
    expect(result.destination).toBe("search");
    expect(result.method).toBe("fallback");
  });

  test("短い不明な入力 → concierge（AIが聞き返しで回収）", () => {
    const result = classifyIntent("あ");
    expect(result.destination).toBe("concierge");
  });

  test("長い文章 → concierge", () => {
    const result = classifyIntent(
      "最近仕事が忙しくて疲れやすくなってきたのですが、何かおすすめのサプリはありますか",
    );
    expect(result.destination).toBe("concierge");
  });
});
