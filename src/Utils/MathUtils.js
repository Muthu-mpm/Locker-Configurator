export function getTextWidth(text, font) {
  // re-use canvas object for better performance
  const canvas =
    getTextWidth.canvas ||
    (getTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

function getCssStyle(element, prop) {
  return window.getComputedStyle(element, null).getPropertyValue(prop);
}

export function getCanvasFont(el = document.body) {
  const fontWeight = getCssStyle(el, "font-weight") || "normal";
  const fontSize = getCssStyle(el, "font-size") || "16px";
  const fontFamily = getCssStyle(el, "font-family") || "Times New Roman";

  return `${fontWeight} ${fontSize} ${fontFamily}`;
}

/**
 * Utility class for mathematical functions.
 * @class
 */
export var MathUtils = (function () {
  function MathUtils() {
    throw Object.defineProperty(new Error("Utility class"), "__classes", {
      configurable: true,
      value: [
        "java.lang.Throwable",
        "java.lang.IllegalStateException",
        "java.lang.Object",
        "java.lang.RuntimeException",
        "java.lang.Exception",
      ],
    });
  }

  /**
   * Rounds a value to the nearest passed in integer.
   *
   * For example, round 249 to the nearest 100 would be roundToNearestInt(249, 100) = 200. However, 249 to the nearest 50 would be roundToNearestInt(249, 50)
   * = 250.
   *
   * @param {number} value value to be rounded
   * @param {number} roundTo multiple to round to
   * @return {number} rounded value
   */
  MathUtils.roundToNearestInt = function (value, roundTo) {
    return (Math.round(value / roundTo) * roundTo) | 0;
  };

  /**
   * Rounds up to the passed in integer.
   *
   * @param {number} value value to be rounded
   * @param {number} roundTo multiple to round to
   * @return {number} rounded value
   */
  MathUtils.roundUpToNearestInt = function (value, roundTo) {
    return (Math.ceil(value / roundTo) * roundTo) | 0;
  };

  /**
   * Rounds a value to the nearest passed in decimal value.
   *
   * For example, rounding 1 7/128 (0.0546875) rounded to the nearest 1/32 (0.03125) = roundToNearestDecimal(0.0546875, FRAC_1_32) = 1 1/16 (1.0625).
   *
   * @param {number} value value to be rounded
   * @param {number} roundTo value to round to, must be between 0 and 1
   * @return {number} rounded value
   */
  MathUtils.roundToNearestDecimal = function (value, roundTo) {
    if (roundTo > 1 || roundTo < 0) {
      throw Object.defineProperty(
        new Error("roundTo needs to be a decimal value between 0 and 1"),
        "__classes",
        {
          configurable: true,
          value: [
            "java.lang.Throwable",
            "java.lang.Object",
            "java.lang.RuntimeException",
            "java.lang.IllegalArgumentException",
            "java.lang.Exception",
          ],
        }
      );
    }
    return Math.round(value * Math.pow(roundTo, -1)) / Math.pow(roundTo, -1);
  };

  /**
   * Converts a decimal value to a rational fraction.
   *
   * @param {number} decimal decimal to convert
   * @return {string} rational fraction
   */
  MathUtils.decimalToFraction = function (decimal) {
    var s = decimal.toString();
    var digitsDec = s.length - 1 - s.indexOf(".");
    var denominator = 1;
    for (var i = 0; i < digitsDec; i++) {
      {
        decimal *= 10;
        denominator *= 10;
      }
    }
    var numerator = Math.round(decimal) | 0;
    var gcd = MathUtils.greatestCommonDenmominator(numerator, denominator);
    numerator = (numerator / gcd) | 0;
    denominator = (denominator / gcd) | 0;
    return numerator + "/" + denominator;
  };

  /**
   * Finds the greatest common denominator between a numerator and denominator.
   *
   * @param {number} numerator numerator
   * @param {number} denominator denominator
   * @return {number} greatest common denominator int
   */
  MathUtils.greatestCommonDenmominator = function (numerator, denominator) {
    return denominator === 0
      ? numerator
      : MathUtils.greatestCommonDenmominator(
          denominator,
          numerator % denominator
        );
  };

  MathUtils.fractionToDouble$java_lang_String = function (fraction) {
    return MathUtils.fractionToDouble$java_lang_String$boolean(fraction, false);
  };

  MathUtils.fractionToDouble$java_lang_String$boolean = function (
    fraction,
    errorOnImproperFraction
  ) {
    if (fraction === null || fraction.length === 0) {
      throw Object.defineProperty(
        new Error("fraction cannot be null or empty"),
        "__classes",
        {
          configurable: true,
          value: [
            "java.lang.Throwable",
            "java.lang.Object",
            "java.lang.RuntimeException",
            "java.lang.IllegalArgumentException",
            "java.lang.Exception",
          ],
        }
      );
    }
    if (fraction.indexOf("/") !== -1) {
      var fractionArray = fraction.split("/");
      if (fractionArray.length !== 2) {
        throw Object.defineProperty(
          new Error("fraction not in the form n/d"),
          "__classes",
          {
            configurable: true,
            value: [
              "java.lang.Throwable",
              "java.lang.Object",
              "java.lang.RuntimeException",
              "java.lang.IllegalArgumentException",
              "java.lang.Exception",
            ],
          }
        );
      }
      var numerator = parseFloat(fractionArray[0]);
      var denominator = parseFloat(fractionArray[1]);
      if (errorOnImproperFraction && numerator > denominator) {
        throw Object.defineProperty(
          new Error("Improper fraction"),
          "__classes",
          {
            configurable: true,
            value: [
              "java.lang.Throwable",
              "java.lang.ArithmeticException",
              "java.lang.Object",
              "java.lang.RuntimeException",
              "java.lang.Exception",
            ],
          }
        );
      }
      return numerator / denominator;
    } else {
      return parseFloat(fraction);
    }
  };

  /**
   * Converts a fraction String to a double and errors on improper fraction if errorOnImproperFraction is true.
   *
   * @param {string} fraction fraction String
   * @param {boolean} errorOnImproperFraction boolean whether to throw an error on improper fractions
   * @return {number} double
   * @throws ArithmeticException if errorOnImproperFraction is true and the fraction is improper
   */
  MathUtils.fractionToDouble = function (fraction, errorOnImproperFraction) {
    if (
      (typeof fraction === "string" || fraction === null) &&
      (typeof errorOnImproperFraction === "boolean" ||
        errorOnImproperFraction === null)
    ) {
      return MathUtils.fractionToDouble$java_lang_String$boolean(
        fraction,
        errorOnImproperFraction
      );
    } else if (
      (typeof fraction === "string" || fraction === null) &&
      errorOnImproperFraction === undefined
    ) {
      return MathUtils.fractionToDouble$java_lang_String(fraction);
    } else throw new Error("invalid overload");
  };

  /**
   * Converts inches to mm
   * @param {*} inches Value in inches
   */
  MathUtils.inchesToMm = function (inches) {
    if (inches !== null && Number(inches) > 0) {
      return (Number(inches) * 25.4).toFixed(2); // Round to 2 decimal number
    }

    return Number(0);
  };

  /**
   * Converts mm to inches
   * @param {*} mm Value in mm
   */
  MathUtils.mmToInches = function (mm) {
    if (mm !== null && Number(mm) > 0) {
      return (Number(mm) / 25.4).toFixed(2); // Round to 2 decimal number
    }

    return Number(0);
  };

  return MathUtils;
})();
/**
 * Decimal constant representing 1/32.
 */
MathUtils.FRAC_1_32 = 0.03125;
MathUtils["__class"] = "MathUtils";
