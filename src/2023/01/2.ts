import IO from 'lib/io.js'
import range from 'lib/range.js'

const io = new IO()

let acc = 0

const digits = {
  ...Object.fromEntries([...range(1, 10)].map((i) => [i, i])),
  ...Object.fromEntries(
    [
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
    ].map((str, i) => [str, i + 1]),
  ),
}
const digitsRePattern = Object.keys(digits).join('|')
const firstDigitRe = new RegExp(digitsRePattern)
const lastDigitsRe = new RegExp(`.*(${digitsRePattern})`)

for await (const line of io.readLines()) {
  const firstDigit = digits[firstDigitRe.exec(line)?.[0] ?? ''] ?? 0
  const lastDigit = digits[lastDigitsRe.exec(line)?.[1] ?? ''] ?? 0
  acc += firstDigit * 10 + lastDigit
}

io.write(acc)
