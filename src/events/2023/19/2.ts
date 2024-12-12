import io from '#lib/io.js'
import {filo, map, product} from '#lib/iterable.js'

enum Xmas {
  x,
  m,
  a,
  s,
}
type XmasChar = keyof typeof Xmas

type Range = readonly [min: number, max: number]
function rangeLen(range: Range) {
  return range[1] - range[0] + 1
}

type Part = [Range, Range, Range, Range]
function clonePart(part: Part): Part {
  return [...part]
}
type FlowPart = [flowName: string, part: Part]

enum Result {
  A = 'A',
  R = 'R',
}

class Rule {
  constructor(
    private xmas: Xmas,
    private lt: boolean,
    private val: number,
    public readonly res: string,
  ) {}
  eval(part: Part): readonly [pass: Part | null, fail: Part | null] {
    const {lt, xmas} = this
    const rng = part[xmas]
    // Check if full range passes.
    if (lt ? rng[1] < this.val : rng[0] > this.val) return [part, null]
    // Check if full range fails.
    if (lt ? rng[0] >= this.val : rng[1] <= this.val) return [null, part]

    const clone = clonePart(part)
    part[xmas] = lt ? [rng[0], this.val - 1] : [this.val + 1, rng[1]]
    clone[xmas] = lt ? [this.val, rng[1]] : [rng[0], this.val]
    return [part, clone]
  }
}

class Workflow {
  constructor(
    private rules: Rule[],
    private fallback: string,
  ) {}
  *eval(part: Part): Iterable<FlowPart> {
    let carry = part
    for (const rule of this.rules) {
      const [passed, failed] = rule.eval(carry)
      if (passed) yield [rule.res, passed]
      if (!failed) return
      carry = failed
    }
    yield [this.fallback, carry]
  }
}

// Parse workflows.
const workflows = new Map<string, Workflow>()
for await (const [_, name, rulesStr, fallback] of io.readRegExp(
  /(\w+)\{([^}]+),(\w+)\}/,
)) {
  const rules = [...rulesStr!.matchAll(/(\w)([<>])(\d+):(\w+)/g)].map(
    ([_, char, cmp, val, res]) =>
      new Rule(Xmas[char as XmasChar], cmp === '<', Number(val), res!),
  )
  workflows.set(name!, new Workflow(rules, fallback!))
}

// Process workflows with ranged parts.
let result = 0
const queue = [['in', new Array(4).fill([1, 4000])] as FlowPart]
for (const flowPart of filo(queue)) {
  const [wf, part] = flowPart
  if (wf in Result) {
    if (wf === Result.A) result += product(map(part, rangeLen))
  } else {
    const workflow = workflows.get(wf)!
    queue.push(...workflow.eval(part))
  }
}

io.write(result)
