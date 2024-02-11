  import axios from 'axios';
  import { useEffect, useState } from 'react';
  import Crud from '../../Crud';
  import AddUser from './AddUser';
  import EditUser from './EditUser';
  import DeleteUser from './DeleteUser';
  import { faPen } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

  const ViewUser = () => {
    const [user, setUser] = useState([]);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);
    const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
    const [showEditErrorAlert, setShowEditErrorAlert] = useState(false);

    const toggleAddUserModal = () => {
      setShowAddUserModal(!showAddUserModal);
    };

    const toggleEditUserModal = (selectedUser) => {
      setSelectedUser(selectedUser); // Use the 'selectedUser' parameter here
      setShowEditUserModal(true);
    };
    
    const handleEditSuccess = () => {
      setShowEditSuccessAlert(true);
      setTimeout(() => {
        setShowEditSuccessAlert(false);
      }, 8000);
    };
    
    // Function to handle edit error alert
    const handleEditError = () => {
      setShowEditErrorAlert(true);
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
        const res = await axios.get("https://ccsched.onrender.com/user");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    useEffect(() => {
      fetchData();
    }, []);

    const handleEditUser = async (userId, updatedUserData) => {
      try {
        await axios.put(`https://ccsched.onrender.com/user/${userId}/update`, updatedUserData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        fetchData(); // Refresh data after updating
        handleEditSuccess();
      } catch (error) {
        console.error(error);
        handleEditError(); // Show error alert
      }
    };
    
    const handleDeleteUser = async (userId) => {
      try {
        console.log(`Deleting user with ID: ${userId}`);
        await axios.delete(`https://ccsched.onrender.com/user/` + userId + `/delete`);
        console.log(`User with ID ${userId} deleted successfully`);
        setUser((prevUser) => prevUser.filter((userItem) => userItem.user_id !== userId)); // Update the filter condition
        setShowDeleteSuccessAlert(true);
      setTimeout(() => {
        setShowDeleteSuccessAlert(false);
      }, 8000);
      } catch (error) {
        console.error(`Error deleting user with ID ${userId}:`, error);
      }
    };
    

    return (
      <div>
       {/* Alert for successful edit */}
       {showEditSuccessAlert && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Success!</strong> User <strong>{selectedUser.firstName} {selectedUser.lastName}</strong> updated successfully!
          <button type="button" className="btn-close" onClick={() => setShowEditSuccessAlert(false)} aria-label="Close"></button>
        </div>
      )}

        {/* Alert for successful deletion */}
     {showDeleteSuccessAlert && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Success!</strong> User <strong>{selectedUser.firstName} {selectedUser.lastName}</strong> deleted successfully!
          <button type="button" className="btn-close" onClick={() => setShowDeleteSuccessAlert(false)} aria-label="Close"></button>
        </div>
      )}
        <section className="home-section">
          <div className='container'>
            <div className='row'>
              <div className='col-md-12'>
                <AddUser
                  show={showAddUserModal}
                  handleClose={toggleAddUserModal}
                  handleAdd={handleAddUser}
                />

                <table className='table table-bordered'>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Images</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                  {user.map((userItem, id) => {
                    const imageUrl = userItem.imageUrl;
                    return (
                      <tr key={userItem.id}>
                        <td>{id + 1}</td>
                        <td>{userItem.firstName + " " + userItem.middleName + " " + userItem.lastName}</td>
                        <td>{userItem.email}</td>
                        <td>
  {imageUrl ? (
    <div style={{ width: '80px', height: '80px', overflow: 'hidden', borderRadius: '50%' }}>
      <img src={imageUrl} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  ) : (
    "No Image Available"
  )}
</td>


                        <td>{userItem.role}</td>
                        <td>
                          <button
                            onClick={() => toggleEditUserModal(userItem)}
                            className="btn btn-primary"
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                          <DeleteUser
                            key={userItem.user_id} // Assign a unique key here
                            show={showModalDelete}
                            handleClose={toggleModalDelete}
                            handleDelete={() => handleDeleteUser(userItem.user_id)}
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
          <EditUser
            show={showEditUserModal}
            handleClose={() => setShowEditUserModal(false)}
            selectedUser={selectedUser}
            onEdit={handleEditUser}
          />
        )}
      </div>
    );
  };

  export default ViewUser;
