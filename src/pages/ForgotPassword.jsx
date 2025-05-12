import React, { useState } from 'react';
import { Input, Button, Form, Alert, Typography, Card } from 'antd';
import OTPInput from 'react-otp-input';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '', show: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showAlert = (type, message) => {
    setAlert({ type, message, show: true });
    setTimeout(() => setAlert({ ...alert, show: false }), 4000);
  };

  const handleSendEmail = async () => {
    try {
      setLoading(true);
      await axios.post('https://appointments-6zq4.onrender.com/api/users/forgot-password', { email });
      showAlert('success', 'OTP sent to your email');
      setStep(2);
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('https://appointments-6zq4.onrender.com/api/users/reset-password-with-otp', {
        email,
        otp,
      });
      if (data.otpVerified) {
        showAlert('success', 'OTP verified. You can now set a new password.');
        setStep(3);
      }
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('https://appointments-6zq4.onrender.com/api/users/reset-password-with-otp', {
        email,
        otp,
        newPassword,
      });
      showAlert('success', data.message || 'Password reset successfully');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to right, #d3cce3, #e9e4f0)',
      padding: '2rem',
    }}>
      <Card style={{ width: 480, borderRadius: 12, padding: 30, boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 20 }}>Forgot Password</Title>

        {alert.show && <Alert type={alert.type} message={alert.message} showIcon style={{ marginBottom: 16 }} />}

        {step === 1 && (
          <Form onFinish={handleSendEmail} layout="vertical">
            <Form.Item label="Email Address" name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Send OTP
            </Button>
          </Form>
        )}

        {step === 2 && (
          <Form onFinish={handleVerifyOTP}>
          <div style={{ marginBottom: 16 }}>
  <label style={{ display: 'block', marginBottom: 8 }}>Enter OTP</label>
  <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
    <OTPInput
      value={otp}
      onChange={setOTP}
      numInputs={6}
      inputStyle={{
        width: '100%',
        maxWidth: '3rem',
        height: '3rem',
        fontSize: '1.5rem',
        borderRadius: 6,
        border: '1px solid #ccc',
        textAlign: 'center',
        marginRight:'2px'
      }}
      renderInput={(props) => <input {...props} />}
    />
  </div>
</div>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Verify OTP
            </Button>
          </Form>
        )}

        {step === 3 && (
          <Form onFinish={handleResetPassword} layout="vertical">
            <Form.Item label="New Password" name="newPassword" rules={[{ required: true, message: 'Please enter a new password' }]}>
              <Input.Password value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Reset Password
            </Button>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
