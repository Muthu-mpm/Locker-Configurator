import React, { createRef } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Viewer from "./components/Viewer";
import Viewer2 from "./components/Viewer2";
import "./i18n";
const PanelRef = createRef();
if (process.env.NODE_ENV !== "production") {
  renderReactComponent("root");
  // setTimeout(() => {
  //   reactinitDCScene("IMPERIAL");
  //   reactComp().submitClick();
  // }, 1000);
}

export function renderReactComponent(selectorFromGwt, filePath, postQuote) {
  const root = createRoot(document.getElementById(selectorFromGwt));
  root.render(
    <Viewer2
      isIFrame={process.env.NODE_ENV === "production"}
      ref={PanelRef}
      filePath={filePath}
      CanvasID={selectorFromGwt + "Canvas"}
      postQuote={postQuote}
    />
  );
}

export function reactComp() {
  return PanelRef.current;
}
export function reactinitDCScene() {
  return PanelRef.current.initCanvas();
}
window.locker = {
  renderReactComponent,
  reactComp,
  reactinitDCScene,
};
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
