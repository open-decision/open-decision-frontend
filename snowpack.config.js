/** @type {import("snowpack").SnowpackUserConfig } */

module.exports = {
  mount: { public: { url: "/", static: true }, src: { url: "/dist" } },
  plugins: [
    "@snowpack/plugin-react-refresh",
    "@snowpack/plugin-typescript",
    "@canarise/snowpack-eslint-plugin",
    [
      "@snowpack/plugin-run-script",
      {
        cmd: "postcss src/index.css -o src/compiled.css",
        watch: "postcss src/index.css -o src/compiled.css -w",
      },
    ],
  ],
  optimize: {
    bundle: true,
    minify: true,
    target: "es2018",
  },
  devOptions: { open: "none", port: 3000 },
  alias: {
    internalTypes: "./src/types",
    components: "./src/components",
    features: "./src/features",
    utils: "./src/utils",
  },
};
