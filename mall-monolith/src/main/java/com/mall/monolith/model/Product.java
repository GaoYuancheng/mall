package com.mall.monolith.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("product")
public class Product {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String subtitle;
    private Long categoryId;
    private String brandName;
    private BigDecimal price;
    private Integer stock;
    private Integer status;
    private String description;
    private String picture;
    private Integer sales;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
