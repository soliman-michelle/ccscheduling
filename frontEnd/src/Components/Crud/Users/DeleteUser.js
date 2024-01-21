import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DeleteUser = ({ show, handleClose, handleDelete, userId  }) => {
  const [showModalDelete, setShowModalDelete] = useState(false);

  const toggleModalDelete = () => {
    setShowModalDelete(!showModalDelete);
  };

  const handleConfirmDelete = () => {
    handleDelete(userId); // Call the handleDelete function passed as a prop
    toggleModalDelete(); // Close the modal
  };

  return (
    <div>
      <button className="btn btn-danger" onClick={toggleModalDelete}>
      <FontAwesomeIcon icon={faTrash} />
      </button>
      
      <Modal show={showModalDelete} onHide={toggleModalDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this User?</p>
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

export default DeleteUser;
