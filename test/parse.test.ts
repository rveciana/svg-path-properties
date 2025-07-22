import parse from '../src/parse'
import { describe, test } from 'node:test'
import assert from 'node:assert'
describe('Parse strings', () => {
  test('overloaded moveTo', (test) => {
    assert.deepEqual(parse('m 12.5,52 39,0 0,-40 -39,0 z'), [
      ['m', 12.5, 52],
      ['l', 39, 0],
      ['l', 0, -40],
      ['l', -39, 0],
      ['z']
    ])

    assert.deepEqual(parse('M 12.5,52 39,0 0,-40 -39,0 z'), [
      ['M', 12.5, 52],
      ['L', 39, 0],
      ['L', 0, -40],
      ['L', -39, 0],
      ['z']
    ])

    assert.deepEqual(parse('z'), [['z']])
  })

  test('curveTo', function (test) {
    const a = parse('c 50,0 50,100 100,100 50,0 50,-100 100,-100')
    const b = parse('c 50,0 50,100 100,100 c 50,0 50,-100 100,-100')

    assert.deepEqual(
      a,
      [
        ['c', 50, 0, 50, 100, 100, 100],
        ['c', 50, 0, 50, -100, 100, -100]
      ],
      'Correct parse c'
    )
    assert.deepEqual(a, b, 'Testing repeated')
  })

  test('lineTo, h, v, l', function (test) {
    assert.throws(function () {
      parse('l 10 10 0')
    }, /Malformed/)
    assert.deepEqual(parse('l 10,10'), [['l', 10, 10]])
    assert.deepEqual(parse('L 10,10'), [['L', 10, 10]])
    assert.deepEqual(parse('l10 10 10 10'), [
      ['l', 10, 10],
      ['l', 10, 10]
    ])

    assert.deepEqual(parse('h 10.5'), [['h', 10.5]])
    assert.deepEqual(parse('v 10.5'), [['v', 10.5]])
  })

  test('arcTo, quadratic curveTo, smooth curveTo, smooth quadratic curveTo', function (test) {
    assert.deepEqual(parse('A 30 50 0 0 1 162.55 162.45'), [['A', 30, 50, 0, 0, 1, 162.55, 162.45]])

    assert.deepEqual(parse('a30 50 0 01162.55 162.45'), [['a', 30, 50, 0, 0, 1, 162.55, 162.45]])

    assert.deepEqual(parse('a95500 95500 0 01-219.59 1128.84'), [
      ['a', 95500, 95500, 0, 0, 1, -219.59, 1128.84]
    ])

    assert.deepEqual(parse('M10 80 Q 95 10 180 80'), [
      ['M', 10, 80],
      ['Q', 95, 10, 180, 80]
    ])
    assert.deepEqual(parse('S 1 2, 3 4'), [['S', 1, 2, 3, 4]])
    assert.deepEqual(parse('T 1 -2e2'), [['T', 1, -2e2]])

    assert.throws(function () {
      parse('t 1 2 3')
    }, Error)
  })

  test('Empty string', (test) => {
    assert.deepEqual(parse(''), [['M', 0, 0]])
  })
})
