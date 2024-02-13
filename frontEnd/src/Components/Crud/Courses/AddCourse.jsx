import { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AddCourse = ({ show, handleClose, handleAdd }) => {
  const [showRoomExistsAlert, setShowRoomExistsAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // State for success alert
  const [showAlert, setShowAlert] = useState(false);
  const [courseData, setCourseData] = useState({
    course_code: '',
    course_name: '',
    units: '',
    selectedPrograms: [], // Initialize as an empty array
    yearLevel: '',
    sem: '',
    duration: '',
    ftf: '',
    online: '',
    lab: '',
  });
  const [programs, setPrograms] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (courseData.duration === '5') {
      setCourseData((prevData) => ({
        ...prevData,
        ftf: '2',
        online: '1',
        lab: '2',
      }));
    } else if (courseData.duration === '3') {
      setCourseData((prevData) => ({
        ...prevData,
        ftf: '2',
        online: '1',
        lab: '0',
      }));
    }
    // Handle other cases if needed
  }, [courseData.duration]);

  useEffect(() => {
    axios.get('http://localhost:8081/course/program')  
      .then(response => {
        setPrograms(response.data);
        console.log(programs);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleCheckboxChange = (event) => {
    const { checked, value } = event.target;
    let updatedSelectedPrograms = [...courseData.selectedPrograms];

    if (checked && !updatedSelectedPrograms.includes(value)) {
      updatedSelectedPrograms.push(value);
    } else {
      updatedSelectedPrograms = updatedSelectedPrograms.filter(item => item !== value);
    }

    setCourseData({ ...courseData, selectedPrograms: updatedSelectedPrograms });
  };

  const handleFormSubmit = async () => {
    const validationErrors = {};
    console.log(courseData); // Log the courseData state to check values before validation

    if (courseData.selectedPrograms.length === 0) {
      validationErrors.program = 'Please select at least one program.';
    }

    if (!courseData.course_code) {
      validationErrors.course_code = 'Course code is required.';
    } else if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d\s_-]+$/.test(courseData.course_code.trim())) {
      validationErrors.course_code = 'Course code should contain both numbers and alphabetic characters.';
    }
    
    if (!courseData.course_name) {
      validationErrors.course_name = 'Course name is required.';
    } else if (!/^(?=.*[a-zA-Z])([a-zA-Z\d\s_-]+)$/.test(courseData.course_name.trim())) {
      validationErrors.course_name = 'Course name should contain both numbers and alphabetic characters, or alphabetic characters only.';
    }
    

    if (isNaN(courseData.units) || courseData.units < 0 || courseData.units > 6) {
      validationErrors.units = 'Units must be a number between 0 and 6.';
    }

    if (isNaN(courseData.yearLevel) || courseData.yearLevel < 1 || courseData.yearLevel > 4) {
      validationErrors.yearLevel = 'Year level must be a number between 1 and 4.';
    }

    if (isNaN(courseData.sem) || courseData.sem < 1 || courseData.sem > 2) {
      validationErrors.sem = 'Semester must be a number between 1 and 2.';
    }

    if (isNaN(courseData.duration) || courseData.duration < 1 || courseData.duration > 5) {
      validationErrors.duration = 'Duration must be a number between 1 and 5.';
    }
    if (isNaN(courseData.ftf) || courseData.ftf < 1 || courseData.ftf > 3) {
      validationErrors.ftf = 'Face To face must be a number between 2 and 3.';
    }

    if (isNaN(courseData.lab) || courseData.lab < 0 || courseData.lab > 3) {
      validationErrors.lab = 'Laboratory must be a number between 2 and 3.';
    }
    if (isNaN(courseData.online) || courseData.online < 1 || courseData.online > 2) {
      validationErrors.online = 'Laboratory must be a number between 1 and 2.';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.get(`http://localhost:8081/course/check/${courseData.course_code}/${courseData.course_name}`);
        const courseExists = response.data.exists; // Get the 'exists' property from the response

        if (courseExists) {
          setShowRoomExistsAlert(true); // Show the appropriate alert for existing course
        } else {
          // Proceed to create the course if it doesn't exist
          await axios.post('http://localhost:8081/course/create', {
            ...courseData,
            program: courseData.selectedPrograms,
          });
      
          // Reset form data after successful submission
          handleAdd(courseData);
          handleClose();
          setCourseData({
            selectedPrograms: [],
            course_code: '',
            course_name: '',
            units: '',
            yearLevel: '',
            sem: '',
            duration: '',
            ftf: '',
            online: '',
            lab: '',
          });
          setErrors({});
        setShowSuccessAlert(true); // Show success alert
        setShowAlert(false); // Hide validation alert
        setShowRoomExistsAlert(false); // Hide duplicate alert

        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      // Show validation errors modal
      setShowAlert(true);
      setShowSuccessAlert(false); // Hide success alert
      setShowRoomExistsAlert(false); // Hide duplicate alert
    }
  };
  
  return (
    <div>
                  <style> {`
        .small-btn {
        @media (min-width: 320px) {
        font-size: 12px;
      }
      @media (min-width: 1024px){
        font-size: 15px;
      }
    }
      `}

      </style>
      <Button variant="primary" onClick={handleClose} className = "small-btn">
        <FontAwesomeIcon icon={faPlus} /> Add Course
      </Button>
      <Modal show={show} onHide={handleClose} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Add Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className='row mb-2' >
              <div className='col-md-4'>
              <Form.Group controlId="course_code">
              {/* <Form.Label>Course Code</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="Enter Course Code"
                name="course_code"
                value={courseData.course_code}
                onChange={handleInputChange}
              />
            </Form.Group>
              </div>
              <div className='col-md-8'>
              <Form.Group controlId="course_name">
              {/* <Form.Label>Course Description</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="Enter Course name"
                name="course_name"
                value={courseData.course_name}
                onChange={handleInputChange}
              />
            </Form.Group>
              </div>
            </div>
            <Form.Group controlId="units" className='mb-2'>
              {/* <Form.Label>Units</Form.Label> */}
              <Form.Control
                type="number"
                placeholder="Enter # of units"
                name="units"
                value={courseData.units}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="program">
            <div className='row mb-2'>
              {programs.map(program => (
                <div key={program.id} className='col-md-4'>
                  <Form.Check
                    type="checkbox"
                    label={program.program}
                    name={`selectedProgram_${program.id}`} // Unique name for each checkbox
                    value={program.program}
                    checked={courseData.selectedPrograms.includes(program.program)}
                    onChange={handleCheckboxChange} // Use handleCheckboxChange for all checkboxes
                  />
                </div>
              ))}
            </div>
          </Form.Group>

            <div className='row mb-2'>
              <div className='col-md-6'>
              <Form.Group controlId="yearLevel">
              {/* <Form.Label>Year Level</Form.Label> */}
              <Form.Control
                type="number"
                placeholder="Enter year level"
                name="yearLevel"
                value={courseData.yearLevel}
                onChange={handleInputChange}
              />
            </Form.Group>
              </div>
              <div className='col-md-6'>
              <Form.Group controlId="sem">
              {/* <Form.Label>Semester</Form.Label> */}
              <Form.Control
                type="number"
                placeholder="Enter semester"
                name="sem"
                value={courseData.sem}
                onChange={handleInputChange}
              />
            </Form.Group>
              </div>
            </div>
            <Form.Group controlId="duration">
              {/* <Form.Label>Duration</Form.Label> */}
              <Form.Control
                type="number"
                placeholder="Enter # of duration"
                name="duration"
                className='mb-2'
                value={courseData.duration}
                onChange={handleInputChange}
              />
            </Form.Group>
           <div className='row'>
            <div className='col-md-4'>
            <Form.Group controlId="ftf">
              {/* <Form.Label>Face to Face duration</Form.Label> */}
              <Form.Control
                type="number"
                placeholder="Duration for ftf"
                name="ftf"
                value={courseData.ftf}
                onChange={handleInputChange}
              />
            </Form.Group>
            </div>
            <div className='col-md-4'>
            <Form.Group controlId="online">
              {/* <Form.Label>Online duration</Form.Label> */}
              <Form.Control
                type="number"
                placeholder="Duration for Online"
                name="online"
                value={courseData.online}
                onChange={handleInputChange}
              />
            </Form.Group>
            </div>
            <div className='col-md-4'>
            <Form.Group controlId="lab">
              {/* <Form.Label>Lab duration</Form.Label> */}
              <Form.Control
                type="number"
                placeholder="Duration for Laboratory"
                name="lab"
                value={courseData.lab}
                onChange={handleInputChange}
              />
            </Form.Group>
            </div>
           </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleFormSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRoomExistsAlert} onHide={() => setShowRoomExistsAlert(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Duplicate</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>The Course <strong>{courseData.course_code} {courseData.course_name}</strong> already exists.</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="primary" onClick={() => setShowRoomExistsAlert(false)}>
      OK
    </Button>
  </Modal.Footer>
</Modal>

<Modal show={showAlert} onHide={() => setShowAlert(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Invalid</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  {errors.program && <p style={{ color: 'red', marginBottom: '10px' }}>{errors.program}</p>}
    {errors.course_code && <p style={{ color: 'red', marginBottom: '10px' }}>{errors.course_code}</p>}
    {errors.course_name && <p style={{ color: 'red', marginBottom: '10px' }}>{errors.course_name}</p>}
    {errors.units && <p style={{ color: 'red', marginBottom: '10px' }}>{errors.units}</p>}
    {errors.yearLevel && <p style={{ color: 'red', marginBottom: '10px' }}>{errors.yearLevel}</p>}
    {errors.duration && <p style={{ color: 'red', marginBottom: '10px' }}>{errors.duration}</p>}
    {errors.ftf && <p style={{ color: 'red', marginBottom: '10px' }}>{errors.ftf}</p>}
    {errors.lab && <p style={{ color: 'red', marginBottom: '10px' }}>{errors.lab}</p>}
    {errors.online && <p style={{ color: 'red', marginBottom: '10px' }}>{errors.online}</p>}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="primary" onClick={() => setShowAlert(false)}>
      OK
    </Button>
  </Modal.Footer>
</Modal>


<Modal show={showSuccessAlert} onHide={() => setShowSuccessAlert(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Success</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>Course successfully added!</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="primary" onClick={() => setShowSuccessAlert(false)}>
      OK
    </Button>
  </Modal.Footer>
</Modal>

    </div>
  );
};

export default AddCourse;
