import React, { useState, useEffect } from 'react';
import { Table, Space, Button, message, Modal, Select } from 'antd';
import axios from 'axios';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roles, setRoles] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
      setCurrentUserRole(user.role);
    }
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setUsers(response.data);
    } catch (error) {
      message.error('Failed to fetch users');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/users/roles', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setRoles(response.data);
    } catch (error) {
      message.error('Failed to fetch roles');
      console.error('Error:', error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
    setSelectedUser(null);
    setSelectedRole(null);
  };

  const handleOk = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.post('http://localhost:8080/api/users/assign-role', 
        {
          userId: selectedUser.id,
          roleName: selectedRole
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      message.success('Role updated successfully');
      fetchUsers(); // Refresh user list
      setIsEditModalVisible(false);
    } catch (error) {
      message.error('Failed to update role');
      console.error('Error:', error);
    }
  };

  const showDeleteConfirm = (user) => {
    confirm({
      title: 'Bạn có chắc muốn xóa tài khoản này?',
      icon: <ExclamationCircleOutlined />,
      content: `Tài khoản: ${user.username}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => handleDelete(user.id),
    });
  };

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      message.success('User deleted successfully');
      fetchUsers(); // Refresh user list
    } catch (error) {
      if (error.response?.data) {
        message.error(error.response.data);
      } else {
        message.error('Failed to delete user');
      }
      console.error('Error:', error);
    }
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
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
    currentUserRole === 'SUPERADMIN' && {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="primary" danger onClick={() => showDeleteConfirm(record)}>Delete</Button>
        </Space>
      ),
    }
  ].filter(Boolean);

  return (
    <div style={{ padding: '20px' }}>
      <h2>User List</h2>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
      />
      <Modal
        title="Edit User Role"
        open={isEditModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div style={{ marginBottom: 16 }}>
          <p>User: {selectedUser?.username}</p>
          <p>Current Role: {selectedUser?.role}</p>
          <Select
            style={{ width: '100%' }}
            placeholder="Select new role"
            value={selectedRole}
            onChange={(value) => setSelectedRole(value)}
          >
            {roles
              .filter(role => role.name !== 'SUPERADMIN')
              .map(role => (
                <Select.Option key={role.id} value={role.name}>
                  {role.name}
                </Select.Option>
              ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default UserList; 