import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DeleteSummer from "./Delete";
import EditSummer from "./EditSummer";
import Header from '../../Header';
import Sidebar from '../../Sidebar';

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
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = summer.slice(indexOfFirstItem, indexOfLastItem);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
    const toggleAddRoomModal = () => {
      setShowAddRoomModal(!showAddRoomModal);
    };

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

    const handleEditSummer = async (professor, courses, updatedSummerData) => {
      try {
        const response = await axios.put(`http://localhost:8081/course/${professor}/${courses}/update`, updatedSummerData);
        console.log('Response:', response.data); // Log the response
        fetchSummer(); // Refresh data after updating
      } catch (error) {
        console.error('Error:', error); // Check the error if there is one
      }
    };

    const handleDeleteSummer = async (id) => { // Corrected parameter name from blockId to summer_id
      try {
        await axios.delete(`http://localhost:8081/manual/${id}/delete`); // Adjusted URL to match the backend route
    
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
        const responseExistenceCheck = await axios.get(`http://localhost:8081/manual/check/${selectedProfId}/${selectedCourseId}`);
        
        if (responseExistenceCheck.data.exists) {
          console.log("Summer class already exists:", responseExistenceCheck.data);
        } else {
          const responseAddSummer = await axios.post('http://localhost:8081/manual/create', summer);
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

    
    
    const handlePageChange = (selected) => {
      setCurrentPage(selected.selected);
    };
  
    return (
      <div>
           <style>
        {`

@media (min-width: 768px) {
  .container{
    width:100%;
  }
}

.container header .filterEntries {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filterEntries .entries {
  color: #000000;
}

.filterEntries.entries select, .filterEntries .filter input {
  padding: 7px 10px;
  border: 1px solid #000000;
  color: #ffffff;
  background: #ffffff;
  border-radius: 5px;
  outline: none;
  transition: 0.3s;
  cursor: pointer;
}

.filterEntries .entries select{
  padding: 5px 10px;
}

.filterEntries .filter {
  display: flex;
  align-items: center;
}

.filter label {
  color:#ffffff;
  margin-right: 5px;
}

.filter input:focus{
  border-color: rgb(255, 0, 162);
}
        .custom-table th,
        .custom-table td{
          border: 4px
          solid #ffff;
        }

        @media (max-width: 768px) {
  .custom-table {
    overflow-x: auto;
    white-space: nowrap; /* Prevent line breaks */
  }
}


        .content .card{
          padding: 20px;
          padding-top: 30px;
          margin-left: 10px;
          margin-right:10px;
          margin-top: 20px;
          font-size: 14px;
          border-radius: 10px;
          background-image: url('/cover.png');
          background-size: 100%;
          background-position: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          color: #ffffff;
}
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
      <div className="h-100">
    <div className="wrapper">
    <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className = "main">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}/>
          <div className="container">


        <div className = "content">
      <div className = "card">
        <h1>SUMMER CLASS</h1>
      </div>
      </div>

      <section className="home-section pt-2">
      <div className='container-fluid'>
          <div className='row'>
          <header>
            <div className='filterEntries'>
        <Button variant="primary" onClick={openModal} className = "small-btn">+ Summer Class</Button>
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
<div className="entries">
              Show {' '}    
              <select name="" id="table_size" onChange={(e) => setItemsPerPage(parseInt(e.target.value, 10))}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              </select> entries
            </div>
            </div>
            </header>

    
            <div className="card-body">
              <div className='col-md-12 ps-2 pe-2 overflow-auto'>
              <table className='custom-table custom-table table table-striped table-hover .table-responsive mt-2'>
                <thead>
                <tr className = "table-primary border-dark">
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Professor</th>
                <th>Slot</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {summer.map((item, index) => (
                <tr key={index}>
                  <td className = "course-info">{item.course_code}</td>
                  <td className = "course-info">{item.course_name}</td>
                  <td className = "course-info">{item.fname} {item.lname}</td>
                  <td className = "course-info">{item.slot}</td>
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
                          {showEditCourseModal && (
        <EditSummer
            show={showEditCourseModal}
            handleClose={() => setShowEditCourseModal(false)}
            selectedSummer={selectedSummer || {}} // Change selectedCourse to selectedSummer
            onEdit={handleEditSummer}
        />
    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

        </div>
        </div>    
        </div>
      </section>
  </div>
  </div>
        </div>
      </div>
    </div>
    );
}   

export default ManualSched;