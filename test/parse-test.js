var tape = require("tape"),
path = require("../");
require("./inDelta");

tape("overloaded moveTo", function(test) {
  test.deepEqual(path.parse('m 12.5,52 39,0 0,-40 -39,0 z'), [
  			['m', 12.5, 52],
  			['l', 39, 0],
  			['l', 0, -40],
  			['l', -39, 0],
  			['z']
  ]);

  test.deepEqual(path.parse('M 12.5,52 39,0 0,-40 -39,0 z'), [
  			['M', 12.5, 52],
  			['L', 39, 0],
  			['L', 0, -40],
  			['L', -39, 0],
  			['z']
  ]);


  test.deepEqual(path.parse('z'), [['z']]);
  test.end();
  });

tape("curveTo", function(test) {
  var a = path.parse('c 50,0 50,100 100,100 50,0 50,-100 100,-100');
	var b = path.parse('c 50,0 50,100 100,100 c 50,0 50,-100 100,-100');

  test.deepEqual(a,[
			['c', 50,0,50,100,100,100],
			['c', 50,0,50,-100,100,-100]
    ], "Correct parse c");
  test.deepEqual(a, b, "Testing repeated");
  test.end();
});

tape("lineTo, h, v, l", function(test) {
  test.throws(function(){ path.parse('l 10 10 0'); },/malformed/);
  test.deepEqual(path.parse('l 10,10'), [['l', 10,10]]);
  test.deepEqual(path.parse('L 10,10'), [['L', 10,10]]);
	test.deepEqual(path.parse('l10 10 10 10'), [
			['l', 10, 10],
			['l', 10, 10]
		]);

    test.deepEqual(path.parse('h 10.5'), [['h', 10.5]]);
    test.deepEqual(path.parse('v 10.5'), [['v', 10.5]]);

  test.end();
});

tape("arcTo, quadratic curveTo, smooth curveTo, smooth quadratic curveTo", function(test) {
    test.deepEqual(path.parse('A 30 50 0 0 1 162.55 162.45'), [
			['A', 30, 50, 0, 0, 1, 162.55, 162.45]
    ]);

    test.deepEqual(path.parse('M10 80 Q 95 10 180 80'), [
			['M', 10, 80],
			['Q', 95, 10, 180, 80]
    ]);
    test.deepEqual(path.parse('S 1 2, 3 4'), [['S', 1, 2, 3, 4]]);
    test.deepEqual(path.parse('T 1 -2e2'), [['T', 1, -2e2]]);

    test.throws(function() {path.parse('t 1 2 3');}, Error);
  test.end();
});
