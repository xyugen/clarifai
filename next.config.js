/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import { env } from "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  compress: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-avatar", "@radix-ui/react-checkbox", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-label", "@radix-ui/react-progress", "@radix-ui/react-select", "@radix-ui/react-separator", "@radix-ui/react-slot", "@radix-ui/react-visually-hidden"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: `${env.UPLOADTHING_APPID}.ufs.sh`,
        pathname: "/f/*",
      },
    ],
  },
};

export default config;
