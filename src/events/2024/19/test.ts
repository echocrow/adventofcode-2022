import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  r, wr, b, g, bwu, rb, gb, br

  brwrr
  bggr
  gbbr
  rrbgbr
  ubwu
  bwurrg
  brgr
  bbrgwb
`

await testPart(import('./1.js?url'), [input, 6])
await testPart(import('./2.js?url'), [input, 16])
