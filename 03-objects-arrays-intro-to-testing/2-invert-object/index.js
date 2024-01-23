/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */

export function invertObj(obj) {
  const invert = {};
  let val;
  if (obj === undefined) {
    return undefined;
  }
  for (const objKey in obj) {
    val = obj[objKey];
    delete obj[objKey];
    Object.assign(invert, {[`${val}`]: objKey});
  }
  return invert;
}
