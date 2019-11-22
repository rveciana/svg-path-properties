import SVGPathProperties from "./svg-path-properties";

//https://stackoverflow.com/a/48362715/1086633
class _svgPathProperties {
  inst: SVGPathProperties;

  constructor(svgPath: string) {
    this.inst = new SVGPathProperties(svgPath);
    if (!(this instanceof svgPathProperties)) {
      return new svgPathProperties(svgPath);
    }
  }

  public getTotalLength = () => this.inst.getTotalLength();
  public getPointAtLength = (fractionLength: number) =>
    this.inst.getPointAtLength(fractionLength);
  public getTangentAtLength = (fractionLength: number) =>
    this.inst.getTangentAtLength(fractionLength);
  public getPropertiesAtLength = (fractionLength: number) =>
    this.inst.getPropertiesAtLength(fractionLength);
  public getParts = () => this.inst.getParts();
}
type svgPathProperties = _svgPathProperties;
export const svgPathProperties = _svgPathProperties as typeof _svgPathProperties &
  ((val: string) => svgPathProperties);
