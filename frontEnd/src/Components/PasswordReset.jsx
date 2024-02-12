import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

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

    const customStyles = {
    height: "fit-content", // Set height to fit the content
    maxWidth: "750px", // Set maximum width for the card
    margin: "auto", // Center the card horizontally
    marginTop: "calc(50vh - 150px)", // Center the card vertically
    "@media (max-width: 450px)": {
      height: "100%",
    },
  };

  const backgroundStyle = {
    backgroundImage: 'url("background.png")', // Specify the URL as a string
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    minWidth: '100vw',
    position: 'relative',
    backgroundAttachment: 'fixed',
    height: '100%!important'
  };

  return (
    <body className = "h-100"  style={backgroundStyle}>
    <div className="container" style={customStyles}>
      <div className = "pass-card card d-flex m-3">
        <div className = "card-header text-white" style = {{backgroundColor: 'maroon'}}>
      <h2><strong>Password Reset</strong></h2>
      </div>
      <div className = "card-body">
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
    </div>
    </div>
    </body>
  );
};

export default PasswordReset;