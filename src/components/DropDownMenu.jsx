import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import ArchiveIcon from "@mui/icons-material/Archive";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
    MenuListProps={{
      "aria-labelledby": "basic-button",
      sx: { width: props.anchorEl && props.anchorEl.offsetWidth }, // <-- The line that does all
    }}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),

    maxHeight: 360,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function DropDownMenu({
  menuItems,
  title,
  subTitle,
  color,
  isImg,
  padding,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <Button
        id="demo-customized-ButtonCompComp"
        className=""
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        style={{
          backgroundColor: "white",
          width: "100%",
          justifyContent: "flex-start",
        }}
        onClick={handleClick}
        size="small"
      >
        <div
          className={`grid grid-cols-2  text-[#333333] text-sm font-normal w-full shadow-[#00000012] shadow-md  border border-[#D7D7D7] rounded-md ${
            padding ? "p-4" : "p-1  "
          }`}
        >
          <div className="flex flex-row col-span-2 justify-between">
            <div className="">
              <p className="text-left font-semibold normal-case">
                {isImg ? (
                  <>
                    {color && (
                      <img
                        src={color}
                        style={{
                          height: "14px",
                          position: "relative",
                          top: "2px",
                          width: "14px",
                          borderRadius: "50%",
                          display: "inline-block",
                        }}
                      ></img>
                    )}
                  </>
                ) : (
                  <>
                    {color && (
                      <span
                        className="border-gray-600 border-2 rounded-full"
                        style={{
                          height: "14px",
                          position: "relative",
                          top: "2px",
                          width: "14px",
                          backgroundColor: color,
                          borderRadius: "50%",
                          display: "inline-block",
                        }}
                      ></span>
                    )}
                  </>
                )}{" "}
                {title}
              </p>

              {subTitle && (
                <p
                  className="text-left  text-sm"
                  style={{ fontSize: "12px", textTransform: "none" }}
                >
                  {subTitle}
                </p>
              )}
            </div>
            <div className="text-right ">
              <KeyboardArrowDownIcon
                style={{
                  position: "relative",
                }}
              />
            </div>
          </div>
        </div>
      </Button>
      {menuItems ? (
        <StyledMenu
          id="demo-customized-menu"
          MenuListProps={{
            "aria-labelledby": "demo-customized-button",
          }}
          className="w-full"
          style={{ zIndex: "3000000" }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {menuItems(handleClose)}
        </StyledMenu>
      ) : (
        <StyledMenu
          id="demo-customized-menu"
          MenuListProps={{
            "aria-labelledby": "demo-customized-button",
          }}
          style={{ zIndex: "3000000" }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose} disableRipple>
            <EditIcon />
            Edit
          </MenuItem>
          <MenuItem onClick={handleClose} disableRipple>
            <FileCopyIcon />
            Duplicate
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={handleClose} disableRipple>
            <ArchiveIcon />
            Archive
          </MenuItem>
          <MenuItem onClick={handleClose} disableRipple>
            <MoreHorizIcon />
            More
          </MenuItem>
        </StyledMenu>
      )}
    </div>
  );
}
