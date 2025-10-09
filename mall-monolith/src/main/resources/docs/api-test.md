# API 测试指南

## 基础信息

- **服务地址**: http://localhost:8080
- **API 前缀**: /api
- **完整地址**: http://localhost:8080/api

## 用户模块 API 测试

### 1. 检查服务是否启动

```bash
curl -X GET http://localhost:8080/api/user/checkUsername?username=test
```

### 2. 用户注册

```bash
curl -X POST http://localhost:8080/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "123456",
    "nickname": "测试用户",
    "phone": "13800138000",
    "email": "test@example.com"
  }'
```

### 3. 用户登录

```bash
curl -X POST http://localhost:8080/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "123456"
  }'
```

### 4. 获取当前用户信息（需要 token）

```bash
curl -X GET http://localhost:8080/api/user/current \
  -H "Authorization: Bearer <从登录接口获取的token>"
```

### 5. 更新用户信息（需要 token）

```bash
curl -X PUT http://localhost:8080/api/user/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <从登录接口获取的token>" \
  -d '{
    "nickname": "新昵称",
    "phone": "13800138001",
    "email": "newemail@example.com"
  }'
```

### 6. 修改密码（需要 token）

```bash
curl -X PUT http://localhost:8080/api/user/updatePassword \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <从登录接口获取的token>" \
  -d '{
    "oldPassword": "123456",
    "newPassword": "newpassword123"
  }'
```

### 7. 获取用户列表（分页查询）

```bash
# 基本分页查询
curl -X GET "http://localhost:8080/api/user/list?pageNum=1&pageSize=10"

# 按用户名模糊查询
curl -X GET "http://localhost:8080/api/user/list?username=test&pageNum=1&pageSize=10"

# 按昵称模糊查询
curl -X GET "http://localhost:8080/api/user/list?nickname=测试&pageNum=1&pageSize=10"

# 按手机号模糊查询
curl -X GET "http://localhost:8080/api/user/list?phone=138&pageNum=1&pageSize=10"

# 按邮箱模糊查询
curl -X GET "http://localhost:8080/api/user/list?email=example&pageNum=1&pageSize=10"

# 按状态查询（1-正常，0-禁用）
curl -X GET "http://localhost:8080/api/user/list?status=1&pageNum=1&pageSize=10"

# 组合查询
curl -X GET "http://localhost:8080/api/user/list?username=test&status=1&pageNum=1&pageSize=5"
```

**用户列表接口参数说明：**

- `pageNum`: 页码，从 1 开始，默认为 1
- `pageSize`: 每页大小，默认为 10
- `username`: 用户名（模糊查询）
- `nickname`: 昵称（模糊查询）
- `phone`: 手机号（模糊查询）
- `email`: 邮箱（模糊查询）
- `status`: 用户状态，1-正常，0-禁用

**响应示例：**

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "pageNum": 1,
    "pageSize": 10,
    "total": 25,
    "totalPages": 3,
    "list": [
      {
        "id": 1,
        "username": "testuser",
        "nickname": "测试用户",
        "phone": "13800138000",
        "email": "test@example.com",
        "status": 1,
        "createTime": "2024-01-01T10:00:00",
        "updateTime": "2024-01-01T10:00:00"
      }
    ]
  }
}
```

## 其他模块 API（示例）

### 商品模块

- 商品列表: `GET /api/product/list`
- 商品详情: `GET /api/product/{id}`

### 搜索模块

- 搜索商品: `GET /api/search?keyword=手机`

### Swagger 文档

- 访问地址: http://localhost:8080/api/swagger-ui.html

## 注意事项

1. 所有 API 都需要加上 `/api` 前缀
2. 需要认证的接口必须在请求头中携带 `Authorization: Bearer <token>`
3. 登录和注册接口不需要认证
4. 数据验证接口（checkUsername 等）不需要认证
