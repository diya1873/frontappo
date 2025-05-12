import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Spin } from 'antd';
import { Link } from 'react-router-dom';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import ReactJsAlert from "reactjs-alert";

const { Title, Text } = Typography;

export default function AdminHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    status: false,
    type: "",
    title: "",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userInfo"))?.user.token;
        const { data } = await axios.get('https://appointments-6zq4.onrender.com/api/statistics/appointments/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(data);
        setLoading(false);
      } catch (error) {
        setAlert({
          status: true,
          type: "error",
          title: "فشل تحميل الإحصائيات",
        });
      } 
    };

    fetchStats();
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  const statCards = [
    {
      title: 'Scheduled',
      value: stats.scheduledAppointments,
      icon: <CalendarOutlined style={{ fontSize: 28, color: '#1890ff' }} />,
      bgColor: '#e6f7ff',
    },
    {
      title: 'Completed',
      value: stats.completedAppointments,
      icon: <CheckCircleOutlined style={{ fontSize: 28, color: '#52c41a' }} />,
      bgColor: '#f6ffed',
    },
    {
      title: 'Cancelled',
      value: stats.cancelledAppointments,
      icon: <CloseCircleOutlined style={{ fontSize: 28, color: '#f5222d' }} />,
      bgColor: '#fff1f0',
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: <PieChartOutlined style={{ fontSize: 28, color: '#faad14' }} />,
      bgColor: '#fffbe6',
    },
  ];

  return (
    <div style={{ padding: '30px' }}>
      <Title level={2} style={{ marginBottom: 30 }}>Admin Dashboard</Title>

      {/* الكروت العلوية */}
      <Row gutter={[16, 16]}>
        {statCards.map((item, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card
              style={{
                backgroundColor: item.bgColor,
                borderRadius: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {item.icon}
                <div>
                  <Text type="secondary">{item.title}</Text>
                  <Title level={3} style={{ margin: 0 }}>{item.value}</Title>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* كروت المستخدمين */}
      <Title level={3} style={{ marginTop: 50 }}>Appointments by User</Title>
      <Row gutter={[16, 16]}>
      {stats.userAppointments.map((user) => (
        <Col xs={24} sm={12} md={8} lg={6} key={user._id}>
          <Link to={`SingleAppointments/${user._id}`} style={{ textDecoration: 'none' }}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                textAlign: 'center',
                background: '#fafafa',
              }}
            >
              <UserOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 8 }} />
              <Title level={4} style={{ margin: 0 }}>{user.userName}</Title>
              <Text type="secondary">Total Appointments</Text>
              <Title level={5} style={{ marginTop: 4 }}>{user.totalAppointments}</Title>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
    

      {/* التنبيه */}
      <ReactJsAlert
        status={alert.status}
        type={alert.type}
        title={alert.title}
        Close={() => setAlert({ status: false })}
      />
    </div>
  );
}
