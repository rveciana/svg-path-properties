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

tape("Issue 15", function(test) {
    var def = "M0,0 c 0.025,-0.052 0.081,-0.1387 0.2031,-0.2598 0,0 0,0 0,0";
    var properties = path.svgPathProperties(def);
    properties.getParts(); //The above path used to hang the programd

    def = "M0,0 c 0.025,-0.052 0.081,-0.1387 0.2031,-0.2598 0,0 0,0 0,0 c 0.1865,-0.31055 0.3632,-0.71289 0.5371,-1.22266 0.1963,-0.40625 0.3261,-0.78516 0.3857,-1.13184 0,-0.008 0,-0.0156 0,-0.0225";
    properties = path.svgPathProperties(def);
    properties.getParts(); 

    test.end();
});
