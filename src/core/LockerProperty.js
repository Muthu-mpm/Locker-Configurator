export default class LockerProperty {
  constructor(oldData) {
    this.Rows = 1;
    this.Cols = 1;
    this.DoorMaterial = "Steel";
    this.DoorColor = "Anthracite";
    this.BodyMaterial = "Steel";
    this.BodyColor = "Light grey";
    this.KeySystem = "";
    this.AccessoriesTop = "";
    this.AccessoriesBottom = "";
    this.totalTerminals = 0;
    this.Extras = "";
    Object.assign(this, oldData);
  }
}
