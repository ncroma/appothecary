import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [{ protocol: "https", hostname: "pool.img.aptoide.com" }]
    }
};

export default nextConfig;
