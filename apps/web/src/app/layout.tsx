// Validate environment variables at startup
import "@/env";
import { headers } from "next/headers";
import Script from "next/script";
import { getSiteUrl } from "@/lib/runtimeConfig";
import { Header } from "@/components/Header";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://suptia.com"),
  title: {
    default: "Suptia - サプティア | 科学的根拠に基づくサプリメント比較",
    template: "%s | Suptia - サプティア",
  },
  description:
    "科学的根拠に基づくサプリメント比較メタサーチ。あなたに最適なサプリメントを見つけるお手伝いをします。",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://suptia.com",
    siteName: "Suptia - サプティア",
    title: "Suptia - サプティア | 科学的根拠に基づくサプリメント比較",
    description:
      "科学的根拠に基づくサプリメント比較メタサーチ。あなたに最適なサプリメントを見つけるお手伝いをします。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Suptia - サプティア",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Suptia - サプティア | 科学的根拠に基づくサプリメント比較",
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
  return (
    <html lang="ja">
      <body>
        {/* Global JSON-LD (example) rendered with CSP nonce */}
        <Script id="website-jsonld" type="application/ld+json" nonce={nonce}>
          {JSON.stringify(websiteJsonLd)}
        </Script>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
