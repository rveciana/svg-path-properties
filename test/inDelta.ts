export const inDelta = (
  actual: number[] | number,
  expected: number[] | number,
  delta: number
) => {
  if (Array.isArray(actual) && Array.isArray(expected))
    return inDeltaArray(actual, expected, delta);
  else if (!Array.isArray(actual) && !Array.isArray(expected))
    return inDeltaNumber(actual, expected, delta);
  else throw new Error("Both elements should be either arrays or numbers");
};

const inDeltaArray = (actual: number[], expected: number[], delta: number) => {
  const n = expected.length;
  let i = -1;
  if (actual.length !== n) return false;
  while (++i < n) if (!inDelta(actual[i], expected[i], delta)) return false;
  return true;
};

const inDeltaNumber = (actual: number, expected: number, delta: number) => {
  return actual >= expected - delta && actual <= expected + delta;
};
