import * as test from "tape";
import { inDelta } from "./inDelta";
import { svgPathProperties } from "../src/index";

test("Creation with different styles test", function(test) {
  const svgPath = "M0,100 q50,-150 100,0 t100,0";
  const a = new svgPathProperties(svgPath); // MyClass
  const b = svgPathProperties(svgPath); // also MyClass

  test.equal(
    a.getTotalLength(),
    b.getTotalLength(),
    "Both methods must return the same and work: getTotalLength"
  );
  test.deepEqual(
    a.getPointAtLength(50),
    b.getPointAtLength(50),
    "Both methods must return the same and work: getPointAtLength"
  );
  test.deepEqual(
    a.getTangentAtLength(50),
    b.getTangentAtLength(50),
    "Both methods must return the same and work: getTangentAtLength"
  );
  test.deepEqual(
    a.getPropertiesAtLength(50),
    b.getPropertiesAtLength(50),
    "Both methods must return the same and work: getPropertiesAtLength"
  );

  test.deepEqual(a.getParts()[0].start, b.getParts()[0].start);
  test.end();
});
