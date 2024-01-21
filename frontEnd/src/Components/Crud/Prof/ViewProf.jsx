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
    setSelectedUser(selectedUser); // Use the 'selectedUser' parameter here
    setShowEditUserModal(true);
  };
  

  const toggleModalDelete = () => {
    setShowModalDelete(!showModalDelete);
  };

  const handleAddUser = (newUser) => {
    console.log(newUser); // Log the new user
    setUser([...user, newUser]);
    fetchData(); 
  };
  
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8081/profs");
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
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
  
    fetchDataAndRoles();
  }, []);
  
  
  const fetchRoleName = async (roleId) => {
    try {
      const res = await axios.get(`http://localhost:8081/profs/roles/${roleId}`);
      return res.data[0].role;
    } catch (err) {
      console.error(`Error fetching role name for roleId ${roleId}:`, err);
      return 'Role not found';
    }
  };
  
  
  const handleEditUser = async (userId, updatedUserData) => {
    try {
      await axios.put(`http://localhost:8081/profs/` +userId + '/update', updatedUserData);
      fetchData(); // Refresh data after updating
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8081/profs/` + userId + `/delete`);
      return Promise.resolve(); // Resolve the promise when deletion is successful
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
      return Promise.reject(error); // Reject the promise on error
    }
  };
  
  const handleUserDeleted = (deletedUserId) => {
    setUser((prevUser) => prevUser.filter((userItem) => userItem.user_id !== deletedUserId));
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
                      <td>{userItem.fname + " " + userItem.mname + " " + userItem.lname}</td>
                      <td>{userItem.roleName}</td>
                      <td>
                        <button
                          onClick={() => toggleEditUserModal(userItem)}
                          className="btn btn-primary"
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <DeleteProf
                          show={showModalDelete}
                          handleClose={toggleModalDelete}
                          handleDelete={() => handleDeleteUser(userItem.User_id)}
                          onUserDeleted={handleUserDeleted}
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
