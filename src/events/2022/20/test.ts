import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  1
  2
  -3
  3
  -2
  0
  4
`

await testPart(import('./1.js?url'), [input, 3])
await testPart(import('./2.js?url'), [input, 1623178306])
