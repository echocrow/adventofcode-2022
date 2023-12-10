import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  498,4 -> 498,6 -> 496,6
  503,4 -> 502,4 -> 502,9 -> 494,9
`

await testPart(import('./1.js?url'), [input, 24])
await testPart(import('./2.js?url'), [input, 93])
