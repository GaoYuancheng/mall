import React, { useEffect, useState } from 'react';
import { Card, List, Radio, Button, Form, Input, message } from 'antd';
import { history, useLocation } from 'umi';
import styles from './confirm.less';

const OrderConfirm: React.FC = () => {
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [products] = useState(location.state?.products || []);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  useEffect(() => {
    if (!location.state?.products) {
      history.push('/cart');
      return;
    }
    fetchUserCoupons();
  }, []);

  const fetchUserCoupons = async () => {
    try {
      const totalAmount = products.reduce((sum: number, item: any) => 
        sum + item.product.price * item.quantity, 0
      );

      const response = await fetch(`/api/coupon/user/available?totalAmount=${totalAmount}`, {
        headers: {
          'Authorization': localStorage.getItem('token') || '',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCoupons(data.data);
      }
    } catch (error) {
      console.error('获取优惠券失败:', error);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 创建订单
      const orderResponse = await fetch('/api/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || '',
        },
        body: JSON.stringify({
          products: products.map((item: any) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          couponId: selectedCoupon,
          receiverName: values.receiverName,
          receiverPhone: values.receiverPhone,
          receiverAddress: values.receiverAddress,
          note: values.note,
        }),
      });

      if (orderResponse.ok) {
        const orderData = await orderResponse.json();
        
        // 创建支付订单
        const paymentResponse = await fetch('/api/payment/pay', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') || '',
          },
          body: JSON.stringify({
            orderSn: orderData.data,
            payType: 1, // 支付宝支付
          }),
        });

        if (paymentResponse.ok) {
          const paymentData = await paymentResponse.json();
          // 打开支付页面
          const div = document.createElement('div');
          div.innerHTML = paymentData.data;
          document.body.appendChild(div);
          document.forms[0].submit();
        }
      }
    } catch (error) {
      console.error('提交订单失败:', error);
      message.error('提交订单失败');
    }
    setLoading(false);
  };

  const totalAmount = products.reduce((sum: number, item: any) => 
    sum + item.product.price * item.quantity, 0
  );

  const discountAmount = selectedCoupon ? 
    coupons.find((coupon: any) => coupon.id === selectedCoupon)?.amount || 0 : 0;

  const finalAmount = totalAmount - discountAmount;

  return (
    <div className={styles.container}>
      <Card title="确认订单" className={styles.card}>
        <List
          dataSource={products}
          renderItem={(item: any) => (
            <List.Item>
              <div className={styles.product}>
                <img src={item.product.picture} alt={item.product.name} />
                <div className={styles.info}>
                  <div className={styles.name}>{item.product.name}</div>
                  <div className={styles.price}>
                    ¥{item.product.price} × {item.quantity}
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />

        {coupons.length > 0 && (
          <div className={styles.coupons}>
            <h3>可用优惠券</h3>
            <Radio.Group
              onChange={(e) => setSelectedCoupon(e.target.value)}
              value={selectedCoupon}
            >
              {coupons.map((coupon: any) => (
                <Radio key={coupon.id} value={coupon.id}>
                  {coupon.name} - ¥{coupon.amount}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
        >
          <Form.Item
            name="receiverName"
            label="收货人"
            rules={[{ required: true, message: '请输入收货人' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="receiverPhone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="receiverAddress"
            label="收货地址"
            rules={[{ required: true, message: '请输入收货地址' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="note" label="订单备注">
            <Input.TextArea rows={3} />
          </Form.Item>

          <div className={styles.footer}>
            <div className={styles.amount}>
              <div>商品总额：¥{totalAmount.toFixed(2)}</div>
              {discountAmount > 0 && (
                <div>优惠金额：-¥{discountAmount.toFixed(2)}</div>
              )}
              <div className={styles.total}>
                应付金额：¥{finalAmount.toFixed(2)}
              </div>
            </div>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={loading}
            >
              提交订单
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default OrderConfirm;
