import { useState, useEffect } from "react";
import axios from "axios";
import "./SummerGenetic.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";

const SummerGenetic = () => {
    const [summer, setSummer] = useState([]);
    const [room, setRoom] = useState([]);
    const [bestSchedule, setBestSchedule] = useState([]);
    const [days, setDays] = useState(["Monday", "Tuseday", "Wednesday", "Thursday", "Friday"]); 
    const [pdfLoading, setPdfLoading] = useState(false);
    const [universityInfo, setUniversityInfo] = useState([]); 
    const [professorsSchedule, setProfessorsSchedule] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
        const initialize = async () => {
            try {
                const initialSchedule = await generateRandomSchedule();
                setBestSchedule(initialSchedule); 
            } catch (error) {
                console.error('Error generating initial schedule: ', error);
            }
        };

        initialize();
    }, []);

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
    
            console.log("Summer Sched: ", summerData); 
            summerData.forEach(item => {
                console.log(item.type);
            })

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
                console.log("School Name: ", info.schoolName);
                console.log("Address: ", info.address);
                console.log("Telephone Number: ", info.telephoneNumber);
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
            console.log("Room: ", roomData);
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
        timeSlots.forEach(slot => {
            console.log("Time range: " + slot.time);
        });
        
        return timeSlots;
    };
    const generateRandomSchedule = async () => {
        try {
            const classList = new Set();

            for (let i = 0; i < summer.length; i++) {
                const selectedClass = getRandomElement(summer.filter(s => !classList.has(s.summer_id)));
                if (!selectedClass) {
                    console.log('No available class for the remaining schedule.');
                    continue;
                }


                classList.add(selectedClass); 
            }

            const response = await axios.get('http://localhost:8081/summer_sched/room');
            const roomData = response.data;
            setRoom(roomData);
    
            const DAYS_NUM = 5;
            const DAY_HOURS = 12; 
            const interval = 30;
            const startTime = 7 * 60; 
            const endTime = startTime + (DAY_HOURS * 60); 
    
            const generatedTimeSlots = generateTimeSlots(startTime, endTime, interval, days);
        setTimeSlots(generatedTimeSlots);

            const scheduleTime = timeSlots.map(timeSlot => {
                const timeSlotData = { ...timeSlot, classes: [] };
                return timeSlotData;
            });
    
            return scheduleTime;
        } catch (error) {
            console.error('Error fetching room data: ', error);
        }
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
                    const schoolNameUppercase = universityInfo.schoolName.toUpperCase(); // Convert to uppercase
    
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
    
    return (
        <div>
            <button onClick={handleSavePDF} disabled={pdfLoading}>
                {pdfLoading ? "Generating PDF..." : "Save as PDF"}
            </button>
            <div className="table-container" id="schedule-container">
            {professorsSchedule.map((professor, professorIndex) => (
                <div key={professorIndex}>
                    <h1>{professor.professorName}`s Schedule</h1>
                    <table id={`schedule-table-${professorIndex}`} className="schedule-table">
                        <thead>
                            <tr>
                                <th className="heads">Time</th>

                                {days.map((day, index) => (
                                    <th key={index} className="heads">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {timeSlots.map((slot, index) => (
                                <tr key={index}>
                                    <td className="time">{slot.time}</td>
                                    {days.map((day, dayIndex) => (
                                        <td key={dayIndex} className="data">
                                            {professor.schedule.find(schedule => schedule.time === slot.time && schedule.day === day) ? 'Scheduled' : '-'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>


                    </table>
                </div>
            ))}

            </div>
        </div>
    );
};

export default SummerGenetic;
