interface Properties {
    getTotalLength(): number;
    getPointAtLength(pos: number): Point;
    getTangentAtLength(pos: number): Point;
    getPropertiesAtLength(pos: number): PointProperties;
}
interface PartProperties {
    start: Point;
    end: Point;
    length: number;
    getPointAtLength(pos: number): Point;
    getTangentAtLength(pos: number): Point;
    getPropertiesAtLength(pos: number): PointProperties;
}
interface Point {
    x: number;
    y: number;
}
interface PointProperties {
    x: number;
    y: number;
    tangentX: number;
    tangentY: number;
}

declare class SVGPathProperties implements Properties {
    private length;
    private partial_lengths;
    private functions;
    private initial_point;
    constructor(source: string | [string, ...Array<number>][]);
    private getPartAtLength;
    getTotalLength: () => number;
    getPointAtLength: (fractionLength: number) => Point;
    getTangentAtLength: (fractionLength: number) => Point;
    getPropertiesAtLength: (fractionLength: number) => PointProperties;
    getParts: () => PartProperties[];
}

declare class _svgPathProperties {
    inst: SVGPathProperties;
    constructor(svgPath: string);
    getTotalLength: () => number;
    getPointAtLength: (fractionLength: number) => Point;
    getTangentAtLength: (fractionLength: number) => Point;
    getPropertiesAtLength: (fractionLength: number) => PointProperties;
    getParts: () => PartProperties[];
}
declare const svgPathProperties: typeof _svgPathProperties & ((val: string) => typeof svgPathProperties);

export { svgPathProperties };
