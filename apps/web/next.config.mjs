/** @type {import('next').NextConfig} */

// CSP helper (development only). Production CSP is set via middleware with per-request nonce
function buildDevCSP() {
  const policies = [
    "default-src 'self'",
    "img-src 'self' https://cdn.sanity.io https://thumbnail.image.rakuten.co.jp https://tshop.r10s.jp https://item-shopping.c.yimg.jp https://shopping.c.yimg.jp data:",
    "connect-src 'self' https://*.sanity.io",
    "style-src 'self' 'unsafe-inline'", // Tailwind requires unsafe-inline
    "font-src 'self' data:",
    "script-src 'self' 'unsafe-eval'", // Next.js dev needs unsafe-eval
    "upgrade-insecure-requests",
  ];

  return policies.join("; ");
}

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "thumbnail.image.rakuten.co.jp",
      },
      {
        protocol: "https",
        hostname: "tshop.r10s.jp",
      },
      {
        protocol: "https",
        hostname: "item-shopping.c.yimg.jp",
      },
      {
        protocol: "https",
        hostname: "shopping.c.yimg.jp",
      },
    ],
  },
  async headers() {
    const isDev = process.env.NODE_ENV === "development";

    return [
      {
        source: "/(.*)",
        headers: [
          // In development, provide a permissive CSP to support Next dev features
          ...(isDev
            ? [
                {
                  key: "Content-Security-Policy",
                  value: buildDevCSP(),
                },
              ]
            : []),
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // HSTS in production only
          ...(!isDev
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
