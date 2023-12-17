import 'bootstrap/dist/css/bootstrap.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LogIn = () => {
  const [values, setValues] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
  
    if (token) {
      navigate('/'); // Redirect to home if token exists
    }
  }, [navigate]);
  

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
      axios.post('http://localhost:8081/userlogin', values)
      .then((res) => {
        if (res.data.Status === 'Success') {
          // Fetch user data based on the userId
          axios.get(`http://localhost:8081/userdata/${username}`)
            .then((response) => {
              // Store user data in local storage or state management
              localStorage.setItem('userData', JSON.stringify(response.data));
              // Redirect to home page or perform other actions
              navigate('/');
            })
            .catch((error) => {
              console.error('Error fetching user data:', error);
            });
        } else {
          alert('No data exist!');
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
      });
    
    } else {
      setErrors(errors);
    }
  };
  const backgroundStyle = {
    backgroundImage: 'url("background.png")', // Specify the URL as a string
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    minWidth: '100vw',
  };

  const labelStyle = {
    fontWeight: '600', // Make the labels bold
    fontSize: '18px'
  };

  return (
    <div className="container" style={backgroundStyle}>
      <div className="row justify-content-center align-items-center" >
        <div className="col-md-7">
          <h2 className="display-3 text-center text-white mb-1"><b>CCSched</b></h2>
          <h2 className="text-center text-white mb-0">Scheduling Management System</h2>
        </div>
        <div className="col-md-5">
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

              <div className="form-group">
              <label htmlFor="semester" style={labelStyle}>Semester</label>
              <select onChange={handleInput} className="form-control" name='semester'>
                <option value="">Select Semester</option>
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
              </select>
              {errors.semester && <span className="text-danger">{errors.semester}</span>}
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
