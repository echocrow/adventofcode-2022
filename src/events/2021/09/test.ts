import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  2199943210
  3987894921
  9856789892
  8767896789
  9899965678
`

await testPart(import('./1.js?url'), [input, 15])
await testPart(import('./2.js?url'), [input, 1134])
