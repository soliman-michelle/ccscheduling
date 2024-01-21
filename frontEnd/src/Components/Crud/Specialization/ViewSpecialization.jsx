import axios from 'axios';
import React, { useEffect, useState } from 'react';
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

  return (
    <div >
  <section>
    <div >
    <AddSpecialization
            show={showAddSpecializationModal}
            handleClose={toggleAddSpecializationModal}
            handleAdd={handleAddSpecialization}
            
          />
      <div className='row mt-2'>
        <div className='col-md-8'>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Course</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {specialization.map((specializationItem, id) => (
            <tr key={id + 1}>
              <td>{id + 1}</td>
              <td>
              {specializationItem.fnames && specializationItem.lnames &&
              specializationItem.fnames.split(', ').map((fname, index) => (
                <span key={index}>{fname} {specializationItem.lnames.split(', ')[index]}</span>
            ))}

              </td>
              <td>
              {specializationItem.course_codes && specializationItem.course_names &&
              specializationItem.course_codes.split(', ').map((courseCode, index) => (
                <span key={index}>{courseCode} {specializationItem.course_names.split(', ')[index]}</span>
            ))}

              </td>
              <Link to={`/specialization/course/${specializationItem.User_id}`}>
              <FontAwesomeIcon icon={faEye} />
            </Link>
              
            </tr>
          ))}

            </tbody>
          </table>
        </div>
        <div className='col-md-4'>
        {unassignedCourses.length > 0 ? (
  <div>
    <p>Unassigned Courses:</p>
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


        <p>Review Warning </p>
          <ul>
          {assignedCourses.map((course) => (
            <li key={course.course_id}>
              {course.course_code} - {course.course_name}
            </li>
          ))}
        </ul>
        </div>
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
