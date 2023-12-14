import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  3,4,3,1,2
`

await testPart(import('./1.js?url'), [input, 5934])
await testPart(import('./2.js?url'), [input, 26984457539])
