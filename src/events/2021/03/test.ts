import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  00100
  11110
  10110
  10111
  10101
  01111
  00111
  11100
  10000
  11001
  00010
  01010
`

await testPart(import('./1.js?url'), [input, 198])
await testPart(import('./2.js?url'), [input, 230])
