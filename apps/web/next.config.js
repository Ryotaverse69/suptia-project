/** @type {import('next').NextConfig} */
const nextConfig = {
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
