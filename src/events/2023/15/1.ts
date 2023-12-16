import io from '#lib/io.js'

let result = 0
for (const part of ((await io.readLine()) ?? '').split(',')) {
  let curr = 0
  for (let i = 0; i < part.length; i++)
    curr = ((curr + part.charCodeAt(i)) * 17) % 256
  result += curr
}

io.write(result)
