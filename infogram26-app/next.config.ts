import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Compress responses
  compress: true,

  // Performance headers for mobile
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent layout thrash
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Allow smooth scroll
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      {
        source: "/((?!_next/static|_next/image|favicon.ico).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
    ];
  },

  // Reduce bundle size
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "firebase",
    ],
  },
};

export default nextConfig;
