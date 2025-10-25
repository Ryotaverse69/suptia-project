// Validate environment variables at startup
import "@/env";
import { headers } from "next/headers";
import Script from "next/script";
import { Suspense } from "react";
import { getSiteUrl } from "@/lib/runtimeConfig";
import { generateOrganizationJsonLd } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Footer } from "@/components/footer";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://suptia.com"),
  title: {
    default: "サプティア | 科学的根拠に基づくサプリメント比較",
    template: "%s | サプティア",
  },
  description:
    "科学的根拠に基づくサプリメント比較メタサーチ。あなたに最適なサプリメントを見つけるお手伝いをします。",
  verification: {
    google: process.env.GOOGLE_SEARCH_CONSOLE_VERIFICATION,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://suptia.com",
    siteName: "サプティア",
    title: "サプティア | 科学的根拠に基づくサプリメント比較",
    description:
      "科学的根拠に基づくサプリメント比較メタサーチ。あなたに最適なサプリメントを見つけるお手伝いをします。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "サプティア",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "サプティア | 科学的根拠に基づくサプリメント比較",
    description:
      "科学的根拠に基づくサプリメント比較メタサーチ。あなたに最適なサプリメントを見つけるお手伝いをします。",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = headers().get("x-nonce") || undefined;
  const siteUrl = getSiteUrl();
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "サプティア",
    url: siteUrl,
  };
  const organizationJsonLd = generateOrganizationJsonLd();

  return (
    <html lang="ja">
      <body>
        {/* JSON-LD Structured Data: WebSite */}
        <Script id="website-jsonld" type="application/ld+json" nonce={nonce}>
          {JSON.stringify(websiteJsonLd)}
        </Script>

        {/* JSON-LD Structured Data: Organization */}
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          nonce={nonce}
        >
          {JSON.stringify(organizationJsonLd)}
        </Script>

        {/* Google Analytics 4 */}
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>

        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
