import { useState, useEffect } from "react";
import axios from "axios";
import "./SummerGenetic.css";

const SummerGenetic = () => {
    const [summer, setSummer] = useState([]);
    const [room, setRoom] = useState([]);
    const [bestSchedule, setBestSchedule] = useState([]);
    const [days, setDays] = useState(["MON", "TUES", "WED", "THURS", "FRI", "SAT"]); // Define the days array

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

    const fetchSummer = async () => {
        try {
            const response = await axios.get('http://localhost:8081/summer_sched/data');
            const summerData = response.data; // Extract data from the response
            console.log("Summer Sched: ", summerData); // Log the fetched data
            setSummer(summerData);
        } catch (error) {
            console.error('Error fetching summer schedule: ', error);
        }
    };

    const fetchRoom = async () => {
        try {
            const response = await axios.get('http://localhost:8081/summer_sched/room');
            const roomData = response.data; // Extract data from the response
            console.log("Room: ", roomData); // Log the fetched data
            setRoom(roomData);
        } catch (error) {
            console.error('Error fetching room data: ', error);
        }
    };

    useEffect(() => {
        fetchSummer();
        fetchRoom();
    }, []);

    const generateRandomSchedule = async () => {
        try {
            // Fetch room data
            const response = await axios.get('http://localhost:8081/summer_sched/room');
            const roomData = response.data;
            setRoom(roomData);
    
            // Calculate the total number of slots based on the number of rooms
            const DAYS_NUM = 5; // Assuming 5 days in a week
            const DAY_HOURS = 12; // Assuming 12 hours in a day
            const numberOfRooms = roomData.length; // Number of rooms from fetched data
            const totalSlots = DAYS_NUM * DAY_HOURS * numberOfRooms;
    
            // Define interval in minutes
            const interval = 30;
    
            // Define starting time in minutes
            const startTime = 7 * 60; // 7:00 in minutes
    
            // Calculate endTime based on total available hours in a day and interval
            const endTime = startTime + (DAY_HOURS * 60); // End of day in minutes
    
            // Initialize an empty array to store time slots
            const timeSlots = [];
    
            // Generate time slots
            for (let time = startTime; time < endTime; time += interval) {
                const hour = Math.floor(time / 60);
                const minute = (time % 60).toString().padStart(2, '0');
                const formattedHour = hour % 12 || 12; // Convert hour to 12-hour format
                //const period = hour < 12 ? "AM" : "PM";  Determine AM or PM
                const startTimeString = `${formattedHour}:${minute}`;
                
                // Calculate end time for the slot
                const endHour = Math.floor((time + interval) / 60) % 12 || 12;
                const endMinute = ((time + interval) % 60).toString().padStart(2, '0');
                const endTimeString = `${endHour}:${endMinute}`;
    
                // Construct the time range string
                const timeRange = `${startTimeString} - ${endTimeString}`;
    
                timeSlots.push(timeRange);
            }
    
            // Initialize an empty schedule grid
            const schedule = [];
    
            // Populate the schedule grid with empty slots
            for (let i = 0; i < timeSlots.length; i++) {
                const timeSlot = timeSlots[i];
                const timeSlotData = { time: timeSlot, classes: [] };
    
                for (let j = 0; j < days.length; j++) {
                    const day = days[j];
                    timeSlotData[day] = null;
                }
    
                schedule.push(timeSlotData);
            }
    
            // Populate the schedule with random course classes (similar to the previous example)
    
            return schedule;
        } catch (error) {
            console.error('Error fetching room data: ', error);
        }
    };

    return (
        <div className="table-container"> {/* Apply the CSS class to the container */}
            {room.map((roomItem, roomIndex) => (
                <div key={roomIndex}>
                    <h1>{roomItem.roomName} Schedule</h1>
                    <table className="schedule-table"> {/* Apply the CSS class to the table */}
                        <thead>
                            <tr>
                                <th className="heads">Time</th>
                                {days.map((day, index) => (
                                    <th key={index} className="heads">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {bestSchedule.map((timeSlotData, timeIndex) => (
                                <tr key={timeIndex}>
                                    <td className="time">{timeSlotData.time}</td>
                                    {days.map((day, dayIndex) => (
                                        <td key={dayIndex} className="data">{timeSlotData[day] ? timeSlotData[day] : "-"}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default SummerGenetic;
