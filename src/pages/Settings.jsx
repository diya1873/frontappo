import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile, deleteUserProfile } from '../features/profile/profileApi';
import { Avatar, Typography, Spin, Row, Col, Card, Modal, Form, Input, Upload, Button, message, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  if (!user) {
    return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  }

  const handleEditClick = () => {
    setIsModalOpen(true);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      password: '',
    });
  };

  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      if (values.password) formData.append('password', values.password);
      if (avatarFile) formData.append('avatar', avatarFile);

      await dispatch(updateProfile(formData));
      message.success('Profile updated successfully!');
      setIsModalOpen(false);
      dispatch(getProfile()); // تحديث المعلومات بعد التعديل
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
        padding: '50px 20px',
      }}
    >
      <h2>My PROFILE</h2>
      <Row justify="center">
        <Col xs={24} sm={22} md={16} lg={12}>
          <Card
            style={{
              padding: '30px',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            {/* زر القلم */}
            <EditOutlined
              onClick={handleEditClick}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                fontSize: '20px',
                cursor: 'pointer',
              }}
            />

            <Avatar
              src={`https://appointments-6zq4.onrender.com${user.avatar}`}
              size={120}
              style={{
                marginBottom: 16,
                border: '4px solid #1890ff',
              }}
            />

            <Title level={2} style={{ marginBottom: 4 }}>
              {user.name}
            </Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              {user.email}
            </Text>

            <div style={{ marginTop: 40, textAlign: 'left' }}>
              <Row gutter={[16, 16]}>
                <Col xs={12}>
                  <Text strong>Role:</Text>
                  <br />
                  <Text>{user.role}</Text>
                </Col>
                <Col xs={12}>
                  <Text strong>Verified:</Text>
                  <br />
                  <Text>{user.isVerified ? 'Yes ✅' : 'No ❌'}</Text>
                </Col>

                {/* تم تعديل الأعمدة هنا بحيث تتناسب مع الموبايل */}
                <Col xs={24} sm={12}>
                  <Text strong>Created At:</Text>
                  <br />
                  <Text>{new Date(user.createdAt).toLocaleString()}</Text>
                </Col>
                <Col xs={24} sm={12}>
                  <Text strong>Last Updated:</Text>
                  <br />
                  <Text>{new Date(user.updatedAt).toLocaleString()}</Text>
                </Col>
              </Row>
            </div>

            <div style={{ marginTop: 40 }}>
              <Popconfirm
                title="Are you sure to delete your profile?"
                onConfirm={async () => {
                  await dispatch(deleteUserProfile());
                  message.success("Profile deleted successfully");
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button danger icon={<DeleteOutlined />} block>
                  Delete Profile
                </Button>
              </Popconfirm>
            </div>
          </Card>
        </Col>
      </Row>

      {/* مودال التعديل */}
      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input.Password placeholder="Leave blank to keep current password" />
          </Form.Item>

          <Form.Item label="Avatar">
            <Upload
              beforeUpload={(file) => {
                setAvatarFile(file);
                return false; // منع الرفع التلقائي
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Select Avatar</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Settings;
