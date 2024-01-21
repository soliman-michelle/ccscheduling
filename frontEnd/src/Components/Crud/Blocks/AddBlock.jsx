import { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types'; // Import PropTypes

const AddBlock = ({show, handleClose, handleAdd}) => {
    const [program, setProgram] = useState('');
    const [firstYear, setFirstYear] = useState('');
    const [secondYear, setSecondYear] = useState('');
    const [thirdYear, setThirdYear] = useState('');
    const [fourthYear, setFourthYear] = useState('');
    const [total,setTotal] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [error, setError] = useState('');
    const [showBlockExistsAlert, setShowBlockExistsAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false); // State for success alert

    useEffect(() => {
      if (show) {
        setProgram('');
        setFirstYear('');
        setSecondYear('');
        setThirdYear('');
        setFourthYear('');
        setTotal('');
        setError('');
        setShowErrorAlert(false);
        setShowBlockExistsAlert(false);
        setShowSuccessAlert(false);
      }
    }, [show]);
    useEffect(() => {
        // Parse the values as integers (or 0 if empty/invalid)
        const firstYearValue = parseInt(firstYear) || 0;
        const secondYearValue = parseInt(secondYear) || 0;
        const thirdYearValue = parseInt(thirdYear) || 0;
        const fourthYearValue = parseInt(fourthYear) || 0;
    
        // Calculate the total
        const newTotal =
          firstYearValue + secondYearValue + thirdYearValue + fourthYearValue;
    
        // Update the total state
        setTotal(newTotal.toString()); // Convert the total back to a string

      }, [firstYear, secondYear, thirdYear, fourthYear]);

      const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!program || !firstYear || !secondYear || !thirdYear || !fourthYear) {
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
          const response = await axios.get(`http://localhost:8081/blocks/check/${program}`);
          if (response.data.exists) {
            setShowBlockExistsAlert(true);
          } else {
            const newBlock = {
              program,
              firstYear,
              secondYear,
              thirdYear,
              fourthYear,
              total,
            };
          await axios.post('http://localhost:8081/blocks/create', newBlock);
          handleAdd(newBlock);
          handleClose();
          setShowSuccessAlert(true);

          }
        } catch (error) {
          console.error(error);
        }
      };
  return (
    <div>
      <Button variant="primary" onClick={handleClose}>
        <FontAwesomeIcon icon={faPlus}/>Add Departamental Block
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Block</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Form.Group controlId="program">
          {/* <Form.Label>Program</Form.Label> */}
          <Form.Select
            name="program" // Add name attribute
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            className='mb-2'
          >
            <option value="" disabled>Select Program</option>
            <option value="BSCS">BSCS</option>
            <option value="BSCS-DS">BSCS-DS</option>
            <option value="BSIT-BA">BSIT-BA</option>
            <option value="BSIT-SD">BSIT-SD</option>
          </Form.Select>
        </Form.Group>

            <Form.Group controlId="firstYear">
              {/* <Form.Label>First Year</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="No. of firstYear"
                value={firstYear}
                onChange={(e) => setFirstYear(e.target.value)}
                className='mb-2'
              />
            </Form.Group>

            <Form.Group controlId="secondYear">
              {/* <Form.Label>Second Year</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="No. of Second Year"
                value={secondYear}
                onChange={(e) => setSecondYear(e.target.value)}
                className='mb-2'
              />
            </Form.Group>

            <Form.Group controlId="thirdYear">
              {/* <Form.Label>Third Year</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="No. of thirdYear"
                value={thirdYear}
                className='mb-2'
                onChange={(e) => setThirdYear(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="fourthYear">
              {/* <Form.Label>Fourth Year</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="No. of Fourth Year"
                value={fourthYear}
                className='mb-2'
                onChange={(e) => setFourthYear(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="total">
              {/* <Form.Label>Total</Form.Label> */}
              <Form.Control
                type="number"
                disabled
                value={total}
                className='mb-2'
                onChange={(e) => setTotal(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={handleFormSubmit}>
            Save
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Alert dialog for Room existed */}
      <Modal show={showBlockExistsAlert} onHide={() => setShowBlockExistsAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Duplicate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The Department <strong>{program}</strong> already exists.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowBlockExistsAlert(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>


        {/* All errors */}
      <Modal show={showErrorAlert} onHide={() => setShowErrorAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Invalid</Modal.Title>
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

       {/* Success alert for successfully added room */}
       <Modal show={showSuccessAlert} onHide={() => setShowSuccessAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Block successfully added!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessAlert(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
AddBlock.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
};
export default AddBlock;