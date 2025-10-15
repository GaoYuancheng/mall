package com.mall.monolith.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("product_approval_log")
public class ProductApprovalLog {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long productId;
    private String action; // submit/approve/reject
    private Long operatorId;
    private String remark;
    private LocalDateTime createTime;
}


