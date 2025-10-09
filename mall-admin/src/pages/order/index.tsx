import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Input,
  Tag,
  Button,
  Modal,
  Form,
  message,
  Descriptions,
  Drawer,
  Timeline,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { orderApi } from "@/services/api";
import styles from "./index.less";

const { Search } = Input;

const Order: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [deliveryVisible, setDeliveryVisible] = useState(false);
  const [deliveryForm] = Form.useForm();
  const [searchParams, setSearchParams] = useState({
    pageNum: 1,
    pageSize: 10,
    keyword: "",
  });

  useEffect(() => {
    fetchOrders();
  }, [searchParams]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getList(searchParams);
      setOrders(data.data.records);
      setTotal(data.data.total);
    } catch (error) {
      console.error("获取订单列表失败:", error);
      message.error("获取订单列表失败");
    }
    setLoading(false);
  };

  const handleSearch = (value: string) => {
    setSearchParams((prev) => ({ ...prev, keyword: value, pageNum: 1 }));
  };

  const handleViewDetail = (record: any) => {
    setCurrentOrder(record);
    setDetailVisible(true);
  };

  const handleDelivery = (record: any) => {
    setCurrentOrder(record);
    setDeliveryVisible(true);
  };

  const handleDeliverySubmit = async () => {
    try {
      const values = await deliveryForm.validateFields();
      await orderApi.delivery({
        orderSn: currentOrder.orderSn,
        ...values,
      });

      message.success("发货成功");
      setDeliveryVisible(false);
      fetchOrders();
    } catch (error) {
      console.error("发货失败:", error);
      message.error("发货失败");
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

  const columns = [
    {
      title: "订单号",
      dataIndex: "orderSn",
      key: "orderSn",
    },
    {
      title: "用户",
      dataIndex: "receiverName",
      key: "receiverName",
    },
    {
      title: "订单金额",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: "支付方式",
      dataIndex: "payType",
      key: "payType",
      render: (payType: number) => {
        switch (payType) {
          case 1:
            return "支付宝";
          case 2:
            return "微信支付";
          default:
            return "-";
        }
      },
    },
    {
      title: "订单状态",
      dataIndex: "status",
      key: "status",
      render: (status: number) => getStatusTag(status),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "操作",
      key: "action",
      render: (text: string, record: any) => (
        <>
          <Button type="link" onClick={() => handleViewDetail(record)}>
            查看详情
          </Button>
          {record.status === 1 && (
            <Button type="link" onClick={() => handleDelivery(record)}>
              发货
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.toolbar}>
          <Search
            placeholder="搜索订单号/收货人"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{
            current: searchParams.pageNum,
            pageSize: searchParams.pageSize,
            total,
            onChange: (page, pageSize) => {
              setSearchParams((prev) => ({ ...prev, pageNum: page, pageSize }));
            },
          }}
        />
      </Card>

      <Drawer
        title="订单详情"
        width={800}
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
      >
        {currentOrder && (
          <>
            <Descriptions title="基本信息" bordered>
              <Descriptions.Item label="订单号" span={3}>
                {currentOrder.orderSn}
              </Descriptions.Item>
              <Descriptions.Item label="订单状态" span={3}>
                {getStatusTag(currentOrder.status)}
              </Descriptions.Item>
              <Descriptions.Item label="收货人">
                {currentOrder.receiverName}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                {currentOrder.receiverPhone}
              </Descriptions.Item>
              <Descriptions.Item label="收货地址">
                {currentOrder.receiverAddress}
              </Descriptions.Item>
              <Descriptions.Item label="订单金额" span={2}>
                ¥{currentOrder.totalAmount.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="运费">
                ¥{currentOrder.freightAmount.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="支付方式" span={3}>
                {currentOrder.payType === 1 ? "支付宝" : "微信支付"}
              </Descriptions.Item>
              <Descriptions.Item label="订单备注" span={3}>
                {currentOrder.note || "-"}
              </Descriptions.Item>
            </Descriptions>

            <Card title="商品信息" style={{ marginTop: 24 }}>
              <Table
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
                    render: (price: number) => `¥${price.toFixed(2)}`,
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
                      `¥${(
                        record.productPrice * record.productQuantity
                      ).toFixed(2)}`,
                  },
                ]}
                dataSource={currentOrder.orderItems}
                rowKey="id"
                pagination={false}
              />
            </Card>

            <Card title="订单跟踪" style={{ marginTop: 24 }}>
              <Timeline>
                <Timeline.Item>
                  订单创建 {currentOrder.createTime}
                </Timeline.Item>
                {currentOrder.payTime && (
                  <Timeline.Item>支付完成 {currentOrder.payTime}</Timeline.Item>
                )}
                {currentOrder.deliveryTime && (
                  <Timeline.Item>
                    商品发货 {currentOrder.deliveryTime}
                  </Timeline.Item>
                )}
                {currentOrder.receiveTime && (
                  <Timeline.Item>
                    确认收货 {currentOrder.receiveTime}
                  </Timeline.Item>
                )}
              </Timeline>
            </Card>
          </>
        )}
      </Drawer>

      <Modal
        title="订单发货"
        open={deliveryVisible}
        onOk={handleDeliverySubmit}
        onCancel={() => setDeliveryVisible(false)}
      >
        <Form form={deliveryForm} layout="vertical">
          <Form.Item
            name="deliveryCompany"
            label="物流公司"
            rules={[{ required: true, message: "请选择物流公司" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="deliverySn"
            label="物流单号"
            rules={[{ required: true, message: "请输入物流单号" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Order;
