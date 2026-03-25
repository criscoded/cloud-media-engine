import { withSentryConfig } from "@sentry/nextjs";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const coreConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

const config = withSentryConfig(coreConfig, {
  org: "criscoded",
  project: "cloud-media-engine",

  // Only print logs for uploading source maps in CI
  silent: true,

  // Upload a larger set of source maps for prettier stack traces
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite
  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements
  disableLogger: true,

  // Enable automatic instrumentation of Vercel Cron Monitors
  automaticVercelMonitors: true,

  // Hides source maps from the browser while still uploading them to Sentry
  hideSourceMaps: true,
});

export default config;
