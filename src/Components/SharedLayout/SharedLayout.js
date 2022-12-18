import React from "react";
import { Link } from "react-router-dom";
import "./SharedLayout.css";
const SharedLayout = () => {
  return (
    <div>
      <Link to="/" className="home-link">
        <div className="h1 text-center mt-2">
          iCMS - Innovative College Management System
        </div>
      </Link>
    </div>
  );
};

export default SharedLayout;
