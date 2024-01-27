/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */

// не помню какой знак для строгой проверки, проверьте по полной программе, хочу что бы код был по возможности короче
export function trimSymbols(string, size) {
  if (size === 0) {
    return '';
  }
  if (size === undefined) {
    return string;
  }
  let counter = 0;
  let currentLetter = '';
  let newStr = '';
  for (const strElement of string) {
    if (currentLetter === '') {
      currentLetter = strElement;
      newStr = currentLetter;
      counter++;

    }
    if (currentLetter === strElement && counter < size) {
      newStr = newStr + strElement;
      counter++;
    }
    if (currentLetter !== strElement) {
      currentLetter = strElement;
      newStr = newStr + currentLetter;
      counter = 1;
    }
  }
  return newStr;
}
