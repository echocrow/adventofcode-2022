import {join, relative} from 'node:path'
import {defineConfig, normalizePath} from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    {
      name: 'vite-aoc-watch-io-in',
      transform(_, id) {
        if (normalizePath(relative(__dirname, id)) === 'src/lib/io.ts')
          this.addWatchFile(join(__dirname, 'io/in.txt'))
      },
    },
  ],
  test: {
    include: ['src/events/*/*/test.ts'],
  },
})
