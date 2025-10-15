package com.mall.monolith.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 商品视图对象
 * 
 * 用于返回给前端的商品信息，包含分类名称等扩展字段
 * 
 * @author mall-monolith
 * @version 1.0
 */
@Data
public class ProductVO {
    /**
     * 商品ID
     */
    private Long id;
    
    /**
     * 商品名称
     */
    private String name;
    
    /**
     * 商品副标题
     */
    private String subtitle;
    
    /**
     * 分类ID
     */
    private Long categoryId;
    
    /**
     * 分类名称
     */
    private String categoryName;
    
    /**
     * 品牌名称
     */
    private String brandName;
    
    /**
     * 商品价格
     */
    private BigDecimal price;
    
    /**
     * 库存数量
     */
    private Integer stock;
    
    /**
     * 商品状态：0-下架，1-上架
     */
    private Integer status;
    /**
     * 审批状态：0-待审批，1-已通过，2-已拒绝
     */
    private Integer approvalStatus;
    
    /**
     * 审批状态中文描述
     */
    private String approvalStatusText;
    
    /**
     * 商品描述
     */
    private String description;
    
    /**
     * 商品图片URL
     */
    private String picture;
    
    /**
     * 销量
     */
    private Integer sales;
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    private LocalDateTime updateTime;
}

