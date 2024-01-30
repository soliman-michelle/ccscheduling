import React, { useState, useEffect } from 'react';
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
    const [minValue, setMinValue] = useState(1); 
    const [maxValue, setMaxValue] = useState(0);
    const [selectedScheduleType, setSelectedScheduleType] = useState('All');
    const [selectedFilter, setSelectedFilter] = useState('Professor');
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [availableBlocks, setAvailableBlocks] = useState([]);
    const [courseDuration, setCourseDuration] = useState(null);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [classAssignments, setClassAssignments] = useState([]);

    const classTypes = {
      duration3: { days: 2, online: 1, ftf: 2, lab: 0 },
      duration5: { days: 3, online: 1, ftf: 2, lab: 2 },
    };

    const generateRandomColor = () => {
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
      console.log('Generated Color:', randomColor);
      return randomColor;
    };
    
    const getCellContent = (timeSlot, day) => {
      console.log('Time Slot:', timeSlot);
      console.log('Day:', day);
      const cellContent = [];
      selectedCourses.forEach((assignment) => {
        if (isClassInTimeSlot(assignment, timeSlot, day)) {
          const classInfo = (
            <div key={assignment.block} style={{ backgroundColor: generateRandomColor() }}>
              {assignment.block}
              <br />
              {assignment.course}
              <br />
              {assignment.professor}
            </div>
          );
          cellContent.push(classInfo);
        }
      });
    
      return cellContent;
    };
    
  
    const sidebarStyle = {
      paddingRight: '15%',
    };

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
      const fetchRoom = async () => {
        try {
          const response = await axios.get('http://localhost:8081/manual/room');
          setAvailableRooms(response.data);
        } catch (error) {
          console.error('Error fetching professors: ', error);
        }
      };

      fetchRoom();
    }, []);
    // Inside the useEffect that fetches courses based on selectedProfessor
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
      if (selectedCourse) {
        console.log('Selected Course ID:', selectedCourse); // Debugging: Check if the course ID is correctly set
        const fetchBlocks = async () => {
          try {
            const totalBlocksResponse = await axios.get(`http://localhost:8081/manual/block/${selectedCourse}`);
            const totalBlocks = totalBlocksResponse.data[0].total_blocks; // Update this line
            // Set the maximum value to the total_blocks value
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
        console.log('Selected Course ID:', selectedCourse);
        fetchAvailableBlocks(selectedCourse);
      }
    }, [selectedCourse]);

    
  
    const assignRandomRoom = (classType, courseDuration, availableRooms) => {
      let randomRoom;
    
      if (courseDuration === 3) {
        // If duration is 3, set online to 'N/A' and ftf to 'Regular' room
        randomRoom = {
          roomName: classType.online > 0 ? 'N/A' : 'Regular', 
        };
      } else if (courseDuration === 5) {
        // If duration is 5, set online to 'N/A' and ftf, lab based on availability
        const roomType = classType.lab > 0 ? 'Laboratory' : 'Regular';
        const availableRoomsOfType = availableRooms.filter((room) => room.type === roomType);
    
        if (availableRoomsOfType.length > 0) {
          randomRoom = availableRoomsOfType[Math.floor(Math.random() * availableRoomsOfType.length)];
        } else {
          randomRoom = { roomName: 'N/A' };
        }
      } else {
        // Handle other cases if needed
        randomRoom = { roomName: 'N/A' };
      }
    
      return randomRoom;
    };
    
    const handleGenerateClasses = () => {
      if (
        selectedProfessor &&
        selectedCourse &&
        availableBlocks.length > 0 &&
        selectedBlock > 0 &&
        availableRooms.length > 0
      ) {
        const selectedBlocks = [];
        const availableBlocksCopy = [...availableBlocks];
    
        // Ensure that the selectedBlock count does not exceed the number of available blocks
        const blockCount = Math.min(selectedBlock, availableBlocks.length);
    
        for (let i = 0; i < blockCount; i++) {
          const randomIndex = Math.floor(Math.random() * availableBlocksCopy.length);
          const randomBlock = availableBlocksCopy.splice(randomIndex, 1)[0];
          
          if (randomBlock) {
            // Pass the correct duration to assignDaysForBlock
            const daysForBlock = assignDaysForBlock(randomBlock, courseDuration);
            // Generate a consistent start time for both Online Class and Face-to-Face Class
            const startTime = Math.floor(Math.random() * 12) + 7; // Random start time between 7 and 19
            const classType = classTypes[`duration${courseDuration}`];
            const randomRoom = assignRandomRoom(classType, courseDuration, availableRooms);

            const newClassAssignment = {
              professor: selectedProfessor,
              course: selectedCourse,
              block: `${randomBlock.program} ${randomBlock.year}${randomBlock.block}`,
              days: daysForBlock,
              duration: courseDuration,
              room: randomRoom,
              color: generateRandomColor(),
            };
    
            selectedBlocks.push(newClassAssignment);
          }
        }
        setSelectedCourses([...classAssignments, ...selectedBlocks]);

        setClassAssignments([...classAssignments, ...selectedBlocks]);

      }
    };
    
   
    const assignDaysForBlock = (randomBlock, duration) => {
      if (!randomBlock) {
        // Handle the case when randomBlock is not defined
        return {
          selected_class_day: [],
          online: [],
          ftf: [],
          laboratory: [],
        };
      }
    
      // Replace the existing Class_Day array with your classTypes
      const Class_Day = [
        ['MON', 'TUES', 'WED', 'THURS', 'FRI'],
        ['TUES', 'WED', 'THURS', 'FRI', 'SAT'],
        ['MON', 'TUES', 'WED', 'FRI', 'SAT'],
        ['MON', 'TUES', 'WED', 'THURS', 'SAT'],
      ];
    
      const classTypes = {
        duration3: { days: 2, online: 1, ftf: 2, lab: 0 },
        duration5: { days: 3, online: 1, ftf: 2, lab: 2 },
      };
    
      const classType = duration === 5 ? classTypes.duration5 : classTypes.duration3;
    
      if (classType) {
        const selected_class_day = Class_Day[Math.floor(Math.random() * Class_Day.length)];
    // Generate a random start time between 7 AM and 7 PM (19:00)
    const startTime = Math.floor(Math.random() * 12) + 7;
    
    // Assign the same start time to online, face-to-face, and lab classes
    const endTime = startTime + classType.online;
    
        return {
          selected_class_day,
          online: selected_class_day.slice(0, classType.online),
          ftf: selected_class_day.slice(classType.online, classType.online + classType.ftf),
          laboratory: selected_class_day.slice(
            classType.online + classType.ftf
          ), onlines: { startTime, endTime },
          faceToFace: { startTime, endTime: startTime + 2 },
          lab: { startTime, endTime: startTime + 2 },
        };
      } else {
        // Handle the case where classType is not defined
        return {
          selected_class_day: [],
          online: [],
          ftf: [],
          laboratory: [],
        };
      }
    };
    

    const generateSchedule = () => {
      const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const timeSlots = [
        '7:00 - 7:30',
        '7:30 - 8:00',
        '8:00 - 8:30',
        '8:30 - 9:00',
        '9:00 - 9:30',
        '9:30 - 10:00',
        '10:00 - 10:30',
        '10:30 - 11:00',
        '11:00 - 11:30',
        '11:30 - 12:00',
        '12:00 - 12:30',
        '12:30 - 13:00',
        '13:00 - 13:30',
        '13:30 - 14:00',
        '14:00 - 14:30',
        '14:30 - 15:00',
        '15:00 - 15:30',
        '15:30 - 15:00',
        '16:00 - 16:30',
        '16:30 - 16:00',
        '17:00 - 17:30',
        '17:30 - 18:00',
        '18:00 - 18:30',
        '18:30 - 19:00',
      ];
    
      // const scheduleTable = timeSlots.map((timeSlot, index) => {
      //   const row = [<th key={index}>{timeSlot}</th>];
      //   for (const day of days) {
      //     const cellContent = getCellContent(timeSlot, day);
      //     row.push(
      //       <td key={`${day}_${index}`} style={{ background: cellContent.length > 0 ? cellContent[0].props.style.backgroundColor : '' }}>
      //         {cellContent}
      //       </td>
      //     );
      //   }
      //   return <tr key={index}>{row}</tr>;
        
        
      // });

       // Create an array to hold the schedule table
      const updatedScheduleTable = timeSlots.map((timeSlot, index) => {
        const row = [<th key={index}>{timeSlot}</th>];
        for (const day of days) {
          const cellContent = getCellContent(timeSlot, day);
          row.push(
            <td key={`${day}_${index}`} style={{ background: cellContent.length > 0 ? cellContent[0].props.style.backgroundColor : '' }}>
              {cellContent}
            </td>
          );
        }
        return <tr key={index}>{row}</tr>;
      });

  // Fill in the cells with class assignments
  // classAssignments.forEach((assignment) => {
  //   timeSlots.forEach((timeSlot, index) => {
  //     days.forEach((day, dayIndex) => {
  //       if (isClassInTimeSlot(assignment, timeSlot, days[dayIndex])) {
  //         const rowIndex = index;
  //         const cell = updatedScheduleTable[rowIndex + 1].props.children[dayIndex + 1];
  //         const classInfo = (
  //           <div key={assignment.block} style={{ backgroundColor: assignment.color }}>
  //             {assignment.block}
  //             <br />
  //             {assignment.course}
  //             <br />
  //             {assignment.professor}
  //           </div>
  //         );
  //         if (cell.props.children) {
  //           cell.props.children.push(classInfo);
  //         } else {
  //           cell.props.children = [classInfo];
  //         }
  //       }
  //     });
  //   });
  // });

  return (
    <div className="card card-body mb-3 animated fadeInUp">
      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead>
            <tr>
              <th style={{ minWidth: '130px' }}>TIME \ DAY</th>
              {days.map((day, index) => (
                <th key={index} style={{ minWidth: '110px' }}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{updatedScheduleTable}</tbody>
        </table>
      </div>
    </div>
  );
};
    
    const isClassInTimeSlot = (assignment, timeSlot, day) => {
      
      const classStart = parseInt(timeSlot.split(' - ')[0], 10);
      const classEnd = parseInt(timeSlot.split(' - ')[1], 10);
      const classDay = assignment.days.selected_class_day;
      const classStartTime = assignment.days.onlines.startTime;
      const classEndTime = assignment.days.onlines.endTime;

      return (
        classDay.includes(day) &&
        ((classStartTime >= classStart && classStartTime < classEnd) ||
          (classEndTime > classStart && classEndTime <= classEnd) ||
          (classStartTime <= classStart && classEndTime >= classEnd))
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
              <Dropdown show={isScheduleTypeDropdownOpen} onToggle={toggleScheduleTypeDropdown}>
                <Dropdown.Toggle id="dropdown-basic" className="custom-dropdown-toggle float-right">
                  <span style={{ color: 'black' }}>{selectedScheduleType} <FaCaretDown /></span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleScheduleTypeChange('All')}>All</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleScheduleTypeChange('Non-lab')}>Non-lab</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleScheduleTypeChange('Lab')}>Lab</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="card card-body mb-3 animated fadeInUp">
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
              <div className="form-group mt-2">
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
            <div className='accordion' id="schedule">
            {generateSchedule()}
            </div>
          </div>
          <div className="col-md-3">
            <p>Selected Professor: {selectedProfessor}</p>
            <p>List of Specialization:</p>
            <ul>
              {courses.map((course, index) => (
                <li key={index}>{course.course_code} - {course.course_name}</li>
              ))}
            </ul>
            <p>Selected Courses: {selectedCourse}</p>
            <p>Selected # Block: {selectedBlock}</p>
            <p>Available Blocks:</p>
            <ul>
              {availableBlocks.map((block, index) => (
                <li key={index}>{block.program} {block.year}{block.block}</li>
              ))}
            </ul>
            <div>
              <p>New Class Assignments</p>
              <ul>
                {selectedCourses.map((assignment, index) => (
                  <div key={index}>
               Professor: {assignment.professor}, Course: {assignment.course}, Block: {assignment.block},
                Pick Day{assignment.days.selected_class_day.join(', ')}, 
                Online: {assignment.days.selected_class_day.slice(0, 2).join(', ')}, 
                FTF: {assignment.days.selected_class_day.slice(2).join(', ')}  
                Duration: {assignment.duration} 
                <p>Color: {assignment.color}</p>

                {assignment.duration === 5 ? (
      // Display lab information
      <div>
        <p>Online Class:</p>
        <ul>
          <li>Day:  {assignment.days.selected_class_day.slice(0, 1)}</li>
          <li>Time: {assignment.days.onlines.startTime} - {assignment.days.onlines.endTime}</li>
          <li>Room: N/A</li>
        </ul>
        <p>Face-to-Face Class:</p>
        <ul>
          <li>Day: {assignment.days.selected_class_day.slice(2, 3)}</li>
          <li>Time: {assignment.days.faceToFace.startTime} - {assignment.days.faceToFace.endTime}</li>
          <li>Room: {assignment.room.roomName}</li>

        </ul>
        <p>Lab Class:</p>
        <ul>
          <li>Day: {assignment.days.selected_class_day.slice(4, 5)}</li>
          <li>Time: {assignment.days.lab.startTime} - {assignment.days.lab.endTime}</li>
          <li>Room: {assignment.room.roomName}</li>
        </ul>
        <p>Duration: {assignment.duration}</p>
      </div>
    ) : (
      // Display non-lab information for duration 3
      <div>
        <p>Online Class:</p>
        <ul>
          <li>Day: {assignment.days.selected_class_day.slice(0, 1).join(', ')}</li>
          <li>Time: {assignment.days.onlines.startTime} - {assignment.days.onlines.endTime}</li>
          <li>Room: N/A</li>

        </ul>
        <p>Face-to-Face Class:</p>
        <ul>
          <li>Day: {assignment.days.selected_class_day.slice(1, 2).join(', ')}</li>
          <li>Time: {assignment.days.faceToFace.startTime} - {assignment.days.faceToFace.endTime}</li>
          <li>Room:  {assignment.room.roomName}</li>
        </ul>
        <p>Duration: {assignment.duration}</p>

      </div>
    )}
  </div>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    );
  };

  export default ManualSched;