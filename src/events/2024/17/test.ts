import {dedent, testPart} from '#lib/testing.js'

await testPart(import('./1.js?url'), [
  [
    dedent`
      Register A: 10
      Register B: 0
      Register C: 0

      Program: 5,0,5,1,5,4
    `,
    '0,1,2',
  ],
  [
    dedent`
      Register A: 2024
      Register B: 0
      Register C: 0

      Program: 0,1,5,4,3,0
    `,
    '4,2,5,6,7,7,7,7,3,1,0',
  ],
  [
    dedent`
    Register A: 729
    Register B: 0
    Register C: 0

    Program: 0,1,5,4,3,0
  `,
    '4,6,3,5,6,3,5,2,1,0',
  ],
])
await testPart(import('./2.js?url'), [
  dedent`
    Register A: 2024
    Register B: 0
    Register C: 0

    Program: 0,3,5,4,3,0
  `,
  117440,
])
