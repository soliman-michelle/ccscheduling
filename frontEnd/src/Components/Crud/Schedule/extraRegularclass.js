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

  const populationSize = 40;  
  const maxGenerations = 10;
  const crossoverRate = 0.8;
  const mutationRate = 0.1;
  
  const sidebarStyle = {
    paddingRight: '15%',
  };

  const toggleFilterDropdown = () => {
    setFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const fetchCurrentAcademicYear = async () => {
    try {
      const response = await axios.get('http://localhost:8081/summer_sched/curriculum');
      const { start, end, sem } = response.data[0];
      setCurrentYear(`${sem === 1 ? '1st' : '2nd'} Semester A.Y. ${start}-${end}`);
    } catch (error) {
      console.error('Error fetching current academic year:', error);
    }
  };

  useEffect(() => {
    fetchCurrentAcademicYear();
  }, []);


  const openModal = () => {
    setShowModal(true);
};
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

  // Combine multiple fetch calls into a single function to minimize API requests
const fetchData = async () => {
  try {
    const [professorsResponse, coursesResponse, roomsResponse] = await Promise.all([
      axios.get('http://localhost:8081/autogenetics/professors'),
      axios.get('http://localhost:8081/autogenetics/courses'),
      axios.get('http://localhost:8081/autogenetics/room')
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
          const totalBlocksResponse = await axios.get(`http://localhost:8081/autogenetics/block/${courses[0].course_id}`);
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
      const response = await axios.get(`http://localhost:8081/autogenetics/program-year-block/${courseId}`);
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
        const response = await axios.get(`http://localhost:8081/autogenetics/courses/${userId}`);
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
            const specializationResponse = await axios.get(`http://localhost:8081/autogenetics/courses/${randomProfessor.User_id}`);
            const specializations = specializationResponse.data;
  
            for (let k = 0; k < specializations.length; k++) {
              const randomSpecialization = specializations[k];
              const response = await axios.get(`http://localhost:8081/autogenetics/program-year-block/${randomSpecialization.course_id}`);
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
// const checkClassHour = async (professorId, classHours) => {
//   try {
//     const professor = professors.find(prof => prof.User_id === professorId);
//     if (professor) {
//       const maxHour = professor.max_hour;
//       return classHours > maxHour;
//     }
//     return false; // Professor not found
//   } catch (error) {
//     console.error('Error checking class hour: ', error);
//     return false;
//   }
// };
  const getRandomTimeSlot = (schedule, block, room, classType) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['7-8', '8-9', '9-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16', '16-17', '17-18', '18-19'] 

  
    while (true) {
      const randomDay = getRandomElement(days);
      const randomTimeSlot = getRandomElement(timeSlots);
      const conflictingClass = schedule.find(classInfo =>
        !classInfo.break &&
        classInfo.day === randomDay &&
        classInfo.timeSlot === randomTimeSlot &&
        classInfo.room.roomName === classInfo.room &&
        classInfo.classType === classType
      );
  
      if (!conflictingClass) {
        return { day: randomDay, timeSlot: randomTimeSlot };

  };
    }
  };
  
  
  const getRandomElement = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };
  const calculateFitness = (bestSchedule) => {
    const professorWorkloadScores = bestSchedule.map((classInfo) => {
      // For simplicity, let's assume professors should have between 3 and 6 classes
      const professorWorkload = classInfo.professor > 9;
      return Math.abs(professorWorkload - 4); // Penalize deviations from the target workload
    });
  
    // Criterion 2: Classroom overbooking
    const roomOverbookingScores = bestSchedule.map((classInfo) => {
      // For simplicity, let's assume a room can handle 3 classes per day
      const roomOverbooking = classInfo.room > 13;
      return Math.max(0, roomOverbooking - 10); // Penalize overbooking
    });

  //   const roomOverbookingScores = bestSchedule.reduce((overbookingScores, classInfo) => {
  //     if (!classInfo.break) {
  //         const { day, room } = classInfo;
  //         // Initialize room count for the day if not already initialized
  //         if (!overbookingScores[day]) {
  //             overbookingScores[day] = {};
  //         }
  //         // Increment class count for the room
  //         overbookingScores[day][room.roomName] = (overbookingScores[day][room.roomName] || 0) + 1;
  //     }
  //     return overbookingScores;
  // }, {});
  
  // // Calculate scores based on room counts
  // const totalRoomOverbookingScore = Object.values(roomOverbookingScores).reduce((totalScore, dayRoomCounts) => {
  //     const dayScore = Object.values(dayRoomCounts).reduce((dayScore, roomCount) => {
  //         // Calculate overbooking for each room in the day
  //         return dayScore + Math.max(0, roomCount - 6); // Penalize if room count exceeds 6
  //     }, 0);
  //     return totalScore + dayScore; // Accumulate day scores
  // }, 0);
  
  // console.log('Room Overbooking Scores:', totalRoomOverbookingScore);
  
  
    // Criterion 3: Even distribution of classes across days
    const dayDistributionScore = calculateDayDistributionScore(bestSchedule);
  
    const totalFitnessScore =
      professorWorkloadScores.reduce((sum, score) => sum + score, 0) +
      roomOverbookingScores.reduce((sum, score) => sum + score, 0) +
      dayDistributionScore;
  
    console.log('Fitness for current schedule: ', totalFitnessScore);
    return totalFitnessScore;
  };
  
  const calculateDayDistributionScore = (bestSchedule) => {
    // Your logic to calculate how evenly classes are distributed across days
    // For simplicity, let's assume classes should be distributed as evenly as possible
    const dayCounts = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
    };
  
    bestSchedule.forEach((classInfo) => {
      if (!classInfo.break) {
        dayCounts[classInfo.day]++;
      }
    });
  
    const maxClassesPerDay = Math.max(...Object.values(dayCounts));
    const minClassesPerDay = Math.min(...Object.values(dayCounts));
    const dayDistributionScore = maxClassesPerDay - minClassesPerDay;
  
    return dayDistributionScore;
  };
  
 // Select a schedule based on roulette wheel selection
const rouletteWheelSelection = (population, fitnessScores) => {
const totalFitness = fitnessScores.reduce((sum, score) => sum + score, 0);
const randomValue = Math.random() * totalFitness;
let accumulatedFitness = 0;

for (let i = 0; i < population.length; i++) {
accumulatedFitness += fitnessScores[i];
if (accumulatedFitness >= randomValue) {
  // Return a copy of the selected schedule to avoid modifying the original
  return [...population[i]];
}
}

// If no schedule is selected, return an empty schedule or handle it as appropriate
return [];
};

// Perform single-point crossover on two parent schedules
const singlePointCrossover = (parent1, parent2) => {
  // Your logic for single-point crossover
  const crossoverPoint = Math.floor(Math.random() * parent1.length);

  console.log('Crossover Point:', crossoverPoint);

  const child1 = [...parent1.slice(0, crossoverPoint), ...parent2.slice(crossoverPoint)];
  const child2 = [...parent2.slice(0, crossoverPoint), ...parent1.slice(crossoverPoint)];

  // Handle conflicts in the children (if any)
  resolveConflicts(child1);
  resolveConflicts(child2);

  return [child1, child2];
};

const resolveConflicts = (schedule) => {
  let conflictsExist = true;

  while (conflictsExist) {
    conflictsExist = false;

    for (let i = 0; i < schedule.length; i++) {
      const currentClass = schedule[i];

      if (!currentClass.break) {
        for (let j = i + 1; j < schedule.length; j++) {
          const otherClass = schedule[j];

          if (
            !otherClass.break &&
            currentClass.day === otherClass.day &&
            currentClass.room.roomName === otherClass.room.roomName &&
            currentClass.timeSlot === otherClass.timeSlot
          ) {
            // Conflict found, attempt reassignment
            const alternativeSchedule = findAlternativeSchedule(schedule, currentClass, otherClass);
            
            if (alternativeSchedule) {
              schedule = alternativeSchedule;
              conflictsExist = true;
              break;
            }
          }
        }
      }

      if (conflictsExist) {
        break;
      }
    }
  }

  return schedule;
};

const findAlternativeSchedule = (schedule, classA, classB) => {
  // Logic to find alternative days, rooms, or time slots for conflicting classes A and B
  // Implement your reassignment strategy here

  // Sample logic: Swap the days of the conflicting classes if available
  const tempDay = classA.day;
  classA.day = classB.day;
  classB.day = tempDay;

  // Verify if this swap resolves the conflicts
  if (!hasConflicts(schedule)) {
    return schedule;
  }

  // If the swap creates further conflicts, revert the changes
  classA.day = tempDay;
  classB.day = tempDay;

  // You can try other reassignment strategies here
  // ...

  // Return null if no suitable reassignments are found
  return null;
};

// Example conflict resolution strategy: Swap conflicting classes
const swapConflict = (schedule) => {
const conflicts = findConflicts(schedule);

// Swap conflicting classes
const [index1, index2] = conflicts;
const temp = schedule[index1];
schedule[index1] = schedule[index2];
schedule[index2] = temp;

return schedule;
};

const findConflicts = (schedule) => {
  const conflicts = [];

  for (let i = 0; i < schedule.length; i++) {
    const currentClass = schedule[i];

    if (!currentClass.break) {
      for (let j = i + 1; j < schedule.length; j++) {
        const otherClass = schedule[j];

        if (!otherClass.break &&
          currentClass.day === otherClass.day &&
          currentClass.room.roomName === otherClass.room.roomName &&
          currentClass.timeSlot === otherClass.timeSlot) {
          conflicts.push(i, j);
        }
      }
    }
  }

  return conflicts;
};

  // Perform swap mutation on a schedule
  const swapMutation = (schedule) => {
    // Select two random classes for swapping
    const index1 = Math.floor(Math.random() * schedule.length);
    const index2 = Math.floor(Math.random() * schedule.length);
  
    // Perform the swap
    const temp = schedule[index1];
    schedule[index1] = schedule[index2];
    schedule[index2] = temp;
  
    // Check for conflicts, and revert the swap if there is a conflict
    if (hasConflicts(schedule)) {
      // Revert the swap
      schedule[index2] = schedule[index1];
      schedule[index1] = temp;
      console.log('Swap reverted due to conflicts');
    }
  
    return schedule;
  };
  
  const hasConflicts = (schedule) => {
    const conflicts = new Set();
  
    schedule.forEach((classInfo, index) => {
      const duplicateIndex = schedule.findIndex((otherClass, otherIndex) =>
        index !== otherIndex && // Avoid self-comparison
        classInfo.room === otherClass.room &&
        classInfo.timeSlot === otherClass.timeSlot &&
        classInfo.day === otherClass.day &&
        classInfo.classType === otherClass.classType && // Include classType comparison
        classInfo.professor.User_id === otherClass.professor.User_id && // Check professor availability
        classInfo.block === otherClass.block
      );
  
      if (duplicateIndex !== -1) {
        conflicts.add(index);
        conflicts.add(duplicateIndex);
      }
    });
  
    return conflicts.size > 0;
  };
  
  const handleSavePDF = async () => {
    setPdfLoading(true);

    try {
        const pdf = new jsPDF("p", "mm", [215.9, 279.4]);

        for (let i = 0; i < professorsSchedule.length; i++) { // Changed from prof.length to professorsSchedule.length
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
  
  const geneticAlgorithm =  async () => {
    let population = await initializePopulation(); 
    let bestSchedule = population[0]; // Initialize with the first schedule

    let bestFitness = calculateFitness(bestSchedule);

    
for (let generation = 0; generation < maxGenerations; generation++) {
const fitnessScores = await Promise.all(population.map((schedule) => calculateFitness(schedule)));
for (let i = 0; i < populationSize; i++) {
  if (fitnessScores[i] > bestFitness) {
    bestSchedule = population[i];
    bestFitness = fitnessScores[i];
  }
  console.log(`Generation ${generation} Fitness Scores: `, fitnessScores);
}
      const newPopulation = [];

      while (newPopulation.length < populationSize) {
        const parent1 = rouletteWheelSelection(population, fitnessScores);
        const parent2 = rouletteWheelSelection(population, fitnessScores);

        if (Math.random() < crossoverRate) {
          const [child1, child2] = singlePointCrossover(parent1, parent2);
          newPopulation.push(child1, child2);
        } else {
          newPopulation.push(parent1.slice(), parent2.slice());
        }

        if (Math.random() < mutationRate) {
          const mutatedChild = swapMutation(newPopulation[newPopulation.length - 1]);
          newPopulation[newPopulation.length - 1] = mutatedChild;
        }
      }

      
      population = newPopulation;
    }

    bestSchedule = population.reduce((best, schedule) => {
      const fitness = calculateFitness(schedule);
      return fitness > calculateFitness(best) ? schedule : best;
    }, population[0]);
  
    console.log('Best Schedule: ', bestSchedule);
    return bestSchedule;
  };
  // Handle Generate Classes with Genetic Algorithm
  const handleGenerateClasses = async () => {
    const bestSchedule = await geneticAlgorithm();
    setBestSchedule(bestSchedule);
    setLoading(true);
    console.log('Selected Course:', selectedCourse);
    console.log('Best Schedule:', bestSchedule);

  };


const TimetableByProfessor = ({ professorSchedule }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['7-8', '8-9', '9-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16', '16-17', '17-18', '18-19'] ;

  // Function to generate a random color
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };


  // Group the professor's schedule by day and time
  const scheduleByDayAndTime = {};
  professorSchedule.forEach((classInfo) => {
    if (!scheduleByDayAndTime[classInfo.day]) {
      scheduleByDayAndTime[classInfo.day] = {};
    }
    if (!scheduleByDayAndTime[classInfo.day][classInfo.timeSlot]) {
      scheduleByDayAndTime[classInfo.day][classInfo.timeSlot] = [];
    }
    scheduleByDayAndTime[classInfo.day][classInfo.timeSlot].push(classInfo);
  });

  return (
    <div>
      <h3>{`${professorSchedule[0].professor.fname} ${professorSchedule[0].professor.lname}'s Timetable`}</h3>
      <table className="timetable">
        <thead>
          <tr>
            <th>Time</th>
            {days.map((day, index) => (
              <th key={index}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time, index) => (
            <tr key={index}>
              <td>{time}</td>
              {days.map((day, dayIndex) => (
                <td key={dayIndex}>
                  {scheduleByDayAndTime[day] &&
                  scheduleByDayAndTime[day][time] &&
                  scheduleByDayAndTime[day][time].length > 0 ? (
                    <div className='text-center'>
                      {scheduleByDayAndTime[day][time].map((classInfo, classIndex) => (
                        <div key={classIndex} style={{ backgroundColor: getRandomColor() }}>
                        {/* Render class information here */}
                          {classInfo.course.course_name}
                          <br/>
                          {classInfo.room.roomName}
                          <br/>
                          {classInfo.block}
                        </div>
                      ))}
                    </div>
                  ) : (
                    ''
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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
