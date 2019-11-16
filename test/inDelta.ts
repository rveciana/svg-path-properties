export const inDelta = (actual, expected, delta) => {
  return (Array.isArray(expected) ? inDeltaArray : inDeltaNumber)(
    actual,
    expected,
    delta
  );
};

const inDeltaArray = (actual, expected, delta) => {
  const n = expected.length;
  let i = -1;
  if (actual.length !== n) return false;
  while (++i < n) if (!inDelta(actual[i], expected[i], delta)) return false;
  return true;
};

const inDeltaNumber = (actual, expected, delta) => {
  return actual >= expected - delta && actual <= expected + delta;
};
