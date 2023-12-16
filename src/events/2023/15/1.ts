import io from '#lib/io.js'

let result = 0
for await (const [part] of io.readRegExp(/[^,]+/)) {
  let curr = 0
  for (let i = 0; i < part.length; i++)
    curr = ((curr + part.charCodeAt(i)) * 17) % 256
  result += curr
}

io.write(result)
