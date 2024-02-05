  import { useEffect, useState } from "react";
  import 'bootstrap/dist/css/bootstrap.css';
  import { Button, Modal, Form } from 'react-bootstrap';
  import axios from 'axios';
  import { faPen } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import DeleteSummer from "./Delete";
  import Dropdown from 'react-bootstrap/Dropdown';
  import { FaCaretDown } from 'react-icons/fa';
  import SummerGenetic from "./SummerGenetic";

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
      const [showSummerGenetic, setShowSummerGenetic] = useState(false);
      const [showTable, setShowTable] = useState(true); // State to control table visibility

      const openModal = () => {
          setShowModal(true);
      };
      const toggleFilterDropdown = () => {
        setFilterDropdownOpen(!isFilterDropdownOpen);
      };
      const toggleEditSummerModal = (summer) => {
        setSelectedCourseId(summer);
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
                  const response = await axios.get('http://localhost:8081/manual/courses');
                  setCourses(response.data);
              } catch (error) {
                  console.error('Error fetching courses: ', error);
              }
          };

          fetchCourses();
      }, []);

      const fetchSummer = async () => {
        try {
            const response = await axios.get('http://localhost:8081/manual/display');
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
                      const response = await axios.get(`http://localhost:8081/manual/professors/${selectedCourseId}`);
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
                  const response = await axios.get('http://localhost:8081/manual/room');
                  setRooms(response.data);
              } catch (error) {
                  console.error('Error fetching professors: ', error);
              }
          };

          fetchRooms();
      }, []);

      const handleDeleteSummer = async (blockId) => {
        try {
          await axios.delete(`http://localhost:8081/block/${blockId}/delete`);
    
            setShowDeleteSuccessAlert(true);
            setTimeout(() => {
              setShowDeleteSuccessAlert(false);
            }, 8000); // Hide alert after 3 seconds
        } catch (error) {
          console.error(`Error deleting block with ID ${blockId}:`, error);
        }
      };

      const handleGenerateSummerClasses = async () => {
        try {
            
            setShowSummerGenetic(true);
            setShowTable(false); // Hide the table
            console.log("Clicked on Generate Summer Classes button");
        } catch (error) {
            console.error('Error generating summer classes: ', error);
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
            const response = await axios.post('http://localhost:8081/manual/create', summer);
            console.log("Summer: ", response.data);
            closeModal();
            fetchSummer();
            // Resetting the fields to default values
          setSelectedCourseId("");
          setSelectedProfId("");
          setSlot(1);
        } catch (error) {
            console.error('Error inserting data into the database: ', error);
        }
    };
    
      return (
          <div>
              <Button variant="primary" onClick={openModal}>+ Summer Class</Button>
              <Button variant="danger" onClick={openModal}>Reset</Button>
              
              <Dropdown show={isFilterDropdownOpen} onToggle={toggleFilterDropdown}>
                <Dropdown.Toggle id="dropdown-filter" className="custom-dropdown-toggle float-right mt-2">
                  <span style={{ color: 'black' }}>{selectedFilter} <FaCaretDown /></span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleFilter('Professor')}>Professor</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleFilter('Room')}>Room</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Modal show={showModal} onHide={closeModal}>
                  <Modal.Header closeButton>
                      <Modal.Title>Add Summer Class</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <div className="card card-body mb-3 animated fadeInUp">
                          <Form>
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
                          </Form>
                      </div>
                  </Modal.Body>
                  <Modal.Footer>
                      <Button variant="secondary" onClick={closeModal}>Close</Button>
                      <Button variant="primary" onClick={handleSubmit}>Add</Button>
                  </Modal.Footer>
              </Modal>

              {showTable && ( // Render the table only if showTable is true
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
                        show={showModalDelete}
                        handleClose={toggleModalDelete}
                        handleDelete={() => handleDeleteSummer(item.id)}
                      />
                    </td>
                  </tr>
                        ))}
                          <tr>
                        <td colSpan="4" className="text-center">
                            <Button variant="success" onClick={handleGenerateSummerClasses}>
                                Generate Summer Classes
                            </Button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            )}
                            {showSummerGenetic && <SummerGenetic />}

        </div>
      );
  };

  export default ManualSched;