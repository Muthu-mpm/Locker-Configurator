export const COLOR_WHITE = 0xffffff;
export const COLOR_GRAY = 0x858585;
export const COLOR_ALICE_BLUE = 0xf0f8ff;
export const COLOR_TEXT_WHITE = "white";
export const COLOR_TEXT_GREEN = "green";
export const COLOR_TEXT_BLACK = "black";
export const COLOR_TEXT_AA_BLUE = "#157FCC";
export const COLOR_TEXT_BLUE = "blue";
export const COLOR_TEXT_BROWN = "brown";
export const COLOR_PANEL_SPACER = "#adc2d1";
export const wallColorCode = "black";
export const PANEL_PADDING = 0.1;
//Doors Styles
export function compareStringinLowerCase(value1, value2) {
  if (value1 && value2) {
    return (
      value1.toLowerCase().split(" ").join("") ===
      value2.toLowerCase().split(" ").join("")
    );
  }

  return false;
}
