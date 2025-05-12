import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authApi'; // استدعاء دالة loginUser
import './Login.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const { message } = useSelector((state) => state.auth); // جلب الرسالة من الـ Redux
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = { email, password };
    loginUser(dispatch, userData); // الاتصال مع الـ API

    setEmail('');
    setPassword('');
  };

  return (
    <div className='body-login'>
      <div className="form-container-login">
        <h2>Login</h2>
        
    
        <form onSubmit={handleSubmit}>
          <div className="form-group-login">
            <label>Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group-login">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Link className='link' state={{color:'white',marginTop:'-10px'}} to='/forgotPassword'>forgot password? </Link>
          <button type="submit" className="submit-btn-login">Login</button>
         
          <p>Dont have an account ?  <Link className='link2' to='/register'>Register  </Link> </p>
        </form>
        {message && <p style={{ textAlign: 'center', marginTop: '15px', color: 'red' }}>{message}</p>}
      </div>
    </div>
  );
};

export default Login;
