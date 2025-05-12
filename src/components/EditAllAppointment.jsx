import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, TimePicker, Button, Select } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const { TextArea } = Input;

const EditAllAppointment = ({ appointment, setAlert, setEditModalVisible, fetchAppointments }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (appointment) {
      form.setFieldsValue({
        clientName: appointment.clientName,
        date: dayjs(appointment.date),
        time: dayjs(appointment.time, "hh:mm A"),
        service: appointment.service,
        status:appointment.status,
        description: appointment.description,
      });
    }
  }, [appointment, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.user.token;

      const formattedData = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
        time: values.time.format("hh:mm A"),
      };

      await axios.put(`https://appointments-6zq4.onrender.com/api/appointments/admin/${appointment._id}`, formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAlert({ status: true, type: "success", title: "Appointment updated successfully" });
      fetchAppointments();
      setEditModalVisible(false);
    } catch (error) {
      setAlert({ status: true, type: "error", title: "Failed to update appointment" });
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
      <Form.Item name="status" label="Status" rules={[{ required: true }]}>
      <Select placeholder="Select status">
        <Select.Option value="Scheduled">Scheduled</Select.Option>
        <Select.Option value="Completed">Completed</Select.Option>
        <Select.Option value="Cancelled">Cancelled</Select.Option>
      </Select>
    </Form.Item>

      <Form.Item name="description" label="Description">
        <TextArea rows={3} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Update Appointment
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditAllAppointment;
