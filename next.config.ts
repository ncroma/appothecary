import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "pool.img.aptoide.com" },
            { protocol: "https", hostname: "cdn.aptoide.com" }
        ]
    }
};

export default nextConfig;
