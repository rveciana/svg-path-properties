export interface Properties {
    getTotalLength(): number;
    getPointAtLength(pos: number): Point;
    getTangentAtLength(pos: number): Point;
    getPropertiesAtLength(pos: number): PointProperties;
}
export interface Point {
    x: number;
    y: number;
}
export declare type PointArray = [number, number];
export interface PointProperties {
    x: number;
    y: number;
    tangentX: number;
    tangentY: number;
}
export declare type pathOrders = "a" | "c" | "h" | "l" | "m" | "q" | "s" | "t" | "v" | "z";
