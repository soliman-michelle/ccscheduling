import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

function ResetModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleReset = () => {
    axios.put('https://ccsched.onrender.com/summer_sched/reset') // Make API call to reset endpoint
      .then(response => {
        console.log(response.data); 
        handleClose(); 
      })
      .catch(error => {
        console.error('Error resetting schedule:', error);
      });
  };

  return (
    <>
      <div className="col-md-3">
        <Button variant="danger" onClick={handleShow}>Reset</Button>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Reset</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to reset the summer schedule?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleReset}>
            Reset
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ResetModal;
