import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Modal,
  Form,
  message,
  Select,
  InputNumber,
  Upload,
  Switch,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { productApi, categoryApi } from "@/services/api";
import styles from "./index.less";

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const Product: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useState({
    pageNum: 1,
    pageSize: 10,
    keyword: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getList(searchParams);
      setProducts(data.data.records);
      setTotal(data.data.total);
    } catch (error) {
      console.error("获取商品列表失败:", error);
      message.error("获取商品列表失败");
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getList();
      setCategories(data.data);
    } catch (error) {
      console.error("获取分类列表失败:", error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchParams((prev) => ({ ...prev, keyword: value, pageNum: 1 }));
  };

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setVisible(true);
  };

  const handleEdit = (record: any) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const productData = editingId ? { ...values, id: editingId } : values;

      if (editingId) {
        await productApi.update(productData);
      } else {
        await productApi.create(productData);
      }

      message.success(`${editingId ? "更新" : "创建"}成功`);
      setVisible(false);
      fetchProducts();
    } catch (error) {
      console.error("提交失败:", error);
      message.error("提交失败");
    }
  };

  const handleStatusChange = async (id: number, status: boolean) => {
    try {
      await productApi.updateStatus(id, status ? 1 : 0);
      message.success("更新成功");
      fetchProducts();
    } catch (error) {
      console.error("更新状态失败:", error);
      message.error("更新状态失败");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "商品图片",
      dataIndex: "picture",
      key: "picture",
      render: (picture: string) => (
        <img src={picture} alt="商品图片" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "商品名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "副标题",
      dataIndex: "subtitle",
      key: "subtitle",
    },
    {
      title: "分类",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (categoryId: number) => {
        const category = categories.find((c: any) => c.id === categoryId);
        return category ? category.name : "";
      },
    },
    {
      title: "价格",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `¥${price}`,
    },
    {
      title: "库存",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "销量",
      dataIndex: "sales",
      key: "sales",
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
        <Button type="link" onClick={() => handleEdit(record)}>
          编辑
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.toolbar}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加商品
          </Button>
          <Search
            placeholder="搜索商品"
            onSearch={handleSearch}
            style={{ width: 200 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={products}
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

      <Modal
        title={`${editingId ? "编辑" : "添加"}商品`}
        open={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="商品名称"
            rules={[{ required: true, message: "请输入商品名称" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="subtitle"
            label="副标题"
            rules={[{ required: true, message: "请输入副标题" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="商品分类"
            rules={[{ required: true, message: "请选择商品分类" }]}
          >
            <Select>
              {categories.map((category: any) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="商品价格"
            rules={[{ required: true, message: "请输入商品价格" }]}
          >
            <InputNumber min={0} precision={2} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="stock"
            label="商品库存"
            rules={[{ required: true, message: "请输入商品库存" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="picture"
            label="商品图片"
            rules={[{ required: true, message: "请上传商品图片" }]}
          >
            <Upload
              name="file"
              action="/api/upload"
              headers={{
                Authorization: localStorage.getItem("token") || "",
              }}
              listType="picture"
              maxCount={1}
              onChange={({ file }) => {
                if (file.status === "done") {
                  form.setFieldsValue({
                    picture: file.response.data,
                  });
                }
              }}
            >
              <Button icon={<UploadOutlined />}>上传图片</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="description"
            label="商品描述"
            rules={[{ required: true, message: "请输入商品描述" }]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;
