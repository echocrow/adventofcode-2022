import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
          ...#
          .#..
          #...
          ....
  ...#.......#
  ........#...
  ..#....#....
  ..........#.
          ...#....
          .....#..
          .#......
          ......#.

  10R5L5R10L4R5L5
`

await testPart(import('./1.js?url'), [input, 6032])
await testPart(import('./2.js?url'), [input, 5031])
