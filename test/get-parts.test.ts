import SVGPathProperties from '../src/svg-path-properties'
import assert from 'node:assert'
import { describe, test } from 'node:test'

describe('get parts', () => {
  test('Testing the getParts with simple path', function (test) {
    let properties = new SVGPathProperties('m10,0l10,0')
    let parts = properties.getParts()

    assert.strictEqual(parts.length, 1, 'A one part path must give one element array')
    assert.strictEqual('start' in parts[0], true, 'Elements must have all properties')
    assert.strictEqual('end' in parts[0], true, 'Elements must have all properties')
    assert.strictEqual('length' in parts[0], true, 'Elements must have all properties')
    assert.strictEqual('getPointAtLength' in parts[0], true, 'Elements must have all properties')
    assert.strictEqual('getTangentAtLength' in parts[0], true, 'Elements must have all properties')
    assert.strictEqual(
      'getPropertiesAtLength' in parts[0],
      true,
      'Elements must have all properties'
    )

    properties = new SVGPathProperties('m10,0l10,0l10,0')
    parts = properties.getParts()

    assert.deepEqual(parts[0].start, { x: 10, y: 0 }, 'testing start points')
    assert.deepEqual(parts[1].start, { x: 20, y: 0 }, 'testing start points')

    assert.deepEqual(parts[0].end, { x: 20, y: 0 }, 'testing end points')
    assert.deepEqual(parts[1].end, { x: 30, y: 0 }, 'testing end points')

    assert.strictEqual(parts[0].length, 10, 'testing lengths')
    assert.strictEqual(parts[1].length, 10, 'testing lengths')

    // Testing functions
    assert.deepEqual(parts[0].getPointAtLength(5), { x: 15, y: 0 }, 'testing getPointAtLength')
    assert.deepEqual(parts[1].getPointAtLength(5), { x: 25, y: 0 }, 'testing getPointAtLength')

    assert.deepEqual(parts[0].getTangentAtLength(5), { x: 1, y: 0 }, 'testing getTangentAtLength')
    assert.deepEqual(parts[1].getTangentAtLength(5), { x: 1, y: 0 }, 'testing getTangentAtLength')

    assert.deepEqual(
      parts[0].getPropertiesAtLength(5),
      { tangentX: 1, tangentY: 0, x: 15, y: 0 },
      'testing getPropertiesAtLength'
    )
    assert.deepEqual(
      parts[1].getPropertiesAtLength(5),
      { tangentX: 1, tangentY: 0, x: 25, y: 0 },
      'testing getPropertiesAtLength'
    )
  })

  test('Testing the getParts with simple path', function (test) {
    const properties = new SVGPathProperties('M100,200 C100,100 250,100 250,200 S400,300 400,200')
    const parts = properties.getParts()
    assert.strictEqual(parts.length, 2, 'Correct number of parts')
    assert.deepEqual(
      parts[0].getPointAtLength(5),
      properties.getPointAtLength(5),
      'First part must have equal distances'
    )
    assert.deepEqual(
      parts[1].getPointAtLength(5),
      properties.getPointAtLength(parts[0]['length'] + 5),
      'Second part must have equal distances'
    )
  })

  test('Issue 15', function (test) {
    let def = 'M0,0 c 0.025,-0.052 0.081,-0.1387 0.2031,-0.2598 0,0 0,0 0,0'
    let properties = new SVGPathProperties(def)
    properties.getParts() // The above path used to hang the programd

    def =
      'M0,0 c 0.025,-0.052 0.081,-0.1387 0.2031,-0.2598 0,0 0,0 0,0 c 0.1865,-0.31055 0.3632,-0.71289 0.5371,-1.22266 0.1963,-0.40625 0.3261,-0.78516 0.3857,-1.13184 0,-0.008 0,-0.0156 0,-0.0225'
    properties = new SVGPathProperties(def)
    properties.getParts()
  })
})
