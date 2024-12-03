import io from '#lib/io.js'

let result = 0
for await (const [, a, b] of io.readRegExp(/mul\((\d+),(\d+)\)/))
  result += Number(a) * Number(b)

io.write(result)
