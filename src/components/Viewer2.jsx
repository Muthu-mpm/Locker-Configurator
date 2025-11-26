/* eslint-disable react/prop-types */
import React, { PureComponent } from "react";

import Engine from "../core/Engine";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { IconButton, Menu, MenuItem } from "@mui/material";
import BottomPanel from "./BottomPanel";
import LockerProperty from "../core/LockerProperty";
import { withTranslation } from "react-i18next";
import DropDownMenu from "./DropDownMenu";
import DropDownMenuLang from "./DropDownMenuLang";
import {
  Add,
  CloseOutlined,
  HdrPlusOutlined,
  Refresh,
  Remove,
  ZoomIn,
  ZoomOut,
} from "@mui/icons-material";
import { t } from "i18next";

let SidebarRef = React.createRef();
class Viewer2 extends PureComponent {
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
      menuOpen: true,
      loaded: false,
      loadergif: "",
      backgroundPlaces: [
        "Office",
        "Loft Office",
        "Art Museum",
        "Exhibition Hall",
      ],
      currentBack: "Loft Office",
    };
    // if (process.env.NODE_ENV !== "production") {
    //   import("../Assets/css/libary.css").then(() => {
    //     console.log("dev css Loaded");
    //   });
    // }

    this.messageEventLoaded = false;
    this.UpdateStyle = this.UpdateStyle.bind(this);
    this.LoadingCompleted = this.LoadingCompleted.bind(this);
    this.PostForm = this.PostForm.bind(this);
  }
  componentDidMount() {
    this.initCanvas("IMPERIAL");
    this.submitClick();
    // if (!this.messageEventLoaded)
    {
      if (window.addEventListener) {
        window.addEventListener("message", (e) => this.onMessge(e), false);
      } else {
        window.attachEvent("onmessage", (e) => this.onMessge(e));
      }
      this.messageEventLoaded = true;
    }
  }
  onMessge(e) {
    switch (e.data.type) {
      case "LoadByJson":
        {
          this.engine.LoadLocker(e.data.data);
          SidebarRef.UpdateJson(e.data.data);
        }
        break;
      case "GetUpdatedJson":
        {
          this.engine.SendUpdatedJson(
            SidebarRef.current.state.currentKeySystem,
            SidebarRef.current.state.currentAccess,
            SidebarRef.current.state.selectedExtras
          );
        }
        break;
    }
    // this.engine.loadColumns(2, 2);
    console.log(e);
  }
  initCanvas() {
    if (!this.engine) {
      this.engine = new Engine(this.props.CanvasID, this.props.filePath);
      this.setState({ loadergif: this.props.filePath + "image/loader.gif" });
      this.setState({ logopng: this.props.filePath + "image/logo.png" });
      this.engine.initEngine();
      this.engine.onUpdateChange = this.UpdateStyle;
      this.engine.loadingComplete = this.LoadingCompleted;
      this.engine.PostForm = this.PostForm;
    }
    return this.engine;
  }
  PostForm(data) {
    SidebarRef.current?.postData(data);
  }
  LoadingCompleted() {
    this.setState({ loaded: true });
  }
  UpdateStyle() {
    console.log("updTE");
    SidebarRef.current?.updateRowscols();
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
    // let selected = this.SidebarRef.current.state.selectedComponent;
    // if (selected !== "")
    //   this.setState({
    //     contextMenu: {
    //       mouseX: e.clientX + 2,
    //       mouseY: e.clientY - 6,
    //     },
    //   });
  }
  closeContext() {
    this.setState({ contextMenu: null });
  }

  contextComponent() {}
  render() {
    const {
      isEditProfile,
      contextMenu,
      isELevationLayout,
      isAnnotations,
      isGenerateImages,
      imageData,
      dataGenerated,
      menuOpen,
      loaded,
      loadergif,
      logopng,
      backgroundPlaces,
      currentBack,
    } = this.state;
    return (
      <>
        {!loaded && (
          <div className=" w-full h-full overflow-hidden items-center place-content-center flex justify-center absolute z-50 bg-sky-300">
            <div className=" content-center text-center flex flex-col justify-center relative w-full">
              <div className="flex flex-col justify-center items-center w-1/4 relative left-1/3">
                <img className=" relative" src={logopng}></img>
                <img className=" relative" src={loadergif}></img>
                <p className="text-lg w-full -top-20 relative">
                  {t("loading")}
                </p>
              </div>

              <div className="w-full "></div>
            </div>
          </div>
        )}

        <div className="flex-col flex font-sans  bg-[#fffdfd] font-[Open_Sans] ">
          <div
            className=" w-full h-full relative"
            id={this.props?.CanvasID}
            style={{
              width: "100%",
              height: menuOpen ? "60vh" : "100vh",
            }}
            // onMouseMove={(e) => this.engine.mouseMove(e)}
            onMouseDown={(e) => this.engine.onClick(e)}
            onMouseUp={(e) => this.engine.mouseUp(e)}
            onContextMenu={(e) => this.OnContextMenu(e)}
          ></div>
          {loaded && (
            <>
              <div className="absolute top-2 left-2">
                <DropDownMenuLang
                  title={t(currentBack)}
                  menuItems={(handleClose) => (
                    <div>
                      {backgroundPlaces.map((item) => (
                        <MenuItem
                          disableRipple
                          onClick={() => {
                            this.setState({ currentBack: item });
                            this.engine.ChangeBackground(item);
                            handleClose();
                          }}
                        >
                          <p> {t(item)}</p>
                        </MenuItem>
                      ))}
                    </div>
                  )}
                />
                <div className="fixed top-2 right-3 text-white">
                  {" "}
                  <IconButton
                    size="large"
                    color="inherit"
                    onClick={() => {
                      window.location.href = window.location.origin;
                    }}
                  >
                    <CloseOutlined style={{ width: "35px", height: "35px" }} />
                  </IconButton>
                </div>
                <div className="pt-2">
                  <div className="flex flex-row  bg-white w-48   text-[#A7A7A7] shadow-[#00000012] shadow-md  border border-[#D7D7D7] rounded-md">
                    <IconButton
                      size="large"
                      color="inherit"
                      onClick={() => {
                        this.engine.zoomOut();
                      }}
                    >
                      <ZoomIn style={{ width: "35px", height: "35px" }} />
                    </IconButton>
                    <IconButton
                      color="inherit"
                      onClick={() => {
                        this.engine.zoomIn();
                      }}
                    >
                      <ZoomOut style={{ width: "35px", height: "35px" }} />
                    </IconButton>
                    <IconButton
                      color="inherit"
                      onClick={() => {
                        this.engine.ResetView();
                      }}
                    >
                      <Refresh style={{ width: "35px", height: "35px" }} />
                    </IconButton>
                  </div>
                </div>

                {/* <button
                  className={
                    "border-1 rounded-md bg-blue-500 text-white hover:bg-blue-300 text-sm  font-bold px-2 py-1"
                  }
                  onClick={() => this.engine.ChangeBackground()}
                >
                  Change Background
                </button> */}
              </div>
              <div className="">
                <BottomPanel
                  postQuote={this.props.postQuote}
                  ref={SidebarRef}
                  filePath={this.props.filePath}
                  isIFrame={this.props.isIFrame}
                  t={this.props.t}
                  i18n={this.props.i18n}
                  menuOpen={menuOpen}
                  loadingComplete={() => this.setState({ loaded: true })}
                  menuToggle={() => {
                    this.setState({ menuOpen: !menuOpen });
                    setTimeout(() => {
                      this.engine.onWindowResize();
                    }, 100);
                  }}
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
              </div>
            </>
          )}
        </div>
      </>
    );
  }
}

export default withTranslation()(Viewer2);
