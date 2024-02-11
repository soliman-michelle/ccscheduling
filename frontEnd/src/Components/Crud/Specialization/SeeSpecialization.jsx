import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import EditSpecialization from './EditSpecialization';
import DeleteSpecialization from './DeleteSpecialization';
import { faPen} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SeeSpecialization = () => {
  const { User_id } = useParams();
  const [specialization, setSpecialization] = useState([]);
  const [showAddSpecializationModal, setShowAddSpecializationModal] = useState(false);
  const [showEditSpecializationModal, setShowEditSpecializationModal] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const toggleEditSpecializationModal = (selectedSpecialization) => {
    setSelectedSpecialization(selectedSpecialization);
    setShowEditSpecializationModal(true);
  };  
  
  const toggleModalDelete = () => {
    setShowModalDelete(!showModalDelete);
  };

  const handleEditSpecialization = async (specializationId, updatedSpecializationData) => {
    try {
      await axios.put(`https://ccsched.onrender.com/specialization/` +specializationId + '/update', updatedSpecializationData);
      fetchData(); // Refresh data after updating
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSpecialization = async (specialization) => {
    console.log("1: " , specialization.course_id);
    try {
      // Perform deletion in the program_course_assignment_reference table
      await axios.delete(`https://ccsched.onrender.com/specialization/${User_id}/${specialization.course_id}/delete`);
      console.log(`Course with ID ${User_id}  for User ${specialization.course_id}deleted successfully in program_course_assignment_reference`);
    } catch (error) {
    }
  };
  
  const fetchData = async () => {
    try {
      const res = await axios.get(`https://ccsched.onrender.com/specialization/course/${User_id}`);
      if (Array.isArray(res.data)) {
        setSpecialization(res.data);
        console.log("Umay", res.data);
      } else {
        console.error('Received data is not an array:', res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [User_id]); // Run fetchData when User_id changes

  if (!User_id) {
    return <div>No User ID provided</div>;
  }
  return (
    <div>
        <div>{specialization.length > 0 && `${specialization[0].fname} ${specialization[0].lname}`}</div>

      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>No.</th>
            <th>Course code</th>
            <th>Course name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {specialization.map((specializationItem, id) => (
            <tr key={id + 1}>
              <td>{id + 1}</td>
              <td>{specializationItem.course_id}</td>
              <td>{specializationItem.course_code}</td>
              <td>{specializationItem.course_name}</td>
               <td>
                {/* <button
                  onClick={() => toggleEditSpecializationModal(specializationItem)}
                  className="btn btn-primary"
                >
                  <FontAwesomeIcon icon={faPen} />
                </button> */}
                <DeleteSpecialization
                  key={id}
                  show={showModalDelete}
                  handleClose={toggleModalDelete}
                  handleDelete={() => handleDeleteSpecialization(specializationItem)}

                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* {showEditSpecializationModal && (
    <EditSpecialization
      show={showEditSpecializationModal}
      handleClose={() => setShowEditSpecializationModal(false)}
      selectedSpecialization={selectedSpecialization}
      onEdit={handleEditSpecialization}
    />      
  )} */}
    </div>
  );
};

export default SeeSpecialization;
