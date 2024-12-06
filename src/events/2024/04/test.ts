import {dedent, testPart} from '#lib/testing.js'

const input = dedent`
  MMMSXXMASM
  MSAMXMSMSA
  AMXSXMAAMM
  MSAMASMSMX
  XMASAMXAMM
  XXAMMXXAMA
  SMSMSASXSS
  SAXAMASAAA
  MAMMMXMMMM
  MXMXAXMASX
`

await testPart(import('./1.js?url'), [
  [
    dedent`
      ..X...
      .SAMX.
      .A..A.
      XMAS.S
      .X....
    `,
    4,
  ],
  [input, 18],
])
await testPart(import('./2.js?url'), [
  [
    dedent`
      M.S
      .A.
      M.S
    `,
    1,
  ],
  [input, 9],
])
