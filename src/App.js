import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./Components/Login/Login";
import Home from './Components/Home/Home'
import SharedLayout from './Components/SharedLayout/SharedLayout'
import NotFound from './Components/NotFound'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
function App() {
  return (
    <Routes>

    <Route path='/' element={<SharedLayout/>}>
      <Route index element={<Home/>} />
      <Route path='/login' element = {<Login/>}/>
      <Route path='/register' element = {<Register/>}/>
      <Route path='*' element = {<NotFound/>} />
    </Route>
    </Routes>
  );
}

export default App;
