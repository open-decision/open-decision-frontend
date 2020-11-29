import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import resolve from "rollup-plugin-node-resolve";
import url from "rollup-plugin-url";
import svgr from "@svgr/rollup";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

export default {
  preserveModules: true,
  input: "src/index.tsx",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true,
    },
  ],
  external: ["react", "react-dom"],
  plugins: [
    external(),
    url(),
    svgr(),
    typescript({ typescript: require("typescript") }),
    postcss({
      extract: true,
      sourceMap: true,
      minimize: true,
      plugins: [
        require("postcss-preset-env")({
          stage: 3,
          features: {
            "nesting-rules": true,
          },
        }),
      ],
      use: ["scss"],
    }),
    resolve(),
    commonjs(),
  ],
};
