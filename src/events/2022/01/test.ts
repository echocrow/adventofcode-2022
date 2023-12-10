import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  1000
  2000
  3000

  4000

  5000
  6000

  7000
  8000
  9000

  10000
`

await testPart(import('./1.js?url'), [input, 24000])
await testPart(import('./2.js?url'), [input, 45000])
