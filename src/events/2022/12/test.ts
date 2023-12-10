import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  Sabqponm
  abcryxxl
  accszExk
  acctuvwj
  abdefghi
`

await testPart(import('./1.js?url'), [input, 31])
await testPart(import('./2.js?url'), [input, 29])
