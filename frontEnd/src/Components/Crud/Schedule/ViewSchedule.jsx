import 'bootstrap/dist/css/bootstrap.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaCaretDown } from 'react-icons/fa';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ViewSchedule = () => {
  // const [programYearBlocks, setProgramYearBlocks] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [specialization, setSpecialization] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [courseDuration, setCourseDuration] = useState(null);
  const [bestSchedule, setBestSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFilterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Professor');
  const [showModal, setShowModal] = useState(false);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [universityInfo, setUniversityInfo] = useState([]);
  const [currentYear, setCurrentYear] = useState('');
  const sidebarStyle = {
    paddingRight: '15%',
  };

  const toggleFilterDropdown = () => {
    setFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const fetchCurrentAcademicYear = async () => {
    try {
      const response = await axios.get('https://ccsched.onrender.com/summer_sched/curriculum');
      const { start, end, sem } = response.data[0];
      setCurrentYear(`${sem === 1 ? '1st' : '2nd'} Semester A.Y. ${start}-${end}`);
    } catch (error) {
      console.error('Error fetching current academic year:', error);
    }
  };

  useEffect(() => {
    fetchCurrentAcademicYear();
  }, []);

  const handleFilter = (filter) => {
    setSelectedFilter(filter);
    toggleFilterDropdown();
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const initialSchedule = await generateRandomSchedule();
        setBestSchedule(initialSchedule); // Set the initial schedule to the state
      } catch (error) {
        console.error('Error generating initial schedule: ', error);
      }
    };
  
    initialize();
  }, []);

  const fetchUniversityInfo = async () => {
    try {
        const response = await axios.get('https://ccsched.onrender.com/university-info');
        const infoArray = response.data.universityInfo;
        if (infoArray.length > 0) {
            const info = infoArray[0];
            setUniversityInfo(info);
        } else {
            console.error('University information not found');
        }
    } catch (error) {
        console.error('Error fetching university information: ', error);
    }
};
  
 useEffect(() => {
        const fetchAcademicYears = async () => {
          try {
            const response = await axios.get('https://ccsched.onrender.com/summer_sched/archive');
            setAcademicYears(response.data); // Assuming response.data is an array of academic years
          } catch (error) {
            console.error('Error fetching academic years: ', error);
          }
        };
    
        fetchAcademicYears(); // Call the function to fetch academic years when the component mounts
      }, []); // Empty dependency array ensures this effect runs only once
    
      const handleAcademicYearChange = (event) => {
        setSelectedAcademicYear(event.target.value);
      };

  // Combine multiple fetch calls into a single function to minimize API requests
const fetchData = async () => {
  try {
    const [professorsResponse, coursesResponse, roomsResponse] = await Promise.all([
      axios.get('https://ccsched.onrender.com/autogenetics/professors'),
      axios.get('https://ccsched.onrender.com/autogenetics/courses'),
      axios.get('https://ccsched.onrender.com/autogenetics/room')
    ]);

    setProfessors(professorsResponse.data);
    setCourses(coursesResponse.data);
    setRooms(roomsResponse.data);

    const firstCourse = coursesResponse.data.length > 0 ? coursesResponse.data[0] : null;
    setCourseDuration(firstCourse ? firstCourse.duration : null);

  } catch (error) {
    console.error('Error fetching data: ', error);
  }
};

useEffect(() => {
  fetchData();
  fetchUniversityInfo();
}, []);
 

  // this fetch all blocks for same courses
  useEffect(() => {
    if (courses.length > 0) {
      const fetchBlocks = async () => {
        try {
          const totalBlocksResponse = await axios.get(`https://ccsched.onrender.com/autogenetics/block/${courses[0].course_id}`);
          const totalBlocks = totalBlocksResponse.data[0].total_blocks;
          console.log('Total Blocks:', totalBlocks);
        } catch (error) {
          console.error('Error fetching total_blocks: ', error);
        }
      };
      fetchBlocks();
    }
  }, [courses]);

  //select all program, year and block for certain course
  const fetchAvailableBlocks = async (courseId) => {
    try {
      const response = await axios.get(`https://ccsched.onrender.com/autogenetics/program-year-block/${courseId}`);
      setAvailableBlocks(response.data);

    } catch (error) {
      console.error('Error fetching available blocks: ', error);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      fetchAvailableBlocks(selectedCourse);
    }
  }, [selectedCourse]);
  
  useEffect(() => {
    const fetchSpecialization = async (userId) => {
      try {
        const response = await axios.get(`https://ccsched.onrender.com/autogenetics/courses/${userId}`);
        setSpecialization(response.data);
      } catch (error) {
        console.error('Error fetching Specializations: ', error);
      }
    };
  
    fetchSpecialization();
  }, []);

  const initializePopulation = async () => {
    const population = [];
    for (let i = 0; i < populationSize; i++) {
      const schedule = await generateRandomSchedule();
      population.push(schedule);
    }
    return population;
  };

  const generateRandomSchedule = async () => {
    try {
      const schedule = [];
      const professorHours = new Map(); // Track hours for each professor
      const assignedCourses = new Set(); // To track assigned courses to professors
      const addedClasses = new Set(); // To track added class combinations

      
      for (let i = 0; i < courses.length; i++) {
        const selectedCourse = getRandomElement(courses.filter(course => !assignedCourses.has(course.course_id)));
        if (!selectedCourse) {
          console.log('No available courses for the remaining schedule.');
          continue;
        }
  
        assignedCourses.add(selectedCourse.course_id);
  
        for (let j = 0; j < professors.length; j++) {
          const randomProfessor = getRandomElement(professors.filter(prof => !assignedCourses.has(prof.User_id)));
          if (!randomProfessor) {
            console.log('No available professors for the remaining courses.');
            break;
          }
          // Check if the professor can handle more classes
        const professorId = randomProfessor.User_id;
        const professorWorkload = professorHours.get(professorId) || {};
        const maxHour = randomProfessor.max_hour ;
  
          
          try {
            const specializationResponse = await axios.get(`https://ccsched.onrender.com/autogenetics/courses/${randomProfessor.User_id}`);
            const specializations = specializationResponse.data;
  
            for (let k = 0; k < specializations.length; k++) {
              const randomSpecialization = specializations[k];
              const response = await axios.get(`https://ccsched.onrender.com/autogenetics/program-year-block/${randomSpecialization.course_id}`);
              const blocks = response.data;
  
              for (let l = 0; l < blocks.length; l++) {
                const randomBlock = blocks[l];
  
                let classTypes = [];
                if (randomSpecialization.duration === 5) {
                  classTypes = ['Online', 'ftf', 'lab'];
                } else if (randomSpecialization.duration === 3) {
                  classTypes = ['Online', 'ftf'];
                } else {
                  console.log('Unsupported course duration.');
                  continue; // Skip this iteration if the duration is not supported
                }
              
                for (const classType of classTypes) {
                  const classKey = `${randomBlock.program}_${randomBlock.year}_${randomBlock.block}_${randomSpecialization.course_id}__${classType}`;

                  if (addedClasses.has(classKey)) {
                    // Combination already exists in the schedule, skip
                    continue;
                  }
  
                const roomType = classType === 'Online' ? 'N/A' : (classType === 'ftf' ? 'Regular' : 'Laboratory');
                const randomRoom = classType === 'Online' ? { roomName: 'N/A' } : getRandomElement(rooms.filter(room => room.type === roomType)) || { roomName: 'N/A' };
  
                const randomTimeSlot = getRandomTimeSlot(schedule, randomBlock, randomRoom, classType);

                  const professorHour = professorHours.get(randomProfessor.User_id) || 0;
                  const maxProfessorHour = randomProfessor.max_hour;

                  if (professorHour >= maxProfessorHour) {
                    // Professor has reached the maximum hours, skip adding more classes
                    continue;
                  }

                   // Check if adding this class would exceed the maximum duration for a day
                  if (professorHour % 6 === 0) {
                    // Add a break if the professor has taught for 6 hours
                    schedule.push({
                      break: true,
                      professor: randomProfessor,
                      day: randomTimeSlot.day,
                      timeSlot: 'Break'
                    });
                  }
                const classInfo = {
                  course: randomSpecialization,
                  professor: randomProfessor,
                  block: randomBlock.program + ' ' + randomBlock.year + randomBlock.block,
                  classType: classType,
                  day: randomTimeSlot.day,
                  room: randomRoom,
                  timeSlot: randomTimeSlot.timeSlot
                };

                const professorId = randomProfessor.User_id;
                professorHours.set(professorId, (professorHours.get(professorId) || 0) + 1);
                
                if (professorHours.get(professorId) % 3 === 0) {
                  // Add a break
                  schedule.push({
                    break: true,
                    professor: randomProfessor,
                    day: randomTimeSlot.day,
                    timeSlot: 'Break'
                  });
                }

                schedule.push(classInfo);
                addedClasses.add(classKey); // Add the class combination to the set
                console.log(`Professor: ${randomProfessor.fname} ${randomProfessor.lname}, Specialization Name: ${randomSpecialization.course_name}, Duration: ${randomSpecialization.duration}, Block: ${randomBlock.program} ${randomBlock.year}${randomBlock.block}, Class Type: ${classType}, Day: ${randomTimeSlot.day}, Room: ${randomRoom.roomName}, Time Slot: ${randomTimeSlot.timeSlot}`);
              };
            }
          }
        } catch (error) {
          console.error(`Error fetching specializations for professor ${randomProfessor.User_id}: `, error);
          console.error(error.stack); // Log the full error stack trace
        }
      }
    }

    console.log('Generated Schedules:', schedule);
    setBestSchedule(schedule);

    return schedule;
  } catch (error) {
    console.error('Error generating random schedule: ', error);
    return [];
  }
};

  
  const handleSavePDF = async () => {
    setPdfLoading(true);

    try {
        const pdf = new jsPDF("p", "mm", [215.9, 279.4]);

        for (let i = 0; i < professorsSchedule.length; i++) { // Changed from prof.length to professorsSchedule.length
            const prof = professorsSchedule[i];
            const scheduleTable = document.getElementById(`schedule-table-${i}`);

            if (universityInfo) {
                const universityLogoUrl = `https://ccsched.onrender.com/${universityInfo.universityLogo}`;
                const departmentLogoUrl = `https://ccsched.onrender.com/${universityInfo.departmentLogo}`;
                const schoolNameUppercase = universityInfo.schoolName.toUpperCase();

                pdf.addImage(universityLogoUrl, 'JPEG', 20, 10, 25, 25);
                pdf.setFont("helvetica", "bold");
                pdf.text(schoolNameUppercase, 85, 18);
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(10);
                pdf.text(`${universityInfo.address}, Brgy. ${universityInfo.barangay}, Sta. Cruz, ${universityInfo.province}`, 70, 25);
                pdf.setFontSize(12);
                professorsSchedule.forEach((professor, index) => {
                    if (i === index) {
                        pdf.setFont("helvetica", "bold");
                        pdf.text(professor.professorName, 85, 32);
                        pdf.setFont("helvetica", "normal");
                    }
                });

                pdf.addImage(departmentLogoUrl, 'JPEG', 180, 10, 25, 25);
            }

            await generatePDF(pdf, scheduleTable, prof.prof);

            if (i < professorsSchedule.length - 1) {
                pdf.addPage();
            }
        }

        pdf.save("summer_schedule.pdf");
    } catch (error) {
        console.error('Error generating PDF: ', error);
    }

    setPdfLoading(false);
};


  const generatePDF = (pdf, table, roomName) => {
      return new Promise((resolve, reject) => {
          html2canvas(table, { scrollY: -window.scrollY })
              .then((canvas) => {
                  const imgData = canvas.toDataURL("image/png");
                  const imgWidth = 180;
                  const imgHeight = (canvas.height * imgWidth) / canvas.width;

                  const xPos = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
                  const yPos = pdf.internal.pageSize.getHeight() / 2 - imgHeight / 2;

                  pdf.addImage(imgData, "PNG", xPos, yPos, imgWidth, imgHeight);

                  resolve();
              })
              .catch((error) => {
                  console.error('Error generating PDF for room ', roomName, ': ', error);
                  reject(error);
              });
      });
  };
  
 
  // Handle Generate Classes with Genetic Algorithm
  const handleGenerateClasses = async () => {
    

  };

const Timetable = () => {
  // Assuming 'bestSchedule' holds the entire schedule information

  // Group the schedule by professors
  const scheduleByProfessor = bestSchedule.reduce((acc, classInfo) => {
    const professorId = classInfo.professor.User_id;
    if (!acc[professorId]) {
      acc[professorId] = [];
    }
    acc[professorId].push(classInfo);
    return acc;
  }, {});

  return (
    <div>
      {Object.keys(scheduleByProfessor).map((professorId, index) => (
        <div key={index}>
          <TimetableByProfessor professorSchedule={scheduleByProfessor[professorId]} />
          {index !== Object.keys(scheduleByProfessor).length - 1 && <hr />}
        </div>
      ))}
    </div>
  );
};

  return (
    <div>
      <div className="row">
      <p id="currentYear">{currentYear}</p>

        <div className="col-md-3" style={sidebarStyle}></div>
        <div className="row">
            {/* <div className="col-md-3">
            <Button variant="danger" onClick={openModal}>Reset</Button>
            </div> */}
            {/* <div className="col-md-3">
            <Dropdown show={isFilterDropdownOpen} onToggle={toggleFilterDropdown}>
          <Dropdown.Toggle id="dropdown-filter" className="custom-dropdown-toggle float-right mt-2">
            <span style={{ color: 'black' }}>{selectedFilter} <FaCaretDown /></span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleFilter('Professor')}>Professor</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilter('Room')}>Room</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
            </div> */}
            <div className="col-md-3">
            <select id="academicYear" name="academicYear" value={selectedAcademicYear} onChange={handleAcademicYearChange}>
            {academicYears.map((year) => (
              <option key={year.academic_id} value={year.academic_id}>
                {`${year.start} - ${year.end}: ${year.sem}${year.sem === 1 ? 'st' : 'nd'} Semester`}
              </option>
            ))}
          </select>

            </div>
        </div>
        <div className="card card-body card-dark bg-success-gradient bubble-shadow mb-4 animated fadeInDown">
          <h1 className="m-2">
            <i className="far fa-calendar-check"></i>
            &nbsp; Class Schedule
          </h1>
        </div>
        <div className="card card-body mb-3 animated fadeInUp">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleGenerateClasses}
          >
            Generate Classes
          </button>
          
        </div>
        
      </div>
      <button onClick={handleSavePDF} disabled={pdfLoading}>
        {pdfLoading ? "Generating PDF..." : "Save as PDF"}
      </button>
      <div className="row">
        <div className="col-md-12">

           {Array.isArray(bestSchedule) && bestSchedule.length > 0 ? (
            Timetable()
          ) : (
            <p>No schedule generated yet.</p>
          )} 
  </div>
</div>
    </div>
  );
  };

export default ViewSchedule;
