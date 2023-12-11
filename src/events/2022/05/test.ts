import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
      [D]
  [N] [C]
  [Z] [M] [P]
   1   2   3

  move 1 from 2 to 1
  move 3 from 1 to 3
  move 2 from 2 to 1
  move 1 from 1 to 2
`

await testPart(import('./1.js?url'), [input, 'CMZ'])
await testPart(import('./2.js?url'), [input, 'MCD'])
