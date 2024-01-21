import { useState, useEffect } from 'react';
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
  const [filteredCourseDetails, setFilteredCourseDetails] = useState([]);
  console.log('Selected Program:', selectedProgram); // Add this line

  
  const courseMap = {
    'BSCS': {
      course: 'Bachelor of Science in Computer Science',
      specialization: null,
    },
    'BSCS-DS': {
      course: 'Bachelor of Science in Computer Science',
      specialization: 'Specialization: Data Science',
    },
    'BSIT-SD': {
      course: 'Bachelor of Science in Information Technology',
      specialization: 'Specialization: System Development',
    },
    'BSIT-BA': {
      course: 'Bachelor of Science in Information Technology',
      specialization: 'Specialization: Business Analytics',
    },
  };

  const { course, specialization } = courseMap[selectedProgram] || {};

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [courseDetails, setCourseDetails] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/course?program=${selectedProgram}`);
        setCourseDetails(response.data);
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    if (selectedProgram) {
      fetchCourseDetails();
    }
  }, [selectedProgram]);

  return (
    <div className="h-100">
      <div className="class-wrapper">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <div className='container-fluid'>
          <div className="row">
            <div className="col-md-2">
              <Sidebar isSidebarOpen={isSidebarOpen} />
            </div>
            <div className="col-md-10 mt-5">
              <div className='text-center'>
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
                <div className='container'>
                    <div className='row' style={{ border: '2px solid #000' }}>
                        <h6 className='text-center' style={{ border: '2px solid #000'}}>First Year</h6>
                        <div className='col-md-6' style={{ border: '2px solid #000'}}>
                          <div className='col-md-12' style={{ border: '2px solid #000', marginLeft: '-18px' }}>First Semester</div>
                          <div className="container" style={{ border: '1px solid #000', marginLeft: '-18px' }}>
                            <div className="row text-center">
                              <div className="col-md-2" style={{ border: '2px solid #000' }}>Course Code</div>
                              <div className="col-md-4" style={{ border: '2px solid #000' }}>Course Title</div>
                              <div className="col-md-2" style={{ border: '2px solid #000' }}>Lec</div>
                              <div className="col-md-2" style={{ border: '2px solid #000' }}>Lab</div>
                              <div className="col-md-2" style={{ border: '2px solid #000' }}>Units</div>
                            </div>
                            
                            {courseDetails
                              .filter((course) => course.year_level === 1 && course.sem === 1)
                              .map((course) => (
                                <div className="row text-center" key={course.course_code}>
                                  <div className="col-md-2" style={{ border: '2px solid #000' }}>{course.course_code}</div>
                                  <div className="col-md-4" style={{ border: '2px solid #000' }}>{course.course_name}</div>
                                  <div className="col-md-2" style={{ border: '2px solid #000' }}>{course.online + course.ftf}</div>
                                  <div className="col-md-2" style={{ border: '2px solid #000' }}>{course.lab}</div>
                                  <div className="col-md-2" style={{ border: '2px solid #000' }}>{course.units}</div>
                                </div>
                              ))
                            }
                          </div>
                          <br></br>
                        </div>
                        <div className='col-md-6' style={{ border: '2px solid #000' }}>
                          <h6>Second Semester</h6>
                          <div className="container" >
                            <div className="row" style={{ border: '2px solid #000' }}>
                              <div className="col-md-2" >Course Code</div>
                              <div className="col-md-4">Course Title</div>
                              <div className="col-md-2">Lec</div>
                              <div className="col-md-2">Lab</div>
                              <div className="col-md-2">Units</div>
                            </div>
                            
                            {courseDetails
                              .filter((course) => course.year_level === 1 && course.sem === 2)
                              .map((course) => (
                                <div className="row" key={course.course_code}>
                                  <div className="col-md-2">{course.course_code}</div>
                                  <div className="col-md-4">{course.course_name}</div>
                                  <div className="col-md-2">{course.online + course.ftf}</div>
                                  <div className="col-md-2">{course.lab}</div>
                                  <div className="col-md-2">{course.units}</div>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                    </div>
                    <br></br>
                    <div className='row' style={{ border: '2px solid #000' }}>
                        <h6 className='border text-center' style={{ border: '2px solid #000' }}>Second Year</h6>
                        <div className='col-md-6'>
                          <h6>First Semester</h6>
                          <div className="container">
                            <div className="row" >
                              <div className="col-md-2">Course Code</div>
                              <div className="col-md-4">Course Title</div>
                              <div className="col-md-2">Lec</div>
                              <div className="col-md-2">Lab</div>
                              <div className="col-md-2">Units</div>
                            </div>
                            
                            {courseDetails
                              .filter((course) => course.year_level === 2 && course.sem === 1)
                              .map((course) => (
                                <div className="row" key={course.course_code}>
                                  <div className="col-md-2">{course.course_code}</div>
                                  <div className="col-md-4">{course.course_name}</div>
                                  <div className="col-md-2">{course.online + course.ftf}</div>
                                  <div className="col-md-2">{course.lab}</div>
                                  <div className="col-md-2">{course.units}</div>
                                </div>
                              ))
                            }
                          </div>
                        </div>

                        <div className='col-md-6'>
                          <h6>Second Semester</h6>
                          <div className="container">
                            <div className="row">
                              <div className="col-md-2">Course Code</div>
                              <div className="col-md-4">Course Title</div>
                              <div className="col-md-2">Lec</div>
                              <div className="col-md-2">Lab</div>
                              <div className="col-md-2">Units</div>
                            </div>
                            
                            {courseDetails
                              .filter((course) => course.year_level === 2 && course.sem === 2)
                              .map((course) => (
                                <div className="row" key={course.course_code}>
                                  <div className="col-md-2">{course.course_code}</div>
                                  <div className="col-md-4">{course.course_name}</div>
                                  <div className="col-md-2">{course.online + course.ftf}</div>
                                  <div className="col-md-2">{course.lab}</div>
                                  <div className="col-md-2">{course.units}</div>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                    </div>
                    <br></br>
                    <div className='row' style={{ border: '2px solid #000' }}>
                        <h6 className='border text-center'>Third Year</h6>
                        <div className='col-md-6'>
                          <h6>First Semester</h6>
                          <div className="container">
                            <div className="row">
                              <div className="col-md-2">Course Code</div>
                              <div className="col-md-4">Course Title</div>
                              <div className="col-md-2">Lec</div>
                              <div className="col-md-2">Lab</div>
                              <div className="col-md-2">Units</div>
                            </div>
                            
                            {courseDetails
                              .filter((course) => course.year_level === 3 && course.sem === 1)
                              .map((course) => (
                                <div className="row" key={course.course_code}>
                                  <div className="col-md-2">{course.course_code}</div>
                                  <div className="col-md-4">{course.course_name}</div>
                                  <div className="col-md-2">{course.online + course.ftf}</div>
                                  <div className="col-md-2">{course.lab}</div>
                                  <div className="col-md-2">{course.units}</div>
                                </div>
                              ))
                            }
                          </div>
                        </div>

                        <div className='col-md-6'>
                          <h6>Second Semester</h6>
                          <div className="container">
                            <div className="row">
                              <div className="col-md-2">Course Code</div>
                              <div className="col-md-4">Course Title</div>
                              <div className="col-md-2">Lec</div>
                              <div className="col-md-2">Lab</div>
                              <div className="col-md-2">Units</div>
                            </div>
                            
                            {courseDetails
                              .filter((course) => course.year_level === 3 && course.sem === 2)
                              .map((course) => (
                                <div className="row" key={course.course_code}>
                                  <div className="col-md-2">{course.course_code}</div>
                                  <div className="col-md-4">{course.course_name}</div>
                                  <div className="col-md-2">{course.online + course.ftf}</div>
                                  <div className="col-md-2">{course.lab}</div>
                                  <div className="col-md-2">{course.units}</div>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                    </div>
                    <br></br>
                    <div className='row' style={{ border: '2px solid #000' }}>
                        <h6 className='border text-center'>Fourth Year</h6>
                        <div className='col-md-6'>
                          <h6>First Semester</h6>
                          <div className="container">
                            <div className="row">
                              <div className="col-md-2">Course Code</div>
                              <div className="col-md-4">Course Title</div>
                              <div className="col-md-2">Lec</div>
                              <div className="col-md-2">Lab</div>
                              <div className="col-md-2">Units</div>
                            </div>
                            
                            {courseDetails
                              .filter((course) => course.year_level === 4 && course.sem === 1)
                              .map((course) => (
                                <div className="row" key={course.course_code}>
                                  <div className="col-md-2">{course.course_code}</div>
                                  <div className="col-md-4">{course.course_name}</div>
                                  <div className="col-md-2">{course.online + course.ftf}</div>
                                  <div className="col-md-2">{course.lab}</div>
                                  <div className="col-md-2">{course.units}</div>
                                </div>
                              ))
                            }
                          </div>
                        </div>

                        <div className='col-md-6'>
                          <h6>Second Semester</h6>
                          <div className="container">
                            <div className="row">
                              <div className="col-md-2">Course Code</div>
                              <div className="col-md-4">Course Title</div>
                              <div className="col-md-2">Lec</div>
                              <div className="col-md-2">Lab</div>
                              <div className="col-md-2">Units</div>
                            </div>
                            
                            {courseDetails
                              .filter((course) => course.year_level === 4 && course.sem === 2)
                              .map((course) => (
                                <div className="row" key={course.course_code}>
                                  <div className="col-md-2">{course.course_code}</div>
                                  <div className="col-md-4">{course.course_name}</div>
                                  <div className="col-md-2">{course.online + course.ftf}</div>
                                  <div className="col-md-2">{course.lab}</div>
                                  <div className="col-md-2">{course.units}</div>
                                </div>
                              ))
                            }
                          </div>
                        </div>

                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseFilter;
    