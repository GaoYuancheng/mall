package com.mall.monolith.dto;

import lombok.Data;
import jakarta.validation.constraints.Pattern;

@Data
public class UserUpdateRequest {
    private String nickname; // 可选
    
    @Pattern(regexp = "(^$)|(^1[3-9]\\d{9}$)", message = "手机号格式不正确")
    private String phone; // 可选或符合格式
    
    @Pattern(regexp = "(^$)|(^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$)", message = "邮箱格式不正确")
    private String email; // 可选或符合格式
}
