import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  Time:      7  15   30
  Distance:  9  40  200
`

await testPart(import('./1.js?url'), [input, 288])
await testPart(import('./2.js?url'), [input, 71503])
