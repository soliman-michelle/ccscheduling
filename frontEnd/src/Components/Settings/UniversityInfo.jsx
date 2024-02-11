import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Modal, Form, Button, InputGroup} from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

const UniversityInfo = () => {
  const [universityLogo, setUniversityLogo] = useState(null);
  const [departmentLogo, setDepartmentLogo] = useState(null);
  const [telephoneNumber, setTelephoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [barangay, setBarangay] = useState('');
  const [province, setProvince] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [existingUniversityInfo, setExistingUniversityInfo] = useState(null);
  const [universityId, setUniversityId] = useState('');
  const handleShow = () => setShowModal(true); // Function to open modal
  const isCreating = !existingUniversityInfo || existingUniversityInfo.length === 0;
  const modalTitle = isCreating ? 'Create University Information' : 'Update University Information';
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleClose = () => {
    setShowModal(false);
    navigate('/'); // Redirect to the home page when the modal is closed
  };
  // Modify the button text based on the operation
  const buttonText = isCreating ? 'Create' : 'Update';
  useEffect(() => {
    // Fetch existing data when the component mounts
    axios.get('https://ccsched.onrender.com/university-info')
      .then(response => {
        console.log(response.data.universityInfo); // Log the received universityInfo
        setExistingUniversityInfo(response.data.universityInfo);
        if (response.data.universityInfo && response.data.universityInfo.length > 0) {
          const data = response.data.universityInfo[0];
          setUniversityId(data.id); // Assuming 'id' is the identifier for the university
          
        }
        handleShow(); // Show the modal after fetching the data
      })
      .catch(error => {
        console.error('Error fetching existing data:', error);
      });
  }, []);

  useEffect(() => {
    // Set initial values based on fetched data
    if (existingUniversityInfo  && existingUniversityInfo.length > 0) {
        const data = existingUniversityInfo[0]; // Access the first item assuming there's only one entry
      setDepartmentLogo(data.departmentLogo || '');
      setUniversityLogo(data.universityLogo || '');
      setSchoolName(data.schoolName || '');
      setTelephoneNumber(data.telephoneNumber || '');
      setAddress(data.address || '');
      setBarangay(data.barangay || '');
      setProvince(data.province || '');
      // Set other fields accordingly
    }
  }, [existingUniversityInfo]);
  
  // Modify the file change handlers to handle null values when a file isn't selected
  const handleUniversityLogoChange = (e) => {
    const file = e.target.files[0];
    setUniversityLogo(file); // Set the state directly with the file object
  };
  
  const handleDepartmentLogoChange = (e) => {
    const file = e.target.files[0];
    setDepartmentLogo(file); // Set the state directly with the file object
  };
  

  const handleTelephoneNumberChange = (e) => {
    setTelephoneNumber(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleBarangayChange = (e) => {
    setBarangay(e.target.value);
  };

  const handleProvinceChange = (e) => {
    setProvince(e.target.value);
  };

  const handleSchoolNameChange = (e) => {
    setSchoolName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('universityLogo', universityLogo); // Append the file object
    formData.append('departmentLogo', departmentLogo); // Append the file object
    formData.append('telephoneNumber', telephoneNumber);
    formData.append('address', address);
    formData.append('barangay', barangay);
    formData.append('province', province);
    formData.append('schoolName', schoolName);
    // Check if it's an update operation and append universityId if available
    if (!isCreating) {
      formData.append('universityId', universityId);
    }

    for (var pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    // Send the formData to your backend API using fetch or Axios
    fetch('https://ccsched.onrender.com/university-info/createOrUpdate', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log(data); 
        })
        .catch((error) => {
            console.error('Error:', error); // Log the general error if response.data is unavailable
        });
    };


      const handleImageClick = (imageType) => {
        // Find the input element corresponding to the clicked image
        const inputElement = document.getElementById(`${imageType}`);
        if (inputElement) {
          inputElement.click(); // Trigger a click event on the input element
        }
      };
      
      
  return (
    <div>
    <Modal show={showModal} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
     
       <div className='container-fluid'>
       <Form encType="multipart/form-data">
       <div className='row'>
        <div className='col-md-6'>
          <Form.Group>
            <InputGroup className="mb-2">
              {existingUniversityInfo && existingUniversityInfo.length > 0 ? (
                existingUniversityInfo.map((data) => (
                  <div key={data.id}>
                    <label htmlFor="universityLogo">
                      <img
                        src={`https://ccsched.onrender.com/${data.universityLogo}`}
                        alt="University Logo"
                        id="universityLogo"
                        name='universityLogo'
                        style={{ maxWidth: '100px', cursor: 'pointer' }}
                        onClick={() => handleImageClick('universityLogo')}
                      />
                    </label>
                    <input
                      type="file"
                      id="universityLogoInput"
                      name='universityLogo'
                      style={{ display: 'none' }}
                      onChange={(e) => handleUniversityLogoChange(e)}
                      />
                  </div>
                ))
              ) : (
                <Form.Group>
          <Form.Label>University Logo</Form.Label>
              <InputGroup className="mb-2">
                <Form.Control
                   type="file"
                   className="form-control"
                   id="universityLogo"
                   name='universityLogo'
                   accept="image/*"
                   onChange={handleUniversityLogoChange}
                   required
                />
              </InputGroup>
            </Form.Group>
              )}
            </InputGroup>
          </Form.Group>
        </div>
        <div className='col-md-6'>
          <Form.Group>
            <InputGroup className="mb-2">
              {existingUniversityInfo && existingUniversityInfo.length > 0 ? (
                existingUniversityInfo.map((data) => (
                  <div key={data.id}>
                    <label htmlFor="departmentLogo">
                      <img
                        src={`https://ccsched.onrender.com/${data.departmentLogo}`}
                        alt="Department Logo"
                        name='departmentLogo'
                        id="departmentLogo"
                        style={{ maxWidth: '100px', cursor: 'pointer' }}
                        onClick={() => handleImageClick('departmentLogo')}
                      />
                    </label>
                    <input
                      type="file"
                      id="departmentLogoInput"
                      name='departmentLogo'
                      style={{ display: 'none' }}
                      onChange={(e) => handleDepartmentLogoChange(e)}
                      />
                  </div>
                ))
              ) : (
                <Form.Group>
          <Form.Label>Department Logo</Form.Label>
              <InputGroup className="mb-2">
                <Form.Control
                   type="file"
                   className="form-control"
                   name='departmentLogo'
                   id="departmentLogo"
                   accept="image/*"
                   onChange={handleDepartmentLogoChange}
                   required
                />
              </InputGroup>
            </Form.Group>
              )}
            </InputGroup>
          </Form.Group>
        </div>
              </div>
        <Form.Group>
          <Form.Label>School Name</Form.Label>
              <InputGroup className="mb-2">
                <Form.Control
                  type="text"
                  className="form-control"
                  id="schoolName"
                  value={schoolName}
                  onChange={handleSchoolNameChange}
                  required
                />
              </InputGroup>
            </Form.Group>
            <Form.Group>
        <Form.Label>Address</Form.Label>
          <InputGroup className="mb-2 mt-2">
            <Form.Control
               type="text"
               className="form-control"
               id="address"
               value={address}
               onChange={handleAddressChange}
               required
            />
            </InputGroup>
          </Form.Group>
          <div className='row'>
          <div className='col-md-6'>
          <Form.Group>
          <Form.Label>Province</Form.Label>
           <InputGroup className="mb-2">
            <Form.Control
              type="text"
              className="form-control"
              id="province"
              value={province}
              onChange={handleProvinceChange}
              required
            />
            </InputGroup>
          </Form.Group>
          </div>
          <div className='col-md-6'>
          <Form.Group>
          <Form.Label>Barangay</Form.Label>
           <InputGroup className="mb-2">
            <Form.Control
              type="text"
              className="form-control"
              id="barangay"
              value={barangay}
              onChange={handleBarangayChange}
              required
            />
            </InputGroup>
          </Form.Group>
          </div>
        </div>
        <Form.Group>
          <Form.Label>Tel No.</Form.Label>
            <InputGroup className="mb-2">
              <Form.Control
               type="text"
               className="form-control"
               id="telephoneNumber"
               value={telephoneNumber}
               onChange={handleTelephoneNumberChange}
               required
            />
              </InputGroup>
          </Form.Group>
        </Form>
       </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
        {buttonText}
        </Button>

      </Modal.Footer>
    </Modal>
  </div>
  );
};

export default UniversityInfo;
