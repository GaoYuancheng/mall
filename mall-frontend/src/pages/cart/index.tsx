import React, { useEffect, useState } from 'react';
import { Table, Card, Button, InputNumber, message, Empty } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { history } from 'umi';
import styles from './index.less';

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await fetch('/api/cart/list', {
        headers: {
          'Authorization': localStorage.getItem('token') || '',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.data);
      }
    } catch (error) {
      console.error('获取购物车列表失败:', error);
      message.error('获取购物车列表失败');
    }
  };

  const handleQuantityChange = async (record: any, quantity: number) => {
    try {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || '',
        },
        body: JSON.stringify({
          id: record.id,
          quantity,
        }),
      });
      if (response.ok) {
        message.success('更新成功');
        fetchCartItems();
      }
    } catch (error) {
      console.error('更新购物车失败:', error);
      message.error('更新购物车失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/cart/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem('token') || '',
        },
      });
      if (response.ok) {
        message.success('删除成功');
        fetchCartItems();
      }
    } catch (error) {
      console.error('删除购物车商品失败:', error);
      message.error('删除购物车商品失败');
    }
  };

  const handleCheckout = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要结算的商品');
      return;
    }

    const selectedItems = cartItems.filter((item: any) => 
      selectedRowKeys.includes(item.id)
    );
    
    history.push('/order/confirm', {
      products: selectedItems,
    });
  };

  const columns = [
    {
      title: '商品信息',
      dataIndex: 'product',
      render: (product: any) => (
        <div className={styles.product}>
          <img src={product.picture} alt={product.name} />
          <div className={styles.info}>
            <div className={styles.name}>{product.name}</div>
            <div className={styles.price}>¥{product.price}</div>
          </div>
        </div>
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      render: (quantity: number, record: any) => (
        <InputNumber
          min={1}
          max={record.product.stock}
          value={quantity}
          onChange={(value) => handleQuantityChange(record, value)}
        />
      ),
    },
    {
      title: '小计',
      dataIndex: 'subtotal',
      render: (text: string, record: any) => (
        <span className={styles.subtotal}>
          ¥{(record.product.price * record.quantity).toFixed(2)}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: any) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.id)}
        >
          删除
        </Button>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: any[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const totalAmount = cartItems
    .filter((item: any) => selectedRowKeys.includes(item.id))
    .reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0);

  return (
    <div className={styles.container}>
      <Card>
        {cartItems.length > 0 ? (
          <>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={cartItems}
              rowKey="id"
              pagination={false}
            />
            <div className={styles.footer}>
              <div className={styles.total}>
                已选择 {selectedRowKeys.length} 件商品
                <span className={styles.amount}>
                  合计：¥{totalAmount.toFixed(2)}
                </span>
              </div>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingOutlined />}
                onClick={handleCheckout}
              >
                结算
              </Button>
            </div>
          </>
        ) : (
          <Empty
            description="购物车是空的"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => history.push('/product')}>
              去购物
            </Button>
          </Empty>
        )}
      </Card>
    </div>
  );
};

export default Cart;
