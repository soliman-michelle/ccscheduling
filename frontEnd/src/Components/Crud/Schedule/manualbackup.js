import  { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaCaretDown } from 'react-icons/fa';
import axios from 'axios';
    const ManualSched = () => {
      const [isScheduleTypeDropdownOpen, setScheduleTypeDropdownOpen] = useState(false);
      const [isFilterDropdownOpen, setFilterDropdownOpen] = useState(false);
      const [selectedProfessor, setSelectedProfessor] = useState('');
      const [selectedCourse, setSelectedCourse] = useState('');
      const [selectedBlock, setSelectedBlock] = useState('');
      const [professors, setProfessors] = useState([]);
      const [courses, setCourses] = useState([]);
      const [rooms, setRooms] = useState([]);
      const [minValue, setMinValue] = useState(1); 
      const [maxValue, setMaxValue] = useState(0);
      const [selectedScheduleType, setSelectedScheduleType] = useState('All');
      const [selectedFilter, setSelectedFilter] = useState('Professor');
      const [availableBlocks, setAvailableBlocks] = useState([]);
      const [courseDuration, setCourseDuration] = useState(null);
      const [generatedClassInfo, setGeneratedClassInfo] = useState([]);
      const [professorClassDays, setProfessorClassDays] = useState({});

      const sidebarStyle = {
        paddingRight: '15%',
      };

      const Class_Day = [
        ['MON', 'TUES', 'WED', 'THURS', 'FRI'],
        ['MON', 'TUES', 'WED', 'THURS', 'SAT'],
      ];
      const toggleScheduleTypeDropdown = () => {
        setScheduleTypeDropdownOpen(!isScheduleTypeDropdownOpen);
      };

      const toggleFilterDropdown = () => {
        setFilterDropdownOpen(!isFilterDropdownOpen);
      };

      const handleScheduleTypeChange = (scheduleType) => {
        setSelectedScheduleType(scheduleType);
        toggleScheduleTypeDropdown();
      };

      const handleFilter = (filter) => {
        setSelectedFilter(filter);
        toggleFilterDropdown();
      };

      useEffect(() => {
        const fetchProfessors = async () => {
          try {
            const response = await axios.get('http://localhost:8081/manual/professors');
            setProfessors(response.data);
            console.log(response.data);
          } catch (error) {
            console.error('Error fetching professors: ', error);
          }
        };

        fetchProfessors();
      }, []);

      useEffect(() => {
        if (selectedProfessor) {
          const fetchCourses = async () => {
            try {
              const response = await axios.get(`http://localhost:8081/manual/courses/${selectedProfessor}`);
              console.log('Courses Response:', response.data);
              setCourses(response.data);
              
              // When courses are fetched, determine the course duration
              if (response.data.length > 0) {
                const selectedCourse = response.data[0]; // Assuming the first course is selected
                setCourseDuration(selectedCourse.duration);
                console.log("Duration" + selectedCourse.duration);
              } else {
                setCourseDuration(null); // Handle the case when there are no courses
              }
            } catch (error) {
              console.error('Error fetching courses: ', error);
            }
          };

          fetchCourses();
        }
      }, [selectedProfessor]);

      useEffect(() => {
        const fetchRooms = async () => {
          try {
            const response = await axios.get('http://localhost:8081/manual/room');
            setRooms(response.data);
          } catch (error) {
            console.error('Error fetching professors: ', error);
          }
        };

        fetchRooms();
      }, []);

    useEffect(() => {
        if (selectedCourse) {
          const fetchBlocks = async () => {
            try {
              const totalBlocksResponse = await axios.get(`http://localhost:8081/manual/block/${selectedCourse}`);
              const totalBlocks = totalBlocksResponse.data[0].total_blocks; 
              setMinValue(1);
              setMaxValue(totalBlocks);
            } catch (error) {
              console.error('Error fetching total_blocks: ', error);
            }
          };
      
          fetchBlocks();
        }
      }, [selectedCourse]); 

      const fetchAvailableBlocks = async (courseId) => {
        try {
          const response = await axios.get(`http://localhost:8081/manual/program-year-block/${courseId}`);
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

      const generateClassDays = (filter, professorCount, courseDuration, classType) => {
        switch (filter) {
          case 'Professor':
            const allDays = [
              ['MON', 'TUE', 'WED', 'THU', 'FRI'],
              ['MON', 'TUE', 'WED', 'THU', 'SAT'],
            ];
      
            // Determine which set of class days to use based on the professor count
            const classDays = professorCount <= 15 ? allDays[0] : allDays[1];
      
            // Shuffle the array of days randomly
            const shuffledDays = classDays.sort(() => Math.random() - 0.5);
      
            // Take the first N days, where N is the course duration
            const selectedDays = shuffledDays.slice(0, courseDuration);
      
            return selectedDays;
          default:
            return [];
        }
      };
      const generateRandomColor = () => {
        const randomHue = Math.floor(Math.random() * 360); // Random hue value between 0 and 360
        const randomSaturation = Math.floor(Math.random() * 101); // Random saturation value between 0 and 100
        const randomLightness = Math.floor(Math.random() * 51) + 50; // Random lightness value between 50 and 100
      
        return `hsl(${randomHue}, ${randomSaturation}%, ${randomLightness}%)`;
      };
      
      class ClassInfo {
        constructor(startTime, endTime, prof, room, course, block) {
          this.startTime = startTime;
          this.endTime = endTime;
          this.prof = prof;
          this.room = room;
          this.course = course;
          this.block = block;
        }
      }
      const handleGenerateClasses = async () => {
        if (rooms.length === 0) {
          alert('Rooms data is not available. Please fetch rooms data first.');
          return;
        }
      
        const generatedClasses = [];
      
        if (!selectedProfessor || !selectedCourse || !selectedBlock || !selectedScheduleType) {
          alert('Please select Professor, Course, Block, and Schedule Type before generating classes.');
          return;
        }
      
        if (selectedProfessor && selectedCourse && availableBlocks.length > 0 && selectedBlock > 0) {
          const availableBlocksCopy = [...availableBlocks];
      
          const blockCount = Math.min(selectedBlock, availableBlocks.length);
      
          let startTimeHour;
          let endTimeHour;
          
          for (let i = 0; i < blockCount; i++) {
            const randomIndex = Math.floor(Math.random() * availableBlocksCopy.length);
            const randomBlock = availableBlocksCopy.splice(randomIndex, 1)[0];
      
            if (randomBlock) {
              const classType = i === 0 ? 'Online' : i === 1 ? 'Face to Face' : 'Laboratory'; // Updated to use index
              const color = generateRandomColor();

              const generatedClassDays = generateClassDays(selectedFilter, professors.length, courseDuration, classType);


              const numClasses = courseDuration === 5 ? 3 : 2;
      
              if (numClasses > 0) {
                for (let j = 0; j < numClasses; j++) {
                  const classType = j === 0 ? 'Online' : j === 1 ? 'Face to Face' : 'Laboratory';
      
                  // Modify the condition to filter rooms based on the class type
                  let roomType = '';
                  let availableRoom = '';
      
                  if (classType === 'Online') {
                    roomType = 'N/A';
                    availableRoom = 'N/A';
                  } else {
                    if (courseDuration === 5) {
                      roomType = 'Laboratory';
                    } else if (courseDuration === 3) {
                      roomType = classType === 'Face to Face' ? 'Regular' : 'N/A';
                    }
      
                    try {
                      const response = await axios.get(`http://localhost:8081/manual/rooms/${roomType}`);
                      const filteredRooms = response.data;
      
                      const shuffledRooms = filteredRooms.sort(() => Math.random() - 0.5);
                      availableRoom = shuffledRooms.length > 0 ? shuffledRooms[0].roomName : 'N/A';
      
                    } catch (error) {
                      console.error('Error fetching rooms: ', error);
                    }
                  }
      
                  if (availableRoom) {
                    const day = generatedClassDays[j % generatedClassDays.length];

                switch (classType) {
                  case 'Online':
                    startTimeHour = Math.floor(Math.random() * (18 - 7 + 1)) + 7;
                    endTimeHour = startTimeHour  + 1;
                    break;
                  case 'Face to Face':
                  case 'Laboratory':
                    if (startTimeHour < 18) {
                      startTimeHour = startTimeHour;
                    } else {
                      startTimeHour = Math.floor(Math.random() * (17 - 7 + 1)) + 7;
                    }
                    
                    endTimeHour = startTimeHour + 2;
                    break;
                  default:
                    endTimeHour = startTimeHour  + courseDuration;
                }
                const startTime = `${startTimeHour.toString().padStart(2, '0')}:00`;

                if (endTimeHour > startTimeHour) {
                  const endTime = `${endTimeHour.toString().padStart(2, '0')}:00`; // Convert to HH:mm format
                  
  
                  generatedClasses.push({
                    professor: selectedProfessor,
                    course: selectedCourse,
                    day,
                    block: `${randomBlock.program} ${randomBlock.year}${randomBlock.block}`,
                    classType,
                    room: availableRoom,
                    startTime,
                    endTime,
                    duration: endTimeHour - startTimeHour,
                    color: color,
                    courseDuration
                  });
                }
              }
            }
          }
        }
      }
  
 generatedClasses.sort((a, b) => {
    const timeA = new Date(`2000-01-01 ${a.startTime}`);
    const timeB = new Date(`2000-01-01 ${b.startTime}`);
    return timeA - timeB;
  });

          setGeneratedClassInfo(generatedClasses);
          console.log("Generated" + generatedClasses);

          setProfessorClassDays({
            ...professorClassDays,
            [selectedProfessor]: generatedClasses.map((classInfo) => classInfo.day),
          });

        }
      };


const ClassTable = ({ generatedClassInfo }) => {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const timeSlots = [
    '07:00 - 08:00',
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
    '18:00 - 19:00',
  ];

  const isWithinTimeRange = (startTime, endTime, classInfoStartTime, classInfoEndTime) => {
    const classInfoStart = new Date(`2000-01-01 ${classInfoStartTime}`);
    const classInfoEnd = new Date(`2000-01-01 ${classInfoEndTime}`);
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
  
    return classInfoStart <= start && classInfoEnd >= end;
  };

  const getDayIndex = (day) => days.indexOf(day);

  const getTimeSlotIndex = (startTime) => timeSlots.findIndex((timeSlot) => timeSlot.startsWith(startTime));

  const scheduleMatrix = Array.from({ length: timeSlots.length }, () =>
    Array.from({ length: days.length }, () => [])
  );

  generatedClassInfo.forEach((classInfo) => {
    const dayIndex = getDayIndex(classInfo.day);
    const startTimeIndex = getTimeSlotIndex(classInfo.startTime);

    if (dayIndex !== -1 && startTimeIndex !== -1) {
      const classItem = {
        professor: classInfo.professor,
        course: classInfo.course,
        block: classInfo.block,
        classType: classInfo.classType,
        room: classInfo.room,
        duration: classInfo.duration,
        color: classInfo.color,
      };

      // Check if the class duration fits within the available time slots
      if (startTimeIndex + classInfo.duration <= timeSlots.length) {
        for (let i = 0; i < classInfo.duration; i++) {
          scheduleMatrix[startTimeIndex + i][dayIndex].push(classItem);
        }
      }
    }
  });

  return (
    <div className="mt-3">
      <h4>Generated Class Schedule:</h4>
      <div className="schedule-table">
        <div className="time-header">
          <div className="empty-cell">TIME/DAY</div>
          {days.map((day) => (
            <div key={day} className="day-cell">
              {day}
            </div>
          ))}
        </div>
        {timeSlots.map((timeSlot, index) => (
          <div key={timeSlot} className="time-slot-row">
            <div className="time-cell">{timeSlot}</div>
            {days.map((day, dayIndex) => {
              const generatedClassInfo = scheduleMatrix[index][dayIndex];

              return (
                <div key={`${day}-${index}`} className={`schedule-cell ${isWithinTimeRange('11:00', '13:00', timeSlot, timeSlots[index]) ? 'no-border' : ''}`}>
                  {generatedClassInfo.map((classInfo, index) => (
                    <div
                      key={`${day}-${index}-${index}`}
                      className={`class-item`}
                      style={{
                        backgroundColor: classInfo.color,
                      }}
                      title={`Prof: ${classInfo.professor}, Course: ${classInfo.course}, Block: ${classInfo.block}, Room: ${classInfo.room}`}
                    >
                      <div className='text-center'>
                        {classInfo.course} 
                        <br />
                        {classInfo.professor}
                        <br />
                        {classInfo.block}
                        <br />
                        {classInfo.room} 
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};


      return (
        <div>
          <div className="row">
            <div className="col-md-3" style={sidebarStyle}></div>
          </div>
          <div className="row">
            <div className="col-md-9">
              <div className="card card-body card-dark bg-success-gradient bubble-shadow mb-2 animated fadeInDown">
                <h1>
                  <i className="far fa-calendar-check"></i>
                  &nbsp; Summer Schedule
                </h1>
              </div>
              <div className="card card-body mb-3 animated fadeInUp">
              <select
                  className="form-control"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="">Select Course</option>
                  {courses && courses.length > 0 ? (
                    courses.map((course, index) => (
                      <option key={index} value={course.course_id}>
                        {course.course_code} - {course.course_name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      {courses === undefined ? 'Loading courses...' : 'No courses available'}
                    </option>
                  )}
                </select>
                <div className="form-group mt-2">
                <select
                  className="form-control"
                  value={selectedProfessor}
                  onChange={(e) => setSelectedProfessor(e.target.value)}
                >
                  <option value="">Select Professor</option>
                  {professors.map((professor, index) => (
                    <option key={index} value={professor.User_id}>
                      {professor.fname} {professor.lname}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group mt-2">
          <input
            type="number"
            className="form-control"
            value={selectedBlock}
            onChange={(e) => {
              const newValue = parseInt(e.target.value, 10); 
              if (!isNaN(newValue) && newValue >= minValue && newValue <= maxValue) {
                setSelectedBlock(newValue);
              }
            }}
            min={minValue}
            max={maxValue}
          />
        </div>
              </div>
              <button type="button" className="btn btn-primary mt-2" onClick={handleGenerateClasses}>
                Generate Classes
              </button>
              
              <Dropdown show={isFilterDropdownOpen} onToggle={toggleFilterDropdown}>
                <Dropdown.Toggle id="dropdown-filter" className="custom-dropdown-toggle float-right mt-2">
                  <span style={{ color: 'black' }}>{selectedFilter} <FaCaretDown /></span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleFilter('Professor')}>Professor</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleFilter('Program-block')}>Program-block</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleFilter('Room')}>Room</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <ClassTable generatedClassInfo={generatedClassInfo} />
            </div>
            <div className="col-md-3">
              <div className="card card-body card-dark bg-success-gradient bubble-shadow mb-2 animated fadeInDown">
            <p className='text-danger display-7'><strong>Suggestion:</strong></p>
            </div>
            </div>
          </div>
        </div>
      );
    };
  
    export default ManualSched;