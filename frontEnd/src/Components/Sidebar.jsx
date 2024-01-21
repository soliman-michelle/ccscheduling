import { FaHome, FaCalendar, FaCog} from 'react-icons/fa';
import PropTypes from 'prop-types';
import AccordionDropdown from './AccordionDropdown';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Sidebar = ({ isSidebarOpen }) => {
  const [userData, setUserData] = useState(null); // State to store user data
  const dropdownItems = [
    { label: 'Room', link: '/viewroom/' },
    { label: 'Block', link: '/block/' },
    { label: 'Course', link: '/course/' },
    { label: 'Add Account', link: '/user/' },
    { label: 'Prof', link: '/prof/' },
    { label: 'Class Handle', link: '/specialization/' },
    ];

    const reset = [
      { label: 'Password Reset', link: '/password-reset/' },
      ];

      const settings = [
        { label: 'Curriculum', link: '/curriculum/' },
        { label: 'University Info', link: '/university-info' },

        ];

  const linkStyle = {
    color: 'gray',
    display: 'flex',
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
    color: 'gray',
    marginRight: '20px',
  };

  return (
    <div className='sidebar sidebar-style-2'>
      <div className='scroll-wrapper sidebar-wrapper scrollbar scrollbar-inner'>
        <div className='sidebar-wrapper scrollbar scrollbar-inner scroll content'>
            <div className='sidebar-content'>
              <div className='user'>
                <div className="avaratar-sm float-left mr-2">
                  {/* Profile Picture and Name with Dropdown */}
                  
                  {Array.isArray(userData) && userData.map((user) => (
                    <div key={user.user_id}>
                      <img src={`http://localhost:8081/${user.images}`} alt="Profile" className='avatar-img rounded-circle'/>
                      <div className='info'>
                        <span>{user.firstName} {user.lastName}</span>
                        <br></br>
                        <span className='user-level'>{user.role}</span>
                        <AccordionDropdown title="" items={reset} ></AccordionDropdown>
                        </div>
                    </div>
                  ))}

                  {/* Sidebar Links */}
                  <ul className="nav flex-column mt-4">
                    <li className="nav-item">
                      <a className="nav-link" href="/" style={linkStyle}>
                        <FaHome style={icons} />
                        <span style={textDisplayStyle}>Home</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/schedule/" style={linkStyle}>
                        <FaCalendar style={icons} />
                        <span style={textDisplayStyle}>Schedule</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <AccordionDropdown title="Management" items={dropdownItems} ></AccordionDropdown>
                    </li>
                <li className="nav-item">
                        <FaCog style={icons} />
                        <AccordionDropdown title="Settings" items={settings} ></AccordionDropdown>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
};

export default Sidebar;