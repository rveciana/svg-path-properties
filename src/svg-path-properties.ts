import parse from "./parse";
import { PointArray, Properties, PartProperties, Point } from "./types";
import { LinearPosition } from "./linear";
import { Arc } from "./arc";
import { Bezier } from "./bezier";

export default class SVGPathProperties implements Properties {
  private length: number = 0;
  private partial_lengths: number[] = [];
  private functions: (null | Properties)[] = [];
  private initial_point: null | Point = null;
  constructor(string: string) {
    const parsed = parse(string);
    let cur: PointArray = [0, 0];
    let prev_point: PointArray = [0, 0];
    let curve: Bezier | undefined;
    let ringStart: PointArray = [0, 0];
    for (let i = 0; i < parsed.length; i++) {
      //moveTo
      if (parsed[i][0] === "M") {
        cur = [parsed[i][1], parsed[i][2]];
        ringStart = [cur[0], cur[1]];
        this.functions.push(null);
        if (i === 0) {
          this.initial_point = { x: parsed[i][1], y: parsed[i][2] };
        }
      } else if (parsed[i][0] === "m") {
        cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[1]];
        ringStart = [cur[0], cur[1]];
        this.functions.push(null);
        //lineTo
      } else if (parsed[i][0] === "L") {
        this.length += Math.sqrt(
          Math.pow(cur[0] - parsed[i][1], 2) + Math.pow(cur[1] - parsed[i][2], 2)
        );
        this.functions.push(new LinearPosition(cur[0], parsed[i][1], cur[1], parsed[i][2]));
        cur = [parsed[i][1], parsed[i][2]];
      } else if (parsed[i][0] === "l") {
        this.length += Math.sqrt(Math.pow(parsed[i][1], 2) + Math.pow(parsed[i][2], 2));
        this.functions.push(
          new LinearPosition(cur[0], parsed[i][1] + cur[0], cur[1], parsed[i][2] + cur[1])
        );
        cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[1]];
      } else if (parsed[i][0] === "H") {
        this.length += Math.abs(cur[0] - parsed[i][1]);
        this.functions.push(new LinearPosition(cur[0], parsed[i][1], cur[1], cur[1]));
        cur[0] = parsed[i][1];
      } else if (parsed[i][0] === "h") {
        this.length += Math.abs(parsed[i][1]);
        this.functions.push(new LinearPosition(cur[0], cur[0] + parsed[i][1], cur[1], cur[1]));
        cur[0] = parsed[i][1] + cur[0];
      } else if (parsed[i][0] === "V") {
        this.length += Math.abs(cur[1] - parsed[i][1]);
        this.functions.push(new LinearPosition(cur[0], cur[0], cur[1], parsed[i][1]));
        cur[1] = parsed[i][1];
      } else if (parsed[i][0] === "v") {
        this.length += Math.abs(parsed[i][1]);
        this.functions.push(new LinearPosition(cur[0], cur[0], cur[1], cur[1] + parsed[i][1]));
        cur[1] = parsed[i][1] + cur[1];
        //Close path
      } else if (parsed[i][0] === "z" || parsed[i][0] === "Z") {
        this.length += Math.sqrt(
          Math.pow(ringStart[0] - cur[0], 2) + Math.pow(ringStart[1] - cur[1], 2)
        );
        this.functions.push(new LinearPosition(cur[0], ringStart[0], cur[1], ringStart[1]));
        cur = [ringStart[0], ringStart[1]];
        //Cubic Bezier curves
      } else if (parsed[i][0] === "C") {
        curve = new Bezier(
          cur[0],
          cur[1],
          parsed[i][1],
          parsed[i][2],
          parsed[i][3],
          parsed[i][4],
          parsed[i][5],
          parsed[i][6]
        );
        this.length += curve.getTotalLength();
        cur = [parsed[i][5], parsed[i][6]];
        this.functions.push(curve);
      } else if (parsed[i][0] === "c") {
        curve = new Bezier(
          cur[0],
          cur[1],
          cur[0] + parsed[i][1],
          cur[1] + parsed[i][2],
          cur[0] + parsed[i][3],
          cur[1] + parsed[i][4],
          cur[0] + parsed[i][5],
          cur[1] + parsed[i][6]
        );
        if (curve.getTotalLength() > 0) {
          this.length += curve.getTotalLength();
          this.functions.push(curve);
          cur = [parsed[i][5] + cur[0], parsed[i][6] + cur[1]];
        } else {
          this.functions.push(new LinearPosition(cur[0], cur[0], cur[1], cur[1]));
        }
      } else if (parsed[i][0] === "S") {
        if (i > 0 && ["C", "c", "S", "s"].indexOf(parsed[i - 1][0]) > -1) {
          if (curve) {
            const c = curve.getC();
            curve = new Bezier(
              cur[0],
              cur[1],
              2 * cur[0] - c.x,
              2 * cur[1] - c.y,
              parsed[i][1],
              parsed[i][2],
              parsed[i][3],
              parsed[i][4]
            );
          }
        } else {
          curve = new Bezier(
            cur[0],
            cur[1],
            cur[0],
            cur[1],
            parsed[i][1],
            parsed[i][2],
            parsed[i][3],
            parsed[i][4]
          );
        }
        if (curve) {
          this.length += curve.getTotalLength();
          cur = [parsed[i][3], parsed[i][4]];
          this.functions.push(curve);
        }
      } else if (parsed[i][0] === "s") {
        //240 225
        if (i > 0 && ["C", "c", "S", "s"].indexOf(parsed[i - 1][0]) > -1) {
          if (curve) {
            const c = curve.getC();
            const d = curve.getD();
            curve = new Bezier(
              cur[0],
              cur[1],
              cur[0] + d.x - c.x,
              cur[1] + d.y - c.y,
              cur[0] + parsed[i][1],
              cur[1] + parsed[i][2],
              cur[0] + parsed[i][3],
              cur[1] + parsed[i][4]
            );
          }
        } else {
          curve = new Bezier(
            cur[0],
            cur[1],
            cur[0],
            cur[1],
            cur[0] + parsed[i][1],
            cur[1] + parsed[i][2],
            cur[0] + parsed[i][3],
            cur[1] + parsed[i][4]
          );
        }
        if (curve) {
          this.length += curve.getTotalLength();
          cur = [parsed[i][3] + cur[0], parsed[i][4] + cur[1]];
          this.functions.push(curve);
        }
      }
      //Quadratic Bezier curves
      else if (parsed[i][0] === "Q") {
        if (cur[0] == parsed[i][1] && cur[1] == parsed[i][2]) {
          let linearCurve = new LinearPosition(
            parsed[i][1],
            parsed[i][3],
            parsed[i][2],
            parsed[i][4]
          );
          this.length += linearCurve.getTotalLength();
          this.functions.push(linearCurve);
        } else {
          curve = new Bezier(
            cur[0],
            cur[1],
            parsed[i][1],
            parsed[i][2],
            parsed[i][3],
            parsed[i][4],
            undefined,
            undefined
          );
          this.length += curve.getTotalLength();
          this.functions.push(curve);
        }

        cur = [parsed[i][3], parsed[i][4]];
        prev_point = [parsed[i][1], parsed[i][2]];
      } else if (parsed[i][0] === "q") {
        if (!(parsed[i][1] == 0 && parsed[i][2] == 0)) {
          curve = new Bezier(
            cur[0],
            cur[1],
            cur[0] + parsed[i][1],
            cur[1] + parsed[i][2],
            cur[0] + parsed[i][3],
            cur[1] + parsed[i][4],
            undefined,
            undefined
          );
          this.length += curve.getTotalLength();
          this.functions.push(curve);
        } else {
          let linearCurve = new LinearPosition(
            cur[0] + parsed[i][1],
            cur[0] + parsed[i][3],
            cur[1] + parsed[i][2],
            cur[1] + parsed[i][4]
          );
          this.length += linearCurve.getTotalLength();
          this.functions.push(linearCurve);
        }

        prev_point = [cur[0] + parsed[i][1], cur[1] + parsed[i][2]];
        cur = [parsed[i][3] + cur[0], parsed[i][4] + cur[1]];
      } else if (parsed[i][0] === "T") {
        if (i > 0 && ["Q", "q", "T", "t"].indexOf(parsed[i - 1][0]) > -1) {
          curve = new Bezier(
            cur[0],
            cur[1],
            2 * cur[0] - prev_point[0],
            2 * cur[1] - prev_point[1],
            parsed[i][1],
            parsed[i][2],
            undefined,
            undefined
          );
          this.functions.push(curve);
          this.length += curve.getTotalLength();
        } else {
          let linearCurve = new LinearPosition(cur[0], parsed[i][1], cur[1], parsed[i][2]);
          this.functions.push(linearCurve);
          this.length += linearCurve.getTotalLength();
        }

        prev_point = [2 * cur[0] - prev_point[0], 2 * cur[1] - prev_point[1]];
        cur = [parsed[i][1], parsed[i][2]];
      } else if (parsed[i][0] === "t") {
        if (i > 0 && ["Q", "q", "T", "t"].indexOf(parsed[i - 1][0]) > -1) {
          curve = new Bezier(
            cur[0],
            cur[1],
            2 * cur[0] - prev_point[0],
            2 * cur[1] - prev_point[1],
            cur[0] + parsed[i][1],
            cur[1] + parsed[i][2],
            undefined,
            undefined
          );
          this.length += curve.getTotalLength();
          this.functions.push(curve);
        } else {
          let linearCurve = new LinearPosition(
            cur[0],
            cur[0] + parsed[i][1],
            cur[1],
            cur[1] + parsed[i][2]
          );
          this.length += linearCurve.getTotalLength();
          this.functions.push(linearCurve);
        }

        prev_point = [2 * cur[0] - prev_point[0], 2 * cur[1] - prev_point[1]];
        cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[0]];
      } else if (parsed[i][0] === "A") {
        const arcCurve = new Arc(
          cur[0],
          cur[1],
          parsed[i][1],
          parsed[i][2],
          parsed[i][3],
          parsed[i][4] === 1,
          parsed[i][5] === 1,
          parsed[i][6],
          parsed[i][7]
        );

        this.length += arcCurve.getTotalLength();
        cur = [parsed[i][6], parsed[i][7]];
        this.functions.push(arcCurve);
      } else if (parsed[i][0] === "a") {
        const arcCurve = new Arc(
          cur[0],
          cur[1],
          parsed[i][1],
          parsed[i][2],
          parsed[i][3],
          parsed[i][4] === 1,
          parsed[i][5] === 1,
          cur[0] + parsed[i][6],
          cur[1] + parsed[i][7]
        );

        this.length += arcCurve.getTotalLength();
        cur = [cur[0] + parsed[i][6], cur[1] + parsed[i][7]];
        this.functions.push(arcCurve);
      }
      this.partial_lengths.push(this.length);
    }
  }

  private getPartAtLength = (fractionLength: number) => {
    if (fractionLength < 0) {
      fractionLength = 0;
    } else if (fractionLength > this.length) {
      fractionLength = this.length;
    }

    let i = this.partial_lengths.length - 1;

    while (this.partial_lengths[i] >= fractionLength && i > 0) {
      i--;
    }
    i++;
    return { fraction: fractionLength - this.partial_lengths[i - 1], i: i };
  };

  public getTotalLength = () => {
    return this.length;
  };

  public getPointAtLength = (fractionLength: number) => {
    const fractionPart = this.getPartAtLength(fractionLength);
    const functionAtPart = this.functions[fractionPart.i];
    if (functionAtPart) {
      return functionAtPart.getPointAtLength(fractionPart.fraction);
    } else if (this.initial_point) {
      return this.initial_point;
    }
    throw new Error("Wrong function at this part.");
  };

  public getTangentAtLength = (fractionLength: number) => {
    const fractionPart = this.getPartAtLength(fractionLength);
    const functionAtPart = this.functions[fractionPart.i];
    if (functionAtPart) {
      return functionAtPart.getTangentAtLength(fractionPart.fraction);
    } else if (this.initial_point) {
      return { x: 0, y: 0 };
    }
    throw new Error("Wrong function at this part.");
  };

  public getPropertiesAtLength = (fractionLength: number) => {
    const fractionPart = this.getPartAtLength(fractionLength);
    const functionAtPart = this.functions[fractionPart.i];
    if (functionAtPart) {
      return functionAtPart.getPropertiesAtLength(fractionPart.fraction);
    } else if (this.initial_point) {
      return { x: this.initial_point.x, y: this.initial_point.y, tangentX: 0, tangentY: 0 };
    }
    throw new Error("Wrong function at this part.");
  };

  public getParts = () => {
    const parts = [];
    for (var i = 0; i < this.functions.length; i++) {
      if (this.functions[i] !== null) {
        this.functions[i] = this.functions[i] as Properties;
        const properties: PartProperties = {
          start: this.functions[i]!.getPointAtLength(0),
          end: this.functions[i]!.getPointAtLength(
            this.partial_lengths[i] - this.partial_lengths[i - 1]
          ),
          length: this.partial_lengths[i] - this.partial_lengths[i - 1],
          getPointAtLength: this.functions[i]!.getPointAtLength,
          getTangentAtLength: this.functions[i]!.getTangentAtLength,
          getPropertiesAtLength: this.functions[i]!.getPropertiesAtLength
        };
        parts.push(properties);
      }
    }

    return parts;
  };
}
