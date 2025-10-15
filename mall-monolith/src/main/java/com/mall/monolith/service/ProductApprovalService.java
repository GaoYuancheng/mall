package com.mall.monolith.service;

import com.mall.monolith.model.ProductApprovalLog;
import com.mall.monolith.model.ProductApprovalTask;

import java.util.List;

public interface ProductApprovalService {
    Long submitApproval(Long productId, Long submitterId, Long approverId, String remark);
    void approve(Long taskId, Long approverId, String remark);
    void reject(Long taskId, Long approverId, String remark);
    List<ProductApprovalLog> listLogs(Long productId);
    ProductApprovalTask getTask(Long taskId);
    ProductApprovalTask getPendingTaskByProductId(Long productId);
}


