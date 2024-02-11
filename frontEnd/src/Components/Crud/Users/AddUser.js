import { useState, useEffect } from 'react';
import {  Modal, Form, Button, InputGroup} from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AddUser = ({ show, handleClose, handleAdd }) => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // Define role state
  const [roleData, setRoleData] = useState([]);
  const [images, setImages] = useState(null); // Use null to initialize images
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState('');
  const [showUserExistsAlert, setShowUserExistsAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // State for success alert
  
  const handleFormSubmit = async () => {
    // Validate required fields
    const newErrors = {};

  if (!firstName) {
    newErrors.firstName = 'Please enter First Name';
    setErrors('All fields are required.');  
  }

  if (!/^[a-zA-Z\s-]*$/.test(firstName)) {
    newErrors.firstName = 'First Name cannot contain special characters or numbers except "-"';
    setShowAlert(true);
  }
  if (!middleName) {
    newErrors.middleName = 'Please enter Middle Name';
  }
  if (!/^[a-zA-Z\s-]*$/.test(middleName)) {
    newErrors.middleName = 'Middle Name cannot contain special characters or numbers except "-"';
    setShowAlert(true);
  }

  if (!lastName) {
    newErrors.lastName = 'Please enter Last Name';
  }
  if (!/^[a-zA-Z\s-]*$/.test(lastName)) {
    newErrors.lastName = 'Last Name cannot contain special characters or numbers except "-"';
    setShowAlert(true);
  }

  const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
  if (!email) {
    newErrors.email = 'Please enter Email';
    setShowAlert(true);
  } else if (!emailRegex.test(email) || !email.endsWith('@gmail.com')) {
    newErrors.email = 'Please enter a valid Gmail address';
    setShowAlert(true);
  }

  if (!images) {
    newErrors.images = 'Please Upload Image';
    setShowAlert(true);

  }

  if (!username) {
    newErrors.username = 'Please enter Username';
    setShowAlert(true);

  }

  if (!password) {
    newErrors.password = 'Please enter Password';
    setShowAlert(true);

  }

  if (!role) {
    newErrors.role = 'Please select Role';
    setShowAlert(true);

  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('middleName', middleName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('role', role);
  
    if (images) {
      formData.append('images', images);
    }
  
    try {
      // Check if the user already exists
      const response = await axios.get(`https://ccsched.onrender.com/user/check/${email}/${username}/${firstName}/${lastName}`);

      if (response.data.exists) {
        setShowUserExistsAlert(true);
      } else {
      const response = await axios.post('https://ccsched.onrender.com/user/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const newUser = response.data;
  
      handleAdd(newUser);
  
      handleClose();
      setShowSuccessAlert(true);

    }
    } catch (error) {
      console.error(error);
      setErrors('An error occurred while saving the user.');
    }
  };
  
  
  useEffect(() => {
    // Fetch role data from the server
    axios.get('https://ccsched.onrender.com/user/roles')
      .then((response) => {
        setRoleData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Use useEffect to clear the input fields when the modal is shown
  useEffect(() => {
    if (show) {
      setFirstName('');
      setMiddleName('');
      setLastName('');
      setEmail('');
      setUsername('');
      setPassword('');
      setRole('');
      setImages(null); // Reset images to null when the modal is shown
      setError('');
      setShowAlert(false);
      setShowUserExistsAlert(false);
      setShowSuccessAlert(false);
    }
  }, [show]);

  return (
    <div>
      <Button variant="primary" onClick={handleClose}>
      <FontAwesomeIcon icon={faPlus} /> Add User
      </Button>
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <div className='container-fluid'>
         <Form encType="multipart/form-data">
          <div className='row'>
            <div className='col-md-4'>
            <Form.Group controlId="firstName">
                <InputGroup className="mb-2">
                  <Form.Control
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className={errors.firstName ? 'is-invalid' : ''}
                  />
                </InputGroup>
              </Form.Group>
            </div>
            <div className='col-md-4'>
            <Form.Group controlId="middleName">
                <InputGroup className="mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Middle name"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    required
                    className={errors.middleName ? 'is-invalid' : ''}
                  />
                </InputGroup>
              </Form.Group>
            </div>
            <div className='col-md-4'>
            <Form.Group controlId="lastName">
                <InputGroup className="mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className={errors.lastName ? 'is-invalid' : ''}
                  />
                </InputGroup>
              </Form.Group>
            </div>
          </div>

            <Form.Group controlId="images">
              <InputGroup className="mb-2">
                <Form.Control
                type="file"
                name="images"
                accept=".jpeg, .jpg, .png"
                className={errors.lastName ? 'is-invalid' : ''}
                onChange={(e) => setImages(e.target.files[0])}
                required
              />
                </InputGroup>
            </Form.Group>

            <Form.Control controlId="role" as="select" value={role} required onChange={(e) => setRole(e.target.value)}  className={errors.lastName ? 'is-invalid' : ''}>
            <option value="">Select Role</option>
            {roleData.map((role) => (
              <option key={role.role_id} value={role.role}>
                {role.role}
              </option>
            ))}
          </Form.Control>

          <Form.Group controlId="username">
            <InputGroup className="mb-2 mt-2">
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                className={errors.username ? 'is-invalid' : ''}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="password">
             <InputGroup className="mb-2">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                className={errors.password ? 'is-invalid' : ''}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="email">
             <InputGroup className="mb-2">
              <Form.Control
                type="text"
                placeholder="Email"
                value={email}
                className={errors.email ? 'is-invalid' : ''}
                onChange={(e) => setEmail(e.target.value)}
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
          <Button variant="primary" onClick={handleFormSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
        {/* Alert dialog for Room existed */}
        <Modal show={showUserExistsAlert} onHide={() => setShowUserExistsAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Duplicate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The User already exists.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowUserExistsAlert(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>


        {/* All errors */}
        <Modal show={showAlert} onHide={() => setShowAlert(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Invalid</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {Object.keys(errors).map((key) => (
      <p key={key} style={{ color: 'red', marginBottom: '10px' }}>{errors[key]}</p>
    ))}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="primary" onClick={() => setShowAlert(false)}>
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
          <p>User Account successfully added!</p>
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

export default AddUser;

