import React, { useState, useEffect } from 'react';
import { Layout, Menu, Spin } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  ContainerOutlined,
  TeamOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { checkPermission } from '../../utils/rolePermissions';

const { Header, Content, Sider } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
      setUserRole(user.role);
    } else {
      navigate('/login');
      return;
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  const getAllMenuItems = () => [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    checkPermission(userRole, ['VIEW_PRODUCTS']) && {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: 'Quản lý sản phẩm',
      children: [
        checkPermission(userRole, ['VIEW_PRODUCTS']) && {
          key: 'products-list',
          icon: <UnorderedListOutlined />,
          label: <Link to="/products/list">Danh sách sản phẩm</Link>,
        },
        checkPermission(userRole, ['CREATE_PRODUCT']) && {
          key: 'products-add',
          icon: <PlusOutlined />,
          label: <Link to="/products/add">Thêm sản phẩm</Link>,
        },
      ].filter(Boolean),
    },
    checkPermission(userRole, ['VIEW_USERS', 'VIEW_ROLES']) && {
      key: 'users',
      icon: <TeamOutlined />,
      label: 'Quản lý người dùng',
      children: [
        checkPermission(userRole, ['VIEW_USERS']) && {
          key: 'users-list',
          icon: <UnorderedListOutlined />,
          label: <Link to="/users/list">Danh sách người dùng</Link>,
        },
        checkPermission(userRole, ['VIEW_ROLES']) && {
          key: 'users-roles',
          icon: <UserOutlined />,
          label: <Link to="/users/roles">Phân quyền</Link>,
        },
      ].filter(Boolean),
    },
    checkPermission(userRole, ['VIEW_CONTRACTS']) && {
      key: 'contracts',
      icon: <ContainerOutlined />,
      label: 'Quản lý hợp đồng',
      children: [
        checkPermission(userRole, ['VIEW_CONTRACTS']) && {
          key: 'contracts-list',
          icon: <UnorderedListOutlined />,
          label: <Link to="/contracts/list">Danh sách hợp đồng</Link>,
        },
        checkPermission(userRole, ['CREATE_CONTRACT']) && {
          key: 'contracts-add',
          icon: <PlusOutlined />,
          label: <Link to="/contracts/add">Thêm hợp đồng</Link>,
        },
      ].filter(Boolean),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
    },
  ].filter(Boolean);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        width={250} 
        theme="dark"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: 'white', margin: 0 }}>CRM System</h1>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['dashboard']}
          mode="inline"
          items={getAllMenuItems()}
          selectedKeys={[location.pathname.split('/')[1]]}
        />
      </Sider>
      <Layout style={{ marginLeft: 250 }}>
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 
