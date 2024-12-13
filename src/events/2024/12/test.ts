import {dedent, testPart} from '#lib/testing.js'

const input0 = dedent`
  AAAA
  BBCD
  BBCC
  EEEC
`
const input1 = dedent`
  OOOOO
  OXOXO
  OOOOO
  OXOXO
  OOOOO
`
const input2 = dedent`
  RRRRIICCFF
  RRRRIICCCF
  VVRRRCCFFF
  VVRCCCJFFF
  VVVVCJJCFE
  VVIVCCJJEE
  VVIIICJJEE
  MIIIIIJJEE
  MIIISIJEEE
  MMMISSJEEE
`

await testPart(import('./1.js?url'), [
  [input0, 140],
  [input1, 772],
  [input2, 1930],
])
await testPart(import('./2.js?url'), [
  [input0, 80],
  [input1, 436],
  [
    dedent`
      EEEEE
      EXXXX
      EEEEE
      EXXXX
      EEEEE
    `,
    236,
  ],
  [
    dedent`
      EEEEE
      XXXXE
      EEEEE
      XXXXE
      EEEEE
    `,
    236,
  ],
  [
    dedent`
      EEEEE
      EXEXE
      EXEXE
      EXEXE
      EXEXE
    `,
    236,
  ],
  [
    dedent`
      AAAAAA
      AAABBA
      AAABBA
      ABBAAA
      ABBAAA
      AAAAAA
    `,
    368,
  ],
  [input2, 1206],
  [
    dedent`
      XXX
      XOX
      XXO
    `,
    78,
  ],
])
