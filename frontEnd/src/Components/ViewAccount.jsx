import { useState, useEffect } from "react"
import DeleteAccount from "./DeleteAccount";
import axios from "axios";
import AddAccount from "./AddAccount";
import Header from './Header';
import Sidebar from './Sidebar';

const ViewAccount = () => {
    const [user, setUser] = useState([]);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
    
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
      <div className="h-100">
    <div className="wrapper">
    <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className = "main">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}/>
        <div className = "container">

        <div className = "content">
      <div className = "card">
      <h1 style="color: black;">ACCOUNTS</h1>
      </div>
      </div>

      <section className="home-section pt-2">
        {/* Alert for successful deletion */}
     {showDeleteSuccessAlert && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Success!</strong> User Deleted successfully!
          <button type="button" className="btn-close" onClick={() => setShowDeleteSuccessAlert(false)} aria-label="Close"></button>
        </div>
      )}

          <div className='container'>
            <div className='row'>

            <header>
            <div className='filterEntries'>
                <AddAccount
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
            <div className='col-md-12 ps-2 pe-2 overflow-auto'>
              <table className='custom-table custom-table table table-striped table-hover .table-responsive mt-2'>
                <thead>
                <tr className = "table-primary border-dark">
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
                        <td  className = "course-info">{id + 1}</td>
                        <td className = "course-info">{userItem.firstName + " " + userItem.middleName + " " + userItem.lastName}</td>
                        <td className = "course-info">{userItem.email}</td>
                        <td>
                        {imageUrl ? (
                          <div style={{ width: '80px', height: '80px', overflow: 'hidden', borderRadius: '50%' }}>
                            <img src={imageUrl} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ) : (
                          "No Image Available"
                        )}
                      </td>
                        <td className = "course-info">{userItem.role}</td>
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
          </div>
        </section>
        </div>
            </div>
          </div>
          </div>
      </div>
  )
}

export default ViewAccount