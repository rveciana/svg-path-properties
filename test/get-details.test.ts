import SVGPathProperties from '../src/svg-path-properties'
import assert from 'node:assert'
import { describe, test } from 'node:test'

// Helper: get details of all parts from a path string
const details = (path: string) =>
  new SVGPathProperties(path).getParts().map((p) => p.details)

describe('getDetails', () => {
  // ─── Linear: L ────────────────────────────────────────────────────────────

  test('L absolute — returns absolute coords', () => {
    const [d] = details('M10,20 L30,40')
    assert.deepEqual(d, ['L', 30, 40])
  })

  test('l relative — converted to absolute coords', () => {
    const [d] = details('M10,20 l20,20')
    assert.deepEqual(d, ['L', 30, 40])
  })

  test('multiple L segments — each has own details', () => {
    const [d0, d1] = details('M0,0 L10,0 L10,10')
    assert.deepEqual(d0, ['L', 10, 0])
    assert.deepEqual(d1, ['L', 10, 10])
  })

  // ─── Linear: H ────────────────────────────────────────────────────────────

  test('H absolute — returns absolute x', () => {
    const [d] = details('M10,20 H50')
    assert.deepEqual(d, ['H', 50])
  })

  test('h relative — converted to absolute x', () => {
    const [d] = details('M10,20 h40')
    assert.deepEqual(d, ['H', 50])
  })

  // ─── Linear: V ────────────────────────────────────────────────────────────

  test('V absolute — returns absolute y', () => {
    const [d] = details('M10,20 V80')
    assert.deepEqual(d, ['V', 80])
  })

  test('v relative — converted to absolute y', () => {
    const [d] = details('M10,20 v60')
    assert.deepEqual(d, ['V', 80])
  })

  // ─── Linear: Z ────────────────────────────────────────────────────────────

  test('Z close path — returns Z tuple', () => {
    const [, d] = details('M0,0 L10,0 Z')
    assert.deepEqual(d, ['Z'])
  })

  test('z lowercase close path — returns Z tuple', () => {
    const [, d] = details('M0,0 L10,0 z')
    assert.deepEqual(d, ['Z'])
  })

  // ─── Cubic Bézier: C ──────────────────────────────────────────────────────

  test('C absolute cubic — returns all 6 coords', () => {
    const [d] = details('M0,0 C10,20 30,40 50,0')
    assert.deepEqual(d, ['C', 10, 20, 30, 40, 50, 0])
  })

  test('c relative cubic — converted to absolute coords', () => {
    // Start at (100,200), offsets: cp1(0,-100) cp2(150,-100) end(150,0)
    const [d] = details('M100,200 c0,-100 150,-100 150,0')
    assert.deepEqual(d, ['C', 100, 100, 250, 100, 250, 200])
  })

  // ─── Cubic Bézier: S ──────────────────────────────────────────────────────

  test('S smooth cubic after C — cp1 is reflection of previous cp2', () => {
    // M100,200 C100,100 250,100 250,200 → cp2=(250,100), end=(250,200)
    // S: reflected cp1 = 2*250-250=250, 2*200-100=300
    const [, d] = details('M100,200 C100,100 250,100 250,200 S400,300 400,200')
    assert.deepEqual(d, ['C', 250, 300, 400, 300, 400, 200])
  })

  test('S smooth cubic without prior C — cp1 equals start point', () => {
    const [d] = details('M100,200 S400,300 400,200')
    assert.deepEqual(d, ['C', 100, 200, 400, 300, 400, 200])
  })

  test('s relative smooth cubic after C — all coords absolute', () => {
    const [, d] = details('M100,200 C100,100 250,100 250,200 s150,100 150,0')
    assert.deepEqual(d, ['C', 250, 300, 400, 300, 400, 200])
  })

  // ─── Quadratic Bézier: Q ──────────────────────────────────────────────────

  test('Q absolute quadratic — returns cp and end', () => {
    const [d] = details('M0,0 Q50,100 100,0')
    assert.deepEqual(d, ['Q', 50, 100, 100, 0])
  })

  test('q relative quadratic — converted to absolute coords', () => {
    const [d] = details('M0,0 q50,100 100,0')
    assert.deepEqual(d, ['Q', 50, 100, 100, 0])
  })

  test('Q degenerate (cp == start) — falls back to L', () => {
    // When the control point equals the start, a LinearPosition is used
    const [d] = details('M10,20 Q10,20 50,60')
    assert.deepEqual(d, ['L', 50, 60])
  })

  test('q degenerate (zero offsets) — falls back to L', () => {
    const [d] = details('M10,20 q0,0 40,40')
    assert.deepEqual(d, ['L', 50, 60])
  })

  // ─── Quadratic Bézier: T ──────────────────────────────────────────────────

  test('T smooth quadratic after Q — cp is reflection of previous cp', () => {
    // Q cp=(50,100), end=(100,0); reflected cp = 2*100-50=150, 2*0-100=-100
    const [, d] = details('M0,0 Q50,100 100,0 T200,0')
    assert.deepEqual(d, ['Q', 150, -100, 200, 0])
  })

  test('T smooth quadratic without prior Q — falls back to L', () => {
    const [d] = details('M0,0 T100,0')
    assert.deepEqual(d, ['L', 100, 0])
  })

  test('t relative smooth quadratic after Q — all coords absolute', () => {
    const [, d] = details('M0,0 Q50,100 100,0 t100,0')
    assert.deepEqual(d, ['Q', 150, -100, 200, 0])
  })

  test('t relative smooth quadratic without prior Q — falls back to L', () => {
    const [d] = details('M0,0 t100,0')
    assert.deepEqual(d, ['L', 100, 0])
  })

  // ─── Arc: A ───────────────────────────────────────────────────────────────

  test('A absolute arc — returns all 7 values with flags as 0/1', () => {
    const [d] = details('M0,0 A25,26,0,0,1,50,0')
    assert.deepEqual(d, ['A', 25, 26, 0, 0, 1, 50, 0])
  })

  test('A arc with largeArcFlag=1 — flag preserved as 1', () => {
    const [d] = details('M0,0 A25,26,0,1,0,50,0')
    assert.deepEqual(d, ['A', 25, 26, 0, 1, 0, 50, 0])
  })

  test('A arc with xAxisRotation — rotation preserved', () => {
    const [d] = details('M0,0 A25,26,45,0,1,50,0')
    assert.deepEqual(d, ['A', 25, 26, 45, 0, 1, 50, 0])
  })

  test('a relative arc — end coords converted to absolute', () => {
    const [d] = details('M10,20 a25,26,0,0,1,50,0')
    assert.deepEqual(d, ['A', 25, 26, 0, 0, 1, 60, 20])
  })

  // ─── Mixed path ───────────────────────────────────────────────────────────

  test('mixed path — each part has correct details in order', () => {
    const parts = new SVGPathProperties('M0,0 L10,0 H20 V10 C10,5 15,5 20,0 Q5,10 10,0 A5,5,0,0,1,20,0 Z').getParts()

    assert.deepEqual(parts[0].details, ['L', 10, 0], 'L segment')
    assert.deepEqual(parts[1].details, ['H', 20], 'H segment')
    assert.deepEqual(parts[2].details, ['V', 10], 'V segment')
    assert.deepEqual(parts[3].details, ['C', 10, 5, 15, 5, 20, 0], 'C segment')
    assert.deepEqual(parts[4].details, ['Q', 5, 10, 10, 0], 'Q segment')
    assert.deepEqual(parts[5].details, ['A', 5, 5, 0, 0, 1, 20, 0], 'A segment')
    assert.deepEqual(parts[6].details, ['Z'], 'Z segment')
  })
})
