/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */

export const omit = (obj, ...fields) => {
  const omitObj = {};
  for (const objKey in obj) {
    if (!fields.includes(objKey)) {
      omitObj[objKey] = obj[objKey];
    }
  }
  return omitObj;
};
