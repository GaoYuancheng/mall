package com.mall.monolith.controller;

import com.mall.common.api.CommonResult;
import com.mall.monolith.dto.PageResult;
import com.mall.monolith.dto.PasswordUpdateRequest;
import com.mall.monolith.dto.UserListRequest;
import com.mall.monolith.dto.UserLoginRequest;
import com.mall.monolith.dto.UserRegisterRequest;
import com.mall.monolith.dto.UserUpdateRequest;
import com.mall.monolith.exception.UserException;
import com.mall.monolith.model.User;
import com.mall.monolith.service.UserService;
import com.mall.monolith.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@Tag(name = "用户管理", description = "用户管理接口")
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Operation(summary = "用户注册")
    @PostMapping("/register")
    public CommonResult<String> register(@Validated @RequestBody UserRegisterRequest request) {
        try {
            userService.register(request);
            return CommonResult.success("注册成功");
        } catch (UserException e) {
            return CommonResult.failed(e.getMessage());
        }
    }

    @Operation(summary = "用户登录")
    @PostMapping("/login")
    public CommonResult<String> login(@Validated @RequestBody UserLoginRequest request) {
        try {
            String token = userService.login(request);
            return CommonResult.success(token);
        } catch (UserException e) {
            return CommonResult.failed(e.getMessage());
        }
    }

    @Operation(summary = "获取用户信息")
    @GetMapping("/{id}")
    public CommonResult<User> getUserInfo(@PathVariable Long id) {
        try {
            User user = userService.getUserInfo(id);
            return CommonResult.success(user);
        } catch (UserException e) {
            return CommonResult.failed(e.getMessage());
        }
    }
    
    @Operation(summary = "获取当前用户信息")
    @GetMapping("/current")
    public CommonResult<User> getCurrentUser(HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization");
            if (token == null || !token.startsWith("Bearer ")) {
                return CommonResult.failed("未提供有效的认证token");
            }
            
            token = token.substring(7); // 移除 "Bearer " 前缀
            Long userId = jwtUtil.getUserIdFromToken(token);
            User user = userService.getUserInfo(userId);
            return CommonResult.success(user);
        } catch (Exception e) {
            return CommonResult.failed("获取用户信息失败: " + e.getMessage());
        }
    }

    @Operation(summary = "更新用户信息")
    @PutMapping("/update")
    public CommonResult<String> updateUser(@Validated @RequestBody UserUpdateRequest request, 
                                         HttpServletRequest httpRequest) {
        try {
            String token = httpRequest.getHeader("Authorization");
            if (token == null || !token.startsWith("Bearer ")) {
                return CommonResult.failed("未提供有效的认证token");
            }
            
            token = token.substring(7);
            Long userId = jwtUtil.getUserIdFromToken(token);
            userService.updateUser(userId, request);
            return CommonResult.success("更新成功");
        } catch (UserException e) {
            return CommonResult.failed(e.getMessage());
        } catch (Exception e) {
            return CommonResult.failed("更新用户信息失败: " + e.getMessage());
        }
    }

    @Operation(summary = "修改密码")
    @PutMapping("/updatePassword")
    public CommonResult<String> updatePassword(@Validated @RequestBody PasswordUpdateRequest request,
                                             HttpServletRequest httpRequest) {
        try {
            String token = httpRequest.getHeader("Authorization");
            if (token == null || !token.startsWith("Bearer ")) {
                return CommonResult.failed("未提供有效的认证token");
            }
            
            token = token.substring(7);
            Long userId = jwtUtil.getUserIdFromToken(token);
            userService.updatePassword(userId, request);
            return CommonResult.success("密码修改成功");
        } catch (UserException e) {
            return CommonResult.failed(e.getMessage());
        } catch (Exception e) {
            return CommonResult.failed("修改密码失败: " + e.getMessage());
        }
    }
    
    @Operation(summary = "检查用户名是否存在")
    @GetMapping("/checkUsername")
    public CommonResult<Boolean> checkUsername(@RequestParam String username) {
        boolean exists = userService.existsByUsername(username);
        return CommonResult.success(exists);
    }
    
    @Operation(summary = "检查手机号是否存在")
    @GetMapping("/checkPhone")
    public CommonResult<Boolean> checkPhone(@RequestParam String phone) {
        boolean exists = userService.existsByPhone(phone);
        return CommonResult.success(exists);
    }
    
    @Operation(summary = "检查邮箱是否存在")
    @GetMapping("/checkEmail")
    public CommonResult<Boolean> checkEmail(@RequestParam String email) {
        boolean exists = userService.existsByEmail(email);
        return CommonResult.success(exists);
    }
    
    @Operation(summary = "获取用户列表", description = "分页查询用户列表，支持按用户名、昵称、手机号、邮箱、状态等条件筛选")
    @GetMapping("/list")
    public CommonResult<PageResult<User>> getUserList(UserListRequest request) {
        try {
            PageResult<User> result = userService.getUserList(request);
            return CommonResult.success(result);
        } catch (Exception e) {
            return CommonResult.failed("获取用户列表失败: " + e.getMessage());
        }
    }
}
