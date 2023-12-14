import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  199
  200
  208
  210
  200
  207
  240
  269
  260
  263
`

await testPart(import('./1.js?url'), [input, 7])
await testPart(import('./2.js?url'), [input, 5])
