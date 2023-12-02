import io from 'lib/io.js'

let result = 0
const UNIQUE_LENS = new Set([2, 3, 4, 7])
for await (const line of io.readLines()) {
  const [_, outStr = ''] = line.split(' | ', 2)
  const outs = outStr.split(' ')
  result += outs.filter((s) => UNIQUE_LENS.has(s.length)).length
}

io.write(result)
