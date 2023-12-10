import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  2-4,6-8
  2-3,4-5
  5-7,7-9
  2-8,3-7
  6-6,4-6
  2-6,4-8
`

await testPart(import('./1.js?url'), [input, 2])
await testPart(import('./2.js?url'), [input, 4])
