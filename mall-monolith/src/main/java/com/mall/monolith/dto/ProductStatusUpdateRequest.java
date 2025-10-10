package com.mall.monolith.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class ProductStatusUpdateRequest {
    @Schema(description = "商品ID")
    private Long id;

    @Schema(description = "商品状态：1-上架，0-下架")
    private Integer status;
}


