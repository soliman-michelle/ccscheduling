import axios from 'axios';
import React, { useEffect, useState } from 'react';
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
  const [itemsPerPage, setItemsPerPage] = useState(10);
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
        

</style>

        `}
      </style>
      <div className = "content">
      <div className = "card">
        <h1>COURSES</h1>
      </div>
      </div>
      <section className="home-section pt-2">
          {/* Alert for successful deletion */}
     {showDeleteSuccessAlert && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Success!</strong> Course is deleted successfully!
          <button type="button" className="btn-close" onClick={() => setShowDeleteSuccessAlert(false)} aria-label="Close"></button>
        </div>
      )}
        <div className='container-fluid'>
          <div className='row'>

          <header>
            <div class = "filterEntries">
              <AddCourse
                show={showAddCourseModal}
                handleClose={toggleAddCourseModal}
                handleAdd={handleAddcourse}
              />
            <Col md={8}>
              <Button className = "small-button" onClick={toggleProgramModal}>View</Button>
            </Col>
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
              <table className='custom-table table table-striped .table-responsive table-hover mt-2' style={{fontSize: '16px'}}>
                <thead>
                  <tr className = "custom-tr table-primary border-dark">
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
                      <td className = "course-info">{id + 1 + currentPage * itemsPerPage}</td> {/* Calculate the adjusted index */}
                      <td className = "course-info">{courseItem.course_code}</td>
                      <td className = "course-info">{courseItem.course_name}</td>
                      <td className = "course-info">{courseItem.units}</td>
                      <td className = "course-info">{courseItem.duration}</td>
                      <td>
                        <button
                          onClick={() => toggleEditCourseModal(courseItem, courseItem.year_level)}
                          className="custom-button btn btn-primary"
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

            <footer>
      <span className="showEntries">
  Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, course.length)} of {course.length} entries
</span>
      <ReactPaginate
        previousLabel={'< previous'}
        nextLabel={'next >'}
        breakLabel={'...'}
        pageCount={Math.ceil(course.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={'pagination-container'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
      </footer>
      </div>
          </div>
        </div>
      </section>
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