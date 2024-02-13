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
    'BSCS-DS': { course: 'Bachelor of Science in Computer Science', specialization: 'Data Science' },
    'BSIT-SD': { course: 'Bachelor of Science in Information Technology', specialization: 'System Development' },
    'BSIT-BA': { course: 'Bachelor of Science in Information Technology', specialization: 'Business Analytics' },
  };

  const { course, specialization } = courseMap[selectedProgram] || {};

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/course?program=${selectedProgram}`);
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
        <div className = "custom-filter">
        {Object.keys(coursesByYear).map((year) => (
          <div className="row text-center" key={year}>
            <h6 className="row-filter text-center" style={{ border: '1px solid #000' }}><strong>{`${yearToOrdinal(parseInt(year, 10))} Year`}</strong></h6>
            <div className="row-filter col-md-12" style={{ border: '1px solid #000' }}>
              {renderYearSemesters(coursesByYear[year])}
            </div>
          </div>
        ))}
      </div>
      </div>
    );
  };
  
  const renderYearSemesters = (courses) => (
    <React.Fragment>
      <div className="row text-center">
        <div className="row-filter col-md-6" style={{ border: '1px solid #000' }}>
          <h6 className="row-filter"><strong>First Semester</strong></h6>
          {renderYearSemCourses(courses, 1)}
        </div>
        <div className="col-md-6" style={{ border: '1px solid #000' }}>
          <h6 className="row-filter"><strong>Second Semester</strong></h6>
          {renderYearSemCourses(courses, 2)}
        </div>
      </div>
    </React.Fragment>
  );
  
  const renderYearSemCourses = (courses, sem) => (
    <React.Fragment>
      <div className="row text-center">
        <div className="srow-filter col-md-2" style={{ border: '1px solid #000' }}>
          <strong>Course Code</strong>
        </div>
        <div className="srow-filter col-md-4" style={{ border: '1px solid #000' }}>
          <strong>Description</strong>
        </div>
        <div className="srow-filter col-md-2" style={{ border: '1px solid #000' }}>
          <strong>Online / FTF</strong>
        </div>
        <div className="srow-filter col-md-2" style={{ border: '1px solid #000' }}>
          <strong>Lab</strong>
        </div>
        <div className="srow-filter col-md-2" style={{ border: '1px solid #000' }}>
          <strong>Units</strong>
        </div>
      </div>
      {courses
        .filter((course) => course.sem === sem)
        .map((course) => (
          <div className="row text-center" key={course.course_code}>
            <div className="srow-filter col-md-2" style={{ border: '1px solid #000' }}>
              {course.course_code}
            </div>
            <div className="srow-filter col-md-4" style={{ border: '1px solid #000' }}>
              {course.course_name}
            </div>
            <div className="srow-filter col-md-2" style={{ border: '1px solid #000' }}>
              {course.online + course.ftf}
            </div>
            <div className="srow-filter col-md-2" style={{ border: '1px solid #000' }}>
              {course.lab}
            </div>
            <div className="srow-filter col-md-2" style={{ border: '1px solid #000' }}>
              {course.units}
            </div>
          </div>
        ))}
    </React.Fragment>
  );
  
  
  const yearToOrdinal = (year) => (year === 1 ? 'First' : (year === 2 ? 'Second' : (year === 3 ? 'Third' : 'Fourth')));


  return (
    <div className="h-100">
      <div className="wrapper">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className = "main">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}/>

      <div className = "container d-flex p-5">
           <div className="col-md-12 flex-column">
              <div className=" container-fluid custom-filhead text-center">
                <h4><strong>LAGUNA UNIVERSITY</strong></h4>
                <p>Laguna Sports Complex, Brgy. Bubukal, Santa Cruz, Laguna</p>
                <h6>Tel. No. (049) 576-4359</h6>
                <br></br>
                <h5><strong>PROGRAM OF STUDY</strong></h5>
                <h5><strong>{course}</strong></h5>
                {selectedProgram === 'BSCS' ? null : (
                  <h6><strong>
                    <i>Specialization: {specialization}</i>
                    </strong></h6>
                )}
                <h6><strong>Effective: AY 2021-2022</strong></h6>
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
