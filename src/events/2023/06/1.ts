import io from 'lib/io.js'

const times = [...(await io.readLine())!.matchAll(/\d+/g)].map(Number)
const dists = [...(await io.readLine())!.matchAll(/\d+/g)].map(Number)

let result = 1
for (const [time, dist] of times.map((t, i) => [t, dists[i]!] as const)) {
  let opts = 0
  for (let holdT = 1; holdT < time; holdT++)
    if (holdT * (time - holdT) > dist) opts++
  result *= opts
}

io.write(result)
