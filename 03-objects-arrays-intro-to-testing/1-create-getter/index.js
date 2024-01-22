/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  let arr = path.split('.');
  let a;
  let b = arr[arr.length - 1]
  return function getter(obj) {
    for (const aKey in obj) {
      if (aKey === b) {
        return obj[aKey];
      }
      if (!(arr.includes(aKey))) {
        a = undefined;
      } else {
        a = obj[aKey];
        return getter(a);
      }
    }
    return a;
  };
}
