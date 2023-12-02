import io from 'lib/io.js'

const snafuDigits: string[] = ['=', '-', '0', '1', '2']

const snafuPower = snafuDigits.length
const snafuValOffset = Math.floor(snafuPower / 2)
const snafuVals = Object.fromEntries(
  [...snafuDigits.entries()].map(([p, d]) => [d, p - snafuValOffset]),
)

function snafuToDec(snafu: string): number {
  let num = 0
  for (const [p, s] of snafu.split('').reverse().entries()) {
    const n = snafuVals[s]!
    num += n * snafuPower ** p
  }
  return num
}

function decToSnafu(num: number): string {
  let snafu = ''
  while (num) {
    const least = (num + 2) % snafuPower
    const snafuDig = snafuDigits[least]!
    const snafuVal = snafuVals[snafuDig]!
    snafu = snafuDig + snafu
    num -= snafuVal
    num /= snafuPower
  }
  return snafu || '0'
}

let sum = 0
for await (const line of io.readLines()) {
  sum += snafuToDec(line)
}

const snafuSum = decToSnafu(sum)

io.write(snafuSum)
