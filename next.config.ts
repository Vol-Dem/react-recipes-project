import type { NextConfig } from "next";
import { getPublicEnvironment } from "./config/publicEnvironment";

const nextConfig: NextConfig = {
  env: getPublicEnvironment(),
  reactStrictMode: true,
  images: {
    remotePatterns: [
      new URL("https://img.spoonacular.com/recipes/**"),
      new URL("https://spoonacular.com/recipeImages/**"),
    ],
  },
  webpack(config) {
    const assetRule = config.module.rules.find((rule: { test?: RegExp }) =>
      rule.test?.test?.("icon.svg"),
    );

    if (assetRule) {
      config.module.rules.push({
        test: /\.svg$/i,
        issuer: assetRule.issuer,
        resourceQuery: /react/,
        use: ["@svgr/webpack"],
      });
      assetRule.exclude = /\.svg$/i;
    }

    return config;
  },
};

export default nextConfig;
