import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  16,1,2,0,4,2,7,1,2,14
`

await testPart(import('./1.js?url'), [input, 37])
await testPart(import('./2.js?url'), [input, 168])
