/* eslint-disable react/prop-types */
import React, { PureComponent } from "react";

class ButtonComp extends PureComponent {
  constructor(props) {
    super(props);
  }
  // "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-6 py-1 text-center mr-2 mb-2 "
  render() {
    return (
      <button
        type="button"
        className={
          "bg-[#157fcc] rounded-md py-1 text-xs font-semibold px-6 mr-2 mb-2  text-white hover:bg-[#68b2e7] " +
          this.props.className
        }
        onClick={this.props.onClick}
      >
        {this.props.children}
      </button>
    );
  }
}
export default ButtonComp;
