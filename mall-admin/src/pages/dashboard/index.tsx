import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, DatePicker, Table } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import * as echarts from "echarts";
import styles from "./index.less";
import moment from "moment";
import { statisticsApi, orderApi } from "../../services/api";

const { RangePicker } = DatePicker;

const Dashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<any>({});
  const [dateRange, setDateRange] = useState([
    moment().subtract(7, "days"),
    moment(),
  ]);
  const [timeUnit, setTimeUnit] = useState("day");
  const [salesSeries, setSalesSeries] = useState<any[]>([]);
  const [orderSeries, setOrderSeries] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [latestOrders, setLatestOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  useEffect(() => {
    fetchTrends();
    fetchTopProducts();
    fetchLatestOrders();
  }, [dateRange, timeUnit]);

  const fetchStatistics = async () => {
    try {
      const res = await statisticsApi.getOverview();
      setStatistics(res.data || {});
    } catch (error) {
      console.error("获取统计数据失败:", error);
    }
  };

  const fetchTrends = async () => {
    try {
      const startTime = dateRange[0].format("YYYY-MM-DD");
      const endTime = dateRange[1].format("YYYY-MM-DD");
      const salesRes = await statisticsApi.getSales({
        startTime,
        endTime,
        timeUnit,
      });
      const ordersRes = await statisticsApi.getOrders({
        startTime,
        endTime,
        timeUnit,
      });

      const salesData = salesRes.data || [];
      const ordersData = ordersRes.data || [];
      setSalesSeries(salesData);
      setOrderSeries(ordersData);
      initSalesChart(salesData);
      initOrderChart(ordersData);
    } catch (error) {
      console.error("获取趋势数据失败:", error);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const startTime = dateRange[0].format("YYYY-MM-DD");
      const endTime = dateRange[1].format("YYYY-MM-DD");
      const res = await statisticsApi.getProductRanking({ startTime, endTime });
      setTopProducts(res.data || []);
    } catch (error) {
      console.error("获取商品排行失败:", error);
    }
  };

  const fetchLatestOrders = async () => {
    try {
      const res = await orderApi.getList({ pageNum: 1, pageSize: 10 });
      setLatestOrders((res.data && res.data.records) || []);
    } catch (error) {
      console.error("获取最新订单失败:", error);
    }
  };

  const initOrderChart = (data: any[] = orderSeries) => {
    const chartDom = document.getElementById("orderChart");
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: "订单统计",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: data.map((item: any) => item.date),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "订单数",
          type: "line",
          data: data.map((item: any) => item.count),
        },
      ],
    };

    myChart.setOption(option);
  };

  const initSalesChart = (data: any[] = salesSeries) => {
    const chartDom = document.getElementById("salesChart");
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: "销售统计",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: data.map((item: any) => item.date),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "销售额",
          type: "bar",
          data: data.map((item: any) => item.amount),
        },
      ],
    };

    myChart.setOption(option);
  };

  return (
    <div className={styles.container}>
      <Row gutter={24}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={statistics.totalUsers || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总订单数"
              value={statistics.totalOrders || 0}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总销售额"
              value={statistics.totalSales || 0}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="商品数量"
              value={statistics.totalProducts || 0}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24} className={styles.charts}>
        <Col span={12}>
          <Card>
            <div style={{ marginBottom: 12 }}>
              <RangePicker
                value={dateRange as any}
                onChange={(dates) => setDateRange(dates as any)}
              />
            </div>
            <div id="orderChart" className={styles.chart} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <div id="salesChart" className={styles.chart} />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Card title="热门商品">
            <Table
              size="small"
              rowKey="id"
              pagination={false}
              dataSource={topProducts}
              columns={[
                {
                  title: "排名",
                  key: "rank",
                  render: (_: any, __: any, i: number) => i + 1,
                },
                { title: "商品名称", dataIndex: "name", key: "name" },
                { title: "销量", dataIndex: "sales", key: "sales" },
                {
                  title: "销售额",
                  dataIndex: "amount",
                  key: "amount",
                  render: (v: number) => `¥${(v || 0).toFixed(2)}`,
                },
              ]}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="最新订单">
            <Table
              size="small"
              rowKey="id"
              pagination={false}
              dataSource={latestOrders}
              columns={[
                { title: "订单号", dataIndex: "orderSn", key: "orderSn" },
                {
                  title: "用户",
                  dataIndex: "receiverName",
                  key: "receiverName",
                },
                {
                  title: "金额",
                  dataIndex: "totalAmount",
                  key: "totalAmount",
                  render: (v: number) => `¥${(v || 0).toFixed(2)}`,
                },
                {
                  title: "创建时间",
                  dataIndex: "createTime",
                  key: "createTime",
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
