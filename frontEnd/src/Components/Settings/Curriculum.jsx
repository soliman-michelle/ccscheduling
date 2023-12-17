import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform actions with startYear, endYear, and semester values
    console.log('Start Year:', startYear);
    console.log('End Year:', endYear);
    console.log('Semester:', semester);
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
