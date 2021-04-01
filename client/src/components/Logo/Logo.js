import React from "react";
import "./Logo.css";
import paw from "./Assets/paw.png";

function Logo() {
  return (
    <>
      <h1 className="container">
      <img src={paw}></img>
        Woofr
      </h1>
    </>
  );
}
export default Logo;
