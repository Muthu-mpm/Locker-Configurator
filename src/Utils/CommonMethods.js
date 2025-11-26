/**
 * Verify whether Array is Null or Array has 0 items
 * @param {*} value Array value to verify
 */
export function isArrayEmptyOrNull(array) {
  return !array || array.length === 0;
}

/**
 * Verify whether String is Null or String is empty
 * @param {*} value String value to verify
 */
export function isStringEmptyOrNull(value) {
  return !value || value === "";
}

/**
 * Verify whether Number is Null or Number is zero
 * @param {*} value Number to verify
 */
export function isNumberZero(value) {
  return !value || Number(value) === 0;
}

/**
 * Compare 2 String values in lower case
 * @param {*} value1 String Value 1
 * @param {*} value2 String Value 2
 */
export function compareStringinLowerCase(value1, value2) {
  if (value1 && value2) {
    return (
      value1.toLowerCase().split(" ").join("") ===
      value2.toLowerCase().split(" ").join("")
    );
  }

  return false;
}

/**
 * Round number
 * @param {*} num Number
 * @param {*} decimalPlaces Rounding Decimal places
 */
export function roundNumber(num, decimalPlaces = 0) {
  const p = Math.pow(10, decimalPlaces);
  const m = num * p * (1 + Number.EPSILON);

  return Math.round(m) / p;
}

/**
 * Remove Non-Numeric characters from given string
 * @param {*} value Value to remove non-numeric characters
 */
export function removeNonNumerics(value) {
  let valueWithNumber = value;
  if (value) {
    valueWithNumber = value.replace(/\D/g, "");
  }

  return valueWithNumber;
}

/**
 * Remove Numeric characters from given string
 * @param {*} value value to remove numeric characters
 */
export function removeNumbers(value) {
  let valueWithoutNumber = value;
  if (value) {
    valueWithoutNumber = value.replace(/[0-9]/g, "");
  }

  return valueWithoutNumber;
}

/**
 * Compare Multiple items with First Parameter of the method in OR condition
 * @param {*} firstParameter Parameter to compare with other items in OR condition
 * @param  {...any} params Values to compare with First Parameter
 * @returns Boolean if any value matches with First parameter else false
 */
export function compareMultipleItemsOR(firstParameter, ...params) {
  if (!firstParameter || isArrayEmptyOrNull(params)) {
    return false;
  }

  let isConditionMatched = false;
  for (const param of params) {
    if (firstParameter === param) {
      // Match all conditions; Mark it true as this is OR condition
      isConditionMatched = true;
      break;
    }
  }

  return isConditionMatched;
}

/**
 * Verify whether passed JSON String is valid
 * @param {*} jsonStr JSON String
 * @returns true, if JSON String is a valid JSON else false
 */
export function isValidJSONString(jsonStr) {
  if (isStringEmptyOrNull(jsonStr)) {
    return false;
  }

  try {
    JSON.parse(jsonStr);
  } catch (e) {
    return false;
  }
  return true;
}
