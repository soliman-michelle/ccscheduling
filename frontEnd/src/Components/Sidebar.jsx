import { FaHome, FaCalendar, FaCog} from 'react-icons/fa';
import { FaBarsProgress } from "react-icons/fa6";
import PropTypes from 'prop-types';
import AccordionDropdown from './AccordionDropdown';
import Image from '../assets/ccs.png';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Sidebar = ({ isSidebarOpen }) => {
  const [userData, setUserData] = useState(null); // State to store user data
  const dropdownItems = [
    { label: 'Prof', link: '/prof/' },
    { label: 'Room', link: '/viewroom/' },
    { label: 'Block', link: '/block/' },
    { label: 'Course', link: '/course/' },
    { label: 'Add Account', link: '/user/' },
    { label: 'Class Handle', link: '/specialization/' },
    { label: 'Summer class', link: '/summer/' },

    ];

    const reset = [
      { label: 'Password Reset', link: '/password-reset/' },
      ];

      const settings = [
        { label: 'Curriculum', link: '/curriculum/' },
        { label: 'University Info', link: '/university-info' },

        ];

        const linkStyle = {
          color: 'white',
          alignItems: 'center',
        };

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
                  <img src={`http://localhost:8081/${user.images}`} alt="Profile" style={{ width: '20px' }} />
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

  const textDisplayStyle = isSidebarOpen ? { display: 'block' } : { display: 'none' };

  const icons = {
    color: 'white',
    marginRight: '10px',
    fontSize: '24px',
  };

  const sidebarStyle = {
    display: isSidebarOpen ? 'block' : 'none',
  };
  
  const dropdownItemStyle = {
    marginBottom: '50px', // Adjust the margin as per your preference
  };

  return (
    <div className={`sidebar sidebar-style ${isSidebarOpen ? 'hide' : 'show'}`} style={sidebarStyle}>
    <div className = "sidebar-logo" style={{ backgroundColor: 'maroon'}}>
    <a href="/" className="navbar-brand d-flex align-items-center" style = {{fontSize: '30px'}}>
  <img src={Image} width="40" alt="navbar brand" className="navbar-brand align-items-center m-3"/>
        CCSched
</a>
    </div>
                  {/* Profile Picture and Name with Dropdown */}
                  
                  <div className = "container-fluid mt-3">
      <div className = "row mt-4 mb-3">
    {Array.isArray(userData) && userData.map((user) => (
                      <div key={user.user_id} className = "d-flex align-items-center">
                        <img src={`http://localhost:8081/${user.images}`} alt="Profile" className='avatar-img rounded-circle'
                                    width="50"
                                    height="50"
                        />
                        <div className='info' style={{ color: 'white', paddingLeft: '20px' }}>
                          <span><strong>{user.firstName} {user.lastName}</strong></span>
                          <br></br>
                          <span className='user-level badge bg-primary mb-2'>{user.role}</span>
                          <AccordionDropdown title="" items={reset} ></AccordionDropdown>
                          </div>
                      </div>
                    ))}
                    </div>

                  {/* Sidebar Links */}
                  <hr style = {{color: 'white'}}></hr>
                    <div  className = "row">
                    <ul className="nav flex-column">
                      <li className="sidebar-item">
                        <a className="sidebar-link d-flex" href="/" style={linkStyle}>
                          <FaHome style={icons} />
                          <span style={textDisplayStyle}>Home</span>
                        </a>
                      </li>
                      </ul>
                      <ul className="nav flex-column">
                      <li className="sidebar-item">
                        <a className="sidebar-link d-flex" href="/schedule/" style={linkStyle}>
                          <FaCalendar style={icons} />
                          <span style={textDisplayStyle}>Schedule</span>
                        </a>
                      </li>
                      </ul>
                      <ul className="nav flex-column">
                      <li className="sidebar-item d-flex justify-content-center p-2 mb-1 mt-1">
                        <a style={{linkStyle}}>
                        <FaBarsProgress style = {icons}/>
                        </a>                        
                        <AccordionDropdown title="Management" items={dropdownItems}></AccordionDropdown>
                      </li>
                      </ul>
                      <ul className="nav flex-column">
                      <li className="sidebar-item d-flex p-2 mt-1">
                        <a style={{paddingRight:'10px', color: 'white', fontSize: '24px'}}>
                          <FaCog style = {{marginLeft: '20px', marginBottom: '10px'}}/>
                          </a>
                          <AccordionDropdown title="Settings" items={settings}></AccordionDropdown>
                      </li>

                  </ul>
                  </div>
                  </div>

                  <style>
        {`
          @media (max-width: 768px) {
            .sidebar {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
};

Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
};

export default Sidebar;