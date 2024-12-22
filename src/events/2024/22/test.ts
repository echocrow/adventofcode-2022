import {dedent, testPart} from '#lib/testing.js'

await testPart(import('./1.js?url'), [
  dedent`
    1
    10
    100
    2024
  `,
  37327623,
])
await testPart(import('./2.js?url'), [
  dedent`
    1
    2
    3
    2024
  `,
  23,
])
