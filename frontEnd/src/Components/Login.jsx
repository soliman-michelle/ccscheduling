import 'bootstrap/dist/css/bootstrap.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LogIn = () => {
  const [values, setValues] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = values;
    let errors = {};

    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    // Username alphanumeric validation
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(username)) {
      errors.username = 'Username should contain only alphanumeric characters';
    }
  
    if (Object.keys(errors).length === 0) {
      axios.post('https://ccsched.onrender.com/userlogin', values)
        .then((res) => {
          if (res.data.Status === 'Success') {
            // Save token to localStorage
            localStorage.setItem('token', res.data.token);

            // Redirect to home page
            navigate('/');
          } else {
            alert('No data exist!');
          }
        })
        .catch((error) => {
          // Handle login errors
          if (error.response) {
            console.error('Login error:', error.response.data);
            setErrors({ loginError: error.response.data.error });
          } else if (error.request) {
            console.error('No response received:', error.request);
            setErrors({ loginError: 'No response from server' });
          } else {
            console.error('Request setup error:', error.message);
            setErrors({ loginError: 'Error setting up request' });
          }
        });
    } else {
      setErrors(errors);
    }
  };    

  const backgroundStyle = {
    backgroundImage: 'url("background.png")',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    minWidth: '100vw',
  };

  const labelStyle = {
    fontWeight: '600',
    fontSize: '18px'
  };

  return (
    <div className="container" style={backgroundStyle}>
      <div className="row justify-content-center align-items-center" >
        <div className="col-md-7">
          <h2 className="display-3 text-center text-white mb-1"><b>CCSched</b></h2>
          <h2 className="text-center text-white mb-0">Scheduling Management System</h2>
        </div>
        <div className="col-md-5 mt-5 mb-5">
          <div className="bg-light p-4 rounded" >
            <h2 className="text-center">CCS Scheduling Management System</h2>
            <hr />
            <h2 className="text-center text-danger">FACULTY</h2>
            <hr />
            <form action="" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username" style={labelStyle}>Username</label>
                <input onChange={handleInput} type="text" className="form-control" name="username" autoComplete="off" placeholder="Enter your username"/>
                {errors.username && <span className="text-danger">{errors.username}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="password" style={labelStyle}>Password</label>
                <input onChange={handleInput} type="password" className="form-control" name='password' placeholder="Enter your password" />
                {errors.password && <span className="text-danger">{errors.password}</span>}
              </div>

              <div className='text-center mt-3'>
                <button type="submit" className="btn btn-danger btn-block mt-2">Login</button>
              </div>
              <a href="/forgot-password" className="btn btn-light btn-block">Forgot Password</a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
