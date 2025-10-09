# Mall 电商系统启动指南

## 环境要求

### 必需环境

- JDK 17
- MySQL 8.0
- Maven 3.8+
- Nacos 2.2.3

### 推荐开发工具

- IntelliJ IDEA
- Visual Studio Code
- MySQL Workbench

## 环境安装

### 1. JDK 17 安装

1. 访问 https://adoptium.net/
2. 下载 OpenJDK 17
3. 运行安装程序
4. 设置环境变量：
   ```
   JAVA_HOME = JDK安装路径（例如：C:\Program Files\Java\jdk-17）
   Path = %JAVA_HOME%\bin
   ```
5. 验证安装：
   ```bash
   java -version
   ```

### 2. MySQL 安装

1. 访问 https://dev.mysql.com/downloads/mysql/
2. 下载 MySQL 8.0 安装包
3. 运行安装程序
4. 设置 root 密码为：root
5. 验证安装：
   ```bash
   mysql -V
   mysql -u root -proot
   ```

### 3. Maven 安装

1. 访问 https://maven.apache.org/download.cgi
2. 下载最新版本的 Maven
3. 解压到指定目录
4. 设置环境变量：
   ```
   MAVEN_HOME = Maven解压路径（例如：C:\Program Files\apache-maven-3.8.1）
   Path = %MAVEN_HOME%\bin
   ```
5. 验证安装：
   ```bash
   mvn -v
   ```

### 4. Nacos 安装

1. 访问 https://github.com/alibaba/nacos/releases
2. 下载 nacos-server-2.2.3.zip
3. 解压到指定目录
4. 进入 nacos/bin 目录
5. 运行：
   ```bash
   startup.cmd -m standalone  # Windows
   ./startup.sh -m standalone # Linux/Mac
   ```

## 数据库初始化

1. 登录 MySQL：

   ```bash
   mysql -u root -proot
   ```

2. 创建数据库：
   ```sql
   CREATE DATABASE IF NOT EXISTS mall DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

## 项目启动

### 1. 启动基础服务

1. 启动 MySQL：

   ```bash
   net start MySQL80  # Windows，需要管理员权限
   sudo service mysql start  # Linux
   brew services start mysql@8.0  # Mac
   ```

2. 启动 Nacos：
   ```bash
   cd nacos/bin
   startup.cmd -m standalone  # Windows
   ./startup.sh -m standalone # Linux/Mac
   ```

### 2. 启动后端服务

1. 进入项目根目录：

   ```bash
   cd 项目根目录
   ```

2. 编译项目：

   ```bash
   mvn clean package -DskipTests
   ```

### 3. 验证服务状态

1. 访问 Nacos 控制台：

   - URL：http://localhost:8848/nacos
   - 用户名：nacos
   - 密码：nacos
   - 检查服务列表中是否有 mall-user 服务

2. 访问用户服务：
   - URL：http://localhost:8081
   - 检查服务是否正常响应

## 常见问题

### 1. MySQL 连接失败

- 检查 MySQL 服务是否启动
- 检查用户名密码是否正确
- 检查端口是否被占用
- 检查防火墙设置

### 2. Nacos 启动失败

- 检查 JDK 版本是否正确
- 检查端口 8848 是否被占用
- 检查日志文件：nacos/logs/
- 确保使用了 standalone 模式启动

### 3. Maven 编译失败

- 检查 JAVA_HOME 环境变量
- 检查 Maven settings.xml 配置
- 检查网络连接（可能需要配置镜像）
- 尝试清理 Maven 本地仓库

### 4. 服务启动失败

- 检查配置文件中的数据库连接信息
- 检查 Nacos 配置是否正确
- 检查端口是否被占用
- 查看启动日志排查具体错误

## 项目结构

```
mall/
├── mall-common/        # 公共模块
├── mall-user/          # 用户服务
├── mall-product/       # 商品服务
├── mall-order/         # 订单服务
├── mall-payment/       # 支付服务
├── mall-marketing/     # 营销服务
├── mall-search/        # 搜索服务
├── mall-logistics/     # 物流服务
├── mall-gateway/       # 网关服务
├── mall-frontend/      # 前端项目
└── mall-admin/         # 后台管理项目
```

## 开发建议

1. 使用 Git 进行版本控制
2. 遵循代码规范和命名约定
3. 编写单元测试
4. 使用日志记录关键操作
5. 定期检查依赖更新
6. 保持文档的及时更新

## 参考文档

- [Spring Boot 官方文档](https://spring.io/projects/spring-boot)
- [Spring Cloud 官方文档](https://spring.io/projects/spring-cloud)
- [Nacos 官方文档](https://nacos.io/zh-cn/docs/what-is-nacos.html)
- [MyBatis-Plus 官方文档](https://baomidou.com/)
- [MySQL 官方文档](https://dev.mysql.com/doc/)
