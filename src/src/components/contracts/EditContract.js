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
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
      setUserRole(user.role);
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
      const response = await axios.get(`http://localhost:5000/api/contracts/${id}`);
      const contract = response.data;
      // Format dates for form inputs
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
      const response = await axios.put(`http://localhost:5000/api/contracts/${id}`, values);
      if (response.data) {
        message.success('Contract updated successfully');
        navigate('/contracts');
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
          <Button style={{ marginLeft: 8 }} onClick={() => navigate('/contracts')}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditContract; 