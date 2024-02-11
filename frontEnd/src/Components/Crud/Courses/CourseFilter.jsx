import React, { useState, useEffect } from 'react';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import 'bootstrap/dist/css/bootstrap.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const CourseFilter = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedProgram = queryParams.get('program');
  const [courseDetails, setCourseDetails] = useState([]);

  const courseMap = {
    'BSCS': { course: 'Bachelor of Science in Computer Science', specialization: null },
    'BSCS-DS': { course: 'Bachelor of Science in Computer Science', specialization: 'Specialization: Data Science' },
    'BSIT-SD': { course: 'Bachelor of Science in Information Technology', specialization: 'Specialization: System Development' },
    'BSIT-BA': { course: 'Bachelor of Science in Information Technology', specialization: 'Specialization: Business Analytics' },
  };

  const { course, specialization } = courseMap[selectedProgram] || {};

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`https://ccsched.onrender.com/course?program=${selectedProgram}`);
        console.log("Courses: ", response.data);
        setCourseDetails(response.data);
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    if (selectedProgram) {
      fetchCourseDetails();
    }
  }, [selectedProgram]);

  const renderCourses = () => {
  
    const coursesByYear = courseDetails.reduce((acc, course) => {
      if (!acc[course.yearLevel]) {
        acc[course.yearLevel] = [];
      }
      acc[course.yearLevel].push(course);
      return acc;
    }, {});
  
    return (
      <div className="container">
        {Object.keys(coursesByYear).map((year) => (
          <div className="row text-center" key={year}>
            <h6 className="text-center" style={{ border: '2px solid #000' }}>{`${yearToOrdinal(parseInt(year, 10))} Year`}</h6>
            <div className="col-md-12" style={{ border: '2px solid #000' }}>
              {renderYearSemesters(coursesByYear[year])}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderYearSemesters = (courses) => (
    <React.Fragment>
      <div className="row text-center">
        <div className="col-md-6" style={{ border: '2px solid #000' }}>
          <h6>First Semester</h6>
          {renderYearSemCourses(courses, 1)}
        </div>
        <div className="col-md-6" style={{ border: '2px solid #000' }}>
          <h6>Second Semester</h6>
          {renderYearSemCourses(courses, 2)}
        </div>
      </div>
    </React.Fragment>
  );
  
  const renderYearSemCourses = (courses, sem) => (
    <React.Fragment>
      <div className="row text-center">
        <div className="col-md-2" style={{ border: '2px solid #000' }}>
          <strong>Course Code</strong>
        </div>
        <div className="col-md-4" style={{ border: '2px solid #000' }}>
          <strong>Description</strong>
        </div>
        <div className="col-md-2" style={{ border: '2px solid #000' }}>
          <strong>Online  FTF</strong>
        </div>
        <div className="col-md-2" style={{ border: '2px solid #000' }}>
          <strong>Lab</strong>
        </div>
        <div className="col-md-2" style={{ border: '2px solid #000' }}>
          <strong>Units</strong>
        </div>
      </div>
      {courses
        .filter((course) => course.sem === sem)
        .map((course) => (
          <div className="row text-center" key={course.course_code}>
            <div className="col-md-2" style={{ border: '2px solid #000' }}>
              {course.course_code}
            </div>
            <div className="col-md-4" style={{ border: '2px solid #000' }}>
              {course.course_name}
            </div>
            <div className="col-md-2" style={{ border: '2px solid #000' }}>
              {course.online + course.ftf}
            </div>
            <div className="col-md-2" style={{ border: '2px solid #000' }}>
              {course.lab}
            </div>
            <div className="col-md-2" style={{ border: '2px solid #000' }}>
              {course.units}
            </div>
          </div>
        ))}
    </React.Fragment>
  );
  
  
  const yearToOrdinal = (year) => (year === 1 ? 'First' : (year === 2 ? 'Second' : (year === 3 ? 'Third' : 'Fourth')));


  return (
    <div className="h-100">
      <div className="class-wrapper">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              <Sidebar isSidebarOpen={isSidebarOpen} />
            </div>
           <div className="col-md-10 mt-5">
              <div className="text-center">
                <h4>LAGUNA UNIVERSITY</h4>
                <p>Laguna Sports Complex, Brgy. Bubukal, Santa Cruz, Laguna</p>
                <h6>Tel. No. (049) 576-4359</h6>
                <h5>PROGRAM OF STUDY</h5>
                <h5>{course}</h5>
                {selectedProgram === 'BSCS' ? null : (
                  <h6>
                    <i>Specialization: {specialization}</i>
                  </h6>
                )}
                <h6>Effective: AY 2021-2022</h6>
              </div>
              <div className="container">
                {renderCourses()}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseFilter;
