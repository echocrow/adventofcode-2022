import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  __TODO__
`

await testPart(import('./1.js?url'), [input, TODO])
// await testPart(import('./2.js?url'), [input, TODO])
