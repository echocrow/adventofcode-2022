import IO from 'lib/io.js'

const io = new IO()

type OpFn = (a: number, b: number) => number
const ops = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
} satisfies Record<string, OpFn>
type OpSign = keyof typeof ops

// Parse.
type MathMonkey = readonly [a: string, b: string, op: OpFn, name: string]
const mathMonkeys = new Map<string, MathMonkey>()
const nums = new Map<string, number>()
for await (const line of io.readLines()) {
  const [name = '', rightHand = ''] = line.split(': ')
  const num = Number(rightHand)
  if (isNaN(num)) {
    const [a = '', opSign = '', b = ''] = rightHand.split(' ')
    mathMonkeys.set(name, [a, b, ops[opSign as OpSign], name])
  } else {
    nums.set(name, num)
  }
}

const ROOT = 'root'

// Figure out shorted path.
const steps = new Set<MathMonkey>()
const queue: string[] = [ROOT]
let name: string = ''
while ((name = queue.pop() ?? '')) {
  const math = mathMonkeys.get(name)
  if (!math) continue
  steps.add(math)
  const [a, b] = math
  queue.push(a), queue.push(b)
}

// Eval required math monkeys.
for (const math of [...steps].reverse()) {
  const [a, b, op, name] = math
  const num = op(nums.get(a)!, nums.get(b)!)
  nums.set(name, num)
}

io.write(nums.get(ROOT)!)
