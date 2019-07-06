declare module "svg-path-properties" {

  /** A two-dimensional point representing a location or tangent on a path. */
  export type Point = {
    x: number;
    y: number;
  }

  /** A two-dimensional point and tangent on a path. */
  export type Properties = {
    x: number;
    y: number;
    tangentX: number;
    tangentY: number;
  }

  /** An SVG path, broken down into individual segments. */
  export type Parts = {
    start: Point;
    end: Point;
    length: number;
    getPointAtLength: (length: number) => Point;
    getTangentAtLength: (length: number) => Point;
    getPropertiesAtLength: (length: number) => Properties;
  }

  /** A Bezier curve. **/
  export type Bezier = {
    ax: number;
    ay: number;
    bx: number;
    by: number;
    cx: number;
    cy: number;
    dx: number;
    dy: number;
  }

  /** SVG path command prefixes. */
  export type CommandType = "a" | "c" | "h" | "l" | "m" | "q" | "s" | "t" | "v" | "z";

  /** An SVG path, parsed into individual commands */
  export type ParsedPathCommand = [CommandType, ...number[]];

  /** Provides information about an SVG path. */
  export type SvgPathProperties = {
    getTotalLength: (length: number) => number;
    getPointAtLength: (length: number) => Point;
    getTangentAtLength: (length: number) => Point;
    getPropertiesAtLength: (length: number) => Properties;
    getParts: () => Parts;
  }

  /** Creates a {@link Bezier} instance. */
  export function Bezier(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, dx: number, dy: number): Bezier;

  /** Converts an SVG path string into a parsed set of command objects that are easy to work with. */
  export function parse(path: string): ParsedPathCommand[];

  /** Get information about an SVG path. */
  export function svgPathProperties(path: string): SvgPathProperties;
}
