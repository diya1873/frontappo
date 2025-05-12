import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import axios from 'axios';
import { Spin, Typography, Row, Col } from 'antd';

const { Title } = Typography;

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error("Failed to fetch statistics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  }

  const appointmentStatusData = [
    ['Status', 'Count'],
    ['Scheduled', stats.scheduledAppointments],
    ['Completed', stats.completedAppointments],
    ['Cancelled', stats.cancelledAppointments],
  ];

  const appointmentsPerUserData = [
    ['User', 'Appointments'],
    ...stats.userAppointments.map(user => [user.userName, user.totalAppointments]),
  ];

  return (
    <div style={{
      padding: '16px',
      maxWidth: '100%',
      overflowX: 'hidden',
    }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
        Appointment Statistics
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <div style={{ width: '100%', maxWidth: '100%' }}>
            <Chart
              chartType="PieChart"
              data={appointmentStatusData}
              options={{
                title: 'Appointment Distribution by Status',
                is3D: true,
                chartArea: { width: '90%', height: '80%' },
                legend: { position: 'bottom', textStyle: { fontSize: 12 } },
                titleTextStyle: { fontSize: 16 },
              }}
              width="100%"
              height="300px"
            />
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div style={{ width: '100%', maxWidth: '100%' }}>
            <Chart
              chartType="BarChart"
              data={appointmentsPerUserData}
              options={{
                title: 'Appointments per User',
                hAxis: {
                  title: 'Total Appointments',
                  textStyle: { fontSize: 12 },
                  titleTextStyle: { fontSize: 14 },
                },
                vAxis: {
                  title: 'Users',
                  textStyle: { fontSize: 12 },
                  titleTextStyle: { fontSize: 14 },
                },
                bars: 'horizontal',
                legend: { position: 'none' },
                chartArea: { width: '80%', height: '70%' },
                titleTextStyle: { fontSize: 16 },
              }}
              width="100%"
              height="300px"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;
