import { useState, useEffect } from 'react';
import { Modal, Form, Button, FormControl } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
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
  const [maxPrep, setMaxPrep] = useState(0);
  const [availableTime, setAvailableTime] = useState(0);
  const [courseDurations, setCourseDurations] = useState({});
  const [block, setBlock] = useState('');
  const [courses, setCourses] = useState([]); // Define setCourses state setter function
  const [showCourseFields, setShowCourseFields] = useState(false); // State to track whether to show course fields or not

  useEffect(() => {
    if (show) {
      setFname('');
      setMname('');
      setLname('');
      setRole('');
      setMaxPrep('');
      setAvailableTime('');
      setCourseDurations('');
      setSlot('');
      setError('');
      setShowAlert(false);
      setIsProfNameValid(true);
      setCourseFields([]);
    }
  }, [show]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('https://ccsched.onrender.com/profs/roles');
        setRoleData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRoles();
  }, []);

  const fetchAllSpecializations = async () => {
    try {
      const response = await axios.get('https://ccsched.onrender.com/specialization/courses');
      setSpecialization(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveCourseField = (indexToRemove) => {
    setMaxPrep(prevMaxPrep => prevMaxPrep + 1);
    const newCourseFields = courseFields.filter((_, index) => index !== indexToRemove);
    setCourseFields(newCourseFields);
  };
  
  
  const handleRoleChange = async (selectedRoleId) => {
    setRole(selectedRoleId);
    setSelectedSpecialization(''); 
    setSelectedCourses([]); // Reset selected courses
    
    // Clear course fields
    setCourseFields([{ specialization: '', duration: '', slot: '' }]);
    
    try {
      const response = await axios.get(`https://ccsched.onrender.com/profs/roles/${selectedRoleId}`);
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
        const response = await axios.get('https://ccsched.onrender.com/specialization/courses');
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

  const calculateAvailableTime = () => {
    let totalBlockDuration = 0;
    courseFields.forEach((field) => {
      const duration = parseInt(field.duration);
      const slot = parseInt(field.slot);
      if (!isNaN(duration) && !isNaN(slot)) {
        totalBlockDuration += duration * slot;
      }
    });
    return availableTime - totalBlockDuration;
  };

  const handleCourseChange = async (courseId) => {
    // Check if the course is already selected
    if (selectedCourses.includes(courseId)) {
      // If already selected, remove it from the selected courses list
      const updatedSelectedCourses = selectedCourses.filter(course => course !== courseId);
      setSelectedCourses(updatedSelectedCourses);
    }
  
    const selectedCourse = specialization.find(course => parseInt(course.course_id) === parseInt(courseId));
    
    if (selectedCourse) {
      const newCourseDurations = { ...courseDurations };
      newCourseDurations[courseId] = selectedCourse.duration;
      setCourseDurations(newCourseDurations); // Update courseDurations state with the new duration
  
      try {
        const response = await axios.get(`https://ccsched.onrender.com/specialization/block/${courseId}`);
        const totalBlocks = response.data[0].available_blocks;
        console.log("Response Data:", response.data);
        console.log("totalBlocks: ", totalBlocks);
        setBlock(totalBlocks); // Update the total blocks state
      } catch (error) {
        console.error(error);
        // Handle error if needed
      }
      
      // Update courseFields with the new duration for the selected course
      const newFields = courseFields.map(field => {
        const specializationId = parseInt(field.specialization);
        if (specializationId === parseInt(courseId)) {
          return { ...field, duration: selectedCourse.duration };
        }
        return field;
      });
  
      setCourseFields(newFields); // Set the updated courseFields state
    }
  };
  
  
  const handleFormSubmit = async () => {
    // Check if all required fields are filled
    if (!fname || !lname || !mname || !role || selectedCourses.length === 0) {
      setError('All fields are required.');
      setShowAlert(true);
      return;
    }
  
    // Check if names have minimum length and contain valid characters
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
  
    // Construct userData object
    const userData = {
      fname,
      mname,
      lname,
      role,
      courses: courseFields.map(({ specialization, slot }) => ({ courseId: specialization, slot })),
    };
  
    console.log("userData:", userData); // Log userData object
  
    try {
      // Send a POST request to the backend to check if the professor already exists
      const response = await axios.get(`https://ccsched.onrender.com/profs/check/${fname}/${lname}`);
      if (response.data.exists) {
        setIsProfNameValid(false);
        return; // Exit function if professor already exists
      }
  
      // If professor doesn't exist, send a POST request to add the professor and associated courses
      await axios.post("https://ccsched.onrender.com/profs/create", userData);
      handleAdd(userData); // Update UI with newly added professor
      setFname('');
      setMname('');
      setLname('');
      setRole('');
      setSelectedSpecialization('');
      setSlot('');
      setCourseFields([{ specialization: '', duration: '', slot: '' }]);
      setMaxPrep(0);
      setAvailableTime(0);
      setBlock('');
      setSelectedCourses([]);
      setCourseFields([]);
      setCourses([]);
      setCourseDurations({});
      handleClose(); // Close the modal
    } catch (error) {
      console.error(error);
    }
  };
  
  // Function to handle adding a new course field
const handleAddCourse = async () => {
  // Decrement maxPrep by 1
  setMaxPrep(prevMaxPrep => prevMaxPrep - 1);
  setShowCourseFields(true); // Toggle the course fields display

  if (showCourseFields) {
    setSelectedCourses([]);
    setAvailableTime(availableTime + calculateAvailableTime());
  }

  let courseId = '';
  let newFields = [...courseFields];

  if (role === "1") {
    try {
      const response = await axios.get('https://ccsched.onrender.com/specialization/courses');
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
  newFields.push({ specialization: courseId, duration: '', slot: '' }); // Preserve the default option for course selection

  // Update state with the modified fields array
  setCourseFields(newFields);

  // Recalculate availableTime (without subtracting the duration of the newly added course)
  setAvailableTime(availableTime);

  // Add selected courseId to the array
  setSelectedCourses(prevSelectedCourses => [
    ...prevSelectedCourses,
    courseId
  ]);

  // Update the 'courses' state directly
  setCourses(prevCourses => [
    ...prevCourses,
    {
      courseId: courseId,
      slot: courseFields[courseFields.length - 1].slot // Assuming the newly added course is at the end of the courseFields array
    }
  ]);
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
              <label htmlFor="maxPrep">Available Prep:</label>
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
                value={calculateAvailableTime()}
                readOnly
                className="mt-2 form-control"
              />
            </div>

            </div>
            {showCourseFields && (
  <div>
    {courseFields.map((field, index) => (
      <div key={index}>
        <div className="row">
          <div className="col-md-7">
            <Form.Control 
              as="select" 
              value={field.specialization} 
              onChange={(e) => {
                const courseId = e.target.value;
                handleCourseChange(courseId);
                const newFields = [...courseFields];
                newFields[index].specialization = courseId;
                setCourseFields(newFields);
              }} 
              className='mt-2'
            >
              <option value="">Select Course</option>
              {specialization
                .filter(course => !selectedCourses.includes(course.course_id))
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
              value={field.duration}
              className="mt-2"
              readOnly
            />
          </div>
          <div className="col-md-2">
            <Form.Control
              type="number"
              placeholder="Enter Block"
              value={field.slot}
              className='mt-2'
              onChange={(e) => {
                // Parse the entered value as an integer
                const enteredValue = parseInt(e.target.value);
                // Check if the entered value exceeds the maximum allowed value
                if (enteredValue > block) {
                  // If the entered value is greater than the maximum allowed value,
                  // set the input field value to the maximum allowed value
                  const newFields = [...courseFields];
                  newFields[index].slot = block.toString();
                  setCourseFields(newFields);
                } else {
                  // If the entered value is within the allowed range, update the state normally
                  const newFields = [...courseFields];
                  newFields[index].slot = e.target.value;
                  setCourseFields(newFields);
                }
              }}
              required
              max={block}
            />
          </div>
          <div className="col-md-1">
            <FontAwesomeIcon
              icon={faTimes}
              style={{ color: 'red', marginLeft: '5px', cursor: 'pointer' }}
              className='mt-3'
              onClick={() => handleRemoveCourseField(index)} // Call the removal function with the index
            />
          </div>
        </div>
      </div>
    ))}
  </div>
)}
 <div className="row mt-4">
          <div className="col-md-12">
            <i>Note: The total number of blocks based on selected courses is {block}.</i>
          </div>
        </div>
          <Button
          variant="secondary"
          onClick={handleAddCourse}
          className="mt-2"
          disabled={availableTime <= 2 || maxPrep <= 1}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Class
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
