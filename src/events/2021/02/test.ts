import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  forward 5
  down 5
  forward 8
  up 3
  down 8
  forward 2
`

await testPart(import('./1.js?url'), [input, 150])
await testPart(import('./2.js?url'), [input, 900])
