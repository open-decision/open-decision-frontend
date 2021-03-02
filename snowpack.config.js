/** @type {import("snowpack").SnowpackUserConfig } */

module.exports = {
  mount: { public: { url: "/", static: true }, src: { url: "/dist" } },
  extends: "@snowpack/app-scripts-react",
  plugins: [
    "@snowpack/plugin-webpack",
    // "@snowpack/plugin-babel",
    "@snowpack/plugin-postcss",
    // "@snowpack/plugin-typescript",
    // "@snowpack/plugin-react-refresh",
  ],
  devOptions: { open: "none", port: 3000 },
  install: ["@emotion/react", "@emotion/styled", "twin.macro"],
  alias: {
    "@internalTypes": "./src/types",
    "@components": "./src/components",
    "@features": "./src/features",
    "@utils": "./src/utils",
  },
};
