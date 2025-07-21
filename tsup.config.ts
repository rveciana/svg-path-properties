import { defineConfig } from 'tsup'
import pkg from './package.json'

const banner = `// ${pkg.homepage} v${
  pkg.version
} Copyright ${new Date().getFullYear()} ${pkg.author.name}`

export default defineConfig([
  {
    entryPoints: ['src/main.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    minify: false,
    outDir: 'dist/',
    clean: true,
    sourcemap: false,
    bundle: true,
    splitting: false,
    outExtension (ctx) {
      return {
        dts: '.d.ts',
        js: ctx.format === 'cjs' ? '.cjs' : '.mjs'
      }
    },
    treeshake: false,
    target: 'es2022',
    platform: 'node',
    tsconfig: './tsconfig.json',
    cjsInterop: true,
    keepNames: true,
    skipNodeModulesBundle: false,
    terserOptions: {
      output: {
        preamble: banner
      }
    }
  },
])
