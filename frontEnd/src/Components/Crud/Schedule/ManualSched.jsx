import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DeleteSummer from "./Delete";
import EditSummer from "./EditSummer";

const ManualSched = () => {
    const [showModal, setShowModal] = useState(false);
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(""); 
    const [selectedProfId, setSelectedProfId] = useState(""); 
    const [professors, setProfessors] = useState([]);
    const [slot, setSlot] = useState(1); 
    const [rooms, setRooms] = useState([]);
    const [summer, setSummer] = useState([]);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);
    const [isFilterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('Professor');
    const [showEditCourseModal, setShowEditCourseModal] = useState(false);
    const [selectedSummer, setSelectedSummer] = useState([]);
    const openModal = () => {
        setShowModal(true);
    };
    const toggleFilterDropdown = () => {
      setFilterDropdownOpen(!isFilterDropdownOpen);
    };
    const toggleEditSummerModal = (summer) => {
      setSelectedCourseId(summer);
      setShowEditCourseModal(true);

    };
    const handleFilter = (filter) => {
      setSelectedFilter(filter);
      toggleFilterDropdown();
    };
    const toggleModalDelete = () => {
      setShowModalDelete(!showModalDelete);
    };
  
  
    const closeModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('https://ccsched.onrender.com/manual/courses');
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses: ', error);
            }
        };

        fetchCourses();
    }, []);

    const fetchSummer = async () => {
      try {
          const response = await axios.get('https://ccsched.onrender.com/manual/display');
          setSummer(response.data);
      } catch (error) {
          console.error('Error fetching courses: ', error);
      }
  };

  useEffect(() => {``
    fetchSummer();
}, []);

    useEffect(() => {
        if (selectedCourseId) {
            const fetchProf = async () => {
                try {
                    const response = await axios.get(`https://ccsched.onrender.com/manual/professors/${selectedCourseId}`);
                    setProfessors(response.data);
                } catch (error) {
                    console.error('Error fetching courses: ', error);
                }
            };

            fetchProf();
        }
    }, [selectedCourseId]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get('https://ccsched.onrender.com/manual/room');
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching professors: ', error);
            }
        };

        fetchRooms();
    }, []);

    const handleEditSummer = async (professor, courses, updatedSummerData) => {
      try {
        const response = await axios.put(`https://ccsched.onrender.com/course/${professor}/${courses}/update`, updatedSummerData);
        console.log('Response:', response.data); // Log the response
        fetchSummer(); // Refresh data after updating
      } catch (error) {
        console.error('Error:', error); // Check the error if there is one
      }
    };

    const handleDeleteSummer = async (id) => { // Corrected parameter name from blockId to summer_id
      try {
        await axios.delete(`https://ccsched.onrender.com/manual/${id}/delete`); // Adjusted URL to match the backend route
    
        setSummer((prevblock) => prevblock.filter((summer) => summer.id !== id));

        setShowDeleteSuccessAlert(true);
        setTimeout(() => {
          setShowDeleteSuccessAlert(false);
        }, 8000); // Hide alert after 8 seconds
      } catch (error) {
        console.error(`Error deleting summer class with ID ${id}:`, error);
      }
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const summer = {
        course: selectedCourseId,
        professor: selectedProfId, 
        slot,
      };
    
      try {
        const responseExistenceCheck = await axios.get(`https://ccsched.onrender.com/manual/check/${selectedProfId}/${selectedCourseId}`);
        
        if (responseExistenceCheck.data.exists) {
          console.log("Summer class already exists:", responseExistenceCheck.data);
        } else {
          const responseAddSummer = await axios.post('https://ccsched.onrender.com/manual/create', summer);
          console.log("Summer class added:", responseAddSummer.data);
          closeModal();
          fetchSummer();
          setSelectedCourseId("");
          setSelectedProfId("");
          setSlot(1);
        }
      } catch (error) {
        console.error('Error inserting data into the database: ', error);
      }
    };
    
  
  return (
      <div>
        <Button variant="primary" onClick={openModal}>+ Summer Class</Button>
        
        <Modal show={showModal} onHide={closeModal}>
  <Modal.Header closeButton>
    <Modal.Title>Add Summer Class</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="card card-body mb-3 animated fadeInUp">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="course">
          <Form.Label>Select Course</Form.Label>
          <Form.Control as="select" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
            <option value="">Select Course</option>
            {courses && courses.length > 0 ? (
              courses.map((course, index) => (
                <option key={index} value={course.course_id}>
                  {course.course_code} - {course.course_name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                {courses.length === 0 ? 'Loading courses...' : 'No courses available'}
              </option>
            )}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="professor">
          <Form.Label>Select Professor</Form.Label>
          <Form.Control as="select" value={selectedProfId} onChange={(e) => setSelectedProfId(e.target.value)}>
            <option value="">Select Professor</option>
            {professors.map((professor, index) => (
              <option key={index} value={professor.User_id}>
                {professor.fname} {professor.lname}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="slot">
          <Form.Label>Slot</Form.Label>
          <Form.Control type="number" value={slot} onChange={(e) => setSlot(parseInt(e.target.value))} min={1} max={3} />
        </Form.Group>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
          <Button variant="primary" type="submit">Add</Button>
        </Modal.Footer>
      </Form>
    </div>
  </Modal.Body>
</Modal>

    
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Professor</th>
                <th>Slot</th>
              </tr>
            </thead>
            <tbody>
              {summer.map((item, index) => (
                <tr key={index}>
                  <td>{item.course_code}</td>
                  <td>{item.course_name}</td>
                  <td>{item.fname} {item.lname}</td>
                  <td>{item.slot}</td>
                  <td>
                    <button
                      onClick={() => toggleEditSummerModal(item)}
                      className="btn btn-primary"
                    >
                      <FontAwesomeIcon icon={faPen}/>
                    </button>
                    <DeleteSummer
                      key={item.id} // Assign a unique key here
                      handleClose={() => toggleModalDelete(index)} // Pass index to identify which modal to close
                      handleDelete={() => handleDeleteSummer(item.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      {showEditCourseModal && (
        <EditSummer
            show={showEditCourseModal}
            handleClose={() => setShowEditCourseModal(false)}
            selectedSummer={selectedSummer || {}} // Change selectedCourse to selectedSummer
            onEdit={handleEditSummer}
        />
    )}
  </div>
    );
}   

export default ManualSched;