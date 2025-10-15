package com.mall.monolith.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;
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
    @TableField("approval_status")
    private Integer approvalStatus; // 0-待审批，1-已通过，2-已拒绝
    private String description;
    private String picture;
    private Integer sales;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
