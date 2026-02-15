import SVGPathProperties from './svg-path-properties.ts'

/**
 * SVG Path Properties - Main class for calculating SVG path properties.
 *
 * This class provides methods to calculate the total length of an SVG path,
 * get points and tangents at specific positions, and split paths into parts.
 * Works with Canvas elements and in Node.js environments where native browser
 * path APIs are not available.
 *
 * @example
 * ```typescript
 * import { svgPathProperties } from 'svg-path-properties';
 *
 * const properties = new svgPathProperties("M0,100 Q50,-50 100,100 T200,100");
 * const length = properties.getTotalLength(); // Get total path length
 * const point = properties.getPointAtLength(50); // Get point at length 50
 * ```
 */
// https://stackoverflow.com/a/48362715/1086633
class _svgPathProperties {
  inst: SVGPathProperties

  /**
   * Creates a new SVGPathProperties instance.
   *
   * @param svgPath - An SVG path data string (e.g., "M0,0 L100,100")
   *
   * @example
   * ```typescript
   * const properties = new svgPathProperties("M0,0 L100,100");
   * ```
   */
  constructor (svgPath: string) {
    this.inst = new SVGPathProperties(svgPath)
    if (!(this instanceof svgPathProperties)) {
      // eslint-disable-next-line new-cap
      return new svgPathProperties(svgPath)
    }
  }

  /**
   * Calculates the total length of the SVG path.
   *
   * @returns The total length of the path in the same units as the path coordinates
   *
   * @example
   * ```typescript
   * const properties = new svgPathProperties("M0,0 L100,100");
   * const length = properties.getTotalLength(); // Returns ~141.42
   * ```
   */
  public getTotalLength = () => this.inst.getTotalLength()

  /**
   * Returns the point (x,y coordinates) at a given length along the path.
   *
   * @param fractionLength - The distance along the path (0 to total length)
   * @returns An object with x and y coordinates
   *
   * @example
   * ```typescript
   * const properties = new svgPathProperties("M0,0 L100,100");
   * const point = properties.getPointAtLength(50);
   * console.log(point); // { x: 35.36, y: 35.36 }
   * ```
   */
  public getPointAtLength = (fractionLength: number) => this.inst.getPointAtLength(fractionLength)

  /**
   * Returns the normalized tangent vector at a given length along the path.
   * The tangent indicates the direction of the path at that point.
   *
   * @param fractionLength - The distance along the path (0 to total length)
   * @returns An object with x and y components of the normalized tangent vector
   *
   * @example
   * ```typescript
   * const properties = new svgPathProperties("M0,0 L100,100");
   * const tangent = properties.getTangentAtLength(50);
   * console.log(tangent); // { x: 0.707, y: 0.707 }
   * ```
   */
  public getTangentAtLength = (fractionLength: number) =>
    this.inst.getTangentAtLength(fractionLength)

  /**
   * Returns both the point and tangent at a given length along the path.
   * This is more efficient than calling getPointAtLength and getTangentAtLength separately.
   *
   * @param fractionLength - The distance along the path (0 to total length)
   * @returns An object with x, y coordinates and tangentX, tangentY components
   *
   * @example
   * ```typescript
   * const properties = new svgPathProperties("M0,0 L100,100");
   * const props = properties.getPropertiesAtLength(50);
   * console.log(props); // { x: 35.36, y: 35.36, tangentX: 0.707, tangentY: 0.707 }
   * ```
   */
  public getPropertiesAtLength = (fractionLength: number) =>
    this.inst.getPropertiesAtLength(fractionLength)

  /**
   * Splits the path into its individual parts (segments).
   * Each part represents a continuous path element (line, curve, arc, etc.).
   *
   * @returns An array of PartProperties objects, each representing one segment
   *
   * @example
   * ```typescript
   * const properties = new svgPathProperties("M0,0 L100,0 L100,100");
   * const parts = properties.getParts();
   * console.log(parts.length); // 2 (two line segments)
   * console.log(parts[0].length); // 100 (length of first segment)
   * ```
   */
  public getParts = () => this.inst.getParts()
}

export const svgPathProperties = _svgPathProperties as typeof _svgPathProperties &
  ((val: string) => typeof svgPathProperties)
