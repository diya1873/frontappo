import React, { useState } from 'react';
import { Form, Input, DatePicker, TimePicker, Button } from 'antd';
import axios from 'axios';

const { TextArea } = Input;

const AddAppointment = ({ setAlert, setModalVisible, fetchAppointments }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.user.token;

      const formattedData = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
        time: values.time.format("h:mm A"), // <-- التعديل هون
      };

      await axios.post('https://appointments-6zq4.onrender.com/api/appointments/', formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAlert({ status: true, type: "success", title: "Appointment added successfully" });
      setModalVisible(false);
      fetchAppointments();
      form.resetFields();
    } catch (error) {
      setAlert({ status: true, type: "error", title: "Failed to add appointment" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Form.Item name="clientName" label="Client Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="date" label="Date" rules={[{ required: true }]}>
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="time" label="Time" rules={[{ required: true }]}>
        <TimePicker use12Hours format="h:mm A" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="service" label="Service" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      {/* حذف حقل status بالكامل */}

      <Form.Item name="description" label="Description">
        <TextArea rows={3} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save Appointment
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddAppointment;
