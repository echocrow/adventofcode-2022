import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  1163751742
  1381373672
  2136511328
  3694931569
  7463417111
  1319128137
  1359912421
  3125421639
  1293138521
  2311944581
`

await testPart(import('./1.js?url'), [input, 40])
await testPart(import('./2.js?url'), [input, 315])
