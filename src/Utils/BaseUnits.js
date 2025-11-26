/**
 * Constructs a BaseUnits instance from a base unit value.
 *
 * @param {number} value base units
 * @class
 */

import { MathUtils } from "./MathUtils";

export var BaseUnits = (function () {
  function BaseUnits(value) {
    var _this = this;
    if (typeof value === "number" || value === null) {
      /* var __args = arguments; */
      if (this.__value === undefined) {
        this.__value = 0;
      }
      (function () {
        _this.setValue(value);
      })();
    } else if (value === undefined) {
      /* var __args = arguments; */
      if (this.__value === undefined) {
        this.__value = 0;
      }
    } else {
      throw new Error("invalid overload");
    }
  }

  /**
   * Parses a user entered String assuming imperial feet and inches measurements.
   *
   * @param {string} input feet and inches input
   * @return {BaseUnits} BaseUnits
   */
  BaseUnits.parseFeetInches = function (input) {
    return BaseUnits.parseImperial(input, false);
  };

  /**
   * Parses a user entered String assuming imperial inches measurements.
   *
   * @param {string} input inches input
   * @return {BaseUnits} BaseUnits
   */
  BaseUnits.parseInches = function (input) {
    return BaseUnits.parseImperial(input, true);
  };

  /**
   * Parses imperial measurement strings, assuming feet and inches or just inches.
   *
   * @param {string} input imperial measurement to parse
   * @param {boolean} inches assume inches boolean
   * @return {BaseUnits} BaseUnits
   * @private
   */
  /*private*/ BaseUnits.parseImperial = function (input, inches) {
    if (input === null) {
      throw Object.defineProperty(
        new Error("input cannot be null"),
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
    var footValue = 0;
    var inchValue = 0;
    var fractionValue = 0;
    var arrStr = BaseUnits.getInput(input);

    if (arrStr.length === 1) {
      if (arrStr[0].indexOf("/") !== -1) {
        fractionValue = MathUtils.fractionToDouble$java_lang_String$boolean(
          arrStr[0].split('"')[0],
          true
        );
      } else {
        if (arrStr[0].indexOf('"') !== -1) {
          inchValue = parseFloat(arrStr[0].split('"')[0]);
        } else if (arrStr[0].indexOf("'") !== -1) {
          footValue = parseFloat(arrStr[0].split("'")[0]);
        } else {
          if (inches) {
            inchValue = parseFloat(arrStr[0]);
          } else {
            if (parseFloat(arrStr[0]) <= 11) {
              footValue = parseFloat(arrStr[0]);
            } else {
              footValue = (parseFloat(arrStr[0]) / 12) | 0;
              inchValue = parseFloat(arrStr[0]) % 12;
            }
          }
        }
      }
    } else if (arrStr.length === 2) {
      if (
        inches &&
        arrStr[0].indexOf("'") === -1 &&
        arrStr[1].indexOf("/") !== -1
      ) {
        inchValue = parseFloat(arrStr[0].split('"')[0]);
        fractionValue = MathUtils.fractionToDouble$java_lang_String$boolean(
          arrStr[1].split('"')[0],
          true
        );
      } else if (
        inches &&
        arrStr[0].indexOf("'") === -1 &&
        arrStr[1].indexOf(".") !== -1
      ) {
        throw Object.defineProperty(
          new Error(`${input} is not a valid inches measurement`),
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
      } else {
        footValue = BaseUnits.findFootWithArrStrLengthTwo(inches, arrStr);
        if (arrStr[1].indexOf('"') !== -1) {
          if (arrStr[1].indexOf("/") !== -1) {
            fractionValue = MathUtils.fractionToDouble$java_lang_String$boolean(
              arrStr[1].split('"')[0],
              true
            );
          } else {
            inchValue = parseFloat(arrStr[1].split('"')[0]);
          }
        } else {
          inchValue = BaseUnits.findInchesFromInput(inches, arrStr);
        }
      }
    } else if (arrStr.length === 3) {
      if (arrStr[1].indexOf("/") !== -1) {
        footValue = BaseUnits.findFootValueFromInput(arrStr);
        inchValue = parseFloat(arrStr[2].split('"')[0]);
      } else {
        footValue = parseFloat(arrStr[0].split("'")[0]);
        inchValue = parseFloat(arrStr[1]);
        fractionValue = MathUtils.fractionToDouble$java_lang_String$boolean(
          arrStr[2].split('"')[0],
          true
        );
      }
    } else if (arrStr.length === 4 && arrStr[1].indexOf("/") !== -1) {
      footValue = BaseUnits.findFootValueFromInput(arrStr);
      inchValue = parseFloat(arrStr[2]);
      fractionValue = MathUtils.fractionToDouble$java_lang_String$boolean(
        arrStr[3].split('"')[0],
        true
      );
    }
    var fractionInt = (fractionValue * BaseUnits.UNIT_VALUE) | 0;
    var inchValueInt = (inchValue * BaseUnits.UNIT_VALUE) | 0;
    var feetValueInt = (footValue * BaseUnits.UNIT_VALUE * 12) | 0;
    return new BaseUnits(feetValueInt + inchValueInt + fractionInt);
  };

  /*private*/ BaseUnits.findFootWithArrStrLengthTwo = function (
    inches,
    arrStr
  ) {
    var footValue;
    if (
      !inches &&
      arrStr[0].indexOf('"') === -1 &&
      arrStr[1].indexOf('"') !== -1 &&
      arrStr[1].indexOf("/") !== -1
    ) {
      footValue = parseFloat(arrStr[0].split("'")[0]) / 12;
    } else {
      footValue = parseFloat(arrStr[0].split("'")[0]);
    }
    return footValue;
  };

  /*private*/ BaseUnits.findInchesFromInput = function (inches, arrStr) {
    var inchValue;
    if (arrStr[1].indexOf("/") !== -1) {
      inchValue = MathUtils.fractionToDouble$java_lang_String$boolean(
        arrStr[1].split('"')[0],
        true
      );
      if (!inches) {
        inchValue *= 12;
      }
    } else {
      inchValue = parseFloat(arrStr[1].split('"')[0]);
      if (inches && arrStr[1].indexOf(".") !== -1) {
        inchValue *= 12;
      }
    }
    return inchValue;
  };

  /*private*/ BaseUnits.findFootValueFromInput = function (arrStr) {
    var footValue;
    var val = arrStr[1].split("'")[0];
    var num = val.split("/")[0];
    var denom = val.split("/")[1];
    var fracResult = parseFloat(num) / parseFloat(denom);
    footValue = parseFloat(arrStr[0]) + fracResult;
    return footValue;
  };

  /**
   * Gets the input tokens ready for parsing.
   *
   * @param {string} input String input
   * @return {Array} array of measurement tokens
   * @private
   */
  /*private*/ BaseUnits.getInput = function (input) {
    var s = BaseUnits.cleanInput(input);
    var sb = {
      str: "",
      toString: function () {
        return this.str;
      },
    };
    var loop1 = function (index) {
      {
        var c1 = s.charAt(index);
        if (/\d/.test(c1[0]) || index === s.length - 1) {
          /* append */ (function (sb) {
            sb.str = sb.str.concat(c1);
            return sb;
          })(sb);
        } else {
          var nextChar = s.charAt(index + 1);
          if (
            (function (c) {
              return c.charCodeAt === null ? c : c.charCodeAt(0);
            })(c1) !== "/".charCodeAt(0) &&
            (function (c) {
              return c.charCodeAt === null ? c : c.charCodeAt(0);
            })(c1) !== ".".charCodeAt(0) &&
            (function (c) {
              return c.charCodeAt === null ? c : c.charCodeAt(0);
            })(c1) !== " ".charCodeAt(0) &&
            !/\d/.test(c1[0]) &&
            /\d/.test(nextChar[0])
          ) {
            /* append */ (function (sb) {
              sb.str = sb.str.concat(" ");
              return sb;
            })(
              /* append */ (function (sb) {
                sb.str = sb.str.concat(c1);
                return sb;
              })(sb)
            );
          } else {
            /* append */ (function (sb) {
              sb.str = sb.str.concat(c1);
              return sb;
            })(sb);
          }
        }
      }
    };
    for (var i = 0; i < s.length; i++) {
      loop1(i);
    }
    return sb.str.split(" ");
  };

  /**
   * Cleans the input anc converted any feet/foot/f/inches/inch/in to their appropriate " or ' character.
   *
   * @param {string} input String input
   * @return {string} cleaned String
   * @private
   */
  /*private*/ BaseUnits.cleanInput = function (input) {
    return BaseUnits.removeExtraSpaces(input)
      .toLowerCase()
      .split(" feet")
      .join("'")
      .split(" foot")
      .join("'")
      .split(" f")
      .join("'")
      .split("feet")
      .join("'")
      .split("foot")
      .join("'")
      .split("f")
      .join("'")
      .split(" inches")
      .join('"')
      .split(" inch")
      .join('"')
      .split(" in")
      .join('"')
      .split("inches")
      .join('"')
      .split("inch")
      .join('"')
      .split("in")
      .join('"')
      .split("-")
      .join(" ");
  };

  /**
   * Trims the input String as well as removes duplicate space values.
   *
   * @param {string} input String input
   * @return {string} cleaned String
   * @private
   */
  /*private*/ BaseUnits.removeExtraSpaces = function (input) {
    var s = input.trim().replace(new RegExp("\\s\\s", "g"), " ");
    if (s.indexOf("  ") !== -1) {
      return BaseUnits.cleanInput(s);
    }
    return s;
  };

  /**
   * Parses a use entered String assuming metric units.
   *
   * @param {string} input metric input
   * @return {BaseUnits} BaseUnits
   */
  BaseUnits.parseMetric = function (input) {
    if (input === null) {
      throw Object.defineProperty(
        new Error("input cannot be null"),
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
    var mmValue = 0;
    var arrStr = BaseUnits.getInput(input);
    if (arrStr.length === 1) {
      mmValue = BaseUnits.getMmValue(arrStr[0]);
    } else if (arrStr.length === 2) {
      mmValue =
        BaseUnits.getMmValue(arrStr[0]) + BaseUnits.getMmValue(arrStr[1]);
    }
    return new BaseUnits().setFromMM(Math.round(mmValue) | 0);
  };

  /**
   * Parses a single metric measurement to mm.
   *
   * @param {string} input metric input
   * @return {number} double mm
   * @private
   */
  /*private*/ BaseUnits.getMmValue = function (input) {
    if (input.indexOf("mm") !== -1) {
      const tokens = input.split("mm");
      return parseInt(tokens[0]);
    } else if (input.indexOf("cm") !== -1) {
      const tokens = input.split("cm");
      return parseFloat(tokens[0]) * 10;
    } else if (input.indexOf("m") !== -1) {
      const tokens = input.split("m");
      return parseFloat(tokens[0]) * 1000;
    } else {
      return parseFloat(input);
    }
  };

  /**
   * Gets a BaseUnits instance from the entered mm value.
   *
   * @param {number} mm mm value
   * @return {BaseUnits} BaseUnits
   */
  BaseUnits.getFromMM = function (mm) {
    return new BaseUnits().setFromMM(mm);
  };

  /**
   * Gets a BaseUnits instance from the entered inch value.
   *
   * @param {number} inches inch value
   * @return {BaseUnits} BaseUnits
   */
  BaseUnits.getFromInches = function (inches) {
    return new BaseUnits(inches * BaseUnits.UNIT_VALUE);
  };

  /**
   * Sets the internal base unit value, rounding to the nearest 100.
   *
   * @param {number} value base unit value to set
   * @private
   */
  /*private*/ BaseUnits.prototype.setValue = function (value) {
    this.__value = MathUtils.roundToNearestInt(value, 100);
  };

  BaseUnits.getFeetInchesDisplay = function (value) {
    var feet = value / BaseUnits.UNIT_VALUE / 12;
    var wholeFeet = feet | 0;
    var inchRemainder = (feet - wholeFeet) * 12;

    var inchValue = MathUtils.roundToNearestDecimal(
      inchRemainder,
      MathUtils.FRAC_1_32
    );
    var wholeInches = inchValue | 0;
    var remainder = inchValue - wholeInches;
    var fraction =
      remainder !== 0 && !isNaN(remainder)
        ? MathUtils.decimalToFraction(remainder)
        : "";
    var inches;
    if (wholeInches === 0 && fraction.length !== 0) {
      inches = `${fraction}\"`;
    } else if (fraction.length === 0) {
      inches = `${wholeInches}\"`;
    } else {
      inches = `${wholeInches} ${fraction}\"`;
    }

    if (wholeFeet === 0 && inches.length !== 0) {
      return inches;
    } else {
      return `${wholeFeet}\' ${inches}`;
    }
  };

  /**
   * Gets the base unit value.
   *
   * @return {number} base unit.
   */
  BaseUnits.prototype.value = function () {
    return this.__value;
  };

  /**
   * Gets the BaseUnits value as displayable String in inches. Uses the " as the inch symbol and displays any decimal value as a rational fraction.
   *
   * @return {string} inches String value
   */
  BaseUnits.prototype.toInchesDisplay = function () {
    return this.getInchDisplay(this.toInches());
  };

  /**
   * Gets the inches display value using the passed in value.
   *
   * @param {number} value value to display as inches
   * @return {string} inches String
   * @private
   */
  /*private*/ BaseUnits.prototype.getInchDisplay = function (value) {
    var inchValue = MathUtils.roundToNearestDecimal(value, MathUtils.FRAC_1_32);
    var wholeInches = inchValue | 0;
    var remainder = inchValue - wholeInches;
    var fraction =
      remainder !== 0 && !isNaN(remainder)
        ? MathUtils.decimalToFraction(remainder)
        : "";
    if (wholeInches === 0 && fraction.length !== 0) {
      return `${fraction}\"`;
    } else if (fraction.length === 0) {
      return `${wholeInches}\"`;
    } else {
      return `${wholeInches} ${fraction}\"`;
    }
  };

  /**
   * Gets the BaseUnits value as displayable String in feet and inches. Uses the form f' in".
   *
   * @return {string} feet and inches String value
   */
  BaseUnits.prototype.toFeetInchesDisplay = function () {
    var feet = this.toFeet();
    var wholeFeet = feet | 0;
    var inchRemainder = (feet - wholeFeet) * 12;
    var inches = this.getInchDisplay(inchRemainder);
    if (wholeFeet === 0 && inches.length !== 0) {
      return inches;
    } else {
      return `${wholeFeet}\' ${inches}`;
    }
  };

  /**
   * Gets the BaseUnits value as displayable String in mm.
   *
   * @return {string} mm String value
   */
  BaseUnits.prototype.toMmDisplay = function () {
    return this.getMmDisplay(this.toMM());
  };

  /**
   * Returns {@link #toFeetInchesDisplay()} if metric is false, otherwise returns {@link #toMmDisplay()}.
   *
   * @param {boolean} metric metric boolean
   * @return {string} String display value
   */
  BaseUnits.prototype.toDisplay = function (metric) {
    return metric ? this.toMmDisplay() : this.toFeetInchesDisplay();
  };

  /**
   * Gets the mm display value using the passed in value.
   *
   * @param {number} value value to display as mm
   * @return {string} mm String
   * @private
   */
  /*private*/ BaseUnits.prototype.getMmDisplay = function (value) {
    return `${value}mm`;
  };

  /**
   * Gets the BaseUnits value as displayable String in cm and mm;
   *
   * @return {string} cm and mm String value
   */
  BaseUnits.prototype.toCmMmDisplay = function () {
    var cm = this.toCM();
    var wholeCm = cm | 0;
    var mmRemainder = (cm - wholeCm) * 10;
    var mm = this.getMmDisplay(Math.round(mmRemainder));
    if (wholeCm === 0 && mm.length !== 0) {
      return mm;
    } else {
      return `${wholeCm}cm ${mm}`;
    }
  };

  /**
   * Gets the BaseUnits converted to a decimal representation of inches.
   *
   * @return {number} inches
   */
  BaseUnits.prototype.toInches = function () {
    return this.__value / BaseUnits.UNIT_VALUE;
  };

  /**
   * Gets the BaseUnits value as a feet decimal.
   *
   * @return {number} feet
   */
  BaseUnits.prototype.toFeet = function () {
    return this.toInches() / 12;
  };

  /**
   * Gets the BaseUnits in mm.
   *
   * @return {number} mm
   */
  BaseUnits.prototype.toMM = function () {
    if (
      (Math.round(this.__value / (BaseUnits.UNIT_VALUE / 25.4)) | 0) !==
      Math.round(this.__value / (BaseUnits.UNIT_VALUE / 25.4))
    ) {
      throw Object.defineProperty(new Error("integer overflow"), "__classes", {
        configurable: true,
        value: [
          "java.lang.Throwable",
          "java.lang.ArithmeticException",
          "java.lang.Object",
          "java.lang.RuntimeException",
          "java.lang.Exception",
        ],
      });
    }
    return Math.round(this.__value / (BaseUnits.UNIT_VALUE / 25.4)) | 0;
  };

  /**
   * Gets the BaseUnits in cm.
   *
   * @return {number} cm
   */
  BaseUnits.prototype.toCM = function () {
    return this.toMM() / 10.0;
  };

  /**
   * Gets the BaseUnits in m.
   *
   * @return {number} m
   */
  BaseUnits.prototype.toM = function () {
    return this.toMM() / 1000.0;
  };

  /**
   * Initializes BaseUnits instance to a mm value.
   *
   * @param {number} mm value to initialize to
   * @return {BaseUnits} BaseUnits instance
   * @private
   */
  /*private*/ BaseUnits.prototype.setFromMM = function (mm) {
    this.__value = MathUtils.roundToNearestInt(
      (BaseUnits.UNIT_VALUE / 25.4) * mm - BaseUnits.FUDGE_FACTOR,
      100
    );
    return this;
  };

  /**
   * Rounds the value up to the next whole inch.
   *
   * @return {BaseUnits} BaseUnits instance for chained method calls
   */
  BaseUnits.prototype.roundToNextInch = function () {
    this.__value = MathUtils.roundToNearestInt(
      this.__value,
      BaseUnits.UNIT_VALUE
    );
    return this;
  };

  /**
   * Rounds the value up to the next foot.
   *
   * @return {BaseUnits} BaseUnits instance for chained method calls
   */
  BaseUnits.prototype.rountToNextFoot = function () {
    this.__value = MathUtils.roundUpToNearestInt(
      this.__value,
      BaseUnits.UNIT_VALUE * 12
    );
    return this;
  };

  /**
   *
   * @return {number}
   */
  BaseUnits.prototype.hashCode = function () {
    return 0;
  };

  /**
   *
   * @return {string}
   */
  BaseUnits.prototype.toString = function () {
    return this.toFeetInchesDisplay();
  };

  return BaseUnits;
})();
/**
 * Fudge factor to ensure rounding is correct when converting to metric.
 */
BaseUnits.FUDGE_FACTOR = 2;
/**
 * Base unit value.
 */
BaseUnits.UNIT_VALUE = 3200;
BaseUnits["__class"] = "BaseUnits";
