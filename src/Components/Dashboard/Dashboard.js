import React from "react";
import { useEffect } from "react";
import { Link, Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Container, Nav, Navbar } from "react-bootstrap";
import Profile from "../Profile/Profile";
import "./Dashboard.css";
import { Basic } from "./Basic";
import StudentsInfo from "../StudentsInfo/StudentsInfo";
import Classrooms from "../Classrooms/Classrooms"

const navLinkStyles = {
  textDecoration: 'none',
  color:'white'
}

const Dashboard = () => {
  const navigate = useNavigate();
  useDocumentTitle("Dashboard");
  const icmsUserInfo =  JSON.parse(localStorage.getItem("icmsUserInfo"));
  console.log(icmsUserInfo);
  useEffect(() => { 
    if (icmsUserInfo === null) {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  const handleLogout = (event)=> {
    event.preventDefault();
    localStorage.removeItem("icmsUserInfo");
    navigate("../login");
  }


  return (
     
      <div
        style={{
          display: "flex",
          height:"100%",
          minHeight: "400px",
          border: "1px solid black",
        }}
      >
     <div className="dashboard-left">
        <h3 className="sidebar-header fw-bold mb-0 py-2 text-center">iCMS</h3>

          <Sidebar className="dashboard-sidebar">
          <Menu className="dashboard-menu">
            <MenuItem className="menuitem" component={<Link to="" />}> Dashboard</MenuItem>
            <MenuItem className="menuitem" component={<Link to="profile" />}> Profile</MenuItem>
            {true &&  <MenuItem className="menuitem" component={<Link to="studentsinfo" />}> Students Info</MenuItem>}
            {true && <MenuItem className="menuitem" component={<Link to="classrooms" />}> Classrooms</MenuItem>}
          </Menu>
        </Sidebar>

     </div>
      

        {/* Right side containing Navbar and Content */}

      <div className="dashboard-right">

      <Navbar className="common-navbar" expand="lg">
      <Container className="common-navbar-container">
        <Navbar.Brand as={NavLink} to="./">React</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          <Nav.Link as={NavLink} style={navLinkStyles} to="./heysujal">Hello</Nav.Link>
          <Nav.Link as={NavLink} style={navLinkStyles} to="./aman">Hello</Nav.Link>
          <Nav.Link as={NavLink} style={navLinkStyles} to="./harshit">Hello</Nav.Link>
          <Nav.Link onClick = {handleLogout}  className ="btn btn-danger me-3" as={NavLink} style={{ textDecoration: 'none',color:'white',float:'right',position:'absolute', right:'0px'}} to="../login">Logout</Nav.Link>
            {/* <Nav.Link><NavLink to="heysujal" >Sujal</NavLink></Nav.Link> */}
            {/* <Nav.Link><Link to="attendence">Attendence</Link></Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>


        <Routes>
          <Route index element={<Basic/>}/>
          <Route path="/profile" element={<Profile/>} />
          <Route path="/studentsinfo" element={<StudentsInfo/>} />
          <Route path="/classrooms" element={<Classrooms/>} />
          <Route path="*" element={<Navigate to = '/notfound' /> } />
        </Routes>

      </div>
        {/* <main style={{ padding: 10 }}> Hello I am Dashboard</main> */}
      </div>
     
  );
};

export default Dashboard;
