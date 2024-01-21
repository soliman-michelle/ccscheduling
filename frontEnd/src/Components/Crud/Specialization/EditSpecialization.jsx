import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const EditSpecialization = ({ show, handleClose, selectedSpecialization, onEdit }) => {
  const [editedSpecialization, setEditedSpecialization] = useState({});

  // Populate the initial state when 'selectedSpecialization' changes
  useEffect(() => {
    setEditedSpecialization(selectedSpecialization);
  }, [selectedSpecialization]);
  

  const [userData, setUserData] = useState([]);
  const [courseData, setCourseData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get('http://localhost:8081/user');
        setUserData(userResponse.data);

        const courseResponse = await axios.get('http://localhost:8081/course');
        setCourseData(courseResponse.data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const toggleModal = () => {
    handleClose();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await onEdit(selectedSpecialization.id, editedSpecialization);
      toggleModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Modal show={show} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Specialization</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                list="name-suggestions"
                type="text"
                placeholder="Select or type a name"
                value={editedSpecialization.name}
                onChange={(e) =>
                  setEditedSpecialization({
                    ...editedSpecialization,
                    name: e.target.value,
                  })
                }
              />
              <datalist id="name-suggestions">
                {userData.map((user) => (
                  <option key={user.id} value={user.firstName + ' ' + user.lastName} />
                ))}
              </datalist>
            </Form.Group>

            <Form.Group controlId="course">
              <Form.Label>Course</Form.Label>
              <Form.Control
                list="course-suggestions"
                type="text"
                placeholder="Select or type a course"
                value={editedSpecialization.course}
                onChange={(e) =>
                  setEditedSpecialization({
                    ...editedSpecialization,
                    course: e.target.value,
                  })
                }
              />
              <datalist id="course-suggestions">
                {courseData.map((courses) => (
                  <option key={courses.id} value={courses.course_code + ' ' + courses.course_name} />
                ))}
              </datalist>
            </Form.Group>
            <Button variant="secondary" onClick={toggleModal}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EditSpecialization;
