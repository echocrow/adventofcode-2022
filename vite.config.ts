import {join, relative} from 'node:path'
import {defineConfig, normalizePath, type ResolvedConfig} from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    (() => {
      let viteCfg: ResolvedConfig
      return {
        name: 'vite-plugin-aoc-watch-io-in',
        configResolved: (config) => void (viteCfg = config),
        transform(_, id) {
          if (viteCfg.mode === 'test') return
          if (normalizePath(relative(__dirname, id)) === 'src/lib/io.ts')
            this.addWatchFile(join(__dirname, 'io/in.txt'))
        },
      }
    })(),
  ],
  esbuild: {target: 'es2022'},
  test: {
    include: ['src/events/*/*/test.ts', 'src/lib/**/*.spec.ts'],
  },
})
