const PasswordReset = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
  
    try {
      const response = await fetch('http://localhost:8081/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      console.log(data); // Handle the response accordingly (success/error)
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
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default PasswordReset;
