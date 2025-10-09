package com.mall.monolith.dto;

import lombok.Data;

@Data
public class UserListRequest {
    /**
     * 页码，从1开始
     */
    private Integer pageNum = 1;
    
    /**
     * 每页大小
     */
    private Integer pageSize = 10;
    
    /**
     * 用户名（模糊查询）
     */
    private String username;
    
    /**
     * 昵称（模糊查询）
     */
    private String nickname;
    
    /**
     * 手机号（模糊查询）
     */
    private String phone;
    
    /**
     * 邮箱（模糊查询）
     */
    private String email;
    
    /**
     * 用户状态：1-正常，0-禁用
     */
    private Integer status;
}
