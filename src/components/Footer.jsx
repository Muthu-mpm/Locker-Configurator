/* eslint-disable react/prop-types */
import React, { PureComponent } from "react";
import ButtonComp from "./ButtonComp";

class Footer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {

    return (
      <div className="flex flex-row-reverse items-center content-center text-center">
        <ButtonComp
          onClick={() => {
           
          }}
        >
          Save
        </ButtonComp>
        <ButtonComp
          onClick={() => {
            console.log("clicked");
          }}
        >
          Close
        </ButtonComp>

      </div>
    );
  }
}
export default Footer;
