import io from '#lib/io.js'

const time = +[...(await io.readLine())!.matchAll(/\d+/g)].join('')
const dist = +[...(await io.readLine())!.matchAll(/\d+/g)].join('')

let minHoldT = 1
while (minHoldT < time && minHoldT * (time - minHoldT) <= dist) minHoldT++

let maxHoldT = time - 1
while (maxHoldT > minHoldT && maxHoldT * (time - maxHoldT) <= dist) maxHoldT--

io.write(maxHoldT - minHoldT + 1)
