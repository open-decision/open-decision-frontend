/** @type {import("snowpack").SnowpackUserConfig } */

module.exports = {
  mount: { public: "/", src: "/_dist_" },
  plugins: [
    "@snowpack/plugin-postcss",
    "@snowpack/plugin-typescript",
    "@snowpack/plugin-webpack",
  ],
  install: [],
  installOptions: {},
  devOptions: { open: "none", port: 3000 },
  buildOptions: {},
  proxy: {},
  alias: {
    "@internalTypes": "./src/types",
    "@components": "./src/components",
    "@features": "./src/features",
    "@utils": "./src/utils",
  },
};
