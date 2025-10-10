import React, { useEffect, useState } from "react";
import { Card, Row, Col, DatePicker, Table, Radio, Statistic } from "antd";
import * as echarts from "echarts";
import moment from "moment";
import styles from "./index.less";
import { request } from "../../services/api";

const { RangePicker } = DatePicker;

const Statistics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    moment().subtract(7, "days"),
    moment(),
  ]);
  const [timeUnit, setTimeUnit] = useState("day");
  const [overview, setOverview] = useState<any>({});
  const [salesData, setSalesData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [productRanking, setProductRanking] = useState([]);
  const [userRanking, setUserRanking] = useState([]);

  useEffect(() => {
    fetchOverview();
    fetchSalesData();
    fetchOrderData();
    fetchProductRanking();
    fetchUserRanking();
  }, [dateRange, timeUnit]);

  const fetchOverview = async () => {
    try {
      const data = await request("/api/statistics/overview");
      setOverview(data.data || {});
    } catch (error) {
      console.error("获取概览数据失败:", error);
    }
  };

  const fetchSalesData = async () => {
    try {
      const params = new URLSearchParams({
        startTime: dateRange[0].format("YYYY-MM-DD"),
        endTime: dateRange[1].format("YYYY-MM-DD"),
        timeUnit,
      });
      const data = await request(`/api/statistics/sales?${params.toString()}`);
      setSalesData(data.data || []);
      initSalesChart(data.data || []);
    } catch (error) {
      console.error("获取销售数据失败:", error);
    }
  };

  const fetchOrderData = async () => {
    try {
      const params = new URLSearchParams({
        startTime: dateRange[0].format("YYYY-MM-DD"),
        endTime: dateRange[1].format("YYYY-MM-DD"),
        timeUnit,
      });
      const data = await request(`/api/statistics/orders?${params.toString()}`);
      setOrderData(data.data || []);
      initOrderChart(data.data || []);
    } catch (error) {
      console.error("获取订单数据失败:", error);
    }
  };

  const fetchProductRanking = async () => {
    try {
      const params = new URLSearchParams({
        startTime: dateRange[0].format("YYYY-MM-DD"),
        endTime: dateRange[1].format("YYYY-MM-DD"),
      });
      const data = await request(
        `/api/statistics/products/ranking?${params.toString()}`
      );
      setProductRanking(data.data || []);
    } catch (error) {
      console.error("获取商品排行失败:", error);
    }
  };

  const fetchUserRanking = async () => {
    try {
      const params = new URLSearchParams({
        startTime: dateRange[0].format("YYYY-MM-DD"),
        endTime: dateRange[1].format("YYYY-MM-DD"),
      });
      const data = await request(
        `/api/statistics/users/ranking?${params.toString()}`
      );
      setUserRanking(data.data || []);
    } catch (error) {
      console.error("获取用户排行失败:", error);
    }
  };

  const initSalesChart = (data: any[]) => {
    const chartDom = document.getElementById("salesChart");
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: "销售趋势",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: data.map((item) => item.date),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "销售额",
          type: "line",
          data: data.map((item) => item.amount),
          smooth: true,
          areaStyle: {},
        },
      ],
    };

    myChart.setOption(option);
  };

  const initOrderChart = (data: any[]) => {
    const chartDom = document.getElementById("orderChart");
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: "订单趋势",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: data.map((item) => item.date),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "订单数",
          type: "bar",
          data: data.map((item) => item.count),
        },
      ],
    };

    myChart.setOption(option);
  };

  const productColumns = [
    {
      title: "排名",
      dataIndex: "rank",
      key: "rank",
      render: (text: string, record: any, index: number) => index + 1,
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
      title: "销量",
      dataIndex: "sales",
      key: "sales",
    },
    {
      title: "销售额",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
  ];

  const userColumns = [
    {
      title: "排名",
      dataIndex: "rank",
      key: "rank",
      render: (text: string, record: any, index: number) => index + 1,
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "消费次数",
      dataIndex: "orderCount",
      key: "orderCount",
    },
    {
      title: "消费金额",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
  ];

  return (
    <div className={styles.container}>
      <Row gutter={24}>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日销售额"
              value={overview.todaySales || 0}
              prefix="¥"
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="今日订单数" value={overview.todayOrders || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="今日新增用户" value={overview.todayUsers || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="转化率"
              value={overview.conversionRate || 0}
              suffix="%"
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      <Card className={styles.chart}>
        <div className={styles.toolbar}>
          <Radio.Group
            value={timeUnit}
            onChange={(e) => setTimeUnit(e.target.value)}
          >
            <Radio.Button value="hour">按小时</Radio.Button>
            <Radio.Button value="day">按天</Radio.Button>
            <Radio.Button value="month">按月</Radio.Button>
          </Radio.Group>
          <RangePicker
            value={dateRange as any}
            onChange={(dates) => setDateRange(dates as any)}
          />
        </div>
        <Row gutter={24}>
          <Col span={12}>
            <div id="salesChart" className={styles.chartItem} />
          </Col>
          <Col span={12}>
            <div id="orderChart" className={styles.chartItem} />
          </Col>
        </Row>
      </Card>

      <Row gutter={24}>
        <Col span={12}>
          <Card title="商品销售排行">
            <Table
              columns={productColumns}
              dataSource={productRanking}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="用户消费排行">
            <Table
              columns={userColumns}
              dataSource={userRanking}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;
