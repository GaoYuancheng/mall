import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Carousel, List, Tag } from 'antd';
import { Link } from 'umi';
import styles from './index.less';

const Home: React.FC = () => {
  const [hotProducts, setHotProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    // TODO: 获取热门商品和新品
    fetchHotProducts();
    fetchNewProducts();
  }, []);

  const fetchHotProducts = async () => {
    try {
      const response = await fetch('/api/product/list?sort=2');
      if (response.ok) {
        const data = await response.json();
        setHotProducts(data.data.records);
      }
    } catch (error) {
      console.error('获取热门商品失败:', error);
    }
  };

  const fetchNewProducts = async () => {
    try {
      const response = await fetch('/api/product/list?sort=1');
      if (response.ok) {
        const data = await response.json();
        setNewProducts(data.data.records);
      }
    } catch (error) {
      console.error('获取新品失败:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Carousel autoplay>
        <div>
          <img src="/banner1.jpg" alt="banner1" />
        </div>
        <div>
          <img src="/banner2.jpg" alt="banner2" />
        </div>
        <div>
          <img src="/banner3.jpg" alt="banner3" />
        </div>
      </Carousel>

      <Card title="热门商品" className={styles.section}>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
          dataSource={hotProducts}
          renderItem={(item: any) => (
            <List.Item>
              <Link to={`/product/${item.id}`}>
                <Card
                  hoverable
                  cover={<img alt={item.name} src={item.picture} />}
                >
                  <Card.Meta
                    title={item.name}
                    description={
                      <>
                        <div className={styles.price}>¥{item.price}</div>
                        <div className={styles.sales}>销量: {item.sales}</div>
                      </>
                    }
                  />
                </Card>
              </Link>
            </List.Item>
          )}
        />
      </Card>

      <Card title="新品上市" className={styles.section}>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
          dataSource={newProducts}
          renderItem={(item: any) => (
            <List.Item>
              <Link to={`/product/${item.id}`}>
                <Card
                  hoverable
                  cover={<img alt={item.name} src={item.picture} />}
                >
                  <Card.Meta
                    title={item.name}
                    description={
                      <>
                        <div className={styles.price}>¥{item.price}</div>
                        <Tag color="#f50">新品</Tag>
                      </>
                    }
                  />
                </Card>
              </Link>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Home;
