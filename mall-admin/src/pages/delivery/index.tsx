import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Tag,
  Modal,
  Timeline,
  Drawer,
  Descriptions,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { deliveryApi } from "@/services/api";
import styles from "./index.less";

const { Search } = Input;

const Delivery: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [total, setTotal] = useState(0);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentDelivery, setCurrentDelivery] = useState<any>(null);
  const [traceVisible, setTraceVisible] = useState(false);
  const [traces, setTraces] = useState([]);
  const [searchParams, setSearchParams] = useState({
    pageNum: 1,
    pageSize: 10,
    keyword: "",
  });

  useEffect(() => {
    fetchDeliveries();
  }, [searchParams]);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const data = await deliveryApi.getList(searchParams);
      setDeliveries(data.data.records);
      setTotal(data.data.total);
    } catch (error) {
      console.error("获取物流列表失败:", error);
      message.error("获取物流列表失败");
    }
    setLoading(false);
  };

  const handleSearch = (value: string) => {
    setSearchParams((prev) => ({ ...prev, keyword: value, pageNum: 1 }));
  };

  const handleViewDetail = (record: any) => {
    setCurrentDelivery(record);
    setDetailVisible(true);
  };

  const handleViewTrace = async (record: any) => {
    try {
      const data = await deliveryApi.getTrace(record.orderSn);
      setTraces(data.data);
      setTraceVisible(true);
    } catch (error) {
      console.error("获取物流轨迹失败:", error);
      message.error("获取物流轨迹失败");
    }
  };

  const handleSyncTrace = async (orderSn: string) => {
    try {
      await deliveryApi.syncTrace(orderSn);
      message.success("同步成功");
      handleViewTrace({ orderSn });
    } catch (error) {
      console.error("同步物流轨迹失败:", error);
      message.error("同步物流轨迹失败");
    }
  };

  const getStatusTag = (status: number) => {
    switch (status) {
      case 0:
        return <Tag color="blue">待发货</Tag>;
      case 1:
        return <Tag color="green">已发货</Tag>;
      case 2:
        return <Tag color="cyan">已签收</Tag>;
      case -1:
        return <Tag color="red">异常</Tag>;
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
      title: "物流单号",
      dataIndex: "deliverySn",
      key: "deliverySn",
    },
    {
      title: "物流公司",
      dataIndex: "deliveryCompany",
      key: "deliveryCompany",
    },
    {
      title: "收货人",
      dataIndex: "receiverName",
      key: "receiverName",
    },
    {
      title: "联系电话",
      dataIndex: "receiverPhone",
      key: "receiverPhone",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: number) => getStatusTag(status),
    },
    {
      title: "发货时间",
      dataIndex: "deliveryTime",
      key: "deliveryTime",
    },
    {
      title: "操作",
      key: "action",
      render: (text: string, record: any) => (
        <>
          <Button type="link" onClick={() => handleViewDetail(record)}>
            查看详情
          </Button>
          <Button type="link" onClick={() => handleViewTrace(record)}>
            物流轨迹
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.toolbar}>
          <Search
            placeholder="搜索订单号/物流单号/收货人"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={deliveries}
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
        title="物流详情"
        width={800}
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
      >
        {currentDelivery && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="订单号">
              {currentDelivery.orderSn}
            </Descriptions.Item>
            <Descriptions.Item label="物流单号">
              {currentDelivery.deliverySn}
            </Descriptions.Item>
            <Descriptions.Item label="物流公司">
              {currentDelivery.deliveryCompany}
            </Descriptions.Item>
            <Descriptions.Item label="收货人">
              {currentDelivery.receiverName}
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">
              {currentDelivery.receiverPhone}
            </Descriptions.Item>
            <Descriptions.Item label="收货地址">
              {`${currentDelivery.receiverProvince}${currentDelivery.receiverCity}${currentDelivery.receiverRegion}${currentDelivery.receiverDetailAddress}`}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              {getStatusTag(currentDelivery.status)}
            </Descriptions.Item>
            <Descriptions.Item label="发货时间">
              {currentDelivery.deliveryTime}
            </Descriptions.Item>
            {currentDelivery.receiveTime && (
              <Descriptions.Item label="签收时间">
                {currentDelivery.receiveTime}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="备注">
              {currentDelivery.note || "-"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>

      <Modal
        title="物流轨迹"
        open={traceVisible}
        onOk={() => setTraceVisible(false)}
        onCancel={() => setTraceVisible(false)}
        footer={[
          <Button
            key="sync"
            type="primary"
            onClick={() => handleSyncTrace(currentDelivery?.orderSn)}
          >
            同步最新轨迹
          </Button>,
          <Button key="close" onClick={() => setTraceVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        <Timeline>
          {traces.map((trace: any) => (
            <Timeline.Item key={trace.id}>
              <div className={styles.trace}>
                <div className={styles.content}>{trace.traceContent}</div>
                <div className={styles.time}>{trace.traceTime}</div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Modal>
    </div>
  );
};

export default Delivery;
