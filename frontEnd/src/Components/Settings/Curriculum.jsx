import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Curriculum = () => {
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [semester, setSemester] = useState('');

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
  
    try {
      // Send a POST request to your backend API endpoint
      const response = await axios.post('http://localhost:8081/save-academic-year', {
        startYear: startYear,
        endYear: endYear,
        semester: semester
      });
  
      console.log('Academic year saved successfully:', response.data);
      // Optionally, you can show a success message to the user
    } catch (error) {
      console.error('Error saving academic year:', error);
      // Optionally, you can show an error message to the user
    }
  };

  return (
    <div className="container mt-5">
      <h2>Curriculum</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="startYear" className="form-label">
            Start Year:
          </label>
          <input
            type="text"
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
            type="text"
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
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
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
