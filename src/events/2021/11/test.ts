import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  5483143223
  2745854711
  5264556173
  6141336146
  6357385478
  4167524645
  2176841721
  6882881134
  4846848554
  5283751526
`

await testPart(import('./1.js?url'), [input, 1656])
await testPart(import('./2.js?url'), [input, 195])
