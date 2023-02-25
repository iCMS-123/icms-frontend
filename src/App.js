import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import NotFound from "./Components/NotFound";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Dashboard from "./Components/Dashboard/Dashboard";
import StudentDashboard from "./Components/Student/Dashboard/StudentDashboard"
import StudentBasic from "./Components/Student/Basic/StudentBasic";
import StudentProfile from "./Components/Student/Profile/StudentProfile";
import StudentNotFound from "./Components/Student/StudentNotFound/StudentNotFound";
function App() {
  return (
    <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/register/*" element={<Register />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/studentdashboard/*" element={<StudentDashboard/>} />
        <Route path="*" element={<NotFound />} />
         {/* <Routes>
          <Route index element={<StudentBasic/>} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="*" element={<StudentNotFound />} />
        </Routes> */}

    </Routes>
  );
}

export default App;
