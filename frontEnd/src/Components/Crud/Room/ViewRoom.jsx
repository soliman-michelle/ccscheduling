import axios from 'axios';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ReactPaginate from 'react-paginate';
import AddRoom from './AddRoom';
import EditRoom from './EditRoom';
import DeleteRoom from './DeleteRoom';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ViewRoom = () => {
  const [room, setRoom] = useState([]);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showEditRoomModal, setShowEditRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
  const [showEditErrorAlert, setShowEditErrorAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = room.slice(indexOfFirstItem, indexOfLastItem);


  const toggleAddRoomModal = () => {
    setShowAddRoomModal(!showAddRoomModal);
  };

  const toggleEditRoomModal = (room) => {
    setSelectedRoom(room);
    setShowEditRoomModal(true);
  };

  const toggleModalDelete = () => {
    setShowModalDelete(!showModalDelete);
  };

  const handleAddRoom = (newRoom) => {
    setRoom([...room, newRoom]);
    fetchData();
  };

  // Function to handle edit success alert
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

  const fetchData = async () => {
    try {
      const res = await axios.get("https://ccsched.onrender.com/rooms");
      setRoom(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditRoom = async (roomId, updatedRoomData) => {
    try {
      await axios.put(`https://ccsched.onrender.com/rooms/${roomId}/update`, updatedRoomData);
      fetchData(); // Refresh data after updating
      handleEditSuccess(); // Show success alert
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      handleEditError(); // Show error alert
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      await axios.delete(`https://ccsched.onrender.com/rooms/${roomId}/delete`);
  
      // Clear the selectedRoom if it's the room being deleted
      if (selectedRoom && selectedRoom.id === roomId) {
        setShowEditRoomModal(false);
        setSelectedRoom(null);
      }
  
      // Update the room state after deletion
      setRoom((prevRoom) => prevRoom.filter((roomItem) => roomItem.id !== roomId));

      setShowDeleteSuccessAlert(true);
      setTimeout(() => {
        setShowDeleteSuccessAlert(false);
      }, 8000); // Hide alert after 8 seconds
    } catch (error) {
      console.error(`Error deleting room with ID ${roomId}:`, error);
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
       {/* Alert for successful edit */}
       {showEditSuccessAlert && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Success!</strong> Room <strong>{selectedRoom.roomName}</strong> updated successfully!
          <button type="button" className="btn-close" onClick={() => setShowEditSuccessAlert(false)} aria-label="Close"></button>
        </div>
      )}

      {/* Alert for edit error */}
      {showEditErrorAlert && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error!</strong> Failed to update Room <strong>{selectedRoom.roomName}</strong>.
          <button type="button" className="btn-close" onClick={() => setShowEditErrorAlert(false)} aria-label="Close"></button>
        </div>
      )}

      {/* Alert for successful deletion */}
      {showDeleteSuccessAlert && selectedRoom && (
      <div className="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Success!</strong> Room <strong>{selectedRoom.roomName}</strong> deleted successfully!
        <button type="button" className="btn-close" onClick={() => setShowDeleteSuccessAlert(false)} aria-label="Close"></button>
      </div>
    )}

<div className = "content">
      <div className = "card">
        <h1>ROOM</h1>
      </div>
      </div>


      <section className="home-section pt-2">
      <div className='container-fluid'>
          <div className='row'>
            
          <header>
            <div className='filterEntries'>
            <AddRoom
              show={showAddRoomModal}
              handleClose={toggleAddRoomModal}
              handleAdd={handleAddRoom}
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
                    <th>Room Name</th>
                    <th>Location</th>
                    <th>Capacity</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                {room.map((roomItem, id) => (
                  <tr key={roomItem.id}>
                    <td className = "course-info">{id + 1  + currentPage * itemsPerPage}</td>
                    <td className = "course-info">{roomItem.roomName}</td>
                    <td className = "course-info">{roomItem.location}</td>
                    <td className = "course-info">{roomItem.capacity}</td>
                    <td className = "course-info">{roomItem.type}</td>
                    <td>
                      <button
                        onClick={() => toggleEditRoomModal(roomItem)}
                        className="btn btn-primary"
                      >
                        <FontAwesomeIcon icon= {faPen}/>
                      </button>
                      <DeleteRoom
                        key={roomItem.id} // Assign a unique key here
                        show={showModalDelete}
                        handleClose={toggleModalDelete}
                        handleDelete={() => handleDeleteRoom(roomItem.id)}
                      />
                            {showEditRoomModal && (
      <EditRoom
        show={showEditRoomModal}
        handleClose={() => setShowEditRoomModal(false)} // Pass the handleClose prop
        selectedRoom={selectedRoom}
        onEdit={handleEditRoom}
      />
    )}

                    </td>
                  </tr>
                ))}
              </tbody>


              </table>
          </div>

          <footer>
              <span className="showEntries">
              Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, room.length)} of {room.length} entries
              </span>
              <ReactPaginate
                previousLabel={'< previous'}
                nextLabel={'next >'}
                breakLabel={'...'}
                pageCount={Math.ceil(room.length / itemsPerPage)}
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
    </div>
  );
};

export default ViewRoom;