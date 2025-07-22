import assert from 'node:assert'
import { describe, test } from 'node:test'
import { Bezier } from '../src/bezier'
import { inDelta } from './inDelta'

describe('Bezier curves', () => {
  test('Testing Length Quadratic', function (test) {
    const curve = new Bezier(200, 300, 400, 50, 600, 300, undefined, undefined)
    assert.strictEqual(inDelta(curve.getTotalLength(), 487.77, 0.1), true)
  })
  test('Testing Length Cubic', function (test) {
    const curve = new Bezier(200, 200, 275, 100, 575, 100, 500, 200)
    assert.strictEqual(inDelta(curve.getTotalLength(), 383.44, 0.1), true)
  })

  test('Testing getPointAtLength Quadratic', function (test) {
    const curve = new Bezier(200, 300, 400, 50, 600, 300, undefined, undefined)
    const point = curve.getPointAtLength(487.77 / 6)
    assert.strictEqual(inDelta(point.x, 255.24, 1), true)
    assert.strictEqual(inDelta(point.y, 240.47, 1), true)
  })

  test('Testing getPointAtLength Cubic', function (test) {
    const curve = new Bezier(200, 200, 275, 100, 575, 100, 500, 200)
    const point = curve.getPointAtLength(383.44 / 6)
    assert.strictEqual(inDelta(point.x, 249.48, 1), true)
    assert.strictEqual(inDelta(point.y, 160.37, 1), true)
  })

  test('Testing pull request #16 solution', function (test) {
    const curve = new Bezier(640.48, 1285.21, 642.39, 644.73, 642.39, 644.73, undefined, undefined)
    const tangent = curve.getTangentAtLength(curve.getTotalLength() / 2)
    assert.strictEqual(inDelta(tangent.y, 0, 1), true)
    assert.strictEqual(inDelta(tangent.x, 0, 1), true)
  })

  test('Testing for infinite length (issue #61)', function (test) {
    const curve = new Bezier(267, 0, 391, 0, 512, 0, undefined, undefined)
    const length = curve.getTotalLength()
    assert.strictEqual(inDelta(length, 245, 0.01), true) // Was infinity
  })
})
