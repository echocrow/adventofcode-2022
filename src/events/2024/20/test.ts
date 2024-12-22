import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  ###############
  #...#...#.....#
  #.#.#.#.#.###.#
  #S#...#.#.#...#
  #######.#.#.###
  #######.#.#...#
  #######.#.###.#
  ###..E#...#...#
  ###.#######.###
  #...###...#...#
  #.#####.#.###.#
  #.#...#.#.#...#
  #.#.#.#.#.#.###
  #...#...#...###
  ###############
`

await testPart(import('./1.js?url'), [
  [`__min=100\n${input}`, 0],
  [`__min=64\n${input}`, 1],
  [`__min=20\n${input}`, 5],
  [`__min=8\n${input}`, 14],
  [`__min=2\n${input}`, 44],
])
await testPart(import('./2.js?url'), [
  [`__min=76\n${input}`, 3],
  [`__min=74\n${input}`, 7],
  [`__min=50\n${input}`, 285],
])
