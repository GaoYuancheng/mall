package com.mall.monolith.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.monolith.dto.ProductVO;
import com.mall.monolith.mapper.ProductMapper;
import com.mall.monolith.mapper.ProductApprovalTaskMapper;
import com.mall.monolith.mapper.ProductApprovalLogMapper;
import com.mall.monolith.model.Product;
import com.mall.monolith.service.ProductService;
import com.mall.monolith.service.ProductApprovalService;
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
    @Autowired
    private ProductApprovalTaskMapper productApprovalTaskMapper;
    @Autowired
    private ProductApprovalLogMapper productApprovalLogMapper;
    @Autowired
    private ProductApprovalService productApprovalService;
    
    /**
     * 创建商品
     * 
     * @param product 商品信息
     * @param submitterId 提交人ID
     * @param approverId 审批人ID
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createProduct(Product product, Long submitterId, Long approverId) {
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
        // 强制初始化为待审批
        product.setApprovalStatus(0);
        
        // 插入商品
        productMapper.insert(product);
        
        // 自动启动审批流程
        productApprovalService.submitApproval(product.getId(), submitterId, approverId, "商品创建，自动提交审批");
    }
    
    /**
     * 更新商品信息
     * 
     * @param product 商品信息
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateProduct(Product product) {
        if (product.getId() == null) {
            throw new IllegalArgumentException("商品ID不能为空");
        }
        Product db = productMapper.selectById(product.getId());
        if (db == null) {
            throw new IllegalArgumentException("商品不存在");
        }
        // 仅已拒绝(2)的商品允许编辑
        if (db.getApprovalStatus() == null || db.getApprovalStatus() != 2) {
            throw new IllegalStateException("仅已拒绝的商品可编辑");
        }
        // 保存后置为待审批
        product.setApprovalStatus(0);
        product.setUpdateTime(LocalDateTime.now());
        productMapper.updateById(product);

        // 若无待审批任务，则自动发起新的审批任务，默认沿用上一次审批人
        com.mall.monolith.model.ProductApprovalTask pending = productApprovalTaskMapper.selectOne(
                new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<com.mall.monolith.model.ProductApprovalTask>()
                        .eq("product_id", product.getId())
                        .eq("status", 0)
        );
        if (pending == null) {
            com.mall.monolith.model.ProductApprovalTask lastTask = productApprovalTaskMapper.selectOne(
                    new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<com.mall.monolith.model.ProductApprovalTask>()
                            .eq("product_id", product.getId())
                            .orderByDesc("id")
                            .last("limit 1")
            );
            Long lastApproverId = lastTask != null ? lastTask.getApproverId() : null;
            // 提交人ID可为空（由后端记录为空），审批人沿用上次，如为空则由有权限者审批
            productApprovalService.submitApproval(product.getId(), null, lastApproverId, "商品编辑，自动提交审批");
        }
    }
    
    /**
     * 删除商品
     * 
     * @param id 商品ID
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteProduct(Long id) {
        Product db = productMapper.selectById(id);
        if (db == null) {
            return;
        }
        Integer approvalStatus = db.getApprovalStatus();
        if (approvalStatus == null || (approvalStatus != 1 && approvalStatus != 2)) {
            throw new IllegalStateException("仅审批通过或已拒绝的商品可删除");
        }
        // 删除商品
        productMapper.deleteById(id);
        // 清理关联审批任务与日志
        productApprovalTaskMapper.delete(new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<com.mall.monolith.model.ProductApprovalTask>()
                .eq("product_id", id));
        productApprovalLogMapper.delete(new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<com.mall.monolith.model.ProductApprovalLog>()
                .eq("product_id", id));
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

    /**
     * 更新商品审批状态
     *
     * @param id 商品ID
     * @param approvalStatus 审批状态（0-待审批，1-已通过，2-已拒绝）
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateApprovalStatus(Long id, Integer approvalStatus) {
        Product product = new Product();
        product.setId(id);
        product.setApprovalStatus(approvalStatus);
        product.setUpdateTime(LocalDateTime.now());
        productMapper.updateById(product);
    }
}
