import React from 'react';
import { Form, Input, InputNumber, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProduct = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        if (!token) {
            message.error('Please log in to add a product');
            navigate('/login');
            return;
        }
        try {
            const payload = {
                name: values.name,
                price: values.price.toString(),
                description: values.description
            };
            await axios.post('http://localhost:8080/api/products', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            message.success('Product added successfully');
            form.resetFields();
            navigate('/products/list');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to add product';
            message.error(errorMessage);
            console.error('Error:', error);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
            <h2>Add New Product</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Product Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input product name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Please input price!' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        min={0}
                    />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Product
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddProduct;
