import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Tag } from 'antd';

const ContractList = () => {
  const [userRole, setUserRole] = useState(null);

  // Mock data for testing
  const mockContracts = [
    {
      _id: '1',
      name: 'Contract 1',
      description: 'Test Contract 1',
      status: 'PENDING'
    },
    {
      _id: '2',
      name: 'Contract 2',
      description: 'Test Contract 2',
      status: 'APPROVED'
    }
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Current user:', user);
    if (user && user.role) {
      setUserRole(user.role);
    }
  }, []);

  const columns = [
    {
      title: 'Contract Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'APPROVED' ? 'green' : 'gold'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          {userRole !== 'USER' && (
            <Button type="primary">
              Edit
            </Button>
          )}
          {userRole === 'SUPERADMIN' && (
            <Button type="primary" danger>
              Delete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <h2>Contract List</h2>
      </div>
      <Table
        columns={columns}
        dataSource={mockContracts}
        rowKey="_id"
      />
    </div>
  );
};

export default ContractList; 