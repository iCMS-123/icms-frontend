import React from "react";
import useDocumentTitle from "../Hooks/useDocumentTitle";
import Image from "react-bootstrap/Image";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  useDocumentTitle("404-Page Not Found");
  return (
    <div className="text-center">
      <h1 className="fw-bold" style={{ fontSize: "3rem" }}>
        Page Not Found, 🤯
      </h1>

      <div id="cf">
        <img
          className="img2"
          src={require("../assets/images/4.jpg")}
          alt="wad"
        />
        <img
          className="img1"
          src={require("../assets/images/1.jpg")}
          alt="wadawd"
        />
      </div>

      <Button
        id="go-back-btn"
        className="d-block my-0 mx-auto"
        onClick={() => {
          window.history.back();
        }}
        variant="dark"
      >
        Go Back
      </Button>

      <br />
      <br />
      <br />
      <br />
      {/*   
    <Image src="https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-1932.jpg
    " /> */}
    </div>
  );
};

export default NotFound;
