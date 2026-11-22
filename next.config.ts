import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  // pdf.js loads its worker file at runtime: keep it out of the server bundle
  serverExternalPackages: ["pdfjs-dist"],
  partialPrefetching: true,
  images: {
    // product photos (Product.imgUrl) uploaded to Supabase Storage
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;