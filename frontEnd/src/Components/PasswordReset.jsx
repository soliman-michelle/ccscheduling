import { useState } from 'react';

const PasswordReset = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    try {
      const response = await fetch('https://ccsched.onrender.com/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccessMessage('Reset password email sent successfully');
        setTimeout(() => setSuccessMessage(''), 3000); // Hide after 3 seconds
      } else if (response.status === 404) {
        setErrorMessage('Email does not exist in the database');
        setTimeout(() => setErrorMessage(''), 3000); 
      } else {
        throw new Error('Error sending request');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" />
          <div id="emailHelp" className="form-text">We never share your email with anyone else.</div>
        </div>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default PasswordReset;
