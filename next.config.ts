import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  serverExternalPackages: ["@xmldom/xmldom"],
  turbopack: {
    // Keep Turbopack enabled
  },
}

export default nextConfig
