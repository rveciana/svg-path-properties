/* eslint-disable new-cap */
import { svgPathProperties } from '../src/main'
import { describe, test } from 'node:test'
import assert from 'node:assert'

describe('Final library', () => {
  test('Creation with different styles test', function (test) {
    const svgPath = 'M0,100 q50,-150 100,0 t100,0'
    const a = new svgPathProperties(svgPath) // MyClass
    const b = new svgPathProperties(svgPath) // also MyClass

    assert.strictEqual(
      a.getTotalLength(),
      b.getTotalLength(),
      'Both methods must return the same and work: getTotalLength'
    )
    assert.deepEqual(
      a.getPointAtLength(50),
      b.getPointAtLength(50),
      'Both methods must return the same and work: getPointAtLength'
    )
    assert.deepEqual(
      a.getTangentAtLength(50),
      b.getTangentAtLength(50),
      'Both methods must return the same and work: getTangentAtLength'
    )
    assert.deepEqual(
      a.getPropertiesAtLength(50),
      b.getPropertiesAtLength(50),
      'Both methods must return the same and work: getPropertiesAtLength'
    )

    assert.deepEqual(a.getParts()[0].start, b.getParts()[0].start)
  })
})
