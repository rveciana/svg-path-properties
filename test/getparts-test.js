var tape = require("tape"),
path = require("../");

tape("Testing the getParts with simple path", function(test) {
    var properties = path.svgPathProperties("m10,0l10,0");
    var parts = properties.getParts();

    test.equal(parts.length, 1, "A one part path must give one element array");
    test.equal('start' in parts[0], true, "Elements must have all properties");
    test.equal('end' in parts[0], true, "Elements must have all properties");
    test.equal('length' in parts[0], true, "Elements must have all properties");
    test.equal('getPointAtLength' in parts[0], true, "Elements must have all properties");
    test.equal('getTangentAtLength' in parts[0], true, "Elements must have all properties");
    test.equal('getPropertiesAtLength' in parts[0], true, "Elements must have all properties");

    properties = path.svgPathProperties("m10,0l10,0l10,0");
    parts = properties.getParts();
    
    test.deepEqual(parts[0].start, {x: 10, y:0}, "testing start points");
    test.deepEqual(parts[1].start, {x: 20, y:0}, "testing start points");

    test.deepEqual(parts[0].end, {x: 20, y:0}, "testing end points");
    test.deepEqual(parts[1].end, {x: 30, y:0}, "testing end points");

    test.equal(parts[0].length, 10, "testing lengths");
    test.equal(parts[1].length, 10, "testing lengths");

    //Testing functions
    test.deepEqual(parts[0].getPointAtLength(5), {x: 15, y:0}, "testing getPointAtLength");
    test.deepEqual(parts[1].getPointAtLength(5), {x: 25, y:0}, "testing getPointAtLength");

    test.deepEqual(parts[0].getTangentAtLength(5), {x: 1, y:0}, "testing getTangentAtLength");
    test.deepEqual(parts[1].getTangentAtLength(5), {x: 1, y:0}, "testing getTangentAtLength");

    test.deepEqual(parts[0].getPropertiesAtLength(5), { tangentX: 1, tangentY: 0, x: 15, y: 0 }, "testing getPropertiesAtLength");
    test.deepEqual(parts[1].getPropertiesAtLength(5), { tangentX: 1, tangentY: 0, x: 25, y: 0 }, "testing getPropertiesAtLength");

    test.end();
});

tape("Testing the getParts with simple path", function(test) {
    var properties = path.svgPathProperties("M100,200 C100,100 250,100 250,200 S400,300 400,200");
    var parts = properties.getParts();
    test.equal(parts.length, 2, "Correct number of parts");
    test.deepEqual(parts[0].getPointAtLength(5), properties.getPointAtLength(5), "First part must have equal distances");
    test.deepEqual(parts[1].getPointAtLength(5), properties.getPointAtLength(parts[0]['length'] + 5), "Second part must have equal distances");
    test.end();
});
