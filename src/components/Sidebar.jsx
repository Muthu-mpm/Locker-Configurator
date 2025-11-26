/* eslint-disable react/prop-types */
import React, { PureComponent } from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DropDownMenu, { StyledMenu } from "./DropDownMenu";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  IconButton,
  ListItemText,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { BaseUnits } from "../Utils/BaseUnits";
import { convertFeetInch } from "../Utils/MeshUtils";
import {
  Add,
  HdrPlus,
  Remove,
  TableRows,
  ViewColumn,
} from "@mui/icons-material";
const rowImg = "./image/row.png";
const colmg = "./image/layout.png";
const materialTypes = [
  { name: "Steel" },
  { name: "Wood" },
  { name: "Aluminium" },
  { name: "Glass" },
];
const materialColors = [
  { name: "Light grey", color: "rgb(197, 199, 196)" },
  { name: "Anthracite ", color: "rgb(56, 62, 66)" },
  { name: "White", color: "rgb(248, 248, 248)" },
];
const materialDoorColors = [
  { name: "Light grey", color: "rgb(197, 199, 196)" },
  { name: "Anthracite ", color: "rgb(56, 62, 66)" },
  { name: "White", color: "rgb(248, 248, 248)" },
  { name: "Dark blue", color: "rgb(0, 78, 124)" },
  { name: "Light blue", color: "rgb(0, 137, 182)" },
  { name: "Orange", color: "rgb( 226, 83, 3)" },
];
class Sidebar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentMaterialType: "Steel",
      currentSkinColor: { name: "White", color: "white" },
      currentDoorMaterialType: "Steel",
      currentDoorSkinColor: { name: "Black", color: "black" },
    };
  }
  updateRowscols() {
    const engine = this.props.engine();
    console.log(engine);
    this.setState({ row: engine.rows, cols: engine.cols });
  }
  render() {
    const textBoxStyle = `
    form-control
    block
    text-center
    w-3/4
    text-sm
    px-4
    text-base
    font-semibold
    text-gray-700
    bg-white bg-clip-padding
    border border-solid border-gray-300
    rounded
    transition
    ease-in-out
    m-0
    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none `;
    const {
      currentMaterialType,
      currentSkinColor,
      currentDoorMaterialType,
      currentDoorSkinColor,
      row,
      cols,
    } = this.state;

    return (
      <>
        <div
          className="w-96 bg-[#31405f] "
          style={{
            height: this.props.isIFrame ? "100%" : "100vh",
          }}
        >
          <div
            className="overflow-y-auto pl-4 pt-4"
            style={{
              height: "calc(100% - 34px)",
            }}
          >
            <label className="text-white font-semibold text-md pt-4">
              Material Body
            </label>
            <div className="pt-2 w-3/4 pb-2">
              <DropDownMenu
                title={currentMaterialType}
                subTitle="the material"
                menuItems={(handleClose) => (
                  <div>
                    {materialTypes.map((item) => (
                      <MenuItem
                        disableRipple
                        onClick={() => {
                          handleClose();
                          this.props.engine().changeBodyMaterial(item.name);
                          this.setState({ currentMaterialType: item.name });
                        }}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </div>
                )}
              />
            </div>
            <label className="text-white font-semibold text-md pt-4">
              Color Skin
            </label>
            <div className="pt-2 w-3/4 ">
              <DropDownMenu
                title={currentSkinColor.name}
                subTitle="Choose prefferd color"
                color={currentSkinColor.color}
                menuItems={(handleClose) => (
                  <div>
                    {materialColors.map((item) => (
                      <MenuItem
                        disableRipple
                        onClick={() => {
                          handleClose();
                          this.props.engine().changeSkinColor(item.color);
                          this.setState({ currentSkinColor: item });
                        }}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </div>
                )}
              />
            </div>
            <hr className="my-2 relative border-gray-400 border-t-2 "></hr>

            <label className="text-white font-semibold text-md ">
              Material Doors
            </label>
            <div className="pt-2 w-3/4 pb-2">
              <DropDownMenu
                title={currentDoorMaterialType}
                subTitle="the material"
                menuItems={(handleClose) => (
                  <div>
                    {materialTypes.map((item) => (
                      <MenuItem
                        disableRipple
                        onClick={() => {
                          handleClose();
                          this.props.engine().changeDoorMaterial(item.name);
                          this.setState({ currentDoorMaterialType: item.name });
                        }}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </div>
                )}
              />
            </div>
            <label className="text-white font-semibold text-md pt-4">
              Color Doors
            </label>
            <div className="pt-2 w-3/4 ">
              <DropDownMenu
                title={currentDoorSkinColor.name}
                subTitle="Choose prefferd color"
                color={currentDoorSkinColor.color}
                menuItems={(handleClose) => (
                  <div>
                    {materialDoorColors.map((item) => (
                      <MenuItem
                        disableRipple
                        onClick={() => {
                          handleClose();
                          this.props.engine().changeDoorColor(item.color);
                          this.setState({ currentDoorSkinColor: item });
                        }}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </div>
                )}
              />
            </div>
            <hr className="my-2 relative border-gray-400 border-t-2 text"></hr>
            <div className="text-white ">
              <div className="grid grid-cols-4 ">
                <label className="text-white font-semibold text-md text-left  align-middle pt-4">
                  Rows
                  <p className="pl-2 text-sm font-normal ">{row}</p>
                </label>
                <img
                  className="mt-2"
                  src={rowImg}
                  style={{ height: 53, width: 100, objectFit: "" }}
                />
                <div className="-pt-4">
                  <IconButton
                    color="inherit"
                    onClick={() => this.props.engine().addRow()}
                  >
                    <Add />
                  </IconButton>
                  <IconButton
                    color="inherit"
                    onClick={() => this.props.engine().removeRow()}
                  >
                    <Remove />
                  </IconButton>
                </div>
              </div>
              <div className="grid grid-cols-4 ">
                <label className="text-white font-semibold text-md text-left  align-middle pt-4">
                  Column
                  <p className="pl-2 text-sm font-normal ">{cols}</p>
                </label>
                <img
                  className="mt-2"
                  src={colmg}
                  style={{ height: 53, width: 100, objectFit: "" }}
                />
                <div className="-pt-4">
                  <IconButton
                    color="inherit"
                    onClick={() => this.props.engine().addCol()}
                  >
                    <Add />
                  </IconButton>
                  <IconButton
                    color="inherit"
                    onClick={() => this.props.engine().removeCol()}
                  >
                    <Remove />
                  </IconButton>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label className="text-white font-semibold text-md text-left  align-middle  col-span-2">
                Choose Width
              </label>
              <div className="text-white flex flex-row gap-2 pt-1">
                <button className="border-2 rounded-md px-2 hover:bg-gray-500">
                  {" "}
                  30cm
                </button>
                <button className="border-2 rounded-md px-2 hover:bg-gray-500">
                  {" "}
                  40cm
                </button>
              </div>
            </div>
          </div>
          <footer class=" bottom-4 left-0 z-20 py-2 pl-2   "></footer>
        </div>
      </>
    );
  }
}
export default Sidebar;
