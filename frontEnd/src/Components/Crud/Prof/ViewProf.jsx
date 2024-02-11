import axios from 'axios';
import { useEffect, useState } from 'react';
import AddProf from './AddProf';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DeleteProf from './DeleteProf';
import EditProf from './EditProf';

const ViewProf = () => {
  const [user, setUser] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const toggleAddUserModal = () => {
    setShowAddUserModal(!showAddUserModal);
  };

  const toggleEditUserModal = (selectedUser) => {
    setSelectedUser(selectedUser);
    setShowEditUserModal(true);
  };
  

  const toggleModalDelete = () => {
    setShowModalDelete(!showModalDelete);
  };

  const fetchRoleName = async (roleId) => {
    try {
      const res = await axios.get(`http://localhost:8081/profs/roles/${roleId}`);
      return res.data[0].role;
    } catch (err) {
      console.error(`Error fetching role name for roleId ${roleId}:`, err);
      return 'Role not found';
    }
  };

  const fetchDataAndRoles = async () => {
    try {
      const res = await axios.get("http://localhost:8081/profs");
      setUser(res.data);

      const updatedUser = await Promise.all(
        res.data.map(async (userItem) => {
          const roleName = await fetchRoleName(userItem.role);
          return { ...userItem, roleName };
        })
      );
      setUser(updatedUser);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDataAndRoles();
  }, []);
  
  const handleAddUser = async (userData) => {
    try {
      console.log('UserData:', userData);

      const roleName = await fetchRoleName(userData.role);
  
      // Update the user state with the role name included
      setUser((prevUser) => [...prevUser, { ...userData, roleName }]);
      fetchDataAndRoles();
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleEditUser = async (userId, updatedUserData) => {
    try {
      const response = await axios.put(`http://localhost:8081/profs/${userId}/update`, updatedUserData);
      console.log('Server response:', response.data); // Log the response from the server

      if (response.status === 200) {
        console.log('User data successfully updated:', updatedUserData);
        console.log('Server response:', response.data); // Log the response from the server
        fetchDataAndRoles(); // Refresh data after updating
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        console.error('Failed to update user data. Server response:', response);
        // Handle the error as needed
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      // Handle the error as needed
    }
  };
  
  
  

  const handleDeleteUser = async (userId) => {
  
    try {
      // Wait for the deletion to be successful
      await axios.delete(`http://localhost:8081/profs/${userId}/delete`);
      fetchDataAndRoles();
  
      if (selectedUser && selectedUser.user_id === userId) {
        setShowEditUserModal(false);
        setSelectedUser(null);
      }
      setUser((prevUser) => prevUser.filter((userItem) => userItem.user_id !== userId));
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
      // Handle the error if needed
    }
  };
  
  

  return (
    <div>
      <section className="home-section">
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <AddProf
                show={showAddUserModal}
                handleClose={toggleAddUserModal}
                handleAdd={handleAddUser}
              />

              <table className='table table-bordered'>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                {user.map((userItem, id) => {
                  return (
                    <tr key={userItem.User_id}>
                      <td>{id + 1}</td>
                      <td>{userItem.fname + " " + userItem.lname}</td>
                      <td>{userItem.roleName}</td>
                      <td>
                        <button
                          onClick={() => toggleEditUserModal(userItem)}
                          className="btn btn-primary"
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <DeleteProf
                          key={userItem.User_id}
                          show={showModalDelete}
                          handleClose={toggleModalDelete}
                          handleDelete={() => handleDeleteUser(userItem.User_id)}
                        />
                      </td>
                    </tr>
                  );
                })}
                  </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      {showEditUserModal && (
        <EditProf
          show={showEditUserModal}
          handleClose={() => setShowEditUserModal(false)}
          selectedUser={selectedUser}
          onEdit={handleEditUser}
        />
      )}
    </div>
  );
};

export default ViewProf;
