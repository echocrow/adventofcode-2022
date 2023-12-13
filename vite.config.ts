import {join, relative} from 'node:path'
import {defineConfig, normalizePath, type ResolvedConfig} from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

let viteCfg: ResolvedConfig

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    {
      name: 'vite-plugin-current-config',
      configResolved: (config) => void (viteCfg = config),
    },
    {
      name: 'vite-plugin-aoc-watch-io-in',
      transform(_, id) {
        if (viteCfg.mode === 'test') return
        if (normalizePath(relative(__dirname, id)) === 'src/lib/io.ts')
          this.addWatchFile(join(__dirname, 'io/in.txt'))
      },
    },
  ],
  esbuild: {target: 'es2022'},
  test: {
    include: ['src/events/*/*/test.ts'],
  },
})
