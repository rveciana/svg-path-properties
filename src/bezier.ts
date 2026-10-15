import { SegmentProperties, Point, SegmentDetails } from './types.ts'

import {
  cubicPoint,
  getCubicArcLength,
  cubicDerivative,
  getQuadraticArcLength,
  quadraticPoint,
  quadraticDerivative,
  t2length
} from './bezier-functions.ts'

// How far along the curve to look when the derivative vanishes at t. Small
// enough that the direction is the limit, large enough to survive rounding.
const TANGENT_EPSILON = 1e-8

export class Bezier implements SegmentProperties {
  private a: Point
  private b: Point
  private c: Point
  private d: Point
  private length: number
  private isCubic: boolean
  private getArcLength: (xs: number[], ys: number[], t: number) => number
  private getPoint: (xs: number[], ys: number[], t: number) => Point
  private getDerivative: (xs: number[], ys: number[], t: number) => Point

  constructor (
    ax: number,
    ay: number,
    bx: number,
    by: number,
    cx: number,
    cy: number,
    dx: number | undefined,
    dy: number | undefined
  ) {
    this.a = { x: ax, y: ay }
    this.b = { x: bx, y: by }
    this.c = { x: cx, y: cy }

    if (dx !== undefined && dy !== undefined) {
      this.isCubic = true
      this.getArcLength = getCubicArcLength
      this.getPoint = cubicPoint
      this.getDerivative = cubicDerivative
      this.d = { x: dx, y: dy }
    } else {
      this.isCubic = false
      this.getArcLength = getQuadraticArcLength
      this.getPoint = quadraticPoint
      this.getDerivative = quadraticDerivative
      this.d = { x: 0, y: 0 }
    }
    this.length = this.getArcLength(
      [this.a.x, this.b.x, this.c.x, this.d.x],
      [this.a.y, this.b.y, this.c.y, this.d.y],
      1
    )
  }

  private normalizeTangent = (
    xs: number[],
    ys: number[],
    t: number
  ): Point => {
    let derivative = this.getDerivative(xs, ys, t)
    let mdl = Math.hypot(derivative.x, derivative.y)

    if (mdl === 0) {
      // The derivative vanishes where a control point sits on its anchor, but
      // the curve still has a tangent there. Take the limit from just along
      // the curve, forwards where there is room and backwards at the end.
      const nudged = t < 1 ? t + TANGENT_EPSILON : t - TANGENT_EPSILON
      derivative = this.getDerivative(xs, ys, nudged)
      mdl = Math.hypot(derivative.x, derivative.y)
    }

    if (mdl > 0) {
      return { x: derivative.x / mdl, y: derivative.y / mdl }
    }
    return { x: 0, y: 0 }
  }

  public getTotalLength = () => {
    return this.length
  }

  public getPointAtLength = (length: number) => {
    const xs = [this.a.x, this.b.x, this.c.x, this.d.x]
    const xy = [this.a.y, this.b.y, this.c.y, this.d.y]
    const t = t2length(length, this.length, (i) => this.getArcLength(xs, xy, i))

    return this.getPoint(xs, xy, t)
  }

  public getTangentAtLength = (length: number) => {
    const xs = [this.a.x, this.b.x, this.c.x, this.d.x]
    const xy = [this.a.y, this.b.y, this.c.y, this.d.y]
    const t = t2length(length, this.length, (i) => this.getArcLength(xs, xy, i))

    return this.normalizeTangent(xs, xy, t)
  }

  public getPropertiesAtLength = (length: number) => {
    const xs = [this.a.x, this.b.x, this.c.x, this.d.x]
    const xy = [this.a.y, this.b.y, this.c.y, this.d.y]
    const t = t2length(length, this.length, (i) => this.getArcLength(xs, xy, i))

    const tangent = this.normalizeTangent(xs, xy, t)
    const point = this.getPoint(xs, xy, t)
    return { x: point.x, y: point.y, tangentX: tangent.x, tangentY: tangent.y }
  }

  public getC = () => {
    return this.c
  }

  public getD = () => {
    return this.d
  }

  public getDetails = (): SegmentDetails => {
    if (this.isCubic) {
      return ['C', this.b.x, this.b.y, this.c.x, this.c.y, this.d.x, this.d.y]
    }
    return ['Q', this.b.x, this.b.y, this.c.x, this.c.y]
  }
}
