import { Point } from "./types";
export declare const cubicPoint: (xs: number[], ys: number[], t: number) => {
    x: number;
    y: number;
};
export declare const cubicDerivative: (xs: number[], ys: number[], t: number) => Point;
export declare const getCubicArcLength: (xs: number[], ys: number[], t: number) => number;
export declare const quadraticPoint: (xs: number[], ys: number[], t: number) => Point;
export declare const getQuadraticArcLength: (xs: number[], ys: number[], t: number) => number;
export declare const quadraticDerivative: (xs: number[], ys: number[], t: number) => {
    x: number;
    y: number;
};
export declare const t2length: (length: number, total_length: number, func: (xs: number[], ys: number[], t: number) => number, xs: number[], ys: number[]) => number;
