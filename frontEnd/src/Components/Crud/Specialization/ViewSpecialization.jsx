import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import AddSpecialization from './AddSpecialization';
import EditSpecialization from './EditSpecialization';
import DeleteSpecialization from './DeleteSpecialization';
import { faPen,faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SeeSpecialization from './SeeSpecialization';
import { Link } from 'react-router-dom';

const ViewSpecialization = () => {
  const [specialization, setSpecialization] = useState([]);
  const [showAddSpecializationModal, setShowAddSpecializationModal] = useState(false);
  const [showEditSpecializationModal, setShowEditSpecializationModal] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [unassignedCourses, setUnassignedCourses] = useState([]);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = specialization.slice(indexOfFirstItem, indexOfLastItem);


  const toggleAddSpecializationModal = () => {
    setShowAddSpecializationModal(!showAddSpecializationModal);
  };

  const toggleEditSpecializationModal = (selectedSpecialization) => {
    setSelectedSpecialization(selectedSpecialization);
    setShowEditSpecializationModal(true);
  };  
  
  const toggleModalDelete = () => {
    setShowModalDelete(!showModalDelete);
  };

  const handleAddSpecialization = (newSpecialization) => {
    setSpecialization([...specialization, newSpecialization]);
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8081/specialization");
      console.log("Data received from the server:", res.data);
  
      if (Array.isArray(res.data)) {
        setSpecialization(res.data);
      } else {
        console.error("Received data is not an array:", res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  useEffect(() => {
    fetchUnassignedCourses();
    fetchData(); // Fetch specialization data
  }, []);

  const fetchUnassignedCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8081/specialization/unassigned-courses");
      console.log("Unassigned Courses received from the server:", res.data);

      if (Array.isArray(res.data)) {
        setUnassignedCourses(res.data);
      } else {
        console.error("Received data is not an array:", res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssignedCourses();
    fetchData(); // Fetch specialization data
  }, []);
  const fetchAssignedCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8081/specialization/assign");

      if (Array.isArray(res.data)) {
        setAssignedCourses(res.data);
      } else {
        console.error("Received data is not an array:", res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleEditSpecialization = async (specializationId, updatedSpecializationData) => {
    try {
      await axios.put(`http://localhost:8081/specialization/` +specializationId + '/update', updatedSpecializationData);
      fetchData(); // Refresh data after updating
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSpecialization = async (specializationId) => {
    try {
      console.log(`Deleting specialization with ID: ${specializationId}`);
      await axios.delete(`http://localhost:8081/specialization/` + specializationId + `/delete`);
      console.log(`Specialization with ID ${specializationId} deleted successfully`);
      setSpecialization((prevSpecialization) => prevSpecialization.filter((specializationItem) => specializationItem.id !== specializationId));
    } catch (error) {
      console.error(`Error deleting Specialization with ID ${specializationId}:`, error);
    }
  };


  const handlePageChange = (selected) => {
    setCurrentPage(selected.selected);
  };

  return (
    <div >
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
        
        `}

      </style>
      <div className = "content">
      <div className = "card">
        <h1>CLASS HANDLE</h1>
      </div>
      </div>


      <section className="home-section pt-2">
        <div className='container-fluid'>
      <div className='row'>
      <header>
            <div class = "filterEntries">
    <AddSpecialization
            show={showAddSpecializationModal}
            handleClose={toggleAddSpecializationModal}
            handleAdd={handleAddSpecialization}
            
          />
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

          <div className="row card-body">
              <div className='col-md-8 ps-3 pe-2 overflow-auto'>
          <table className='custom-table table table-striped table-hover .table-responsive mt-2'>
            <thead>
            <tr className = "custom-tr table-primary border-dark">
                <th>No.</th>
                <th>Name</th>
                <th>Course</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {currentItems.map((specializationItem, id) => (
            <tr key={id + 1}>
              <td className = "course-info">{id + 1 + currentPage * itemsPerPage}</td>
              <td className = "course-info">
              {specializationItem.fnames && specializationItem.lnames &&
              specializationItem.fnames.split(', ').map((fname, index) => (
                <span key={index}>{fname} {specializationItem.lnames.split(', ')[index]}</span>
            ))}

              </td>
              <td className = "course-info">
              {specializationItem.course_codes && specializationItem.course_names &&
              specializationItem.course_codes.split(', ').map((courseCode, index) => (
                <span key={index}>{courseCode} {specializationItem.course_names.split(', ')[index]}</span>
            ))}

              </td>
              <td>
              <Link to={`/specialization/course/${specializationItem.User_id}`}>
             <button className = "custom-button btn btn-primary">
             <FontAwesomeIcon icon={faEye} />
             </button>
            </Link>
            </td>
            </tr>
          ))}

            </tbody>
          </table>
        </div>
        <div className='card card-body col-md-4 ps-2 pe-2 overflow-auto mt-2'>
        {unassignedCourses.length > 0 ? (
  <div>

    <ul>
      {unassignedCourses.map((course) => (
        <li key={course.course_id}>
          {course.course_code} - {course.course_name}
        </li>
      ))}
    </ul>
  </div>
) : (
  ''
)}
<div className = "card-header">
    <h4><strong>Unassigned Courses</strong></h4>
        </div>
        <p className = "mt-2"><strong>Review Warning:</strong></p>
          <ul>
          {assignedCourses.map((course) => (
            <li key={course.course_id}>
              {course.course_code} - {course.course_name}
            </li>
          ))}
        </ul>
        </div>
      </div>
      <footer>
        <span className="showEntries">
  Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, specialization.length)} of {specialization.length} entries
</span>
              <ReactPaginate
                previousLabel={'< previous'}
                nextLabel={'next >'}
                breakLabel={'...'}
                pageCount={Math.ceil(specialization.length / itemsPerPage)}
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
  </section>
  {showEditSpecializationModal && (
    <EditSpecialization
      show={showEditSpecializationModal}
      handleClose={() => setShowEditSpecializationModal(false)}
      selectedSpecialization={selectedSpecialization}
      onEdit={handleEditSpecialization}
    />      
  )}
</div>

  );
};

export default ViewSpecialization;
