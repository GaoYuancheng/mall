package com.mall.monolith.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.monolith.dto.ProductVO;
import com.mall.monolith.mapper.ProductMapper;
import com.mall.monolith.model.Product;
import com.mall.monolith.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 商品服务实现类
 * 
 * 提供商品的CRUD操作、库存管理、状态更新等功能
 * 
 * @author mall-monolith
 * @version 1.0
 */
@Service
public class ProductServiceImpl implements ProductService {
    
    @Autowired
    private ProductMapper productMapper;
    
    /**
     * 创建商品
     * 
     * @param product 商品信息
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createProduct(Product product) {
        // 设置创建时间和更新时间
        LocalDateTime now = LocalDateTime.now();
        product.setCreateTime(now);
        product.setUpdateTime(now);
        
        // 设置默认值
        if (product.getStatus() == null) {
            product.setStatus(1); // 默认上架
        }
        if (product.getStock() == null) {
            product.setStock(0); // 默认库存为0
        }
        if (product.getSales() == null) {
            product.setSales(0); // 默认销量为0
        }
        
        productMapper.insert(product);
    }
    
    /**
     * 更新商品信息
     * 
     * @param product 商品信息
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateProduct(Product product) {
        // 更新修改时间
        product.setUpdateTime(LocalDateTime.now());
        productMapper.updateById(product);
    }
    
    /**
     * 删除商品
     * 
     * @param id 商品ID
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteProduct(Long id) {
        productMapper.deleteById(id);
    }
    
    /**
     * 获取商品详情（包含分类名称）
     * 
     * @param id 商品ID
     * @return 商品视图对象
     */
    @Override
    public ProductVO getProduct(Long id) {
        return productMapper.selectProductVOById(id);
    }
    
    /**
     * 分页查询商品列表（包含分类名称）
     * 
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @param keyword 关键词（商品名称或副标题）
     * @return 商品视图对象分页结果
     */
    @Override
    public IPage<ProductVO> listProducts(Integer pageNum, Integer pageSize, String keyword) {
        Page<ProductVO> page = new Page<>(pageNum, pageSize);
        return productMapper.selectProductVOPage(page, keyword);
    }
    
    /**
     * 更新商品库存
     * 
     * @param id 商品ID
     * @param count 库存变化数量（正数增加，负数减少）
     * @return 是否更新成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateStock(Long id, Integer count) {
        // 如果是减少库存，需要检查库存是否足够
        if (count < 0) {
            int rows = productMapper.updateStockWithCheck(id, count);
            return rows > 0;
        } else {
            // 增加库存不需要检查
            int rows = productMapper.updateStock(id, count);
            return rows > 0;
        }
    }
    
    /**
     * 批量更新商品库存
     * 
     * @param productIds 商品ID数组
     * @param counts 库存变化数量数组
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchUpdateStock(Long[] productIds, Integer[] counts) {
        if (productIds == null || counts == null || productIds.length != counts.length) {
            throw new IllegalArgumentException("商品ID和库存数量参数不匹配");
        }
        
        for (int i = 0; i < productIds.length; i++) {
            updateStock(productIds[i], counts[i]);
        }
    }

    /**
     * 更新商品状态
     * 
     * @param id 商品ID
     * @param status 状态（0-下架，1-上架）
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateStatus(Long id, Integer status) {
        Product product = new Product();
        product.setId(id);
        product.setStatus(status);
        product.setUpdateTime(LocalDateTime.now());
        productMapper.updateById(product);
    }
}
