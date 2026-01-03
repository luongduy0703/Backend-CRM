// ProductList.js
import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const navigate = useNavigate();

    const fetchProducts = async () => {
        console.log('Token:', token); // Debug token
        if (!token) {
            message.error('Please log in to view products');
            navigate('/login');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/products', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProducts(response.data);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch products';
            message.error(errorMessage);
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `$${Number(price).toFixed(2)}`
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>Product List</h2>
                <Button 
                    type="primary" 
                    onClick={() => navigate('/products/add')}
                >
                    Add New Product
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={products}
                rowKey="id"
                loading={loading}
            />
        </div>
    );
};

export default ProductList;