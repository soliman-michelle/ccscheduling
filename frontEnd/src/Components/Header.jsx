import { useState , useEffect} from 'react';
import { FaBars, FaEllipsisV } from 'react-icons/fa'; // Import FaTimes for the close icon
import Image from '../assets/ccs.png';
import PropTypes from 'prop-types'; // Import prop-types
import { Dropdown, Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userData, setUserData] = useState(null); // State to store user data

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (token) {
      axios.get('http://localhost:8081/', { withCredentials: true })
        .then(response => {
          const username = response.data.username;
          // Fetch user's data including image URL by username
          axios.get(`http://localhost:8081/userdata/${username}`)
            .then(userDataResponse => {
              // Assuming you have stored user data in state
              setUserData(userDataResponse.data);
  
              // Display the image
              if (Array.isArray(userDataResponse.data) && userDataResponse.data.length > 0) {
                const user = userDataResponse.data[0];
                // Assuming you have an <img> tag for displaying the image
                return (
                  <img src={`http://localhost:8081/${user.images}`} alt="Profile" style={{ width: '50px' }} />
                );
              }
            })
            .catch(error => {
              console.error('User data fetch error:', error);
            });
        })
        .catch(error => {
          console.error('User fetch error:', error);
        });
    }
  }, []);
  

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    axios.get('http://localhost:8081/logout') // Create a route to handle logout
      .then(() => {
        localStorage.removeItem('userData'); // Remove stored user data
        window.location.href = '/login'; // Redirect to the login page
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };
  
  Header.propTypes = {
    toggleSidebar: PropTypes.func.isRequired, 
    isSidebarOpen: PropTypes.bool.isRequired, 
  };
  return (
    <div className="main-header " style={{ backgroundColor: 'maroon'}}>
  <div className='d-flex justify-content-between align-items-center'>
  <div className="logo-header d-flex align-items-center" style={{ marginLeft: '30px' }}>
  {isSidebarOpen && (
    <a href="/" className="navbar-brand d-flex align-items-center">
      <img src={Image} width="40" alt="navbar brand" className="navbar-brand" />
      <b className="text-light h2 align-middle mx-2">CCSched</b>
    </a>
  )}
  <button className='navbar-toggler' onClick={toggleSidebar} style={{ marginLeft: '10px' }}>
    {isSidebarOpen ? (
      <FaBars style={{ color: 'white', width: '40px', height: '30px ' }} />
    ) : (
      <FaEllipsisV style={{ color: 'white', width: '40px', height: '30px ' }} />
    )}
  </button>
</div>

   
  <div className='navbar-expand-lg ml-auto'>
  <nav className='navbar navbar-header navbar-expand-lg'>
      <div className='container-fluid'>
        <ul className='navbar-nav topbar-nav ml-md-auto align-items-center'>
        <li>
    <Dropdown show={isDropdownOpen} onToggle={toggleDropdown}>
     <Dropdown.Toggle id="dropdown-basic" className="custom-dropdown-toggle" style={{border: 'none'}}>
     {Array.isArray(userData) && userData.map((user) => (
          <div key={user.user_id}>
            <img src={`http://localhost:8081/${user.images}`} alt="Profile" style={{width: '50px'}} />
            <span>{user.firstName} {user.lastName} | {user.role}</span>
          </div>
        ))}
      </Dropdown.Toggle>
      <Dropdown.Menu>
          <Dropdown.Item onClick={() => setShowLogoutModal(true)}>Log out</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
  </li>
        </ul>
      </div>
  </nav>
  </div>

  </div>
 {/* Logout confirmation modal */}
 <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
        <Button variant="danger" onClick={handleLogout}>
            Yes
          </Button>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Close
          </Button>
          
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Header;