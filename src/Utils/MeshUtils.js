import * as THREE from "three";
import { BaseUnits } from "./BaseUnits";
const arrowGap = 0.2;
const createLine = function (start, end, color) {
  const material = new THREE.LineBasicMaterial({ color: color });
  const points = [];
  points.push(start);
  points.push(end);

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.Line(geometry, material);
};
const createLineDashed = function (points, color) {
  const material = new THREE.LineDashedMaterial({
    color: color,
    dashSize: 1,
    gapSize: 0.5,
  });
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  let line = new THREE.Line(geometry, material);
  line.computeLineDistances();
  return line;
};
const textMapCreate = function (text, color, fontstyle, Textwidth) {
  var bitmap = document.createElement("canvas");
  var g = bitmap.getContext("2d");
  if (Textwidth) {
    bitmap.width = Textwidth * 2;
    bitmap.height = Textwidth * 2;
  } else {
    bitmap.width = 1024;
    bitmap.height = 1024;
  }
  g.font = "Bold 70px Arial";
  if (fontstyle) g.font = fontstyle;
  g.fillStyle = color;
  g.textAlign = "center";
  g.fillText(text, bitmap.width / 2, bitmap.height / 2);
  g.strokeStyle = color;
  g.strokeText(text, bitmap.width / 2, bitmap.height / 2);

  var texture = new THREE.Texture(bitmap);
  texture.needsUpdate = true;
  return texture;
};
const textMapCreateRound = function (text, color) {
  var bitmap = document.createElement("canvas");
  var g = bitmap.getContext("2d");
  bitmap.width = 512;
  bitmap.height = 512;

  g.fillStyle = "#157fcc";
  g.beginPath();
  g.arc(256, 260, 60, 0, 2 * Math.PI);
  g.fill();

  g.font = "Bold 70px Arial";
  g.fillStyle = color;
  g.textAlign = "center";
  g.fillText(text, 256, 285);
  g.strokeStyle = color;
  g.strokeText(text, 256, 285);

  var texture = new THREE.Texture(bitmap);
  texture.needsUpdate = true;
  return texture;
};
const DrawCurve = function (
  location,
  startAngle,
  step,
  numstep,
  length,
  width
) {
  let curve = [];

  for (let i = 1; i < numstep; i++) {
    let angle = toRadians(startAngle);
    let x = Math.cos(angle) * length;
    let y = Math.sin(angle) * width;
    x += location.x;
    y += location.y;
    curve.push([x, y]);
    startAngle += step;
    if (startAngle >= 360) startAngle = 0;
  }

  return curve;
};
const toRadians = function (angle) {
  return angle * (Math.PI / 180);
};
const convertFeetInch = function (inches) {
  if (isFeetInch(inches)) return inches;
  let units = new BaseUnits();
  units.setValue(Number(inches * 3200));
  return units.toCM() + " cm";
};

const isFeetInch = function (input) {
  return /(?:-[ \t]*)?((?:\d+(?:\.\d*)?|(?:\d+[ \t]+)?\d+[ \t]*\/[ \t]*\d+)[ \t]*(?:[']|feet|ft\.?)(?:[ \t]*(?:-[ \t]*)?(?:\d+(?:\.\d*)?|(?:\d+[ \t]+)?\d+[ \t]*\/[ \t]*\d+)[ \t]*(?:["]|inch(?:es)?|in\.?))?|(?:\d+(?:\.\d*)?|(?:\d+[ \t]+)?\d+[ \t]*\/[ \t]*\d+)[ \t]*(?:["]|inch(?:es)?|in\.?))/.test(
    input.toString()
  );
};
const createLable = function (position, text, color, scale = 16) {
  const texturemap = textMapCreateRound(text, color);
  const textMaterial = new THREE.SpriteMaterial({
    map: texturemap,
    alphaTest: 0.3,
    transparent: true,
    side: THREE.FrontSide,
  });

  const textMesh = new THREE.Sprite(textMaterial);
  textMesh.position.set(position.x, position.y, position.z);
  textMesh.scale.set(scale, scale, scale);
  textMesh.name = "textmesh";
  return textMesh;
};
const createDimensionLine = function (
  start,
  end,
  color,
  scale = 16,
  textValue,
  borderlineColor
) {
  let measurement = new THREE.Group();
  let line = createLine(start, end, color);
  measurement.add(line);

  let dir1 = end.clone().sub(start).normalize();

  const length = start.clone().distanceTo(end);

  let dir2 = start.clone().sub(end).normalize();

  let text = convertFeetInch(length * 15);
  if (textValue) text = textValue;
  const texturemap = textMapCreate(text, color);
  const textMaterial = new THREE.SpriteMaterial({
    map: texturemap,
    alphaTest: 0.3,
    transparent: true,
    side: THREE.FrontSide,
  });

  const textMesh = new THREE.Sprite(textMaterial);
  var scalemat = new THREE.Matrix4().makeScale(2, 2, 2);
  textMesh.applyMatrix4(scalemat);
  // textMesh.scale.set(scale, scale, scale);
  textMesh.name = "textmesh";
  const origintext = start.clone().add(dir1.clone().multiplyScalar(length / 2));
  var transmat = new THREE.Matrix4().makeTranslation(
    origintext.x,
    origintext.y + 0.05,
    origintext.z
  );
  textMesh.applyMatrix4(transmat);
  // textMesh.position.set(origintext.x, origintext.y, origintext.z);
  if (dir1.y === 1) {
    textMesh.material.rotation = Math.PI / 2;
  }

  measurement.add(textMesh);
  if (dir1.z === 1 || dir1.x === 1) {
    let lineleft = createLine(
      new THREE.Vector3(start.x, start.y - 0.1, start.z),
      new THREE.Vector3(start.x, start.y + 0.1, start.z),
      borderlineColor ? borderlineColor : color
    );
    measurement.add(lineleft);
    let lineright = createLine(
      new THREE.Vector3(end.x, end.y - 0.1, end.z),
      new THREE.Vector3(end.x, end.y + 0.1, end.z),
      borderlineColor ? borderlineColor : color
    );
    measurement.add(lineright);
  } else {
    let lineleft = createLine(
      new THREE.Vector3(start.x - 0.1, start.y, start.z),
      new THREE.Vector3(start.x + 0.1, start.y, start.z),
      borderlineColor ? borderlineColor : color
    );
    measurement.add(lineleft);
    let lineright = createLine(
      new THREE.Vector3(end.x - 0.1, end.y, end.z),
      new THREE.Vector3(end.x + 0.1, end.y, end.z),
      borderlineColor ? borderlineColor : color
    );
    measurement.add(lineright);
  }
  return measurement;
};
const createDimensionLineText = function (
  start,
  end,
  color,
  scale = 16,
  textValue
) {
  let measurement = new THREE.Group();
  let line = createLine(start, end, color);
  measurement.add(line);
  let capHeight = 0.15;
  let dir1 = end.clone().sub(start).normalize();

  const length = start.clone().distanceTo(end);

  let dir2 = start.clone().sub(end).normalize();

  let textDim = convertFeetInch(length);
  let fontstyle = "72px Arial";
  const Dimtexturemap = textMapCreate(textDim, color, fontstyle);
  const textDimMaterial = new THREE.SpriteMaterial({
    map: Dimtexturemap,
    alphaTest: 0.3,
    transparent: true,
    side: THREE.FrontSide,
  });
  const textDimMesh = new THREE.Sprite(textDimMaterial);
  var scalemat = new THREE.Matrix4().makeScale(scale, scale, scale);
  textDimMesh.applyMatrix4(scalemat);
  // textMesh.scale.set(scale, scale, scale);
  textDimMesh.name = "textmesh";

  const texturemap = textMapCreate(textValue, color, fontstyle);
  const textMaterial = new THREE.SpriteMaterial({
    map: texturemap,
    alphaTest: 0.3,
    transparent: true,
    side: THREE.FrontSide,
  });

  const textLabelMesh = new THREE.Sprite(textMaterial);
  textLabelMesh.applyMatrix4(scalemat);
  // textMesh.scale.set(scale, scale, scale);
  textLabelMesh.name = "textmesh";
  const origintext = start.clone().add(dir1.clone().multiplyScalar(length / 2));
  let transmat = new THREE.Matrix4().makeTranslation(
    origintext.x,
    origintext.y + capHeight * 2,
    origintext.z
  );
  if (Math.abs(dir1.y === 1)) {
    transmat = new THREE.Matrix4().makeTranslation(
      origintext.x + capHeight * 2,
      origintext.y,
      origintext.z
    );
  }
  textLabelMesh.applyMatrix4(transmat);
  textDimMesh.applyMatrix4(transmat);
  // textMesh.position.set(origintext.x, origintext.y, origintext.z);
  if (Math.abs(dir1.y) === 1) {
    textLabelMesh.material.rotation = Math.PI / 2;
    textDimMesh.material.rotation = Math.PI / 2;
  }

  // measurement.add(textMesh);
  if (Math.abs(dir1.y) === 1) {
    let lineleft = createLine(
      new THREE.Vector3(start.x - capHeight, start.y, start.z),
      new THREE.Vector3(start.x + capHeight, start.y, start.z),
      color
    );
    measurement.add(lineleft);
    let lineright = createLine(
      new THREE.Vector3(end.x - capHeight, end.y, end.z),
      new THREE.Vector3(end.x + capHeight, end.y, end.z),
      color
    );
    measurement.add(lineright);
  } else {
    let lineleft = createLine(
      new THREE.Vector3(start.x, start.y - capHeight, start.z),
      new THREE.Vector3(start.x, start.y + capHeight, start.z),
      color
    );
    measurement.add(lineleft);
    let lineright = createLine(
      new THREE.Vector3(end.x, end.y - capHeight, end.z),
      new THREE.Vector3(end.x, end.y + capHeight, end.z),
      color
    );
    measurement.add(lineright);
  }

  return { measurement, Label: textLabelMesh, Dim: textDimMesh };
};
const createText = function (text, color, scale, fontstyle, Textwidth) {
  const texturemap = textMapCreate(text, color, fontstyle, Textwidth);
  const textMaterial = new THREE.SpriteMaterial({
    map: texturemap,
    alphaTest: 0.3,
    transparent: true,
    side: THREE.FrontSide,
  });

  const textMesh = new THREE.Sprite(textMaterial);
  if (Textwidth)
    textMesh.scale.set(Textwidth / 10, Textwidth / 10, Textwidth / 10);
  else textMesh.scale.set(scale, scale, scale);
  textMesh.name = "textmesh";
  return textMesh;
};
const createDimension = function (start, end, color, scale = 16) {
  let measurement = new THREE.Group();
  let dir1 = end.clone().sub(start).normalize();

  const length = start.clone().distanceTo(end);
  const origin1 = start
    .clone()
    .add(dir1.clone().multiplyScalar(length / 2 + arrowGap * 2));
  const hex = color;

  const arrowHelper = new THREE.ArrowHelper(
    dir1,
    origin1,
    length / 2 - arrowGap * 2,
    hex,
    0.1,
    0.1
  );
  measurement.add(arrowHelper);
  let dir2 = start.clone().sub(end).normalize();
  const origin2 = end
    .clone()
    .add(dir2.clone().multiplyScalar(length / 2 + arrowGap * 2));
  const arrowHelper2 = new THREE.ArrowHelper(
    dir2,
    origin2,
    length / 2 - arrowGap * 2,
    hex,
    0.1,
    0.1
  );
  measurement.add(arrowHelper2);
  const text = convertFeetInch(length);
  const texturemap = textMapCreate(text, color);
  const textMaterial = new THREE.SpriteMaterial({
    map: texturemap,
    alphaTest: 0.3,
    transparent: true,
    side: THREE.FrontSide,
  });

  const textMesh = new THREE.Sprite(textMaterial);
  textMesh.scale.set(scale, scale, scale);
  textMesh.name = "textmesh";
  const origintext = end.clone().add(dir2.clone().multiplyScalar(length / 2));
  textMesh.position.set(origintext.x, origintext.y, origintext.z);
  if (dir1.y === 1) textMesh.material.rotation = Math.PI / 2;
  measurement.add(textMesh);
  return measurement;
};
export {
  createLine,
  createLineDashed,
  createDimensionLineText,
  createText,
  createLable,
  textMapCreate,
  createDimension,
  DrawCurve,
  toRadians,
  convertFeetInch,
  createDimensionLine,
};
