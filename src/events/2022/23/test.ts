import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  ....#..
  ..###.#
  #...#.#
  .#...##
  #.###..
  ##.#.##
  .#..#..
`

await testPart(import('./1.js?url'), [
  [
    dedent`
      .....
      ..##.
      ..#..
      .....
      ..##.
      .....
    `,
    25,
  ],
  [input, 110],
])

await testPart(import('./2.js?url'), [input, 20])
