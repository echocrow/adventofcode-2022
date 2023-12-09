import io from 'lib/io.js'

const dirs = (await io.readLine())!.split('').map((d) => (d === 'R' ? 1 : 0))

const map = new Map<string, [string, string]>()
for await (const match of io.readRegExp(/(\w+) = \((\w+), (\w+)\)/)) {
  const [_, from = '', to0 = '', to1 = ''] = match
  map.set(from, [to0, to1])
}

const target = 'ZZZ'

let pos = 'AAA'
let steps = 0
while (pos !== target) {
  const dir = dirs[steps % dirs.length]!
  pos = map.get(pos)![dir]
  steps++
}

io.write(steps)
