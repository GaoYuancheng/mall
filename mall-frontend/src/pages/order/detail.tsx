import React, { useEffect, useState } from "react";
import { useParams, history } from "umi";
import {
  Card,
  Descriptions,
  Button,
  Timeline,
  Tag,
  Divider,
  Table,
  message,
} from "antd";
import styles from "./detail.less";

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [logistics, setLogistics] = useState<any[]>([]);

  useEffect(() => {
    fetchOrderDetail();
    fetchLogistics();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      const response = await fetch(`/api/order/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrder(data.data);
      }
    } catch (error) {
      console.error("获取订单详情失败:", error);
      message.error("获取订单详情失败");
    }
  };

  const fetchLogistics = async () => {
    try {
      const response = await fetch(`/api/delivery/trace/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setLogistics(data.data);
      }
    } catch (error) {
      console.error("获取物流信息失败:", error);
      message.error("获取物流信息失败");
    }
  };

  const handleCancel = async () => {
    try {
      const response = await fetch(`/api/order/cancel/${id}`, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      if (response.ok) {
        message.success("取消订单成功");
        fetchOrderDetail();
      }
    } catch (error) {
      console.error("取消订单失败:", error);
      message.error("取消订单失败");
    }
  };

  const handlePay = () => {
    history.push(`/order/pay/${id}`);
  };

  const handleConfirmReceive = async () => {
    try {
      const response = await fetch(`/api/order/confirm/${id}`, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      if (response.ok) {
        message.success("确认收货成功");
        fetchOrderDetail();
      }
    } catch (error) {
      console.error("确认收货失败:", error);
      message.error("确认收货失败");
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

  const getOrderActions = () => {
    if (!order) return null;

    const actions = [];
    if (order.status === 0) {
      actions.push(
        <Button key="pay" type="primary" onClick={handlePay}>
          立即付款
        </Button>,
        <Button key="cancel" onClick={handleCancel}>
          取消订单
        </Button>
      );
    } else if (order.status === 2) {
      actions.push(
        <Button key="confirm" type="primary" onClick={handleConfirmReceive}>
          确认收货
        </Button>
      );
    }
    return actions;
  };

  if (!order) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Card title="订单详情" extra={getOrderActions()} className={styles.card}>
        <Descriptions bordered>
          <Descriptions.Item label="订单编号" span={2}>
            {order.orderSn}
          </Descriptions.Item>
          <Descriptions.Item label="订单状态">
            {getStatusTag(order.status)}
          </Descriptions.Item>
          <Descriptions.Item label="收货人">
            {order.receiverName}
          </Descriptions.Item>
          <Descriptions.Item label="联系电话">
            {order.receiverPhone}
          </Descriptions.Item>
          <Descriptions.Item label="收货地址">
            {order.receiverAddress}
          </Descriptions.Item>
          <Descriptions.Item label="订单金额" span={2}>
            ¥{order.totalAmount}
          </Descriptions.Item>
          <Descriptions.Item label="运费">
            ¥{order.freightAmount}
          </Descriptions.Item>
          <Descriptions.Item label="支付方式" span={3}>
            {order.payType === 1 ? "支付宝" : "微信支付"}
          </Descriptions.Item>
          <Descriptions.Item label="订单备注" span={3}>
            {order.note || "-"}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Table
          title={() => "商品信息"}
          columns={[
            {
              title: "商品图片",
              dataIndex: "productPic",
              key: "productPic",
              render: (pic: string) => (
                <img
                  src={pic}
                  alt="商品图片"
                  style={{ width: 50, height: 50 }}
                />
              ),
            },
            {
              title: "商品名称",
              dataIndex: "productName",
              key: "productName",
            },
            {
              title: "单价",
              dataIndex: "productPrice",
              key: "productPrice",
              render: (price: number) => `¥${price}`,
            },
            {
              title: "数量",
              dataIndex: "productQuantity",
              key: "productQuantity",
            },
            {
              title: "小计",
              key: "subtotal",
              render: (text: string, record: any) =>
                `¥${(record.productPrice * record.productQuantity).toFixed(2)}`,
            },
          ]}
          dataSource={order.orderItems}
          rowKey="id"
          pagination={false}
        />

        {logistics.length > 0 && (
          <>
            <Divider />
            <Timeline>
              {logistics.map((item: any) => (
                <Timeline.Item key={item.id}>
                  <div className={styles.trace}>
                    <div className={styles.content}>{item.traceContent}</div>
                    <div className={styles.time}>{item.traceTime}</div>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </>
        )}
      </Card>
    </div>
  );
};

export default OrderDetail;
