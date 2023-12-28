import io from '#lib/io.js'
import {StateVec3, Vec3, type mutVec3} from '#lib/vec3.js'

class Stone extends StateVec3 {}

// Parse input.
const stones: Stone[] = []
for await (const line of io.readLines()) {
  const s = [...line.matchAll(/-?\d+/g)].map((v) => Number(v[0]))
  stones.push(
    new Stone(
      new Vec3(...(s.slice(0, 3) as mutVec3)),
      new Vec3(...(s.slice(3, 6) as mutVec3)),
    ),
  )
}

// Define static helper vectors, etc.
// Main axis of rotation for evaluation.
const axisStone = stones[0]!
const axis = [axisStone.pos, axisStone.posAt(10)] as const
const axisVec = axis[1].subtract(axis[0])
// Angle stone used as 3rd point for defining the plane.
const angleStone = stones[1]!
// Reference stones used to determine and evaluate the collision trajectory.
const refAStone = stones[2]!
const refBStone = stones[3]!
const refALine = [refAStone.pos, refAStone.posAt(10)] as const
const refBLine = [refBStone.pos, refBStone.posAt(10)] as const

// Given a time, create a lead for the collision trajectory, and return a signed
// "distance" indicating how far off the lead is from the collision trajectory.
function evaluate(t: number) {
  // Define plane based on axisStone and current angleStone.
  const anglePos = angleStone.posAt(t)
  const plane = [...axis, anglePos] as const
  // Intersect refA stones with plane to determine collision trajectory.
  // Then intersect refB stone to evaluate the collision trajectory.
  const pAIntersect = Vec3.intersectPlane(plane, refALine)
  const pBIntersect = Vec3.intersectPlane(plane, refBLine)
  if (!pAIntersect || !pBIntersect) throw new Error('no intersection')
  // Evaluate trajectory.
  const projected = Vec3.projectPointToLine(pBIntersect, anglePos, pAIntersect)
  const projVec = pBIntersect.subtract(projected)
  return projVec.signedLength(axisVec)
}

// Determine lower and upper bounds of the collision time of the angle stone.
let lowerT = 0
let upperT = 1
let scoreAscends = true
{
  let lowerScore = evaluate(lowerT)
  let upperScore = evaluate(upperT)
  scoreAscends = lowerScore < 0
  while (Math.sign(lowerScore) === Math.sign(upperScore)) {
    lowerT = upperT
    lowerScore = upperScore
    upperT *= 2
    upperScore = evaluate(upperT)
  }
}

// Binary search for the collision time of the angle stone.
if (lowerT > upperT) {
  ;[lowerT, upperT] = [upperT, lowerT]
  scoreAscends = !scoreAscends
}
while (lowerT <= upperT) {
  const t = Math.floor((lowerT + upperT) / 2)
  const score = evaluate(t)
  if (Math.abs(score) < 0.01) (lowerT = t), (upperT = t - 1)
  else if (scoreAscends ? score < 0 : score > 0) lowerT = t + 1
  else upperT = t - 1
}

// Determine start position of collision stone.
let coll0Pos: Vec3
{
  // Calc where the angle stone intersects the collision trajectory.
  const angleStoneCollT = lowerT
  const angleStoneCollPos = angleStone.posAt(angleStoneCollT)
  const plane = [...axis, angleStoneCollPos] as const
  // Calc where and when the refA stone intersects the collision trajectory.
  const refACollPos = Vec3.intersectPlane(plane, refALine)
  const refACollT = (refACollPos.x - refAStone.pos.x) / refAStone.vel.x
  // Determine collision trajectory vector.
  const collVec = refACollPos.subtract(angleStoneCollPos)
  // Calc where the collision stone starts, based on where and when the angle
  // stone and refA stone were hit.
  coll0Pos = angleStoneCollPos.add(
    collVec.scale(-angleStoneCollT / (refACollT - angleStoneCollT)),
  )
}

io.write(coll0Pos.x + coll0Pos.y + coll0Pos.z)
