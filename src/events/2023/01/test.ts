import {dedent, testPart} from '#lib/testing.js'

await testPart(import('./1.js?url'), [
  dedent`
    1abc2
    pqr3stu8vwx
    a1b2c3d4e5f
    treb7uchet
  `,
  142,
])

await testPart(import('./2.js?url'), [
  dedent`
    two1nine
    eightwothree
    abcone2threexyz
    xtwone3four
    4nineeightseven2
    zoneight234
    7pqrstsixteen
  `,
  281,
])
