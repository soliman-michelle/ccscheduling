import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types'; // Import PropTypes

const DeleteSummer = ({handleClose, handleDelete, blockId  }) => {

  const [showModalDelete, setShowModalDelete] = useState(false);

    const toggleModalDelete = () => {
      setShowModalDelete(!showModalDelete);
    };

    const handleConfirmDelete = () => {
      handleDelete(blockId); // Call the handleDelete function passed as a prop
      toggleModalDelete(); // Close the modal
    };

    const handleCloseModal = () => {
      toggleModalDelete();
      handleClose(); // Call handleClose when the modal is closed
    };
  return (
    <div>
    <button className="btn btn-danger" onClick={toggleModalDelete}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>
    
    <Modal show={showModalDelete} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Block</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this List of Enrolles?</p>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="danger" onClick={handleConfirmDelete}>
          Delete
        </Button>
        <Button variant="secondary" onClick={toggleModalDelete}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
  )
}

DeleteSummer.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  blockId: PropTypes.string.isRequired
};
export default DeleteSummer