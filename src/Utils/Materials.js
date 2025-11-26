import {
  wallColorCode,
  COLOR_WHITE,
  COLOR_PANEL_SPACER,
  COLOR_TEXT_AA_BLUE,
} from "./Common";
import * as THREE from "three";

// defines material color texture etc.
const MaterialLibrary = {
  wallMaterial: new THREE.MeshPhongMaterial({
    color: wallColorCode,
    reflectivity: 0,
    specular: 1,
    combine: THREE.MixOperation /* ,
          side: THREE.DoubleSide */,
  }),
  glassMaterialOld: new THREE.MeshPhongMaterial({
    color: 0x77bdf9,
    transparent: true,
    opacity: 0.1,
    reflectivity: 0.6,
    depthTest: false,
    specular: 1,
    combine: THREE.MixOperation /* ,
          side: THREE.DoubleSide */,
  }),
  // 1: 0xa5d4ff, 2: 0xa8ccd7, 3: 0x23acc4, 4: 0x90cb8d, 5: 0xa8d5ce, 6: c3ede6, 7: bff1e9, 8: 8fefdf, 9: b8f9ee, 10: afcfc9, 11: a8d5ce
  glassMaterial: new THREE.MeshPhongMaterial({
    color: 0xccccff, // 0x086623
    transparent: true,
    // opacity: 0.6,// 0.2
    reflectivity: 0.2,
    depthTest: true,
    specular: 1,
    // For Automation Capturing image
    /* color: 0xE8E8E8 */
  }),
  panelOtherMaterial: new THREE.MeshPhongMaterial({
    color: 0xd3d3d3 /* 0xB0C4DE */,
    reflectivity: 0.2,
    depthTest: true,
    specular: 1,
  }),
  jointMaterial: new THREE.MeshPhongMaterial({
    color: 0x086623,
    transparent: true,
    opacity: 0.7,
    reflectivity: 0.2,
    depthTest: true,
    specular: 1,
  }),
  panelSpacerMaterial: new THREE.MeshLambertMaterial({
    color: COLOR_PANEL_SPACER,
    transparent: true,
    // opacity: 0.6,
    reflectivity: 0.2,
    depthTest: true,
  }),
  panelStopMaterial: new THREE.MeshLambertMaterial({
    color: COLOR_TEXT_AA_BLUE,
    transparent: true,
    // opacity: 0.6,
    reflectivity: 0.2,
    depthTest: true,
  }),
  doorWhiteMaterial: new THREE.MeshLambertMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 1,
    reflectivity: 0.2,
    depthTest: true,
  }),
  woodMaterial: new THREE.MeshLambertMaterial({
    color: 0xa2633f,
    transparent: true,
    opacity: /* 0.8 */ 1,
    reflectivity: 0.2,
    depthTest: true,
  }),
  hollowMetalDoorMaterial: new THREE.MeshLambertMaterial({
    color: 0x565c7a, // Previous - 0xBEBEBE
    transparent: true,
    opacity: 1,
    reflectivity: 0.2,
    depthTest: true,
  }),
  hollowMetalFrameMaterial: new THREE.MeshPhongMaterial({
    color: 0x5f78a2,
    shininess: 20,
    transparent: true,
    opacity: 1,
    reflectivity: 0.2,
    depthTest: true,
    side: THREE.DoubleSide,
  }),
  greenMaterial: new THREE.MeshLambertMaterial({
    color: 0x086623,
    transparent: true,
    opacity: 0.8,
    reflectivity: 0.2,
    depthTest: true,
  }),
  blackMaterial: new THREE.MeshLambertMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.8,
    reflectivity: 0.2,
    depthTest: true,
  }),
  jointLineMaterial: new THREE.LineBasicMaterial({
    color: 0x000000,
    transparent: false,
    opacity: 1,
    depthTest: true,
  }),
  aliceBlueMaterial: new THREE.LineBasicMaterial({
    color: 0xf0f8ff,
    transparent: true,
    opacity: 1,
    depthTest: true,
  }),
  transparentMaterial: new THREE.LineBasicMaterial({
    color: 0xf0f8ff,
    transparent: true,
    opacity: 0,
    depthTest: true,
  }),
  stileAndRailLineMaterial: new THREE.LineBasicMaterial({
    color: 0xf0f8ff,
    transparent: true,
    opacity: 0.6,
    depthTest: true,
  }),
  doorOutlineMaterial: new THREE.LineBasicMaterial({
    color: COLOR_WHITE,
    transparent: true,
    opacity: 0.5,
  }),
  doorOutlineSelectedMaterial: new THREE.LineBasicMaterial({
    color: 0x00ff00,
    depthTest: true,
  }),
  doorSwingMaterial: new THREE.LineDashedMaterial({
    color: COLOR_WHITE,
    dashSize: 0.5,
    gapSize: 0.5,
  }),
  doorDimensionMaterial: new THREE.LineBasicMaterial({
    color: COLOR_WHITE,
    depthTest: true,
  }),
  glassMaterialForAutomation: new THREE.MeshPhongMaterial({
    color: 0xe8e8e8,
  }),
  handleMaterial: new THREE.MeshStandardMaterial({
    color: COLOR_WHITE,
    roughness: 0.6,
    metalness: 0.8,
    // envMap: refCube, // important -- especially for metals!
    envMapIntensity: 1,
  }),
  watermarkMaterial: new THREE.MeshPhongMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.6,
    reflectivity: 0.2,
    depthTest: true,
    specular: 1,
    side: THREE.DoubleSide,
  }),
  lineMaterial: new THREE.LineBasicMaterial({
    color: 0x0000ff,
  }),
  blackLineMaterial: new THREE.LineBasicMaterial({
    color: 0x000000,
  }),
  profileLineMaterial: new THREE.LineBasicMaterial({
    color: 0x5f78a2,
    side: THREE.DoubleSide,
  }),
  dashedLineMaterial: new THREE.LineDashedMaterial({
    color: 0x000000,
    linewidth: 4,
    scale: 10,
    dashSize: 3,
    gapSize: 1,
    depthTest: false,
  }),
  basicLineMaterial: new THREE.LineBasicMaterial({
    color: 0x3308ff,
    linewidth: 4,
    linecap: "round", //ignored by WebGLRenderer
    linejoin: "round", //ignored by WebGLRenderer
  }),
  exclamationMaterial: new THREE.LineDashedMaterial({
    color: 0xcd853f,
  }),
  notchMaterial: new THREE.MeshPhongMaterial({
    color: COLOR_WHITE,
  }),
  railsMaterial: new THREE.MeshLambertMaterial({
    color: 0xb2b1b1,
    reflectivity: 0.1,
    combine: THREE.MixOperation,
  }),
  rails_material_old: new THREE.MeshLambertMaterial({
    color: 0xd1d1d1,
    reflectivity: 0,
    combine: THREE.MixOperation,
  }),
  bodyMaterial: new THREE.MeshLambertMaterial({
    color: 0xdbdbdb,
    reflectivity: 0.03,
    combine: THREE.MixOperation,
  }),
  swingDirectionMaterial: new THREE.LineBasicMaterial({
    color: COLOR_TEXT_AA_BLUE,
  }),
};

export default MaterialLibrary;
