package com.mall.monolith.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class UserUpdateStatusRequest {
    @Schema(description = "用户ID")
    private Long id;

    @Schema(description = "用户状态：1-启用，0-禁用")
    private Integer status;
}


