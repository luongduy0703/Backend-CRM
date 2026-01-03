import React from 'react';
import { Form, Input, InputNumber, Button, message } from 'antd';
import { useAuth } from '../contexts/AuthContext';

const ProductForm = () => {
    const { token } = useAuth();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const response = await fetch('http://localhost:8080/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(values)
            });

            if (response.ok) {
                message.success('Product added successfully');
                form.resetFields();
            } else {
                const error = await response.json();
                message.error(error.message || 'Failed to add product');
            }
        } catch (error) {
            message.error('Error adding product');
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

export default ProductForm; 