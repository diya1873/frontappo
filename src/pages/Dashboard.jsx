import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  SettingOutlined,
  LogoutOutlined,
  MailOutlined,
  HomeOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import {
  Button,
  Layout,
  Menu,
  theme,
  Avatar,
  Dropdown,
  Drawer,
  Grid,
} from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const avatarMenu = (
    <Menu>
      <Menu.Item key="email" icon={<MailOutlined />}>
        {user?.user?.user?.email}
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="settings">Settings</Link>
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={() => {
          localStorage.removeItem('userInfo');
          navigate('/login');
          window.location.reload();
        }}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  const menuItems =
    user?.user?.user?.role === 'Admin'
      ? [
          { key: 'home', icon: <HomeOutlined />, label: 'Home' },
          { key: 'allReservations', icon: <VideoCameraOutlined />, label: 'Reservations' },
          { key: 'users', icon: <TeamOutlined />, label: 'Users' },
          { key: 'statistics', icon: <UploadOutlined />, label: 'Statistics' },
        ]
      : [
          { key: 'home', icon: <HomeOutlined />, label: 'Home' },
          { key: 'appointments', icon: <UserOutlined />, label: 'Appointments' },
        ];

  const handleMenuClick = ({ key }) => {
    const routes = {
      home: '/dashboard',
      appointments: '/dashboard/appointments',
      allReservations: '/dashboard/all-reservations',
      statistics: '/dashboard/statistics',
      users: '/dashboard/users',
    };
    navigate(routes[key]);
    setDrawerVisible(false); // close drawer on mobile
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Only show Sider on medium and above */}
      {screens.md ? (
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div
            className="logo"
            style={{
              height: '32px',
              margin: '16px',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              textAlign: collapsed ? 'center' : 'start',
            }}
          >
            {collapsed
              ? '🧩'
              : user?.user?.user?.role === 'Admin'
              ? 'ADMIN-DASHBOARD'
              : 'MyDashboard'}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['']}
            onClick={handleMenuClick}
            items={menuItems}
          />
        </Sider>
      ) : (
        <Drawer
          title={user?.user?.user?.role === 'Admin' ? 'ADMIN-DASHBOARD' : 'MyDashboard'}
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          bodyStyle={{ padding: 0 }}
        >
          <Menu mode="inline" onClick={handleMenuClick} items={menuItems} />
        </Drawer>
      )}

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Toggle button */}
          <Button
            type="text"
            icon={
              screens.md ? (
                collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
              ) : (
                <MenuUnfoldOutlined />
              )
            }
            onClick={() => {
              if (screens.md) {
                setCollapsed(!collapsed);
              } else {
                setDrawerVisible(true);
              }
            }}
            style={{ fontSize: '16px', width: 48, height: 48 }}
          />

          {/* Right section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Dropdown overlay={avatarMenu} placement="bottomRight" arrow>
              <Avatar
                size={40}
                src={user?.user?.user?.avatar}
                icon={!user?.user?.user?.avatar && <UserOutlined />}
                style={{ cursor: 'pointer' }}
              />
            </Dropdown>
            <b
              style={{
                fontSize: '16px',
                color: '#888',
                textTransform: 'uppercase',
              }}
            >
              {user?.user?.user?.name}
            </b>
          </div>
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
