/* eslint-disable react/prop-types */
import React, { PureComponent } from "react";

// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown ";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DropDownMenu, { StyledMenu } from "./DropDownMenu";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ImageListItem,
  ListItemText,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
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
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import DropDownMenuLang from "./DropDownMenuLang";
import ButtonComp from "./ButtonComp";
import ProgressBar from "./ProgressBar";
let rowImg = "image/col.png";
let colmg = "image/row.png";
let arrowsmg = "image/arrow.svg";
let saveimg = "image/save.svg";
let worldimg = "image/world.svg";
let phoneimg = "image/phone.svg";
let arrowRightimg = "image/arrowRight.svg";
let tempimg = "image/temp.svg";
let chargeimg = "image/charge.svg";
let detectimg = "image/detect.svg";
let uvimg = "image/uv.svg";
let ventilatedimg = "image/ventilated.svg";
let paymentimg = "image/payment.svg";
let lightimg = "image/light.svg";
let benchimg = "image/bench.svg";
let logo = "image/logo.png";
let logoProcent = "image/Logo-16-procent.png";
let bottomImg = "image/bottomPdf.jpg";
let terminalimg = "image/terminal.png";
let keyImg = "image/key.svg";
const materialTypes = [
  { name: "Steel" },
  { name: "Wood" },
  // { name: "Aluminium" },
  // { name: "Glass" },
];

const Accesseries = [{ name: "Rooftop" }];
let Extras = [
  // { name: "Cool/warm", info: "", img: tempimg },
  { name: "USB/220V", info: "", img: chargeimg },
  { name: "Detection", info: "", img: detectimg },
  // { name: "Sterile/UV-C", info: "", img: uvimg },
  { name: "Ventilated", info: "", img: ventilatedimg },
  // { name: "Direct payment", info: "", img: paymentimg },
  { name: "Lights", info: "", img: lightimg },
  { name: "Bench", info: "", img: benchimg },
];
let WoodMaterials = [
  { name: "Vicenza Eik", info: "", img: tempimg },
  { name: "Halifax Eik Wit", info: "", img: chargeimg },
  { name: "Mainau Berk", info: "", img: detectimg },
  { name: "Mandal Esdoorn", info: "", img: uvimg },
  { name: "Sorano Eik Zwartbruin", info: "", img: ventilatedimg },
  { name: "Halifax Eiken bruin", info: "", img: paymentimg },
  { name: "Platinawit", info: "", img: lightimg },
  { name: "Diamantgrijs", info: "", img: benchimg },
  { name: "Stofgrijs", info: "", img: benchimg },
  { name: "Meigroen", info: "", img: benchimg },
  { name: "Soft Black", info: "", img: benchimg },
  { name: "Kosmisch blauw", info: "", img: benchimg },
];
const materialColors = [
  { name: "Light grey", color: "rgb(197, 199, 196)" },
  { name: "Anthracite", color: "rgb(56, 62, 66)" },
  { name: "White", color: "rgb(248, 248, 248)" },
];
const materialDoorColors = [
  { name: "Light grey", color: "rgb(197, 199, 196)" },
  { name: "Anthracite", color: "rgb(56, 62, 66)" },
  { name: "White", color: "rgb(248, 248, 248)" },
  { name: "Light blue", color: "rgb(0, 137, 182)" },
  { name: "Orange", color: "rgb( 226, 83, 3)" },
];
const keySystems = [
  { id: 40000, name: "Smart (Standaard)", img: "" },
  { id: 400001, name: "Cilinderslot", img: "image/keys/cilinderslot.png" },
  { id: 400002, name: "Draaiknop", img: "image/keys/Draaiknop.png" },
  {
    id: 400003,
    name: "Mechanisch cijferslot",
    img: "image/keys/olssen_mechanisch.png",
  },
  {
    id: 500001,
    name: "Keynius elektronisch codeslot",
    img: "image/keys/Keynius.png",
  },
  {
    id: 500002,
    name: "Keynius elektronisch RFID slot",
    img: "image/keys/Keynius_batterij.png",
  },
];
const accessoires40 = [
  {
    id: 121001,
    name: "None",
    img: "",
  },
  {
    id: 120002,
    name: "Slanted roof",
    img: "image/accessories/Schuin_dak.png",
  },
];
const accessoires40Bottom = [
  {
    id: 121001,
    name: "None",
    img: "",
  },
  {
    id: 121001,
    name: "Base",
    img: "image/accessories/Sokkel_Capsa_3c13.png",
  },
  {
    id: 122001,
    name: "Legs",
    img: "image/accessories/legs.png",
  },
  {
    id: 123001,
    name: "Bench wooden slats",
    img: "image/accessories/bench.png",
  },
  {
    id: 124001,
    name: "Bench plastic slats",
    img: "image/accessories/bench.png",
  },
];
const accessoires30 = [
  {
    id: 121001,
    name: "None",
    img: "",
  },
  {
    id: 120002,
    name: "Slanted roof",
    img: "image/accessories/Schuin_dak.png",
  },
];
const accessoires30Bottom = [
  {
    id: 121001,
    name: "None",
    img: "",
  },
  {
    id: 121001,
    name: "Base",
    img: "image/accessories/Sokkel_Capsa_3c13.png",
  },
  {
    id: 122001,
    name: "Legs",
    img: "image/accessories/legs.png",
  },
  {
    id: 123001,
    name: "Bench wooden slats",
    img: "image/accessories/bench.png",
  },
  {
    id: 124001,
    name: "Bench plastic slats",
    img: "image/accessories/bench.png",
  },
];
class BottomPanel extends PureComponent {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      currentMaterialType: "Steel",
      currentSkinColor: { name: "White", color: "rgb(248, 248, 248)" },
      currentDoorMaterialType: "Steel",
      currentDoorSkinColor: { name: "Anthracite", color: "rgb(56, 62, 66)" },
      currentKeySystem: "Smart (Standaard)",
      currentAccess: "Choose top type",
      currentAccessBottom: "Select type of chassis",
      is30: true,
      menuOpen: true,
      Languages: ["English", "Dutch"],

      currentLang: "English",
      selectedExtras: [],
      openDialog: false,
      name: "",
      email: "",
      companyname: "",
      telephonenumber: "",
      comments: "",
      steps: 0,
    };
    this.initFilePaths();
  }
  componentDidMount() {
    this.props.i18n.changeLanguage("en");
  }
  UpdateJson(data) {
    this.setState({
      currentKeySystem: data.KeySystem,
      currentAccess: data.Accessories,
      selectedExtras: data.Extras,
    });
  }
  initFilePaths() {
    let path = this.props.filePath;
    if (path) {
      keyImg = path + keyImg;
      terminalimg = path + terminalimg;
      logo = path + logo;
      bottomImg = path + bottomImg;
      logoProcent = path + logoProcent;
      rowImg = path + rowImg;
      colmg = path + colmg;
      arrowsmg = path + arrowsmg;
      saveimg = path + saveimg;
      worldimg = path + worldimg;
      phoneimg = path + phoneimg;
      arrowRightimg = path + arrowRightimg;
      tempimg = path + tempimg;
      chargeimg = path + chargeimg;
      detectimg = path + detectimg;
      uvimg = path + uvimg;
      ventilatedimg = path + ventilatedimg;
      paymentimg = path + paymentimg;
      lightimg = path + lightimg;
      benchimg = path + benchimg;
      Extras = [
        // { name: "Cool/warm", info: "", img: tempimg },
        { name: "USB/220V", info: "", img: chargeimg },
        { name: "Detection", info: "", img: detectimg },
        // { name: "Sterile/UV-C", info: "", img: uvimg },
        { name: "Ventilated", info: "", img: ventilatedimg },
        // { name: "Direct payment", info: "", img: paymentimg },
        { name: "Lights", info: "", img: lightimg },
        { name: "Bench", info: "", img: benchimg },
      ];
      let pWood = path + "textures/wooden/";
      WoodMaterials = [
        { name: "Vicenza Eik", info: "", img: pWood + "Vicenza Eik.jpg" },
        {
          name: "Halifax Eik Wit",
          info: "",
          img: pWood + "Halifax Eik Wit.jpg",
        },
        { name: "Mainau Berk", info: "", img: pWood + "Mainau Berk.jpg" },
        { name: "Mandal Esdoorn", info: "", img: pWood + "Mandal Esdoorn.jpg" },
        {
          name: "Sorano Eik Zwartbruin",
          info: "",
          img: pWood + "Sorano Eik Zwartbruin.jpg",
        },
        {
          name: "Halifax Eiken bruin",
          info: "",
          img: pWood + "Halifax Eiken bruin.jpg",
        },
        { name: "Platinawit", info: "", img: pWood + "Platinawit.jpg" },
        { name: "Diamantgrijs", info: "", img: pWood + "Diamantgrijs.jpg" },
        { name: "Stofgrijs", info: "", img: pWood + "Stofgrijs.jpg" },
        { name: "Meigroen", info: "", img: pWood + "Meigroen.jpg" },
        { name: "Soft Black", info: "", img: pWood + "Soft Black.jpg" },
        { name: "Kosmisch blauw", info: "", img: pWood + "Kosmisch blauw.jpg" },
      ];
      keySystems.forEach((item) => {
        if (item.img !== "") item.img = path + item.img;
      });
      accessoires40.forEach((item) => {
        if (item.img !== "") item.img = path + item.img;
      });
      accessoires40Bottom.forEach((item) => {
        if (item.img !== "") item.img = path + item.img;
      });
      accessoires30.forEach((item) => {
        if (item.img !== "") item.img = path + item.img;
      });
      accessoires30Bottom.forEach((item) => {
        if (item.img !== "") item.img = path + item.img;
      });
    }
  }
  updateRowscols() {
    const engine = this.props.engine();
    console.log(engine);
    this.setState({ row: engine.rows, cols: engine.cols, is30: engine.Is30cm });
  }
  updateSelection(name) {
    let selectedExtras = [...this.state.selectedExtras];

    if (selectedExtras.includes(name)) {
      selectedExtras = selectedExtras.filter((item) => item !== name);
    } else {
      selectedExtras.push(name);
    }
    this.setState({ selectedExtras: [] });
    this.setState({ selectedExtras: selectedExtras });
  }
  QuoteForm() {
    const {
      openDialog,
      name,
      email,
      companyname,
      telephonenumber,
      comments,
      nameEror,
      emailEror,
      companyError,
      telephoneError,
    } = this.state;
    const { menuOpen, t, i18n } = this.props;
    return (
      <div>
        <Dialog
          open={openDialog}
          onClose={() => this.setState({ openDialog: false })}
        >
          <DialogTitle>{t("Quote")}</DialogTitle>
          <DialogContent
            sx={{
              width: 400,
              maxWidth: "100%",
            }}
          >
            <DialogContentText>
              {/* To subscribe to this website, please enter your email address
              here. We will send updates occasionally. */}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="email"
              error={nameEror}
              helperText={nameEror && "please enter name."}
              label={t("Enter Your Name")}
              required
              type="name"
              fullWidth
              variant="standard"
              value={name}
              onChange={(e) => this.setState({ name: e.target.value })}
            />
            <TextField
              margin="dense"
              id="name"
              label={t("Enter Your Email Address")}
              type="email"
              error={emailEror}
              helperText={emailEror && "please enter Email."}
              required
              fullWidth
              variant="standard"
              value={email}
              onChange={(e) => this.setState({ email: e.target.value })}
            />
            <TextField
              margin="dense"
              id="companyname"
              error={companyError}
              helperText={companyError && "please enter Company name."}
              required
              label={t("Company Name")}
              type="text"
              fullWidth
              variant="standard"
              value={companyname}
              onChange={(e) => this.setState({ companyname: e.target.value })}
            />
            <TextField
              margin="dense"
              id="telephone"
              label={t("Telephone Number")}
              error={telephoneError}
              helperText={telephoneError && "please enter telephone number."}
              required
              type="text"
              fullWidth
              variant="standard"
              value={telephonenumber}
              onChange={(e) =>
                this.setState({ telephonenumber: e.target.value })
              }
            />
            <TextField
              margin="dense"
              id="comments"
              label={t("Comments")}
              type="text"
              fullWidth
              variant="standard"
              value={comments}
              onChange={(e) => this.setState({ comments: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ openDialog: false })}>
              {t("Cancel")}
            </Button>
            <Button onClick={() => this.submitQuote()}>{t("Send")}</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  submitQuote() {
    const {
      openDialog,
      name,
      email,
      companyname,
      telephonenumber,
      comments,
      nameEror,
      emailEror,
      companyError,
      telephoneError,
    } = this.state;

    if (name === "") this.setState({ nameEror: true });
    if (email === "") this.setState({ emailEror: true });
    if (companyname === "") this.setState({ companyError: true });
    if (telephonenumber === "") this.setState({ telephoneError: true });
    if (
      name !== "" &&
      email !== "" &&
      companyname !== "" &&
      telephonenumber !== ""
    )
      this.props
        .engine()
        .capture(logo, logoProcent, bottomImg, true, this.props.t);
  }
  postData(pdf) {
    const {
      name,
      email,
      currentKeySystem,
      currentAccess,
      selectedExtras,
      companyname,
      telephonenumber,
      comments,
    } = this.state;
    const { menuOpen, t, i18n } = this.props;
    let data = this.props
      .engine()
      .getUpdatedJson(currentKeySystem, currentAccess, selectedExtras);
    console.log(data);
    const dataForm = new FormData();
    dataForm.append("name", name);
    dataForm.append("email", email);
    dataForm.append("companyname", companyname);
    dataForm.append("telephonenumber", telephonenumber);
    dataForm.append("comments", comments);

    dataForm.append("Rows", data.Rows);
    dataForm.append("Cols", data.Cols);
    dataForm.append("DoorMaterial", t(data.DoorMaterial));
    dataForm.append("DoorColor", t(data.DoorColor));
    dataForm.append("BodyMaterial", t(data.BodyMaterial));
    dataForm.append("BodyColor", t(data.BodyColor));
    dataForm.append("KeySystem", t(data.KeySystem));
    dataForm.append("AccessoriesTop", t(data.AccessoriesTop));
    dataForm.append("AccessoriesBottom", t(data.AccessoriesBottom));
    dataForm.append("totalTerminals", t(data.totalTerminals));
    let extras = [];
    data.Extras.forEach((element) => {
      extras.push(t(element));
    });
    dataForm.append("Extras", extras);
    dataForm.append("file", pdf);
    let formData = { data, name, email };
    fetch(this.props.postQuote, {
      method: "POST",
      body: dataForm,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Handle data
      })
      .catch((err) => {
        console.log(err.message);
      });
    this.setState({ openDialog: false });
  }
  toolTip(title) {
    return (
      <Tooltip title={title}>
        <IconButton>
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
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
      currentKeySystem,
      currentAccess,
      currentAccessBottom,
      is30,
      Languages,
      currentLang,
      selectedExtras,
      openDialog,
      steps,
    } = this.state;
    const { menuOpen, t, i18n } = this.props;
    return (
      <>
        <div className="w-full bg-[#fffdfd] text-[#333333] font-sans text-sm border-t-2 border-gray-300">
          <div className="relative -top-8 text-white">
            <IconButton
              color="inherit"
              className="text-white bg-white -left-3 font-bold font-sans"
              onClick={() => {
                this.props.menuToggle();
              }}
            >
              {menuOpen ? (
                <div className="bg-white text-black flex flex-row px-4 pt-1">
                  <KeyboardArrowDownOutlinedIcon fontSize="medium"></KeyboardArrowDownOutlinedIcon>
                  <p className="text-sm"> {t("Close the panel")}</p>
                </div>
              ) : (
                <div className="bg-white text-black flex flex-row px-4 pt-1">
                  <KeyboardArrowUpOutlinedIcon fontSize="medium"></KeyboardArrowUpOutlinedIcon>
                  <p className="text-sm"> {t("Open the panel")}</p>
                </div>
              )}
            </IconButton>
          </div>
          {menuOpen && (
            <div className="overflow-y-auto pl-4  -top-8 relative">
              <ProgressBar className="" step={steps}></ProgressBar>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6 3xl:grid-cols-6 pt-2">
                <div className="col-span-2 md:col-span-1 lg:col-span-1 ">
                  <label className=" font-bold text-black  pt-4">
                    {t("Material Body")}
                  </label>
                  <div className="pt-2 w-3/4 pb-2">
                    <DropDownMenu
                      title={t(currentMaterialType)}
                      subTitle={t("The Material")}
                      menuItems={(handleClose) => (
                        <div>
                          {materialTypes.map((item) => (
                            <MenuItem
                              className="w-full"
                              disableRipple
                              onClick={() => {
                                handleClose();
                                this.props
                                  .engine()
                                  .changeBodyMaterial(item.name);
                                this.props
                                  .engine()
                                  .changeDoorMaterial(item.name);
                                this.setState({
                                  currentMaterialType: item.name,
                                  currentDoorMaterialType: item.name,
                                });
                              }}
                            >
                              {t(item.name)}
                            </MenuItem>
                          ))}
                        </div>
                      )}
                    />
                  </div>

                  <div className=" w-3/4 ">
                    {currentMaterialType === "Wood" ? (
                      <DropDownMenu
                        title={t(currentSkinColor.name)}
                        subTitle={t("Choose preffered color")}
                        color={currentSkinColor.img}
                        isImg
                        menuItems={(handleClose) => (
                          <div>
                            {WoodMaterials.map((item) => (
                              <MenuItem
                                disableRipple
                                onClick={() => {
                                  handleClose();
                                  this.props
                                    .engine()
                                    .changeSkinColor(item.img, item.name);
                                  this.setState({ currentSkinColor: item });
                                }}
                              >
                                <div className="grid grid-cols-2 w-full">
                                  <p> {t(item.name)}</p>
                                  <img
                                    className="h-24 w-full"
                                    src={item.img}
                                  ></img>
                                </div>
                              </MenuItem>
                            ))}
                          </div>
                        )}
                      />
                    ) : (
                      <DropDownMenu
                        title={t(currentSkinColor.name)}
                        subTitle={t("Choose preffered color")}
                        color={currentSkinColor.color}
                        menuItems={(handleClose) => (
                          <div>
                            {materialColors.map((item) => (
                              <MenuItem
                                disableRipple
                                onClick={() => {
                                  handleClose();
                                  this.props
                                    .engine()
                                    .changeSkinColor(item.color, item.name);
                                  this.setState({ currentSkinColor: item });
                                }}
                              >
                                {t(item.name)}
                              </MenuItem>
                            ))}
                          </div>
                        )}
                      />
                    )}
                  </div>

                  <label className=" font-bold pt-2 text-black ">
                    {t("Material Doors")}
                  </label>
                  <div className="pt-2 w-3/4 pb-2">
                    <DropDownMenu
                      title={t(currentDoorMaterialType)}
                      subTitle={t("Material Doors2")}
                      menuItems={(handleClose) => (
                        <div>
                          <MenuItem
                            disableRipple
                            onClick={() => {
                              handleClose();
                              // this.props
                              //   .engine()
                              //   .changeDoorMaterial(item.name);
                              // this.setState({
                              //   currentDoorMaterialType: item.name,
                              // });
                            }}
                          >
                            {t(currentDoorMaterialType)}
                          </MenuItem>
                        </div>
                      )}
                    />
                  </div>

                  <div className=" w-3/4 ">
                    {currentDoorMaterialType === "Wood" ? (
                      <DropDownMenu
                        title={t(currentDoorSkinColor.name)}
                        subTitle={t("Material Doors Color")}
                        color={currentDoorSkinColor.img}
                        isImg
                        menuItems={(handleClose) => (
                          <div>
                            {WoodMaterials.map((item) => (
                              <MenuItem
                                disableRipple
                                onClick={() => {
                                  handleClose();
                                  this.props
                                    .engine()
                                    .changeDoorColor(item.img, item.name);
                                  this.setState({ currentDoorSkinColor: item });
                                }}
                              >
                                <div className="grid grid-cols-2 w-full">
                                  <p> {t(item.name)}</p>
                                  <img
                                    className="h-24 w-full"
                                    src={item.img}
                                  ></img>
                                </div>
                              </MenuItem>
                            ))}
                          </div>
                        )}
                      />
                    ) : (
                      <DropDownMenu
                        title={t(currentDoorSkinColor.name)}
                        subTitle={t("Material Doors Color")}
                        color={currentDoorSkinColor.color}
                        menuItems={(handleClose) => (
                          <div>
                            {materialDoorColors.map((item) => (
                              <MenuItem
                                disableRipple
                                onClick={() => {
                                  handleClose();
                                  this.props
                                    .engine()
                                    .changeDoorColor(item.color, item.name);
                                  this.setState({ currentDoorSkinColor: item });
                                }}
                              >
                                {t(item.name)}
                              </MenuItem>
                            ))}
                          </div>
                        )}
                      />
                    )}
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1 lg:col-span-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 ">
                    <div>
                      <label className=" font-bold  text-left  align-middle py-4">
                        {t("Number of Column")}
                        {cols ? ` (${cols})` : ""}
                        {/* {this.toolTip(t("Number of Column info"))} */}
                      </label>
                      <div className="grid grid-cols-2 items-center py-4 -left-6 relative">
                        <div>
                          <img
                            className="mt-2"
                            src={rowImg}
                            style={{ height: 200, width: 100, objectFit: "" }}
                          />
                          <p className="font-bold text-md pl-8">
                            {" "}
                            {is30 ? "30 CM" : "40 CM"}
                          </p>

                          <div className="flex flex-row relative  pt-4 w-52">
                            <DropDownMenu
                              padding
                              title={t("Choose Width")}
                              menuItems={(handleClose) => (
                                <div>
                                  {["30 Cm", "40 Cm"].map((item) => (
                                    <MenuItem
                                      disableRipple
                                      onClick={() => {
                                        handleClose();
                                        this.setState({
                                          currentDoorSkinColor: item,
                                        });
                                        this.props
                                          .engine()
                                          .ChangeWidth(item === "30 Cm");
                                        if (steps < 1)
                                          this.setState({ steps: 1 });
                                      }}
                                    >
                                      {t(item)}
                                    </MenuItem>
                                  ))}
                                </div>
                              )}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex flex-row  bg-white w-24 -top-10 relative text-[#A7A7A7] shadow-[#00000012] shadow-md  border border-[#D7D7D7] rounded-md">
                            <IconButton
                              color="inherit"
                              onClick={() => {
                                this.props.engine().removeCol();
                                if (steps < 1) this.setState({ steps: 1 });
                              }}
                            >
                              <Remove />
                            </IconButton>
                            <IconButton
                              color="inherit"
                              onClick={() => {
                                this.props.engine().addCol();
                                if (steps < 1) this.setState({ steps: 1 });
                              }}
                            >
                              <Add />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col mx-4">
                        <label className=" font-bold  text-left  align-middle ">
                          {t("Box per Column")}
                          {row ? ` (${row})` : ""}
                          {/* {this.toolTip(t("Box per Column info"))} */}
                        </label>
                        {/* <label className=" font-normal text-sm  text-left  align-middle ">
                          {t("Max 10 Up")}
                        </label> */}
                      </div>

                      <div className="grid grid-cols-2 items-center py-4 pb-12">
                        <img
                          className="mt-2"
                          src={colmg}
                          style={{ height: 100, width: 100, objectFit: "" }}
                        />
                        <div className="flex flex-row  bg-white w-24  text-[#A7A7A7] shadow-[#00000012] shadow-md  border border-[#D7D7D7] rounded-md">
                          <IconButton
                            color="inherit"
                            onClick={() => {
                              this.props.engine().removeRow();
                              if (steps < 2) this.setState({ steps: 2 });
                            }}
                          >
                            <Remove />
                          </IconButton>
                          <IconButton
                            color="inherit"
                            onClick={() => {
                              this.props.engine().addRow();
                              if (steps < 2) this.setState({ steps: 2 });
                            }}
                          >
                            <Add />
                          </IconButton>
                        </div>
                      </div>
                      {/* <label className=" font-normal text-sm  text-left  align-middle py-4 ">
                        {t("Swipe the configuration on the frame")}
                      </label>
                      <img
                        className="mt-2"
                        src={arrowsmg}
                        style={{ height: 10, width: 20, objectFit: "" }}
                      ></img> */}
                    </div>
                  </div>
                </div>
                <div className="col-span-2 md:col-span-1 ">
                  <div className="flex flex-row items-start">
                    {/* <img className="pt-3 pr-2" src={keyImg}></img> */}
                    <div>
                      <label className=" font-bold pt-4">
                        {t("Choose key system")}{" "}
                        {/* {this.toolTip(t("key system descript"))} */}
                      </label>
                      {/* <p className="text-black text-sm underline">
                        {" "}
                        {t("Choose key system sub")}
                      </p> */}
                    </div>
                  </div>
                  <div className="pt-3 w-full pb-2">
                    <DropDownMenu
                      title={t(currentKeySystem)}
                      // subTitle="Choose key system"
                      padding
                      color={currentSkinColor.img}
                      isImg
                      menuItems={(handleClose) => (
                        <div>
                          {keySystems.map((item) => (
                            <MenuItem
                              disableRipple
                              onClick={() => {
                                handleClose();
                                this.setState({
                                  currentKeySystem: item.name,
                                });
                                if (steps < 3) this.setState({ steps: 3 });
                              }}
                            >
                              <div className="flex flex-row justify-between w-full  text-sm">
                                <p
                                  className={`col-span-2 ${
                                    item.img ? "" : "h-12 pt-4"
                                  } `}
                                >
                                  {t(item.name)}
                                </p>
                                {item.img && (
                                  <img
                                    className="h-12 w-12"
                                    src={item.img}
                                  ></img>
                                )}
                              </div>
                            </MenuItem>
                          ))}
                        </div>
                      )}
                    />
                  </div>
                  <div className="  bg-white  p-2 m-2 text-[#A7A7A7] shadow-[#00000012] shadow-md  border border-[#D7D7D7] rounded-md">
                    <label className=" font-bold text-black ">
                      {t("Place the terminal on the canvas")}{" "}
                      {/* {this.toolTip(t("Place the terminal on the canvas"))} */}
                    </label>
                    <div className="grid grid-cols-2 items-center">
                      <img
                        className="mt-2"
                        src={terminalimg}
                        style={{ height: 100, width: 100, objectFit: "" }}
                      />
                      <div className="flex flex-row  bg-white w-24  text-[#A7A7A7] shadow-[#00000012] shadow-md  border border-[#D7D7D7] rounded-md">
                        <IconButton
                          color="inherit"
                          onClick={() => {
                            this.props.engine().removeTerminal();
                            if (steps < 3) this.setState({ steps: 3 });
                          }}
                        >
                          <Remove />
                        </IconButton>
                        <IconButton
                          color="inherit"
                          onClick={() => {
                            this.props.engine().addTerminal();
                            if (steps < 3) this.setState({ steps: 3 });
                          }}
                        >
                          <Add />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pl-2 col-span-2 md:col-span-1">
                  <label className="pl-3 font-bold pt-4">
                    {t("Accessories")}
                    {/* {this.toolTip(t("Accessories info"))} */}
                  </label>
                  <div className="pt-3 w-full ">
                    <DropDownMenu
                      title={t(currentAccessBottom)}
                      padding
                      // subTitle={t("Top to refine the look of the locker...")}
                      color={currentAccessBottom.img}
                      isImg
                      menuItems={(handleClose) => (
                        <div>
                          {(is30
                            ? accessoires30Bottom
                            : accessoires40Bottom
                          ).map((item) => (
                            <MenuItem
                              disableRipple
                              onClick={() => {
                                handleClose();
                                if (item.name === "None")
                                  this.setState({
                                    currentAccessBottom:
                                      "Select type of chassis",
                                  });
                                else
                                  this.setState({
                                    currentAccessBottom: item.name,
                                  });
                                this.props
                                  .engine()
                                  .changeAccessories(item.name, true);
                                if (steps < 4) this.setState({ steps: 4 });
                              }}
                            >
                              <div className="flex flex-row justify-between w-full  text-sm">
                                <p
                                  className={`col-span-2 ${
                                    item.img ? "" : "h-12 pt-3"
                                  } `}
                                >
                                  {t(item.name)}
                                </p>
                                {item.img !== "" && (
                                  <img
                                    className="h-12 w-12"
                                    src={item.img}
                                  ></img>
                                )}
                              </div>
                            </MenuItem>
                          ))}
                        </div>
                      )}
                    />
                    <div className="pt-4">
                      <DropDownMenu
                        title={t(currentAccess)}
                        padding
                        // subTitle={t("Top to refine the look of the locker...")}
                        color={currentAccess.img}
                        isImg
                        menuItems={(handleClose) => (
                          <div>
                            {(is30 ? accessoires30 : accessoires40).map(
                              (item) => (
                                <MenuItem
                                  disableRipple
                                  onClick={() => {
                                    handleClose();
                                    if (item.name === "None")
                                      this.setState({
                                        currentAccess: "Choose top type",
                                      });
                                    else
                                      this.setState({
                                        currentAccess: item.name,
                                      });
                                    this.props
                                      .engine()
                                      .changeAccessories(item.name, false);
                                    if (steps < 4) this.setState({ steps: 4 });
                                  }}
                                >
                                  <div className="flex flex-row justify-between w-full  text-sm">
                                    <p
                                      className={`col-span-2 ${
                                        item.img ? "" : "h-12 pt-3"
                                      } `}
                                    >
                                      {t(item.name)}
                                    </p>
                                    {item.img !== "" && (
                                      <img
                                        className="h-12 w-12"
                                        src={item.img}
                                      ></img>
                                    )}
                                  </div>
                                </MenuItem>
                              )
                            )}
                          </div>
                        )}
                      />
                    </div>
                  </div>
                  {/* <div className="flex flex-row gap-2">
                    {this.toolTip(t("Accessories info"))}
                    <p>{t("accessoires descript")} </p>
                  </div> */}
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className=" font-bold pt-4">
                    {t("Did you kow? (Optional)")}
                  </label>
                  <div className="flex flex-row gap-2 pt-8 pb-3">
                    <InfoOutlinedIcon fontSize="small" />
                    <p>{t("Did you kow? (Optional) info")}</p>
                  </div>
                  <div className="my-4 py-2 px-4 mx-2 bg-white   shadow-[#00000012] shadow-md  border border-[#D7D7D7] rounded-md">
                    {Extras.map((item) => (
                      <div
                        className={`flex flex-row py-1 gap-2 hover:cursor-pointer  hover:bg-sky-400 ${
                          selectedExtras.includes(item.name)
                            ? "bg-green-500"
                            : ""
                        }`}
                        onClick={() => {
                          this.updateSelection(item.name);
                          if (steps < 5) this.setState({ steps: 5 });
                        }}
                      >
                        <div className="border-2 border-gray-700 rounded-md object-center w-8  ">
                          <img className="m-2" src={item.img}></img>
                        </div>
                        <p>{t(item.name)}</p>
                      </div>
                    ))}
                    <p>{t("extra descript2")}</p>
                  </div>
                </div>
              </div>
              <hr className="w-full mt-4 pt-2"></hr>
              <div className="w-full sm:grid sm:grid-cols-2 object-center content-center flex-col-reverse flex relative -left-6 ">
                <div className="flex flex-row pt-2 col-span-2 sm:col-span-1">
                  <DropDownMenuLang
                    img={worldimg}
                    menuItems={(handleClose) => (
                      <div>
                        {Languages.map((item) => (
                          <MenuItem
                            disableRipple
                            onClick={() => {
                              this.setState({ currentLang: item });
                              i18n.changeLanguage(
                                item === "English" ? "en" : "dutch"
                              );
                              handleClose();
                            }}
                          >
                            <p> {item}</p>
                          </MenuItem>
                        ))}
                      </div>
                    )}
                  />

                  <div className="pl-4 flex flex-row pt-2 gap-4">
                    <img
                      className=""
                      src={phoneimg}
                      style={{ height: 22, width: 22, objectFit: "" }}
                    ></img>
                    <p>{t("Call us")} : +31 (0) 184 611 400</p>
                  </div>
                </div>

                <div className="flex flex-col-reverse  sm:flex-row-reverse pt-2 col-span-2 sm:col-span-1 ">
                  <div className="">
                    <button
                      className="bg-[#54CA70] py-1 rounded-md  px-6 mr-4 object-center w-full mt-2 sm:mt-0"
                      onClick={() => {
                        this.setState({ openDialog: true });
                        if (steps < 6) this.setState({ steps: 6 });
                      }}
                    >
                      <div className="flex object-center text-center justify-center">
                        <p className="py-2 font-bold text-white">
                          {t("Quotebtn")}
                        </p>
                      </div>
                    </button>
                  </div>
                  <button
                    className="bg-[#EDEDFF] border-2  rounded-md px-6 mx-2 object-center"
                    onClick={() => {
                      this.props.engine().capture(logo, logoProcent, bottomImg);
                      if (steps < 5) this.setState({ steps: 5 });
                    }}
                  >
                    <div className="flex object-center text-center justify-center">
                      <img className="m-2" src={saveimg}></img>
                      <p className="pt-2 font-bold">
                        {" "}
                        {t("Save and download")}
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
          {this.QuoteForm()}
        </div>
      </>
    );
  }
}
export default BottomPanel;
