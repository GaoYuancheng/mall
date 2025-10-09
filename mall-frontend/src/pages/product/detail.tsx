import React, { useEffect, useState } from 'react';
import { useParams, history } from 'umi';
import { Card, Row, Col, Image, Button, InputNumber, message, Descriptions, Divider } from 'antd';
import { ShoppingCartOutlined, PayCircleOutlined } from '@ant-design/icons';
import styles from './detail.less';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      const response = await fetch(`/api/product/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data.data);
      }
    } catch (error) {
      console.error('获取商品详情失败:', error);
      message.error('获取商品详情失败');
    }
  };

  const handleAddToCart = async () => {
    if (!localStorage.getItem('token')) {
      message.warning('请先登录');
      history.push('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || '',
        },
        body: JSON.stringify({
          productId: id,
          quantity,
        }),
      });

      if (response.ok) {
        message.success('添加到购物车成功');
      } else {
        message.error('添加到购物车失败');
      }
    } catch (error) {
      console.error('添加到购物车失败:', error);
      message.error('添加到购物车失败');
    }
    setLoading(false);
  };

  const handleBuyNow = () => {
    if (!localStorage.getItem('token')) {
      message.warning('请先登录');
      history.push('/login');
      return;
    }

    // TODO: 实现立即购买功能
    history.push('/order/confirm', {
      products: [{
        id: product.id,
        quantity,
      }],
    });
  };

  if (!product) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Card>
        <Row gutter={24}>
          <Col span={12}>
            <Image
              src={product.picture}
              alt={product.name}
              className={styles.productImage}
            />
          </Col>
          <Col span={12}>
            <h1 className={styles.title}>{product.name}</h1>
            <div className={styles.subtitle}>{product.subtitle}</div>
            <div className={styles.price}>¥{product.price}</div>
            <Divider />
            <div className={styles.quantity}>
              <span className={styles.label}>数量：</span>
              <InputNumber
                min={1}
                max={product.stock}
                value={quantity}
                onChange={value => setQuantity(value)}
              />
              <span className={styles.stock}>库存：{product.stock}</span>
            </div>
            <div className={styles.actions}>
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                size="large"
                onClick={handleAddToCart}
                loading={loading}
              >
                加入购物车
              </Button>
              <Button
                type="primary"
                icon={<PayCircleOutlined />}
                size="large"
                onClick={handleBuyNow}
                style={{ marginLeft: 16 }}
              >
                立即购买
              </Button>
            </div>
          </Col>
        </Row>

        <Divider />

        <Descriptions title="商品详情" bordered>
          <Descriptions.Item label="商品名称" span={3}>
            {product.name}
          </Descriptions.Item>
          <Descriptions.Item label="商品品牌" span={3}>
            {product.brandName}
          </Descriptions.Item>
          <Descriptions.Item label="商品描述" span={3}>
            {product.description}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ProductDetail;
