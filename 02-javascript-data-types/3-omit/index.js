/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  for (const objKey in obj) {
    if (fields.includes(objKey)){
      delete obj[objKey];
    }
  }
  return obj;
};
