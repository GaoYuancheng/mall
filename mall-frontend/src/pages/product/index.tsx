import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Input, Select, Pagination, List } from 'antd';
import { Link } from 'umi';
import styles from './index.less';

const { Search } = Input;
const { Option } = Select;

const Product: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    categoryId: undefined,
    brandName: undefined,
    pageNum: 1,
    pageSize: 12,
    sort: undefined,
  });

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams({
        ...searchParams,
        pageNum: searchParams.pageNum.toString(),
        pageSize: searchParams.pageSize.toString(),
      }).toString();

      const response = await fetch(`/api/product/list?${queryString}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data.records);
        setTotal(data.data.total);
      }
    } catch (error) {
      console.error('获取商品列表失败:', error);
    }
    setLoading(false);
  };

  const handleSearch = (value: string) => {
    setSearchParams(prev => ({ ...prev, keyword: value, pageNum: 1 }));
  };

  const handleSortChange = (value: string) => {
    setSearchParams(prev => ({ ...prev, sort: value, pageNum: 1 }));
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setSearchParams(prev => ({ ...prev, pageNum: page, pageSize }));
  };

  return (
    <div className={styles.container}>
      <Card className={styles.searchBar}>
        <Row gutter={16}>
          <Col span={16}>
            <Search
              placeholder="搜索商品"
              onSearch={handleSearch}
              enterButton
              allowClear
            />
          </Col>
          <Col span={8}>
            <Select
              placeholder="排序方式"
              style={{ width: '100%' }}
              onChange={handleSortChange}
            >
              <Option value="1">最新</Option>
              <Option value="2">销量</Option>
              <Option value="3">价格从低到高</Option>
              <Option value="4">价格从高到低</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
        dataSource={products}
        loading={loading}
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

      <div className={styles.pagination}>
        <Pagination
          current={searchParams.pageNum}
          pageSize={searchParams.pageSize}
          total={total}
          onChange={handlePageChange}
          showSizeChanger
          showQuickJumper
        />
      </div>
    </div>
  );
};

export default Product;
