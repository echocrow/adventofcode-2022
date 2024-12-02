import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  7 6 4 2 1
  1 2 7 8 9
  9 7 6 2 1
  1 3 2 4 5
  8 6 4 4 1
  1 3 6 7 9
`

await testPart(import('./1.js?url'), [input, 2])
await testPart(import('./2.js?url'), [input, 4])
