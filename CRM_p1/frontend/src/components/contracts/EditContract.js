import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { checkPermission } from '../../utils/rolePermissions';

const EditContract = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
      if (!checkPermission(user.role, ['EDIT_CONTRACT'])) {
        message.error('You do not have permission to edit contracts');
        navigate('/contracts/list');
        return;
      }
    }
    fetchContract();
  }, [id, navigate]);

  const fetchContract = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/contracts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const contract = response.data;
      contract.startDate = contract.startDate?.split('T')[0];
      contract.endDate = contract.endDate?.split('T')[0];
      form.setFieldsValue(contract);
    } catch (error) {
      message.error('Failed to fetch contract details');
      console.error('Error:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.put(`http://localhost:8080/api/contracts/${id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (response.data) {
        message.success('Contract updated successfully');
        navigate('/contracts/list');
      }
    } catch (error) {
      message.error('Failed to update contract');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Edit Contract</h2>
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
            Update Contract
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => navigate('/contracts/list')}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditContract; 
