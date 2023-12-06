import io from 'lib/io.js'

let acc = 0

for await (const line of io.readLines()) {
  const firstDigit = Number(/\d/.exec(line)?.[0])
  const lastDigit = Number(/\d\D*$/.exec(line)?.[0].at(0))
  acc += firstDigit * 10 + lastDigit
}

io.write(acc)
