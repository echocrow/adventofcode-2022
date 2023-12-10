import {dedent, testPart} from '#lib/testing.js'

const input1 = dedent`
  #.#####
  #.....#
  #>....#
  #.....#
  #...v.#
  #.....#
  #####.#
`
const input2 = dedent`
  #.######
  #>>.<^<#
  #.<..<<#
  #>v.><>#
  #<^v^^>#
  ######.#
`

await testPart(import('./1.js?url'), [
  [input1, 10],
  [input2, 18],
])

await testPart(import('./2.js?url'), [
  [input1, 30],
  [input2, 54],
])
