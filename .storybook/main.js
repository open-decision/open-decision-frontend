const path = require("path");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      components: path.resolve(__dirname, "../src/components"),
      internalTypes: path.resolve(__dirname, "../src/types"),
      features: path.resolve(__dirname, "../src/features"),
      utils: path.resolve(__dirname, "../src/utils"),
    };

    config.module.rules.push({
      test: /\.css$/,
      use: [
        {
          loader: "postcss-loader",
          options: {
            ident: "postcss",
            plugins: [
              require("@tailwindcss/postcss7-compat"),
              require("autoprefixer"),
            ],
          },
        },
      ],
      include: path.resolve(__dirname, "../"),
    });

    return config;
  },
};
