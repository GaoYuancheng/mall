import React from "react";
import { Card, Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { history } from "umi";
import styles from "./index.less";
import { userApi } from "../../services/api";

const Login: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    const res = await userApi.login(values);
    console.log("🚀 ~ handleSubmit ~ res:", res);

    localStorage.setItem("token", `Bearer ${res.data}`);
    message.success("登录成功");
    history.push("/dashboard");
  };

  return (
    <div className={styles.container}>
      <Card title="Mall Admin" className={styles.card}>
        <Form form={form} onFinish={handleSubmit} size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
