  import { useState, useEffect } from "react";
  import axios from "axios";
  import "./SummerGenetic.css";
  import html2canvas from "html2canvas";
  import jsPDF from "jspdf";
  import { Button} from 'react-bootstrap';
  import Dropdown from 'react-bootstrap/Dropdown';
  import { FaCaretDown } from 'react-icons/fa';
  const SummerGenetic = () => {
      const [summer, setSummer] = useState([]);
      const [room, setRoom] = useState([]);
      const [bestSchedule, setBestSchedule] = useState([]);
      const [days, setDays] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
      const [pdfLoading, setPdfLoading] = useState(false);
      const [universityInfo, setUniversityInfo] = useState([]);
      const [professorsSchedule, setProfessorsSchedule] = useState([]);
      const [timeSlots, setTimeSlots] = useState([]);
      const [fitnessScore, setFitnessScore] = useState(0); // State for fitness score
      const [academicYears, setAcademicYears] = useState([]);
      const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
      const [isFilterDropdownOpen, setFilterDropdownOpen] = useState(false);
      const [selectedFilter, setSelectedFilter] = useState('Professor');
      const [showModal, setShowModal] = useState(false);  

      const toggleFilterDropdown = () => {
        setFilterDropdownOpen(!isFilterDropdownOpen);
      };

      const openModal = () => {
        setShowModal(true);
    };
      const handleFilter = (filter) => {
        setSelectedFilter(filter);
        toggleFilterDropdown();
      };

      const fetchSummer = async () => {
        try {
            const response = await axios.get('http://localhost:8081/summer_sched/data');
            const summerData = response.data;
            setSummer(summerData);

            const professors = {};
            summerData.forEach(item => {
                const userId = item.User_id;
                if (!professors[userId]) {
                    professors[userId] = { professorName: `${item.fname} ${item.lname}`, schedule: [] };
                }
                professors[userId].schedule.push(item);
            });

            setProfessorsSchedule(Object.values(professors));
        } catch (error) {
            console.error('Error fetching summer schedule: ', error);
        }
      };

      useEffect(() => {
        const fetchAcademicYears = async () => {
          try {
            const response = await axios.get('http://localhost:8081/summer_sched/archive');
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

      const fetchUniversityInfo = async () => {
          try {
              const response = await axios.get('http://localhost:8081/university-info');
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

      const fetchRoom = async () => {
          try {
              const response = await axios.get('http://localhost:8081/summer_sched/room');
              const roomData = response.data;
              setRoom(roomData);
          } catch (error) {
              console.error('Error fetching room data: ', error);
          }
      };

      useEffect(() => {
          fetchSummer();
          fetchRoom();
          fetchUniversityInfo();
      }, []);

      const getRandomElement = (array) => {
          const randomIndex = Math.floor(Math.random() * array.length);
          return array[randomIndex];
      };

      const generateTimeSlots = (startTime, endTime, interval, days) => {
          const timeSlots = [];

          for (let time = startTime; time < endTime; time += interval) {
              const hour = Math.floor(time / 60);
              const minute = (time % 60).toString().padStart(2, '0');
              const formattedHour = hour % 12 || 12;
              const startTimeString = `${formattedHour}:${minute}`;

              const endHour = Math.floor((time + interval) / 60) % 12 || 12;
              const endMinute = ((time + interval) % 60).toString().padStart(2, '0');
              const endTimeString = `${endHour}:${endMinute}`;

              const timeRange = `${startTimeString} - ${endTimeString}`;

              const timeSlotData = { time: timeRange };

              days.forEach(day => {
                  timeSlotData[day] = null;
              });

              timeSlots.push(timeSlotData);
          }

          return timeSlots;
      };

      const generateRandomSchedule = async () => {
        try {
            const response = await axios.get('http://localhost:8081/summer_sched/room');
            const roomData = response.data;
    
            const classList = new Set();
            let scheduleTime = [];
            const DAY_HOURS = 12;
            const interval = 60;
            const startTime = 7 * 60;
            const endTime = startTime + (DAY_HOURS * 60);
    
            const generatedTimeSlots = generateTimeSlots(startTime, endTime, interval, days);
            setTimeSlots(generatedTimeSlots);
    
            // Map to store colors for each professor-course combination
            const colorMap = {};
    
            for (let i = 0; i < summer.length; i++) {
                const classItem = summer[i];
                const classId = classItem.summer_id;
                const userId = classItem.User_id;
                const block = classItem.block;
                const course_code = classItem.course_code;
                const course_name = classItem.course_name;
    
                // Find the professor name based on User_id
                const professor = professorsSchedule.find(prof => prof.schedule.some(item => item.User_id === userId));
                const profName = professor ? professor.professorName : "Unknown Professor";
    
                const classType = classItem.type;
    
                const classKey = `${profName}-${course_code}-${course_name}-${block}`; // Unique key
                let color;
    
                // Check if color already generated for this combination
                if (colorMap[classKey]) {
                    color = colorMap[classKey];
                } else {
                    // If not generated, generate a new pastel color
                    color = generateRandomPastelColor();
                    colorMap[classKey] = color; // Store the color for future use
                }
    
                const duration = (classType === 'ftf' || classType === 'lab') ? 2 : 1;
    
                let room;
                if (classType === 'online') {
                    room = 'N/A';
                } else {
                    room = getRandomElement(roomData);
                }
    
                const day = getRandomElement(days);
                const classStartTime = getRandomStartTime();
                const durationInMinutes = duration * 60;
                const classEndTime = classStartTime + durationInMinutes;
    
                scheduleTime.push({
                    classId,
                    classType,
                    room,
                    block,
                    course_code,
                    course_name,
                    day,
                    prof: profName,
                    startTime: convertMinutesToTime(classStartTime),
                    endTime: convertMinutesToTime(classEndTime),
                    color
                });
            }
    
            return scheduleTime;
        } catch (error) {
            console.error('Error generating schedule: ', error);
        }
    };
    
      
      function getRandomStartTime() {
          const classStartTimes = [7 * 60, 9 * 60, 11 * 60, 13 * 60]; 

          const randomIndex = Math.floor(Math.random() * classStartTimes.length);
          return classStartTimes[randomIndex];
      }

      const convertMinutesToTime = (minutes) => {
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;

          // Convert hours to 12-hour formatss
          const formattedHours = hours % 12 || 12;

          
          const paddedMins = mins < 10 ? '0' + mins : mins;

          return formattedHours + ':' + paddedMins;
      };
      

      const generateRandomPastelColor = () => {
          const r = Math.floor(Math.random() * 256);
          const g = Math.floor(Math.random() * 256);
          const b = Math.floor(Math.random() * 256);
          return `rgba(${r},${g},${b},0.5)`; // Use rgba to set opacitys
      };
      
      const calculateFitness = (bestSchedule) => {
        let score = 0;
    
        // Check for room overlapping of classes
        const roomOverlaps = checkRoomOverlaps(bestSchedule);
        score += roomOverlaps.length;
    
        let result;
        if (bestSchedule.length > 0) {
            result = score / (bestSchedule.length * 5); // Assuming each subject contributes to a score of 5
        } else {
            result = 0; // Handle the case when bestSchedule is empty
        }
    
        console.log("Fitness Result: " + result);
        setFitnessScore(result); // Update fitness score state directly
        return result;
    };
    


  const checkRoomOverlaps = (bestSchedule) => {
    const roomMap = {};

    // Iterate over each schedule
    bestSchedule.forEach((schedule) => {
        const { room, day, startTime, endTime, prof } = schedule;
        let roomName = room && room.roomName ? room.roomName : "N/A"; // Check if room and roomName exist

        // If room is "N/A", include professor's name in the key
        const key = roomName !== "N/A" ? `${roomName}-${day}-${startTime}-${endTime}` : `${roomName}-${day}-${prof}-${startTime}-${endTime}`;

        // If the key already exists, there is an overlap
        if (roomMap[key]) {
            roomMap[key].push(schedule);
        } else {
            roomMap[key] = [schedule];
        }
    });

    // Filter out non-overlapping schedules
    const overlaps = Object.values(roomMap).filter((schedules) => schedules.length > 1);
    return overlaps;
  };

      const tournamentSelection = (population, tournamentSize) => {
        let tournamentParticipants = [];
        for (let i = 0; i < tournamentSize; i++) {
            let randomIndex = Math.floor(Math.random() * population.length);
            tournamentParticipants.push([population[randomIndex]]); // Wrap the selected participant in an array
        }
        console.log("Before sorting:", tournamentParticipants);

        const sortedTournamentParticipants = tournamentParticipants.slice().sort((a, b) => calculateFitness(a) - calculateFitness(b));
        console.log("After sorting:", sortedTournamentParticipants);
    
        return sortedTournamentParticipants;
    };

        function crossover(schedule1, schedule2) {
          console.log("crossover function");

          const mutationPoint1 = Math.floor(Math.random() * schedule1.length);
          let mutationPoint2 = Math.floor(Math.random() * schedule2.length);
        
          while (mutationPoint1 === mutationPoint2) {
              mutationPoint2 = Math.floor(Math.random() * schedule2.length);
          }
      
          console.log("Mutation Points:", mutationPoint1, mutationPoint2);

          // Swap two random classes in the schedule
          const mutatedSchedule1 = [...schedule1];
          const mutatedSchedule2 = [...schedule2];
      
          const temp = mutatedSchedule1[mutationPoint1];
          mutatedSchedule1[mutationPoint1] = mutatedSchedule2[mutationPoint2];
          mutatedSchedule2[mutationPoint2] = temp;
      
          console.log("Mutated Schedules 1:", mutatedSchedule1);
          console.log("Mutated Schedules 2:", mutatedSchedule2);
          console.log("Done crossover");

          return [mutatedSchedule1, mutatedSchedule2];
      }
      
      function mutate(initialSchedule, mutationRate) {
          if (Math.random() < mutationRate) {
            console.log("mutate lang");
              const mutationPoint1 = Math.floor(Math.random() * initialSchedule.length);
              let mutationPoint2 = Math.floor(Math.random() * initialSchedule.length);
      
              while (mutationPoint1 === mutationPoint2) {
                  mutationPoint2 = Math.floor(Math.random() * initialSchedule.length);
              }
      
              console.log("Mutation Points:", mutationPoint1, mutationPoint2);
      
              // Swap two random classes in the schedules
              const mutatedSchedule = [...initialSchedule];
              const temp = mutatedSchedule[mutationPoint1];
              mutatedSchedule[mutationPoint1] = mutatedSchedule[mutationPoint2];
              mutatedSchedule[mutationPoint2] = temp;
      
              console.log("Mutated Schedule:", mutatedSchedule);

      
              return mutatedSchedule;
          } else {
              console.log("No Mutation");
              return initialSchedule;
          }
      }

      async function geneticAlgorithm(initialPopulation, config) {
        let population = initialPopulation;
        let bestSchedule = initialPopulation[0];
        let finalBestSchedule = [];
        for (let generation = 0; generation < config.generations; generation++) {
          population = await selectAndMutate(population, config);
      
          bestSchedule = population[0];
        }
      
        finalBestSchedule = bestSchedule;      
        return finalBestSchedule;
      }
      
      async function selectAndMutate(population, config) {
        let newPopulation = [];
      
        for (let i = 0; i < population.length; i += 2) {
          let parent1 = tournamentSelection(population, config.tournamentSize);
          let parent2 = tournamentSelection(population, config.tournamentSize);
      
          let [offspring1, offspring2] = crossover(parent1, parent2);
      
          offspring1 = mutate(offspring1, config.mutationRate);
          offspring2 = mutate(offspring2, config.mutationRate);
      
          let fitness1 = calculateFitness(offspring1);
          let fitness2 = calculateFitness(offspring2);
      
          if (fitness1 < fitness2) {
            newPopulation.push(offspring1, offspring2);
          } else {
            newPopulation.push(offspring2, offspring1);
          }
        }
      
        return newPopulation;
      }
    
      async function findBestSchedule() {
        try {
            let bestSchedule = await generateRandomSchedule(); 
    
            let fitness = await calculateFitness(bestSchedule); // Await the fitness calculation
    
            console.log("Initial Fitness:", fitness);
            // Continue generating schedules until the fitness score becomes 0
            while (fitness === 0.03) {
                bestSchedule = await geneticAlgorithm(bestSchedule, {
                    tournamentSize: 20,
                    mutationRate: 0.05,
                    generations: 1,
                    fitness: fitness, // Pass current fitness score
                });
    
                fitness = await calculateFitness(bestSchedule);
    
                if (fitness < 0) {
                    bestSchedule = await geneticAlgorithm(bestSchedule, {
                        tournamentSize: 5,
                        mutationRate: 0.05,
                        generations: 1,
                        fitness: fitness, // Pass current fitness scores
                    });
    
                    fitness = await calculateFitness(bestSchedule);
                }
    
                setBestSchedule(bestSchedule); // Update the best schedule state
            }
            console.log("Best: " , bestSchedule);
            return bestSchedule;
        } catch (error) {
            console.error('Error finding best schedule: ', error);
            return []; 
        }
    }

    const handleSavePDF = async () => {
      setPdfLoading(true);

      try {
        for (const professorSchedule of professorsSchedule) {
          // Iterate over each class in the professor's schedule
          for (const classItem of professorSchedule.schedule) {
              const classId = classItem.summer_id; 
              console.log("classid: ", classId);
      
              // Iterate over bestSchedule to find schedules matching the current classId
              for (const schedule of bestSchedule) {
                  if (schedule.classId === classId) {
                      const response = await axios.put(`http://localhost:8081/summer_sched/${classId}/update`, { bestSchedule: [schedule] });
                      console.log('Update response:', response.data);
                      break; // Once found, exit the loop to avoid unnecessary iterations
                  }
              }
          }
      }
      

          const pdf = new jsPDF("p", "mm", [215.9, 279.4]);

          for (let i = 0; i < professorsSchedule.length; i++) {
              const prof = professorsSchedule[i];
              const scheduleTable = document.getElementById(`schedule-table-${i}`);

              if (universityInfo) {
                  const universityLogoUrl = `http://localhost:8081/${universityInfo.universityLogo}`;
                  const departmentLogoUrl = `http://localhost:8081/${universityInfo.departmentLogo}`;
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
          console.error('Error updating summer schedule or generating PDF: ', error);
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

    const handleGenerateSummerClasses = async () => {
      try {
        const initialSchedule = await findBestSchedule(); 
        setBestSchedule(initialSchedule);
        const fitness = await calculateFitness(bestSchedule); 
        setFitnessScore(fitness);
    } catch (error) {
        console.error('Error generating initial schedule: ', error);
    }
  };

  const renderTableBody = (professor) => {
    const professorName = professor.professorName;
    const professorSchedule = bestSchedule.filter(classItem => classItem.prof === professorName);

    return (
        <tbody>
            {timeSlots.map((slot, slotIndex) => (
                <tr key={slotIndex}>
                    <td className="time">{slot.time}</td>
                    {days.map((day, dayIndex) => (
                        <td key={dayIndex}  className="data">
                            {professorSchedule.map((classItem, classIndex) => {
                                if (classItem.day === day && isTimeInRange(slot.time, classItem.startTime, classItem.endTime)) {
                                    return (
                                        <div
                                            key={classIndex}
                                            className="online-schedule"
                                            style={{ backgroundColor: classItem.color }}
                                        >
                                            <p>{classItem.course_code} - {classItem.course_name}</p>
                                            <p>{classItem.startTime} - {classItem.endTime}</p>
                                            <p>{classItem.room.roomName}</p>
                                        </div>
                                    );
                                } else {
                                    return null;
                                }
                            })}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
  };


  const isTimeInRange = (currentTime, startTime, endTime) => {
    const [currentStart, currentEnd] = currentTime.split(" - ");
    return currentStart >= startTime && currentEnd <= endTime;
  };
    
  return (
    <div>
        <div className="row">
            <div className="col-md-3">
            <Button variant="danger" onClick={openModal}>Reset</Button>
            </div>
            <div className="col-md-3">
            <Dropdown show={isFilterDropdownOpen} onToggle={toggleFilterDropdown}>
          <Dropdown.Toggle id="dropdown-filter" className="custom-dropdown-toggle float-right mt-2">
            <span style={{ color: 'black' }}>{selectedFilter} <FaCaretDown /></span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleFilter('Professor')}>Professor</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilter('Room')}>Room</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
            </div>
            <div className="col-md-3">
            <select id="academicYear" name="academicYear" value={selectedAcademicYear} onChange={handleAcademicYearChange}>
        {academicYears.map((year) => (
          <option key={year.academic_id} value={year.academic_id}>
            {`${year.start} - ${year.end} ${year.sem} Semester`}
          </option>
        ))}
      </select>
            </div>
            <div className="col-md-3">
            
            </div>
        </div>
        <div className="card card-body mb-3 animated fadeInUp">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleGenerateSummerClasses}
          >
            Generate Classes
          </button>
  </div>
      <h1>Best Schedule</h1>
      {professorsSchedule.map((professor, professorIndex) => (
        <div key={professorIndex}>
          <h3>{professor.professorName} Schedule</h3>
          <table id={`schedule-table-${professorIndex}`} className="schedule-table">
            <thead>
              <tr>
                <th>Time</th>
                {days.map((day, dayIndex) => (
                  <th key={dayIndex}>{day}</th>
                ))}
              </tr>
            </thead>
            {renderTableBody(professor, professorIndex)}
          </table>
        </div>
      ))}
      <button onClick={handleSavePDF} disabled={pdfLoading}>
      {pdfLoading ? "Generating PDF..." : "Save as PDF"}
    </button>

    </div>
  );

  };

  export default SummerGenetic;
