import React, { useEffect, useState } from 'react';
import { Card, Tabs, List, Tag, Button, message } from 'antd';
import { Link } from 'umi';
import styles from './index.less';

const { TabPane } = Tabs;

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/order/user/list?status=${activeTab === 'all' ? '' : activeTab}`, {
        headers: {
          'Authorization': localStorage.getItem('token') || '',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data.records);
      }
    } catch (error) {
      console.error('获取订单列表失败:', error);
      message.error('获取订单列表失败');
    }
    setLoading(false);
  };

  const handleCancel = async (orderSn: string) => {
    try {
      const response = await fetch(`/api/order/cancel/${orderSn}`, {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem('token') || '',
        },
      });
      if (response.ok) {
        message.success('取消订单成功');
        fetchOrders();
      }
    } catch (error) {
      console.error('取消订单失败:', error);
      message.error('取消订单失败');
    }
  };

  const handleConfirmReceive = async (orderSn: string) => {
    try {
      const response = await fetch(`/api/order/confirm/${orderSn}`, {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem('token') || '',
        },
      });
      if (response.ok) {
        message.success('确认收货成功');
        fetchOrders();
      }
    } catch (error) {
      console.error('确认收货失败:', error);
      message.error('确认收货失败');
    }
  };

  const handleDelete = async (orderSn: string) => {
    try {
      const response = await fetch(`/api/order/${orderSn}`, {
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem('token') || '',
        },
      });
      if (response.ok) {
        message.success('删除订单成功');
        fetchOrders();
      }
    } catch (error) {
      console.error('删除订单失败:', error);
      message.error('删除订单失败');
    }
  };

  const getStatusTag = (status: number) => {
    switch (status) {
      case 0:
        return <Tag color="blue">待付款</Tag>;
      case 1:
        return <Tag color="green">已付款</Tag>;
      case 2:
        return <Tag color="orange">已发货</Tag>;
      case 3:
        return <Tag color="cyan">已完成</Tag>;
      case -1:
        return <Tag color="red">已取消</Tag>;
      default:
        return null;
    }
  };

  const getOrderActions = (order: any) => {
    const actions = [];
    
    if (order.status === 0) {
      actions.push(
        <Button key="pay" type="primary" size="small">
          <Link to={`/order/pay/${order.orderSn}`}>立即付款</Link>
        </Button>,
        <Button key="cancel" size="small" onClick={() => handleCancel(order.orderSn)}>
          取消订单
        </Button>
      );
    } else if (order.status === 2) {
      actions.push(
        <Button
          key="confirm"
          type="primary"
          size="small"
          onClick={() => handleConfirmReceive(order.orderSn)}
        >
          确认收货
        </Button>
      );
    } else if (order.status === 3 || order.status === -1) {
      actions.push(
        <Button
          key="delete"
          size="small"
          danger
          onClick={() => handleDelete(order.orderSn)}
        >
          删除订单
        </Button>
      );
    }

    return actions;
  };

  return (
    <div className={styles.container}>
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="全部订单" key="all" />
          <TabPane tab="待付款" key="0" />
          <TabPane tab="待发货" key="1" />
          <TabPane tab="待收货" key="2" />
          <TabPane tab="已完成" key="3" />
          <TabPane tab="已取消" key="-1" />
        </Tabs>

        <List
          loading={loading}
          dataSource={orders}
          renderItem={(order: any) => (
            <List.Item
              actions={getOrderActions(order)}
              className={styles.orderItem}
            >
              <div className={styles.order}>
                <div className={styles.header}>
                  <span>订单号：{order.orderSn}</span>
                  {getStatusTag(order.status)}
                </div>
                <div className={styles.products}>
                  {order.orderItems.map((item: any) => (
                    <div key={item.id} className={styles.product}>
                      <img src={item.productPic} alt={item.productName} />
                      <div className={styles.info}>
                        <div className={styles.name}>{item.productName}</div>
                        <div className={styles.price}>
                          ¥{item.productPrice} × {item.productQuantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.footer}>
                  <div className={styles.amount}>
                    实付金额：<span>¥{order.payAmount}</span>
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default OrderList;
