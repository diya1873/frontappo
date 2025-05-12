import React, { useEffect, useState } from 'react';
import { Table, Space, Popconfirm, Avatar, Input } from 'antd';
import axios from 'axios';
import { DeleteOutlined } from '@ant-design/icons';
import ReactJsAlert from "reactjs-alert";

const AllUsers = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    status: false,
    type: "",
    title: "",
  });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAppointments = async (query = '') => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.user.token;
      const response = await axios.get(`https://appointments-6zq4.onrender.com/api/users/all${query ? `?query=${query}` : ''}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data);
    } catch (err) {
      setAlert({ status: true, type: "error", title: "Failed to fetch users" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.user.token;
      await axios.delete(`https://appointments-6zq4.onrender.com/api/users/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlert({ status: true, type: "success", title: "Appointment deleted successfully" });
      fetchAppointments(searchQuery);
    } catch (error) {
      setAlert({ status: true, type: "error", title: "Failed to delete appointment" });
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // بحث تلقائي عند الكتابة
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchAppointments(searchQuery);
    }, 500); // انتظار 500ms بعد توقف الكتابة

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar) => (
        <Avatar src={`https://appointments-6zq4.onrender.com/uploads/${avatar}`} />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Are you sure to delete this appointment?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <h2>All Users</h2>

      {/* حقل البحث */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Input
          placeholder="Search by email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      <Table
        dataSource={appointments}
        columns={columns}
        loading={loading}
        rowKey="_id"
        scroll={{ x: 'max-content' }}
      />

      <ReactJsAlert
        status={alert.status}
        type={alert.type}
        title={alert.title}
        Close={() => setAlert({ status: false })}
      />
    </div>
  );
};

export default AllUsers;
