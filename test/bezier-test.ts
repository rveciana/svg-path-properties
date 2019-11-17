import * as test from "tape";
import { Bezier } from "../src/bezier";
import { inDelta } from "./inDelta";

test("Testing Length Quadratic", function(test) {
  var curve = new Bezier(200, 300, 400, 50, 600, 300, undefined, undefined);
  test.true(inDelta(curve.getTotalLength(), 487.77, 0.1));
  test.end();
});
test("Testing Length Cubic", function(test) {
  var curve = new Bezier(200, 200, 275, 100, 575, 100, 500, 200);
  test.true(inDelta(curve.getTotalLength(), 383.44, 0.1));
  test.end();
});

test("Testing getPointAtLength Quadratic", function(test) {
  var curve = new Bezier(200, 300, 400, 50, 600, 300, undefined, undefined);
  var point = curve.getPointAtLength(487.77 / 6);
  test.true(inDelta(point.x, 255.24, 1));
  test.true(inDelta(point.y, 240.47, 1));
  test.end();
});

test("Testing getPointAtLength Cubic", function(test) {
  var curve = new Bezier(200, 200, 275, 100, 575, 100, 500, 200);
  var point = curve.getPointAtLength(383.44 / 6);
  test.true(inDelta(point.x, 249.48, 1));
  test.true(inDelta(point.y, 160.37, 1));
  test.end();
});

test("Testing getTangentAtLength", function(test) {
  var curve = new Bezier(200, 200, 275, 100, 575, 100, 500, 200);

  test.end();
});

test("Testing pull request #16 solution", function(test) {
  var curve = new Bezier(
    640.48,
    1285.21,
    642.39,
    644.73,
    642.39,
    644.73,
    undefined,
    undefined
  );
  var tangent = curve.getTangentAtLength(curve.getTotalLength() / 2);
  test.true(inDelta(tangent.y, 0, 1));
  test.true(inDelta(tangent.x, 0, 1));

  test.end();
});
