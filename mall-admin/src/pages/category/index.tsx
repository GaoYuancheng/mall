import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  TreeSelect,
  Upload,
  InputNumber,
  Switch,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import styles from "./index.less";
import { categoryApi, uploadApi } from "../../services/api";

const { TextArea } = Input;

const Category: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.getList();
      setCategories(res.data || []);
    } catch (error) {
      console.error("获取分类列表失败:", error);
      // request 已统一处理错误提示，此处不重复提示
    } finally {
      setLoading(false);
    }
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
      if (editingId) {
        await categoryApi.update({ ...values, id: editingId });
        message.success("更新成功");
      } else {
        await categoryApi.create(values);
        message.success("创建成功");
      }
      setVisible(false);
      fetchCategories();
    } catch (error) {
      console.error("提交失败:", error);
      // request 已统一处理错误提示，此处不重复提示
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await categoryApi.delete(id);
      message.success("删除成功");
      fetchCategories();
    } catch (error) {
      console.error("删除失败:", error);
      // request 已统一处理错误提示，此处不重复提示
    }
  };

  const handleStatusChange = async (id: number, status: boolean) => {
    try {
      await categoryApi.updateStatus(id, status ? 1 : 0);
      message.success("状态更新成功");
      fetchCategories();
    } catch (error) {
      console.error("更新状态失败:", error);
      // request 已统一处理错误提示，此处不重复提示
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "分类名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "图标",
      dataIndex: "icon",
      key: "icon",
      render: (icon: string) =>
        icon ? (
          <img src={icon} alt="分类图标" style={{ width: 30, height: 30 }} />
        ) : (
          "-"
        ),
    },
    {
      title: "排序",
      dataIndex: "sort",
      key: "sort",
    },
    {
      title: "层级",
      dataIndex: "level",
      key: "level",
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
                content: "确定要删除该分类吗？",
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
            添加分类
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={`${editingId ? "编辑" : "添加"}分类`}
        open={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: "请输入分类名称" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="parentId" label="上级分类">
            <TreeSelect
              treeData={categories.map((item: any) => ({
                title: item.name,
                value: item.id,
                disabled: editingId === item.id,
              }))}
              placeholder="请选择上级分类"
              allowClear
              treeDefaultExpandAll
            />
          </Form.Item>

          <Form.Item name="icon" label="分类图标">
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
                    icon: file.response.data,
                  });
                }
              }}
            >
              <Button icon={<UploadOutlined />}>上传图标</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="sort"
            label="排序"
            rules={[{ required: true, message: "请输入排序值" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="description" label="描述">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Category;
