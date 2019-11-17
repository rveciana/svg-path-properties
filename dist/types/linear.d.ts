import { Properties, Point, PointProperties } from "./types";
export declare class LinearPosition implements Properties {
    private x0;
    private x1;
    private y0;
    private y1;
    constructor(x0: number, x1: number, y0: number, y1: number);
    getTotalLength: () => number;
    getPointAtLength: (pos: number) => Point;
    getTangentAtLength: (_: number) => Point;
    getPropertiesAtLength: (pos: number) => PointProperties;
}
