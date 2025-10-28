/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
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
};

module.exports = nextConfig;
