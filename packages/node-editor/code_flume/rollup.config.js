import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import resolve from "rollup-plugin-node-resolve";
import url from "rollup-plugin-url";
import svgr from "@svgr/rollup";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

export default {
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
    typescript(),
    postcss({
      modules: true,
      plugins: [
        require("postcss-preset-env")({
          stage: 3,
          features: {
            "nesting-rules": true,
          },
        }),
      ],
    }),
    resolve(),
    commonjs(),
  ],
};
