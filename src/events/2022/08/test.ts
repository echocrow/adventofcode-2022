import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  30373
  25512
  65332
  33549
  35390
`

await testPart(import('./1.js?url'), [input, 21])
await testPart(import('./2.js?url'), [input, 8])
