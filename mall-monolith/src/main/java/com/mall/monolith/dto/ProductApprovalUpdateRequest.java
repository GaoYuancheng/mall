package com.mall.monolith.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class ProductApprovalUpdateRequest {
    @Schema(description = "商品ID")
    private Long id;

    @Schema(description = "审批状态：0-待审批，1-已通过，2-已拒绝")
    private Integer approvalStatus;
}


