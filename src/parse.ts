/* eslint-disable security/detect-object-injection */
import { pathOrders } from './types.ts'

const length: { [key in pathOrders]: number } = {
  a: 7,
  c: 6,
  h: 1,
  l: 2,
  m: 2,
  q: 4,
  s: 4,
  t: 2,
  v: 1,
  z: 0
}
const segmentRegExp = /([astvzqmhlc])([^astvzqmhlc]*)/gi
// eslint-disable-next-line security/detect-unsafe-regex
const numberRegExp = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi

export default (path: string) => {
  const segments = (path && path.length > 0 ? path : 'M0,0').match(segmentRegExp)
  if (!segments) {
    throw new Error(`No path elements found in string ${path}`)
  }
  return segments.reduce((segmentsArray: [string, ...Array<number>][], segmentString: string) => {
    let command = segmentString.charAt(0)
    let type: pathOrders = command.toLowerCase() as pathOrders
    const args =
      type === 'a'
        ? parseArcValues(segmentString.substring(1))
        : parseValues(segmentString.substring(1))

    // overloaded moveTo
    if (type === 'm' && args.length > 2) {
      segmentsArray.push([command, ...args.splice(0, 2)])
      type = 'l'
      command = command === 'm' ? 'l' : 'L'
    }

    while (args.length >= 0) {
      if (args.length === length[type]) {
        segmentsArray.push([command, ...args.splice(0, length[type])])
        break
      }
      if (args.length < length[type]) {
        throw new Error(
          `Malformed path data: "${command}" must have ${length[type]} elements and has ${args.length}: ${segmentString}`
        )
      }
      segmentsArray.push([command, ...args.splice(0, length[type])])
    }

    return segmentsArray
  }, [])
}

const parseValues = (args: string) => {
  const numbers = args.match(numberRegExp)
  return numbers ? numbers.map(Number) : []
}

// The arc flags are single digits, so a flag can be followed by the next value without a separator
// eslint-disable-next-line security/detect-unsafe-regex
const arcNumberRegExp = /^[\s,]*([-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)/i
const arcFlagRegExp = /^[\s,]*([01])/

const parseArcValues = (args: string) => {
  const values: number[] = []
  let rest = args
  for (;;) {
    for (let i = 0; i < length.a; i++) {
      const match = (i === 3 || i === 4 ? arcFlagRegExp : arcNumberRegExp).exec(rest)
      if (!match) {
        return values
      }
      values.push(Number(match[1]))
      rest = rest.substring(match[0].length)
    }
  }
}
