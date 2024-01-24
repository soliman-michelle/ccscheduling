import { useState, useEffect } from 'react';
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
  const [isProfNameValid, setIsProfNameValid] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState('');

  // Use useEffect to clear the input fields when the modal is shown
  useEffect(() => {
    if (show) {
      setFname('');
      setMname('');
      setLname('');
      setRole('');
      setError('');
      setShowAlert(false);
      setIsProfNameValid(true);
    }
  }, [show]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:8081/profs/roles');
        setRoleData(response.data);

      } catch (error) {
        console.error(error);
      }
    };
  
    fetchRoles();
  }, [show]);  

  const handleFormSubmit = async () => {

    if (!fname || !lname || !mname || !role) {
      setError('All fields are required.');
      setShowAlert(true);
      return;
    }

    if (fname.length < 3 || lname.length < 3 || mname.length < 3) {
      setError('Name length must be greater than 2.');
      setShowAlert(true);
      return;
    }

    if ((!/^[a-zA-Z0-9\s,[@-]+$/.test(fname)) || !/^[a-zA-Z0-9\s,[@-]+$/.test(mname) || !/^[a-zA-Z0-9\s,[@-]+$/.test(lname)) {
      setError('Name can only contain \',\' , \'-\' and \'@\' special characters.');
      setShowAlert(true);
      return;
    }   


    const userData = {
      fname,
      mname,
      lname,
      role,
    };
  
    try {
      // Check if the prof already exists
      const response = await axios.get(`http://localhost:8081/profs/check/${fname}/${lname}`);
  
      if (response.data.exists) {
        // If prof exists, show the alert
        setIsProfNameValid(false);
      } else {
        // If prof doesn't exist, proceed to create it
        await axios.post(
          "http://localhost:8081/profs/create",
          userData);
        handleAdd(userData);
        handleClose();
      }
    } catch (error) {
      console.error(error);
    }
  };
  
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
                className={`mb-2 ${isProfNameValid ? '' : 'is-invalid'}`}
                onChange={(e) => setFname(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                This Professor name already exists.
              </Form.Control.Feedback>
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
    </div>
  );
};

export default AddProf;
