import React, { useEffect, useState } from 'react';
import { Button, Table, Space, Popconfirm, Avatar, Modal } from 'antd';
import axios from 'axios';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ReactJsAlert from "reactjs-alert";
import AddAppointment from '../components/AddAppointment';
import EditAppointment from '../components/EditAppointment';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    status: false,
    type: "",
    title: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.user.token;
      const response = await axios.get('https://appointments-6zq4.onrender.com/api/appointments/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data);
    } catch (err) {
      setAlert({ status: true, type: "error", title: "Failed to fetch appointments" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.user.token;
      await axios.delete(`https://appointments-6zq4.onrender.com/api/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlert({ status: true, type: "success", title: "Appointment deleted successfully" });
      fetchAppointments();
    } catch (error) {
      setAlert({ status: true, type: "error", title: "Failed to delete appointment" });
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const columns = [
    {
      title: 'Avatar',
      dataIndex: ['user', 'avatar'],
      key: 'avatar',
      render: (avatar) => (
        <Avatar src={`https://appointments-6zq4.onrender.com/uploads/${avatar}`} />
      ),
    },
    {
      title: 'Client Name',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedAppointment(record);
              console.log('recoooord',record)
              setEditModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this appointment?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <h2>My Appointments</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          Add Appointment
        </Button>
      </div>

      <Table
        dataSource={appointments}
        columns={columns}
        loading={loading}
        rowKey="_id"
        scroll={{ x: 'max-content' }}
      />

      {/* Add Modal */}
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        title="Add New Appointment"
      >
        <AddAppointment
          setAlert={setAlert}
          setModalVisible={setModalVisible}
          fetchAppointments={fetchAppointments}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        title="Edit Appointment"
      >
        <EditAppointment
          appointment={selectedAppointment}
          setAlert={setAlert}
          setEditModalVisible={setEditModalVisible}
          fetchAppointments={fetchAppointments}
        />
      </Modal>

      <ReactJsAlert
        status={alert.status}
        type={alert.type}
        title={alert.title}
        Close={() => setAlert({ status: false })}
      />
    </div>
  );
};

export default Appointments;
