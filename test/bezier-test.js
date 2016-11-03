var tape = require("tape"),
path = require("../");

require("./inDelta");

tape("Testing Length Quadratic", function(test) {

  var curve = new path.Bezier(200,300,400,50,600,300);
  test.inDelta(curve.getLength(), 487.77, 0.1);
  test.end();
});
tape("Testing Length Cubic", function(test) {
  var curve = new path.Bezier(200,200,275,100,575,100,500,200);
  test.inDelta(curve.getLength(), 383.44, 0.1);
  test.end();
});
