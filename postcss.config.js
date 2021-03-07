const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
// const postcssPresetEnv = require("postcss-preset-env");

module.exports = {
  plugins: [tailwindcss(), autoprefixer()],
};
