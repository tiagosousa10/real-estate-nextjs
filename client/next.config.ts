import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      { source: "/api/:path*", destination: "http://localhost:3002/:path*" },
    ];
  },
};

export default nextConfig;
