import React from "react";
import { useEffect } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import Profile from "../Profile/Profile";
import "./Dashboard.css";

const Dashboard = () => {
  const icmsUserInfo = JSON.parse(localStorage.getItem("icmsUserInfo"));
  useDocumentTitle("Dashboard");
  const navigate = useNavigate();
  useEffect(() => {
    if (icmsUserInfo == null) {
      navigate("/login");
    }

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100%",
          minHeight: "400px",
          border: "1px solid black",
        }}
      >
        <Sidebar className="dashboard-sidebar">
          <Menu>
            <MenuItem component={<Link to="" />}> Dashboard</MenuItem>
            <MenuItem component={<Link to="profile" />}> Profile</MenuItem>
            <MenuItem component={<Link to="profile" />}> Attendence</MenuItem>
            <MenuItem component={<Link to="profile" />}> Assignments</MenuItem>
          </Menu>
        </Sidebar>

        <Routes>
          <Route path="profile" element={<Profile />} />
        </Routes>
        {/* <main style={{ padding: 10 }}> Hello I am Dashboard</main> */}
      </div>
    </>
  );
};

export default Dashboard;
