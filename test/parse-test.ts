import * as test from "tape";
import parse from "../src/parse";

test("overloaded moveTo", test => {
  test.deepEqual(parse("m 12.5,52 39,0 0,-40 -39,0 z"), [
    ["m", 12.5, 52],
    ["l", 39, 0],
    ["l", 0, -40],
    ["l", -39, 0],
    ["z"]
  ]);

  test.deepEqual(parse("M 12.5,52 39,0 0,-40 -39,0 z"), [
    ["M", 12.5, 52],
    ["L", 39, 0],
    ["L", 0, -40],
    ["L", -39, 0],
    ["z"]
  ]);

  test.deepEqual(parse("z"), [["z"]]);
  test.end();
});

test("curveTo", function (test) {
  const a = parse("c 50,0 50,100 100,100 50,0 50,-100 100,-100");
  const b = parse("c 50,0 50,100 100,100 c 50,0 50,-100 100,-100");

  test.deepEqual(
    a,
    [
      ["c", 50, 0, 50, 100, 100, 100],
      ["c", 50, 0, 50, -100, 100, -100]
    ],
    "Correct parse c"
  );
  test.deepEqual(a, b, "Testing repeated");
  test.end();
});

test("lineTo, h, v, l", function (test) {
  test.throws(function () {
    parse("l 10 10 0");
  }, /Malformed/);
  test.deepEqual(parse("l 10,10"), [["l", 10, 10]]);
  test.deepEqual(parse("L 10,10"), [["L", 10, 10]]);
  test.deepEqual(parse("l10 10 10 10"), [
    ["l", 10, 10],
    ["l", 10, 10]
  ]);

  test.deepEqual(parse("h 10.5"), [["h", 10.5]]);
  test.deepEqual(parse("v 10.5"), [["v", 10.5]]);

  test.end();
});

test("arcTo, quadratic curveTo, smooth curveTo, smooth quadratic curveTo", function (test) {
  test.deepEqual(parse("A 30 50 0 0 1 162.55 162.45"), [["A", 30, 50, 0, 0, 1, 162.55, 162.45]]);

  test.deepEqual(parse("M10 80 Q 95 10 180 80"), [
    ["M", 10, 80],
    ["Q", 95, 10, 180, 80]
  ]);
  test.deepEqual(parse("S 1 2, 3 4"), [["S", 1, 2, 3, 4]]);
  test.deepEqual(parse("T 1 -2e2"), [["T", 1, -2e2]]);

  test.throws(function () {
    parse("t 1 2 3");
  }, Error);
  test.end();
});

test("Empty string", test => {
  test.deepEqual(parse(""), [["M", 0, 0]]);
  test.deepEqual(parse(null), [["M", 0, 0]]);

  test.end();
});
