import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, message, Modal, Form, Input, Checkbox, Divider } from 'antd';
import axios from 'axios';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { PERMISSION_LABELS } from '../../utils/permissionLabels';

const { confirm } = Modal;

const UserRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
      setCurrentUserRole(user.role);
    }
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/users/permissions', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setPermissions(response.data);
    } catch (error) {
      message.error('Failed to fetch permissions');
      console.error('Error:', error);
    }
  };

  const showDeleteConfirm = (role) => {
    confirm({
      title: 'Are you sure you want to delete this role?',
      icon: <ExclamationCircleOutlined />,
      content: `Role: ${role.name}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => handleDeleteRole(role.id),
    });
  };

  const handleDeleteRole = async (roleId) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/users/roles/${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      message.success('Role deleted successfully');
      fetchRoles();
    } catch (error) {
      const errorMessage = error.response?.data || 'Failed to delete role';
      message.error(errorMessage);
      console.error('Error deleting role:', error);
    }
  };

  const showAddModal = () => {
    setIsAddModalVisible(true);
    setSelectedPermissions([]);
    form.resetFields();
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
    setSelectedPermissions([]);
    form.resetFields();
  };

  const handlePermissionChange = (permissionId, checked) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permissionId]);
    } else {
      setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
    }
  };

  const handleAddOk = async () => {
    try {
      const values = await form.validateFields();
      if (selectedPermissions.length === 0) {
        message.error('Please select at least one permission');
        return;
      }

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await axios.post('http://localhost:8080/api/users/roles', 
        {
          name: values.name,
          description: values.description,
          permissionIds: selectedPermissions
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      message.success('Role added successfully');
      setIsAddModalVisible(false);
      setSelectedPermissions([]);
      form.resetFields();
      fetchRoles();
    } catch (error) {
      if (error.response?.data) {
        message.error(error.response.data);
      } else {
        message.error('Failed to add role');
      }
      console.error('Error:', error);
    }
  };

  // Nhóm permissions theo moduleCode
  const groupedPermissions = permissions.reduce((acc, permission) => {
    const moduleCode = permission.moduleCode || 'Other';
    if (!acc[moduleCode]) {
      acc[moduleCode] = [];
    }
    acc[moduleCode].push(permission);
    return acc;
  }, {});

  const columns = [
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    currentUserRole === 'SUPERADMIN' && {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary">Edit</Button>
          {record.name !== 'SUPERADMIN' && (
            <Button danger onClick={() => showDeleteConfirm(record)}>
              Delete
            </Button>
          )}
        </Space>
      ),
    }
  ].filter(Boolean);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <h2>User Roles</h2>
        {currentUserRole === 'SUPERADMIN' && (
          <Button type="primary" onClick={showAddModal}>
            Add New Role
          </Button>
        )}
      </div>
      
      <Table
        columns={columns}
        dataSource={roles}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Add New Role"
        open={isAddModalVisible}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Role Name"
            rules={[
              { required: true, message: 'Please input role name!' },
              { pattern: /^[\p{L}\p{N}\s_]+$/u, message: 'Role name can only contain letters, numbers, spaces and underscore' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Permissions"
            required
          >
            <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '2px' }}>
              {Object.entries(groupedPermissions).map(([moduleCode, modulePermissions]) => (
                <div key={moduleCode} style={{ marginBottom: '16px' }}>
                  <h4>{PERMISSION_LABELS[moduleCode] || moduleCode}</h4>
                  {modulePermissions.map(permission => (
                    <div key={permission.id}>
                      <Checkbox
                        checked={selectedPermissions.includes(permission.id)}
                        onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                      >
                        {PERMISSION_LABELS[permission.name] || permission.name}
                      </Checkbox>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserRoles; 