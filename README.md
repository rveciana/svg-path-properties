[![Build Status](https://travis-ci.org/rveciana/svg-path-properties.svg?branch=master)](https://travis-ci.org/rveciana/svg-path-properties)
[![Coverage Status](https://coveralls.io/repos/github/rveciana/svg-path-properties/badge.svg?branch=master)](https://coveralls.io/github/rveciana/svg-path-properties?branch=master)

# svg-path-properties

Pure Javascript alternative to getPointAtLength(t) and getTotalLength() functions. Works with Canvas objects and when Node

JavaScript can access to path elements properties in a browser, such as its length and the point at a given length. Unfortunately, this can't be achieved using a Canvas element or when working with node. This library can be used to replace this need. It has no dependencies on other JavaScript libraries.

# INSTALL

To use with npm, just type

    npm install svg-path-properties

You can use it int he browser directly by including _svg-path-properties.min.js_ from the dist directory

    <script src="svg-path-properties.min.js"></script>

# USAGE

The available methods are:

    const path = require("svg-path-properties");
    const properties = new path.svgPathProperties("M0,100 Q50,-50 100,100 T200,100");
    const length = properties.getTotalLength();
    const point = properties.getPointAtLength(200);
    const tangent = properties.getTangentAtLength(200);
    const allProperties = properties.getPropertiesAtLength(200);
    const parts = properties.getParts();

## Node:

    const path = require("svg-path-properties");
    const properties = new path.svgPathProperties("M0,100 Q50,-50 100,100 T200,100");

## Including it from an import:

    import { svgPathProperties } from "svg-path-properties";
    const properties = new svgPathProperties("M0,100 Q50,-50 100,100 T200,100");

## Including the script in the browser

Once the _script_ tag has been included,

    const properties = new svgPathProperties.svgPathProperties("M0,100 Q50,-50 100,100 T200,100");

## Using _new_

Since _svgPathProperties_ is a class, using _new_ is the correct way to initilize it. For backwards compatibility reasons, the object can be get without it:

    const properties = svgPathProperties("M0,100 Q50,-50 100,100 T200,100");

# Some usage examples

- [Drawing an animated path](http://bl.ocks.org/rveciana/209fa7efeb01f05fa4a544a76ac8ed91)
- [Label positioning](http://bl.ocks.org/rveciana/bef48021e38a77a520109d2088bff9eb)
- [Drawing stramlines arrows](http://bl.ocks.org/rveciana/edb1dd43f3edc5d16ecaf4839c032dec)
- [Using it to get a length when in node instead of the browser](https://github.com/veltman/flubber/blob/master/src/svg.js), as in the [Flubber library](https://github.com/veltman/flubber)
- [SVG animations in React Native](https://bitbucket.org/ingenuityph/react-native-svg-animations/src/master/)

# Typescript

The TypeScript declaration file is available too, since version 0.5.0 From version 1.0.0, the whole library has been rewritten using TypeScript, and the types are auto-generated.

# CREDITS

Some parts of the code are taken from other libraries or questions at StackOverflow:

For Bézier curves:

- http://bl.ocks.org/hnakamur/e7efd0602bfc15f66fc5, https://gist.github.com/tunght13488/6744e77c242cc7a94859
- http://stackoverflow.com/questions/11854907/calculate-the-length-of-a-segment-of-a-quadratic-bezier
- http://pomax.github.io/bezierinfo
- Arc elements calculation: https://github.com/MadLittleMods/svg-curve-lib/tree/f07d6008a673816f4cb74a3269164b430c3a95cb

For path parsing:

- https://github.com/jkroso/parse-svg-path
