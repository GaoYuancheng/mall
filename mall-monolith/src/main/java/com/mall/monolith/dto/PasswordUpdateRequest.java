package com.mall.monolith.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class PasswordUpdateRequest {
    @NotBlank(message = "原密码不能为空")
    private String oldPassword;
    
    @NotBlank(message = "新密码不能为空")
    private String newPassword;
}
