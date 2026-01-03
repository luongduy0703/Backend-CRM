import React from 'react';
import { Card, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const TestLogin = () => {
  const navigate = useNavigate();

  const loginAs = (role) => {
    const mockUser = {
      id: '1',
      username: `test_${role.toLowerCase()}`,
      role: role
    };

    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', 'mock_token');

    message.success(`Đăng nhập thành công với quyền ${role}`);
    navigate('/dashboard');
  };

  const roles = [
    {
      role: 'SUPERADMIN',
      description: 'Quản trị viên cao cấp - Có tất cả các quyền',
      permissions: [
        'Quản lý người dùng: Xem, Thêm, Sửa, Xóa',
        'Quản lý vai trò: Xem, Thêm, Sửa, Xóa',
        'Quản lý sản phẩm: Xem, Thêm, Sửa, Xóa',
        'Quản lý hợp đồng: Xem, Thêm, Sửa, Xóa, Phê duyệt'
      ]
    },
    {
      role: 'ADMIN',
      description: 'Quản trị viên - Có hầu hết các quyền trừ xóa',
      permissions: [
        'Quản lý người dùng: Xem, Thêm, Sửa',
        'Quản lý vai trò: Xem, Thêm, Sửa',
        'Quản lý sản phẩm: Xem, Thêm, Sửa, Xóa',
        'Quản lý hợp đồng: Xem, Thêm, Sửa, Phê duyệt'
      ]
    },
    {
      role: 'SALE',
      description: 'Nhân viên kinh doanh - Quản lý sản phẩm và hợp đồng',
      permissions: [
        'Quản lý hợp đồng: Xem, Sửa',
        'Quản lý sản phẩm: Xem'
      ]
    },
    {
      role: 'USER',
      description: 'Người dùng thông thường - Chỉ có quyền xem',
      permissions: [
        'Xem danh sách sản phẩm',
        'Xem danh sách hợp đồng'
      ]
    }
  ];

  return (
    <div style={{ padding: '50px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: '30px', textAlign: 'center' }}>
        Chọn vai trò để test hệ thống
      </Title>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {roles.map((item) => (
          <Card
            key={item.role}
            title={item.role}
            style={{ height: '100%' }}
            actions={[
              <Button type="primary" onClick={() => loginAs(item.role)}>
                Đăng nhập với vai trò này
              </Button>
            ]}
          >
            <Text type="secondary">{item.description}</Text>
            <div style={{ marginTop: '10px' }}>
              <Text strong>Quyền hạn:</Text>
              <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                {item.permissions.map((permission, index) => (
                  <li key={index}>
                    <Text>{permission}</Text>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestLogin; 
