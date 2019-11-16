import { Properties, Point, PointProperties } from "./types";

export class LinearPosition implements Properties {
  private x0: number;
  private x1: number;
  private y0: number;
  private y1: number;

  constructor(x0: number, x1: number, y0: number, y1: number) {
    this.x0 = x0;
    this.x1 = x1;
    this.y0 = y0;
    this.y1 = y1;
  }

  public getTotalLength = () => {
    return Math.sqrt(
      Math.pow(this.x0 - this.x1, 2) + Math.pow(this.y0 - this.y1, 2)
    );
  };

  public getPointAtLength = (pos: number): Point => {
    const fraction =
      pos /
      Math.sqrt(
        Math.pow(this.x0 - this.x1, 2) + Math.pow(this.y0 - this.y1, 2)
      );

    const newDeltaX = (this.x1 - this.x0) * fraction;
    const newDeltaY = (this.y1 - this.y0) * fraction;
    return { x: this.x0 + newDeltaX, y: this.y0 + newDeltaY };
  };

  public getTangentAtLength = (_: number): Point => {
    const module = Math.sqrt(
      (this.x1 - this.x0) * (this.x1 - this.x0) +
        (this.y1 - this.y0) * (this.y1 - this.y0)
    );
    return { x: (this.x1 - this.x0) / module, y: (this.y1 - this.y0) / module };
  };

  public getPropertiesAtLength = (pos: number): PointProperties => {
    const point = this.getPointAtLength(pos);
    const tangent = this.getTangentAtLength(pos);
    return { x: point.x, y: point.y, tangentX: tangent.x, tangentY: tangent.y };
  };
}
