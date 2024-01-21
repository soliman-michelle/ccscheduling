import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DeleteProf = ({ show, handleClose, handleDelete, userId, onUserDeleted }) => {
  const [showModalDelete, setShowModalDelete] = useState(false);

  const toggleModalDelete = () => {
    setShowModalDelete(!showModalDelete);
  };

  const handleConfirmDelete = () => {
    handleDelete(userId)
      .then(() => {
        onUserDeleted(userId); // Notify the parent component about the deletion
        toggleModalDelete(); // Close the modal
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
        // Handle error if necessary
      });
  };

  return (
    <div>
      <button className="btn btn-danger" onClick={toggleModalDelete}>
      <FontAwesomeIcon icon={faTrash} />
      </button>
      
      <Modal show={showModalDelete} onHide={toggleModalDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Professor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this Professor?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModalDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleteProf;
