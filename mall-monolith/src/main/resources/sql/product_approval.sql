-- 商品审批任务表
CREATE TABLE IF NOT EXISTS `product_approval_task` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `product_id` bigint(20) NOT NULL COMMENT '商品ID',
  `submitter_id` bigint(20) DEFAULT NULL COMMENT '提交人用户ID',
  `approver_id` bigint(20) DEFAULT NULL COMMENT '审批人用户ID',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '审批状态：0-待审批，1-已通过，2-已拒绝',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注/审批意见',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_approver_id` (`approver_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品审批任务';

-- 商品审批日志表
CREATE TABLE IF NOT EXISTS `product_approval_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `product_id` bigint(20) NOT NULL COMMENT '商品ID',
  `action` varchar(32) NOT NULL COMMENT '动作：submit/approve/reject',
  `operator_id` bigint(20) DEFAULT NULL COMMENT '操作人用户ID',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注/审批意见',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_action` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品审批日志';


