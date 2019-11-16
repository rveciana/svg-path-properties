import parse from "./parse";
import { PointArray, Properties } from "./types";
import { LinearPosition } from "./linear";
import { Arc } from "./arc";

export default class SVGPathProperties implements Properties {
  private length: number = 0;
  private partial_lengths = [];
  private functions: (null | Properties)[] = [];
  constructor(string: string) {
    const parsed = parse(string);
    let cur: PointArray = [0, 0];
    let prev_point: PointArray = [0, 0];
    let curve;
    let ringStart: PointArray = [0, 0];
    for (let i = 0; i < parsed.length; i++) {
      //moveTo
      if (parsed[i][0] === "M") {
        cur = [parsed[i][1], parsed[i][2]];
        ringStart = [cur[0], cur[1]];
        this.functions.push(null);
      } else if (parsed[i][0] === "m") {
        cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[1]];
        ringStart = [cur[0], cur[1]];
        this.functions.push(null);
        //lineTo
      } else if (parsed[i][0] === "L") {
        this.length += Math.sqrt(
          Math.pow(cur[0] - parsed[i][1], 2) +
            Math.pow(cur[1] - parsed[i][2], 2)
        );
        this.functions.push(
          new LinearPosition(cur[0], parsed[i][1], cur[1], parsed[i][2])
        );
        cur = [parsed[i][1], parsed[i][2]];
      } else if (parsed[i][0] === "l") {
        this.length += Math.sqrt(
          Math.pow(parsed[i][1], 2) + Math.pow(parsed[i][2], 2)
        );
        this.functions.push(
          new LinearPosition(
            cur[0],
            parsed[i][1] + cur[0],
            cur[1],
            parsed[i][2] + cur[1]
          )
        );
        cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[1]];
      } else if (parsed[i][0] === "H") {
        this.length += Math.abs(cur[0] - parsed[i][1]);
        this.functions.push(
          new LinearPosition(cur[0], parsed[i][1], cur[1], cur[1])
        );
        cur[0] = parsed[i][1];
      } else if (parsed[i][0] === "h") {
        this.length += Math.abs(parsed[i][1]);
        this.functions.push(
          new LinearPosition(cur[0], cur[0] + parsed[i][1], cur[1], cur[1])
        );
        cur[0] = parsed[i][1] + cur[0];
      } else if (parsed[i][0] === "V") {
        this.length += Math.abs(cur[1] - parsed[i][1]);
        this.functions.push(
          new LinearPosition(cur[0], cur[0], cur[1], parsed[i][1])
        );
        cur[1] = parsed[i][1];
      } else if (parsed[i][0] === "v") {
        this.length += Math.abs(parsed[i][1]);
        this.functions.push(
          new LinearPosition(cur[0], cur[0], cur[1], cur[1] + parsed[i][1])
        );
        cur[1] = parsed[i][1] + cur[1];
        //Close path
      } else if (parsed[i][0] === "z" || parsed[i][0] === "Z") {
        this.length += Math.sqrt(
          Math.pow(ringStart[0] - cur[0], 2) +
            Math.pow(ringStart[1] - cur[1], 2)
        );
        this.functions.push(
          new LinearPosition(cur[0], ringStart[0], cur[1], ringStart[1])
        );
        cur = [ringStart[0], ringStart[1]];
      } else if (parsed[i][0] === "A") {
        curve = new Arc(
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

        this.length += curve.getTotalLength();
        cur = [parsed[i][6], parsed[i][7]];
        this.functions.push(curve);
      } else if (parsed[i][0] === "a") {
        curve = new Arc(
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

        this.length += curve.getTotalLength();
        cur = [cur[0] + parsed[i][6], cur[1] + parsed[i][7]];
        this.functions.push(curve);
      }
    }
  }

  private getPartAtLength = (fractionLength: number) => {
    if (fractionLength < 0) {
      fractionLength = 0;
    } else if (fractionLength > length) {
      fractionLength = length;
    }

    let i = this.partial_lengths.length - 1;

    while (
      this.partial_lengths[i] >= fractionLength &&
      this.partial_lengths[i] > 0
    ) {
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
    }
    throw new Error("Wrong function at this part.");
  };

  public getTangentAtLength = (fractionLength: number) => {
    const fractionPart = this.getPartAtLength(fractionLength);
    const functionAtPart = this.functions[fractionPart.i];
    if (functionAtPart) {
      return functionAtPart.getTangentAtLength(fractionPart.fraction);
    }
    throw new Error("Wrong function at this part.");
  };

  public getPropertiesAtLength = (fractionLength: number) => {
    const fractionPart = this.getPartAtLength(fractionLength);
    const functionAtPart = this.functions[fractionPart.i];
    if (functionAtPart) {
      return functionAtPart.getPropertiesAtLength(fractionPart.fraction);
    }
    throw new Error("Wrong function at this part.");
  };
}
