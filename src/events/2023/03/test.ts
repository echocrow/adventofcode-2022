import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  467..114..
  ...*......
  ..35..633.
  ......#...
  617*......
  .....+.58.
  ..592.....
  ......755.
  ...$.*....
  .664.598..
`

await testPart(import('./1.js?url'), [input, 4361])
await testPart(import('./2.js?url'), [input, 467835])
