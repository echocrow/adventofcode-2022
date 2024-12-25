import io from '#lib/io.js'

// Skip initial values.
for await (const line of io.readLines()) if (!line) break

type Wire = {in0: string; in1: string; gate: string; out: string}

// Parse wires.
const wires: Wire[] = []
for await (const line of io.readLines()) {
  let [in0 = '', gate = '', in1 = '', _, out = ''] = line.split(' ')
  if (in1 < in0) [in0, in1] = [in1, in0]
  wires.push({in0, in1, gate, out})
}
wires.sort(
  (a, b) =>
    a.in0.localeCompare(b.in0) ||
    a.in1.localeCompare(b.in1) ||
    a.gate.localeCompare(b.gate) ||
    a.out.localeCompare(b.out),
)

let inBitLen = 0
const wiresByIn: Record<string, Wire[]> = {}
for (const w of wires) {
  ;(wiresByIn[w.in0] ??= []).push(w)
  ;(wiresByIn[w.in1] ??= []).push(w)
  if (w.in0.startsWith('x') && w.gate === 'AND') inBitLen++
}

function fmtZOut(id: number) {
  return `z${id.toString().padStart(2, '0')}`
}

const LAST_IN_ID = inBitLen - 1
const LAST_OUT = fmtZOut(inBitLen)

const badWires: Wire[] = []

// Note: For today's challenge, the blow is good enough. However, this does not
// detect certain sneaky input swaps, e.g. if the output of two sibling OR gates
// are swapped with each other.
function checkWire(wire: Wire, inId = Number(wire.in0.slice(1)), depth = 0) {
  const {gate, out} = wire
  const outs = wiresByIn[out] ?? []

  // Check input wire.
  if (!depth) {
    const wantOutsLen =
      !inId && gate === 'AND' ? 2
      : !inId && gate === 'XOR' ? 0
      : gate === 'AND' ? 1
      : gate === 'XOR' ? 2
      : -1
    if (outs.length !== wantOutsLen) return badWires.push(wire)
    if (!inId && gate === 'XOR' && out !== fmtZOut(inId))
      return badWires.push(wire)
    for (const outW of outs) checkWire(outW, inId, depth + 1)
    return
  }

  // Check nested `AND` wire.
  if (gate === 'AND') {
    if (outs.length !== 1) return badWires.push(wire)
    return
  }

  // Check nested `XOR` wire.
  if (gate === 'XOR') {
    if (out !== fmtZOut(inId || 1)) return badWires.push(wire)
    return
  }

  // Check nested `OR` wire.
  if (gate === 'OR') {
    const wantOutsLen = inId === LAST_IN_ID ? 0 : 2
    if (outs.length !== wantOutsLen) return badWires.push(wire)
    if (inId === LAST_IN_ID && out !== LAST_OUT) return badWires.push(wire)
    return
  }

  throw new Error(`unexpected wire at depth ${depth}: ${wire}`)
}

for (const w of wires) if (w.in0.startsWith('x')) checkWire(w)

const result = badWires
  .map((w) => w.out)
  .sort()
  .join(',')
io.write(result)
