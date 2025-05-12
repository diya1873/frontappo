import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/auth/authApi.js';
import './Register.css';
import { Link } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const { message } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { name, email, password };
    registerUser(dispatch, userData);

    
  // تفريغ الفورم
  setName('');
  setEmail('');
  setPassword('');
   
  };

  return (
    <div className='body-form'>
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
          required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-btn">Register</button>
        <p>Already  have an account ?  <Link className='link2' to='/login'>Login  </Link> </p>

      </form>
      {message && <p style={{ textAlign: 'center', marginTop: '15px', color: 'green' }}>{message}</p>}
    </div>
    </div>
  );
};

export default Register;
