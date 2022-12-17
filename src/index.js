import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
// import { Navbar } from "react-bootstrap";
import SharedLayout from "./Components/SharedLayout/SharedLayout";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="container">
        <SharedLayout />
        <App />
      </div>
    </BrowserRouter>
  </React.StrictMode>
);
