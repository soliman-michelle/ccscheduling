import { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AddSpecialization = ({ show, handleClose, handleAdd, userRole }) => {
  const [name, setName] = useState('');
  const [userData, setUserData] = useState([]);
  const [course, setCourse] = useState('');
  const [courseData, setCourseData] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [error, setError] = useState('');
  const [showSpecializationExistsAlert, setShowSpecializationExistsAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // State for success alert
  const [total,setTotal] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get('http://localhost:8081/specialization/users');
        const formattedUserData = userResponse.data.map((user) => ({
          User_id: user.User_id,
          firstName: user.fname,
          lastName: user.lname,
          role: user.role,
        }));
        console.log("Special: ", + formattedUserData);
        setUserData(formattedUserData);
        const courseResponse = await axios.get('http://localhost:8081/specialization/courses', {
          params: {
            userRole: formattedUserData.find((user) => user.firstName + ' ' + user.lastName === name)?.role,
          },
        });

        const transformedCourseData = courseResponse.data.map((course) => ({
          course_id: course.course_id, // Use 'course_id' as 'id'
          course_code: course.course_code,
          course_name: course.course_name,
        }));
        setCourseData(transformedCourseData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [name]);

  useEffect(() => {
    if (show) {
      setName('');
      setCourse('');
      setTotal(1);
      setSelectedUserId('');
      setSelectedCourseId('');
    }
  }, [show]);
  
  useEffect(() => {
    const fetchAssignedCourses = async () => {
      try {
        const assignedCoursesResponse = await axios.get(`http://localhost:8081/specialization/assign/${selectedUserId}`);
        const assignedCoursesIds = assignedCoursesResponse.data.map((course) => course.course_id);
        const filteredCourses = courseData.filter((course) => !assignedCoursesIds.includes(course.course_id));
        setCourseData(filteredCourses);
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedUserId) {
      fetchAssignedCourses();
    }
  }, [selectedUserId]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name || !course || !total) {
      setError('All fields are required.');
      setShowErrorAlert(true);
      return;
    }
    console.log('Name:', name);
    console.log(`Selected User ID: ${selectedUserId}`);
    console.log(`Selected Course ID: ${selectedCourseId}`);
    if (selectedUserId && selectedCourseId) {
      console.log('Submitting:', selectedUserId, selectedCourseId);

      const newSpecialization = {
        User_id: selectedUserId,
        course_id: selectedCourseId,
      };

      try {
        console.log('newSpecialization:', newSpecialization);
        await axios.post('http://localhost:8081/specialization/create', newSpecialization);
        handleAdd(newSpecialization);
        handleClose();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Invalid User ID or Course ID');
    }
  };

  const filteredCourseSuggestions = userRole === 1
    ? courseData.filter((course) => course.duration <= 3)
    : courseData;

  const handleNameChange = (e) => {
    const selectedName = e.target.value;
    setName(selectedName);

    // Find the corresponding User ID based on selected name and update selectedUserId
    const user = userData.find((user) => user.firstName + ' ' + user.lastName === selectedName);
    if (user) {
      setSelectedUserId(user.User_id);
    } else {
      setSelectedUserId(''); // Handle the case when no matching user is found
    }
  };

  const handleCourseChange = (e) => {
    const selectedCourse = e.target.value;
    setCourse(selectedCourse);

    // Find the corresponding Course ID based on selected course and update selectedCourseId
    const course = filteredCourseSuggestions.find((c) => c.course_code + ' ' + c.course_name === selectedCourse);
    if (course) {
      setSelectedCourseId(course.course_id);
    } else {
      setSelectedCourseId(''); // Handle the case when no matching course is found
    }
  };

  return (
    <div>
      <Button variant="primary" onClick={handleClose}>
        <FontAwesomeIcon icon={faPlus} /> Add Specialization
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Specialization</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              as="select"
              value={name}
              onChange={handleNameChange}
            >
              <option value="">Select or type a name</option>
              {userData.map((user, index) => (
                <option
                  key={index}
                  value={user.firstName + ' ' + user.lastName}
                >
                  {user.firstName + ' ' + user.lastName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="course">
            <Form.Label>Course</Form.Label>
            <Form.Control
              as="select"
              value={course}
              onChange={handleCourseChange}
            >
              <option value="">Select or type a course</option>
              {filteredCourseSuggestions.map((course, index) => (
                <option
                  key={index}
                  value={course.course_code + ' ' + course.course_name}
                >
                  {course.course_code + ' ' + course.course_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="total">
          <Form.Label>Slot</Form.Label>
              <Form.Control
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
              />
            </Form.Group>

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

        {/* Alert dialog for Room existed */}
        <Modal show={showSpecializationExistsAlert} onHide={() => setShowSpecializationExistsAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Duplicate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The Specialization <strong>{course}</strong>  <strong>{name}</strong> already exists.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSpecializationExistsAlert(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>


        {/* All errors */}
      <Modal show={showErrorAlert} onHide={() => setShowErrorAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Invalid</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowErrorAlert(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

       {/* Success alert for successfully added room */}
       <Modal show={showSuccessAlert} onHide={() => setShowSuccessAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Room successfully added!</p>
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

export default AddSpecialization;
