-- 商品表
CREATE TABLE IF NOT EXISTS `product` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '商品ID',
    `name` varchar(200) NOT NULL COMMENT '商品名称',
    `subtitle` varchar(500) DEFAULT NULL COMMENT '商品副标题',
    `category_id` bigint(20) NOT NULL COMMENT '分类ID',
    `brand_name` varchar(100) DEFAULT NULL COMMENT '品牌名称',
    `price` decimal(10,2) NOT NULL COMMENT '商品价格',
    `stock` int(11) DEFAULT 0 COMMENT '库存数量',
    `status` int(1) DEFAULT 1 COMMENT '商品状态：0-下架，1-上架',
    `approval_status` tinyint(1) DEFAULT 0 COMMENT '审批状态：0-待审批，1-已通过，2-已拒绝',
    `description` text COMMENT '商品描述',
    `picture` varchar(500) DEFAULT NULL COMMENT '商品图片URL',
    `sales` int(11) DEFAULT 0 COMMENT '销量',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_category_id` (`category_id`),
    KEY `idx_status` (`status`),
    KEY `idx_approval_status` (`approval_status`),
    KEY `idx_create_time` (`create_time`),
    KEY `idx_sales` (`sales`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- 插入测试商品数据

-- 手机数码分类商品 (category_id = 6)
INSERT INTO `product` (`name`, `subtitle`, `category_id`, `brand_name`, `price`, `stock`, `status`, `description`, `picture`, `sales`) VALUES
('iPhone 15 Pro Max', '全新A17 Pro芯片，钛金属设计，支持5G', 6, 'Apple', 9999.00, 100, 1, 
'iPhone 15 Pro Max 采用全新 A17 Pro 芯片，性能强劲。钛金属设计，轻盈坚固。Pro 级摄像头系统，拍摄更专业。支持 5G 网络，速度更快。', 
'https://example.com/images/iphone15.jpg', 328),

('华为 Mate 60 Pro', '鸿蒙4.0系统，卫星通信，超感知影像', 6, '华为', 6999.00, 150, 1, 
'华为 Mate 60 Pro 搭载鸿蒙 4.0 操作系统，流畅体验。支持卫星通信，随时保持联系。超感知影像系统，记录精彩瞬间。', 
'https://example.com/images/mate60.jpg', 256),

('小米14 Ultra', '骁龙8 Gen3，徕卡光学镜头，120W快充', 6, '小米', 5999.00, 200, 1, 
'小米 14 Ultra 搭载骁龙 8 Gen3 处理器，性能出众。徕卡光学镜头，专业影像体验。120W 疾速快充，告别电量焦虑。', 
'https://example.com/images/mi14ultra.jpg', 189),

('OPPO Find X7 Pro', '天玑9300，哈苏影像，长续航', 6, 'OPPO', 5499.00, 180, 1, 
'OPPO Find X7 Pro 搭载天玑 9300 芯片，强劲性能。哈苏影像系统，色彩真实自然。5000mAh 大电池，超长续航。', 
'https://example.com/images/findx7.jpg', 145),

('vivo X100 Pro', '天玑9300，蔡司光学镜头，自研芯片V3', 6, 'vivo', 4999.00, 220, 1, 
'vivo X100 Pro 配备天玑 9300 处理器和自研芯片 V3，影像处理更强大。蔡司光学镜头，拍照更清晰。', 
'https://example.com/images/vivox100.jpg', 178);

-- 电脑办公分类商品 (category_id = 7)
INSERT INTO `product` (`name`, `subtitle`, `category_id`, `brand_name`, `price`, `stock`, `status`, `description`, `picture`, `sales`) VALUES
('MacBook Pro 16英寸', 'M3 Max芯片，36GB内存，性能怪兽', 7, 'Apple', 25999.00, 50, 1, 
'MacBook Pro 16英寸搭载 M3 Max 芯片，性能强劲。36GB 统一内存，多任务处理流畅。Liquid Retina XDR 显示屏，视觉体验出色。', 
'https://example.com/images/macbookpro.jpg', 86),

('联想ThinkPad X1 Carbon', '英特尔酷睿Ultra7，商务旗舰本', 7, '联想', 12999.00, 80, 1, 
'ThinkPad X1 Carbon 搭载英特尔酷睿 Ultra7 处理器，办公效率高。轻薄便携，商务人士首选。经典小红点，操作便捷。', 
'https://example.com/images/thinkpad.jpg', 124),

('戴尔XPS 15', '12代酷睿i7，4K OLED屏幕，创作利器', 7, '戴尔', 15999.00, 60, 1, 
'戴尔 XPS 15 配备第12代酷睿 i7 处理器，性能出众。4K OLED 屏幕，色彩鲜艳准确。适合设计师和创作者使用。', 
'https://example.com/images/xps15.jpg', 92),

('华硕ROG幻16', 'RTX 4070独显，240Hz高刷屏，游戏本', 7, '华硕', 13999.00, 70, 1, 
'ROG 幻16 搭载 RTX 4070 独立显卡，游戏性能强劲。240Hz 高刷新率屏幕，画面流畅。双风扇散热系统，稳定运行。', 
'https://example.com/images/rog.jpg', 158);

-- 男装分类商品 (category_id = 8)
INSERT INTO `product` (`name`, `subtitle`, `category_id`, `brand_name`, `price`, `stock`, `status`, `description`, `picture`, `sales`) VALUES
('优衣库 纯棉T恤', '100%纯棉，舒适透气，多色可选', 8, '优衣库', 99.00, 500, 1, 
'优衣库纯棉T恤，采用100%纯棉面料，舒适透气。经典版型，百搭时尚。多种颜色可选，适合日常穿着。', 
'https://example.com/images/uniqlo-tshirt.jpg', 1256),

('Nike 运动卫衣', 'Dri-FIT科技，吸湿排汗，运动必备', 8, 'Nike', 399.00, 300, 1, 
'Nike 运动卫衣采用 Dri-FIT 科技面料，吸湿排汗性能出色。宽松版型，运动自如。经典 Swoosh Logo，彰显品牌魅力。', 
'https://example.com/images/nike-hoodie.jpg', 567),

('Levi\'s 501经典牛仔裤', '经典直筒版型，耐磨耐穿', 8, 'Levi\'s', 599.00, 250, 1, 
'Levi\'s 501 是牛仔裤的经典之作，直筒版型，适合各种身材。优质丹宁面料，耐磨耐穿。经久不衰的设计，永不过时。', 
'https://example.com/images/levis501.jpg', 892),

('Adidas 运动裤', '三条纹设计，弹力面料，舒适自在', 8, 'Adidas', 299.00, 400, 1, 
'Adidas 运动裤采用弹力面料，穿着舒适。经典三条纹设计，运动时尚。束脚设计，版型修身。', 
'https://example.com/images/adidas-pants.jpg', 723);

-- 女装分类商品 (category_id = 9)
INSERT INTO `product` (`name`, `subtitle`, `category_id`, `brand_name`, `price`, `stock`, `status`, `description`, `picture`, `sales`) VALUES
('ZARA 连衣裙', '法式优雅，收腰显瘦，春夏新款', 9, 'ZARA', 299.00, 200, 1, 
'ZARA 连衣裙采用法式优雅设计，收腰版型显瘦修身。轻薄透气面料，适合春夏穿着。多种场合皆宜。', 
'https://example.com/images/zara-dress.jpg', 456),

('H&M 针织开衫', '柔软亲肤，百搭外套，四季适穿', 9, 'H&M', 199.00, 300, 1, 
'H&M 针织开衫采用柔软面料，亲肤舒适。宽松版型，百搭时尚。四季皆可穿着，是衣柜必备单品。', 
'https://example.com/images/hm-cardigan.jpg', 678),

('Uniqlo 羽绒服', '90%白鸭绒，轻盈保暖，防风防水', 9, '优衣库', 599.00, 150, 1, 
'优衣库女款轻型羽绒服，含绒量90%。轻盈保暖，不臃肿。防风防水面料，适合冬季穿着。', 
'https://example.com/images/uniqlo-down.jpg', 834),

('MO&Co 半身裙', 'A字版型，高腰设计，优雅知性', 9, 'MO&Co', 399.00, 180, 1, 
'MO&Co 半身裙采用 A 字版型，修饰腿型。高腰设计，拉长身材比例。优质面料，优雅知性。', 
'https://example.com/images/moco-skirt.jpg', 389);

-- 休闲零食分类商品 (category_id = 10)
INSERT INTO `product` (`name`, `subtitle`, `category_id`, `brand_name`, `price`, `stock`, `status`, `description`, `picture`, `sales`) VALUES
('三只松鼠 每日坚果', '混合坚果，营养健康，独立小包装', 10, '三只松鼠', 89.00, 800, 1, 
'三只松鼠每日坚果精选优质坚果，营养丰富。独立小包装，方便携带。每日一包，健康生活。', 
'https://example.com/images/squirrel-nuts.jpg', 2345),

('良品铺子 零食大礼包', '多种零食组合，满足各种口味', 10, '良品铺子', 199.00, 500, 1, 
'良品铺子零食大礼包包含多种热门零食，满足不同口味需求。精美包装，送礼自用两相宜。', 
'https://example.com/images/liangpin-gift.jpg', 1567),

('百草味 猪肉脯', '手撕猪肉脯，香甜可口，回味无穷', 10, '百草味', 39.00, 1000, 1, 
'百草味手撕猪肉脯精选优质猪肉，香甜可口。薄如纸张，入口即化。追剧必备零食。', 
'https://example.com/images/baicao-pork.jpg', 3456),

('乐事 薯片', '经典原味，酥脆可口，聚会必备', 10, '乐事', 12.00, 2000, 1, 
'乐事薯片采用优质土豆制作，酥脆可口。经典原味，百吃不厌。家庭聚会、朋友聚餐的必备零食。', 
'https://example.com/images/lays-chips.jpg', 5678),

('奥利奥 饼干', '夹心饼干，香甜可口，童年回忆', 10, '奥利奥', 15.00, 1500, 1, 
'奥利奥夹心饼干，香甜可口。经典黑白配色，满满童年回忆。可泡牛奶，可干吃，多种吃法。', 
'https://example.com/images/oreo.jpg', 4567);

-- 更新部分商品为下架状态（测试用）
UPDATE `product` SET `status` = 0 WHERE `id` IN (3, 7);

-- 更新除id为23之外的所有商品为审批完成状态
UPDATE `product` SET `approval_status` = 1 WHERE `id` != 23;

-- 查询统计
SELECT 
    c.name AS category_name,
    COUNT(p.id) AS product_count,
    SUM(p.stock) AS total_stock,
    SUM(p.sales) AS total_sales,
    AVG(p.price) AS avg_price
FROM category c
LEFT JOIN product p ON c.id = p.category_id
WHERE c.level = 2
GROUP BY c.id, c.name
ORDER BY total_sales DESC;

