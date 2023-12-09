import {dedent, testDay} from '#lib/testing.js'

testDay(__dirname, [
  {
    part: 1,
    input: dedent`
      1abc2
      pqr3stu8vwx
      a1b2c3d4e5f
      treb7uchet
    `,
    expect: 142,
  },
  {
    part: 2,
    input: dedent`
      two1nine
      eightwothree
      abcone2threexyz
      xtwone3four
      4nineeightseven2
      zoneight234
      7pqrstsixteen
    `,
    expect: 281,
  },
])
