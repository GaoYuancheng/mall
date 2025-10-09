#!/bin/bash

# 初始化数据库
echo "初始化数据库..."
mysql -u root -proot << EOF
CREATE DATABASE IF NOT EXISTS mall DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF

# 编译并启动后端服务
echo "编译并启动后端服务..."
mvn clean package -DskipTests

# 启动单体应用
echo "启动单体应用..."
java -jar mall-monolith/target/mall-monolith-1.0-SNAPSHOT.jar &

echo "单体应用已启动完成！"
echo "应用地址：http://localhost:8080"
echo "API文档：http://localhost:8080/swagger-ui.html"