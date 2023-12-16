import io from '#lib/io.js'
import {sum} from '#lib/iterable.js'

class Board {
  #rows: number[][]
  #cols: number[][]
  constructor(nums: number[][]) {
    this.#rows = nums
    this.#cols = nums.map((_, y) => nums.map((_, x) => nums[x]?.[y] ?? 0))
  }
  mark(num: number) {
    this.#rows = this.#rows.map((r) => r.filter((n) => n != num))
    this.#cols = this.#cols.map((c) => c.filter((n) => n != num))
  }
  isComplete(): boolean {
    return (
      this.#rows.some((r) => !r.length) || this.#cols.some((c) => !c.length)
    )
  }
  *remaining() {
    for (const row of this.#rows) {
      yield* row
    }
  }
}

function drawLastWinner(draws: number[], boards: Board[]): [number, Board] {
  const remainingBoards = new Set(boards)
  for (const num of draws) {
    for (const board of boards) {
      board.mark(num)
      if (board.isComplete()) {
        remainingBoards.delete(board)
        if (!remainingBoards.size) return [num, board]
      }
    }
  }
  throw new Error('Numbers exhausted')
}

let draws: number[] = []
let boardQueue: number[][] = []
const boards: Board[] = []
for await (const line of io.readLines()) {
  if (!draws.length) {
    draws = line.split(',').map(Number)
  } else if (line) {
    const row = line.trim().split(/\s+/).map(Number)
    boardQueue.push(row)
    if (boardQueue.length >= row.length) {
      boards.push(new Board(boardQueue))
      boardQueue = []
    }
  }
}

const [winNum, winner] = drawLastWinner(draws, boards)

const remainingNums = [...winner.remaining()]

io.write(sum(remainingNums) * winNum)
