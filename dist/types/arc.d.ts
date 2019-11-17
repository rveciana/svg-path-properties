import { Properties, Point, PointProperties } from "./types";
export declare class Arc implements Properties {
    private x0;
    private y0;
    private rx;
    private ry;
    private xAxisRotate;
    private LargeArcFlag;
    private SweepFlag;
    private x1;
    private y1;
    private length;
    constructor(x0: number, y0: number, rx: number, ry: number, xAxisRotate: number, LargeArcFlag: boolean, SweepFlag: boolean, x1: number, y1: number);
    getTotalLength: () => number;
    getPointAtLength: (fractionLength: number) => Point;
    getTangentAtLength: (fractionLength: number) => Point;
    getPropertiesAtLength: (fractionLength: number) => PointProperties;
}
