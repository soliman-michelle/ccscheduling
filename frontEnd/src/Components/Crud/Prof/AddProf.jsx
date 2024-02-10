import { useState, useEffect } from 'react';
import { Modal, Form, Button, FormControl } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AddProf = ({ show, handleClose, handleAdd }) => {
  const [fname, setFname] = useState('');
  const [mname, setMname] = useState('');
  const [lname, setLname] = useState('');
  const [role, setRole] = useState('');
  const [roleData, setRoleData] = useState([]);
  const [specialization, setSpecialization] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [slot, setSlot] = useState('');
  const [isProfNameValid, setIsProfNameValid] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courseFields, setCourseFields] = useState([{ specialization: '', duration: '', slot: '' }]);
  const [maxPrep, setMaxPrep] = useState('');
  const [availableTime, setAvailableTime] = useState('');
  const [courseDurations, setCourseDurations] = useState({});

  useEffect(() => {
    if (show) {
      setFname('');
      setMname('');
      setLname('');
      setRole('');
      setMaxPrep('');
      setAvailableTime('');
      setSlot('');
      setError('');
      setShowAlert(false);
      setIsProfNameValid(true);
    }
  }, [show]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:8081/profs/roles');
        setRoleData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRoles();
  }, []);

  const fetchAllSpecializations = async () => {
    try {
      const response = await axios.get('http://localhost:8081/specialization/courses');
      setSpecialization(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRoleChange = async (selectedRoleId) => {
    setRole(selectedRoleId);
    setSelectedSpecialization(''); 
    setSelectedCourses([]); // Reset selected courses
    
    // Clear course fields
    setCourseFields([{ specialization: '', duration: '', slot: '' }]);
    
    try {
      const response = await axios.get(`http://localhost:8081/profs/roles/${selectedRoleId}`);
      const roleData = response.data;
      
      if (roleData.length > 0) { // Ensure that the response contains data
        console.log("max_prep: ", roleData[0].max_prep);
        setMaxPrep(roleData[0].max_prep);
        setAvailableTime(roleData[0].max_hour);
      }
    } catch (error) {
      console.error(error);
    }
  
    if (selectedRoleId === "1") {
      try {
        const response = await axios.get('http://localhost:8081/specialization/courses');
        const res = response.data;
        const filteredCourses = res.filter(course => course.duration <= 3);
        setSpecialization(filteredCourses);
      } catch (error) {
        console.error(error);
      }
    } else {
      fetchAllSpecializations();
    }
  };
  

  const handleCourseChange = (courseId) => {
    const selectedCourse = specialization.find(course => parseInt(course.course_id) === parseInt(courseId));
  
    console.log("Selected Course:", selectedCourse);
  
    if (selectedCourse) {
      const newCourseDurations = { ...courseDurations };
      newCourseDurations[courseId] = selectedCourse.duration;
      setCourseDurations(newCourseDurations); // Update courseDurations state with the new duration
      
      const newFields = courseFields.map(field => {
        const specializationId = parseInt(field.specialization);
        if (specializationId === parseInt(courseId)) {
          return { ...field, duration: selectedCourse.duration };
        }
        return field;
      });
  
      console.log("New Fields:", newFields);
  
      setCourseFields(newFields);
    }
  };
  
  
  const handleFormSubmit = async () => {
    if (!fname || !lname || !mname || !role || !specialization || !slot) {
      setError('All fields are required.');
      setShowAlert(true);
      return;
    }
  
    if (fname.length < 3 || lname.length < 3 || mname.length < 3) {
      setError('Name length must be greater than 2.');
      setShowAlert(true);
      return;
    }
  
    if (!/^[a-zA-Z\s,[@-]+$/.test(fname) || !/^[a-zA-Z\s,[@-]+$/.test(mname) || !/^[a-zA-Z\s,[@-]+$/.test(lname)) {
      setError('Name can only contain \',\' , \'-\' and \'@\' special characters.');
      setShowAlert(true);
      return;
    }
  
    const userData = {
      fname,
      mname,
      lname,
      role,
      specialization,
      slot,
    };
  
    try {
      const response = await axios.get(`http://localhost:8081/profs/check/${fname}/${lname}`);
      if (response.data.exists) {
        setIsProfNameValid(false);
      } else {
        await axios.post("http://localhost:8081/profs/create", userData);
        handleAdd(userData);
        handleClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCourse = async () => {
    let courseId = '';
    let newFields = [...courseFields];
  
    if (role === "1") {
      try {
        const response = await axios.get('http://localhost:8081/specialization/courses');
        const res = response.data;
        const filteredCourses = res.filter(course => course.duration <= 3);
        setSpecialization(filteredCourses);
        courseId = filteredCourses.length > 0 ? filteredCourses[0].course_id : '';
      } catch (error) {
        console.error(error);
      }
    } else {
      await fetchAllSpecializations();
      courseId = specialization.length > 0 ? specialization[0].course_id : '';
    }
  
    // Update duration for existing fields
    newFields.forEach(field => {
      const selectedCourse = specialization.find(course => parseInt(course.course_id) === parseInt(field.specialization));
      if (selectedCourse) {
        field.duration = selectedCourse.duration;
      }
    });
  
    // Add new field for the selected course
    newFields.push({ specialization: courseId, duration: '', slot: '' });
  
    // Update state with the modified fields array
    setCourseFields(newFields);
  };
  
  
  return (
    <div>
      <Button variant="primary" onClick={handleClose}>
        <FontAwesomeIcon icon={faPlus} /> Add Prof
      </Button>
      <Modal show={show} onHide={handleClose} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Add Prof</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form encType="multipart/form-data">
            <div className="row">
              <div className="col-md-4">
                <Form.Group controlId="fname">
                <label htmlFor="fname">First name</label>
                  <Form.Control
                    type="text"
                    placeholder="Enter First Name"
                    value={fname}
                    className={`mt-2 ${isProfNameValid ? '' : 'is-invalid'}`}
                    onChange={(e) => setFname(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    This Professor name already exists.
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group controlId="mname">
                <label htmlFor="mname">Middle name</label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Middle Name"
                    value={mname}
                    className='mt-2'
                    onChange={(e) => setMname(e.target.value)}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group controlId="lname">
                <label htmlFor="lname">Last name</label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Last Name"
                    value={lname}
                    className='mt-2'
                    onChange={(e) => setLname(e.target.value)}
                    required
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
              <label htmlFor="role">Role</label>
                <Form.Control 
                  as="select" 
                  value={role} 
                  onChange={(e) => handleRoleChange(e.target.value)} 
                  className='mt-2'>
                  <option value="">Select Role</option>
                  {roleData.map((role) => (
                    <option key={role.role_id} value={role.role_id}>
                      {role.role}
                    </option>
                  ))}
                </Form.Control>
              </div>
            <div className="col-md-4">
              <label htmlFor="maxPrep">Max Prep:</label>
              <FormControl
                id="maxPrep"
                type="text"
                value={maxPrep}
                readOnly
                className="mt-2 form-control"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="availableTime">Available Time:</label>
              <FormControl
                id="availableTime"
                type="text"
                value={availableTime}
                readOnly
                className="mt-2 form-control"
              />
            </div>

            </div>
            <div>
              {courseFields.map((field, index) => (
                <div className="row" key={index}>
                <div className="col-md-8">
                <Form.Control 
                    as="select" 
                    value={field.specialization} 
                    onChange={(e) => {
                      const courseId = e.target.value;
                      handleCourseChange(courseId); // Call handleCourseChange when a course is selected
                      const newFields = [...courseFields];
                      newFields[index].specialization = courseId;
                      setCourseFields(newFields);
                    }} 
                    className='mt-2'
                  >
                    <option value="">Select Specialization</option>
                    {specialization
                      .filter(course => !selectedCourses.includes(course.course_id)) // Filter out selected courses
                      .map((course) => (
                        <option key={course.course_id} value={course.course_id}>
                          {course.course_code} {course.course_name}
                        </option>
                    ))}
                  </Form.Control>

                </div>
                <div className="col-md-2">
                <Form.Control
                type="number"
                placeholder="Duration"
                value={courseDurations[field.specialization]} // Update to use the individual duration from courseDurations state
                className="mt-2"
                readOnly
              />
          </div>
                <div className="col-md-2">
                    <Form.Control
                        type="number"
                        placeholder="Enter # Block"
                        value={field.slot}
                        className='mt-2'
                        onChange={(e) => {
                            const newFields = [...courseFields];
                            newFields[index].slot = e.target.value;
                            setCourseFields(newFields);
                        }}
                        required
                    />
                </div>
                
            </div>
              ))}
            </div>
            <Button variant="secondary" onClick={handleAddCourse} className='mt-2'>
              <FontAwesomeIcon icon={faPlus} /> Add Course
            </Button>
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
      <Modal show={showAlert} onHide={() => setShowAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Invalid</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowAlert(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddProf;
