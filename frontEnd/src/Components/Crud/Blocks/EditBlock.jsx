import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Modal, Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types'; // Import PropTypes
import axios from 'axios';
const EditBlock = ({ show, handleClose, selectedBlock, onEdit }) => {
  const [editedBlock, setEditedBlock] = useState({
    program: selectedBlock.program,
    firstYear: String(selectedBlock.firstYear),
    secondYear: String(selectedBlock.secondYear),
    thirdYear: String(selectedBlock.thirdYear),
    fourthYear: String(selectedBlock.fourthYear),
    total: String(selectedBlock.total),
  });
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [error, setError] = useState('');
  const [isProgramValid, setIsProgramValid] = useState(true);

  
  const toggleModal = () => {
    handleClose();
  };

  useEffect(() => {
    // Reset validation when the modal is opened
    if (show) {
      setIsProgramValid(true);
    }
  }, [show]);

  useEffect(() => {
    // Calculate the total whenever any of the input fields change
    const {firstYear, secondYear, thirdYear, fourthYear } = editedBlock;
    const newTotal =
      parseInt(firstYear) +
      parseInt(secondYear) +
      parseInt(thirdYear) +
      parseInt(fourthYear);

    // Update the total in the editedBlock state
    setEditedBlock({
      ...editedBlock,
      total: String(newTotal),
    });
    
  }, [editedBlock, editedBlock.firstYear, editedBlock.secondYear, editedBlock.thirdYear, editedBlock.fourthYear]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const {program, firstYear, secondYear, thirdYear, fourthYear } = editedBlock;

    if (!firstYear || !secondYear || !thirdYear || !fourthYear) {
      setError('All fields are required.');
      setShowErrorAlert(true);
      return; // Prevent form submission if any field is empty
    }

    if (!/^\d+$/.test(firstYear) || !/^\d+$/.test(secondYear) || !/^\d+$/.test(thirdYear) || !/^\d+$/.test(fourthYear)) {
      setError('Can only accept numbers and non-negative.');
      setShowErrorAlert(true);
      return; // Prevent form submission if any field has non-numeric characters
    }

    if (parseInt(firstYear) > 10 || parseInt(secondYear) > 10 || parseInt(thirdYear) > 10 || parseInt(fourthYear) > 10) {
      setError('Each Year Level should not exceed 10 blocks.');
      setShowErrorAlert(true);
      return;
    }

    try {
      // Check if the room name already exists (after normalizing room names)
      const response = await axios.get(`http://localhost:8081/block/check/${program}`);
  
      if (response.data.exists && program !== selectedBlock.program) {
        // If room exists and it's not the same as the original name, show the alert
        setIsProgramValid(false);
        return;
      } else {
      await onEdit(selectedBlock.id, editedBlock);
      toggleModal();
      setShowSuccessAlert(true);
        setShowErrorAlert(false); // Make sure to hide the error alert on successful update
    }
   } catch (error) {
      setError('Failed to update department block.');
      setShowErrorAlert(true);
      setShowSuccessAlert(false); // Hide the success alert on failed update
    }
  };

  return (
    <div>
      <Modal show={show} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Departamental Block</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
          <Form.Group controlId="program">
          <Form.Label>Program</Form.Label>

          <Form.Control
              type="text"
              placeholder="Program"
              value={editedBlock.program}
              className={`mb-2 ${isProgramValid ? '' : 'is-invalid'}`}
              onChange={(e) =>
                setEditedBlock({
                  ...editedBlock,
                  program: e.target.value,
                })
              }
            />
            <Form.Control.Feedback type="invalid">
                This program is already exists.
              </Form.Control.Feedback>
          </Form.Group>


          <Form.Group controlId="firstYear">
            <Form.Label>First Year</Form.Label>
            <Form.Control
              type="number"
              placeholder="No. First Year"
              value={editedBlock.firstYear}
              className='mb-2'
              onChange={(e) =>
                setEditedBlock({
                  ...editedBlock,
                  firstYear: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group controlId="secondYear">
            <Form.Label>Second Year</Form.Label>
            <Form.Control
              type="number"
              placeholder="No. Second Year"
              value={editedBlock.secondYear}
              className='mb-2'
              onChange={(e) =>
                setEditedBlock({
                  ...editedBlock,
                  secondYear: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group controlId="thirdYear">
            <Form.Label>Third Year</Form.Label>
            <Form.Control
              type="number"
              placeholder="No. Third Year"
              value={editedBlock.thirdYear}
              className='mb-2'
              onChange={(e) =>
                setEditedBlock({
                  ...editedBlock,
                  thirdYear: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group controlId="fourthYear">
            <Form.Label>Fourth Year</Form.Label>
            <Form.Control
              type="number"
              placeholder="No. Fourth Year"
              value={editedBlock.fourthYear}
              className='mb-2'
              onChange={(e) =>
                setEditedBlock({
                  ...editedBlock,
                  fourthYear: e.target.value,
                })
              }
            />
          </Form.Group>

            <Form.Group controlId="total">
              <Form.Label>Total</Form.Label>
              <Form.Control
                type="number"
                placeholder="Total"
                value={editedBlock.total}
                disabled
              />
            </Form.Group>

            <Modal.Footer>
            <Button variant="primary" type="submit">
              Save
            </Button>
            <Button variant="secondary" onClick={toggleModal}>
              Close
            </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Error alert for failed update */}
      <Modal show={showErrorAlert} onHide={() => setShowErrorAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowErrorAlert(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success alert for successful update */}
      <Modal show={showSuccessAlert} onHide={() => setShowSuccessAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Department Block updated successfully!</p>
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
EditBlock.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedBlock: PropTypes.object.isRequired, // Change this line
  onEdit: PropTypes.func.isRequired
};

export default EditBlock;
