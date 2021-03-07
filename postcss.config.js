const tailwindcss = require("@tailwindcss/postcss7-compat");
const autoprefixer = require("autoprefixer");
// const postcssPresetEnv = require("postcss-preset-env");

module.exports = {
  plugins: [tailwindcss(), autoprefixer()],
};
