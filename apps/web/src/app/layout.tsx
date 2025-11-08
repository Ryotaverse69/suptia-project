// Validate environment variables at startup
import "@/env";
import { headers } from "next/headers";
import Script from "next/script";
import { getSiteUrl } from "@/lib/runtimeConfig";
import { generateOrganizationJsonLd } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Footer } from "@/components/footer";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { CookieSettingsModal } from "@/components/CookieSettingsModal";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://suptia.com"),
  title: {
    default: "サプティア | サプリメント最安値・コスパ・成分の比較",
    template: "%s | サプティア",
  },
  description:
    "科学的根拠に基づくサプリメント比較メタサーチ。あなたに最適なサプリメントを見つけるお手伝いをします。",
  verification: {
    google: process.env.GOOGLE_SEARCH_CONSOLE_VERIFICATION,
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-64x64.png", sizes: "64x64", type: "image/png" },
    ],
    apple: "/apple-touch-icon-180x180.png",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://suptia.com",
    siteName: "サプティア",
    title: "サプティア | サプリメント最安値・コスパ・成分の比較",
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
    title: "サプティア | サプリメント最安値・コスパ・成分の比較",
    description:
      "科学的根拠に基づくサプリメント比較メタサーチ。あなたに最適なサプリメントを見つけるお手伝いをします。",
    images: ["/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || undefined;
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

        <CookieConsentProvider>
          <FavoritesProvider>
            {/* Google Analytics 4 - Cookie同意が得られた場合のみ実行 */}
            <GoogleAnalytics />

            <Header />
            {children}
            <Footer />

            {/* Cookie同意バナー */}
            <CookieConsentBanner />

            {/* Cookie設定モーダル */}
            <CookieSettingsModal />
          </FavoritesProvider>
        </CookieConsentProvider>
      </body>
    </html>
  );
}
