import React from 'react';
import { Menu as AntMenu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    UserOutlined,
    SettingOutlined,
    TeamOutlined,
    FileOutlined,
    ShopOutlined,
    BarsOutlined,
    AppstoreOutlined
} from '@ant-design/icons';

// Dữ liệu mẫu cho menu
const MOCK_MENU_ITEMS = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        icon: 'DashboardOutlined',
    },
    {
        name: 'Quản lý sản phẩm',
        path: '/products',
        icon: 'ShopOutlined',
        children: [
            {
                name: 'Danh sách sản phẩm',
                path: '/products/list',
                icon: 'BarsOutlined',
            },
            {
                name: 'Thêm sản phẩm',
                path: '/products/add',
                icon: 'AppstoreOutlined',
            }
        ]
    },
    {
        name: 'Quản lý người dùng',
        path: '/users',
        icon: 'TeamOutlined',
        children: [
            {
                name: 'Danh sách người dùng',
                path: '/users/list',
                icon: 'UserOutlined',
            },
            {
                name: 'Phân quyền',
                path: '/users/roles',
                icon: 'SettingOutlined',
            }
        ]
    },
    {
        name: 'Báo cáo',
        path: '/reports',
        icon: 'FileOutlined',
    }
];

const Menu = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getIcon = (iconName) => {
        const IconMap = {
            DashboardOutlined: <DashboardOutlined />,
            UserOutlined: <UserOutlined />,
            SettingOutlined: <SettingOutlined />,
            TeamOutlined: <TeamOutlined />,
            FileOutlined: <FileOutlined />,
            ShopOutlined: <ShopOutlined />,
            BarsOutlined: <BarsOutlined />,
            AppstoreOutlined: <AppstoreOutlined />
        };
        return IconMap[iconName] || null;
    };

    const convertToAntItems = (items) => {
        return items.map(item => ({
            key: item.path,
            icon: item.icon ? getIcon(item.icon) : null,
            label: item.name,
            children: item.children ? convertToAntItems(item.children) : null
        }));
    };

    const handleMenuClick = ({ key }) => {
        navigate(key);
    };

    return (
        <AntMenu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[location.pathname]}
            defaultOpenKeys={['/products', '/users']}
            items={convertToAntItems(MOCK_MENU_ITEMS)}
            onClick={handleMenuClick}
            style={{ height: '100%' }}
        />
    );
};

export default Menu; 