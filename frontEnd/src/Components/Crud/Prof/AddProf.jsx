import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AddProf = ({ show, handleClose, handleAdd }) => {
  const [fname, setFname] = useState('');
  const [mname, setMname] = useState('');
  const [lname, setLname] = useState('');
  const [role, setRole] = useState(''); // Define role state
  const [roleData, setRoleData] = useState([]);

  const handleFormSubmit = async () => {
    const userData = {
      fname,
      mname,
      lname,
      role,
    };
  
    try {
      const response = await axios.post(
        "http://localhost:8081/prof/create",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const newUser = response.data;
  
      // Call handleAddUser with the newly added user
      handleAdd(newUser);
  
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    // Fetch role data from the server
    axios.get('http://localhost:8081/prof/roles')
      .then((response) => {
        setRoleData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Use useEffect to clear the input fields when the modal is shown
  useEffect(() => {
    if (show) {
      setFname('');
      setMname('');
      setLname('');
      setRole('');
    }
  }, [show]);

  return (
    <div>
      <Button variant="primary" onClick={handleClose}>
      <FontAwesomeIcon icon={faPlus} /> Add Prof
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Prof</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form encType="multipart/form-data">
            <Form.Group controlId="fname">
              {/* <Form.Label>First Name</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="Enter First Name"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="mname">
              {/* <Form.Label>Middle Name</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="Enter Middle Name"
                value={mname}
                className='mt-2'
                onChange={(e) => setMname(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="lname">
              {/* <Form.Label>Last Name</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="Enter Last Name"
                value={lname}
                className='mt-2'
                onChange={(e) => setLname(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Control as="select" value={role} onChange={(e) => setRole(e.target.value)} className='mt-2'>
            <option value="">Select Role</option>
            {roleData.map((role) => (
              <option key={role.role_id} value={role.role_id}>
                {role.role}
              </option>
            ))}
          </Form.Control>
            
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleFormSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddProf;
