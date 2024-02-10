import { useState, useEffect } from "react";
import axios from "axios";
import "./SummerGenetic.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// import ResetModal from "./ResetModal";

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
    const [isFilterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('Professor');
    const [showModal, setShowModal] = useState(false);  
    const [semester, setSemester] = useState([]);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState('2023 - 2024');
    const [selectedSemester, setSelectedSemester] = useState(2);
    const [isGenerating, setIsGenerating] = useState(false); // State variable to track class generation
    const [currentYear, setCurrentYear] = useState('');

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

    const handleFilter = (filter) => {
      setSelectedFilter(filter);
      toggleFilterDropdown();
    };

    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [summerResponse, roomResponse, universityInfoResponse] = await Promise.all([
            axios.get('http://localhost:8081/summer_sched/data'),
            axios.get('http://localhost:8081/summer_sched/room'),
            axios.get('http://localhost:8081/university-info')
          ]);
    
          const summerData = summerResponse.data;
          const roomData = roomResponse.data;
          const universityInfo = universityInfoResponse.data.universityInfo[0];
    
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
          setRoom(roomData);
          setUniversityInfo(universityInfo);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };
    
      fetchData();
    }, []);
    useEffect(() => {
      const fetchAcademicYears = async () => {
        try {
          const response = await axios.get('http://localhost:8081/summer_sched/archive');
          setAcademicYears(response.data); // Assuming response.data is an array of academic years
          setSemester(response.data); // Assuming response.data is an array of academic years
        } catch (error) {
          console.error('Error fetching academic years: ', error);
        }
      };
  
      fetchAcademicYears(); // Call the function to fetch academic years when the component mounts
    }, []); // Empty dependency array ensures this effect runs only once
  
    const handleAcademicYearChange = (event) => {
      setSelectedAcademicYear(event.target.value);
    };
            
    const handleSemesterChange = (event) => {
      setSelectedSemester(event.target.value);
    };
    

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
      let sortedSchedule = [...bestSchedule]; // Create a copy of bestSchedule to avoid mutating the original array
  
      // Initialize an object to store overlaps
      const overlaps = {
          room: {},
          profDayTime: {},
          profDayTimeSlot: {}
      };
  
      // Iterate over each schedule to check for profKey and roomKey overlaps
      sortedSchedule.forEach((currentClass, index) => {
          const { room, day, startTime, endTime, prof, course_code, course_name, block } = currentClass;
          const roomName = room && room.roomName ? room.roomName : "N/A";
          
          const roomKey = roomName !== "N/A" ? `${roomName}-${day}-${startTime}-${endTime}` : `${prof}-${course_code}-${course_name}-${block}-${day}`;
          const profDayBlockKey = `${prof}-${course_code}-${course_name}-${block}-${day}`; // Modified key to include block
  
          // Check for room overlap
          if (overlaps.room[roomKey]) {
              overlaps.room[roomKey].push(currentClass);
          } else {
              overlaps.room[roomKey] = [currentClass];
          }

           // Check for professor-day-block overlap
           if (overlaps.profDayTime[profDayBlockKey]) {
            overlaps.profDayTime[profDayBlockKey].push(currentClass);
        } else {
            overlaps.profDayTime[profDayBlockKey] = [currentClass];
        }
      });
  
      // Iterate over each prof-day-block group to check for overlaps
      Object.values(overlaps.profDayTime).forEach((group) => {
          if (group.length > 1) {
              // Ensure that classes with the same prof, course_code, course_name, day, and block do not overlap
              const uniqueClasses = [...new Set(group.map(({ course_code, course_name, day, block }) => `${course_code}-${course_name}-${day}-${block}`))];
              if (uniqueClasses.length !== group.length) {
                  // There are duplicate classes with the same prof, course_code, course_name, day, and block
                  console.log("Duplicate classes found for the same prof, course, day, and block. Rejecting...");
                  return; // Exit the iteration
              }
  
              // Sort the group based on the start times of the classes
              group.sort((a, b) => {
                  const startTimeA = convertTimeToMinutes(a.startTime);
                  const startTimeB = convertTimeToMinutes(b.startTime);
                  return startTimeA - startTimeB;
              });
  
              // Check for overlaps within this group
              for (let i = 0; i < group.length - 1; i++) {
                  const currentClass = group[i];
                  const nextClass = group[i + 1];
  
                  // Compare the end time of current class with the start time of the next class
                  if (convertTimeToMinutes(currentClass.endTime) > convertTimeToMinutes(nextClass.startTime)) {
                      score++; // Increment the score for overlapping classes
                      console.log(`Overlap detected between ${currentClass.course_code} and ${nextClass.course_code}`);
                  }
              }
          }
      });
  
      // Calculate fitness score
      let result;
      if (bestSchedule.length > 0) {
          result = score / (bestSchedule.length * 5); // Assuming each subject contributes to a score of 5
      } else {
          result = 0; // Handle the case when bestSchedule is empty
      }
  
      setFitnessScore(result); // Update fitness score state directly
      return result;
  };
  
  
  const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

  function crossover(schedule1, schedule2) {
    // Choose a crossover point
    const crossoverPoint = Math.floor(Math.random() * schedule1.length);
  
    // Create copies of parent schedules
    const offspring1 = [...schedule1];
    const offspring2 = [...schedule2];
  
    // Perform crossover by swapping genetic material between parents
    for (let i = crossoverPoint; i < schedule1.length; i++) {
      const temp = offspring1[i];
      offspring1[i] = offspring2[i];
      offspring2[i] = temp;
    }
  
    // Return the new offspring
    return [offspring1, offspring2];
  }
  
    
  function mutate(initialSchedule, mutationRate) {
    const mutatedSchedule = [...initialSchedule];

    if (Math.random() < mutationRate) {
        console.log("Mutating...");

        // Select a random class to mutate
        const mutationIndex = Math.floor(Math.random() * mutatedSchedule.length);
        const mutatedClass = mutatedSchedule[mutationIndex];

        // Generate new day and time for the class
        mutatedClass.day = getRandomElement(days);
        mutatedClass.room = getRandomElement(room);

        mutatedClass.startTime = convertMinutesToTime(getRandomStartTime());

        console.log("Mutated Schedule:", mutatedSchedule);

        return mutatedSchedule;
    } else {
        return mutatedSchedule;
    }
}

    function steadyStateReplacement(currentPopulation, offspring, populationSize) {
      // Combine current population and offspring
      const combinedPopulation = currentPopulation.concat(offspring);
    
      // Sort the combined population by fitness (ascending order)
      combinedPopulation.sort((a, b) => calculateFitness(b) - calculateFitness(a));
    
      // Select the top individuals to form the next generation
      const nextGeneration = combinedPopulation.slice(0, populationSize);
    
      return nextGeneration;
    }
    
    
    async function geneticAlgorithm(initialPopulation, config) {
      let population = initialPopulation;
      let bestSchedule = population[0];
      let stopConditionMet = false;
      let generation = 0;

      console.log("generation: ", generation);
    
      while (generation < config.maxGeneration && !stopConditionMet) {
        const offspring = await selectAndMutate(population, config);
        population = steadyStateReplacement(population, offspring, config.populationSize);
        bestSchedule = population[0];
        console.log("Generation:", generation + 1, "Best Fitness:", calculateFitness(bestSchedule));
    
        // Check if the fitness score is 0
        if (calculateFitness(bestSchedule) === 0) {
          console.log("Fitness score is 0. Stopping genetic algorithm.");
          stopConditionMet = true;
        }
    
        generation++;
      }
    
      return bestSchedule;
    }
    
    
    const selectAndMutate = async (population, config) => {
      let newPopulation = [];
    
      for (let i = 0; i < population.length; i += 2) {
        let [parent1, parent2] = tournamentSelection(population, config.tournamentSize);
    
        // Perform crossover with a higher probability for lower fitness values
        if (Math.random() < (parent1[0].fitness + parent2[0].fitness) / (2 * config.populationSize)) {
          [parent1, parent2] = await crossover(parent1, parent2, config.crossoverProbability);
        }
    
        parent1 = mutate(parent1, config.mutationRate);
        parent2 = mutate(parent2, config.mutationRate);
    
        newPopulation.push(parent1, parent2);
      }
    
      return newPopulation;
    };
    
    const tournamentSelection = (population, tournamentSize) => {
      const selectedParticipants = [];
  
      // Run multiple tournaments
      for (let i = 0; i < population.length / 2; i++) {
          let tournamentParticipants = [];
  
          // Randomly select individuals for the tournament
          for (let j = 0; j < tournamentSize; j++) {
              const randomIndex = Math.floor(Math.random() * population.length);
              tournamentParticipants.push(population[randomIndex]);
          }
  
          // Sort tournament participants based on fitness, with better individuals having lower fitness
          tournamentParticipants.sort((a, b) => b.fitness - a.fitness);
  
          // Select the individual with the best fitness from the tournament
          selectedParticipants.push(tournamentParticipants[0]);
      }
  
      return selectedParticipants;
  };
  
    
    const populationSize = 50; // Define the size of the initial population

    const generateInitialPopulation = async (populationSize) => {
      const initialPopulation = [];
  
      for (let i = 0; i < populationSize; i++) {
          const randomSchedule = await generateRandomSchedule();
          initialPopulation.push(randomSchedule);
      }
  
      return initialPopulation;
  };


  const yourConfigObject = {
    maxGeneration: 10, // Maximum number of generations
    tournamentSize: 10, // Size of tournament selection
    crossoverProbability: 0.6, // Probability of crossover operation
    mutationRate: 0.5, // Mutation rate
    mutationProbability: 0.5 // Probability of mutation operation
};
    
const handleGenerateSummerClasses = async () => {
  try {
      setIsGenerating(true); // Set the state variable to true when generating starts

      const initialPopulation = await generateInitialPopulation(populationSize);
      const bestSchedule = await geneticAlgorithm(initialPopulation, yourConfigObject);
      const fitness = await calculateFitness(bestSchedule);
      setFitnessScore(fitness);
      setBestSchedule(bestSchedule);
  } catch (error) {
      console.error('Error generating initial population or running genetic algorithm: ', error);
  } finally {
      setIsGenerating(false); // Set the state variable back to false when generation finishes
  }
};


const renderTableBody = (professor) => {
  const professorName = professor.professorName;
  const professorSchedule = bestSchedule.filter((classItem) => classItem.prof === professorName);

  return (
    <tbody>
      {timeSlots.map((slot, slotIndex) => (
        <tr key={slotIndex}>
          <td className="time">{slot.time}</td>
          {days.map((day, dayIndex) => (
            <td key={dayIndex} className="data">
              {professorSchedule
                .filter(
                  (classItem) => classItem.day === day && isTimeInRange(slot.time, classItem.startTime, classItem.endTime)
                )
                .map((classItem, classIndex) => (
                  <div
                    key={classIndex}
                    className="online-schedule"
                    style={{ backgroundColor: classItem.color }}
                  >
                    <p>{classItem.course_code} - {classItem.course_name}</p>
                    <p>{classItem.startTime} - {classItem.endTime}</p>
                    <p>{classItem.room.roomName || "N/A"}</p>
                    <p>{classItem.day}</p>
                    <p>{classItem.block}</p>
                    <p>{classItem.prof}</p>

                  </div>
                ))}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};


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
                  // Include selected academic year and semester in the request body
                  const payload = {
                      bestSchedule: [schedule],
                      selectedAcademicYear: selectedAcademicYear, // Include selected academic year
                      selectedSemester: selectedSemester // Include selected semester
                  };
  
                  console.log("PAY: ", payload);
                  const response = await axios.put(`http://localhost:8081/summer_sched/${classId}/update`, payload);
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

const isTimeInRange = (currentTime, startTime, endTime) => {
  const [currentStart, currentEnd] = currentTime.split(" - ");
  return currentStart >= startTime && currentEnd <= endTime;
};

return (
  <div>
      <div className="row">
      <p id="currentYear">{currentYear}</p>
      <div className="col-md-3">
         
      <select id="academicYear" name="academicYear" value={selectedAcademicYear} onChange={handleAcademicYearChange}>
            {academicYears.map((year) => (
              <option key={year.academic_id} value={year.academic_id}>
                {`${year.start} - ${year.end}: ${year.sem}${year.sem === 1 ? 'st' : 'nd'} Semester`}
              </option>
            ))}
          </select>
          </div>
          <div className="col-md-3">
          {/* <ResetModal/> */}
          {/* <Dropdown show={isFilterDropdownOpen} onToggle={toggleFilterDropdown}>
        <Dropdown.Toggle id="dropdown-filter" className="custom-dropdown-toggle float-right mt-2">
          <span style={{ color: 'black' }}>{selectedFilter} <FaCaretDown /></span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleFilter('Professor')}>Professor</Dropdown.Item>
          <Dropdown.Item onClick={() => handleFilter('Room')}>Room</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown> */}
          </div>
      </div>
      <div className="card card-body mb-3 animated fadeInUp">
      <button
      type="button"
      className="btn btn-primary"
      onClick={handleGenerateSummerClasses}
      disabled={isGenerating} // Disable the button when classes are being generated
  >
      {isGenerating ? "Generating..." : "Generate Classes"} {/* Change button text based on generation state */}
  </button>
</div>
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
