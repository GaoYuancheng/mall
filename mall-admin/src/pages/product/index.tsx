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
import { productApi, categoryApi, userApi } from "../../services/api";
import "./index.less";

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const Product: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [approverOptions, setApproverOptions] = useState<any[]>([]);
  const [approverLoading, setApproverLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    pageNum: 1,
    pageSize: 10,
    keyword: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchCurrentUser();
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

  const fetchCurrentUser = async () => {
    try {
      const res = await userApi.getCurrent();
      setCurrentUser(res?.data || null);
    } catch (error) {
      console.error("获取当前用户失败:", error);
    }
  };

  const fetchApprovers = async (keyword?: string) => {
    setApproverLoading(true);
    try {
      const res = await userApi.getList({
        pageNum: 1,
        pageSize: 20,
        ...(keyword ? { username: keyword } : {}),
      });
      const list = res?.data?.list || res?.data || [];
      setApproverOptions(list);
    } catch (error) {
      console.error("获取审批人失败:", error);
    }
    setApproverLoading(false);
  };

  const handleSearch = (value: string) => {
    setSearchParams((prev) => ({ ...prev, keyword: value, pageNum: 1 }));
  };

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    fetchApprovers();
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
        const productData = { ...values, id: editingId };
        await productApi.update(productData);
      } else {
        if (!currentUser?.id) {
          message.error("未获取到当前用户，请重新登录");
          return;
        }
        const { approverId, ...productFields } = values;
        const createPayload = {
          product: productFields,
          submitterId: currentUser.id,
          approverId,
        };
        await productApi.create(createPayload);
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
    // {
    //   title: "状态",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status: number, record: any) => (
    //     <Switch
    //       checked={status === 1}
    //       onChange={(checked) => handleStatusChange(record.id, checked)}
    //     />
    //   ),
    // },

    {
      title: "审批状态",
      dataIndex: "approvalStatusText",
      key: "approvalStatusText",
    },

    // 审批状态列不允许前端直接修改，已移除
    {
      title: "操作",
      key: "action",
      render: (text: string, record: any) => (
        <>
          {record.approvalStatus === 2 && (
            <Button type="link" onClick={() => handleEdit(record)}>
              编辑
            </Button>
          )}

          {record.approvalStatus === 0 && (
            <>
              <Button
                type="link"
                onClick={async () => {
                  try {
                    const pending = await productApi.getPendingApprovalTask(
                      record.id
                    );
                    const taskId = pending?.data?.id;
                    if (!taskId) {
                      message.warning("无待审批任务");
                      return;
                    }
                    if (!currentUser?.id) {
                      message.error("未获取到当前用户，请重新登录");
                      return;
                    }
                    await productApi.approve(taskId, currentUser.id);
                    message.success("审批通过");
                    fetchProducts();
                  } catch (e) {
                    message.error("审批通过失败");
                  }
                }}
              >
                审批通过
              </Button>
              <Button
                type="link"
                danger
                onClick={async () => {
                  try {
                    const pending = await productApi.getPendingApprovalTask(
                      record.id
                    );
                    const taskId = pending?.data?.id;
                    if (!taskId) {
                      message.warning("无待审批任务");
                      return;
                    }
                    if (!currentUser?.id) {
                      message.error("未获取到当前用户，请重新登录");
                      return;
                    }
                    await productApi.reject(taskId, currentUser.id);
                    message.success("已拒绝");
                    fetchProducts();
                  } catch (e) {
                    message.error("审批拒绝失败");
                  }
                }}
              >
                审批拒绝
              </Button>
            </>
          )}
          <Button
            type="link"
            onClick={async () => {
              try {
                const res = await productApi.getApprovalLogs(record.id);
                const logs = res?.data || [];
                Modal.info({
                  title: "审批日志",
                  width: 600,
                  content: (
                    <div>
                      {logs.length === 0 ? (
                        <div>暂无日志</div>
                      ) : (
                        <ul>
                          {logs.map((log: any) => (
                            <li key={log.id}>
                              {log.createTime} - {log.action} -{" "}
                              {log.remark || ""}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ),
                });
              } catch (e) {
                message.error("获取审批日志失败");
              }
            }}
          >
            查看日志
          </Button>
          {(record.approvalStatus === 1 || record.approvalStatus === 2) && (
            <Button
              type="link"
              danger
              onClick={async () => {
                try {
                  Modal.confirm({
                    title: "确认删除该商品吗？",
                    onOk: async () => {
                      await productApi.delete(record.id);
                      message.success("删除成功");
                      fetchProducts();
                    },
                  });
                } catch (e) {
                  message.error("删除失败");
                }
              }}
            >
              删除
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="container">
      <Card>
        <div className="toolbar">
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

          {/* <Form.Item
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
          </Form.Item> */}

          <Form.Item
            name="description"
            label="商品描述"
            rules={[{ required: true, message: "请输入商品描述" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          {/* 审批状态不允许在前端编辑，表单项移除 */}

          {editingId === null && (
            <Form.Item
              name="approverId"
              label="审批人"
              rules={[{ required: true, message: "请选择审批人" }]}
            >
              <Select
                showSearch
                placeholder="请选择审批人"
                loading={approverLoading}
                filterOption={false}
                onSearch={(val) => fetchApprovers(val)}
                allowClear
              >
                {approverOptions.map((u: any) => (
                  <Option key={u.id} value={u.id}>
                    {u.username || u.nickname || `用户${u.id}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Product;
