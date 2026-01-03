import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddContract = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/contracts', values);
      if (response.data) {
        message.success('Contract created successfully');
        navigate('/contracts'); // Redirect to contract list
      }
    } catch (error) {
      message.error('Failed to create contract');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create New Contract</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: '600px' }}
      >
        <Form.Item
          name="name"
          label="Contract Name"
          rules={[{ required: true, message: 'Please input contract name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please input description!' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="value"
          label="Contract Value"
          rules={[{ required: true, message: 'Please input contract value!' }]}
        >
          <Input type="number" prefix="$" />
        </Form.Item>

        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: 'Please input start date!' }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="End Date"
          rules={[{ required: true, message: 'Please input end date!' }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Contract
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => navigate('/contracts')}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddContract; 