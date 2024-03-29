/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */

export function invertObj(obj) {
  const invert = {};
  if (obj === undefined) {
    return undefined;
  }
  for (let [key, value] of Object.entries(obj)) {
    invert[value] = key;
  }
  return invert;
}
