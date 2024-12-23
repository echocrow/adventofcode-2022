import {describe, expect, it} from 'vitest'
import {vec2, Vec2} from './vec2.legacy.js'
import {parseVec3, Vec3} from './vec3.js'
import vec, {VecSet, type Vec} from './vec.legacy.js'

function expectVec2Instance(v: Vec) {
  expect(v).toBeInstanceOf(Vec2)
}
function expectVec2(v: Vec, x: number, y: number) {
  expectVec2Instance(v)
  expect(v[0]).toBe(x)
  expect(v[1]).toBe(y)
}

function expectVec3Instance(v: unknown) {
  expect(v).toBeInstanceOf(Vec3)
}
function expectVec3(v: Vec, x: number, y: number, z: number) {
  expectVec3Instance(v)
  expect(v[0]).toBe(x)
  expect(v[1]).toBe(y)
  expect(v[2]).toBe(z)
}

describe('vec', () => {
  it('creates an empty vec2 by default', () => {
    expectVec2(vec(), 0, 0)
  })
  it('creates a vec2', () => {
    expectVec2Instance(vec(123, 456))
  })
  it('creates a vec3 with two `undefined`', () => {
    expectVec2Instance(vec(undefined, undefined))
  })
  it('creates a vec3', () => {
    expectVec3Instance(vec(123, 456, 789))
  })
  it('creates a vec3 with three `undefined`', () => {
    expectVec3Instance(vec(undefined, undefined, undefined))
  })

  describe('vec.parse2', () => {
    it('parses vec2', () => {
      expect(vec.parse2).toBe(vec2.parse)
    })
  })

  describe('vec.parse3', () => {
    it('parses vec3', () => {
      expect(vec.parse3).toBe(parseVec3)
    })
  })

  describe('vec.min', () => {
    it('vec2: returns the minimum of two vectors', () => {
      expectVec2(vec.min(vec(2, 3), vec(4, -5)), 2, -5)
    })
    it.todo('vec3: returns the minimum of two vectors', () => {
      expectVec3(vec.min(vec(2, 3, -4), vec(4, -5, 6)), 2, -5, -4)
    })
  })
})

describe('VecSet', () => {
  it('acts like a set', () => {
    const set = new VecSet()
    expect(set.size).toBe(0)

    expect(set.has(vec(1, 2))).toBe(false)
    set.add(vec(1, 2))
    expect(set.size).toBe(1)
    expect(set.has(vec(1, 2))).toBe(true)

    expect(set.has(vec(-3, 4))).toBe(false)
    set.add(vec(-3, 4))
    expect(set.size).toBe(2)
    expect(set.has(vec(-3, 4))).toBe(true)
    set.delete(vec(-3, 4))
    expect(set.size).toBe(1)
    expect(set.has(vec(-3, 4))).toBe(false)

    expect(set.size).toBe(1)
    expect(set.has(vec(1, 2))).toBe(true)
    set.add(vec(1, 2))
    expect(set.size).toBe(1)
    expect(set.has(vec(1, 2))).toBe(true)
    set.delete(vec(1, 2))
    expect(set.size).toBe(0)
    expect(set.has(vec(1, 2))).toBe(false)
  })

  it('can be iterated', () => {
    const set = new VecSet([vec(1, 2), vec(-3, 4)])
    expect([...set]).toEqual([vec(1, 2), vec(-3, 4)])
  })
})
