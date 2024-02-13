import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Modal, Form, Button } from 'react-bootstrap';
import '../../../index.css';
import axios from 'axios';

const EditCourse = ({ show, handleClose, selectedCourse, onEdit }) => {
  const [editedCourse, setEditedCourse] = useState(selectedCourse);
  const [yearLevel, setYearLevel] = useState('');
  const [programs, setPrograms] = useState([]); // Define programs state
  const [selectedPrograms, setSelectedPrograms] = useState([]); // Define selectedPrograms state
  const [block, setBlock] = useState('');

  const handleCheckboxChange = (event) => {
    const { checked, value } = event.target;
    let updatedSelectedPrograms = [...editedCourse.selectedPrograms];

    if (checked && !updatedSelectedPrograms.includes(value)) {
      updatedSelectedPrograms.push(value);
    } else {
      updatedSelectedPrograms = updatedSelectedPrograms.filter(item => item !== value);
    }

    setEditedCourse({ ...editedCourse, selectedPrograms: updatedSelectedPrograms });
  };
  const handleDurationChange = (e) => {
    const newDuration = e.target.value;
  
    // Create a new object with the updated duration and computed ftf, online, and lab values
    let updatedCourse = {
      ...editedCourse,
      duration: newDuration,
    };
  
    if (newDuration === '5') {
      updatedCourse = {
        ...updatedCourse,
        ftf: '2',
        online: '1',
        lab: '2',
      };
    } else if (newDuration === '3') {
      updatedCourse = {
        ...updatedCourse,
        ftf: '1',
        online: '2',
        lab: '0',
      };
    }
  
    // Update the state with the new course object
    setEditedCourse(updatedCourse);
  };
  
  useEffect(() => {
    // Fetch program and year level for the selected course
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/course/year/${editedCourse.course_id}`);
        const data = response.data; // Assuming you're getting a single result
        console.log('Fetched Data:', data);
        console.log('Structure of First Item:', data[0]); // Check structure of the first item
        console.log('Year Level of First Item:', data[0].year_level);
        setPrograms(data);
        setYearLevel(data[0].year_level);

        } catch (error) {
          console.error('Error fetching course details:', error);
          // Handle error scenarios or display error messages
        }
      };

    fetchCourseDetails();
  }, [editedCourse.course_id]);

  const toggleModal = () => {
    handleClose();
  };

  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const editedCourseWithProgram = {
        ...editedCourse,
        program: programs, // Include the program in the editedCourse
      };
  
      // Make a PUT request to update the course
      await axios.put(`http://localhost:8081/course/update/${editedCourseWithProgram.course_id}`, {
        course_code: editedCourseWithProgram.course_code,
        course_name: editedCourseWithProgram.course_name,
        units: editedCourseWithProgram.units,
        program: editedCourseWithProgram.programs,
        yearLevel: editedCourseWithProgram.yearLevel,
        sem: editedCourseWithProgram.sem,
        duration: editedCourseWithProgram.duration,
        ftf: editedCourseWithProgram.ftf,
        online: editedCourseWithProgram.online,
        lab: editedCourseWithProgram.lab,
      });

      
      toggleModal(); // Close the modal after successful update
    } catch (error) {
      console.error('Error:', error);
      // Handle error scenarios or display error messages
    }
  };
  
  return (
    <div>
    <Modal show={show} onHide={toggleModal} size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Edit Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
          <div className='row'>
            <div className='col-md-4'>
            <Form.Group controlId="course_code">
            <Form.Label>Course code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Course Code"
              value={editedCourse.course_code}
              onChange={(e) =>
                setEditedCourse({
                  ...editedCourse,
                  course_code: e.target.value,
                })
              }
            />
          </Form.Group>
            </div>
            <div className='col-md-8'>
          <Form.Group controlId="course_name">
            <Form.Label>Course Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Course Name"
              value={editedCourse.course_name}
              onChange={(e) =>
                setEditedCourse({
                  ...editedCourse,
                  course_name: e.target.value,
                })
              }
            />
          </Form.Group>
            </div>
          </div>

          <Form.Group controlId="units">
            <Form.Label>Units</Form.Label>
            <Form.Control
              type="number"
              placeholder="units"
              value={editedCourse.units}
              onChange={(e) =>
                setEditedCourse({
                  ...editedCourse,
                  units: e.target.value,
                })
              }
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
                    checked={selectedPrograms.includes(program.program)} // Check if the program is selected
                    onChange={handleCheckboxChange} // Use handleCheckboxChange for all checkboxes
                    disabled // Make the checkbox read-only
                  />
                </div>
              ))}
            </div>
          </Form.Group>


        <Form.Control
          type="number"
          placeholder="Year Level"
          disabled
          value={yearLevel} 
        />

          <Form.Group controlId="sem">
            <Form.Label>Semester</Form.Label>
            <Form.Control
              type="number"
              placeholder="Semester"
              value={editedCourse.sem}
              onChange={(e) =>
                setEditedCourse({
                  ...editedCourse,
                  sem: e.target.value,
                })
              }
            />
          </Form.Group>
          
          <Form.Group controlId="duration">
          <Form.Label>Duration</Form.Label>
          <Form.Control
            type="number"
            placeholder="duration"
            value={editedCourse.duration}
            onChange={handleDurationChange} // Use the new handler
          />
        </Form.Group>
          <div className='row'>  
            <div className='col-md-4'>
            <Form.Group controlId="ftf">
            <Form.Label>Face to Face duration</Form.Label>
            <Form.Control
              type="number"
              placeholder="Duration for ftf"
              value={editedCourse.ftf}
              onChange={(e) =>
                setEditedCourse({
                  ...editedCourse,
                  ftf: e.target.value,
                })
              }
            />
          </Form.Group>
            </div>
            <div className='col-md-4'>
          <Form.Group controlId="online">
            <Form.Label>Online duration</Form.Label>
            <Form.Control
              type="number"
              placeholder="Duration for online"
              value={editedCourse.online}
              onChange={(e) =>
                setEditedCourse({
                  ...editedCourse,
                  online: e.target.value,
                })
              }
            />
          </Form.Group>
            </div>
            <div className='col-md-4'>
          <Form.Group controlId="lab">
            <Form.Label>Laboratory duration</Form.Label>
            <Form.Control
              type="number"
              placeholder="Duration for lab"
              value={editedCourse.lab}
              onChange={(e) =>
                setEditedCourse({
                  ...editedCourse,
                  lab: e.target.value,
                })
              }
            />
          </Form.Group>
            </div>
          </div>
          <Modal.Footer>
            <Button variant="primary" type="submit">
              Save
            </Button>
            <Button variant="secondary" onClick={toggleModal}>
              Close
            </Button>
            </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  </div>
  )
}

export default EditCourse;