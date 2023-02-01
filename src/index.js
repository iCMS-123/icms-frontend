import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
// import { Navbar } from "react-bootstrap";
import SharedLayout from "./Components/SharedLayout/SharedLayout";
import { ProSidebarProvider } from "react-pro-sidebar";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
   
    <BrowserRouter>
    <ProSidebarProvider>

      <div className="container-fluid">
        <SharedLayout />
        <App />
      </div>
    </ProSidebarProvider>
      
    </BrowserRouter>
   
);
