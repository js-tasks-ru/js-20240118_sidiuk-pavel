/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  let getMap = new Map();
  if (obj === undefined){
    return undefined
  }
  let map = new Map(Object.entries(obj));
  map.forEach((value, key, map) => {
    if (typeof value !== 'object') {
      getMap.set(value, key)
    }
  });

  return Object.fromEntries(getMap);

}

