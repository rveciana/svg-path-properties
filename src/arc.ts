import { Properties, Point, PointProperties } from './types.ts'

export class Arc implements Properties {
  private x0: number
  private y0: number
  private rx: number
  private ry: number
  private xAxisRotate: number
  private LargeArcFlag: boolean
  private SweepFlag: boolean
  private x1: number
  private y1: number
  private length: number
  constructor (
    x0: number,
    y0: number,
    rx: number,
    ry: number,
    xAxisRotate: number,
    LargeArcFlag: boolean,
    SweepFlag: boolean,
    x1: number,
    y1: number
  ) {
    this.x0 = x0
    this.y0 = y0
    this.rx = rx
    this.ry = ry
    this.xAxisRotate = xAxisRotate
    this.LargeArcFlag = LargeArcFlag
    this.SweepFlag = SweepFlag
    this.x1 = x1
    this.y1 = y1

    const lengthProperties = approximateArcLengthOfCurve(300, function (t: number) {
      return pointOnEllipticalArc(
        { x: x0, y: y0 },
        rx,
        ry,
        xAxisRotate,
        LargeArcFlag,
        SweepFlag,
        { x: x1, y: y1 },
        t
      )
    })
    this.length = lengthProperties.arcLength
  }

  public getTotalLength = () => {
    return this.length
  }

  public getPointAtLength = (fractionLength: number): Point => {
    if (fractionLength < 0) {
      fractionLength = 0
    } else if (fractionLength > this.length) {
      fractionLength = this.length
    }

    const position = pointOnEllipticalArc(
      { x: this.x0, y: this.y0 },
      this.rx,
      this.ry,
      this.xAxisRotate,
      this.LargeArcFlag,
      this.SweepFlag,
      { x: this.x1, y: this.y1 },
      fractionLength / this.length
    )

    return { x: position.x, y: position.y }
  }

  public getTangentAtLength = (fractionLength: number): Point => {
    if (fractionLength < 0) {
      fractionLength = 0
    } else if (fractionLength > this.length) {
      fractionLength = this.length
    }
    const pointDist = 0.05 // needs testing
    const p1 = this.getPointAtLength(fractionLength)
    let p2: Point

    if (fractionLength < 0) {
      fractionLength = 0
    } else if (fractionLength > this.length) {
      fractionLength = this.length
    }

    if (fractionLength < this.length - pointDist) {
      p2 = this.getPointAtLength(fractionLength + pointDist)
    } else {
      p2 = this.getPointAtLength(fractionLength - pointDist)
    }

    const xDist = p2.x - p1.x
    const yDist = p2.y - p1.y
    const dist = Math.sqrt(xDist * xDist + yDist * yDist)

    if (fractionLength < this.length - pointDist) {
      return { x: -xDist / dist, y: -yDist / dist }
    } else {
      return { x: xDist / dist, y: yDist / dist }
    }
  }

  public getPropertiesAtLength = (fractionLength: number): PointProperties => {
    const tangent = this.getTangentAtLength(fractionLength)
    const point = this.getPointAtLength(fractionLength)
    return { x: point.x, y: point.y, tangentX: tangent.x, tangentY: tangent.y }
  }
}

interface PointOnEllipticalArc {
  x: number
  y: number
  ellipticalArcAngle: number
}

const pointOnEllipticalArc = (
  p0: Point,
  rx: number,
  ry: number,
  xAxisRotation: number,
  largeArcFlag: boolean,
  sweepFlag: boolean,
  p1: Point,
  t: number
): PointOnEllipticalArc => {
  // In accordance to: http://www.w3.org/TR/SVG/implnote.html#ArcOutOfRangeParameters
  rx = Math.abs(rx)
  ry = Math.abs(ry)
  xAxisRotation = mod(xAxisRotation, 360)
  const xAxisRotationRadians = toRadians(xAxisRotation)
  // If the endpoints are identical, then this is equivalent to omitting the elliptical arc segment entirely.
  if (p0.x === p1.x && p0.y === p1.y) {
    return { x: p0.x, y: p0.y, ellipticalArcAngle: 0 } // Check if angle is correct
  }

  // If rx = 0 or ry = 0 then this arc is treated as a straight line segment joining the endpoints.
  if (rx === 0 || ry === 0) {
    // return this.pointOnLine(p0, p1, t);
    return { x: 0, y: 0, ellipticalArcAngle: 0 } // Check if angle is correct
  }

  // Following "Conversion from endpoint to center parameterization"
  // http://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter

  // Step #1: Compute transformedPoint
  const dx = (p0.x - p1.x) / 2
  const dy = (p0.y - p1.y) / 2
  const transformedPoint = {
    x: Math.cos(xAxisRotationRadians) * dx + Math.sin(xAxisRotationRadians) * dy,
    y: -Math.sin(xAxisRotationRadians) * dx + Math.cos(xAxisRotationRadians) * dy
  }
  // Ensure radii are large enough
  const radiiCheck =
    Math.pow(transformedPoint.x, 2) / Math.pow(rx, 2) +
    Math.pow(transformedPoint.y, 2) / Math.pow(ry, 2)
  if (radiiCheck > 1) {
    rx = Math.sqrt(radiiCheck) * rx
    ry = Math.sqrt(radiiCheck) * ry
  }

  // Step #2: Compute transformedCenter
  const cSquareNumerator =
    Math.pow(rx, 2) * Math.pow(ry, 2) -
    Math.pow(rx, 2) * Math.pow(transformedPoint.y, 2) -
    Math.pow(ry, 2) * Math.pow(transformedPoint.x, 2)
  const cSquareRootDenom =
    Math.pow(rx, 2) * Math.pow(transformedPoint.y, 2) +
    Math.pow(ry, 2) * Math.pow(transformedPoint.x, 2)
  let cRadicand = cSquareNumerator / cSquareRootDenom
  // Make sure this never drops below zero because of precision
  cRadicand = cRadicand < 0 ? 0 : cRadicand
  const cCoef = (largeArcFlag !== sweepFlag ? 1 : -1) * Math.sqrt(cRadicand)
  const transformedCenter = {
    x: cCoef * ((rx * transformedPoint.y) / ry),
    y: cCoef * (-(ry * transformedPoint.x) / rx)
  }

  // Step #3: Compute center
  const center = {
    x:
      Math.cos(xAxisRotationRadians) * transformedCenter.x -
      Math.sin(xAxisRotationRadians) * transformedCenter.y +
      (p0.x + p1.x) / 2,
    y:
      Math.sin(xAxisRotationRadians) * transformedCenter.x +
      Math.cos(xAxisRotationRadians) * transformedCenter.y +
      (p0.y + p1.y) / 2
  }

  // Step #4: Compute start/sweep angles
  // Start angle of the elliptical arc prior to the stretch and rotate operations.
  // Difference between the start and end angles
  const startVector = {
    x: (transformedPoint.x - transformedCenter.x) / rx,
    y: (transformedPoint.y - transformedCenter.y) / ry
  }
  const startAngle = angleBetween(
    {
      x: 1,
      y: 0
    },
    startVector
  )

  const endVector = {
    x: (-transformedPoint.x - transformedCenter.x) / rx,
    y: (-transformedPoint.y - transformedCenter.y) / ry
  }
  let sweepAngle = angleBetween(startVector, endVector)

  if (!sweepFlag && sweepAngle > 0) {
    sweepAngle -= 2 * Math.PI
  } else if (sweepFlag && sweepAngle < 0) {
    sweepAngle += 2 * Math.PI
  }
  // We use % instead of `mod(..)` because we want it to be -360deg to 360deg(but actually in radians)
  sweepAngle %= 2 * Math.PI

  // From http://www.w3.org/TR/SVG/implnote.html#ArcParameterizationAlternatives
  const angle = startAngle + sweepAngle * t
  const ellipseComponentX = rx * Math.cos(angle)
  const ellipseComponentY = ry * Math.sin(angle)

  const point = {
    x:
      Math.cos(xAxisRotationRadians) * ellipseComponentX -
      Math.sin(xAxisRotationRadians) * ellipseComponentY +
      center.x,
    y:
      Math.sin(xAxisRotationRadians) * ellipseComponentX +
      Math.cos(xAxisRotationRadians) * ellipseComponentY +
      center.y,
    ellipticalArcStartAngle: startAngle,
    ellipticalArcEndAngle: startAngle + sweepAngle,
    ellipticalArcAngle: angle,
    ellipticalArcCenter: center,
    resultantRx: rx,
    resultantRy: ry
  }

  return point
}

const approximateArcLengthOfCurve = (
  resolution: number,
  pointOnCurveFunc: (t: number) => Point
) => {
  // Resolution is the number of segments we use
  resolution = resolution ?? 500

  let resultantArcLength = 0
  const arcLengthMap = []
  const approximationLines = []

  let prevPoint = pointOnCurveFunc(0)
  let nextPoint
  for (let i = 0; i < resolution; i++) {
    const t = clamp(i * (1 / resolution), 0, 1)
    nextPoint = pointOnCurveFunc(t)
    resultantArcLength += distance(prevPoint, nextPoint)
    approximationLines.push([prevPoint, nextPoint])

    arcLengthMap.push({
      t,
      arcLength: resultantArcLength
    })

    prevPoint = nextPoint
  }
  // Last stretch to the endpoint
  nextPoint = pointOnCurveFunc(1)
  approximationLines.push([prevPoint, nextPoint])
  resultantArcLength += distance(prevPoint, nextPoint)
  arcLengthMap.push({
    t: 1,
    arcLength: resultantArcLength
  })

  return {
    arcLength: resultantArcLength,
    arcLengthMap,
    approximationLines
  }
}

const mod = (x: number, m: number) => {
  return ((x % m) + m) % m
}

const toRadians = (angle: number) => {
  return angle * (Math.PI / 180)
}

const distance = (p0: Point, p1: Point) => {
  return Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2))
}

const clamp = (val: number, min: number, max: number) => {
  return Math.min(Math.max(val, min), max)
}

const angleBetween = (v0: Point, v1: Point) => {
  const p = v0.x * v1.x + v0.y * v1.y
  const n = Math.sqrt(
    (Math.pow(v0.x, 2) + Math.pow(v0.y, 2)) * (Math.pow(v1.x, 2) + Math.pow(v1.y, 2))
  )
  const sign = v0.x * v1.y - v0.y * v1.x < 0 ? -1 : 1
  const angle = sign * Math.acos(p / n)

  return angle
}
