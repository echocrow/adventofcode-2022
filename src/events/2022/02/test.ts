import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  A Y
  B X
  C Z
`

await testPart(import('./1.js?url'), [input, 15])
await testPart(import('./2.js?url'), [input, 12])
