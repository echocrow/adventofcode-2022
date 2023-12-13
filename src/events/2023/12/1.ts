import io from '#lib/io.js'

function setCharAt(str: string, i: number, chr: string) {
  return str.substring(0, i) + chr + str.substring(i + 1)
}

let result = 0
for await (const record of io.readRegExp(/([?#.]+) ([\d,]+)/)) {
  const map = record[1]!.replaceAll(/\.+/g, '.').replaceAll(/^\.|\.$/g, '')
  const counts = record[2]!.split(',').map(Number)
  const re = new RegExp(
    `^[.?]*${counts.map((n) => `[#?]{${n}}`).join('[.?]+')}[.?]*$`,
  )

  let opts = [map]
  let optsOut = [] as string[]
  let i: number | undefined = 0
  while (opts.length && (i = opts[0]!.indexOf('?', i)) >= 0) {
    for (const opt of opts) {
      const a = setCharAt(opt, i, '#')
      const b = setCharAt(opt, i, '.')
      if (re.test(a)) optsOut.push(a)
      if (re.test(b)) optsOut.push(b)
    }
    opts = optsOut
    optsOut = []
  }

  result += opts.length
}

io.write(result)
