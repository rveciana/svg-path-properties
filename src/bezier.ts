import { Properties, Point } from "./types";
import { tValues, cValues, binomialCoefficients } from "./bezier-values";

export class Bezier implements Properties {
  private a: Point;
  private b: Point;
  private c: Point;
  private d: Point;
  private length: number;
  private getArcLength: (xs: number[], ys: number[], t: number) => number;
  private getPoint: (xs: number[], ys: number[], t: number) => Point;
  private getDerivative: (xs: number[], ys: number[], t: number) => Point;
  constructor(
    ax: number,
    ay: number,
    bx: number,
    by: number,
    cx: number,
    cy: number,
    dx: number | undefined,
    dy: number | undefined
  ) {
    this.a = { x: ax, y: ay };
    this.b = { x: bx, y: by };
    this.c = { x: cx, y: cy };

    if (dx !== undefined && dy !== undefined) {
      this.getArcLength = getCubicArcLength;
      this.getPoint = cubicPoint;
      this.getDerivative = cubicDerivative;
      this.d = { x: dx, y: dy };
    } else {
      this.getArcLength = getQuadraticArcLength;
      this.getPoint = quadraticPoint;
      this.getDerivative = quadraticDerivative;
      this.d = { x: 0, y: 0 };
    }
    this.length = this.getArcLength(
      [this.a.x, this.b.x, this.c.x, this.d.x],
      [this.a.y, this.b.y, this.c.y, this.d.y],
      1
    );
  }
  public getTotalLength = () => {
    return this.length;
  };
  public getPointAtLength = (length: number) => {
    const t = t2length(
      length,
      this.length,
      this.getArcLength,
      [this.a.x, this.b.x, this.c.x, this.d.x],
      [this.a.y, this.b.y, this.c.y, this.d.y]
    );

    return this.getPoint(
      [this.a.x, this.b.x, this.c.x, this.d.x],
      [this.a.y, this.b.y, this.c.y, this.d.y],
      t
    );
  };
  public getTangentAtLength = (length: number) => {
    const t = t2length(
      length,
      this.length,
      this.getArcLength,
      [this.a.x, this.b.x, this.c.x, this.d.x],
      [this.a.y, this.b.y, this.c.y, this.d.y]
    );

    const derivative = this.getDerivative(
      [this.a.x, this.b.x, this.c.x, this.d.x],
      [this.a.y, this.b.y, this.c.y, this.d.y],
      t
    );
    const mdl = Math.sqrt(
      derivative.x * derivative.x + derivative.y * derivative.y
    );
    let tangent: Point;
    if (mdl > 0) {
      tangent = { x: derivative.x / mdl, y: derivative.y / mdl };
    } else {
      tangent = { x: 0, y: 0 };
    }
    return tangent;
  };
  public getPropertiesAtLength = (length: number) => {
    const t = t2length(
      length,
      this.length,
      this.getArcLength,
      [this.a.x, this.b.x, this.c.x, this.d.x],
      [this.a.y, this.b.y, this.c.y, this.d.y]
    );

    const derivative = this.getDerivative(
      [this.a.x, this.b.x, this.c.x, this.d.x],
      [this.a.y, this.b.y, this.c.y, this.d.y],
      t
    );
    const mdl = Math.sqrt(
      derivative.x * derivative.x + derivative.y * derivative.y
    );
    let tangent: Point;
    if (mdl > 0) {
      tangent = { x: derivative.x / mdl, y: derivative.y / mdl };
    } else {
      tangent = { x: 0, y: 0 };
    }
    const point = this.getPoint(
      [this.a.x, this.b.x, this.c.x, this.d.x],
      [this.a.y, this.b.y, this.c.y, this.d.y],
      t
    );
    return { x: point.x, y: point.y, tangentX: tangent.x, tangentY: tangent.y };
  };

  public getC = () => {
    return this.c;
  };
  public getD = () => {
    return this.d;
  };
}

const cubicPoint = (xs: number[], ys: number[], t: number) => {
  const x =
    (1 - t) * (1 - t) * (1 - t) * xs[0] +
    3 * (1 - t) * (1 - t) * t * xs[1] +
    3 * (1 - t) * t * t * xs[2] +
    t * t * t * xs[3];
  const y =
    (1 - t) * (1 - t) * (1 - t) * ys[0] +
    3 * (1 - t) * (1 - t) * t * ys[1] +
    3 * (1 - t) * t * t * ys[2] +
    t * t * t * ys[3];

  return { x: x, y: y };
};

const cubicDerivative = (xs: number[], ys: number[], t: number) => {
  const derivative = quadraticPoint(
    [3 * (xs[1] - xs[0]), 3 * (xs[2] - xs[1]), 3 * (xs[3] - xs[2])],
    [3 * (ys[1] - ys[0]), 3 * (ys[2] - ys[1]), 3 * (ys[3] - ys[2])],
    t
  );
  return derivative;
};

const getCubicArcLength = (xs: number[], ys: number[], t: number) => {
  let z: number;
  let sum: number;
  let correctedT: number;

  /*if (xs.length >= tValues.length) {
      throw new Error('too high n bezier');
    }*/

  let n = 20;

  z = t / 2;
  sum = 0;
  for (let i = 0; i < n; i++) {
    correctedT = z * tValues[n][i] + z;
    sum += cValues[n][i] * B(xs, ys, correctedT);
  }
  return z * sum;
};

const quadraticPoint = (xs: number[], ys: number[], t: number): Point => {
  const x = (1 - t) * (1 - t) * xs[0] + 2 * (1 - t) * t * xs[1] + t * t * xs[2];
  const y = (1 - t) * (1 - t) * ys[0] + 2 * (1 - t) * t * ys[1] + t * t * ys[2];
  return { x: x, y: y };
};

const getQuadraticArcLength = (xs: number[], ys: number[], t: number) => {
  if (t === undefined) {
    t = 1;
  }
  const ax = xs[0] - 2 * xs[1] + xs[2];
  const ay = ys[0] - 2 * ys[1] + ys[2];
  const bx = 2 * xs[1] - 2 * xs[0];
  const by = 2 * ys[1] - 2 * ys[0];

  const A = 4 * (ax * ax + ay * ay);
  const B = 4 * (ax * bx + ay * by);
  const C = bx * bx + by * by;

  if (A === 0) {
    return (
      t * Math.sqrt(Math.pow(xs[2] - xs[0], 2) + Math.pow(ys[2] - ys[0], 2))
    );
  }
  const b = B / (2 * A);
  const c = C / A;
  const u = t + b;
  const k = c - b * b;

  const uuk = u * u + k > 0 ? Math.sqrt(u * u + k) : 0;
  const bbk = b * b + k > 0 ? Math.sqrt(b * b + k) : 0;
  const term =
    b + Math.sqrt(b * b + k) !== 0
      ? k * Math.log(Math.abs((u + uuk) / (b + bbk)))
      : 0;

  return (Math.sqrt(A) / 2) * (u * uuk - b * bbk + term);
};

const quadraticDerivative = (xs: number[], ys: number[], t: number) => {
  return {
    x: (1 - t) * 2 * (xs[1] - xs[0]) + t * 2 * (xs[2] - xs[1]),
    y: (1 - t) * 2 * (ys[1] - ys[0]) + t * 2 * (ys[2] - ys[1])
  };
};

function B(xs: number[], ys: number[], t: number) {
  const xbase = getDerivative(1, t, xs);
  const ybase = getDerivative(1, t, ys);
  const combined = xbase * xbase + ybase * ybase;
  return Math.sqrt(combined);
}

/**
 * Compute the curve derivative (hodograph) at t.
 */
const getDerivative = (derivative: number, t: number, vs: number[]): number => {
  // the derivative of any 't'-less function is zero.
  const n = vs.length - 1;
  let _vs;
  let value;

  if (n === 0) {
    return 0;
  }

  // direct values? compute!
  if (derivative === 0) {
    value = 0;
    for (let k = 0; k <= n; k++) {
      value +=
        binomialCoefficients[n][k] *
        Math.pow(1 - t, n - k) *
        Math.pow(t, k) *
        vs[k];
    }
    return value;
  } else {
    // Still some derivative? go down one order, then try
    // for the lower order curve's.
    _vs = new Array(n);
    for (let k = 0; k < n; k++) {
      _vs[k] = n * (vs[k + 1] - vs[k]);
    }
    return getDerivative(derivative - 1, t, _vs);
  }
};

const t2length = (
  length: number,
  total_length: number,
  func: (xs: number[], ys: number[], t: number) => number,
  xs: number[],
  ys: number[]
) => {
  let error = 1;
  let t = length / total_length;
  let step = (length - func(xs, ys, t)) / total_length;

  let numIterations = 0;
  while (error > 0.001) {
    const increasedTLength = func(xs, ys, t + step);
    const decreasedTLength = func(xs, ys, t - step);
    const increasedTError = Math.abs(length - increasedTLength) / total_length;
    const decreasedTError = Math.abs(length - decreasedTLength) / total_length;
    if (increasedTError < error) {
      error = increasedTError;
      t += step;
    } else if (decreasedTError < error) {
      error = decreasedTError;
      t -= step;
    } else {
      step /= 2;
    }

    numIterations++;
    if (numIterations > 500) {
      break;
    }
  }

  return t;
};
