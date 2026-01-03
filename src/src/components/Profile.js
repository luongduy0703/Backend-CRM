import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const onFinish = (values) => {
    message.success('Profile updated successfully!');
  };

  return (
    <div>
      <h2>Profile</h2>
      <Card style={{ maxWidth: 600 }}>
        <Form
          name="profile"
          initialValues={{
            username: user?.username,
            email: user?.email,
          }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile; 