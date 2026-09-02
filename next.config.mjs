import { getPublicEnvironment } from "./config/publicEnvironment.mjs";

const nextConfig = {
  env: getPublicEnvironment(),
  reactStrictMode: true,
  webpack(config) {
    const assetRule = config.module.rules.find((rule) =>
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
