import io from '#lib/io.js'
import {sum} from '#lib/iterable.js'

enum Xmas {
  x,
  m,
  a,
  s,
}
type XmasChar = keyof typeof Xmas

type Part = [number, number, number, number]

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
  eval(part: Part): boolean {
    return this.lt ? part[this.xmas] < this.val : part[this.xmas] > this.val
  }
}

class Workflow {
  constructor(
    private rules: Rule[],
    private fallback: string,
  ) {}
  eval(part: Part): string {
    for (const rule of this.rules) if (rule.eval(part)) return rule.res
    return this.fallback
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

// Parse & eval parts.
let result = 0
for await (const match of io.readRegExp(
  /\{x=(\d+),m=(\d+),a=(\d+),s=(\d+)\}/,
)) {
  const part = [...match].slice(1).map(Number) as Part

  let wf = 'in'
  while (!(wf in Result)) wf = workflows.get(wf)!.eval(part)
  if (wf === Result.A) result += sum(part)
}

io.write(result)
