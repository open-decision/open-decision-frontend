/** @type {import("snowpack").SnowpackUserConfig } */

module.exports = {
  mount: { public: { url: "/", static: true }, src: { url: "/dist" } },
  plugins: [
    "@snowpack/plugin-postcss",
    "@snowpack/plugin-typescript",
    "@snowpack/plugin-webpack",
    "@snowpack/plugin-react-refresh",
  ],
  devOptions: { open: "none", port: 3000 },
  alias: {
    "@internalTypes": "./src/types",
    "@components": "./src/components",
    "@features": "./src/features",
    "@utils": "./src/utils",
  },
};
