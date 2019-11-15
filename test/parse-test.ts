import * as test from "tape";
import parse from "../src/parse";

test("Parse", function(t) {
  const res = parse("");
  t.equal(res, "Hi");
  t.end();
});
