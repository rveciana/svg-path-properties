import { SegmentProperties, Point, PointProperties, SegmentDetails } from './types.ts'

export type LinearCommand = 'L' | 'H' | 'V' | 'Z'

export class LinearPosition implements SegmentProperties {
  private x0: number
  private x1: number
  private y0: number
  private y1: number
  private command: LinearCommand

  constructor (x0: number, x1: number, y0: number, y1: number, command: LinearCommand = 'L') {
    this.x0 = x0
    this.x1 = x1
    this.y0 = y0
    this.y1 = y1
    this.command = command
  }

  public getTotalLength = () => {
    return Math.hypot(this.x1 - this.x0, this.y1 - this.y0)
  }

  public getPointAtLength = (pos: number): Point => {
    const length = Math.hypot(this.x1 - this.x0, this.y1 - this.y0)
    let fraction = pos / length

    fraction = Number.isNaN(fraction) ? 1 : fraction
    const newDeltaX = (this.x1 - this.x0) * fraction
    const newDeltaY = (this.y1 - this.y0) * fraction

    return { x: this.x0 + newDeltaX, y: this.y0 + newDeltaY }
  }

  public getTangentAtLength = (_: number): Point => {
    const module = Math.hypot(this.x1 - this.x0, this.y1 - this.y0)
    return {
      x: (this.x1 - this.x0) / module,
      y: (this.y1 - this.y0) / module
    }
  }

  public getPropertiesAtLength = (pos: number): PointProperties => {
    const point = this.getPointAtLength(pos)
    const tangent = this.getTangentAtLength(pos)
    return { x: point.x, y: point.y, tangentX: tangent.x, tangentY: tangent.y }
  }

  public getDetails = (): SegmentDetails => {
    switch (this.command) {
      case 'H': return ['H', this.x1]
      case 'V': return ['V', this.y1]
      case 'Z': return ['Z']
      default: return ['L', this.x1, this.y1]
    }
  }
}
