import io from '#lib/io.js'

class Submarine {
  x = 0
  y = 0
  aim = 0
  down(n: number) {
    this.aim += n
  }
  up(n: number) {
    this.aim -= n
  }
  forward(n: number) {
    this.x += n
    this.y += this.aim * n
  }
}
type Inst = 'down' | 'up' | 'forward'

const sub = new Submarine()
for await (const line of io.readLines()) {
  const [inst, num] = line.split(' ') as [Inst, string]
  sub[inst](Number(num))
}

io.write(sub.x * sub.y)
