import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Curriculum = () => {
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [semester, setSemester] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    fetchCurrentAcademicYear();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const successTimer = setTimeout(() => {
        setSuccessMessage('');
      }, 2000);

      return () => clearTimeout(successTimer);
    }
  }, [successMessage]);

  const fetchCurrentAcademicYear = async () => {
    try {
      const response = await axios.get('http://localhost:8081/summer_sched/curriculum');
      const { start, end, sem } = response.data[0];
      setCurrentYear(`${sem === 1 ? '1st' : '2nd'} Semester A.Y. ${start}-${end}`);
    } catch (error) {
      console.error('Error fetching current academic year:', error);
    }
  };

  const handleStartYearChange = (event) => {
    setStartYear(event.target.value);
  };

  const handleEndYearChange = (event) => {
    setEndYear(event.target.value);
  };

  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const currentYear = new Date().getFullYear();
  
    const startYearNumber = parseInt(startYear);
    const endYearNumber = parseInt(endYear);
  
    if (startYearNumber < currentYear || endYearNumber < currentYear) {
      setErrorMessage('Start year and end year must be greater than or equal to the current year.');
      setTimeout(() => setErrorMessage(''), 2000); // Clear error message after 2 seconds
      return; // Stop execution if validation fails
    }
  
    if (endYearNumber <= startYearNumber) {
      setErrorMessage('End year must be greater than start year.');
      setTimeout(() => setErrorMessage(''), 2000); // Clear error message after 2 seconds
      return; // Stop execution if validation fails
    }
  
    if (endYearNumber - startYearNumber > 1) {
      setErrorMessage('The difference between end year and start year cannot be greater than one.');
      setTimeout(() => setErrorMessage(''), 2000); // Clear error message after 2 seconds
      return; // Stop execution if validation fails
    }
  
    try {
      const checkResponse = await axios.get(`http://localhost:8081/rooms/check/${startYear}/${endYear}/${semester}`);
      if (checkResponse.data.exists) {
        setErrorMessage('The academic year and semester already exist.');
        setTimeout(() => setErrorMessage(''), 2000);
        return; 
      }else {
         // If not exist, save the academic year
      const response = await axios.post('http://localhost:8081/save-academic-year', {
        startYear: startYear,
        endYear: endYear,
        semester: semester
      });
  
      console.log('Academic year saved successfully:', response.data);
      setSuccessMessage('Academic year saved successfully!');
      fetchCurrentAcademicYear();
      setTimeout(() => setSuccessMessage(''), 2000); // Clear success message after 2 seconds
      }
    } catch (error) {
      console.error('Error saving academic year:', error);
      setErrorMessage('Error saving academic year. Please try again.');
      setTimeout(() => setErrorMessage(''), 2000); // Clear error message after 2 seconds
    }
  };
  
  return (
    <div className="container mt-5">

      <h2>Curriculum</h2>
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      <div className="mb-3">
        <p id="currentYear">{currentYear}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="startYear" className="form-label">
            Start Year:
          </label>
          <input
            type="number"
            className="form-control"
            id="startYear"
            value={startYear}
            onChange={handleStartYearChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="endYear" className="form-label">
            End Year:
          </label>
          <input
            type="number"
            className="form-control"
            id="endYear"
            value={endYear}
            onChange={handleEndYearChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="semester" className="form-label">
            Semester:
          </label>
          <select
            className="form-select"
            id="semester"
            value={semester}
            onChange={handleSemesterChange}
            required
          >
            <option value="">Select Semester</option>
            <option value="1">1st Semester</option>
            <option value="2">2nd Semester</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Curriculum;
