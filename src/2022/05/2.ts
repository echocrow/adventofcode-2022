import IO from 'lib/io.js'

const io = new IO()

type Label = string

type Instruction = [count: number, from: Label, to: Label]

function extractCols(line: string): string[] {
  const len = Math.ceil(line.length / 4)
  const cols: string[] = []
  while (cols.length < len) {
    const c = 1 + cols.length * 4
    cols.push((line[c] ?? '').trim())
  }
  return cols
}

const stacks: Map<Label, string[]> = new Map()
const instructions: Instruction[] = []
const pendingStackRows: string[][] = []
const instructionRe = /move (\d+) from (\w+) to (\w+)/
for await (const line of io.readLines()) {
  // Collect stacks.
  if (!stacks.size) {
    if (line) {
      const cols = extractCols(line)
      pendingStackRows.push(cols)
    } else {
      const labels = pendingStackRows.pop() ?? []
      for (const [l, label] of labels.entries()) {
        const stack = pendingStackRows
          .map((row) => row[l] ?? '')
          .filter(Boolean)
          .reverse()
        stacks.set(label, stack)
      }
    }
  }
  // Collect instructions.
  else {
    const matches = instructionRe.exec(line)
    if (matches) {
      instructions.push([
        Number(matches[1] ?? 0),
        String(matches[2] ?? 0),
        String(matches[3] ?? 0),
      ])
    }
  }
}

// Exec instructions.
for (const [cnt, from, to] of instructions) {
  const fromStack = stacks.get(from) ?? []
  const toStack = stacks.get(to) ?? []
  const crates = fromStack.splice(-cnt)
  toStack.splice(toStack.length, 0, ...crates)
}

const tops = [...stacks.values()].map((stack) => stack[stack.length - 1])

io.write(tops.join(''))
