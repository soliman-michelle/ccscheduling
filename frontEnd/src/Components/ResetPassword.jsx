import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useParams } from 'react-router-dom'; // Import the necessary module for getting URL parameters

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const { token } = useParams(); // Get the token from the URL using React Router

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
        const response = await fetch(`http://localhost:8081/reset-password/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newPassword: password }),
        });

        if (!response.ok) {
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
    <div className="container mt-5">
      <h2>Reset Password</h2>
      {passwordUpdated ? (
        <p className="text-success">Password updated successfully!</p>
      ) : (
        <form onSubmit={handleFormSubmit}>
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
  );
};

export default ResetPassword;
