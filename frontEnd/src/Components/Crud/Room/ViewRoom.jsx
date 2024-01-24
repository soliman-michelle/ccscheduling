import axios from 'axios';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
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
      const res = await axios.get("http://localhost:8081/rooms");
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
      await axios.put(`http://localhost:8081/rooms/${roomId}/update`, updatedRoomData);
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
      await axios.delete(`http://localhost:8081/rooms/${roomId}/delete`);
  
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
  
  return (
    <div>
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

      <section className="home-section">
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
            <AddRoom
              show={showAddRoomModal}
              handleClose={toggleAddRoomModal}
              handleAdd={handleAddRoom}
            />

              <table className='table table-bordered'>
                <thead>
                  <tr>
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
                    <td>{id + 1}</td>
                    <td>{roomItem.roomName}</td>
                    <td>{roomItem.location}</td>
                    <td>{roomItem.capacity}</td>
                    <td>{roomItem.type}</td>
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
                    </td>
                  </tr>
                ))}
              </tbody>


              </table>
            </div>
          </div>
        </div>
      </section>
      {showEditRoomModal && (
      <EditRoom
        show={showEditRoomModal}
        handleClose={() => setShowEditRoomModal(false)} // Pass the handleClose prop
        selectedRoom={selectedRoom}
        onEdit={handleEditRoom}
      />
    )}

    </div>
  );
};

export default ViewRoom;
