/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
// export function uniq(arr) {
//   let set = new Set(arr);
//   let getArr = [];
//
//   for (const setElement of set) {
//     getArr.push(setElement);
//   }
//   return getArr;
// }

export function uniq(arr) {
  let set = new Set(arr);
  return Array.from(set);
}
// Супер, отдельное спасибо за этот совет. Действительно намного короче запись
