import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import 'bootstrap/dist/css/bootstrap.css';
import ViewAccount from './Components/ViewAccount';
import PasswordReset from "./Components/PasswordReset";
import ResetPassword from "./Components/ResetPassword";
import Curriculum from "./Components/Settings/Curriculum";
import UniversityInfo from "./Components/Settings/UniversityInfo";
import NewPassword from "./Components/NewPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<ViewAccount />} />
        <Route path="/forgot-password" element={<PasswordReset />} />
        <Route path="/password-reset/:token" element={<ResetPassword />} />
        <Route path="/password-reset" element={<NewPassword />} />
        <Route path="/curriculum" element= {<Curriculum/>}/>
        <Route
          path="/university-info/"
          element={<UniversityInfo/>}
        />      
        </Routes>
    </BrowserRouter>
  );
}

export default App;
