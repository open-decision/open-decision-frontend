const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const postcssPresetEnv = require("postcss-preset-env");

module.exports = {
  plugins: [
    tailwindcss(),
    postcssPresetEnv({
      stage: 3,
      features: {
        "nesting-rules": true,
      },
    }),
    autoprefixer(),
  ],
};
