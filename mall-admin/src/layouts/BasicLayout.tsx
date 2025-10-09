import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { Link, Outlet, useLocation, history } from 'umi';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  OrderedListOutlined,
  GiftOutlined,
  TagOutlined,
  CarOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import styles from './BasicLayout.less';

const { Header, Sider, Content } = Layout;

const BasicLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">仪表盘</Link>,
    },
    {
      key: '/user',
      icon: <UserOutlined />,
      label: <Link to="/user">用户管理</Link>,
    },
    {
      key: '/product',
      icon: <ShoppingOutlined />,
      label: <Link to="/product">商品管理</Link>,
    },
    {
      key: '/category',
      icon: <AppstoreOutlined />,
      label: <Link to="/category">分类管理</Link>,
    },
    {
      key: '/order',
      icon: <OrderedListOutlined />,
      label: <Link to="/order">订单管理</Link>,
    },
    {
      key: '/marketing',
      icon: <GiftOutlined />,
      label: <Link to="/marketing">营销管理</Link>,
    },
    {
      key: '/coupon',
      icon: <TagOutlined />,
      label: <Link to="/coupon">优惠券管理</Link>,
    },
    {
      key: '/delivery',
      icon: <CarOutlined />,
      label: <Link to="/delivery">物流管理</Link>,
    },
    {
      key: '/statistics',
      icon: <BarChartOutlined />,
      label: <Link to="/statistics">数据统计</Link>,
    },
  ];

  const userMenu = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
      >
        <div className={styles.logo}>
          {collapsed ? 'Mall' : 'Mall Admin'}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <div className={styles.right}>
            <Dropdown menu={{ items: userMenu }} placement="bottomRight">
              <div className={styles.user}>
                <Avatar icon={<UserOutlined />} />
                <span className={styles.username}>Admin</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
