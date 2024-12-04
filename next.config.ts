import "@/env";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        // pathname: "/a/<APP_ID>/*", // Replace <APP_ID> with your app ID
      },
    ],
  },
};

export default nextConfig;
