import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';

const EditUser = ({ show, handleClose, selectedUser , onEdit }) => {
  const [editedUser, setEditedUser] = useState({
    ...selectedUser,
    imagePreviewUrl: selectedUser.imageUrl, // Assuming imageUrl is the property holding the image URL
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [error, setError] = useState('');



  const toggleModal = () => {
    handleClose();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    
    const formData = new FormData();
    formData.append('firstName', editedUser.firstName);
    formData.append('middleName', editedUser.middleName);
    formData.append('lastName', editedUser.lastName);
    formData.append('email', editedUser.email);
    formData.append('role', editedUser.role);
  
    if (editedUser.images) {
      formData.append('images', editedUser.images);
    }
  
    try {
      await onEdit(selectedUser.user_id, formData);
      toggleModal();
      setShowSuccessAlert(true);
      setShowErrorAlert(false);
      console.log('Success alert should be shown.'); // Add this log to check success alert trigger

    } catch (error) {
      console.error(error);
        setError('Failed to update user.');
        setShowErrorAlert(true);
        setShowSuccessAlert(false); // Hide the success alert on failed update
    }
  };
  

  return (
    <div>
      <Modal show={show} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form encType="multipart/form-data">
            <Form.Group>
            <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter First Name"
                className='mb-2'
                value={editedUser.firstName}
                onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
              />
            </Form.Group>

            <Form.Group>
            <Form.Label>Middle Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Middle Name"
                value={editedUser.middleName}
                className='mb-2'
                onChange={(e) => setEditedUser({ ...editedUser, middleName: e.target.value })}
              />
            </Form.Group>

            <Form.Group>
            <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Last Name"
                value={editedUser.lastName}
                className='mb-2'
                onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
              />
            </Form.Group>

            <Form.Group  style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginBottom: '10px', marginRight: '10px' }}>
            <label htmlFor="fileInput" className="custom-file-upload">
              {editedUser.imagePreviewUrl ? (
                <img
                  src={editedUser.imagePreviewUrl}
                  alt="User"
                  style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
                />
              ) : (
                <span>Choose File</span>
              )}
            </label>
            <Form.Control
              id="fileInput"
              type="file"
              accept=".jpeg, .jpg, .png"
              onChange={(e) => {
                const file = e.target.files[0];
                setEditedUser({
                  ...editedUser,
                  images: file,
                  imagePreviewUrl: URL.createObjectURL(file),
                });
              }}
            />
          </div>
        </Form.Group>



            <Form.Group >
              <Form.Label>Roles</Form.Label>
              <Form.Control
                as="select"
                className='mb-2'
                value={editedUser.role}
                onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
              >
                <option value="Dean">Dean</option>
                <option value="Program chair">Program Chair</option>
              </Form.Control>
            </Form.Group>

            <Form.Group >
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                className='mb-2'
                placeholder="Enter Email"
                value={editedUser.email}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              />
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

export default EditUser;
