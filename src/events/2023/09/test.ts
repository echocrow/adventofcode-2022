import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  0 3 6 9 12 15
  1 3 6 10 15 21
  10 13 16 21 30 45
`

await testPart(import('./1.js?url'), [input, 114])
await testPart(import('./2.js?url'), [input, 2])
