package com.mall.monolith.filter;

import com.mall.monolith.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;

/**
 * JWT认证过滤器
 * 
 * 该过滤器负责处理JWT token的验证和用户认证：
 * 1. 从请求头中提取JWT token
 * 2. 验证token的有效性
 * 3. 如果token无效，返回401状态码
 * 4. 如果token有效，设置用户认证信息
 * 
 * @author mall-monolith
 * @version 1.0
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    /**
     * JWT工具类，用于token的解析和验证
     */
    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 执行JWT认证过滤逻辑
     * 
     * @param request HTTP请求对象
     * @param response HTTP响应对象
     * @param filterChain 过滤器链
     * @throws ServletException Servlet异常
     * @throws IOException IO异常
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                 FilterChain filterChain) throws ServletException, IOException {
        
        String requestURI = request.getRequestURI();
        
        // 检查是否为公开接口，如果是则直接跳过JWT验证
        // 注意：这里与SecurityConfig中的permitAll配置保持一致
        if (isPublicEndpoint(requestURI)) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // 从请求头中获取Authorization字段
        String token = request.getHeader("Authorization");
        
        // 检查token是否存在且格式正确（以"Bearer "开头）
        if (token != null && token.startsWith("Bearer ")) {
            // 移除"Bearer "前缀，获取实际的token
            token = token.substring(7);
            
            try {
                // 从token中解析用户名
                String username = jwtUtil.getUsernameFromToken(token);
                
                // 检查用户名是否有效且当前没有认证信息
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // 验证token的有效性
                    if (jwtUtil.validateToken(token, username)) {
                        // 创建用户详情对象
                        UserDetails userDetails = new User(username, "", new ArrayList<>());
                        
                        // 创建认证对象
                        UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        
                        // 设置认证信息到安全上下文
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    } else {
                        // Token验证失败，返回401状态码
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType("application/json;charset=UTF-8");
                        response.getWriter().write("{\"code\":401,\"message\":\"Token验证失败，请重新登录\"}");
                        return;
                    }
                } else {
                    // 用户名无效或已存在认证信息，返回401状态码
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"code\":401,\"message\":\"Token无效或已过期，请重新登录\"}");
                    return;
                }
            } catch (Exception e) {
                // Token解析或验证过程中发生异常，返回401状态码
                logger.error("JWT token验证失败: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"code\":401,\"message\":\"Token格式错误或已损坏，请重新登录\"}");
                return;
            }
        } else if (token != null) {
            // Token格式不正确（不以"Bearer "开头），返回401状态码
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":401,\"message\":\"Token格式错误，请使用Bearer token\"}");
            return;
        }
        
        // 继续执行后续过滤器
        filterChain.doFilter(request, response);
    }
    
    /**
     * 检查请求URI是否为公开接口
     * 
     * 公开接口包括：
     * - Swagger文档相关路径
     * - 用户注册和登录接口
     * - 用户信息检查接口
     * - 商品相关公开接口
     * - 搜索功能接口
     * 
     * 注意：所有API路径都包含context-path前缀(/api)
     * 
     * @param requestURI 请求URI
     * @return true如果是公开接口，false如果需要认证
     */
    private boolean isPublicEndpoint(String requestURI) {
        // Swagger文档相关路径（不包含context-path）
        if (requestURI.startsWith("/swagger-ui/") || 
            requestURI.startsWith("/v3/api-docs/") || 
            requestURI.equals("/swagger-ui.html")) {
            return true;
        }
        
        // 用户注册和登录接口（包含context-path前缀）
        if (requestURI.equals("/api/user/register") || requestURI.equals("/api/user/login")) {
            return true;
        }
        
        // 用户信息检查接口（包含context-path前缀）
        if (requestURI.equals("/api/user/checkUsername") || 
            requestURI.equals("/api/user/checkPhone") || 
            requestURI.equals("/api/user/checkEmail")) {
            return true;
        }
        
        // 商品相关公开接口（包含context-path前缀）
        if (requestURI.equals("/api/product/list") || requestURI.startsWith("/api/product/")) {
            return true;
        }
        
        // 搜索功能接口（包含context-path前缀）
        if (requestURI.startsWith("/api/search/")) {
            return true;
        }
        
        return false;
    }
}
