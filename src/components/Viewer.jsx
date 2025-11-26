/* eslint-disable react/prop-types */
import React, { PureComponent } from "react";

import Engine from "../core/Engine";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Menu, MenuItem } from "@mui/material";

class Viewer extends PureComponent {
  constructor(props) {
    super(props);
    this.engine = null;
    this.EditProfile = null;
    this.state = {
      CameraAdded: false,
      isEditProfile: false,
      contextMenu: null,
      isELevationLayout: false,
      isAnnotations: false,
      DoorStyle: "AA",
      isGenerateImages: false,
      dataGenerated: false,
    };
    // if (process.env.NODE_ENV !== "production") {
    //   import("../Assets/css/libary.css").then(() => {
    //     console.log("dev css Loaded");
    //   });
    // }
    this.UpdateStyle = this.UpdateStyle.bind(this);
    this.SidebarRef = React.createRef();
  }
  componentDidMount() {
    this.initCanvas("IMPERIAL");
    this.submitClick();
  }
  initCanvas(unit) {
    if (!this.engine) {
      this.engine = new Engine(this.props.CanvasID, unit);
      this.engine.initEngine();
      this.engine.onUpdateChange = this.UpdateStyle;
    }
    return this.engine;
  }
  UpdateStyle() {
    this.SidebarRef.current?.updateRowscols();
  }
  submitClick() {
    this.engine.loadFile();
  }
  resetView() {
    this.engine.resetView();
  }
  zoomInView() {
    this.engine.zoomInView();
  }
  zoomOutView() {
    this.engine.zoomOutView();
  }

  OnContextMenu(e) {
    e.preventDefault();
    let selected = this.SidebarRef.current.state.selectedComponent;
    if (selected !== "")
      this.setState({
        contextMenu: {
          mouseX: e.clientX + 2,
          mouseY: e.clientY - 6,
        },
      });
  }
  closeContext() {
    this.setState({ contextMenu: null });
  }

  contextComponent() {
    let selected = "";
    if (this.SidebarRef.current) {
      selected = this.SidebarRef.current.state.selectedComponent;
    }
    const { isEditProfile } = this.state;
    switch (selected) {
      case "frame": {
        return (
          <div>
            <MenuItem
              onClick={() => {
                this.setState({ isEditProfile: !isEditProfile });
                this.closeContext();
              }}
            >
              Edit
            </MenuItem>

            <MenuItem
              onClick={() => {
                this.closeContext();
                let updateframe = this.engine.selectedFrame;
                if (this.engine.selectedFrame.name.includes("spliceFrame")) {
                  updateframe = this.engine.selectedFrame.parent;
                }
                this.engine.addSideLight(
                  updateframe,
                  "Glass",
                  true,
                  true,
                  false,
                  `1/4"`,
                  `1' 0"`,
                  `1' 0"`,
                  "Top"
                );
              }}
            >
              Add SideLight
            </MenuItem>
            {/* <MenuItem
              onClick={() => {
                this.closeContext();
                this.engine.SpliceHereFrame();
              }}
            >
              Splice Here
            </MenuItem> */}
          </div>
        );
      }
      case "Transom":
        return (
          <div>
            <MenuItem
              onClick={() => {
                this.setState({ isEditProfile: !isEditProfile });
                this.closeContext();
              }}
            >
              Edit
            </MenuItem>

            <MenuItem
              onClick={() => {
                this.closeContext();
                this.addTransom(false);
              }}
            >
              Add Transom
            </MenuItem>
            <MenuItem
              onClick={() => {
                this.closeContext();
                this.addTransom(true);
              }}
            >
              Add Transom Extend
            </MenuItem>
            {/* <MenuItem
              onClick={() => {
                this.closeContext();
                this.engine.SpliceHereFrame();
              }}
            >
              Splice Here
            </MenuItem> */}
          </div>
        );
      case "sidePanel":
        return (
          <div>
            <MenuItem
              onClick={() => {
                this.closeContext();
                this.engine.AddMullion(1, "Vertical", true, true);
              }}
            >
              Add Mullion Vertical
            </MenuItem>

            <MenuItem
              onClick={() => {
                this.closeContext();
                this.engine.AddMullion(1, "Horizontal", true, true);
              }}
            >
              Add Mullion Horizontal
            </MenuItem>
            <MenuItem
              onClick={() => {
                this.closeContext();
                this.engine.DeletePanel(this.engine.selectedPanel);
              }}
            >
              Delete
            </MenuItem>
          </div>
        );
      case "door":
        return (
          <div>
            <MenuItem
              onClick={() => {
                this.closeContext();
                this.addShape("Lite");
              }}
            >
              Add Lite
            </MenuItem>

            <MenuItem
              onClick={() => {
                this.closeContext();
                this.addShape("Louver");
              }}
            >
              Add Louver
            </MenuItem>
            <MenuItem
              onClick={() => {
                this.closeContext();
                this.addShape("Cut Out");
              }}
            >
              Add Cut Out
            </MenuItem>
            {/* <MenuItem
              onClick={() => {
                this.closeContext();
                this.engine.toggleDoorMaterial();
              }}
            >
              Toggle Material
            </MenuItem> */}
          </div>
        );
      default:
        return <div></div>;
    }
  }
  render() {
    const {
      isEditProfile,
      contextMenu,
      isELevationLayout,
      isAnnotations,
      isGenerateImages,
      imageData,
      dataGenerated,
    } = this.state;
    return (
      <>
        <div
          className="flex-col  bg-[#f3f4f6] font-[Open_Sans]"
          style={{ height: "100%" }}
        >
          <div className=" flex flex-grow" style={{ height: "100%" }}>
            <Sidebar
              isIFrame={this.props.isIFrame}
              ref={this.SidebarRef}
              engine={() => this.engine}
              editProfileClick={() =>
                this.setState({ isEditProfile: !isEditProfile })
              }
              elevationClick={() =>
                this.setState({ isELevationLayout: !isELevationLayout })
              }
              annotaionClick={() =>
                this.setState({ isAnnotations: !isAnnotations })
              }
            />

            <div className="flex flex-col w-full">
              <div className="w-full h-full">
                <div
                  id={this.props?.CanvasID}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  onMouseMove={(e) => this.engine.mouseMove(e)}
                  onMouseDown={(e) => this.engine.onClick(e)}
                  onMouseUp={(e) => this.engine.mouseUp(e)}
                  onContextMenu={(e) => this.OnContextMenu(e)}
                ></div>
              </div>
              {/* <Footer engine={() => this.engine} /> */}
            </div>
          </div>
        </div>

        <Menu
          style={{ zIndex: "3000000" }}
          open={contextMenu !== null}
          disableRestoreFocus={true}
          onClose={(e) => {
            e.preventDefault();
            this.setState({ contextMenu: null });
          }}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          {this.contextComponent()}
        </Menu>
      </>
    );
  }
}

export default Viewer;
