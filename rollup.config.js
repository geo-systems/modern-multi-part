// rollup.config.js
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    name: "ModernMultiPart",
    dir: "./dist",
    format: "umd",
  },
  plugins: [typescript()],
};
