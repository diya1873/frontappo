import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false); // حالة لتتبع حالة التحقق
  const [error, setError] = useState(false); // حالة جديدة لتتبع إذا كان هناك خطأ
  const token = searchParams.get('token'); // جلب التوكن من الرابط

  const navigate = useNavigate(); // لتمكين التنقل بين الصفحات

  const verifyEmail = async () => {
    if (!token) {
      setMessage('No token provided.');
      return;
    }

    if (isVerified) {
      setMessage('Your email has already been verified.');
      return;
    }

    setMessage('Verifying your email...');

    try {
      const response = await axios.get(`https://appointments-6zq4.onrender.com/api/users/verify-email?token=${token}`);
      setMessage(response.data.message || 'Email verified successfully!');
      setIsVerified(true); // تم التحقق بنجاح
      setError(false); // إذا كان التحقق ناجحًا، نتأكد من إزالة أي خطأ
    } catch (error) {
      setMessage(error.response?.data?.message || 'Verification failed. Invalid or expired token.');
      setError(true); // عند حدوث خطأ نضبط الحالة على "خطأ"
      // توجيه المستخدم إلى الصفحة الرئيسية في حالة حدوث خطأ
      setTimeout(() => {
        navigate('/'); // التوجيه إلى الصفحة الرئيسية بعد 3 ثواني
      }, 3000);
    }
  };

  const redirectToLogin = () => {
    // توجيه المستخدم إلى صفحة تسجيل الدخول
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <h2>Email Verification</h2>
      <p style={styles.message}>{message}</p>

      {/* زر للتحقق عند الضغط عليه */}
      {!isVerified && token && !error && (
        <button style={styles.verifyButton} onClick={verifyEmail}>Verify Email</button>
      )}

      {/* إذا تم التحقق بنجاح أو في حال حدوث خطأ، نعرض زر التحويل إلى صفحة تسجيل الدخول */}
      {(isVerified || error) && (
        <div>
          {/* إذا حدث خطأ، يتم توجيه المستخدم إلى الصفحة الرئيسية بعد فترة قصيرة */}
          {error ? (
            <p style={styles.errorMessage}>Verification failed, redirecting to home...</p>
          ) : (
            <button style={styles.loginButton} onClick={redirectToLogin}>Go to Login</button>
          )}
        </div>
      )}
    </div>
  );
};

// تنسيق الصفحة باستخدام CSS
const styles = {
  container: {
    textAlign: 'center',
    marginTop: '100px',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    width: '400px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  message: {
    fontSize: '16px',
    color: '#555',
    margin: '20px 0',
  },
  verifyButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  loginButton: {
    backgroundColor: '#2196F3',
    color: 'white',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  errorMessage: {
    color: 'red',
    fontSize: '14px',
    marginTop: '10px',
  }
};

export default VerifyEmail;
