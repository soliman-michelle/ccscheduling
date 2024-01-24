import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Modal, Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';

const EditRoom = ({ show, handleClose, selectedRoom, onEdit }) => {
    const [editedRoom, setEditedRoom] = useState(selectedRoom);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [error, setError] = useState('');
    const [isRoomNameValid, setIsRoomNameValid] = useState(true);

    const toggleModal = () => {
      handleClose();
    };

    useEffect(() => {
      // Reset validation when the modal is opened
      if (show) {
        setIsRoomNameValid(true);
      }
    }, [show]);
  
    const handleFormSubmit = async (e) => {
      e.preventDefault();
      const { roomName, location, capacity, type } = editedRoom;
  
      if (!roomName || !location || !capacity || !type) {
        setError('All fields are required.');
        setShowErrorAlert(true);
        return;
      }
  
      if (!/^[a-zA-Z0-9\s,[@-]+$/.test(location)) {
        setError('Location can only contain \',\' , \'-\' and \'@\' special characters.');
        setShowErrorAlert(true);
        return;
      }
  
      if (isNaN(parseInt(capacity, 10))) {
        setError('Capacity must be a number.');
        setShowErrorAlert(true);
        return;
      }
  
      if (parseInt(capacity, 10) < 30 || parseInt(capacity, 10) > 60) {
        setError('Capacity can`t be negative and cannot exceed 60.');
        setShowErrorAlert(true);
        return;
      }
  
      try {
        // Check if the room name already exists (after normalizing room names)
        const response = await axios.get(`http://localhost:8081/rooms/check/${roomName}`);
  
        if (response.data.exists && roomName !== selectedRoom.roomName) {
          // If room exists and it's not the same as the original name, show the alert
          setIsRoomNameValid(false);
          return;
        } else {
          // If room doesn't exist or it's the same name, proceed to update it
          await onEdit(selectedRoom.id, editedRoom);
          toggleModal();
          setShowSuccessAlert(true);
          setShowErrorAlert(false); // Make sure to hide the error alert on successful update
        }
      } catch (error) {
        console.error(error);
        setError('Failed to update room.');
        setShowErrorAlert(true);
        setShowSuccessAlert(false); // Hide the success alert on failed update
      }
    };

  return (
    <div>
      <Modal show={show} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="roomName">
              <Form.Control
                type="text"
                placeholder="Enter room name"
                value={editedRoom.roomName}
                className={`mb-2 ${isRoomNameValid ? '' : 'is-invalid'}`}
                onChange={(e) =>
                  setEditedRoom({
                    ...editedRoom,
                    roomName: e.target.value,
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                This room name already exists.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="location">
              {/* <Form.Label>Location</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="Enter location"
                value={editedRoom.location}
                className='mb-2'
                onChange={(e) =>
                  setEditedRoom({
                    ...editedRoom,
                    location: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group controlId="capacity">
              {/* <Form.Label>Capacity</Form.Label> */}
              <Form.Control
                type="number"
                placeholder="Enter capacity"
                value={editedRoom.capacity}
                className='mb-2'
                onChange={(e) =>
                  setEditedRoom({
                    ...editedRoom,
                    capacity: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group controlId="type">
              {/* <Form.Label>Type</Form.Label> */}
              <Form.Control
                as="select" // Render as a select element
                value={editedRoom.type}
                className='mb-2'
                onChange={(e) =>
                  setEditedRoom({
                    ...editedRoom,
                    type: e.target.value,
                  })
                }
              >
                <option value="Regular">Regular</option>
                <option value="Laboratory">Laboratory</option>
              </Form.Control>
            </Form.Group>
            <Modal.Footer>
            <Button variant="primary" type="submit">
              Save
            </Button>
            <Button variant="secondary" onClick={toggleModal}>
              Close
            </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      {/* Error alert for failed update */}
      <Modal show={showErrorAlert} onHide={() => setShowErrorAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowErrorAlert(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success alert for successful update */}
      <Modal show={showSuccessAlert} onHide={() => setShowSuccessAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Room updated successfully!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessAlert(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

EditRoom.propTypes = {
  handleClose: PropTypes.func.isRequired,
  selectedRoom: PropTypes.shape({
    id: PropTypes.string.isRequired, // Include id in PropTypes
    roomName: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    capacity: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};
export default EditRoom;
