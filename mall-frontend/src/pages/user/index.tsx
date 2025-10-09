import React, { useEffect, useState } from 'react';
import { Card, Tabs, Form, Input, Button, message, List } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import styles from './index.less';

const { TabPane } = Tabs;

const User: React.FC = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserInfo();
    fetchUserCoupons();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('/api/user/info', {
        headers: {
          'Authorization': localStorage.getItem('token') || '',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.data);
        form.setFieldsValue(data.data);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      message.error('获取用户信息失败');
    }
  };

  const fetchUserCoupons = async () => {
    try {
      const response = await fetch('/api/coupon/user/list', {
        headers: {
          'Authorization': localStorage.getItem('token') || '',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCoupons(data.data);
      }
    } catch (error) {
      console.error('获取优惠券列表失败:', error);
      message.error('获取优惠券列表失败');
    }
  };

  const handleUpdateInfo = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || '',
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        message.success('更新成功');
        fetchUserInfo();
      }
    } catch (error) {
      console.error('更新用户信息失败:', error);
      message.error('更新用户信息失败');
    }
    setLoading(false);
  };

  const handleUpdatePassword = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/updatePassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || '',
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        message.success('密码修改成功，请重新登录');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('修改密码失败:', error);
      message.error('修改密码失败');
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="个人信息" key="1">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateInfo}
            >
              <Form.Item
                name="nickname"
                label="昵称"
                rules={[{ required: true, message: '请输入昵称' }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                name="phone"
                label="手机号"
                rules={[{ required: true, message: '请输入手机号' }]}
              >
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>

              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入正确的邮箱格式' },
                ]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  保存修改
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="修改密码" key="2">
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleUpdatePassword}
            >
              <Form.Item
                name="oldPassword"
                label="原密码"
                rules={[{ required: true, message: '请输入原密码' }]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="新密码"
                rules={[{ required: true, message: '请输入新密码' }]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="确认密码"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: '请确认新密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  修改密码
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="我的优惠券" key="3">
            <List
              dataSource={coupons}
              renderItem={(coupon: any) => (
                <List.Item>
                  <Card className={styles.coupon}>
                    <div className={styles.amount}>¥{coupon.amount}</div>
                    <div className={styles.info}>
                      <div className={styles.name}>{coupon.name}</div>
                      <div className={styles.condition}>
                        满{coupon.minPoint}元可用
                      </div>
                      <div className={styles.time}>
                        {coupon.startTime} - {coupon.endTime}
                      </div>
                    </div>
                    <div className={styles.status}>
                      {coupon.useStatus === 0 ? '未使用' : '已使用'}
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default User;
