import { Properties } from "./types";
export default class SVGPathProperties implements Properties {
    private length;
    private partial_lengths;
    private functions;
    constructor(string: string);
    private getPartAtLength;
    getTotalLength: () => number;
    getPointAtLength: (fractionLength: number) => import("./types").Point;
    getTangentAtLength: (fractionLength: number) => import("./types").Point;
    getPropertiesAtLength: (fractionLength: number) => import("./types").PointProperties;
}
