-- 分类表
CREATE TABLE IF NOT EXISTS `category` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '分类ID',
    `name` varchar(100) NOT NULL COMMENT '分类名称',
    `parent_id` bigint(20) DEFAULT 0 COMMENT '父分类ID，0表示顶级分类',
    `level` int(1) DEFAULT 1 COMMENT '层级：1-一级分类，2-二级分类',
    `sort` int(11) DEFAULT 0 COMMENT '排序',
    `status` int(1) DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_parent_id` (`parent_id`),
    KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分类表';

-- 插入测试分类数据
INSERT INTO `category` (`name`, `parent_id`, `level`, `sort`, `status`) VALUES
('电子产品', 0, 1, 1, 1),
('服装鞋包', 0, 1, 2, 1),
('食品饮料', 0, 1, 3, 1),
('家居生活', 0, 1, 4, 1),
('运动户外', 0, 1, 5, 1),
('手机数码', 1, 2, 1, 1),
('电脑办公', 1, 2, 2, 1),
('男装', 2, 2, 1, 1),
('女装', 2, 2, 2, 1),
('休闲零食', 3, 2, 1, 1);

