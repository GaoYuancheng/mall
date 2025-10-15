package com.mall.monolith.controller;

import com.mall.common.api.CommonResult;
import com.mall.monolith.model.ProductApprovalLog;
import com.mall.monolith.model.ProductApprovalTask;
import com.mall.monolith.service.ProductApprovalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "商品审批", description = "商品审批流接口")
@RestController
@RequestMapping("/product/approval")
public class ProductApprovalController {

    @Autowired
    private ProductApprovalService approvalService;

    @Operation(summary = "提交商品审批")
    @PostMapping("/submit")
    public CommonResult<Long> submit(@RequestParam Long productId,
                                     @RequestParam(required = false) Long submitterId,
                                     @RequestParam(required = false) Long approverId,
                                     @RequestParam(required = false) String remark) {
        Long taskId = approvalService.submitApproval(productId, submitterId, approverId, remark);
        return CommonResult.success(taskId);
    }

    @Operation(summary = "审批通过")
    @PostMapping("/approve")
    public CommonResult<String> approve(@RequestParam Long taskId,
                                        @RequestParam(required = false) Long approverId,
                                        @RequestParam(required = false) String remark) {
        approvalService.approve(taskId, approverId, remark);
        return CommonResult.success("审批通过");
    }

    @Operation(summary = "审批拒绝")
    @PostMapping("/reject")
    public CommonResult<String> reject(@RequestParam Long taskId,
                                       @RequestParam(required = false) Long approverId,
                                       @RequestParam(required = false) String remark) {
        approvalService.reject(taskId, approverId, remark);
        return CommonResult.success("审批已拒绝");
    }

    @Operation(summary = "查看商品审批日志")
    @GetMapping("/logs/{productId}")
    public CommonResult<List<ProductApprovalLog>> logs(@PathVariable Long productId) {
        return CommonResult.success(approvalService.listLogs(productId));
    }

    @Operation(summary = "获取审批任务详情")
    @GetMapping("/task/{taskId}")
    public CommonResult<ProductApprovalTask> task(@PathVariable Long taskId) {
        return CommonResult.success(approvalService.getTask(taskId));
    }

    @Operation(summary = "根据商品ID获取待审批任务")
    @GetMapping("/pending/{productId}")
    public CommonResult<ProductApprovalTask> pending(@PathVariable Long productId) {
        return CommonResult.success(approvalService.getPendingTaskByProductId(productId));
    }
}


