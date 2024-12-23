import {describe, expect, expectTypeOf, it, test} from 'vitest'
import {vec2, type Vec2} from './vec2.legacy.js'

function expectVec2(v: Vec2, x: number, y: number) {
  expect(v[0]).toBe(x)
  expect(v[1]).toBe(y)
}

describe('Vec2', () => {
  it('is spreadable', () => {
    const v = vec2(22, 33)
    expect([...v]).toStrictEqual([22, 33])
  })
  it('is destructible', () => {
    const [x, y] = vec2(22, 33)
    expect(x).toBe(22)
    expect(y).toBe(33)
    expectTypeOf(x).toEqualTypeOf<number>()
    expectTypeOf(y).toEqualTypeOf<number>()
  })
  it('is re-assignable', () => {
    const v = vec2(22, 33)
    v[0] = 44
    v[1] = 55
    expectVec2(v, 44, 55)
  })
  it('[ts] forbids invalid indexes', () => {
    const v = vec2(1, 2)
    // @ts-expect-error
    v[2] = 4
    // @ts-expect-error
    v[3] = 4
  })

  describe('methods', () => {
    test('add', () => {
      const a = vec2(1, 2)
      const b = vec2(3, 4)
      expectVec2(a.add(b), 4, 6)
      expectVec2(b.add(a), 4, 6)
    })

    test('subtract', () => {
      const a = vec2(10, 2)
      const b = vec2(3, 4)
      expectVec2(a.subtract(b), 7, -2)
      expectVec2(b.subtract(a), -7, 2)
    })

    test('scale', () => {
      const v = vec2(1, -2)
      expectVec2(v.scale(2), 2, -4)
    })

    test('invert', () => {
      const v = vec2(1, -2)
      expectVec2(v.invert(), -1, 2)
    })

    test('mod', () => {
      const a = vec2(22, -44)
      const b = vec2(3, 6)
      expectVec2(a.mod(b), 1, 4)
    })

    test('lerp', () => {
      const a = vec2(0, 3)
      const b = vec2(10, -20)
      expectVec2(a.lerp(b, 0), 0, 3)
      expectVec2(a.lerp(b, 1), 10, -20)
      expectVec2(a.lerp(b, 0.5), 5, -8.5)
    })

    test('min', () => {
      const a = vec2(0, 3)
      const b = vec2(10, -20)
      expectVec2(a.min(b), 0, -20)
    })

    test('max', () => {
      const a = vec2(0, 3)
      const b = vec2(10, -20)
      expectVec2(a.max(b), 10, 3)
    })

    test('isZero', () => {
      expect(vec2().isZero).toBe(true)
      expect(vec2(0, 0).isZero).toBe(true)
      expect(vec2(0, 1).isZero).toBe(false)
      expect(vec2(1, 0).isZero).toBe(false)
    })

    test('len', () => {
      const v = vec2(3, 4)
      expect(v.len).toBe(5)
    })

    test('taxiLen', () => {
      const v = vec2(3, 4)
      expect(v.taxiLen).toBe(7)
    })

    test('equals', () => {
      const a = vec2(0, 3)
      const b = vec2(10, -20)
      const c = vec2(0, 3)
      expect(a.equals(a)).toBe(true)
      expect(a.equals(c)).toBe(true)
      expect(a.equals(b)).toBe(false)
    })

    test('inArea', () => {
      const min = vec2(-1, -1)
      const max = vec2(10, 10)
      expect(vec2(0, 0).inArea(min, max)).toBe(true)
      expect(vec2(5, 5).inArea(min, max)).toBe(true)
      expect(vec2(5, -2).inArea(min, max)).toBe(false)
      expect(vec2(-5, 7).inArea(min, max)).toBe(false)
      expect(vec2(-5, 7).inArea(min, max)).toBe(false)

      expect(vec2(-1, -1).inArea(min, max)).toBe(true)
      expect(vec2(10, 10).inArea(min, max)).toBe(false)

      expect(vec2(0, 0).inArea(max)).toBe(true)
      expect(vec2(5, 5).inArea(max)).toBe(true)
      expect(vec2(5, -2).inArea(max)).toBe(false)
      expect(vec2(-5, 7).inArea(max)).toBe(false)
      expect(vec2(-5, 7).inArea(max)).toBe(false)

      expect(vec2(0, 0).inArea(max)).toBe(true)
      expect(vec2(10, 10).inArea(max)).toBe(false)
    })

    test('range', () => {
      const from = vec2(1, -2)
      const to = vec2(4, 2)
      const want = [vec2(1, -2), vec2(1.75, -1), vec2(2.5, 0), vec2(3.25, 1)]
      expect([...from.range(to)]).toEqual(want)
      expect([...from.range(to, true)]).toEqual([...want, to])
    })

    test('fmt', () => {
      const v = vec2(3, 4.78)
      expect(v.fmt()).toBe('3,4.78')
    })
  })
})

describe('vec2', () => {
  it('creates Vec2', () => {
    const v = vec2(123, 456)
    expectVec2(v, 123, 456)
    expectTypeOf(v).toEqualTypeOf<Vec2>()
  })
  it('creates zero Vec2 without args', () => {
    const v = vec2()
    expectVec2(v, 0, 0)
  })

  describe('vec2.parse', () => {
    it('parses comma-separated values', () => {
      expectVec2(vec2.parse('1,2'), 1, 2)
      expectVec2(vec2.parse('1,-3.14'), 1, -3.14)
    })
  })
})
