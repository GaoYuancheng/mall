package com.mall.monolith.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.monolith.dto.PageResult;
import com.mall.monolith.dto.PasswordUpdateRequest;
import com.mall.monolith.dto.UserListRequest;
import com.mall.monolith.dto.UserLoginRequest;
import com.mall.monolith.dto.UserRegisterRequest;
import com.mall.monolith.dto.UserUpdateRequest;
import com.mall.monolith.exception.UserException;
import com.mall.monolith.mapper.UserMapper;
import com.mall.monolith.model.User;
import com.mall.monolith.service.UserService;
import com.mall.monolith.util.JwtUtil;
import com.mall.monolith.util.PasswordUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    public void register(UserRegisterRequest request) {
        // 验证用户名是否已存在
        if (existsByUsername(request.getUsername())) {
            throw new UserException("用户名已存在");
        }
        
        // 验证手机号是否已存在
        if (request.getPhone() != null && existsByPhone(request.getPhone())) {
            throw new UserException("手机号已存在");
        }
        
        // 验证邮箱是否已存在
        if (request.getEmail() != null && existsByEmail(request.getEmail())) {
            throw new UserException("邮箱已存在");
        }
        
        // 创建用户对象
        User user = new User();
        BeanUtils.copyProperties(request, user);
        user.setPassword(PasswordUtil.encode(request.getPassword()));
        user.setStatus(1); // 1-正常，0-禁用
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());
        
        // 保存用户
        int result = userMapper.insert(user);
        if (result <= 0) {
            throw new UserException("用户注册失败");
        }
    }
    
    @Override
    public String login(UserLoginRequest request) {
        // 根据用户名查询用户
        User user = getUserByUsername(request.getUsername());
        if (user == null) {
            throw new UserException("用户名或密码错误");
        }
        
        // 验证密码
        if (!PasswordUtil.matches(request.getPassword(), user.getPassword())) {
            throw new UserException("用户名或密码错误");
        }
        
        // 检查用户状态
        if (user.getStatus() != 1) {
            throw new UserException("用户已被禁用");
        }
        
        // 生成JWT token
        return jwtUtil.generateToken(user.getId(), user.getUsername());
    }
    
    @Override
    public User getUserInfo(Long id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new UserException("用户不存在");
        }
        // 不返回密码
        user.setPassword(null);
        return user;
    }
    
    @Override
    public User getUserByUsername(String username) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        return userMapper.selectOne(queryWrapper);
    }
    
    @Override
    public void updateUser(Long userId, UserUpdateRequest request) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new UserException("用户不存在");
        }
        
        // 验证手机号是否被其他用户使用
        if (request.getPhone() != null && !request.getPhone().equals(user.getPhone())) {
            if (existsByPhone(request.getPhone())) {
                throw new UserException("手机号已被其他用户使用");
            }
        }
        
        // 验证邮箱是否被其他用户使用
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (existsByEmail(request.getEmail())) {
                throw new UserException("邮箱已被其他用户使用");
            }
        }
        
        // 更新用户信息
        BeanUtils.copyProperties(request, user);
        user.setUpdateTime(LocalDateTime.now());
        
        int result = userMapper.updateById(user);
        if (result <= 0) {
            throw new UserException("更新用户信息失败");
        }
    }
    
    @Override
    public void updatePassword(Long userId, PasswordUpdateRequest request) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new UserException("用户不存在");
        }
        
        // 验证原密码
        if (!PasswordUtil.matches(request.getOldPassword(), user.getPassword())) {
            throw new UserException("原密码错误");
        }
        
        // 更新密码
        user.setPassword(PasswordUtil.encode(request.getNewPassword()));
        user.setUpdateTime(LocalDateTime.now());
        
        int result = userMapper.updateById(user);
        if (result <= 0) {
            throw new UserException("修改密码失败");
        }
    }
    
    @Override
    public boolean existsByUsername(String username) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        return userMapper.selectCount(queryWrapper) > 0;
    }
    
    @Override
    public boolean existsByPhone(String phone) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("phone", phone);
        return userMapper.selectCount(queryWrapper) > 0;
    }
    
    @Override
    public boolean existsByEmail(String email) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", email);
        return userMapper.selectCount(queryWrapper) > 0;
    }
    
    @Override
    public PageResult<User> getUserList(UserListRequest request) {
        // 创建分页对象
        Page<User> page = new Page<>(request.getPageNum(), request.getPageSize());
        
        // 构建查询条件
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        
        // 用户名模糊查询
        if (request.getUsername() != null && !request.getUsername().trim().isEmpty()) {
            queryWrapper.like("username", request.getUsername().trim());
        }
        
        // 昵称模糊查询
        if (request.getNickname() != null && !request.getNickname().trim().isEmpty()) {
            queryWrapper.like("nickname", request.getNickname().trim());
        }
        
        // 手机号模糊查询
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            queryWrapper.like("phone", request.getPhone().trim());
        }
        
        // 邮箱模糊查询
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            queryWrapper.like("email", request.getEmail().trim());
        }
        
        // 状态精确查询
        if (request.getStatus() != null) {
            queryWrapper.eq("status", request.getStatus());
        }
        
        // 按创建时间倒序排列
        queryWrapper.orderByDesc("create_time");
        
        // 执行分页查询
        Page<User> userPage = userMapper.selectPage(page, queryWrapper);
        
        // 清除密码信息
        List<User> userList = userPage.getRecords();
        userList.forEach(user -> user.setPassword(null));
        
        // 构建分页结果
        return new PageResult<>(
            (int) userPage.getCurrent(),
            (int) userPage.getSize(),
            userPage.getTotal(),
            userList
        );
    }

    @Override
    public void updateUserStatus(Long userId, Integer status) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new UserException("用户不存在");
        }
        if (status == null || (status != 0 && status != 1)) {
            throw new UserException("状态值非法");
        }
        user.setStatus(status);
        user.setUpdateTime(LocalDateTime.now());
        int result = userMapper.updateById(user);
        if (result <= 0) {
            throw new UserException("更新用户状态失败");
        }
    }
}
