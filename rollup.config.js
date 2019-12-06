import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";
const extensions = [".js", ".jsx", ".ts", ".tsx"];

const name = "svgPathProperties";
const banner = `// ${pkg.homepage} v${
  pkg.version
} Copyright ${new Date().getFullYear()} ${pkg.author.name}`;

export default {
  input: "./src/index.ts",

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en#external-e-external
  external: [],

  plugins: [
    // Allows node_modules resolution
    resolve({ extensions }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),

    // Compile TypeScript/JavaScript files
    babel({ extensions, include: ["src/**/*"] }),
    terser({
      output: {
        preamble: banner
      }
    })
  ],

  output: [
    {
      file: pkg.main,
      format: "cjs"
    },
    {
      file: pkg.module,
      format: "es"
    },
    {
      file: pkg.unpkg,
      format: "umd",
      name,

      // https://rollupjs.org/guide/en#output-globals-g-globals
      globals: {}
    }
  ]
};
