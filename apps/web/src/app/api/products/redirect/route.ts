/**
 * 商品名から商品詳細ページへリダイレクトするAPI
 *
 * 使用例:
 * /api/products/redirect?name=DHC+ビタミンC
 * → 商品が見つかれば /products/dhc-vitamin-c にリダイレクト
 * → 見つからなければ /products?search=DHC+ビタミンC にリダイレクト
 */

import { NextRequest, NextResponse } from "next/server";
import { sanityServer } from "@/lib/sanityServer";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productName = searchParams.get("name");

  if (!productName) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  try {
    // 商品名で検索（完全一致または部分一致）
    const query = `*[_type == "product" && (
      name == $name ||
      name match $searchPattern
    )][0]{
      "slug": slug.current
    }`;

    const product = await sanityServer.fetch(query, {
      name: productName,
      searchPattern: `*${productName}*`,
    });

    if (product?.slug) {
      // 商品が見つかった場合、詳細ページへリダイレクト
      return NextResponse.redirect(
        new URL(`/products/${product.slug}`, request.url),
      );
    }

    // 見つからない場合、検索ページへリダイレクト
    const searchUrl = new URL("/products", request.url);
    searchUrl.searchParams.set("search", productName);
    return NextResponse.redirect(searchUrl);
  } catch (error) {
    console.error("Product redirect error:", error);
    // エラー時も検索ページへフォールバック
    const searchUrl = new URL("/products", request.url);
    searchUrl.searchParams.set("search", productName);
    return NextResponse.redirect(searchUrl);
  }
}
