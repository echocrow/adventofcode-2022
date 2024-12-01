import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  3   4
  4   3
  2   5
  1   3
  3   9
  3   3
`

await testPart(import('./1.js?url'), [input, 11])
await testPart(import('./2.js?url'), [input, 31])
