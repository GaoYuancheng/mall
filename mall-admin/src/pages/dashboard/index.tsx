import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import * as echarts from 'echarts';
import styles from './index.less';

const Dashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<any>({});

  useEffect(() => {
    fetchStatistics();
    initOrderChart();
    initSalesChart();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/admin/statistics/overview', {
        headers: {
          'Authorization': localStorage.getItem('token') || '',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStatistics(data.data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  const initOrderChart = () => {
    const chartDom = document.getElementById('orderChart');
    const myChart = echarts.init(chartDom);
    
    const option = {
      title: {
        text: '订单统计',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '订单数',
          type: 'line',
          data: [150, 230, 224, 218, 135, 147, 260],
        },
      ],
    };

    myChart.setOption(option);
  };

  const initSalesChart = () => {
    const chartDom = document.getElementById('salesChart');
    const myChart = echarts.init(chartDom);
    
    const option = {
      title: {
        text: '销售统计',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '销售额',
          type: 'bar',
          data: [15000, 23000, 22400, 21800, 13500, 14700, 26000],
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
            {/* TODO: 添加热门商品列表 */}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="最新订单">
            {/* TODO: 添加最新订单列表 */}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
