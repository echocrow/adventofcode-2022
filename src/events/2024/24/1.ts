import io from '#lib/io.js'

// Parse initial values.
const initials: [string, number][] = []
for await (const line of io.readLines()) {
  if (!line) break
  const [name = '', val = ''] = line.split(': ')
  initials.push([name, Number(val)])
}

const gates: Record<string, (a: number, b: number) => number> = {
  AND: (a, b) => a & b,
  OR: (a, b) => a | b,
  XOR: (a, b) => a ^ b,
}
const wires: Record<string, ((name: string, val: number) => void)[]> = {}
function emit(name: string, val: number) {
  const cbs = wires[name] ?? []
  delete wires[name]
  for (const cb of cbs) cb(name, val)
}

let result = 0
function storeZOut(name: string, val: number) {
  result |= val * 2 ** Number(name.slice(1))
}

// Parse gates.
for await (const line of io.readLines()) {
  const [in0 = '', gate = '', in1 = '', _, out = ''] = line.split(' ')
  const fn = gates[gate]!

  let val0 = -1
  let val1 = -1
  function listener(name: string, val: number) {
    if (name === in0) val0 = val
    else if (name === in1) val1 = val
    if (val0 >= 0 && val1 >= 0) emit(out, fn(val0, val1))
  }

  ;(wires[in0] ??= []).push(listener)
  ;(wires[in1] ??= []).push(listener)

  if (out.startsWith('z')) (wires[out] ??= []).push(storeZOut)
}

// Emit initial values.
for (const [name, val] of initials) emit(name, val)

io.write(result)
