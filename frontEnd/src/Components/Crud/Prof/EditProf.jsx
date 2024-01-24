import { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import PropTypes from 'prop-types';

const EditProf = ({ show, handleClose, selectedUser , onEdit }) => {
  const [editedUser, setEditedUser] = useState(selectedUser);
  const [roleData, setRoleData] = useState([]);
  const [isProfNameValid, setIsProfNameValid] = useState(true);

  const toggleModal = () => {
    handleClose();
  };

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

  useEffect(() => {
    if (show) {
      setIsProfNameValid(true);
    }
  }, [show]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('user_id', editedUser.User_id);
    formData.append('fname', editedUser.fname);
    formData.append('mname', editedUser.mname);
    formData.append('lname', editedUser.lname);
    formData.append('role', editedUser.role);
  
    try {
      const response = await axios.get(`http://localhost:8081/profs/check/${editedUser.fname}/${editedUser.lname}`);
  
      if (response.data.exists) {
        // If prof exists, show the alert
        setIsProfNameValid(false);
      } else {
        console.log('userId:', editedUser.User_id);
  
        const userId = editedUser.User_id;
        await onEdit(userId, editedUser);
        toggleModal();
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  
  return (
    <div>
      <Modal show={show} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Professor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form encType="multipart/form-data">
            <Form.Group controlId="fname">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter First Name"
                className={`mb-2 ${isProfNameValid ? '' : 'is-invalid'}`}
                value={editedUser.fname}
                onChange={(e) => setEditedUser({ ...editedUser, fname: e.target.value })}
              />
              <Form.Control.Feedback type="invalid">
                This Professor name already exists.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="mname">
              <Form.Label>Middle Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Middle Name"
                value={editedUser.mname}
                onChange={(e) => setEditedUser({ ...editedUser, mname: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="lname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Last Name"
                value={editedUser.lname}
                onChange={(e) => setEditedUser({ ...editedUser, lname: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="role">
              <Form.Label>Roles</Form.Label>
              <Form.Control 
                as="select" 
                value={editedUser.role}
                onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                >
              <option value="">Select Role</option>
              {roleData.map((role) => (
                <option key={role.role_id} value={role.role_id}>
                  {role.role}
                </option>
              ))}
            </Form.Control>
            </Form.Group>
    
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

EditProf.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedUser: PropTypes.shape({
    user_id: PropTypes.string.isRequired, // Include id in PropTypes
    fname: PropTypes.string.isRequired,
    mname: PropTypes.string.isRequired,
    lname: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};
export default EditProf;
