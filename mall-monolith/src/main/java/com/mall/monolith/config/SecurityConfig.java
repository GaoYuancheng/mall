package com.mall.monolith.config;

import com.mall.monolith.filter.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security 安全配置类
 * 
 * 该配置类负责配置应用程序的安全策略，包括：
 * - JWT认证机制
 * - 请求授权规则
 * - 会话管理策略
 * - CSRF保护设置
 * 
 * @author mall-monolith
 * @version 1.0
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * JWT认证过滤器
     * 用于处理JWT token的验证和用户认证
     */
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * 配置安全过滤器链
     * 
     * 该方法定义了应用程序的安全策略：
     * 1. 禁用CSRF保护（适用于REST API）
     * 2. 设置无状态会话管理（使用JWT）
     * 3. 配置请求授权规则
     * 4. 禁用默认的HTTP Basic认证和表单登录
     * 5. 添加JWT认证过滤器
     * 
     * @param http HttpSecurity配置对象
     * @return SecurityFilterChain 安全过滤器链
     * @throws Exception 配置异常
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 禁用CSRF保护，因为使用JWT token进行认证
            .csrf(csrf -> csrf.disable())
            
            // 设置无状态会话管理，不使用Session
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // // 配置请求授权规则
            // .authorizeHttpRequests(authz -> authz
            //     // 其他所有请求都需要认证
            //     .anyRequest().authenticated()
            // )
            
            // 禁用HTTP Basic认证
            .httpBasic(httpBasic -> httpBasic.disable())
            
            // 禁用表单登录
            .formLogin(formLogin -> formLogin.disable())
            
            // 在UsernamePasswordAuthenticationFilter之前添加JWT认证过滤器
            // 这样JWT过滤器会先处理请求，进行token验证
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
