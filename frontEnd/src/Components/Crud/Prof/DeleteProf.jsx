import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

const DeleteProf = ({ handleDelete, userId, handleClose }) => {
  const [showModalDelete, setShowModalDelete] = useState(false);

  const toggleModalDelete = () => {
    setShowModalDelete(!showModalDelete);
  };
  const handleConfirmDelete = () => {
    handleDelete(userId); // Call the handleDelete function passed as a prop
    toggleModalDelete(); // Close the modal
  };

  const handleCloseModal = () => {
    toggleModalDelete();
    handleClose(); // Call handleClose when the modal is closed
  };

  return (
    <div>
      <button className="btn btn-danger" onClick={toggleModalDelete}>
        <FontAwesomeIcon icon={faTrash} />
      </button>

      <Modal show={showModalDelete} onHide={handleCloseModal}>
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

DeleteProf.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};
export default DeleteProf;
