import { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types'; // Import PropTypes

const AddRoom = ({ show, handleClose, handleAdd }) => {
  const [roomName, setRoomName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [type, setType] = useState(''); // Set the initial value to 'Regular'
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState('');
  const [showRoomExistsAlert, setShowRoomExistsAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // State for success alert

  // Use useEffect to clear the input fields when the modal is shown
  useEffect(() => {
    if (show) {
      setRoomName('');
      setLocation('');
      setCapacity('');
      setType(''); // Reset the type to 'Regular'
      setError('');
      setShowAlert(false);
      setShowRoomExistsAlert(false);
      setShowSuccessAlert(false);

    }
  }, [show]);

  const handleFormSubmit = async () => {
      
    if (!roomName || !location || !capacity || !type) {
      setError('All fields are required.');
      setShowAlert(true);
      return;
    }

    if (!/^[a-zA-Z0-9\s,-]+$/.test(roomName) || !/^[a-zA-Z0-9\s,-]+$/.test(location)) {
      setError('Room name and location can only contain letters, numbers, spaces, and \'-\'.');
      setShowAlert(true);
      return;
    }
    
  
    if (isNaN(parseInt(capacity, 10))) {
      setError('Capacity must be a number.');
      setShowAlert(true);
      return;
    }
  
    if (parseInt(capacity, 10) < 30 || parseInt(capacity, 10) > 60) {
      setError('Capacity can`t be negative and cannot exceed 60.');
      setShowAlert(true);
      return;
    }
  
    const newRoom = {
      roomName,
      location,
      capacity,
      type,
    };
  
    try {
      // Check if the room already exists (after normalizing room names)
      const response = await axios.get(`http://localhost:8081/rooms/check/${roomName}`);

      if (response.data.exists) {
        // If room exists, show the alert
        setShowRoomExistsAlert(true);
      } else {
        // If room doesn't exist, proceed to create it
        await axios.post('http://localhost:8081/rooms/create', newRoom);
        handleAdd(newRoom);
        handleClose();
        setShowSuccessAlert(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div>
      <Button variant="primary" onClick={handleClose}>
      <FontAwesomeIcon icon={faPlus} /> Add Room
      </Button>
      <Modal show={show} onHide={handleClose} size='md'>
        <Modal.Header closeButton>
          <Modal.Title>Add Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="roomName">
              {/* <Form.Label>Room Name</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="Enter room name"
                value={roomName}
                className='mb-2'
                onChange={(e) => setRoomName(e.target.value)}
                
              />
              
            </Form.Group>
            
            <Form.Group controlId="location">
              {/* <Form.Label>Location</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="Enter location"
                value={location}
                className='mb-2'
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="capacity">
              {/* <Form.Label>Capacity</Form.Label> */}
              <Form.Control
                type="number"
                placeholder="Enter capacity"
                value={capacity}
                className='mb-2'
                onChange={(e) => setCapacity(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="type">
            <Form.Select
              value={type}
              className='mb-2'
              onChange={(e) => setType(e.target.value)}
            >
              <option value="" disabled>Select Room Type</option>
              <option value="Regular">Regular</option>
              <option value="Laboratory">Laboratory</option>
            </Form.Select>
          </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={handleFormSubmit}>
            Save
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Alert dialog for Room existed */}
      <Modal show={showRoomExistsAlert} onHide={() => setShowRoomExistsAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Duplicate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The room <strong>{roomName}</strong> already exists.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowRoomExistsAlert(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>


        {/* All errors */}
      <Modal show={showAlert} onHide={() => setShowAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Invalid</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowAlert(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

       {/* Success alert for successfully added room */}
       <Modal show={showSuccessAlert} onHide={() => setShowSuccessAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Room successfully added!</p>
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

AddRoom.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
};

export default AddRoom;
