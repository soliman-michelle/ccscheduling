    import { useState, useEffect } from "react";
    import axios from "axios";
    import "./SummerGenetic.css";
    import html2canvas from "html2canvas";
    import jsPDF from "jspdf";

    const SummerGenetic = () => {
        const [summer, setSummer] = useState([]);
        const [room, setRoom] = useState([]);
        const [bestSchedule, setBestSchedule] = useState([]);
        const [days, setDays] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
        const [pdfLoading, setPdfLoading] = useState(false);
        const [universityInfo, setUniversityInfo] = useState([]);
        const [professorsSchedule, setProfessorsSchedule] = useState([]);
        const [timeSlots, setTimeSlots] = useState([]);
        const [schedule, setSchedule] = useState([]);
        const [population, setPopulation] = useState([]);

        // Define crossover and mutation parameters
        const crossoverProbability = 70; // Percentage
        const numberOfCrossoverPoints = 1;
        const mutationProbability = 5; // Percentage
        const mutationSize = 1; // Number of classes to mutates

        useEffect(() => {
            const initialize = async () => {
              try {
                const initialSchedule = await generateRandomSchedule();
                setBestSchedule(initialSchedule);
        
                // Run genetic algorithm to optimize the schedule
                const optimizedSchedule = await geneticAlgorithm();
                // Update state with the optimized schedule
                setBestSchedule(optimizedSchedule);
              } catch (error) {
                console.error("Error generating initial schedule: ", error);
              }
            };
        
            initialize();
          }, []);

        useEffect(() => {
            fetchSchedule();
        }, []);

        // Fetch schedule data from the servers
        const fetchSchedule = async () => {
            try {
                const response = await axios.get('http://localhost:8081/summer_sched/data');
                const scheduleData = response.data;
                setSchedule(scheduleData);
            } catch (error) {
                console.error('Error fetching schedule data: ', error);
            }
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
                const scheduleTime = [];
                const DAY_HOURS = 12;
                const interval = 60;
                const startTime = 7 * 60;
                const endTime = startTime + (DAY_HOURS * 60);
        
                const generatedTimeSlots = generateTimeSlots(startTime, endTime, interval, days);
                setTimeSlots(generatedTimeSlots);
        
                for (let i = 0; i < summer.length; i++) {
                    const classItem = summer[i];
                    const classId = classItem.summer_id;
                    const userId = classItem.User_id;
                    const block = classItem.block;
                    const course_code = classItem.course_code;
                    const course_name = classItem.course_name;
                    // Find the professor name based on 
                    const professor = professorsSchedule.find(prof => prof.schedule.some(item => item.User_id === userId));
                    const profName = professor ? professor.professorName : "Unknown Professor";
                    
                    const classType = classItem.type;
        
                    const classKey = classId + '-' + classType;
                    if (!classList.has(classKey)) {
                        classList.add(classKey);
        
                        const duration = (classType === 'ftf' || classType === 'lab') ? 2 : 1;
        
                        let room;
                        if (classType === 'online') {
                            room = 'Online';
                        } else {
                            room = getRandomElement(roomData);
                        }
        
                        const day = getRandomElement(days);
                        const classStartTime = getRandomStartTime();
                        const durationInMinutes = duration * 60;
                        const classEndTime = classStartTime + durationInMinutes;
                        const color = generateRandomPastelColor();

                        scheduleTime.push({
                            classId,
                            classType,
                            room,
                            day,
                            block,
                            prof: profName,
                            userId,
                            course_code,
                            course_name,
                            startTime: convertMinutesToTime(classStartTime),
                            endTime: convertMinutesToTime(classEndTime),
                            color
                        });
                    }
                }
        
                scheduleTime.sort((a, b) => {
                    if (a.day !== b.day) {
                        return days.indexOf(a.day) - days.indexOf(b.day);
                    } else {
                        const timeA = convertMinutesToTime(a.startTime);
                        const timeB = convertMinutesToTime(b.startTime);
                        return timeA - timeB;
                    }
                });
                console.log("Schedules: ", scheduleTime); 
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
        
        const handleSavePDF = async () => {
            setPdfLoading(true);

            try {
                const pdf = new jsPDF("p", "mm", [215.9, 279.4]);

                for (let i = 0; i < room.length; i++) {
                    const roomItem = room[i];
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

                    await generatePDF(pdf, scheduleTable, roomItem.roomName);

                    if (i < room.length - 1) {
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

        const renderTableHeader = () => {
            return (
                <thead>
                    <tr>
                        <th className="heads">Times</th>
                        {days.map((day, index) => (
                            <th key={index} className="heads">{day}</th>
                        ))}
                    </tr>
                </thead>
            );
        };
        
        const generateRandomPastelColor = () => {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            return `rgba(${r},${g},${b},0.5)`; // Use rgba to set opacitys
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
                                <td key={dayIndex} className="data">
                                    {professorSchedule.map((classItem, classIndex) => {
                                        if (classItem.day === day && isTimeInRange(slot.time, classItem.startTime, classItem.endTime)) {
                                            // Adjust start and end times based on slot timess
                                            const [startHour, startMinute] = classItem.startTime.split(":").map(Number);
                                            const [endHour, endMinute] = classItem.endTime.split(":").map(Number);
                                            const [slotStartHour, slotStartMinute] = slot.time.split(" - ")[0].split(":").map(Number);
                                            const [slotEndHour, slotEndMinute] = slot.time.split(" - ")[1].split(":").map(Number);
        
                                            // Calculate slot end hour based on slot start hour and duration
                                            const slotDurationHours = Math.floor(30 / 60);
                                            const slotDurationMinutes = 30 % 60;
                                            let slotEndHourCalculated = slotStartHour + slotDurationHours;
                                            if (slotStartMinute + slotDurationMinutes >= 60) {
                                                slotEndHourCalculated++;
                                            }
        
                                            // Ensure the class starts and ends within the slot time ranges
                                            if ((startHour > slotEndHour || (startHour === slotEndHour && startMinute >= slotEndMinute)) ||
                                                (endHour < slotStartHour || (endHour === slotStartHour && endMinute <= slotStartMinute))) {
                                                return null; // Class falls completely outside the slot time
                                            }
        
                                            // Check if the class starts before the time slot and ends after the time slot
                                            if (startHour <= slotStartHour && endHour >= slotEndHour) {
                                                return (
                                                    <div
                                                        key={classIndex}
                                                        className="online-schedule"
                                                        style={{ backgroundColor: classItem.color }}
                                                    >
                                                        <p>{classItem.course_code} - {classItem.course_name}</p>
                                                        <p>Slot {classItem.block}</p>
                                                        <p>{classItem.room.roomName}</p>
                                                    </div>
                                                );
                                            } else {
                                                return null;
                                            }
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

        const crossover = (schedule1, schedule2) => {
            // Check probability of crossover operation
            if (Math.floor(Math.random() * 100) > crossoverProbability) {
                // No crossover, just return copies of the parents
                return [schedule1, schedule2];
            }
        
            // New schedule objects, copy schedule setup
            const newSchedule1 = [...schedule1];
            const newSchedule2 = [...schedule2];
        
            // Number of classes
            const size = newSchedule1.length;
        
            const crossoverPoints = new Array(size).fill(false);
        
            // Determine crossover points randomly
            for (let i = numberOfCrossoverPoints; i > 0; i--) {
                let p;
                while (true) {
                    p = Math.floor(Math.random() * size);
                    if (!crossoverPoints[p]) {
                        crossoverPoints[p] = true;
                        break;
                    }
                }
            }
        
            // Make new schedules by combining parent schedules
            let first = Math.random() < 0.5;
            for (let i = 0; i < size; i++) {
                if (first) {
                    // Insert class from first parent into new schedule's class table
                    newSchedule1[i] = { ...schedule1[i] };
                } else {
                    // Insert class from second parent into new schedule's class table
                    newSchedule1[i] = { ...schedule2[i] };
                }
        
                // Crossover point
                if (crossoverPoints[i]) {
                    // Change source chromosome
                    first = !first;
                }
            }
        
            return [newSchedule1, newSchedule2];
        };

        const geneticAlgorithm =  async () => {
            let population = await initializePopulation(); 
            let bestSchedule = population[0]; // Initialize with the first schedule
        
            let bestFitness = calculateFitness(bestSchedule);
        
            
        
        
            bestSchedule = population.reduce((best, schedule) => {
              const fitness = calculateFitness(schedule);
              return fitness > calculateFitness(best) ? schedule : best;
            }, population[0]);
          
            console.log('Best Schedule: ', bestSchedule);
            return bestSchedule;
          };
        
        const mutateClass = (classItem, roomData, startTime, endTime) => {
            // Make a copy of the original class item
            const mutatedClass = { ...classItem };
        
            // Example mutation: randomly change the day of the class
            const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
            const randomDayIndex = Math.floor(Math.random() * daysOfWeek.length);
            const randomDay = daysOfWeek[randomDayIndex];
            mutatedClass.day = randomDay;
        
            // Example mutation: randomly change the room of the class
            const randomRoomIndex = Math.floor(Math.random() * roomData.length);
            const randomRoom = roomData[randomRoomIndex];
            mutatedClass.room = randomRoom;
        
            // Example mutation: randomly change the start time of the class
            const startTimeInMinutes = Math.floor(Math.random() * (endTime - startTime)) + startTime;
            mutatedClass.startTime = convertMinutesToTime(startTimeInMinutes);
        
            // Ensure that the mutated class does not overlap with existing classes (pseudo-code)
            // Implement logic to check for overlapping classes and adjust the mutated class accordingly
        
            return mutatedClass;
        };
        
        // Function to mutate a single class object
       const mutateSchedule = () => {
       const mutatedSchedule = [...schedule]; // Create a copy of the schedule array

    // Check probability of mutation operation
    if (Math.random() * 100 > mutationProbability) {
        return; // No mutation, return without updating the state
    }

    // Number of classes to mutate
    const numberOfMutations = mutationSize;

    for (let i = 0; i < numberOfMutations; i++) {
        // Select a random index to mutate
        const indexToMutate = Math.floor(Math.random() * mutatedSchedule.length);

        // Mutate the selected class at the index
        const mutatedClass = mutateClass(mutatedSchedule[indexToMutate]); // Implement mutateClass function as needed

        // Update the schedule with the mutated class
        mutatedSchedule[indexToMutate] = mutatedClass;
    }

    // Update the state with the mutated schedule
    setSchedule(mutatedSchedule);
};

        const calculateFitness = (schedule, roomData) => {
        let fitnessScore = 0;

        const numberOfRooms = roomData.length; // Assuming roomData is availables
        const daySize = 12 * numberOfRooms;
        const DAYS_NUM = 5;

        // Iterate through each class in the schedule
        schedule.forEach(classItem => {
            const { day, startTime, duration, room, prof } = classItem;

            // Check for room overlapping of classes
            const isRoomOverlap = schedule.some(otherClass => {
                return otherClass !== classItem &&
                    otherClass.day === day &&
                    otherClass.room === room &&
                    !(startTime >= otherClass.endTime || otherClass.startTime >= startTime + duration);
            });

            const isProfClassOverlap = schedule.some(otherClass => {
                return otherClass !== classItem &&
                    otherClass.day === day &&
                    otherClass.prof === prof &&
                    !(startTime >= otherClass.endTime || otherClass.startTime >= startTime + duration);
            });

            const isProfCourseBlockOverlap = schedule.some(otherClass => {
                return otherClass !== classItem &&
                    otherClass.day === day &&
                    otherClass.prof === prof &&
                    otherClass.block === classItem.block && // Check for same block
                    !(startTime >= otherClass.endTime || otherClass.startTime >= startTime + duration);
            });
            

            // Check if there is no room overlapping
            const noRoomOverlap = !isRoomOverlap;
            if (noRoomOverlap) fitnessScore++;
        
            // Check if there is no professor class overlap
            const noProfClassOverlap = !isProfClassOverlap;
            if (noProfClassOverlap) fitnessScore++;

            const noProfCourseBlockOverlap = !isProfCourseBlockOverlap;
            if (noProfCourseBlockOverlap) fitnessScore++;

        });

            

        // Calculate fitness value based on the total score and the total number of classes and days
        const totalClasses = schedule.length;
        const totalCriteria = 1; // Adjust this based on the total number of criteria checkeds
        fitnessScore = fitnessScore / (totalClasses * DAYS_NUM * totalCriteria);
        console.log("Fitness: " + fitnessScore);
        return fitnessScore;
    };


        return (
            <div>
                <div className="table-container" id="schedule-container">
                    {professorsSchedule.map((professor, professorIndex) => (
                        <div key={professorIndex}>
                            <h1>{professor.professorName} Schedule</h1>
                            <table id={`schedule-table-${professorIndex}`} className="schedule-table">
                                {renderTableHeader()}
                                {renderTableBody(professor)}
                            </table>
                        </div>
                    ))}
                </div>
                <button onClick={handleSavePDF} disabled={pdfLoading}>
                    {pdfLoading ? "Generating PDF..." : "Save as PDF"}
                </button>
            </div>
        );
    };

    export default SummerGenetic;
