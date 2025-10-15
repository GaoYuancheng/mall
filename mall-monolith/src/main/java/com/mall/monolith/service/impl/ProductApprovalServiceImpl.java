package com.mall.monolith.service.impl;

import com.mall.monolith.mapper.ProductApprovalLogMapper;
import com.mall.monolith.mapper.ProductApprovalTaskMapper;
import com.mall.monolith.mapper.ProductMapper;
import com.mall.monolith.model.Product;
import com.mall.monolith.model.ProductApprovalLog;
import com.mall.monolith.model.ProductApprovalTask;
import com.mall.monolith.service.ProductApprovalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductApprovalServiceImpl implements ProductApprovalService {

    @Autowired
    private ProductApprovalTaskMapper taskMapper;
    @Autowired
    private ProductApprovalLogMapper logMapper;
    @Autowired
    private ProductMapper productMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long submitApproval(Long productId, Long submitterId, Long approverId, String remark) {
        Product product = productMapper.selectById(productId);
        if (product == null) {
            throw new IllegalArgumentException("商品不存在");
        }
        // 防重复：存在待审批任务则直接返回该任务ID
        ProductApprovalTask pending = getPendingTaskByProductId(productId);
        if (pending != null) {
            return pending.getId();
        }

        // 创建任务
        ProductApprovalTask task = new ProductApprovalTask();
        task.setProductId(productId);
        task.setSubmitterId(submitterId);
        task.setApproverId(approverId);
        task.setStatus(0); // 待审批
        task.setRemark(remark);
        task.setCreateTime(LocalDateTime.now());
        task.setUpdateTime(LocalDateTime.now());
        taskMapper.insert(task);

        // 写入日志
        ProductApprovalLog log = new ProductApprovalLog();
        log.setProductId(productId);
        log.setAction("submit");
        log.setOperatorId(submitterId);
        log.setRemark(remark);
        log.setCreateTime(LocalDateTime.now());
        logMapper.insert(log);

        // 更新商品审批状态为待审批
        Product update = new Product();
        update.setId(productId);
        update.setApprovalStatus(0);
        update.setUpdateTime(LocalDateTime.now());
        productMapper.updateById(update);

        return task.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void approve(Long taskId, Long approverId, String remark) {
        ProductApprovalTask task = taskMapper.selectById(taskId);
        if (task == null) {
            throw new IllegalArgumentException("审批任务不存在");
        }
        if (task.getStatus() != 0) {
            throw new IllegalStateException("审批任务已处理");
        }
        if (task.getApproverId() != null && !task.getApproverId().equals(approverId)) {
            throw new IllegalStateException("无权限处理该任务");
        }

        // 更新任务
        task.setStatus(1);
        task.setUpdateTime(LocalDateTime.now());
        taskMapper.updateById(task);

        // 写入日志
        ProductApprovalLog log = new ProductApprovalLog();
        log.setProductId(task.getProductId());
        log.setAction("approve");
        log.setOperatorId(approverId);
        log.setRemark(remark);
        log.setCreateTime(LocalDateTime.now());
        logMapper.insert(log);

        // 更新商品审批状态为已通过
        Product update = new Product();
        update.setId(task.getProductId());
        update.setApprovalStatus(1);
        update.setUpdateTime(LocalDateTime.now());
        productMapper.updateById(update);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void reject(Long taskId, Long approverId, String remark) {
        ProductApprovalTask task = taskMapper.selectById(taskId);
        if (task == null) {
            throw new IllegalArgumentException("审批任务不存在");
        }
        if (task.getStatus() != 0) {
            throw new IllegalStateException("审批任务已处理");
        }
        if (task.getApproverId() != null && !task.getApproverId().equals(approverId)) {
            throw new IllegalStateException("无权限处理该任务");
        }

        // 更新任务
        task.setStatus(2);
        task.setUpdateTime(LocalDateTime.now());
        taskMapper.updateById(task);

        // 写日志
        ProductApprovalLog log = new ProductApprovalLog();
        log.setProductId(task.getProductId());
        log.setAction("reject");
        log.setOperatorId(approverId);
        log.setRemark(remark);
        log.setCreateTime(LocalDateTime.now());
        logMapper.insert(log);

        // 更新商品为已拒绝
        Product update = new Product();
        update.setId(task.getProductId());
        update.setApprovalStatus(2);
        update.setUpdateTime(LocalDateTime.now());
        productMapper.updateById(update);
    }

    @Override
    public List<ProductApprovalLog> listLogs(Long productId) {
        return logMapper.selectList(new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<ProductApprovalLog>()
                .eq("product_id", productId)
                .orderByAsc("create_time"));
    }

    @Override
    public ProductApprovalTask getTask(Long taskId) {
        return taskMapper.selectById(taskId);
    }

    @Override
    public ProductApprovalTask getPendingTaskByProductId(Long productId) {
        return taskMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<ProductApprovalTask>()
                .eq("product_id", productId)
                .eq("status", 0));
    }
}


