import React from 'react';
import { Typography, Card, Row, Col, Statistic, Space } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ShoppingOutlined,
  FileOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const Dashboard = () => {
  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>Dashboard</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} className="dashboard-card">
            <Statistic
              title="Tổng số người dùng"
              value={1205}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} className="dashboard-card">
            <Statistic
              title="Đơn hàng mới"
              value={28}
              prefix={<ShoppingCartOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} className="dashboard-card">
            <Statistic
              title="Doanh thu hôm nay"
              value={8250000}
              prefix={<DollarOutlined style={{ color: '#faad14' }} />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} className="dashboard-card">
            <Statistic
              title="Sản phẩm"
              value={156}
              prefix={<ShoppingOutlined style={{ color: '#eb2f96' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card 
            title="Đơn hàng gần đây" 
            bordered={false}
            className="dashboard-card"
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {[
                { id: 1, customer: 'Nguyễn Văn A', amount: '2,500,000 VNĐ', status: 'Đã giao' },
                { id: 2, customer: 'Trần Thị B', amount: '1,800,000 VNĐ', status: 'Đang xử lý' },
                { id: 3, customer: 'Lê Văn C', amount: '3,200,000 VNĐ', status: 'Đã giao' },
              ].map(order => (
                <Card.Grid key={order.id} style={{ width: '100%', padding: '12px' }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <strong>{order.customer}</strong>
                      <br />
                      <small>{order.amount}</small>
                    </Col>
                    <Col>
                      <span style={{ color: order.status === 'Đã giao' ? '#52c41a' : '#1890ff' }}>
                        {order.status}
                      </span>
                    </Col>
                  </Row>
                </Card.Grid>
              ))}
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            title="Hoạt động gần đây" 
            bordered={false}
            className="dashboard-card"
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {[
                { icon: <FileOutlined />, text: 'Báo cáo tháng đã được tạo', time: '2 giờ trước' },
                { icon: <CheckCircleOutlined />, text: 'Đơn hàng #1234 đã hoàn thành', time: '3 giờ trước' },
                { icon: <UserOutlined />, text: 'Khách hàng mới đăng ký', time: '5 giờ trước' },
              ].map((activity, index) => (
                <Card.Grid key={index} style={{ width: '100%', padding: '12px' }}>
                  <Space>
                    {activity.icon}
                    <span>{activity.text}</span>
                    <small style={{ color: '#8c8c8c' }}>{activity.time}</small>
                  </Space>
                </Card.Grid>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 
