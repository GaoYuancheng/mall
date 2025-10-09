import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'umi';
import {
  HomeOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  OrderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

const BasicLayout: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/home',
      icon: <HomeOutlined />,
      label: <Link to="/home">首页</Link>,
    },
    {
      key: '/product',
      icon: <ShoppingOutlined />,
      label: <Link to="/product">商品</Link>,
    },
    {
      key: '/cart',
      icon: <ShoppingCartOutlined />,
      label: <Link to="/cart">购物车</Link>,
    },
    {
      key: '/order',
      icon: <OrderedListOutlined />,
      label: <Link to="/order">订单</Link>,
    },
    {
      key: '/user',
      icon: <UserOutlined />,
      label: <Link to="/user">个人中心</Link>,
    },
  ];

  return (
    <Layout>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <div style={{ padding: 24, minHeight: 380 }}>
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Mall ©{new Date().getFullYear()} Created by Your Name
      </Footer>
    </Layout>
  );
};

export default BasicLayout;
