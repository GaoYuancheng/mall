package com.mall.monolith.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("product_approval_task")
public class ProductApprovalTask {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long productId;
    private Long submitterId;
    private Long approverId;
    private Integer status; // 0-待审批，1-已通过，2-已拒绝
    private String remark;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}


