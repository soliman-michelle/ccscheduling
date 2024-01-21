import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

const EditProf = ({ show, handleClose, selectedUser , onEdit }) => {
  const [editedUser, setEditedUser] = useState(selectedUser);

  const toggleModal = () => {
    handleClose();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('fname', editedUser.fname);
    formData.append('mname', editedUser.mname);
    formData.append('lname', editedUser.lname);
    formData.append('role', editedUser.role);
    try {
      await onEdit(selectedUser.id, formData);
      toggleModal();
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
                value={editedUser.fname}
                onChange={(e) => setEditedUser({ ...editedUser, fname: e.target.value })}
              />
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
                <option value="Program chair">Program Chair</option>
                <option value="Professor">Professor</option>
                <option value="Admin">Admin</option>
                <option value="Dean">Dean</option>
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

export default EditProf;
