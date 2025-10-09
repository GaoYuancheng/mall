import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  DatePicker,
  InputNumber,
  Select,
  Switch,
  Tag,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { couponApi } from "@/services/api";
import styles from "./index.less";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const Coupon: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await couponApi.getList();
      setCoupons(data.data);
    } catch (error) {
      console.error("获取优惠券列表失败:", error);
      message.error("获取优惠券列表失败");
    }
    setLoading(false);
  };

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setVisible(true);
  };

  const handleEdit = (record: any) => {
    form.setFieldsValue({
      ...record,
      timeRange: [moment(record.startTime), moment(record.endTime)],
    });
    setEditingId(record.id);
    setVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const [startTime, endTime] = values.timeRange;
      const couponData = {
        ...values,
        startTime: startTime.format("YYYY-MM-DD HH:mm:ss"),
        endTime: endTime.format("YYYY-MM-DD HH:mm:ss"),
      };
      delete couponData.timeRange;

      if (editingId) {
        await couponApi.update({ ...couponData, id: editingId });
      } else {
        await couponApi.create(couponData);
      }

      message.success(`${editingId ? "更新" : "创建"}成功`);
      setVisible(false);
      fetchCoupons();
    } catch (error) {
      console.error("提交失败:", error);
      message.error("提交失败");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await couponApi.delete(id);
      message.success("删除成功");
      fetchCoupons();
    } catch (error) {
      console.error("删除失败:", error);
      message.error("删除失败");
    }
  };

  const handleStatusChange = async (id: number, status: boolean) => {
    try {
      await couponApi.updateStatus(id, status ? 1 : 0);
      message.success("更新成功");
      fetchCoupons();
    } catch (error) {
      console.error("更新状态失败:", error);
      message.error("更新状态失败");
    }
  };

  const columns = [
    {
      title: "优惠券名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      render: (type: number) => {
        switch (type) {
          case 1:
            return "满减券";
          case 2:
            return "折扣券";
          case 3:
            return "无门槛券";
          default:
            return "-";
        }
      },
    },
    {
      title: "面值",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `¥${amount}`,
    },
    {
      title: "使用门槛",
      dataIndex: "minPoint",
      key: "minPoint",
      render: (minPoint: number) =>
        minPoint ? `满¥${minPoint}可用` : "无门槛",
    },
    {
      title: "发放数量",
      dataIndex: "publishCount",
      key: "publishCount",
    },
    {
      title: "已领取",
      dataIndex: "receiveCount",
      key: "receiveCount",
    },
    {
      title: "已使用",
      dataIndex: "useCount",
      key: "useCount",
    },
    {
      title: "有效期",
      key: "time",
      render: (text: string, record: any) => (
        <>
          <div>{record.startTime}</div>
          <div>{record.endTime}</div>
        </>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: number, record: any) => (
        <Switch
          checked={status === 1}
          onChange={(checked) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (text: string, record: any) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button
            type="link"
            danger
            onClick={() => {
              Modal.confirm({
                title: "确认删除",
                content: "确定要删除该优惠券吗？",
                onOk: () => handleDelete(record.id),
              });
            }}
          >
            删除
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.toolbar}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加优惠券
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={coupons}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={`${editingId ? "编辑" : "添加"}优惠券`}
        open={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="优惠券名称"
            rules={[{ required: true, message: "请输入优惠券名称" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="优惠券类型"
            rules={[{ required: true, message: "请选择优惠券类型" }]}
          >
            <Select>
              <Option value={1}>满减券</Option>
              <Option value={2}>折扣券</Option>
              <Option value={3}>无门槛券</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="amount"
            label="面值"
            rules={[{ required: true, message: "请输入面值" }]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: "100%" }}
              prefix="¥"
            />
          </Form.Item>

          <Form.Item
            name="minPoint"
            label="使用门槛"
            rules={[{ required: true, message: "请输入使用门槛" }]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: "100%" }}
              prefix="¥"
            />
          </Form.Item>

          <Form.Item
            name="publishCount"
            label="发放数量"
            rules={[{ required: true, message: "请输入发放数量" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="perLimit"
            label="每人限领"
            rules={[{ required: true, message: "请输入每人限领数量" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="timeRange"
            label="有效期"
            rules={[{ required: true, message: "请选择有效期" }]}
          >
            <RangePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="note" label="使用说明">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Coupon;
