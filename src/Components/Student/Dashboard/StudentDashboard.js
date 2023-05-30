import { Link, Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import useDocumentTitle from "../../../Hooks/useDocumentTitle";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Container, Nav, Navbar } from "react-bootstrap";
import StudentBasic from "../Basic/StudentBasic";
import StudentProfile from "../Profile/StudentProfile";
import StudentUpdates from "../Updates/StudentUpdates";
import StudentAttendance from "../Attendance/StudentAttendance"
import styles from "./studentDashboard.module.css"
import Support from "../Support/Support";
import { useState } from "react";
const navLinkStyles = {
  textDecoration: 'none',
  color:'white'
}

const StudentDashboard = () => {
  const [navTitle, setNavTitle] = useState("Dashboard");

  const navigate = useNavigate();
  useDocumentTitle("Dashboard");
  const icmsUserInfo =  JSON.parse(localStorage.getItem("icmsUserInfo"));
  // console.log(icmsUserInfo);
  const handleLogout = (event)=> {
    event.preventDefault();
    localStorage.removeItem("icmsUserInfo");
    navigate("../login");
  }
  return (
    <div className={styles['student-dashboard']}
      style={{
        display: "flex",
        height: "100%",
        minHeight: "400px",
        // border: "1px solid black",
      }}
    >
      <div className={styles.dashboardLeft}>
        {/* <h3 className={`${styles['sidebar-header']} fw-bold mb-0 py-2 text-center`}>iCMS</h3> */}
          <h3 className="sidebar-header fw-bold mb-0 py-2 text-center">
            <img src='/images/icms-logo.png' alt='logo' style={{ height: '40px', filter: 'invert(0)' }} />
          </h3>

        <Sidebar className={styles.dashboardSidebar}>
          <Menu  className={styles.dashboardMenu}>
            <MenuItem className={styles.menuitem} onClick={() => setNavTitle("Dashboard")} component={<Link to="" />}>
              {" "}
              Dashboard
            </MenuItem>
            <MenuItem className={styles.menuitem} onClick={() => setNavTitle("Profile")} component={<Link to="profile" />}>
              {" "}
              Profile
            </MenuItem>
            <MenuItem className={styles.menuitem} onClick={() => setNavTitle("Support")} component={<Link to="support" />}>
              {" "}
              Support
            </MenuItem>
            <MenuItem className={styles.menuitem} onClick={() => setNavTitle("Updates")} component={<Link to="student-updates" />}>
              {" "}
              Updates
            </MenuItem>
            <MenuItem className={styles.menuitem} onClick={() => setNavTitle("My Attendance")} component={<Link to="attendance" />}>
              {" "}
              My Attendance
            </MenuItem>
          </Menu>
        </Sidebar>
      </div>

      {/* Right side containing Navbar and Content */}

      <div className={styles['dashboard-right']}>
        <Navbar className={styles['common-navbar']} expand="lg">
          <Container className={styles['common-navbar-container']}>
            <Navbar.Brand as={NavLink} to="./">
            {navTitle}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link className="invisible" as={NavLink} style={navLinkStyles} to="./heysujal">
                  Hello
                </Nav.Link>
               
                <Nav.Link
                  onClick={handleLogout}
                  className="btn btn-danger me-3"
                  as={NavLink}
                  style={{
                    textDecoration: "none",
                    color: "white",
                    float: "right",
                    position: "absolute",
                    right: "0px",
                  }}
                  to="../login"
                >
                  Logout
                </Nav.Link>
                {/* <Nav.Link><NavLink to="heysujal" >Sujal</NavLink></Nav.Link> */}
                {/* <Nav.Link><Link to="attendence">Attendence</Link></Nav.Link> */}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
<Routes>
  <Route>
    <Route index element={<StudentBasic/>} />
    <Route path="/profile" element={<StudentProfile />} />
    <Route path="/support" element={<Support />} />
    <Route path="/student-updates" element={<StudentUpdates />} />
    <Route path="/attendance" element={<StudentAttendance />} />
    <Route path="*" element={<Navigate to = '/notfound' /> } />
  </Route>
</Routes>
       
      </div>
      {/* <main style={{ padding: 10 }}> Hello I am Dashboard</main> */}
    </div>
  );
};

export default StudentDashboard;
