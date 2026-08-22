# svg-path-properties

Pure Javascript alternative to getPointAtLength(t) and getTotalLength() functions. Works with Canvas objects and when Node

JavaScript can access to path elements properties in a browser, such as its length and the point at a given length. Unfortunately, this can't be achieved using a Canvas element or when working with node. This library can be used to replace this need. It has no dependencies on other JavaScript libraries.

## INSTALL

To use with npm, just type

    npm install svg-path-properties

The package is lightweight with no dependencies (~20KB gzipped).

You can use it in the browser directly by including _svg-path-properties.min.js_ from the dist directory

    <script src="svg-path-properties.min.js"></script>

## USAGE

The available methods are:

    const path = require("svg-path-properties");
    const properties = new path.svgPathProperties("M0,100 Q50,-50 100,100 T200,100");
    const length = properties.getTotalLength();
    const point = properties.getPointAtLength(200);
    const tangent = properties.getTangentAtLength(200);
    const allProperties = properties.getPropertiesAtLength(200);
    const parts = properties.getParts();

### `getTotalLength()`

Returns the total length of the path.

### `getPointAtLength(pos)`

Returns `{ x, y }` — the coordinates at the given distance along the path.

### `getTangentAtLength(pos)`

Returns `{ x, y }` — the normalized tangent vector at the given distance.

### `getPropertiesAtLength(pos)`

Returns `{ x, y, tangentX, tangentY }` — point and tangent combined.

### `getParts()`

Returns an array of segment objects, one per path command (move commands are skipped). Each object has:

| Property | Description |
|---|---|
| `start` | `{ x, y }` — start point of the segment |
| `end` | `{ x, y }` — end point of the segment |
| `length` | Arc length of the segment |
| `getPointAtLength(pos)` | Point at local distance within the segment |
| `getTangentAtLength(pos)` | Tangent at local distance within the segment |
| `getPropertiesAtLength(pos)` | Point and tangent combined |
| `details` | Raw segment parameters (see below) |

#### `details` — segment parameters

Each segment's `details` is a tuple in SVG notation with the **uppercase command letter** and all coordinates in **absolute form**:

| Tuple | Segment type |
|---|---|
| `['L', x, y]` | Line to |
| `['H', x]` | Horizontal line to |
| `['V', y]` | Vertical line to |
| `['Z']` | Close path |
| `['C', cp1x, cp1y, cp2x, cp2y, x, y]` | Cubic Bézier |
| `['Q', cpx, cpy, x, y]` | Quadratic Bézier |
| `['A', rx, ry, xRotation, largeArcFlag, sweepFlag, x, y]` | Elliptical arc (`largeArcFlag` and `sweepFlag` are `0` or `1`) |

Example — parametric interpolation along a cubic Bézier at evenly-spaced `t` values instead of arc-length:

    import { svgPathProperties } from "svg-path-properties";

    const parts = new svgPathProperties("M0,0 C10,20 30,40 50,0").getParts();
    for (const part of parts) {
      if (part.details[0] === 'C') {
        const [, cp1x, cp1y, cp2x, cp2y, x, y] = part.details;
        // evaluate cubic Bézier at t=0.5
        const t = 0.5;
        const px = Math.pow(1-t,3)*part.start.x + 3*Math.pow(1-t,2)*t*cp1x + 3*(1-t)*t*t*cp2x + t*t*t*x;
        const py = Math.pow(1-t,3)*part.start.y + 3*Math.pow(1-t,2)*t*cp1y + 3*(1-t)*t*t*cp2y + t*t*t*y;
      }
    }

### Node

    const path = require("svg-path-properties");
    const properties = new path.svgPathProperties("M0,100 Q50,-50 100,100 T200,100");

### Including it from an import

    import { svgPathProperties } from "svg-path-properties";
    const properties = new svgPathProperties("M0,100 Q50,-50 100,100 T200,100");

### Including the script in the browser

Once the _script_ tag has been included,

    const properties = new svgPathProperties.svgPathProperties("M0,100 Q50,-50 100,100 T200,100");

### Using _new_

Since _svgPathProperties_ is a class, using _new_ is the correct way to initilize it. For backwards compatibility reasons, the object can be get without it:

    const properties = svgPathProperties("M0,100 Q50,-50 100,100 T200,100");

## Some usage examples

- [Drawing an animated path](http://bl.ocks.org/rveciana/209fa7efeb01f05fa4a544a76ac8ed91)
- [Label positioning](http://bl.ocks.org/rveciana/bef48021e38a77a520109d2088bff9eb)
- [Drawing stramlines arrows](http://bl.ocks.org/rveciana/edb1dd43f3edc5d16ecaf4839c032dec)
- [Using it to get a length when in node instead of the browser](https://github.com/veltman/flubber/blob/master/src/svg.js), as in the [Flubber library](https://github.com/veltman/flubber)
- [SVG animations in React Native](https://bitbucket.org/ingenuityph/react-native-svg-animations/src/master/)

## Typescript

The TypeScript declaration file is available too, since version 0.5.0. From version 1.0.0, the whole library has been rewritten using TypeScript, and the types are auto-generated.

All public APIs are fully documented with JSDoc comments for better IDE support.

## CREDITS

Some parts of the code are taken from other libraries or questions at StackOverflow:

For Bézier curves:

- [example in bl.ocks.org](http://bl.ocks.org/hnakamur/e7efd0602bfc15f66fc5), [gist code](https://gist.github.com/tunght13488/6744e77c242cc7a94859)
- [Stack overflow question](http://stackoverflow.com/questions/11854907/calculate-the-length-of-a-segment-of-a-quadratic-bezier)
- [A Primer on Bézier Curves](http://pomax.github.io/bezierinfo)
- [Arc elements calculation](https://github.com/MadLittleMods/svg-curve-lib/tree/f07d6008a673816f4cb74a3269164b430c3a95cb)

- [path parsing](https://github.com/jkroso/parse-svg-path)
