import { Properties, PartProperties, Point } from "./types";
export default class SVGPathProperties implements Properties {
    private length;
    private partial_lengths;
    private functions;
    private initial_point;
    constructor(string: string);
    private getPartAtLength;
    getTotalLength: () => number;
    getPointAtLength: (fractionLength: number) => Point;
    getTangentAtLength: (fractionLength: number) => Point;
    getPropertiesAtLength: (fractionLength: number) => import("./types").PointProperties;
    getParts: () => PartProperties[];
}
