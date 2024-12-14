import {describe, expect, it} from 'vitest'
import {vec2, Vec2Class} from './vec2.js'
import {parseVec3, Vec3} from './vec3.js'
import vec, {VecSet} from './vec.js'

function expectVec2Instance(v: unknown) {
  expect(v).toBeInstanceOf(Vec2Class)
}

function expectVec3Instance(v: unknown) {
  expect(v).toBeInstanceOf(Vec3)
}

describe('vec', () => {
  it('creates an empty vec2 by default', () => {
    const got = vec()
    expectVec2Instance(got)
    expect(got[0]).toBe(0)
    expect(got[1]).toBe(0)
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

  describe('vec2.parse2', () => {
    it('parses vec2', () => {
      expect(vec.parse2).toBe(vec2.parse)
    })
  })

  describe('vec2.parse3', () => {
    it('parses vec3', () => {
      expect(vec.parse3).toBe(parseVec3)
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
