/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */

export function sortStrings(arr, param = 'asc') {
  return [...arr].sort(param === 'desc' ? sortDesc : sortAsc);
}

function sortDesc(a, b) {
  return b.localeCompare(a, ['ru', 'en-US'], {caseFirst: 'upper'});
}

function sortAsc(a, b) {
  return a.localeCompare(b, ['ru', 'en-US'], {caseFirst: 'upper'});
}
