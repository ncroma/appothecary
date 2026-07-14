import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "pool.img.aptoide.com" },
            { protocol: "https", hostname: "cdn.aptoide.com" },
            { protocol: "https", hostname: "avatars.githubusercontent.com" }
        ]
    }
};

export default nextConfig;
