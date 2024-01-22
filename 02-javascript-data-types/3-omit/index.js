/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const omitObj = obj;
  for (const objKey in omitObj) {
    if (fields.includes(objKey)) {
      delete omitObj[objKey];
    }
  }
  return omitObj;
};
