/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */

export function invertObj(obj) {
  let val;
  if (obj === undefined) {
    return undefined;
  }
  for (const objKey in obj) {
    val = obj[objKey];
    delete obj[objKey];
    Object.assign(obj, {[`${val}`]: objKey});
  }
  return obj;
}
