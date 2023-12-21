import {dedent, testPart} from '#lib/testing.js'

const input0 = dedent`
  broadcaster -> a, b, c
  %a -> b
  %b -> c
  %c -> inv
  &inv -> a
`
const input1 = dedent`
  broadcaster -> a
  %a -> inv, con
  &inv -> b
  %b -> con
  &con -> output
`

await testPart(import('./1.js?url'), [
  [input0, 32000000],
  [input1, 11687500],
])

await testPart(import('./2.js?url'), [
  [
    dedent`
      broadcaster -> a0, b0, c0, d0
      %a0 -> a1
      &a1 -> a2
      %a2 -> a3
      &a3 -> zz
      &zz -> rx
    `,
    3,
  ],
  [
    dedent`
      broadcaster -> a0, b0, c0, d0
      %a0 -> a1, a3
      %a1 -> a2, a3
      &a3 -> a4
      %a4 -> a5
      %a5 -> zz
      &zz -> rx
    `,
    7,
  ],
  [
    dedent`
      broadcaster -> a0, b0, c0, d0
      %a0 -> a1
      &a1 -> a2
      %a2 -> a3
      &a3 -> zz
      %b0 -> b1
      %b1 -> b2
      %b2 -> b3
      %b3 -> zz
      %c0 -> c1, c3
      %c1 -> c2, c3
      &c3 -> c4
      %c4 -> c5
      %c5 -> zz
      &zz -> rx
    `,
    168,
  ],
])
