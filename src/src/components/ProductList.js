import React, { useEffect, useState } from 'react';
import { Table, message } from 'antd';
import { useAuth } from '../contexts/AuthContext';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/products', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                message.error('Failed to fetch products');
            }
        } catch (error) {
            message.error('Error fetching products');
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
            <h2>Product List</h2>
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