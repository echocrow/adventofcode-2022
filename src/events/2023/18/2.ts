import io from '#lib/io.js'
import {posMod} from '#lib/math.js'

enum Dir {
  left,
  down,
  right,
  up,
}
const dirByDigit = [Dir.right, Dir.down, Dir.left, Dir.up]

// Parse plan.
const moves: (readonly [Dir, len: number])[] = []
for await (const m of io.readRegExp(/#(\w{5})(\d)/))
  moves.push([dirByDigit[Number(m[2])]!, parseInt(m[1]!, 16)])

// Calculate area.
let area = 0
{
  // (a) Track inner area.
  let y = 0
  let innerArea = 0
  // (b) Track length of perimeter.
  let borderLen = 0
  // (c) Track inside vs outside turns.
  let insideDir = moves[0]![0]
  let prevDir = moves.at(-1)![0]
  let inVsOutTurns = 0
  for (const [dir, len] of moves) {
    // (a) Sum inner area.
    if (dir === Dir.left || dir === Dir.right)
      innerArea += y * len * (dir === Dir.right ? 1 : -1)
    else y += len * (dir === Dir.up ? 1 : -1)
    // (b) Sum length of perimeter.
    borderLen += len
    // (c) Sum inside vs outside turns.
    inVsOutTurns += dir === insideDir ? 1 : -1
    insideDir = posMod(insideDir + dir - prevDir, 4)
    prevDir = dir
  }

  area = Math.abs(innerArea) + borderLen * 0.5 + Math.abs(inVsOutTurns) * 0.25
}

io.write(area)

/**
 * Explanation:
 *
 * This is based on the Shoelace formula to calculate the area of the polygon.
 * This value needs to be adjusted to also include the area of the "trench", as
 * the Shoelace formula only includes the area inside the trench, and the
 * "inner" halves of the trench itself.
 * To fix this we add:
 * - 1/2 for all straight edges (adding back the outer half).
 * - 3/4 for outside corners (as Shoelace only includes the inner quarter).
 * - 1/4 for inside corners (the outer quarter that's part of the trench).
 *
 * Example trench:
 * +-------+
 * |#######|
 * |#     #|
 * |###   #|
 * |  #   #|
 * |  #   #|
 * |### ###|
 * |#   #  |
 * |##  ###|
 * | #    #|
 * | ######|
 * +-------+
 *
 * 1) Calculate Shoelace area.
 * 2) Track edges and inside/outside turns.
 * 3) Combine for full area:
 *    - add 1/2 for straight edges, e.g. [▀] or [▌]
 *    - add 3/4 for outside corners, e.g. [▛] or [▟]
 *    - add 1/4 for inside corners, e.g. [▖] or [▝]
 *
 * +---1---+     +---2---+     +---3---+
 * |▗▄▄▄▄▄▖|     |▛▀▀▀▀▀▜|     |███████|
 * |▐█████▌|     |▌     ▐|     |███████|
 * |▝▀▜███▌|     |▙▄▖   ▐|     |███████|
 * |  ▐███▌|     |  ▌   ▐|     |  █████|
 * |  ▐███▌|  +  |  ▌   ▐|  =  |  █████|
 * |▗▄▟█▛▀▘|     |▛▀▘ ▗▄▟|     |███████|
 * |▐███▌  |     |▌   ▐  |     |█████  |
 * |▝▜██▙▄▖|     |▙▖  ▝▀▜|     |███████|
 * | ▐████▌|     | ▌    ▐|     | ██████|
 * | ▝▀▀▀▀▘|     | ▙▄▄▄▄▟|     | ██████|
 * +-------+     +-------+     +-------+
 */
