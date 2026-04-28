import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the live preview tunnel to hit dev-server resources (HMR, RSC
  // payloads) so the Devin tunnel domain isn't blocked by Next 16's default
  // cross-origin guard. The list is dev-only; production builds ignore it.
  allowedDevOrigins: ["*.devinapps.com"],
};

export default nextConfig;
