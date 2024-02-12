import axios from 'axios';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
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
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = user.slice(indexOfFirstItem, indexOfLastItem);

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
      const res = await axios.get(`https://ccsched.onrender.com/profs/roles/${roleId}`);
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
      const response = await axios.put(`https://ccsched.onrender.com/profs/${userId}/update`, updatedUserData);
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
      await axios.delete(`https://ccsched.onrender.com/profs/${userId}/delete`);
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
  
  @media (max-width: 768px) {
    .custom-table {
      overflow-x: auto;
      white-space: nowrap; /* Prevent line breaks */
    }
  }
  
          
          `}
  
        </style>
        <div className = "content">
      <div className = "card">
        <h1>PROFESSORS</h1>
      </div>
      </div>
      <section className="home-section pt-2">
      <div className='container-fluid'>
          <div className='row'>

          <header>
            <div className='filterEntries'>
              <AddProf
                show={showAddUserModal}
                handleClose={toggleAddUserModal}
                handleAdd={handleAddUser}
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

              <div className="card-body">
              <div className='col-md-12 col-md-12 ps-2 pe-2 overflow-auto'>
              <table className='custom-table table table-striped table-hover .table-responsive mt-2'>
                <thead>
                <tr className = "table-primary border-dark">
                    <th>No.</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                {currentItems.map((userItem, id) => {
                  return (
                    <tr key={userItem.User_id}>
                      <td>{id + 1 + currentPage * itemsPerPage}</td>
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
          <footer>
              <span className="showEntries">
  Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, user.length)} of {user.length} entries
</span>
              <ReactPaginate
                previousLabel={'< previous'}
                nextLabel={'next >'}
                breakLabel={'...'}
                pageCount={Math.ceil(user.length / itemsPerPage)}
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