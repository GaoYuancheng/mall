import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  DatePicker,
  Select,
  Switch,
  InputNumber,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const Marketing: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchPromotions();
    fetchProducts();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/promotion/list', {
        headers: {
          'Authorization': localStorage.getItem('token') || '',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPromotions(data.data);
      }
    } catch (error) {
      console.error('获取促销活动列表失败:', error);
      message.error('获取促销活动列表失败');
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/product/list?pageSize=1000', {
        headers: {
          'Authorization': localStorage.getItem('token') || '',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data.records);
      }
    } catch (error) {
      console.error('获取商品列表失败:', error);
    }
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
      const data = {
        ...values,
        startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
        endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
      };
      delete data.timeRange;

      const url = editingId
        ? `/api/admin/promotion/update`
        : '/api/admin/promotion/create';
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || '',
        },
        body: JSON.stringify(editingId ? { ...data, id: editingId } : data),
      });

      if (response.ok) {
        message.success(`${editingId ? '更新' : '创建'}成功`);
        setVisible(false);
        fetchPromotions();
      }
    } catch (error) {
      console.error('提交失败:', error);
      message.error('提交失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/promotion/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem('token') || '',
        },
      });

      if (response.ok) {
        message.success('删除成功');
        fetchPromotions();
      }
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  const handleStatusChange = async (id: number, status: boolean) => {
    try {
      const response = await fetch('/api/admin/promotion/updateStatus', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || '',
        },
        body: JSON.stringify({
          id,
          status: status ? 1 : 0,
        }),
      });

      if (response.ok) {
        message.success('更新成功');
        fetchPromotions();
      }
    } catch (error) {
      console.error('更新状态失败:', error);
      message.error('更新状态失败');
    }
  };

  const columns = [
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '活动类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => {
        switch (type) {
          case 1:
            return '满减';
          case 2:
            return '折扣';
          case 3:
            return '秒杀';
          default:
            return '-';
        }
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number, record: any) => (
        <Switch
          checked={status === 1}
          onChange={(checked) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
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
                title: '确认删除',
                content: '确定要删除该活动吗？',
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
            添加活动
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={promotions}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={`${editingId ? '编辑' : '添加'}活动`}
        open={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="活动名称"
            rules={[{ required: true, message: '请输入活动名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="活动类型"
            rules={[{ required: true, message: '请选择活动类型' }]}
          >
            <Select>
              <Option value={1}>满减</Option>
              <Option value={2}>折扣</Option>
              <Option value={3}>秒杀</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="timeRange"
            label="活动时间"
            rules={[{ required: true, message: '请选择活动时间' }]}
          >
            <RangePicker
              showTime
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="productIds"
            label="活动商品"
            rules={[{ required: true, message: '请选择活动商品' }]}
          >
            <Select mode="multiple">
              {products.map((product: any) => (
                <Option key={product.id} value={product.id}>
                  {product.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="rules"
            label="活动规则"
            rules={[{ required: true, message: '请输入活动规则' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="description"
            label="活动描述"
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Marketing;
