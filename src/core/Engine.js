import * as TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import Box3Extension from "../Utils/Box3Extension";
import {
  COLOR_ALICE_BLUE,
  COLOR_GRAY,
  COLOR_WHITE,
  DOOR_STYLES,
  HANDING_RH_LH,
} from "../Utils/Common";
import { DebugEnvironment } from "three/examples/jsm/environments/DebugEnvironment";
import { RGBMLoader } from "three/examples/jsm/loaders/RGBMLoader";
import CameraControls from "camera-controls";
import LockerProperty from "./LockerProperty";
import {
  createDimension,
  createDimensionLine,
  toRadians,
} from "../Utils/MeshUtils";
import { jsPDF } from "jspdf";
CameraControls.install({ THREE: THREE });

export const getIsRight = function (updateframe) {
  let worldpos = new THREE.Vector3();
  updateframe.getWorldPosition(worldpos);
  return worldpos.x > 0;
};
export const isNumber = function (n) {
  return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
};
const clock = new THREE.Clock();
export default class Engine {
  constructor(canvasID, filePath) {
    this.renderer = null;
    this.camera = null;
    this.light = null;
    this.scene = null;
    this.controls = null;
    this.CanvasContainer = document.querySelector(`#${canvasID}`);
    this.render = this.render.bind(this);
    this.RotationIsForward = true;
    this.doors = null;
    this.remainingval = 0;
    this.Jsondata = null;
    this.selectedPanel = null;
    this.joints = null;
    this.measurements = true;
    this.identifiers = false;
    this.showType = "doorsFrames";
    this.isSecure = true;
    this.intersectPoint = null;
    this.locker = null;
    this.rows = 2;
    this.cols = 1;
    this.allLockers = null;
    this.rgbmCubeRenderTarget = null;
    this.Is30cm = true;
    this.mouseX = 0;
    this.rootPath = filePath;
    this.Isbackground1 = true;
    this.background1 = null;
    this.background2 = null;
    this.backgroundSelected = 3;
    this.terminalsData = [];
  }

  trimCanvas(c) {
    const ctx = c.getContext("webgl2"); // Get WebGLRenderingContext
    const trimmedCtx = document.createElement("canvas").getContext("2d");

    const pixels = new Uint8Array(
      ctx.drawingBufferWidth * ctx.drawingBufferHeight * 4
    );
    ctx.readPixels(
      0,
      0,
      ctx.drawingBufferWidth,
      ctx.drawingBufferHeight,
      ctx.RGBA,
      ctx.UNSIGNED_BYTE,
      pixels
    );
    const l = pixels.length;

    // Bound to store valid Left/Right/Top/Bottom for elevation drawing
    const bound = {
      top: null,
      left: null,
      right: null,
      bottom: null,
    };
    let _x, _y;

    // Iterate over every pixel to find the highest and where it ends on every axis to remove the white space
    for (let i = 0; i < l; i += 4) {
      if (pixels[i + 3] !== 0) {
        _x = (i / 4) % c.width;
        _y = ~~(i / 4 / c.width);

        if (bound.top === null) {
          bound.top = _y;
        }

        if (bound.left === null || _x < bound.left) {
          bound.left = _x;
        }

        if (bound.right === null || bound.right < _x) {
          bound.right = _x;
        }

        if (bound.bottom === null || bound.bottom < _y) {
          bound.bottom = _y;
        }
      }
    }

    // Calculate the height and width of the content
    const trimHeight = bound.bottom - bound.top;
    const trimWidth = bound.right - bound.left;
    const trimmedPixels = new Uint8Array(trimWidth * trimHeight * 4);
    ctx.readPixels(
      bound.left,
      bound.top,
      trimWidth,
      trimHeight,
      ctx.RGBA,
      ctx.UNSIGNED_BYTE,
      trimmedPixels
    );

    // Generated data is flipped vertically, to remove that change looping data to revert it to original position
    // const bytesPerRow = trimWidth * 4;
    // const temp = new Uint8Array(bytesPerRow);
    // for (let i = 0; i < trimHeight / 2; i++) {
    //     const topOffset = i * bytesPerRow;
    //     const bottomOffset = (trimHeight - i - 1) * bytesPerRow;
    //     temp.set(trimmed.subarray(topOffset, topOffset + bytesPerRow));
    //     trimmed.copyWithin(topOffset, bottomOffset, bottomOffset + bytesPerRow);
    //     trimmed.set(temp, bottomOffset);
    // }

    // Set properties for 2D Canvas
    trimmedCtx.canvas.width = trimWidth;
    trimmedCtx.canvas.height = trimHeight;

    // Copy data from trimmed canvas context
    const imageData = trimmedCtx.createImageData(trimWidth, trimHeight);
    // Copy data from trimmed canvas context
    // const imageData = trimmedCtx.getImageData(0, 0, trimWidth, trimHeight);

    // Set pixels in imageData; It is creating color to change for transparent objects
    imageData.data.set(trimmedPixels);

    trimmedCtx.putImageData(imageData, 0, 0);

    // Generated data is flipped vertically, to remove that change looping data to revert it to original position
    trimmedCtx.globalCompositeOperation = "copy";
    trimmedCtx.scale(1, -1); // Y flip
    trimmedCtx.translate(0, -imageData.height); // so we can draw at 0,0
    trimmedCtx.drawImage(trimmedCtx.canvas, 0, 0);

    // Return trimmed canvas
    return trimmedCtx.canvas;
  }

  Dispose() {
    console.log("dispose renderer!");
    this.renderer.dispose();

    this.scene.traverse((object) => {
      if (!object.isMesh) return;

      console.log("dispose geometry!");
      object.geometry.dispose();

      if (object.material.isMaterial) {
        this.cleanMaterial(object.material);
      } else {
        // an array of materials
        for (const material of object.material) cleanMaterial(material);
      }
    });
  }

  cleanMaterial(material) {
    console.log("dispose material!");
    material.dispose();

    // dispose textures
    for (const key of Object.keys(material)) {
      const value = material[key];
      if (value && typeof value === "object" && "minFilter" in value) {
        console.log("dispose texture!");
        value.dispose();
      }
    }
  }

  captureImage() {
    this.renderer.render(this.scene, this.camera);
    const trimmedCanvas = this.trimCanvas(this.renderer.domElement);
    let imgData = trimmedCanvas.toDataURL("png");
    return imgData.replace("data:image/png;base64,", "");
  }

  async initEngine() {
    this.renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(
      this.CanvasContainer.offsetWidth,
      this.CanvasContainer.offsetHeight
    );
    this.renderer.shadowMap.enabled = true;
    this.CanvasContainer.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      40,
      this.CanvasContainer.offsetWidth / this.CanvasContainer.offsetHeight,
      0.1,
      1000
    );
    this.camera.lookAt(new THREE.Vector3(0, 10, -20));
    this.camera.position.set(0, 10, 30);

    // this.controls = new CameraControls(this.camera, this.renderer.domElement);
    // this.controls.minPolarAngle = Math.PI / 4;
    // this.controls.maxPolarAngle = Math.PI / 2;
    // this.controls.minAzimuthAngle = -Math.PI / 4;
    // this.controls.maxAzimuthAngle = Math.PI / 4;
    // this.controls.setOrbitPoint(0, 20, 0);
    // this.controls.dampingFactor = 0.01;
    // this.controls.mouseButtons.wheel = CameraControls.ACTION.NONE;

    // const frustumSize = 70;
    // const aspect =
    //   this.CanvasContainer.offsetWidth / this.CanvasContainer.offsetHeight;
    // this.camera = new THREE.OrthographicCamera(
    //   (frustumSize * aspect) / -2,
    //   (frustumSize * aspect) / 2,
    //   frustumSize / 2,
    //   frustumSize / -2,
    //   1,
    //   1000
    // );

    // this.camera.position.set(0, 10, 50);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(COLOR_ALICE_BLUE);

    // this.controls = new TrackballControls(
    //   this.camera,
    //   this.renderer.domElement
    // );

    // this.controls.rotateSpeed = 1.0;
    // this.controls.zoomSpeed = 1.2;
    // this.controls.panSpeed = 0.8;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    // this.controls.enableDamping = true;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 0.001;
    this.controls.maxDistance = 150;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minPolarAngle = Math.PI / 2 - 0.35;
    this.controls.maxAzimuthAngle = Math.PI / 2 - 0.7;
    this.controls.minAzimuthAngle = -Math.PI / 2 + 0.7;
    this.controls.dampingFactor = 0.01;
    this.controls.rotateSpeed = 0.3;
    // this.controls.enableZoom = false;
    // this.controls.maxZoom = 5;
    // this.controls.minZoom = 1;
    // this.controls = new TrackballControls(
    //   this.camera,
    //   this.renderer.domElement
    // );
    // this.controls.minDistance = 0.01;
    // this.controls.maxDistance = 100;
    // this.controls.maxPolarAngle = Math.PI / 2;
    // this.controls.minPolarAngle = Math.PI / 2 - 0.2;
    // this.controls.maxAzimuthAngle = Math.PI / 2 - 1.2;
    // this.controls.minAzimuthAngle = -Math.PI / 2 + 0.8;
    // this.controls.rotateSpeed = 1.0;
    // this.controls.zoomSpeed = 1.2;
    // this.controls.panSpeed = 0.8;
    // this.controls.noZoom = true;
    // this.controls.noPan = false;
    // this.controls.staticMoving = true;
    // this.controls.dynamicDampingFactor = 0.3;

    this.light = new THREE.AmbientLight(COLOR_GRAY, 1);
    this.scene.add(this.light);

    this.light = new THREE.DirectionalLight(COLOR_WHITE);
    this.light.position.set(0, -40, 100);
    this.light.intensity = 0.1;
    this.scene.add(this.camera);
    this.terminals = [];
    const geometry = new THREE.PlaneGeometry(1000, 1000);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffff00,
      opacity: 0.5,
      side: THREE.DoubleSide,
      transparent: true,
    });
    this.Hiddenplane = new THREE.Mesh(geometry, material);
    this.Hiddenplane.position.set(0, 0, -44);
    this.Hiddenplane.visible = false;
    this.scene.add(this.Hiddenplane);
    // this.scene.add(this.light);
    this.render();
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileCubemapShader();

    const rgbeLoader = new RGBELoader().setPath(
      this.rootPath + "textures/equirectangular/"
    );
    // const [texture] = await Promise.all([
    //   rgbeLoader.loadAsync("venice_sunset_1k.hdr"),
    // ]);
    let texture = await new THREE.TextureLoader().load(
      this.rootPath + "textures/texture.jpg"
    );
    texture.mapping = THREE.EquirectangularReflectionMapping;

    this.scene.background = texture;
    this.scene.environment = texture;

    let _this = this;
    const rgbmUrls = [
      "px.png",
      "nx.png",
      "py.png",
      "ny.png",
      "pz.png",
      "nz.png",
    ];
    let rgbmCubeMap = new RGBMLoader()
      .setMaxRange(16)
      .setPath(this.rootPath + "textures/pisaRGBM16/")
      .loadCubemap(rgbmUrls, function () {
        _this.rgbmCubeRenderTarget = rgbmCubeMap; // pmremGenerator.fromCubemap( rgbmCubeMap );
        console.log(_this.rgbmCubeRenderTarget);
      });
    this.bodyColor = "rgb(248, 248, 248)";
    this.doorColor = "rgb(56, 62, 66)";
    this.bodyColorName = "White";
    this.doorColorName = "Anthracite";
    // this.renderer.domElement.addEventListener("mousedown", (event) => {
    //   this.onClick(event);
    // });
    // this.renderer.domElement.addEventListener("mouseup", (event) => {
    //   this.mouseUp(event);
    // });
    this.renderer.domElement.addEventListener("mousemove", (event) => {
      this.mouseMove(event);
    });
    this.renderer.domElement.addEventListener("resize", (event) => {
      this.onWindowResize();
    });
  }

  onWindowResize() {
    this.renderer.setSize(
      this.CanvasContainer.offsetWidth,
      this.CanvasContainer.offsetHeight
    );

    this.camera.aspect =
      this.CanvasContainer.offsetWidth / this.CanvasContainer.offsetHeight;
    this.camera.updateProjectionMatrix();
  }
  render() {
    TWEEN.update();
    this.renderer.render(this.scene, this.camera);
    // if (this.controls?.enabled) this.controls.update();
    if (this.controls) {
      const delta = clock.getDelta();
      const hasControlsUpdated = this.controls.update(delta);
    }

    // this.camera.position.set(
    //   this.camera.position.x + (this.mouseX - this.camera.position.x) * 0.5,
    //   this.camera.position.y,
    //   this.camera.position.z
    // );

    requestAnimationFrame(this.render);
  }
  addRow() {
    if (this.rows < 10) this.loadColumns(this.rows + 1, this.cols);
  }
  removeRow() {
    if (this.rows > 1) this.loadColumns(this.rows - 1, this.cols);
  }
  addCol() {
    this.loadColumns(this.rows, this.cols + 1, true);
  }
  removeCol() {
    this.loadColumns(this.rows, this.cols - 1, true);
  }
  SendUpdatedJson(keys, access, extras) {
    let ndata = this.getUpdatedJson(keys, access, extras);
    window.parent.postMessage({ type: "JsonData", data: ndata }, "*");
  }
  getUpdatedJson(keys, access, extras) {
    let ndata = new LockerProperty();
    ndata.BodyColor = this.bodyColorName;
    ndata.BodyMaterial = this.BodyMaterial;
    ndata.DoorColor = this.doorColorName;
    ndata.DoorMaterial = this.DoorMaterial;
    ndata.Rows = this.rows;
    ndata.Cols = this.cols;
    ndata.KeySystem = keys;
    ndata.AccessoriesTop = this.currentAccessoryTop;
    ndata.AccessoriesBottom = this.currentAccessoryBottom;
    ndata.totalTerminals = this.terminals.length;
    ndata.Extras = extras;
    return ndata;
  }
  LoadLocker(data) {
    let nData = new LockerProperty(data);
    this.changeBodyMaterial(nData.BodyMaterial);
    this.changeDoorMaterial(nData.DoorMaterial);
    this.changeDoorColor(nData.DoorColor);
    this.changeSkinColor(nData.BodyColor);
    this.loadColumns(nData.Rows, nData.Cols);
    console.log(nData);
  }
  changeSkinColor(color, name) {
    let bodyMesh = null;
    if (this.Is30cm) bodyMesh = this.locker1.getObjectByName("body");
    else bodyMesh = this.locker2.getObjectByName("body");
    console.log(bodyMesh.material);
    if (this.BodyMaterial === "Wood") {
      new THREE.TextureLoader().load(color, (texture) => {
        bodyMesh.material.map = texture;
        bodyMesh.material.needsUpdate = true;
        this.loadColumns(this.rows, this.cols);
      });
    } else {
      bodyMesh.material.color = new THREE.Color(color);
      this.loadColumns(this.rows, this.cols);
    }

    this.bodyColor = color;
    this.bodyColorName = name;
  }
  changeDoorColor(color, name) {
    let bodyMesh = null;
    if (this.Is30cm) bodyMesh = this.locker1.getObjectByName("door");
    else bodyMesh = this.locker2.getObjectByName("door");
    console.log(bodyMesh.material);
    if (this.DoorMaterial === "Wood") {
      new THREE.TextureLoader().load(color, (texture) => {
        bodyMesh.material.map = texture;
        bodyMesh.material.needsUpdate = true;
        this.loadColumns(this.rows, this.cols);
      });
    } else {
      bodyMesh.material.color = new THREE.Color(color);
      this.loadColumns(this.rows, this.cols);
    }

    this.doorColor = color;
    this.doorColorName = name;
  }
  changeDoorMaterial(type) {
    let bodyMesh = null;
    if (this.Is30cm) bodyMesh = this.locker1.getObjectByName("door");
    else bodyMesh = this.locker2.getObjectByName("door");
    this.changeMaterial(type, bodyMesh, this.doorColor);
    this.DoorMaterial = type;
    this.loadColumns(this.rows, this.cols);
  }
  changeMaterial(type, mesh, color) {
    if (type === "Wood") {
      new THREE.TextureLoader().load(
        this.rootPath + "textures/wooden/Halifax Eik Wit.jpg",
        (texture) => {
          console.log(texture);
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
          const material = new THREE.MeshPhongMaterial({
            color: "white",
            roughness: 0.8,
            map: texture,
            side: THREE.DoubleSide,
          });
          mesh.material = material;
          mesh.material.needsUpdate = true;
          this.loadColumns(this.rows, this.cols);
        }
      );
    } else if (type === "Steel") {
      let material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0,
        metalness: 0.2,
        normalScale: new THREE.Vector2(1, -1),
        envMapIntensity: 0.5,
        side: THREE.DoubleSide,
      });
      mesh.material = material;
      mesh.material.needsUpdate = true;
    } else if (type === "Aluminium") {
      let material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.8,
        metalness: 0.1,
        normalScale: new THREE.Vector2(1, -1),
        envMapIntensity: 0.5,
        side: THREE.DoubleSide,
      });
      mesh.material = material;
      mesh.material.needsUpdate = true;
    } else if (type === "Glass") {
      let material = new THREE.MeshPhysicalMaterial({
        metalness: 0.9,
        roughness: 0.4,
        color: color,
        envMapIntensity: 0.9,
        clearcoat: 1,
        transparent: true,
        // transmission: .95,
        opacity: 0.5,
        reflectivity: 0.2,
        refractionRatio: 0.985,
        ior: 0.9,
        side: THREE.DoubleSide,
      });

      mesh.material = material;
      mesh.material.needsUpdate = true;
    }
  }
  changeBodyMaterial(type) {
    let bodyMesh = null;
    if (this.Is30cm) bodyMesh = this.locker1.getObjectByName("body");
    else bodyMesh = this.locker2.getObjectByName("body");
    this.changeMaterial(type, bodyMesh, this.bodyColor);
    this.BodyMaterial = type;
    this.loadColumns(this.rows, this.cols);
  }
  diposeObjects(objectToDispose) {
    objectToDispose.traverse((object) => {
      if (!object.isMesh) return;

      console.log("dispose geometry!");
      object.geometry.dispose();

      if (object.material.isMaterial) {
        this.cleanMaterial(object.material);
      } else {
        // an array of materials
        for (const material of object.material) cleanMaterial(material);
      }
    });
  }
  ChangeWidth(val) {
    this.Is30cm = val;
    this.loadColumns(this.rows, this.cols);
    this.changeBodyMaterial(this.BodyMaterial);
    this.changeDoorMaterial(this.DoorMaterial);
    this.changeDoorColor(this.doorColor);
    this.changeSkinColor(this.bodyColor);
  }
  loadColumns(row, col, fromAddCol = false) {
    if (this.allLockers) {
      this.diposeObjects(this.allLockers);

      this.scene.remove(this.allLockers);
    }
    this.allLockers = new THREE.Group();
    this.allLockers.scale.set(8, 8, 8);
    this.allLockers.position.set(0, -33, -50);
    this.scene.add(this.allLockers);
    let bbx = new THREE.Box3();
    if (this.Is30cm) Box3Extension.setFromObject(bbx, this.locker1, true);
    else Box3Extension.setFromObject(bbx, this.locker2, true);
    let size = new THREE.Vector3();
    bbx.getSize(size);
    console.log(size);
    let xcord = 0;
    let ycord = 0;
    this.rows = row;
    this.cols = col;
    let locker2 = null;
    if (this.Is30cm) locker2 = this.locker1.clone();
    else locker2 = this.locker2.clone();
    console.log(locker2);
    let bodyMesh = locker2.children.filter((item) =>
      item.name.includes("body")
    );
    let doorMesh = locker2.children.filter((item) =>
      item.name.includes("door")
    )[0];
    let lockMesh = locker2.children.filter((item) =>
      item.name.includes("lock")
    )[0];
    let slabMesh = locker2.children.filter((item) =>
      item.name.includes("slab")
    )[0];
    slabMesh.material = bodyMesh[0].material.clone();
    let lockerGroup = new THREE.Group();
    bodyMesh.forEach((item) => {
      item.material = bodyMesh[0].material;
      lockerGroup.add(item);
    });

    // bodyMesh.visible = false;
    this.allLockers.add(lockerGroup);
    let bodybbx = new THREE.Box3();
    Box3Extension.setFromObject(bodybbx, bodyMesh[0], true);
    let sizeLocker = new THREE.Vector3();

    let door1 = doorMesh.clone();
    if (this.DoorMaterial === "Wood") {
      door1.scale.set(1, 1 / this.rows, 1);
      door1.scale.set(1.14, door1.scale.y + 0.03 / this.rows, 1);
    } else {
      door1.scale.set(1, 1 / this.rows, 1);
    }
    door1.position.set(0, 0, 0);
    bodybbx.getSize(sizeLocker);
    var Doorpivot = new THREE.Group();
    // Doorpivot.rotation.set(0, Math.PI / 2, 0);
    door1.position.set(-0.4, 0, -0.75);
    Doorpivot.position.set(0.4, 0, 0.75);
    Doorpivot.add(door1);
    let xoffset = sizeLocker.x;
    // Doorpivot.rotation.set(0, Math.PI / 2, 0);
    let topOffset = sizeLocker.y / row;
    let height = topOffset;
    let doorbbx = null;
    let widthLock = sizeLocker.x - 0.25;
    doorbbx = new THREE.Box3();
    Box3Extension.setFromObject(doorbbx, Doorpivot, true);
    let center = doorbbx.getCenter(new THREE.Vector3());
    let iswood = false;
    if (this.DoorMaterial === "Wood" || this.BodyMaterial === "Wood")
      iswood = true;
    let dimension = createDimensionLine(
      new THREE.Vector3(
        center.x - widthLock / 2,
        sizeLocker.y / row - height + 0.1,
        center.z - 0.3
      ),
      new THREE.Vector3(
        center.x + widthLock / 2,
        sizeLocker.y / row - height + 0.1,
        center.z - 0.3
      ),
      "white",
      16,
      this.Is30cm
        ? iswood
          ? "26.4 CM"
          : "29.5 CM"
        : iswood
        ? "36.4 CM"
        : "39.5 CM"
    );

    // dimension.scale.set(0.1, 0.1, 0.1);
    // lockerGroup.add(dimension);if
    let offsetWidth = 0,
      offsetHeight = 0;
    let heightdiif = 0;
    if (this.currentAccessoryTop) {
      let topOfffset = this.addAccesories(
        this.currentAccessoryTop,
        lockerGroup,
        bodyMesh,
        sizeLocker
      );
      offsetHeight += topOfffset.offsetHeight;
      offsetWidth += topOfffset.offsetWidth;
      heightdiif += topOfffset.heightdiif;
    }
    if (this.currentAccessoryBottom) {
      let topOfffset = this.addAccesories(
        this.currentAccessoryBottom,
        lockerGroup,
        bodyMesh,
        sizeLocker
      );
      offsetHeight += topOfffset.offsetHeight;
      offsetWidth += topOfffset.offsetWidth;
      heightdiif += topOfffset.heightdiif;
    }

    for (let i = 0; i < row; i++) {
      let door1Mesh = Doorpivot.clone();
      door1Mesh.position.set(
        door1Mesh.position.x,
        topOffset - height,
        door1Mesh.position.z
      );
      door1Mesh.children[0].userData.row = i;
      lockerGroup.add(door1Mesh);

      if (i < row - 1) {
        let slab1 = slabMesh.clone();
        slab1.position.set(0, topOffset - 0.1, 0);
        lockerGroup.add(slab1);
      }
      let dimWidth = dimension.clone();
      dimWidth.position.set(
        dimWidth.position.x,
        dimWidth.position.y + topOffset - height,
        dimWidth.position.z
      );
      lockerGroup.add(dimWidth);
      // door1Mesh.children[0].scale.set(1, this.rows, 1);
      doorbbx = new THREE.Box3();
      Box3Extension.setFromObject(doorbbx, door1Mesh, true);
      let sizeDoor = new THREE.Vector3();
      doorbbx.getSize(sizeDoor);

      let lock1 = lockMesh.clone();
      lock1.position.set(0, 2.5, 0);
      door1Mesh.children[0].add(lock1);

      topOffset += height;
    }
    lockerGroup.traverse((item) => {
      if (item instanceof THREE.Mesh) {
        if (item.name.includes("door")) item.userData.col = 0;
      }
    });
    for (let j = 1; j < col; j++) {
      let locker2 = lockerGroup.clone();

      locker2.traverse((item) => {
        if (item instanceof THREE.Mesh) {
          if (item.name.includes("door")) item.userData.col = j;
          item.material = item.material.clone();
        }
      });

      locker2.position.set(xoffset, 0, 0);
      this.allLockers.add(locker2);
      xoffset += sizeLocker.x;
    }

    let bbxWorld = new THREE.Box3();
    Box3Extension.setFromObject(bbxWorld, this.allLockers, true);
    let sizeWorld = new THREE.Vector3();
    bbxWorld.getSize(sizeWorld);
    console.log(sizeWorld);
    this.allLockers.position.set(
      this.allLockers.position.x - sizeWorld.x / 2,
      this.allLockers.position.y,
      this.allLockers.position.z
    );

    if (this.cols > 30) {
      this.background.scale.set(0.03 * this.cols, 1, 1);
      // let extending = ["top", "front", "back", "ground"];
      // let extMesh = this.background.children.filter((item) =>
      //   extending.includes(item.name)
      // );
      // let right = this.background.children.filter((item) =>
      //   item.name.includes("right")
      // )[0];
      // // right.visible = false;
      // right.position.set(sizeWorld.x - 100, 0, 0);
      // //  let front= this.background.children.filter((item)=> item.name.includes("front"))[0]
      // //  let back= this.background.children.filter((item)=> item.name.includes("back"))[0]
      // //  let ground= this.background.children.filter((item)=> item.name.includes("ground"))[0]
      // let childLength = (sizeWorld.x + 150) / this.bgSize.x;
      // for (let i = 0; i < extMesh.length; i++) {
      //   let child = extMesh[i];
      //   child.remove(...extMesh[i].children);
      //   let childApend = child;
      //   for (let j = 0; j < childLength; j++) {
      //     childApend = this.appendChild(childApend);
      //   }
      // }
    }

    console.log(this.background);
    // this.allLockers.position.set(-sizeWorld.x, -38, -140);
    // for (let i = 0; i < row; i++) {
    //   xcord = -size.x;
    //   if (i !== 0) ycord += size.y;
    //   for (let j = 0; j < col; j++) {
    //     // if(i===0&&j===0){
    //     //   xcord+=size.x;
    //     //   continue
    //     // }
    //     xcord += size.x;
    //     let locker2 = this.locker.clone();
    //     locker2.position.set(
    //       locker2.position.x + xcord,
    //       locker2.position.y + ycord,
    //       locker2.position.z
    //     );
    //     this.allLockers.add(locker2);
    //   }
    //   let Allbbx = new THREE.Box3();
    //   Box3Extension.setFromObject(Allbbx, this.allLockers, true);
    //   let sizeAll = new THREE.Vector3();
    //   Allbbx.getSize(sizeAll);
    //   // this.allLockers.position.set(this.allLockers.position.x-sizeAll.x,this.allLockers.position.y,this.allLockers.position.z)
    // }

    if (this.onUpdateChange) this.onUpdateChange();
    //  let locker2= this.locker.clone();
    //  locker2.position.set(locker2.position.x+size.x,locker2.position.y,locker2.position.z);
    //  this.scene.add(locker2)
    //  let locker3= this.locker.clone();
    //  locker3.position.set(locker3.position.x,locker3.position.y+size.y,locker3.position.z);
    //  this.scene.add(locker3)
    //  let locker4= this.locker.clone();
    //  locker4.position.set(locker3.position.x,locker3.position.y+size.y,locker3.position.z);
    //  this.scene.add(locker4)

    // let widthLock = sizeWorld.x - 0.25;
    // let centerworld = bbxWorld.getCenter(new THREE.Vector3());
    let xpos = -sizeWorld.x / 2;
    xpos *= 0.065;
    // let yoffset = 33 + this.allLockers.position.y;
    // yoffset *= 0.2;
    console.log(offsetWidth, offsetHeight);
    if (this.dimensionwidth)
      this.dimensionwidth.parent.remove(this.dimensionwidth);
    if (this.Is30cm) {
      this.dimensionwidth = createDimensionLine(
        new THREE.Vector3(+3, offsetWidth + 0.5, xpos - 0.25),
        new THREE.Vector3(3, offsetWidth + 0.5, xpos - 0.25 + 0.45 * this.cols),
        "red",
        45,
        this.cols * 30 + " CM",
        "blue"
      );
    } else {
      this.dimensionwidth = createDimensionLine(
        new THREE.Vector3(3, offsetWidth + 0.5, xpos - 0.25),
        new THREE.Vector3(3, offsetWidth + 0.5, xpos - 0.25 + 0.5 * this.cols),
        "red",
        45,
        this.cols * 40 + " CM",
        "blue"
      );
    }

    this.dimensionwidth.scale.set(15, 15, 15);
    this.dimensionwidth.rotation.y = Math.PI / 2;
    this.scene.add(this.dimensionwidth);

    if (this.dimensionheight)
      this.dimensionheight.parent.remove(this.dimensionheight);
    this.dimensionheight = createDimensionLine(
      new THREE.Vector3(xpos - 0.5, 0.25 + offsetHeight, -3),
      new THREE.Vector3(xpos - 0.5, -2.2, -3),
      "red",
      45,
      180 + heightdiif + " CM",
      "blue"
    );
    this.dimensionheight.scale.set(15, 15, 15);
    // this.dimensionheight.rotation.y = Math.PI / 2;
    this.scene.add(this.dimensionheight);
    this.moveTerminal(fromAddCol);
  }
  addAccesories(accessory, lockerGroup, bodyMesh, sizeLocker) {
    let offsetWidth = 0,
      offsetHeight = 0,
      heightdiif = 0;
    switch (accessory) {
      case "Slanted roof": {
        let slopetop = this.slopetop.clone();
        console.log(slopetop);
        slopetop.scale.set(1, 1, 1);
        if (!this.Is30cm) slopetop.scale.set(1.25, 1, 1);
        slopetop.children[0].material = bodyMesh[0].material;
        slopetop.position.set(
          slopetop.position.x,
          sizeLocker.y,
          slopetop.position.z
        );
        lockerGroup.add(slopetop.clone());
        offsetWidth = 0.2;
        offsetHeight = 0.3;
        heightdiif = 20;
        break;
      }
      case "Sloping roof 80 cm": {
        let slopetop = this.slopetop.clone();
        console.log(slopetop);
        slopetop.scale.set(1, 1.5, 1);
        if (!this.Is30cm) slopetop.scale.set(1.25, 1.5, 1);
        slopetop.children[0].material = bodyMesh[0].material;
        slopetop.position.set(
          slopetop.position.x,
          sizeLocker.y,
          slopetop.position.z
        );
        lockerGroup.add(slopetop.clone());
        offsetWidth = 0.5;
        offsetHeight = 0.5;
        heightdiif = 40;
        break;
      }
      case "Sloping roof 120 cm": {
        let slopetop = this.slopetop.clone();
        console.log(slopetop);
        slopetop.scale.set(1, 2, 1);
        if (!this.Is30cm) slopetop.scale.set(1.25, 2, 1);
        slopetop.children[0].material = bodyMesh[0].material;
        slopetop.position.set(
          slopetop.position.x,
          sizeLocker.y,
          slopetop.position.z
        );
        lockerGroup.add(slopetop.clone());
        offsetWidth = 0.7;
        offsetHeight = 0.7;
        heightdiif = 60;
        break;
      }
      case "Base": {
        let base = this.base.clone();
        base.children[0].material = bodyMesh[0].material;
        base.scale.set(1, 1, 1);
        if (!this.Is30cm) base.scale.set(1.25, 1, 1);
        base.position.set(0, 0, 0);
        this.allLockers.position.set(
          this.allLockers.position.x,
          this.allLockers.position.y + 3,
          this.allLockers.position.z
        );
        lockerGroup.add(base.clone());
        offsetWidth = 0.2;
        offsetHeight = 0.2;
        heightdiif = 14;
        break;
      }
      case "Base 40 cm": {
        let base = this.base.clone();
        base.children[0].material = bodyMesh[0].material;
        base.scale.set(1, 1.2, 1);
        if (!this.Is30cm) base.scale.set(1.25, 1.2, 1);
        base.position.set(0, 0, 0);
        this.allLockers.position.set(
          this.allLockers.position.x,
          this.allLockers.position.y + 4,
          this.allLockers.position.z
        );
        lockerGroup.add(base.clone());
        offsetWidth = 0.3;
        offsetHeight = 0.3;
        heightdiif = 18;
        break;
      }
      case "Base 80 cm": {
        let base = this.base.clone();
        base.children[0].material = bodyMesh[0].material;
        base.scale.set(1, 1.5, 1);
        if (!this.Is30cm) base.scale.set(1.25, 1.5, 1);
        base.position.set(0, 0, 0);
        this.allLockers.position.set(
          this.allLockers.position.x,
          this.allLockers.position.y + 6,
          this.allLockers.position.z
        );
        lockerGroup.add(base.clone());
        offsetWidth = 0.4;
        offsetHeight = 0.4;
        heightdiif = 38;
        break;
      }
      case "Base 120 cm": {
        let base = this.base.clone();
        base.children[0].material = bodyMesh[0].material;
        base.scale.set(1, 2, 1);
        if (!this.Is30cm) base.scale.set(1.25, 2, 1);
        base.position.set(0, 0, 0);
        this.allLockers.position.set(
          this.allLockers.position.x,
          this.allLockers.position.y + 8,
          this.allLockers.position.z
        );
        lockerGroup.add(base.clone());
        offsetWidth = 0.6;
        offsetHeight = 0.6;
        heightdiif = 56;
        break;
      }
      case "Legs": {
        let stand = this.stand.clone();
        stand.scale.set(1, 1.5, 1);
        if (!this.Is30cm) stand.scale.set(1.25, 1.5, 1);
        stand.position.set(0, 0, 0);
        this.allLockers.position.set(
          this.allLockers.position.x,
          this.allLockers.position.y + 3,
          this.allLockers.position.z
        );
        lockerGroup.add(stand.clone());
        offsetWidth = 0.2;
        offsetHeight = 0.2;
        heightdiif = 14;
        break;
      }
      case "Legs 40 cm": {
        let stand = this.stand.clone();
        stand.scale.set(1, 1.7, 1);
        if (!this.Is30cm) stand.scale.set(1.25, 1.7, 1);
        stand.position.set(0, 0, 0);
        this.allLockers.position.set(
          this.allLockers.position.x,
          this.allLockers.position.y + 2.5,
          this.allLockers.position.z
        );
        lockerGroup.add(stand.clone());
        offsetWidth = 0.3;
        offsetHeight = 0.3;
        heightdiif = 18;
        break;
      }
      case "Legs 80 cm": {
        let stand = this.stand.clone();
        stand.scale.set(1, 2.2, 1);
        if (!this.Is30cm) stand.scale.set(1.25, 2.2, 1);
        stand.position.set(0, 0, 0);
        this.allLockers.position.set(
          this.allLockers.position.x,
          this.allLockers.position.y + 3.5,
          this.allLockers.position.z
        );
        lockerGroup.add(stand.clone());
        offsetWidth = 0.4;
        offsetHeight = 0.4;
        heightdiif = 38;
        break;
      }
      case "Legs 120 cm": {
        let stand = this.stand.clone();
        stand.scale.set(1, 3, 1);
        if (!this.Is30cm) stand.scale.set(1.25, 3, 1);
        stand.position.set(0, 0, 0);
        this.allLockers.position.set(
          this.allLockers.position.x,
          this.allLockers.position.y + 5,
          this.allLockers.position.z
        );
        lockerGroup.add(stand.clone());
        offsetWidth = 0.6;
        offsetHeight = 0.6;
        heightdiif = 56;
        break;
      }
      case "Bench wooden slats": {
        let stand = this.bench.clone();
        stand.scale.set(1, 1, 1);
        if (!this.Is30cm) stand.scale.set(1.25, 1, 1);
        stand.position.set(0, 0, 0);
        stand.getObjectByName("slat_wood").visible = true;
        stand.getObjectByName("slat_plastic").visible = false;
        this.allLockers.position.set(
          this.allLockers.position.x,
          this.allLockers.position.y + 4,
          this.allLockers.position.z
        );
        lockerGroup.add(stand.clone());
        offsetWidth = 0.2;
        offsetHeight = 0.2;
        heightdiif = 39;
        break;
      }
      case "Bench 40 cm wooden slats": {
        let stand = this.bench.clone();
        stand.scale.set(1, 1.5, 1);
        if (!this.Is30cm) stand.scale.set(1.25, 1.5, 1);
        stand.position.set(0, 0, 0);
        stand.getObjectByName("slat_wood").visible = true;
        stand.getObjectByName("slat_plastic").visible = false;
        this.allLockers.position.set(
          this.allLockers.position.x,
          this.allLockers.position.y + 6,
          this.allLockers.position.z
        );
        lockerGroup.add(stand.clone());
        offsetWidth = 0.3;
        offsetHeight = 0.3;
        heightdiif = 53;
        break;
      }
      case "Bench 80 cm wooden slats": {
        let stand = this.bench.clone();
        stand.scale.set(1, 2, 1);
        if (!this.Is30cm) stand.scale.set(1.25, 2, 1);
        stand.position.set(0, 0, 0);
        stand.getObjectByName("slat_wood").visible = true;
        stand.getObjectByName("slat_plastic").visible = false;
        this.allLockers.position.set(
          this.allLockers.position.x,
          this.allLockers.position.y + 8,
          this.allLockers.position.z
        );
        lockerGroup.add(stand.clone());
        offsetWidth = 0.4;
        offsetHeight = 0.4;
        heightdiif = 106;
        break;
      }
      case "Bench 120 cm wooden slats": {
        let stand = this.bench.clone();
        stand.scale.set(1, 3, 1);
        if (!this.Is30cm) stand.scale.set(1.25, 3, 1);
        stand.position.set(0, 0, 0);
        stand.getObjectByName("slat_wood").visible = true;
        stand.getObjectByName("slat_plastic").visible = false;
        this.allLockers.position.set(
          this.allLockers.position.x,
          this.allLockers.position.y + 12,
          this.allLockers.position.z
        );
        lockerGroup.add(stand.clone());
        offsetWidth = 0.6;
        offsetHeight = 0.6;
        heightdiif = 160;
        break;
      }
      case "Bench plastic slats": {
        let stand = this.bench.clone();
        stand.scale.set(1, 1, 1);
        if (!this.Is30cm) stand.scale.set(1.25, 1, 1);
        stand.position.set(0, 0, 0);
        stand.getObjectByName("slat_wood").visible = false;
        stand.getObjectByName("slat_plastic").visible = true;
        this.allLockers.position.set(
          this.allLockers.position.x,
          this.allLockers.position.y + 4,
          this.allLockers.position.z
        );
        lockerGroup.add(stand.clone());
        offsetWidth = 0.2;
        offsetHeight = 0.2;
        heightdiif = 39;
        break;
      }
      case "Bench 40 cm plastic slats": {
        let stand = this.bench.clone();
        stand.scale.set(1, 1.5, 1);
        if (!this.Is30cm) stand.scale.set(1.25, 1.5, 1);
        stand.position.set(0, 0, 0);
        stand.getObjectByName("slat_wood").visible = false;
        stand.getObjectByName("slat_plastic").visible = true;
        this.allLockers.position.set(
          this.allLockers.position.x,
          this.allLockers.position.y + 6,
          this.allLockers.position.z
        );
        lockerGroup.add(stand.clone());
        offsetWidth = 0.3;
        offsetHeight = 0.3;
        heightdiif = 53;
        break;
      }
      case "Bench 80 cm plastic slats": {
        let stand = this.bench.clone();
        stand.scale.set(1, 2, 1);
        if (!this.Is30cm) stand.scale.set(1.25, 2, 1);
        stand.position.set(0, 0, 0);
        stand.getObjectByName("slat_wood").visible = false;
        stand.getObjectByName("slat_plastic").visible = true;
        this.allLockers.position.set(
          this.allLockers.position.x,
          this.allLockers.position.y + 8,
          this.allLockers.position.z
        );
        lockerGroup.add(stand.clone());
        offsetWidth = 0.4;
        offsetHeight = 0.4;
        heightdiif = 106;
        break;
      }
      case "Bench 120 cm plastic slats": {
        let stand = this.bench.clone();
        stand.scale.set(1, 3, 1);
        if (!this.Is30cm) stand.scale.set(1.25, 3, 1);
        stand.position.set(0, 0, 0);
        stand.getObjectByName("slat_wood").visible = false;
        stand.getObjectByName("slat_plastic").visible = true;
        this.allLockers.position.set(
          this.allLockers.position.x,
          this.allLockers.position.y + 12,
          this.allLockers.position.z
        );
        lockerGroup.add(stand.clone());
        offsetWidth = 0.6;
        offsetHeight = 0.6;
        heightdiif = 160;
        break;
      }
    }
    return { offsetWidth, offsetHeight, heightdiif };
  }
  changeAccessories(accessoryName, isBottom) {
    if (isBottom) {
      this.currentAccessoryBottom = accessoryName;
    } else this.currentAccessoryTop = accessoryName;

    this.loadColumns(this.rows, this.cols);
  }
  appendChild(child) {
    let bbxMesh = new THREE.Box3();
    Box3Extension.setFromObject(bbxMesh, child, true);
    let sizeMesh = new THREE.Vector3();
    bbxMesh.getSize(sizeMesh);
    let child2 = child.clone();
    child2.position.set(sizeMesh.x, 0, 0);
    // child2.scale.set(5, 5, 5);
    child.add(child2);
    return child2;
  }

  ChangeBackground(name) {
    let oldback = this.scene.getObjectByName("background");
    this.scene.remove(this.background);
    if (name === "Loft Office") {
      this.background = this.background4.clone();
    } else if (name === "Office") {
      this.background = this.background3.clone();
    } else if (name === "Art Museum") {
      this.background = this.background1.clone();
    } else {
      this.background = this.background2.clone();
    }
    this.scene.add(this.background);
    // this.Isbackground1 = !this.Isbackground1;
    // console.log(this.Isbackground1);

    // if (this.Isbackground1) this.background = this.background1.clone();
    // else this.background = this.background2.clone();

    // if (this.Isbackground1) this.scene.add(this.background1);
    // else
    // this.scene.add(this.background);
  }
  resizeCapture(logo, logoProcent, bottomImg, onPost, t) {
    //  var canvas = document.querySelector("#myCanvas");
    var image = this.CanvasContainer.firstChild.toDataURL("image/png");

    var tmpCanvas = document.createElement("canvas"),
      ctx = tmpCanvas.getContext("2d");

    tmpCanvas.width = this.CanvasContainer.offsetWidth;
    tmpCanvas.height = this.CanvasContainer.offsetHeight;

    // const ctx = image.getContext("2d");

    ctx.drawImage(
      this.CanvasContainer.firstChild,
      0,
      0,
      this.CanvasContainer.offsetWidth,
      this.CanvasContainer.offsetHeight
    );
    let self = this;
    var imageObj = new Image();
    imageObj.onload = function () {
      // var image2 = tmpCanvas
      //   .toDataURL("image/png")
      //   .replace("image/png", "image/octet-stream");
      // var element = document.createElement("a");
      // var filename = "test.png";
      // element.setAttribute("href", image2);
      // element.setAttribute("download", filename);

      // element.click();
      var imageObj2 = new Image();
      imageObj2.onload = function () {
        var imageObjBottob = new Image();
        imageObjBottob.onload = function () {
          ctx.drawImage(
            imageObj2,
            -400,
            -200,
            imageObj2.width * 2,
            imageObj2.height * 2
          );
          ctx.resetTransform();
          // ctx.drawImage(
          //   imageObj,
          //   tmpCanvas.width / 2 - 100,
          //   tmpCanvas.height / 2
          // );
          var doc = new jsPDF();
          const imgProps = doc.getImageProperties(tmpCanvas);
          const pdfWidth = doc.internal.pageSize.getWidth();
          const pdfheigh2 = doc.internal.pageSize.getHeight();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          var hRatio = pdfWidth / imgProps.width;
          var vRatio = pdfHeight / imgProps.height;
          var ratio = Math.min(hRatio, vRatio);
          // ctx.drawImage(img, 0,0, img.width, img.height, 0,0,img.width*ratio, img.height*ratio);

          doc.addImage(
            tmpCanvas,
            "JPEG",
            0,
            50,
            imgProps.width * ratio,
            imgProps.height * ratio
          );
          doc.addImage(imageObj, "png", 80, 10);
          doc.setFontSize(9);
          // doc.text("Olssen BV", 160, 200);
          // doc.text("Parabool 28", 160, 205);
          // doc.text("3364 DH Sliedrecht", 160, 210);

          // doc.text("The Netherlands", 160, 220);
          // doc.text("+31 (0)84 - 611 400", 160, 225);
          // doc.text("verkoop@olssen.nl", 160, 230);

          // doc.text("KVK : 52617688", 160, 240);
          // doc.text("BTW : NL850523242B01", 160, 245);
          // doc.text("IBAN : NL45 RABO 0121648109", 160, 250);

          doc.addImage(imageObjBottob, "png", 0, 270, 220, 30);
          setTimeout(() => {
            doc.close();
            if (onPost) {
              var blob = new Blob([doc.output("arraybuffer")], {
                type: "text/plain",
              });
              // var reader = new FileReader();
              // reader.onload = function (evt) {
              //   // const out = doc.output();
              //   console.log(evt.target.result);
              //   if (self.PostForm) self.PostForm(evt.target.result, t);
              // };
              // reader.readAsText(blob, "UTF-8");

              // let arrbb = doc.output("arraybuffer");
              // console.log(arrbb);
              // let data = decodeURIComponent(
              //   String.fromCharCode.apply(
              //     null,
              //     Array.prototype.slice.apply(arrbb)
              //   )
              // );
              // console.log(data);
              // var blobPDF = new Blob(doc.output("arraybuffer"), {
              //   type: "application/pdf",
              // });
              // var blobUrl = URL.createObjectURL(blobPDF);
              // const out = doc.output();
              var pdf = btoa(doc.output());
              if (self.PostForm) self.PostForm(pdf, t);
              // console.log(blobUrl);
            } else doc.save("Locker");
          }, 1000);
        };
        imageObjBottob.src = bottomImg;
        // ctx.rotate((-45 * Math.PI) / 180);
      };
      imageObj2.src = logoProcent;
    };
    imageObj.src = logo;
    console.log(logo);
  }
  zoomIn() {
    if (this.camera.fov < 80) {
      this.camera.fov += 1;
      this.camera.updateProjectionMatrix();
    }
  }
  zoomOut() {
    if (this.camera.fov > 15) {
      this.camera.fov -= 1;
      this.camera.updateProjectionMatrix();
    }
  }

  capture(logo, logoProcent, bottomImg, onPost, t) {
    let prevWidth = this.CanvasContainer.offsetWidth;
    let prevHeight = this.CanvasContainer.offsetHeight;
    this.CanvasContainer.style.width = "1920px";
    this.CanvasContainer.style.height = "1080px";
    this.onWindowResize();
    if (this.prevDoor) this.prevDoor.parent.rotation.y = 0;
    this.controls.reset();
    this.camera.position.set(0, 6, 50);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.camera.updateProjectionMatrix();
    this.dimensionheight.position.set(
      this.dimensionheight.position.x + 10,
      this.dimensionheight.position.y,
      this.dimensionheight.position.z
    );
    this.dimensionwidth.position.set(
      this.dimensionwidth.position.x + 10,
      this.dimensionwidth.position.y,
      this.dimensionwidth.position.z
    );
    this.allLockers.position.set(
      this.allLockers.position.x + 10,
      this.allLockers.position.y,
      this.allLockers.position.z
    );
    this.terminals.forEach((element) => {
      element.position.set(
        element.position.x + 10,
        element.position.y,
        element.position.z
      );
    });
    setTimeout(() => {
      this.resizeCapture(logo, logoProcent, bottomImg, onPost, t);
      this.CanvasContainer.style.width = prevWidth + "px";
      this.CanvasContainer.style.height = prevHeight + "px";
      this.onWindowResize();
      this.allLockers.position.set(
        this.allLockers.position.x - 10,
        this.allLockers.position.y,
        this.allLockers.position.z
      );
      this.dimensionheight.position.set(
        this.dimensionheight.position.x - 10,
        this.dimensionheight.position.y,
        this.dimensionheight.position.z
      );
      this.dimensionwidth.position.set(
        this.dimensionwidth.position.x - 10,
        this.dimensionwidth.position.y,
        this.dimensionwidth.position.z
      );
      this.terminals.forEach((element) => {
        element.position.set(
          element.position.x - 10,
          element.position.y,
          element.position.z
        );
      });
    }, 2000);

    // ctx.rotate(-Math.PI / 4);
    // ctx.font = "50px serif";
    // ctx.fillText("Hello world", 100, this.CanvasContainer.offsetHeight + 200);
  }
  loadFile() {
    console.log(this.rootPath);
    const loader = new GLTFLoader().setPath(this.rootPath + "model/");

    loader.load("background4.gltf", (gltf) => {
      gltf.scene.position.set(0, 5, 90);
      gltf.scene.name = "background";
      this.background4 = gltf.scene.clone();
      this.background = gltf.scene;
      this.backgroundSelected = 3;
      // this.background.scale.set(25, 25, 25);
      // gltf.scene.position.set(0, 12, 175);

      this.scene.add(this.background);
      let bbxbg = new THREE.Box3();
      Box3Extension.setFromObject(bbxbg, this.background, true);
      this.bgSize = new THREE.Vector3();
      bbxbg.getSize(this.bgSize);
      console.log(this.bgSize);

      loader.load("locker1.gltf", (gltf) => {
        this.locker1 = gltf.scene;
        this.locker1.scale.set(12, 12, 12);
        this.locker1.position.set(0, -38, -140);
        console.log(gltf.scene);
        // this.scene.add(this.locker);

        this.changeDoorMaterial("Steel");
        this.changeBodyMaterial("Steel");
        this.loadColumns(2, 1);
        if (this.loadingComplete) this.loadingComplete();
      });
      loader.load("locker2.gltf", (gltf) => {
        this.locker2 = gltf.scene;
        this.locker2.scale.set(12, 12, 12);
        this.locker2.position.set(0, -38, -140);
        console.log(gltf.scene);
        // this.scene.add(this.locker);
      });
    });
    loader.load("background1.gltf", (gltf) => {
      this.background1 = gltf.scene;
      gltf.scene.name = "background";
      gltf.scene.position.set(0, 5, 90);
    });
    loader.load("background2.gltf", (gltf) => {
      this.background2 = gltf.scene;
      gltf.scene.name = "background";
      gltf.scene.position.set(0, 5, 90);
    });
    loader.load("background3.gltf", (gltf) => {
      this.background3 = gltf.scene;
      gltf.scene.name = "background";
      gltf.scene.position.set(0, 5, 90);
    });
    loader.load("terminal.gltf", (gltf) => {
      this.terminalFile = gltf.scene;
      gltf.scene.name = "terminal";
      // this.scene.add(this.terminalFile);
    });
    loader.load("lockerSingle1-slopetop.gltf", (gltf) => {
      this.slopetop = gltf.scene;
    });
    loader.load("lockerSingle1-base.gltf", (gltf) => {
      this.base = gltf.scene;
    });
    loader.load("lockerSingle1-stand.gltf", (gltf) => {
      this.stand = gltf.scene;
    });
    loader.load("lockerSingle1-bench.gltf", (gltf) => {
      this.bench = gltf.scene;
    });
  }
  addTerminal() {
    this.terminalselection = true;
    if (!this.tempTerminal) {
      this.tempTerminal = this.terminalFile.clone();
      this.tempTerminal.position.set(0, 0, -80);
      this.scene.add(this.tempTerminal);
    } else {
      this.tempTerminal.visible = true;
      this.tempTerminal.position.set(0, 0, -80);
    }
    if (this.prevDoor) {
      let anim2 = new TWEEN.Tween(this.prevDoor.parent.rotation).to({ y: 0 });
      anim2.start();
    }
  }
  removeTerminal() {
    if (this.terminalsData.length > 0) this.terminalsData.pop();

    // if (this.sideterminal) this.scene.remove(this.sideterminal);
    this.loadColumns(this.rows, this.cols);
  }
  ResetView() {
    if (this.prevDoor) this.prevDoor.parent.rotation.y = 0;
    this.controls.reset();
    this.camera.position.set(0, 6, 50);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.camera.fov = 45;
    this.camera.updateProjectionMatrix();

    // this.camera.position.set(0, 0, 200);
    // this.camera.updateProjectionMatrix();
    // this.controls.target.set(0, 0, 0);
    this.controls.update();
    // this.controls.reset();
  }
  moveTerminal(fromAddCol) {
    console.log("Move terminal");
    // if (fromAddCol && this.sideterminal) {
    //   this.scene.remove(this.sideterminal);
    //   this.sideterminal = null;
    // }
    // if (!this.terminals) return;
    this.terminals.forEach((element) => {
      element.parent.remove(element);
    });
    this.terminals = [];
    for (let i = 0; i < this.terminalsData.length; i++) {
      let element = this.terminalsData[i];
      let doorsel = null;
      this.allLockers.traverse((item) => {
        if (item instanceof THREE.Mesh) {
          if (
            item.userData.row === element.terminalRow &&
            item.userData.col === element.termialCol
          )
            doorsel = item;
        }
      });
      if (doorsel) {
        let worldpos = doorsel.children[0].getWorldPosition(
          new THREE.Vector3()
        );
        if (!doorsel.geometry.boundingBox)
          doorsel.geometry.computeBoundingBox();
        const size = doorsel.geometry.boundingBox.getSize(new THREE.Vector3());
        size.y *= 2;
        let terminal = this.terminalFile.clone();
        size.y *= 2;

        terminal.position.set(worldpos.x, worldpos.y + 0.1, worldpos.z + 6);
        this.terminals.push(terminal);
        this.scene.add(terminal);
      } else {
        console.log(this.termialCol, this.cols);
        // if (this.termialCol > this.cols - 1) {
        //   this.scene.remove(this.terminal);
        //   this.terminal = null;
        // }
      }
    }
  }
  onClick(event) {
    this.MouseDown = true;

    if (this.prevSelect) {
      this.tempTerminal.visible = false;
      this.prevSelect.material.color = this.prevSelect.material.oldColor;
      let worldpos = this.prevSelect.getWorldPosition(new THREE.Vector3());
      if (!this.prevSelect.geometry.boundingBox)
        this.prevSelect.geometry.computeBoundingBox();
      const size = this.prevSelect.geometry.boundingBox.getSize(
        new THREE.Vector3()
      );

      // if (this.prevSelect.name.includes("body0")) {
      //   //side terminal currently only one side terminal supported
      //   if (this.sideterminal) this.scene.remove(this.sideterminal);
      //   this.sideterminal = this.terminalFile.clone();

      //   this.sideterminal.rotation.set(0, Math.PI, 0);
      //   this.sideterminal.position.set(
      //     worldpos.x + 3,
      //     worldpos.y + 15,
      //     worldpos.z + 2
      //   );
      //   this.scene.add(this.sideterminal);
      //   // this.sideterminalRow = this.prevSelect.userData.row;
      //   // this.sideterminalCol = this.prevSelect.col;
      //   this.prevSelect = null;
      //   // const aabb = new THREE.Box3();
      //   // aabb.setFromObject( this.terminal );
      //   // const sizet = aabb.getSize(
      //   //   new THREE.Vector3()
      //   // );
      //   // ;
      //   //        sizet.y *= 2;
      // } else
      {
        console.log("add terminal");
        // if (this.terminal) this.scene.remove(this.terminal);
        let doorsel = this.prevSelect;
        let worldpos = doorsel.children[0].getWorldPosition(
          new THREE.Vector3()
        );
        if (!doorsel.geometry.boundingBox)
          doorsel.geometry.computeBoundingBox();
        const size = doorsel.geometry.boundingBox.getSize(new THREE.Vector3());
        size.y *= 2;
        let terminal = this.terminalFile.clone();
        size.y *= 2;

        terminal.position.set(worldpos.x, worldpos.y + 0.1, worldpos.z + 6);
        this.scene.add(terminal);
        this.terminals.push(terminal);
        this.terminalsData.push({
          terminalRow: this.prevSelect.userData.row,
          termialCol: this.prevSelect.userData.col,
        });
        // this.terminalRow = this.prevSelect.userData.row;
        // this.termialCol = this.prevSelect.col;
        this.prevSelect = null;
      }
      this.terminalselection = false;
    }

    // this.unSelect();
    // this.resetMaterial();
    // if (this.Hovered instanceof FrameMesh) {
    //   this.selectedFrame = this.Hovered;
    //   if (this.selectedFrame) {
    //     this.selectedFrame.material.color.set(0x008000);
    //     this.selectedFrame.isSelected = true;
    //     this.selectedFrame.intersectPoint = new THREE.Vector3(
    //       this.intersectPoint.x,
    //       this.intersectPoint.y,
    //       this.intersectPoint.z
    //     );
    //     this.selectedFrame.FrameData.IsMullion = this.getIsMullion(
    //       this.selectedFrame
    //     );
    //   }

    //   this.onFrameSelected(this.selectedFrame);
    // }

    // if (this.selectedFrame || this.selectedPanel || this.selectedSide) {
    //   this.controls.enabled = false;
    // }
  }
  resetMaterial() {
    // if (this.selectedFrame) {
    //   this.selectedFrame.isSelected = false;
    //   this.selectedFrame.material.color.set(
    //     this.selectedFrame.material.Oldcolor
    //   );
    // }
    // this.selectedShape = null;
  }
  unSelect() {
    this.resetMaterial();
    // if (this.selectedFrame) {
    //   this.selectedFrame.isSelected = false;
    //   this.selectedFrame.material.color.set(
    //     this.selectedFrame.material.Oldcolor
    //   );
    // }
    // if (this.selectedPanel) {
    //   this.selectedPanel.isSelected = false;
    //   this.selectedPanel.material.color.set(
    //     this.selectedPanel.material.Oldcolor
    //   );
    // }
    this.onDeSelected();
  }

  getIncreament(mouse, IsVertical) {
    const ray = new THREE.Raycaster();
    ray.setFromCamera(mouse, this.camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const intersects2 = new THREE.Vector3(0, 0, 0);

    raycaster.setFromCamera(mouse, this.camera);
    raycaster.ray.intersectPlane(plane, intersects2);
    const movedPosition = intersects2;
    let incrementValue = 0;
    if (!this.prevIntersect) {
      this.prevIntersect = movedPosition;
      return 0;
    }
    if (!IsVertical) {
      incrementValue = movedPosition.y - this.prevIntersect.y;
      incrementValue += this.remainingval;
      const divident = parseInt(incrementValue);
      this.remainingval = incrementValue % 1;
      incrementValue = divident;
      this.prevIntersect = movedPosition;
      incrementValue = incrementValue * 2;
    } else {
      incrementValue = this.prevIntersect.x - movedPosition.x;
      incrementValue += this.remainingval;
      const divident = parseInt(incrementValue);
      this.remainingval = incrementValue % 1;
      incrementValue = divident;
      this.prevIntersect = movedPosition;
    }
    return Math.abs(incrementValue) > 5 ? 0 : incrementValue;
  }
  mouseUp(event) {
    this.MouseDown = false;
    if (this.controls) this.controls.enabled = true;
    this.prevMousePoint = null;
  }
  AnimateDoor(door) {
    const newRot = { x: 0, y: 1, z: 1 };
    if (this.prevDoor) {
      let anim2 = new TWEEN.Tween(this.prevDoor.parent.rotation).to({ y: 0 });
      anim2.start();
    }

    let anim = new TWEEN.Tween(door.parent.rotation).to({ y: Math.PI / 2 });
    anim.start();
    this.prevAnim = anim;
  }
  mouseMove(event) {
    // return;
    event.preventDefault();
    if (!this.allLockers) return;
    let mouse = new THREE.Vector2();
    // event.clientY -= 15;
    const rect = this.renderer.domElement.getBoundingClientRect();
    // console.log(rect, event.clientX, event.clientY);
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY + window.scrollY) / rect.height) * 2 + 1;
    let diff = 0;

    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    if (this.terminalselection) {
      let intersectObj = raycaster.intersectObject(this.Hiddenplane, true);
      // console.log(intersectObj);
      if (intersectObj.length > 0) {
        this.tempTerminal.position.set(
          intersectObj[0].point.x,
          intersectObj[0].point.y,
          intersectObj[0].point.z
        );
      }
    }
    let intersects = raycaster.intersectObjects(this.scene.children, true);
    intersects = intersects.filter(
      (item) =>
        item.object instanceof THREE.Mesh && item.object !== this.Hiddenplane
    );
    if (intersects.length > 0) {
      let intObj = intersects[0].object;
      console.log(intObj);
      if (this.terminalselection) {
        intersects = intersects.filter((item) =>
          item.object.name.includes("door")
        );
        if (intersects.length > 0) {
          intObj = intersects[0].object;
          if (intObj.name.includes("door") || intObj.name.includes("body0"))
            if (this.prevSelect !== intObj) {
              if (this.prevSelect)
                this.prevSelect.material.color =
                  this.prevSelect.material.oldColor;

              intObj.material = intObj.material.clone();
              intObj.material.oldColor = intObj.material.color.clone();
              intObj.material.color = new THREE.Color("#7fdfff");
              this.prevSelect = intObj;
            }
        }
      } else {
        if (intObj.name.includes("door")) {
          if (
            this.terminalsData.filter(
              (item) =>
                item.terminalRow === intObj.userData.row &&
                item.termialCol === intObj.userData.col
            ).length === 0
          ) {
            if (this.prevDoor !== intObj) {
              // if (this.prevDoor)
              //   this.prevDoor.material.color = this.prevDoor.material.oldColor;

              intObj.material = intObj.material.clone();
              // intObj.material.oldColor = intObj.material.color.clone();
              // intObj.material.color = new THREE.Color("#7fdfff");
              this.AnimateDoor(intObj);
              this.prevDoor = intObj;
            }
          }
        }
      }
    }
    // console.log(intersects);
    this.prevMouse = mouse;
  }
}
