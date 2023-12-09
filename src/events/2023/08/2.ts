import io from 'lib/io.js'
import {lcm} from 'lib/math.js'

const dirs = (await io.readLine())!.split('').map((d) => (d === 'R' ? 1 : 0))

const map = new Map<string, [string, string]>()
for await (const match of io.readRegExp(/(\w+) = \((\w+), (\w+)\)/)) {
  const [_, from = '', to0 = '', to1 = ''] = match
  map.set(from, [to0, to1])
}

const poss = [...map.keys()].filter((p) => p.at(-1) === 'A')
const minSteps = poss.map((pos) => {
  let steps = 0
  while (pos.at(-1) !== 'Z') {
    const dir = dirs[steps % dirs.length]!
    pos = map.get(pos)![dir]
    steps++
  }
  return steps
})

io.write(minSteps.reduce(lcm))
