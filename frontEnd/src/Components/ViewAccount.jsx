import { useState, useEffect } from "react"
import DeleteAccount from "./DeleteAccount";
import axios from "axios";
import AddAccount from "./AddAccount";

const ViewAccount = () => {
    const [user, setUser] = useState([]);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);

    const toggleAddUserModal = () => {
        setShowAddUserModal(!showAddUserModal);
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
    
        {/* Alert for successful deletion */}
     {showDeleteSuccessAlert && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Success!</strong> User Deleted successfully!
          <button type="button" className="btn-close" onClick={() => setShowDeleteSuccessAlert(false)} aria-label="Close"></button>
        </div>
      )}
        <section className="home-section">
          <div className='container'>
            <div className='row'>
              <div className='col-md-12'>
                <AddAccount
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
                          <DeleteAccount
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
      </div>
  )
}

export default ViewAccount