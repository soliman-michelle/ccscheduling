import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useParams } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const NewPassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const { username } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleOldPassword = (event) => {
    setOldPassword(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    // Check if passwords match before proceeding
    if (password === confirmPassword) {
      try {
        // Verify the old password before changing the password
        const oldPasswordResponse = await fetch('http://localhost:8081/verify-old-password/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, oldPassword }), // Send username and old password in the body
        });
  
        if (!oldPasswordResponse.ok) {
          throw new Error('Failed to verify old password');
        }
  
        // Proceed to change the password if old password verification succeeds
        const newPasswordResponse = await fetch('http://localhost:8081/reset-password/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, oldPassword, newPassword: password }), // Send username, old password, and new password in the body
        });
  
        if (!newPasswordResponse.ok) {
          throw new Error('Failed to update password');
        }
  
        // Password updated successfully
        setPasswordUpdated(true);
      } catch (error) {
        console.error('Error updating password:', error);
        // Handle the error, show a message to the user, etc.
      }
    } else {
      // Passwords don't match
      setPasswordsMatch(false);
    }
  };

  return (
    <div className="h-100">
    <div className="wrapper">
    <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className = "main">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}/>

        <div className="container-fluid">
    <div className="container mt-5 mb-4">
    <div className = "card card-body p-5 shadow p-3 mb-5 bg-white rounded" style = {{backgroundImage: "url('/pass.png')", backgroundSize: 'cover'}}>
      <h2><strong>Reset Password</strong></h2>
      {passwordUpdated ? (
        <p className="text-success">Password updated successfully!</p>
      ) : (
        <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
            <label htmlFor="oldPassword" className="form-label">
              Current Password:
            </label>
            <input
              type="password"
              className="form-control"
              id="oldPassword"
              name="oldPassword" // Add name attribute for identification in backend
              placeholder="Enter your old password"
              value={oldPassword}
              onChange={handleOldPassword}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              New Password:
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password" // Add name attribute for identification in backend
              placeholder="Enter your new password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password:
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword" // Add name attribute for identification in backend
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            {!passwordsMatch && (
              <p className="text-danger mt-1">Passwords do not match</p>
            )}
          </div>
          <button type="submit" className="btn btn-primary">
            Reset Password
          </button>
        </form>
      )}
      </div>
      </div>
    </div>
    </div>
      </div>
      </div>
  );
};

export default NewPassword;
