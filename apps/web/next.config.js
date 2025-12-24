/** @type {import('next').NextConfig} */
const nextConfig = {
  // 画像最適化設定
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thumbnail.image.rakuten.co.jp",
      },
      {
        protocol: "https",
        hostname: "image.rakuten.co.jp",
      },
      {
        protocol: "https",
        hostname: "shopping.c.yimg.jp",
      },
      {
        protocol: "https",
        hostname: "item-shopping.c.yimg.jp",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "rktzytsqxmoahrzxdlgn.supabase.co",
      },
    ],
    // 画像フォーマット最適化
    formats: ["image/avif", "image/webp"],
    // 画像キャッシュ設定（1年間）
    minimumCacheTTL: 31536000,
    // デバイスサイズの最適化
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // パフォーマンス最適化
  compress: true, // Gzip圧縮を有効化
  poweredByHeader: false, // X-Powered-Byヘッダーを削除（セキュリティ向上）
  reactStrictMode: true, // React Strict Mode有効化

  // トレーリングスラッシュの統一（SEO向上）
  trailingSlash: false,

  // www → non-www リダイレクト（SEO向上）
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.suptia.com",
          },
        ],
        destination: "https://suptia.com/:path*",
        permanent: true, // 301 redirect
      },
    ];
  },

  // パフォーマンスヘッダー設定
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      {
        // 静的ファイルのキャッシュ設定
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
