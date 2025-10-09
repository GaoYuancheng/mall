package com.mall.monolith.service;

import com.mall.monolith.dto.PageResult;
import com.mall.monolith.dto.PasswordUpdateRequest;
import com.mall.monolith.dto.UserListRequest;
import com.mall.monolith.dto.UserLoginRequest;
import com.mall.monolith.dto.UserRegisterRequest;
import com.mall.monolith.dto.UserUpdateRequest;
import com.mall.monolith.model.User;

public interface UserService {
    /**
     * 用户注册
     */
    void register(UserRegisterRequest request);
    
    /**
     * 用户登录
     */
    String login(UserLoginRequest request);
    
    /**
     * 根据ID获取用户信息
     */
    User getUserInfo(Long id);
    
    /**
     * 根据用户名获取用户信息
     */
    User getUserByUsername(String username);
    
    /**
     * 更新用户信息
     */
    void updateUser(Long userId, UserUpdateRequest request);
    
    /**
     * 修改密码
     */
    void updatePassword(Long userId, PasswordUpdateRequest request);
    
    /**
     * 验证用户是否存在
     */
    boolean existsByUsername(String username);
    
    /**
     * 验证手机号是否存在
     */
    boolean existsByPhone(String phone);
    
    /**
     * 验证邮箱是否存在
     */
    boolean existsByEmail(String email);
    
    /**
     * 获取用户列表（分页查询）
     */
    PageResult<User> getUserList(UserListRequest request);
}
