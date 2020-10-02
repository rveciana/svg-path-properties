import SVGPathProperties from "./svg-path-properties";
declare class _svgPathProperties {
    inst: SVGPathProperties;
    constructor(svgPath: string);
    getTotalLength: () => number;
    getPointAtLength: (fractionLength: number) => import("./types").Point;
    getTangentAtLength: (fractionLength: number) => import("./types").Point;
    getPropertiesAtLength: (fractionLength: number) => import("./types").PointProperties;
    getParts: () => import("./types").PartProperties[];
}
declare type svgPathProperties = _svgPathProperties;
export declare const svgPathProperties: typeof _svgPathProperties & ((val: string) => svgPathProperties);
export {};
