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
import Block from './Components/Crud/Blocks/Block';
import AddRoom from './Components/Crud/Room/AddRoom';
import EditRoom from './Components/Crud/Room/EditRoom';
import DeleteRoom from './Components/Crud/Room/DeleteRoom';
import Room from './Components/Crud/Room/Room';
import AccordionDropdown from "./Components/AccordionDropdown";
import Course from './Components/Crud/Courses/Course';
import CourseFilter from './Components/Crud/Courses/CourseFilter';
import AddCourse from "./Components/Crud/Courses/AddCourse";
import DeleteCourse from "./Components/Crud/Courses/DeleteCourse";
import EditCourse from "./Components/Crud/Courses/EditCourse";
import SeeSpecialization from './Components/Crud/Specialization/SeeSpecialization';
import Prof from './Components/Crud/Prof/Prof';
import Specialization from './Components/Crud/Specialization/Specialization';
import Schedule from './Components/Crud/Schedule/Schedule';
import AddSchedule from './Components/Crud/Schedule/AddSchedule';
import ManualSched from "./Components/Crud/Schedule/ManualSched";

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
        {/* CRUD block */}
        <Route path='/block/*' element={<Block />} />

        {/* CRUD room */}
        <Route path='/room/add/*' element={<AddRoom />} />
        <Route path='/room/edit/:id/*' element={<EditRoom />} />
        <Route path='/room/:id/delete/*' element={<DeleteRoom />} />
        <Route path='/viewroom' element={<Room />} />

        <Route path='/accordion/*' element={<AccordionDropdown />} />
        {/* CRUD Course */}
        <Route exact path='/course/*' element={<Course/>} />
        <Route path="/coursefilter" element={<CourseFilter />} />
        <Route path='/course/add/*' element={<AddCourse/>} />
        <Route path='/course/delete/:id/*' element={<DeleteCourse />} />
        <Route path='/course/edit/:course_code/:course_name/*' element={<EditCourse />} />


        <Route path="/specialization/course/:User_id" element={<SeeSpecialization />} />
        
        {/* CRUD Prof */}
        <Route path='/prof' element={<Prof />} />

        {/* CRUD Specialization */}
        <Route path='/specialization/*' element={<Specialization />} />
        
        {/* Schedule */}
        <Route path='/schedule/*' element={<Schedule />} />
        <Route path='/schedule/summer/*' element={<Schedule />} />
        <Route path='/summer/*' element={<ManualSched />} />
        <Route path='/schedule/add/*' element={<AddSchedule />} />
        {/* Setting */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
