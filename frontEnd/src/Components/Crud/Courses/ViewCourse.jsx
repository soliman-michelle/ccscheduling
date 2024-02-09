import axios from 'axios';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ReactPaginate from 'react-paginate'; // Import ReactPaginate
import AddCourse from './AddCourse';
import EditCourse from './EditCourse';
import DeleteCourse from './DeleteCourse';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ViewCourse = () => {
  const [course, setCourse] = useState([]);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('BSIT-BA');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Number of items to display per page
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = course.slice(indexOfFirstItem, indexOfLastItem);
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);
  const [programOptions, setProgramOptions] = useState([]);

  const navigate = useNavigate(); 

  const toggleAddCourseModal = () => {
    setShowAddCourseModal(!showAddCourseModal);
  };

  const toggleEditCourseModal = (course) => {
    setSelectedCourse(course);
    setShowEditCourseModal(true);
  };
  const handleFilterButtonClick = () => {
    navigate(`/coursefilter?program=${selectedProgram}`);
  };

  const toggleModalDelete = () => {
    setShowModalDelete(!showModalDelete);
  };

  const toggleProgramModal = () => {
    setShowProgramModal(!showProgramModal);
    console.log('showProgramModal:', showProgramModal);
  };
  
  

  const handleAddcourse = (newCourse) => {
    setCourse([...course, newCourse]);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/course`);
      setCourse(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get('http://localhost:8081/course/program');
        console.log("Course: ", response.data);
        setProgramOptions(response.data);
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };

    fetchPrograms();
  }, []); 

  const handleEditCourse = async (courseCode, courseName, updatedCourseData) => {
    try {
      const response = await axios.put(`http://localhost:8081/course/${courseCode}/${courseName}/update`, updatedCourseData);
      console.log('Response:', response.data); // Log the response
      fetchData(); // Refresh data after updating
    } catch (error) {
      console.error('Error:', error); // Check the error if there is one
    }
  };
  
  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`http://localhost:8081/course/${courseId}/delete`);
      setCourse((prevCourse) => prevCourse.filter((courseItem) => courseItem.course_id !== courseId));
      setShowDeleteSuccessAlert(true);
      setTimeout(() => {
        setShowDeleteSuccessAlert(false);
      }, 8000); // Hide alert after 3 seconds
    } catch (error) {
      console.error(`Error deleting course with code ${courseId} `, error);
    }
};

const handlePageChange = (selected) => {
  setCurrentPage(selected.selected);
};


// const filterCoursesByProgram = () => {
//   const filteredCourses = course.filter((courseItem) =>
//     courseItem.program.includes(selectedProgram)
//   );
//   setCourse(filteredCourses);
// };

  return (
    <div>
     
      <section className="home-section">
          {/* Alert for successful deletion */}
     {showDeleteSuccessAlert && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Success!</strong> Course is deleted successfully!
          <button type="button" className="btn-close" onClick={() => setShowDeleteSuccessAlert(false)} aria-label="Close"></button>
        </div>
      )}
        <div className='container' style={{marginTop: '-50px'}}>
          <div className='row'>
            <Col md={10}>
              <AddCourse
                show={showAddCourseModal}
                handleClose={toggleAddCourseModal}
                handleAdd={handleAddcourse}
              />
            </Col>
            <Col md={2}>
              <Button onClick={toggleProgramModal}>View</Button>
            </Col>
            <div className='col-md-12 mt-2 '>
              <table className='table table-bordered' style={{fontSize: '16px'}}>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Course code</th>
                    <th>Course name</th>
                    <th>Units</th>
                    <th>Duration</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((courseItem, id) => (
                    <tr key={courseItem.id} >
                      <td>{id + 1 + currentPage * itemsPerPage}</td> {/* Calculate the adjusted index */}
                      <td>{courseItem.course_code}</td>
                      <td>{courseItem.course_name}</td>
                      <td>{courseItem.units}</td>
                      <td>{courseItem.duration}</td>
                      <td>
                        <button
                          onClick={() => toggleEditCourseModal(courseItem, courseItem.year_level)}
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>

                        <DeleteCourse
                          key={courseItem.course_id}
                          handleDelete={() => handleDeleteCourse(courseItem.course_id)}
                          courseId={courseItem.course_id}
                      />

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={'...'}
        pageCount={Math.ceil(course.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={'pagination-container'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
      <Modal show={showProgramModal} onHide={toggleProgramModal}>
  <Modal.Header closeButton>
    <Modal.Title>Filter Courses by Program</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <select
      value={selectedProgram}
      onChange={(e) => setSelectedProgram(e.target.value)}
    >
      {programOptions.map((program) => (
        <option key={program.program} value={program.program}>
          {program.program}
        </option>
      ))}
    </select>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={toggleProgramModal}>
      Close
    </Button>
    <Button variant="primary" onClick={handleFilterButtonClick}>
      Filter
    </Button>
  </Modal.Footer>
</Modal>

      
      {showEditCourseModal && (
        <EditCourse
          show={showEditCourseModal}
          handleClose={() => setShowEditCourseModal(false)}
          selectedCourse={selectedCourse || {}}
          onEdit={handleEditCourse}
        />
      )}
    </div>
  );
}

export default ViewCourse;